# SahayAI Benchmarks

This document tracks measured performance of SahayAI's RAG pipeline: chunking behavior, offline retrieval quality (Recall@k, MRR, nDCG@k) split by question difficulty, and the live-pipeline / answer-accuracy harness that is ready to run once credentials are supplied.

Harness: [`Legal_Mcp/benchmarks/run_benchmark.py`](Legal_Mcp/benchmarks/run_benchmark.py) (offline, no credentials needed)
Live harness: [`Legal_Mcp/benchmarks/run_live_benchmark.py`](Legal_Mcp/benchmarks/run_live_benchmark.py) (real Gemini + Qdrant + cross-encoder — see [Live-pipeline validation](#live-pipeline-validation))
Dataset: [`Legal_Mcp/benchmarks/dataset.py`](Legal_Mcp/benchmarks/dataset.py)

```bash
cd Legal_Mcp/benchmarks
python run_benchmark.py
```

## Revision history

- **v2 (current):** scaled from 3 to 10 documents and from 16 to 97 questions, added a lexical-vs-paraphrase split, and fixed a real chunking bug the larger corpus surfaced. See [What changed from v1](#what-changed-from-v1-and-why) for the full account, including a result that came back *less* impressive than v1 and why that's the more trustworthy version.
- **v1:** 3 documents, 19 chunks, 16 questions, all near-perfect scores. Superseded because the corpus was too small to tell whether hybrid retrieval's advantage was real or just untested — see below.

## Why an offline harness

The production pipeline (`Legal_Mcp/rag.py`) depends on live Gemini embeddings, a running Qdrant instance, and a downloaded cross-encoder model — none of which are available without API keys and infrastructure. Requiring those for every benchmark run would make the numbers unreproducible outside a fully provisioned environment.

Instead, `run_benchmark.py` runs the **real, unmodified chunking code** (`semantic_chunks`, `split_long_block` from `rag.py`) and evaluates retrieval with dependency-free proxies that mirror the same algorithm shape used in production:

| Production component | Benchmark proxy | Why it's a fair stand-in | Where it's *not* equivalent |
|---|---|---|---|
| Gemini dense embeddings (`gemini-embedding-2`) | TF-IDF cosine similarity | Both score chunks by similarity to the query over the same text. | **TF-IDF is still lexical** (bag-of-words term weighting) — it has no notion of synonymy or paraphrase. Gemini's embeddings are trained to place paraphrases near each other in vector space; TF-IDF cannot. This is the harness's most important limitation — see [Reading the results](#reading-the-results). |
| Qdrant native BM25 sparse vectors | Custom BM25 (Okapi, k1=1.5, b=0.75) | Identical ranking algorithm, computed in-process instead of inside Qdrant. | None material — this proxy *is* the same algorithm. |
| Qdrant RRF fusion of dense + sparse prefetches | Reciprocal-rank fusion of the BM25 and TF-IDF rankings | Identical fusion formula (`1 / (k + rank)`, k=60) applied to two ranked lists. | Fusion quality is only as good as the diversity of its two inputs — see below. |
| Cross-encoder reranking (`Xenova/ms-marco-MiniLM-L-6-v2`) | Not simulated | Reranking only reorders an already-fused top-N; it doesn't change what counts as "relevant." | Out of scope for a retrieval-recall benchmark by design, not an oversight. |

## Dataset

10 synthetic but representative legal documents (lease, NDA, employment offer, loan agreement, freelance/service agreement, software license, partnership deed, severance agreement, property sale deed, terms of service), each with 7-10 denser clauses, and 97 hand-labeled questions where the correct answer is known to live in exactly one section.

Every question is tagged:
- **lexical** (63 questions) — reuses vocabulary from the target clause (e.g. "How much is the security deposit?" against a clause titled "SECURITY DEPOSIT"). Favorable to BM25.
- **paraphrase** (34 questions) — deliberately avoids the target clause's vocabulary, using a re-worded real-world scenario instead (e.g. "When do I get my upfront refundable payment back after I leave?" for the same clause). Favorable to genuine semantic matching, adversarial for pure lexical methods.

Several documents also reuse similar wording across multiple clauses on purpose (e.g. two different notice periods in the lease, two different termination triggers in the employment offer) so lexical overlap alone cannot fully disambiguate the correct section.

| Document | Chunks | Questions (lexical / paraphrase) |
|---|---|---|
| lease.pdf | 10 | 14 (8 / 6) |
| nda.pdf | 8 | 10 (6 / 4) |
| employment_offer.pdf | 8 | 10 (6 / 4) |
| loan_agreement.pdf | 8 | 10 (7 / 3) |
| service_agreement.pdf | 9 | 10 (7 / 3) |
| software_license.pdf | 9 | 10 (7 / 3) |
| partnership_deed.pdf | 8 | 9 (6 / 3) |
| severance_agreement.pdf | 8 | 7 (5 / 2) |
| sale_deed.pdf | 8 | 8 (6 / 2) |
| terms_of_service.pdf | 9 | 9 (5 / 4) |
| **Total** | **85** | **97 (63 / 34)** |

## Results

### Chunking

`semantic_chunks` run against all 10 documents:

| Metric | Value |
|---|---|
| Total chunks produced | 85 |
| Average chunk size | 33.0 tokens |
| Largest chunk | 58 tokens |
| Chunking time (10 documents) | 2.36 ms |

Every chunk retained its originating clause heading and page number, and no clause was split mid-sentence, consistent with `Legal_Mcp/test_rag.py`.

### Retrieval quality

Document-scoped retrieval (each question only searches its own document's chunks, matching the `document_id` filter used in production):

**Overall (97 questions):**

| Strategy | Recall@1 | Recall@3 | Recall@5 | MRR | nDCG@5 | Median latency |
|---|---|---|---|---|---|---|
| BM25 (sparse) | 0.75 | 0.88 | 0.95 | 0.83 | 0.85 | 0.073 ms |
| TF-IDF (lexical dense-proxy) | 0.70 | 0.86 | 0.94 | 0.80 | 0.83 | 0.021 ms |
| **Hybrid RRF (production strategy)** | **0.75** | **0.88** | **0.95** | **0.83** | **0.85** | 0.015 ms |

**Lexical questions only (63):**

| Strategy | Recall@1 | Recall@3 | Recall@5 | MRR | nDCG@5 |
|---|---|---|---|---|---|
| BM25 | 0.86 | 0.92 | 0.97 | 0.90 | 0.91 |
| TF-IDF | 0.79 | 0.90 | 0.97 | 0.87 | 0.89 |
| Hybrid RRF | 0.86 | 0.92 | 0.97 | 0.90 | 0.91 |

**Paraphrase questions only (34):**

| Strategy | Recall@1 | Recall@3 | Recall@5 | MRR | nDCG@5 |
|---|---|---|---|---|---|
| BM25 | 0.56 | 0.79 | 0.91 | 0.70 | 0.74 |
| TF-IDF | 0.53 | 0.76 | 0.88 | 0.67 | 0.71 |
| Hybrid RRF | 0.56 | 0.79 | 0.91 | 0.69 | 0.74 |

### Reading the results

Scaling the corpus did what it was supposed to do: it stopped being uniformly near-perfect. Every strategy drops sharply on paraphrase questions (Recall@1 falls from ~0.8 to ~0.55), which is exactly the discriminating signal the earlier 16-question/19-chunk version couldn't produce.

The finding worth stating precisely, including where it complicates the story: **at this corpus size, Hybrid RRF does not measurably beat BM25 alone** — on every slice above, hybrid either ties or is statistically indistinguishable from the stronger single signal. That is a *different and more honest* result than the earlier version implied, and it has a specific, identifiable cause rather than being a dead end:

TF-IDF is not a semantic method. It is still bag-of-words term weighting — it just weights terms differently than BM25 does. Neither has any representation of synonymy, so on paraphrase questions (which by construction share little to no vocabulary with the target clause), **both** signals degrade together instead of one compensating for the other's blind spot. Reciprocal-rank fusion can only add value when its two inputs are meaningfully diverse; fusing two lexical rankings mostly just re-confirms whichever one was already right. That's a property of *this offline proxy pairing*, not evidence that hybrid dense+sparse retrieval is ineffective in production — it's evidence that this harness cannot yet tell the difference, because it never gave the "dense" leg an actual semantic signal to contribute. Confirming or refuting hybrid RRF's real advantage requires the [live pipeline](#live-pipeline-validation) with actual Gemini embeddings, which are trained to place "upfront refundable payment" near "security deposit" in vector space — something no amount of TF-IDF re-weighting can do.

## What changed from v1 (and why)

The original 3-document, 16-question benchmark (19 total chunks) scored every strategy at or near 1.00 Recall@5. Rather than treat that as a finished result, this revision scaled the corpus specifically to find out whether that ceiling was real or an artifact of too small a test set with no way to distinguish the strategies. It was the latter: at 85 chunks and with paraphrase questions included, Recall@1 drops to the 0.53-0.86 range depending on strategy and question type, and the gap between strategies becomes visible for the first time.

Scaling also had a side effect worth recording on its own: it surfaced and led to a real fix in production code. The larger, denser clause text included a body sentence starting with the word "A" ("A missed or delayed instalment attracts a penalty..."). The chunker's heading-detection regex in `Legal_Mcp/rag.py` treated a bare capital letter followed by whitespace as a valid outline-style heading label (matching things like "A Introduction"), so this ordinary sentence was misidentified as a new clause heading, silently merging the real clause 4 ("LATE PAYMENT PENALTY") into clause 3's chunk and dropping its own heading metadata. The regex now requires a single-letter label to be followed by `.`, `)`, or `:` (so `"A. Introduction"` and `"A) Introduction"` still match, but `"A missed..."` does not) — see `HEADING` in [`Legal_Mcp/rag.py`](Legal_Mcp/rag.py) and the regression test in [`Legal_Mcp/test_rag.py`](Legal_Mcp/test_rag.py). This is the kind of bug a 19-chunk corpus is simply too small to ever produce.

## Limitations

- **The dense leg is still lexical.** As detailed above, TF-IDF cannot demonstrate hybrid retrieval's actual value proposition (bridging vocabulary gaps). The paraphrase-question numbers should be read as "how hard this test set is for lexical-only retrieval," not as "how hybrid RRF performs against paraphrase in production."
- **Synthetic corpus.** 10 documents and 97 questions are enough to produce discriminating signal and catch retrieval-design regressions, but they are hand-written, not sourced from real, messier legal documents (inconsistent formatting, OCR noise, non-standard clause numbering).
- **No end-to-end answer-quality metric yet measured.** `run_live_benchmark.py` (below) implements this — checking generated answers and citations against `ANSWER_ACCURACY_SUBSET` — but it requires live Gemini credentials that aren't available in the environment this benchmark was authored in, so those numbers are not yet in this document.
- **No OCR benchmark.** Text extraction quality from the sample images in `Legal Documents/` isn't measured here since it depends on Google Cloud Vision credentials.

## Live-pipeline validation

[`Legal_Mcp/benchmarks/run_live_benchmark.py`](Legal_Mcp/benchmarks/run_live_benchmark.py) is a complete, runnable script — not a sketch — that exercises the **real** `LegalRAG` class: actual Gemini embeddings, actual Qdrant hybrid search and RRF fusion, the actual cross-encoder reranker, and actual Gemini answer generation. It reports two things this offline benchmark cannot:

1. **Real retrieval metrics** (Recall@k, MRR, nDCG@k) using the production models instead of the TF-IDF/BM25 proxies — the direct answer to whether hybrid RRF's advantage is real once the dense leg is an actual embedding rather than a lexical stand-in.
2. **Answer accuracy** on `ANSWER_ACCURACY_SUBSET` (20 curated questions with an expected fact each, e.g. "30 days", "11%", "60:40") — for each, it calls the real `rag.answer()` and checks whether the expected fact appears in the generated answer or a cited quote, and whether every returned citation is grounded (verified by `rag.answer()`'s own quote-containment check before it returns).

**Status: written and ready, not yet executed.** Running it requires:

```bash
# Legal_Mcp/requirements.txt: fastembed, qdrant-client, google-genai,
# sentence-transformers (pulls in torch/onnxruntime; not installed in the
# environment this document was authored in)
pip install -r Legal_Mcp/requirements.txt

export QDRANT_URL=...          # a reachable Qdrant instance (local via
export QDRANT_API_KEY=...      # docker-compose, or Qdrant Cloud)
export GOOGLE_API_KEY=...      # Gemini credentials for google-genai

cd Legal_Mcp/benchmarks
python run_live_benchmark.py
```

This document will be updated with the resulting numbers once those credentials and infrastructure are available — that pairing (offline architecture validation + live production validation) is the intended final state of this benchmark, not the live run replacing the offline one.
