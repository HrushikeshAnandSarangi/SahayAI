"""Document-scoped hybrid RAG utilities for SahayAI."""
import hashlib
import json
import os
import re
import uuid
from datetime import datetime, timedelta, timezone

from fastembed import SparseTextEmbedding, TextCrossEncoder
from google import genai
from google.genai import types
from qdrant_client import QdrantClient, models

COLLECTION = os.getenv("QDRANT_COLLECTION", "legal_chunks")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-2")
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "1536"))
RETENTION_HOURS = int(os.getenv("DOCUMENT_RETENTION_HOURS", "24"))
HEADING = re.compile(r"^(?:(?:section|clause|article)\s+)?(?:\d+(?:\.\d+)*|[A-Z])(?:[.):])?\s+.{2,}$", re.I)


def token_count(text):
    return len(re.findall(r"\S+", text))


def split_long_block(text, limit=800):
    """Split only at paragraph, then sentence boundaries."""
    if token_count(text) <= limit:
        return [text.strip()]
    result, current = [], ""
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    for paragraph in paragraphs:
        units = [paragraph] if token_count(paragraph) <= limit else re.split(r"(?<=[.!?])\s+", paragraph)
        for unit in units:
            if current and token_count(current + " " + unit) > limit:
                result.append(current.strip())
                current = unit
            else:
                current = (current + "\n\n" + unit).strip()
    if current:
        result.append(current)
    return result


def semantic_chunks(pages, filename):
    """Create page-aware chunks without splitting legal clauses or sentences."""
    chunks, ordinal = [], 0
    for page_number, page_text in enumerate(pages, start=1):
        section, block = "Untitled section", []

        def flush():
            nonlocal ordinal, block
            body = "\n".join(block).strip()
            if not body:
                return
            for part in split_long_block(body):
                ordinal += 1
                chunk_id = hashlib.sha256(f"{filename}:{page_number}:{ordinal}:{part}".encode()).hexdigest()[:24]
                chunks.append({"chunk_id": chunk_id, "text": part, "page_start": page_number,
                               "page_end": page_number, "section": section, "ordinal": ordinal})
            block = []

        for line in page_text.splitlines():
            candidate = line.strip()
            if candidate and HEADING.match(candidate) and len(candidate) < 180:
                flush()
                section = candidate
            else:
                block.append(line)
        flush()
    return chunks


class LegalRAG:
    def __init__(self):
        self.client = QdrantClient(url=os.getenv("QDRANT_URL", "http://localhost:6333"), api_key=os.getenv("QDRANT_API_KEY"))
        self.genai = genai.Client()
        self.sparse = SparseTextEmbedding(model_name="Qdrant/bm25")
        self.reranker = TextCrossEncoder(model_name="Xenova/ms-marco-MiniLM-L-6-v2")
        self.ensure_collection()

    def ensure_collection(self):
        if self.client.collection_exists(COLLECTION):
            return
        self.client.create_collection(
            collection_name=COLLECTION,
            vectors_config={"dense": models.VectorParams(size=EMBEDDING_DIMENSIONS, distance=models.Distance.COSINE)},
            sparse_vectors_config={"bm25": models.SparseVectorParams()},
        )
        self.client.create_payload_index(COLLECTION, "document_id", models.PayloadSchemaType.KEYWORD)
        self.client.create_payload_index(COLLECTION, "expires_at", models.PayloadSchemaType.DATETIME)

    def dense_embeddings(self, texts, task_type):
        response = self.genai.models.embed_content(
            model=EMBEDDING_MODEL, contents=texts,
            config=types.EmbedContentConfig(task_type=task_type, output_dimensionality=EMBEDDING_DIMENSIONS),
        )
        return [embedding.values for embedding in response.embeddings]

    @staticmethod
    def sparse_vector(vector):
        return models.SparseVector(indices=vector.indices.tolist(), values=vector.values.tolist())

    def index_pages(self, pages, filename):
        document_id = str(uuid.uuid4())
        expires_at = (datetime.now(timezone.utc) + timedelta(hours=RETENTION_HOURS)).isoformat()
        chunks = semantic_chunks(pages, filename)
        if not chunks:
            raise ValueError("No indexable text could be extracted from the document.")
        dense = self.dense_embeddings([chunk["text"] for chunk in chunks], "RETRIEVAL_DOCUMENT")
        sparse = list(self.sparse.embed([chunk["text"] for chunk in chunks]))
        points = []
        for chunk, dense_vector, sparse_vector in zip(chunks, dense, sparse):
            payload = {**chunk, "document_id": document_id, "filename": filename, "expires_at": expires_at}
            points.append(models.PointStruct(id=str(uuid.uuid4()), vector={"dense": dense_vector, "bm25": self.sparse_vector(sparse_vector)}, payload=payload))
        self.client.upsert(COLLECTION, points)
        return document_id

    def retrieve(self, document_id, question):
        dense = self.dense_embeddings([question], "RETRIEVAL_QUERY")[0]
        sparse = next(self.sparse.query_embed(question))
        document_filter = models.Filter(must=[models.FieldCondition(key="document_id", match=models.MatchValue(value=document_id))])
        response = self.client.query_points(
            collection_name=COLLECTION,
            prefetch=[
                models.Prefetch(query=dense, using="dense", limit=20, filter=document_filter),
                models.Prefetch(query=self.sparse_vector(sparse), using="bm25", limit=20, filter=document_filter),
            ], query=models.FusionQuery(fusion=models.Fusion.RRF), limit=12,
        )
        candidates = list(response.points)
        if not candidates:
            return []
        scores = list(self.reranker.rerank(question, [point.payload["text"] for point in candidates]))
        return [point for _, point in sorted(zip(scores, candidates), key=lambda pair: pair[0], reverse=True)[:5]]

    @staticmethod
    def no_evidence():
        return {"answer": "I could not find information about that in the provided document.", "citations": [], "insufficient_evidence": True}

    def answer(self, document_id, question, user_role):
        points = self.retrieve(document_id, question)
        if not points:
            return self.no_evidence()
        sources = [{"chunk_id": p.payload["chunk_id"], "page_start": p.payload["page_start"], "page_end": p.payload["page_end"], "section": p.payload["section"], "text": p.payload["text"]} for p in points]
        prompt = f"""You are SahayAI, a helpful legal-document assistant, not a lawyer. Answer only from SOURCES for the {user_role}. Return JSON only with answer, citations, insufficient_evidence. Each citation must use a supplied chunk_id and an exact short quote copied from that source. If evidence is insufficient, use the no-evidence answer.\n\nSOURCES:\n{json.dumps(sources)}\n\nQUESTION: {question}"""
        response = self.genai.models.generate_content(model=os.getenv("CHAT_MODEL", "gemini-2.5-flash-lite"), contents=prompt, config=types.GenerateContentConfig(response_mime_type="application/json"))
        try:
            result = json.loads(response.text)
        except (TypeError, json.JSONDecodeError):
            return self.no_evidence()
        source_by_id = {source["chunk_id"]: source for source in sources}
        citations = []
        for citation in result.get("citations", []):
            source = source_by_id.get(citation.get("chunk_id"))
            quote = citation.get("quote", "")
            if source and quote and quote in source["text"]:
                citations.append({"chunk_id": source["chunk_id"], "page_start": source["page_start"], "page_end": source["page_end"], "section": source["section"], "quote": quote})
        if not citations:
            return self.no_evidence()
        return {"answer": result.get("answer", ""), "citations": citations, "insufficient_evidence": False}

    def purge_expired(self):
        expiration = datetime.now(timezone.utc).isoformat()
        selector = models.FilterSelector(filter=models.Filter(must=[models.FieldCondition(key="expires_at", range=models.DatetimeRange(lt=expiration))]))
        self.client.delete(COLLECTION, selector)
