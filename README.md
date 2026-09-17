# SahayAI

Demystifying complex legal documents with the power of AI. SahayAI transforms dense legal jargon into clear, actionable insights, empowering you to make informed decisions with confidence.

[![Watch Demo](https://img.shields.io/badge/Watch_Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/DHpzeMq-yb8) [![Try Live App](https://img.shields.io/badge/Try_Live_App-blue?style=for-the-badge)](https://sahayai-23401246568.europe-west1.run.app/)

## About The Project

Navigating legal documents can be an intimidating and confusing process for anyone without a law degree. The complex language, critical deadlines, and hidden obligations can lead to misunderstandings and costly mistakes.

SahayAI was built to solve this problem. It's an intelligent legal analysis tool that acts as your personal guide. Simply upload a document, and SahayAI instantly breaks it down, providing you with a clear summary, answers to your questions, and a personalized checklist of actions.

## Demo

**Watch the full walkthrough:** [SahayAI Demo Video](https://youtu.be/DHpzeMq-yb8)

**Try it yourself:** [Live Application](https://sahayai-23401246568.europe-west1.run.app/)

## Key Features

SahayAI offers a multi-faceted analysis through a clean, intuitive interface:

### Key Details
Instantly extracts the most critical information from your document—parties involved, key dates, notice periods, and important terms—and presents it in a simple, structured format.

### In-depth Analysis
Delivers plain-English summaries and clear explanations of key clauses, helping you understand the implications of each section without getting lost in jargon.

### Ask a Question
An interactive Q&A feature powered by the document's content. Get direct answers to your specific questions, with guided prompts to help you explore the text.

### Your Personalized Checklist
Generates a custom action plan based on the document's content, with categorized tasks and responsibilities so you know exactly what you need to do next.

## Technical Architecture

SahayAI is implemented as a document-grounded RAG agent: uploaded legal files are parsed, chunked, embedded, indexed, and then queried to generate answers with citations instead of relying on free-form LLM responses.

### Main Components

| Component | Purpose | Key Files |
|-----------|---------|-----------|
| **RAG Backend (Legal_Mcp)** | A FastAPI-powered agent that ingests documents, builds a retrieval index, and serves grounded Q&A over legal content. | `app.py`, `tasks.py`, `requirements.txt`, `DockerFile` |
| **Retrieval Layer** | Extracts text from PDFs/images, creates semantic chunks, generates embeddings, and stores/searches vectors for relevant evidence. | `tasks.py`, `rag.py` |
| **Frontend (sahayai)** | A modern Next.js (React) UI for document upload, analysis viewing, and conversational Q&A. | `src/app/**`, `src/components/**`, `next.config.ts`, `DockerFile` |
| **Infrastructure** | Docker Compose and Cloud Build orchestrate the frontend, backend, and supporting vector store services. | `docker-compose.yml`, `cloudbuild.yaml` |
| **Assets** | Sample legal notice images used for testing or UI illustration. | `Legal Documents/*` |

### Backend Highlights

- **FastAPI service** exposing three main endpoints:
  - `POST /process-document` – accepts a file and user role, validates the document, and runs the ingestion + RAG pipeline.
  - `POST /chat` – accepts a `document_id`, question, and role to retrieve evidence and generate a grounded answer.
  - `POST /internal/purge-expired` – removes expired document data and cached chunks.

- **Technology Stack:**
  - Google Cloud Vision for OCR
  - Google Generative AI for LLM interaction
  - LangChain for document processing
  - Qdrant for vector search and hybrid retrieval
  - PyMuPDF and Pillow for PDF/image handling
  - Containerised with Python 3.11+ and Gunicorn for production

### Frontend Highlights

- **Built with:**
  - Next.js 15 (standalone output mode)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - lucide-react icons

- **Features:**
  - Global state management via React context (`stateContext.tsx`)
  - API routes (`/api/process`, `/api/chat`) proxy requests to the FastAPI backend
  - Responsive design with modern UI components

## Getting Started

### Prerequisites

Ensure you have Docker and Docker Compose installed on your system:
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### Running Locally with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/HrushikeshAnandSarangi/SahayAI.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd SahayAI
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # .env example
   API_KEY="YOUR_API_KEY"
   ```

4. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   
   The application will be available at `http://localhost:3000`

### Cloud Deployment

A Google Cloud Build script (`cloudbuild.yaml`) is included to build and push both the frontend and backend images to Google Artifact Registry, preparing them for deployment on services like Cloud Run.

## Project Structure

```
.
├── Legal_Mcp/              # FastAPI RAG backend
│   ├── app.py
│   ├── tasks.py
│   ├── DockerFile
│   └── requirements.txt
├── sahayai/                # Next.js frontend
│   ├── src/app/            # Pages and API routes
│   ├── src/components/     # UI components
│   ├── src/context/        # Global state
│   ├── DockerFile
│   └── package.json
├── Legal Documents/        # Sample legal notice images
├── docker-compose.yml
├── cloudbuild.yaml
└── README.md
```

## Who It's For

SahayAI is designed for a wide range of users who need to navigate the complexities of legal language:

### Individuals & Consumers
Anyone dealing with personal contracts like rental agreements, employment offers, or terms of service who wants to understand their rights and obligations.

### Business Owners & Entrepreneurs
For quickly reviewing contracts, NDAs, partnership agreements, and other legal documents, especially when they don't have an in-house legal team.

### Legal Professionals
Paralegals, law clerks, and even lawyers can use it to get a quick first-pass analysis of documents, saving time and highlighting key areas for deeper review.

### Students & Researchers
A useful tool for law students or academics who need to analyze and summarize large volumes of legal text.

### Developers
Those looking for a practical, end-to-end example of a modern AI application combining a FastAPI RAG agent backend with a Next.js frontend, ready for containerized deployment.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please reach out through the GitHub repository issues.

---

**SahayAI** - Empowering everyone to understand legal documents with AI

## Retrieval-Augmented Generation (RAG)

SahayAI answers questions from an indexed, document-scoped evidence set rather than placing an entire legal document in an LLM prompt:

```
Upload → PDF/OCR extraction → semantic legal chunks → Gemini dense embeddings + BM25
       → Qdrant hybrid retrieval → cross-encoder reranking → Gemini answer + validated citations
```

- **Semantic chunks:** headings, numbered clauses, paragraphs, lists, and tables are preserved. Oversized sections are split only at paragraph or sentence boundaries.
- **Embedding model:** `gemini-embedding-2` at 1536 dimensions. It integrates with the existing Gemini deployment, supports multilingual legal text, and provides a practical quality/storage balance.
- **Hybrid retrieval:** Qdrant combines Gemini dense vectors with native BM25 sparse vectors using reciprocal-rank fusion, so both exact terms (names, dates, clause numbers) and paraphrases can be found.
- **Reranking:** a cross-encoder reranks the fused candidates before generation, limiting the answer prompt to the strongest evidence.
- **Grounded citations:** every answer citation contains page and section metadata plus an exact quote validated against the retrieved chunk. When evidence is insufficient, SahayAI abstains.

### Privacy and retention

Each upload receives an isolated `document_id`. Chunks are queryable only through that ID and are removed after 24 hours by the protected `POST /internal/purge-expired` cleanup endpoint. The browser stores the analysis result and document ID, not the extracted source text.

### RAG configuration

Add these variables to the backend environment:

```env
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=                 # required for managed Qdrant deployments
QDRANT_COLLECTION=legal_chunks
DOCUMENT_RETENTION_HOURS=24
CLEANUP_TOKEN=replace-with-a-secret
EMBEDDING_MODEL=gemini-embedding-2
EMBEDDING_DIMENSIONS=1536
CHAT_MODEL=gemini-2.5-flash-lite
```

Docker Compose now starts Qdrant automatically. In Cloud Run, deploy Qdrant separately (or use Qdrant Cloud) and invoke `/internal/purge-expired` hourly with `Authorization: Bearer $CLEANUP_TOKEN`.

### API changes

`POST /process-document` still accepts `file` and `user_role`, and now returns a `document_id` with the analysis. `POST /chat` accepts:

```json
{ "document_id": "uuid", "question": "What is the notice period?", "user_role": "plaintiff" }
```

It returns `answer`, `citations` (`chunk_id`, page, section, quote), and `insufficient_evidence`.

### Benchmarks

Retrieval quality (Recall@k, MRR, nDCG@k) split by question difficulty, chunking behavior, and latency — measured across 10 documents and 97 questions — are tracked in [benchmarks.md](benchmarks.md). Offline harness: `Legal_Mcp/benchmarks/run_benchmark.py` (no credentials needed). Live-pipeline harness against real Gemini/Qdrant: `Legal_Mcp/benchmarks/run_live_benchmark.py`.

### Continuous delivery

GitHub Actions runs backend tests, Python syntax checks, frontend lint/build, and Docker image builds on pull requests and `main`. The production deployment workflow builds with Cloud Build and deploys both Cloud Run services after a `main` push. Configure `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_DEPLOYER_SERVICE_ACCOUNT` as GitHub secrets, and set the `GCP_PROJECT_ID`, `GCP_REGION`, `ARTIFACT_REPOSITORY`, `BACKEND_SERVICE`, and `FRONTEND_SERVICE` repository variables.
