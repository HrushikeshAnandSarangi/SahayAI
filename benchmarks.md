# SahayAI Benchmarks

This document tracks measured performance of SahayAI's RAG pipeline: chunking behavior and retrieval quality (Recall@k, MRR, nDCG@k), plus latency.

Harness: [`Legal_Mcp/benchmarks/run_benchmark.py`](Legal_Mcp/benchmarks/run_benchmark.py)
Dataset: [`Legal_Mcp/benchmarks/dataset.py`](Legal_Mcp/benchmarks/dataset.py)

Reproduce locally:

```bash
cd Legal_Mcp/benchmarks
python run_benchmark.py
```

## Why an offline harness

The production pipeline (`Legal_Mcp/rag.py`) depends on live Gemini embeddings, a running Qdrant instance, and a downloaded cross-encoder model — none of which are available without API keys and infrastructure. Requiring those for every benchmark run would make the numbers unreproducible outside a fully provisioned environment.

Instead, the harness runs the **real, unmodified chunking code** (`semantic_chunks`, `split_long_block` from `rag.py`) and evaluates retrieval with dependency-free proxies that mirror the same algorithm shape used in production:

| Production component | Benchmark proxy | Why it's a fair stand-in |
|---|---|---|
| Gemini dense embeddings (`gemini-embedding-2`) | TF-IDF cosine similarity | Both are a semantic/statistical similarity signal over the same chunk text; TF-IDF needs no network calls or API keys. |
| Qdrant native BM25 sparse vectors | Custom BM25 (Okapi, k1=1.5, b=0.75) | Same ranking algorithm (BM25), just computed in-process instead of inside Qdrant. |
| Qdrant RRF fusion of dense + sparse prefetches | Reciprocal-rank fusion of the BM25 and TF-IDF rankings | Identical fusion formula (`1 / (k + rank)`, k=60) applied to two ranked lists. |
| Cross-encoder reranking (`Xenova/ms-marco-MiniLM-L-6-v2`) | Not simulated | Reranking only reorders an already-fused top-N; it doesn't change what counts as "relevant," so it's out of scope for a retrieval-recall benchmark. |

This measures whether the **retrieval design** (chunk boundaries, lexical matching, semantic matching, hybrid fusion) surfaces the right evidence — not the absolute quality of Gemini's embedding model specifically. See [Extending to the live pipeline](#extending-to-the-live-pipeline) below for running the same style of evaluation against the real Gemini/Qdrant/cross-encoder stack.

## Dataset

Three synthetic but representative legal documents (lease agreement, NDA, employment offer), each with 6-7 numbered clauses, and 16 hand-labeled questions where the correct answer is known to live in exactly one section. This isolates retrieval quality from OCR and LLM-answer quality, which depend on external services.

| Document | Chunks | Questions |
|---|---|---|
| lease.pdf | 7 | 6 |
| nda.pdf | 6 | 5 |
| employment_offer.pdf | 6 | 5 |
| **Total** | **19** | **16** |

## Results

### Chunking

`semantic_chunks` run against all three documents:

| Metric | Value |
|---|---|
| Total chunks produced | 19 |
| Average chunk size | 25.1 tokens |
| Largest chunk | 32 tokens |
| Chunking time (3 documents) | 1.22 ms |

Every chunk retained its originating clause heading and page number, and no clause was split mid-sentence (`split_long_block` only breaks at paragraph/sentence boundaries), consistent with `Legal_Mcp/test_rag.py`.

### Retrieval quality

Document-scoped retrieval (each question only searches its own document's chunks, matching the `document_id` filter used in production), evaluated over all 16 questions:

| Strategy | Recall@1 | Recall@3 | Recall@5 | MRR | nDCG@5 | Median latency |
|---|---|---|---|---|---|---|
| BM25 (sparse) | 0.75 | 0.94 | 1.00 | 0.84 | 0.88 | 0.080 ms |
| TF-IDF (dense proxy) | 0.75 | 0.88 | 1.00 | 0.83 | 0.87 | 0.023 ms |
| **Hybrid RRF (production strategy)** | **0.75** | **0.94** | **1.00** | **0.84** | **0.88** | 0.021 ms |

**Reading the results:** at this corpus size (19 chunks/document), both single-signal strategies already recover the correct chunk within the top 5 every time. Hybrid RRF matches the better of the two single strategies on every metric rather than being dragged down by the weaker one — that's the practical value of fusion: it doesn't need to know in advance whether a given question will be answered better by exact term matching (BM25) or semantic similarity (TF-IDF/embeddings), it takes the best of both. The gap between strategies would be expected to widen on longer, denser real-world documents where more chunks compete for the top-5 window.

## Limitations

- **Proxy signals, not the production models.** TF-IDF is not Gemini's embedding model, and results should not be read as "SahayAI achieves 100% recall@5 in production." They validate the retrieval *architecture* (chunking + hybrid fusion), not Gemini's or the cross-encoder's specific quality.
- **Small, synthetic corpus.** 3 documents and 16 questions are enough to catch retrieval-design regressions, not to estimate production-scale accuracy. Real legal documents are longer and noisier (OCR errors, inconsistent formatting).
- **No end-to-end answer-quality metric.** This benchmark stops at retrieval (did we find the right chunk); it does not score the generated answer, citation precision, or the abstain behavior (`insufficient_evidence`), which require live Gemini calls.
- **No OCR benchmark.** Text extraction quality from the sample images in `Legal Documents/` isn't measured here since it depends on Google Cloud Vision credentials.

## Extending to the live pipeline

With `QDRANT_URL`, `QDRANT_API_KEY`, and Gemini credentials configured (see the RAG configuration section in [README.md](README.md)), the same dataset can be run through the real `LegalRAG` class instead of the proxies:

```python
from rag import LegalRAG
from benchmarks.dataset import DOCUMENTS, QA_PAIRS

rag = LegalRAG()
for filename, pages in DOCUMENTS.items():
    document_id = rag.index_pages(pages, filename)
    # ... run QA_PAIRS questions scoped to that document_id through rag.retrieve(),
    # score with the same recall_at_k / reciprocal_rank / ndcg_at_k helpers in
    # run_benchmark.py, and additionally score rag.answer() citation accuracy.
```

This would add: actual Gemini embedding quality, actual cross-encoder reranking impact, Qdrant network latency, and end-to-end answer/citation correctness — at the cost of needing live infrastructure and no longer being reproducible offline in CI.
