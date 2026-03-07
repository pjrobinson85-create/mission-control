#!/usr/bin/env python3
"""Delete memories by id, category, or age."""
import argparse, json, sqlite3
from datetime import datetime, timedelta

MEMORY_DIR = os.path.expanduser("~/.openclaw/workspace/memory")
DB_PATH = os.path.join(MEMORY_DIR, "vector-memory.db")

def forget(id=None, category=None, older_than_days=None):
    """Delete memories from database."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    if id:
        cur.execute("DELETE FROM memories WHERE id = ? RETURNING id, text", (id,))
    elif category:
        cur.execute("DELETE FROM memories WHERE category = ? RETURNING id, text", (category,))
    elif older_than_days:
        cutoff = (datetime.now() - timedelta(days=older_than_days)).isoformat()
        cur.execute("DELETE FROM memories WHERE created_at < ? RETURNING id, text", (cutoff,))
    else:
        print(json.dumps({"error": "provide --id, --category, or --older-than"}))
        return
    
    deleted = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    
    print(json.dumps({"deleted": len(deleted), "ids": [r[0] for r in deleted]}))

if __name__ == "__main__":
    import os
    p = argparse.ArgumentParser()
    p.add_argument("--id", type=int, default=None)
    p.add_argument("--category", default=None)
    p.add_argument("--older-than", type=int, default=None)
    args = p.parse_args()
    forget(args.id, args.category, args.older_than)
