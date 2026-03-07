#!/usr/bin/env python3
"""Flush daily memory files into SQLite vector database using Ollama embeddings."""
import argparse, glob, hashlib, json, os, re, sqlite3, sys, urllib.request
from datetime import datetime

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://192.168.1.174:11434")
EMBED_MODEL = "nomic-embed-text:latest"
WORKSPACE = os.path.expanduser("~/.openclaw/workspace")
MEMORY_DIR = os.path.join(WORKSPACE, "memory")
DB_PATH = os.path.join(MEMORY_DIR, "vector-memory.db")
FLUSH_TRACKER = os.path.join(MEMORY_DIR, "vector-flush-tracker.json")

def init_db():
    """Initialize SQLite database with vector extension."""
    conn = sqlite3.connect(DB_PATH)
    conn.enable_load_extension(True)
    try:
        conn.load_extension("vec0")
    except:
        pass  # sqlite-vec may not be available as extension in this build
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
    conn.execute("""
        CREATE INDEX IF NOT EXISTS memories_category_idx ON memories(category)
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
                embedding = result["embeddings"][0]
                return embedding
    except Exception as e:
        print(f"Error getting embedding: {e}", file=sys.stderr)
        return None
    return None

def embedding_to_bytes(embedding):
    """Convert embedding list to bytes."""
    import struct
    return struct.pack(f'{len(embedding)}f', *embedding)

def load_tracker():
    """Load flush tracker JSON."""
    if os.path.exists(FLUSH_TRACKER):
        with open(FLUSH_TRACKER) as f:
            return json.load(f)
    return {"flushed_files": {}}

def save_tracker(t):
    """Save flush tracker JSON."""
    with open(FLUSH_TRACKER, "w") as f:
        json.dump(t, f, indent=2)

def chunk_markdown(text, source_file):
    """Chunk markdown by sections (##, ###)."""
    chunks, current_section, current_text = [], "", []
    for line in text.split("\n"):
        if re.match(r'^#{1,3}\s', line):
            if current_text:
                content = "\n".join(current_text).strip()
                if len(content) > 20:
                    chunks.append({"text": content, "label": current_section.strip("# ").strip(), "source_file": source_file})
            current_section, current_text = line, [line]
        else:
            current_text.append(line)
    if current_text:
        content = "\n".join(current_text).strip()
        if len(content) > 20:
            chunks.append({"text": content, "label": current_section.strip("# ").strip(), "source_file": source_file})
    return chunks

def file_hash(fp):
    """Calculate MD5 hash of file."""
    with open(fp) as f:
        return hashlib.md5(f.read().encode()).hexdigest()

def flush(dry_run=False, force=False):
    """Flush memory files into vector database."""
    if not dry_run:
        init_db()
    
    tracker = load_tracker()
    conn = sqlite3.connect(DB_PATH) if not dry_run else None
    files = sorted(glob.glob(os.path.join(MEMORY_DIR, "*.md")))
    memory_md = os.path.join(WORKSPACE, "MEMORY.md")
    if os.path.exists(memory_md):
        files.append(memory_md)
    
    total_stored = 0
    for filepath in files:
        fname = os.path.basename(filepath)
        fhash = file_hash(filepath)
        if not force and fname in tracker["flushed_files"] and tracker["flushed_files"][fname] == fhash:
            continue
        
        with open(filepath) as f:
            content = f.read()
        chunks = chunk_markdown(content, fname)
        
        if dry_run:
            print(f"[DRY RUN] {fname}: {len(chunks)} chunks")
            continue
        
        cur = conn.cursor()
        cur.execute("DELETE FROM memories WHERE metadata LIKE ?", (f'%{fname}%',))
        
        for chunk in chunks:
            embedding = get_embedding(chunk["text"])
            if embedding is None:
                print(f"  ⚠️  Skipped chunk (embedding failed): {chunk['label'][:30]}...")
                continue
            
            embedding_bytes = embedding_to_bytes(embedding)
            metadata = json.dumps({"source_file": fname})
            cur.execute(
                "INSERT INTO memories (text, label, category, source, embedding, metadata) VALUES (?, ?, ?, ?, ?, ?)",
                (chunk["text"], chunk["label"], "daily-note", "flush", embedding_bytes, metadata)
            )
            total_stored += 1
        
        conn.commit()
        cur.close()
        tracker["flushed_files"][fname] = fhash
        print(f"[FLUSHED] {fname}: {len(chunks)} chunks → {total_stored} stored total")
    
    if conn:
        conn.close()
    save_tracker(tracker)
    print(json.dumps({"total_stored": total_stored, "files_processed": len(files)}))

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    flush(args.dry_run, args.force)
