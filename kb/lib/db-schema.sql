-- Knowledge Base Schema

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    source_type TEXT NOT NULL, -- 'article', 'tweet', 'youtube', 'pdf', 'other'
    tags TEXT, -- JSON array
    ingested_at INTEGER NOT NULL, -- Unix timestamp in ms
    content_hash TEXT, -- SHA256 of raw content
    metadata TEXT -- JSON blob for extra info
);

CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_ingested ON sources(ingested_at);

CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    char_start INTEGER,
    char_end INTEGER,
    metadata TEXT, -- JSON blob
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chunks_source ON chunks(source_id);

CREATE TABLE IF NOT EXISTS embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chunk_id INTEGER NOT NULL,
    embedding BLOB NOT NULL, -- Serialized vector
    model TEXT NOT NULL, -- Embedding model used
    created_at INTEGER NOT NULL,
    FOREIGN KEY (chunk_id) REFERENCES chunks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_embeddings_chunk ON embeddings(chunk_id);

-- Metadata table for KB config
CREATE TABLE IF NOT EXISTS kb_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Insert default config
INSERT OR IGNORE INTO kb_meta (key, value) VALUES 
    ('version', '1.0'),
    ('embedding_model', 'nomic-embed-text'),
    ('chunk_size', '512'),
    ('chunk_overlap', '64');
