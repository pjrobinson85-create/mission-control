-- Logging Infrastructure Database Schema

-- Structured event logs (from JSONL)
CREATE TABLE IF NOT EXISTS structured_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    event TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT,
    extra_fields TEXT, -- JSON blob
    source_file TEXT,  -- Which JSONL file this came from
    ingested_at INTEGER NOT NULL, -- Unix timestamp in ms
    UNIQUE(timestamp, event, message) ON CONFLICT IGNORE -- Deduplication
);

CREATE INDEX IF NOT EXISTS idx_structured_timestamp ON structured_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_structured_event ON structured_logs(event);
CREATE INDEX IF NOT EXISTS idx_structured_level ON structured_logs(level);
CREATE INDEX IF NOT EXISTS idx_structured_ingested ON structured_logs(ingested_at);

-- Raw server logs (from OpenClaw gateway logs)
CREATE TABLE IF NOT EXISTS server_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    level TEXT,
    message TEXT NOT NULL,
    raw_line TEXT,     -- Full original log line
    source_file TEXT,  -- Which log file this came from
    ingested_at INTEGER NOT NULL,
    UNIQUE(timestamp, message) ON CONFLICT IGNORE -- Deduplication
);

CREATE INDEX IF NOT EXISTS idx_server_timestamp ON server_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_server_level ON server_logs(level);
CREATE INDEX IF NOT EXISTS idx_server_ingested ON server_logs(ingested_at);

-- Ingestion tracking (prevent re-processing)
CREATE TABLE IF NOT EXISTS log_ingest_state (
    file_path TEXT PRIMARY KEY,
    last_ingested_at INTEGER NOT NULL,
    file_size INTEGER,
    line_count INTEGER,
    checksum TEXT
);

-- Rotation tracking
CREATE TABLE IF NOT EXISTS rotation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL,
    rotated_at INTEGER NOT NULL,
    archive_path TEXT,
    original_size INTEGER,
    compressed_size INTEGER
);

CREATE INDEX IF NOT EXISTS idx_rotation_rotated_at ON rotation_history(rotated_at);

-- Metadata
CREATE TABLE IF NOT EXISTS logs_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT OR IGNORE INTO logs_meta (key, value) VALUES 
    ('version', '1.0'),
    ('rotation_size_threshold_mb', '50'),
    ('rotation_keep_count', '3'),
    ('archive_retention_days', '90');
