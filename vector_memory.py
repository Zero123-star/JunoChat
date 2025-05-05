import chromadb
from sentence_transformers import SentenceTransformer
import uuid

client = chromadb.Client()
collection = client.get_or_create_collection("chat_memory")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def store_message(character, user, message, response):
    text = f"User: {message}\nAssistant: {response}"
    emb = embedder.encode(text).tolist()
    doc_id = str(uuid.uuid4())
    collection.add(
        documents=[text],
        embeddings=[emb],
        metadatas=[{"character": character, "user": user}],
        ids=[doc_id]
    )

def retrieve_similar(character, user, query, top_k=3):
    emb = embedder.encode(query).tolist()
    results = collection.query(
        query_embeddings=[emb],
        n_results=top_k,
        where={"character": character, "user": user}
    )
    return results.get("documents", [[]])[0]
