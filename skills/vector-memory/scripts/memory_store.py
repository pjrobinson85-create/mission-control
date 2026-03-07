#!/usr/bin/env python3
"""Store a memory with vector embedding using Ollama."""
import argparse, json, os, sqlite3, sys, urllib.request
from datetime import datetime

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://192.168.1.174:11434")
EMBED_MODEL = "nomic-embed-text:latest"
MEMORY_DIR = os.path.expanduser("~/.openclaw/workspace/memory")
DB_PATH = os.path.join(MEMORY_DIR, "vector-memory.db")

def init_db():
    """Initialize database if needed."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            label TEXT,
            category TEXT,
            source TEXT,
            embedding BLOB,
            metadata TEXT DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

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

def store(text, label=None, category=None, source="conversation", metadata=None):
    """Store a memory with embedding."""
    init_db()
    
    embedding = get_embedding(text)
    if embedding is None:
        print(json.dumps({"error": "Failed to get embedding"}))
        return
    
    embedding_bytes = embedding_to_bytes(embedding)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO memories (text, label, category, source, embedding, metadata) VALUES (?, ?, ?, ?, ?, ?)",
        (text, label, category, source, embedding_bytes, json.dumps(metadata or {}))
    )
    conn.commit()
    row_id = cur.lastrowid
    cur.close()
    conn.close()
    
    print(json.dumps({
        "id": row_id,
        "created_at": datetime.now().isoformat(),
        "label": label,
        "category": category,
        "text": text[:100]
    }))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("text")
    p.add_argument("--label", "-l", default=None)
    p.add_argument("--category", "-c", default=None)
    p.add_argument("--source", "-s", default="conversation")
    p.add_argument("--meta", "-m", default=None)
    args = p.parse_args()
    store(args.text, args.label, args.category, args.source, json.loads(args.meta) if args.meta else None)
