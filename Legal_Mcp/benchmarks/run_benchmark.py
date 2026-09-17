"""Offline benchmark harness for SahayAI's RAG pipeline.

Exercises the real chunking code in ``rag.py`` end to end, then evaluates
retrieval quality with standard IR metrics (Recall@k, MRR, nDCG@k) across
three retrieval strategies:

  * BM25        - sparse lexical retrieval (approximates the Qdrant BM25 leg)
  * TF-IDF      - cosine similarity over TF-IDF vectors (approximates the
                  Gemini dense-embedding leg without requiring API access)
  * Hybrid RRF  - reciprocal-rank fusion of BM25 + TF-IDF, the same fusion
                  strategy ``LegalRAG.retrieve`` uses to combine dense and
                  sparse Qdrant prefetches

Gemini embeddings, the Qdrant vector store, and the cross-encoder reranker
all need live credentials/models that aren't available in this sandbox, so
this harness swaps in dependency-free proxies that mirror the same
algorithm shape (lexical + semantic-ish signal, fused with RRF) so the
*retrieval design*, not a specific vendor's model, is what gets scored.
See benchmarks/BENCHMARKS.md for how to run the full pipeline once
QDRANT_URL / GOOGLE_API_KEY are configured.

Run:
    python benchmarks/run_benchmark.py
"""
import math
import re
import time
from collections import Counter

from dataset import DOCUMENTS, QA_PAIRS

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rag import semantic_chunks  # noqa: E402

K_VALUES = (1, 3, 5)
TOP_K = 5


def tokenize(text):
    return re.findall(r"[a-z0-9]+", text.lower())


# ---------------------------------------------------------------------------
# Retrieval strategies (dependency-free proxies for the production leg they
# stand in for; see module docstring)
# ---------------------------------------------------------------------------

class BM25:
    """Minimal BM25 (Okapi) implementation, k1=1.5, b=0.75."""

    def __init__(self, corpus_tokens, k1=1.5, b=0.75):
        self.k1, self.b = k1, b
        self.corpus = corpus_tokens
        self.n = len(corpus_tokens)
        self.avgdl = sum(len(d) for d in corpus_tokens) / max(self.n, 1)
        self.df = Counter()
        for doc in corpus_tokens:
            for term in set(doc):
                self.df[term] += 1
        self.idf = {term: math.log(1 + (self.n - freq + 0.5) / (freq + 0.5)) for term, freq in self.df.items()}

    def scores(self, query_tokens):
        results = []
        for doc in self.corpus:
            counts = Counter(doc)
            dl = len(doc)
            score = 0.0
            for term in query_tokens:
                if term not in counts:
                    continue
                freq = counts[term]
                idf = self.idf.get(term, 0.0)
                score += idf * (freq * (self.k1 + 1)) / (freq + self.k1 * (1 - self.b + self.b * dl / self.avgdl))
            results.append(score)
        return results


def tfidf_vectors(corpus_tokens):
    df = Counter()
    for doc in corpus_tokens:
        for term in set(doc):
            df[term] += 1
    n = len(corpus_tokens)
    idf = {term: math.log((1 + n) / (1 + freq)) + 1 for term, freq in df.items()}
    vectors = []
    for doc in corpus_tokens:
        tf = Counter(doc)
        vec = {term: (count / len(doc)) * idf[term] for term, count in tf.items()}
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        vectors.append({term: v / norm for term, v in vec.items()})
    return vectors, idf


def cosine(query_vec, doc_vec):
    return sum(w * doc_vec.get(term, 0.0) for term, w in query_vec.items())


def tfidf_query_vector(query_tokens, idf):
    tf = Counter(query_tokens)
    vec = {term: (count / len(query_tokens)) * idf[term] for term, count in tf.items() if term in idf}
    norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
    return {term: v / norm for term, v in vec.items()}


def rank(scores):
    """Return chunk indices sorted best-first."""
    return sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)


def rrf_fuse(rankings, k=60):
    fused = Counter()
    for ranking in rankings:
        for position, idx in enumerate(ranking):
            fused[idx] += 1.0 / (k + position + 1)
    return sorted(fused, key=fused.get, reverse=True)


# ---------------------------------------------------------------------------
# IR metrics
# ---------------------------------------------------------------------------

def recall_at_k(ranked_indices, relevant, k):
    return 1.0 if relevant in ranked_indices[:k] else 0.0


def reciprocal_rank(ranked_indices, relevant):
    for position, idx in enumerate(ranked_indices, start=1):
        if idx == relevant:
            return 1.0 / position
    return 0.0


def ndcg_at_k(ranked_indices, relevant, k):
    for position, idx in enumerate(ranked_indices[:k], start=1):
        if idx == relevant:
            return 1.0 / math.log2(position + 1)
    return 0.0


# ---------------------------------------------------------------------------
# Chunking benchmark
# ---------------------------------------------------------------------------

def benchmark_chunking():
    print("== Chunking ==")
    total_chunks, total_tokens, total_time = 0, 0, 0.0
    for filename, pages in DOCUMENTS.items():
        start = time.perf_counter()
        chunks = semantic_chunks(pages, filename)
        elapsed = time.perf_counter() - start
        total_time += elapsed
        sizes = [len(tokenize(c["text"])) for c in chunks]
        total_chunks += len(chunks)
        total_tokens += sum(sizes)
        print(f"  {filename:24s} chunks={len(chunks):2d}  avg_tokens={sum(sizes)/len(sizes):5.1f}  "
              f"max_tokens={max(sizes):3d}  time={elapsed*1000:.2f}ms")
    print(f"  {'TOTAL':24s} chunks={total_chunks:2d}  avg_tokens={total_tokens/total_chunks:5.1f}  "
          f"time={total_time*1000:.2f}ms")
    print()


# ---------------------------------------------------------------------------
# Retrieval benchmark
# ---------------------------------------------------------------------------

def benchmark_retrieval():
    print("== Retrieval (document-scoped, per-question) ==")
    strategies = ("bm25", "tfidf", "hybrid_rrf")
    metrics = {s: {"recall": {k: [] for k in K_VALUES}, "mrr": [], "ndcg5": [], "latency_ms": []} for s in strategies}

    # Pre-chunk every document once, matching production ingestion.
    chunks_by_doc = {name: semantic_chunks(pages, name) for name, pages in DOCUMENTS.items()}

    for qa in QA_PAIRS:
        doc_chunks = chunks_by_doc[qa["document"]]
        corpus_tokens = [tokenize(c["text"]) for c in doc_chunks]
        relevant = next(i for i, c in enumerate(doc_chunks) if c["section"] == qa["section"])
        query_tokens = tokenize(qa["question"])

        bm25 = BM25(corpus_tokens)
        tfidf_docs, idf = tfidf_vectors(corpus_tokens)
        query_vec = tfidf_query_vector(query_tokens, idf)

        start = time.perf_counter()
        bm25_ranking = rank(bm25.scores(query_tokens))
        metrics["bm25"]["latency_ms"].append((time.perf_counter() - start) * 1000)

        start = time.perf_counter()
        tfidf_ranking = rank([cosine(query_vec, doc) for doc in tfidf_docs])
        metrics["tfidf"]["latency_ms"].append((time.perf_counter() - start) * 1000)

        start = time.perf_counter()
        hybrid_ranking = rrf_fuse([bm25_ranking, tfidf_ranking])
        metrics["hybrid_rrf"]["latency_ms"].append((time.perf_counter() - start) * 1000)

        for name, ranking in (("bm25", bm25_ranking), ("tfidf", tfidf_ranking), ("hybrid_rrf", hybrid_ranking)):
            for k in K_VALUES:
                metrics[name]["recall"][k].append(recall_at_k(ranking, relevant, k))
            metrics[name]["mrr"].append(reciprocal_rank(ranking, relevant))
            metrics[name]["ndcg5"].append(ndcg_at_k(ranking, relevant, 5))

    header = f"  {'strategy':12s}" + "".join(f"recall@{k:<5d}" for k in K_VALUES) + f"{'mrr':>10s}{'ndcg@5':>10s}{'p50 ms':>10s}"
    print(header)
    for name in strategies:
        m = metrics[name]
        row = f"  {name:12s}"
        for k in K_VALUES:
            row += f"{sum(m['recall'][k]) / len(m['recall'][k]):9.2f}  "
        row += f"{sum(m['mrr']) / len(m['mrr']):10.2f}{sum(m['ndcg5']) / len(m['ndcg5']):10.2f}"
        latencies = sorted(m["latency_ms"])
        row += f"{latencies[len(latencies)//2]:10.4f}"
        print(row)
    print(f"\n  n_questions={len(QA_PAIRS)} across {len(DOCUMENTS)} documents, top_k={TOP_K}")
    print()
    return metrics


if __name__ == "__main__":
    benchmark_chunking()
    benchmark_retrieval()
