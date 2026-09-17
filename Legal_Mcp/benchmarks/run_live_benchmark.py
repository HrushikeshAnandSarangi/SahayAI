"""Live-pipeline benchmark: the real Gemini embeddings + Qdrant hybrid
retrieval + cross-encoder reranker + Gemini answer generation, exercised
through the actual ``LegalRAG`` class (no proxies).

This is the "second, honest number" that pairs with run_benchmark.py's
offline proxy results: run_benchmark.py validates the retrieval
*architecture* (chunking + fusion) without needing live infrastructure;
this script validates the *actual deployed models* against the same
labeled dataset, at the cost of requiring real credentials and a running
Qdrant instance.

It reports two things run_benchmark.py cannot:
  1. Retrieval quality (Recall@k, MRR, nDCG@k) using real Gemini dense
     embeddings, real Qdrant BM25, real RRF fusion, and the real
     cross-encoder reranker — instead of the TF-IDF/pure-Python proxies.
  2. Answer-level accuracy on ANSWER_ACCURACY_SUBSET: for each question,
     calls the real rag.answer() (Gemini generation) and checks whether
     the expected fact appears in the returned answer or in a cited
     quote, and whether every citation's quote is verifiably grounded
     in the source chunk (rag.answer() already enforces this before
     returning, so a "citations present" result is a stronger signal
     than the offline harness can provide on its own).

Prerequisites (see README.md "RAG configuration"):
  - pip install -r ../requirements.txt   (needs fastembed, qdrant-client,
    google-genai, sentence-transformers; these pull in torch/onnxruntime)
  - A reachable Qdrant instance: QDRANT_URL (+ QDRANT_API_KEY if managed)
  - Gemini credentials for google-genai (GOOGLE_API_KEY or ADC)
  - Optionally EMBEDDING_MODEL / EMBEDDING_DIMENSIONS / CHAT_MODEL if you
    want to override the defaults in rag.py

Run:
    cd Legal_Mcp/benchmarks
    python run_live_benchmark.py

Each run indexes fresh copies of the benchmark documents into your Qdrant
collection (real network/API calls; not free, not instant) and does not
delete them afterwards — the collection's real 24h TTL (or
POST /internal/purge-expired) is what cleans them up, matching production
behavior.
"""
import math
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dataset import DOCUMENTS, QA_PAIRS, ANSWER_ACCURACY_SUBSET  # noqa: E402

K_VALUES = (1, 3, 5)


def recall_at_k(chunk_ids, relevant_id, k):
    return 1.0 if relevant_id in chunk_ids[:k] else 0.0


def reciprocal_rank(chunk_ids, relevant_id):
    for position, cid in enumerate(chunk_ids, start=1):
        if cid == relevant_id:
            return 1.0 / position
    return 0.0


def ndcg_at_k(chunk_ids, relevant_id, k):
    for position, cid in enumerate(chunk_ids[:k], start=1):
        if cid == relevant_id:
            return 1.0 / math.log2(position + 1)
    return 0.0


def main():
    try:
        from rag import LegalRAG, semantic_chunks
    except ImportError as exc:
        print(f"Missing dependency: {exc}\nInstall with: pip install -r ../requirements.txt")
        return 1

    try:
        rag = LegalRAG()
    except Exception as exc:  # noqa: BLE001 - surface any connectivity/auth failure plainly
        print(f"Could not initialize LegalRAG (check QDRANT_URL/QDRANT_API_KEY and Gemini credentials): {exc}")
        return 1

    print("== Indexing benchmark documents into the live Qdrant collection ==")
    document_ids = {}
    for filename, pages in DOCUMENTS.items():
        start = time.perf_counter()
        document_ids[filename] = rag.index_pages(pages, filename)
        print(f"  {filename:24s} document_id={document_ids[filename]}  time={(time.perf_counter() - start)*1000:.0f}ms")

    # chunk_id -> section, to resolve which real chunk is "relevant" for each question
    section_to_chunk_id = {
        filename: {c["section"]: c["chunk_id"] for c in semantic_chunks(pages, filename)}
        for filename, pages in DOCUMENTS.items()
    }

    print("\n== Live retrieval (real Gemini embeddings + Qdrant hybrid + cross-encoder) ==")
    metrics = {"recall": {k: [] for k in K_VALUES}, "mrr": [], "ndcg5": [], "latency_ms": []}
    for qa in QA_PAIRS:
        document_id = document_ids[qa["document"]]
        relevant_id = section_to_chunk_id[qa["document"]][qa["section"]]

        start = time.perf_counter()
        points = rag.retrieve(document_id, qa["question"])
        latency = (time.perf_counter() - start) * 1000

        retrieved_ids = [p.payload["chunk_id"] for p in points]
        for k in K_VALUES:
            metrics["recall"][k].append(recall_at_k(retrieved_ids, relevant_id, k))
        metrics["mrr"].append(reciprocal_rank(retrieved_ids, relevant_id))
        metrics["ndcg5"].append(ndcg_at_k(retrieved_ids, relevant_id, 5))
        metrics["latency_ms"].append(latency)

    header = f"  {'':12s}" + "".join(f"recall@{k:<5d}" for k in K_VALUES) + f"{'mrr':>10s}{'ndcg@5':>10s}{'p50 ms':>10s}"
    print(header)
    row = f"  {'live':12s}"
    for k in K_VALUES:
        row += f"{sum(metrics['recall'][k]) / len(metrics['recall'][k]):9.2f}  "
    row += f"{sum(metrics['mrr']) / len(metrics['mrr']):10.2f}{sum(metrics['ndcg5']) / len(metrics['ndcg5']):10.2f}"
    latencies = sorted(metrics["latency_ms"])
    row += f"{latencies[len(latencies)//2]:10.1f}"
    print(row)
    print(f"  n_questions={len(QA_PAIRS)} across {len(DOCUMENTS)} documents")

    print("\n== Answer accuracy (real Gemini generation, curated subset) ==")
    correct, grounded = 0, 0
    for qa in ANSWER_ACCURACY_SUBSET:
        document_id = document_ids[qa["document"]]
        result = rag.answer(document_id, qa["question"], user_role="party to the agreement")
        haystack = result["answer"] + " " + " ".join(c["quote"] for c in result["citations"])
        is_correct = not result["insufficient_evidence"] and qa["expected_fact"].lower() in haystack.lower()
        is_grounded = not result["insufficient_evidence"] and len(result["citations"]) > 0
        correct += is_correct
        grounded += is_grounded
        status = "OK  " if is_correct else "MISS"
        print(f"  [{status}] {qa['document']:22s} {qa['question'][:55]:55s} expected='{qa['expected_fact']}'")

    n = len(ANSWER_ACCURACY_SUBSET)
    print(f"\n  answer_accuracy={correct}/{n} ({correct/n:.0%})   "
          f"cited_with_evidence={grounded}/{n} ({grounded/n:.0%})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
