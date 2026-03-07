#!/usr/bin/env python3
"""Search memories by semantic similarity using Ollama embeddings."""
import argparse, json, os, sqlite3, sys, urllib.request
from datetime import datetime

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://192.168.1.174:11434")
EMBED_MODEL = "nomic-embed-text:latest"
MEMORY_DIR = os.path.expanduser("~/.openclaw/workspace/memory")
DB_PATH = os.path.join(MEMORY_DIR, "vector-memory.db")

def get_embedding(text):
    """Get embedding from local Ollama instance."""
    url = f"{OLLAMA_HOST}/api/embed"
    payload = json.dumps({"model": EMBED_MODEL, "input": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            if "embeddings" in result and len(result["embeddings"]) > 0:
                return result["embeddings"][0]
    except Exception as e:
        print(f"Error getting embedding: {e}", file=sys.stderr)
        return None
    return None

def embedding_to_bytes(embedding):
    """Convert embedding list to bytes."""
    import struct
    return struct.pack(f'{len(embedding)}f', *embedding)

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors."""
    import math
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    mag1 = math.sqrt(sum(a * a for a in vec1))
    mag2 = math.sqrt(sum(b * b for b in vec2))
    if mag1 == 0 or mag2 == 0:
        return 0
    return dot_product / (mag1 * mag2)

def bytes_to_embedding(b):
    """Convert bytes back to embedding list."""
    import struct
    return list(struct.unpack(f'{len(b)//4}f', b))

def search(query, limit=5, category=None, min_score=0.3):
    """Search memories by semantic similarity."""
    query_embedding = get_embedding(query)
    if query_embedding is None:
        print(json.dumps({"error": "Failed to get query embedding"}))
        return
    
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    sql = "SELECT id, text, label, category, source, created_at, embedding FROM memories"
    params = []
    if category:
        sql += " WHERE category = ?"
        params.append(category)
    
    cur.execute(sql, params)
    results = []
    
    for row in cur.fetchall():
        row_id, text, label, cat, source, created_at, embedding_bytes = row
        embedding = bytes_to_embedding(embedding_bytes)
        similarity = cosine_similarity(query_embedding, embedding)
        
        if similarity >= min_score:
            results.append({
                "id": row_id,
                "text": text[:200],
                "label": label,
                "category": cat,
                "source": source,
                "created_at": created_at,
                "similarity": round(similarity, 4)
            })
    
    results.sort(key=lambda x: x["similarity"], reverse=True)
    results = results[:limit]
    
    cur.close()
    conn.close()
    
    print(json.dumps({"query": query, "count": len(results), "results": results}, indent=2))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("query")
    p.add_argument("--limit", "-n", type=int, default=5)
    p.add_argument("--category", "-c", default=None)
    p.add_argument("--min-score", type=float, default=0.3)
    args = p.parse_args()
    search(args.query, args.limit, args.category, args.min_score)
