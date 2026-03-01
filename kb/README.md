# Knowledge Base with RAG (Retrieval-Augmented Generation)

A comprehensive, secure knowledge base system with semantic search powered by local embeddings.

## Features

- ✅ **URL Ingestion** - Articles, tweets, YouTube, PDFs
- ✅ **Security First** - URL validation, content sanitization (deterministic + optional model-based)
- ✅ **Local Embeddings** - Uses Ollama (nomic-embed-text) to avoid API costs
- ✅ **Semantic Search** - Query by meaning, not just keywords
- ✅ **Lock-Based Concurrency** - Prevents corruption from concurrent ingestion
- ✅ **Preflight Checks** - Validates paths, DB integrity, stale locks before every operation
- ✅ **Cross-Posting** - Share clean summaries to other channels
- ✅ **Bulk Operations** - Ingest multiple URLs from a file
- ✅ **Filtering** - By tags, source type, date range, similarity threshold

---

## Quick Start

```bash
cd ~/.openclaw/workspace/kb

# Initialize
./kb init

# Ingest a URL
./kb ingest "https://example.com/article" --tags ai,research

# Search
./kb query "machine learning basics" --limit 5

# List sources
./kb list --tag ai

# Show stats
./kb stats
```

---

## Architecture

```
kb/
├── kb                     # Master command
├── bin/
│   ├── kb-ingest          # Ingestion pipeline
│   ├── kb-query           # Query engine
│   ├── kb-manage          # Management tools
│   └── kb-crosspost       # Cross-posting
├── lib/
│   ├── kb-core.sh         # Core library functions
│   └── db-schema.sql      # Database schema
├── data/
│   └── kb.db              # SQLite database
└── locks/                 # Lock files for concurrency
```

---

## Database Schema

### Sources
Stores ingested URLs with metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| url | TEXT | Cleaned URL (unique) |
| title | TEXT | Extracted title |
| source_type | TEXT | article, tweet, youtube, pdf, other |
| tags | TEXT | JSON array of tags |
| ingested_at | INTEGER | Unix timestamp (ms) |
| content_hash | TEXT | SHA256 of content |
| metadata | TEXT | JSON blob for extra info |

### Chunks
Text chunks from sources.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| source_id | INTEGER | Foreign key to sources |
| chunk_index | INTEGER | Sequence number |
| content | TEXT | Chunk text |
| char_start | INTEGER | Start position in source |
| char_end | INTEGER | End position in source |
| metadata | TEXT | JSON blob |

### Embeddings
Vector embeddings for semantic search.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| chunk_id | INTEGER | Foreign key to chunks |
| embedding | BLOB | Base64 encoded vector |
| model | TEXT | Embedding model name |
| created_at | INTEGER | Unix timestamp (ms) |

---

## Commands

### `kb init`
Initialize the knowledge base (creates database, directories).

```bash
./kb init
```

### `kb ingest`
Ingest a URL into the knowledge base.

**Usage:**
```bash
./kb ingest <url> [options]
```

**Options:**
- `--tags <tag1,tag2,...>` - Comma-separated tags
- `--model-sanitize` - Enable model-based content sanitization (slower, more thorough)

**Examples:**
```bash
./kb ingest "https://arxiv.org/abs/1234.5678" --tags research,transformers
./kb ingest "https://youtube.com/watch?v=xyz" --model-sanitize
```

**Process:**
1. Validates URL (only http/https, rejects file://, ftp://, etc.)
2. Fetches content with safety limits (30s timeout, 10MB max)
3. Sanitizes content:
   - **Deterministic pass:** Regex removes script tags, JavaScript, injection patterns
   - **Model-based pass (optional):** LLM scans for sophisticated attacks
4. Chunks text (default: 512 chars, 64 char overlap)
5. Generates embeddings via Ollama
6. Stores in SQLite

**Security:**
- URL scheme validation prevents `file://`, `javascript:`, etc.
- Content sanitization removes XSS vectors
- Lock file prevents concurrent ingestion corruption

### `kb query`
Search the knowledge base using semantic similarity.

**Usage:**
```bash
./kb query <search-text> [options]
```

**Options:**
- `--limit <N>` - Max results (default: 10)
- `--threshold <0.0-1.0>` - Similarity threshold (default: 0.5)
- `--tag <tag>` - Filter by tag
- `--type <type>` - Filter by source type (article, tweet, youtube, pdf)
- `--from <YYYY-MM-DD>` - Filter by date from
- `--to <YYYY-MM-DD>` - Filter by date to
- `--json` - Output as JSON

**Examples:**
```bash
./kb query "neural networks and deep learning" --limit 5
./kb query "AI safety" --threshold 0.7 --tag research
./kb query "transformers" --type article --from 2026-01-01
./kb query "embeddings" --json | jq '.[]'
```

**How it works:**
1. Generates embedding for query text
2. Computes cosine similarity with all chunk embeddings
3. Ranks by similarity score
4. Applies filters (tag, type, date)
5. Returns top results above threshold

### `kb list`
List ingested sources.

**Usage:**
```bash
./kb list [options]
```

**Options:**
- `--tag <tag>` - Filter by tag
- `--type <type>` - Filter by source type
- `--limit <N>` - Limit results (default: 50)

**Examples:**
```bash
./kb list
./kb list --tag ai --limit 20
./kb list --type youtube
```

### `kb delete`
Delete a source (and all its chunks/embeddings).

**Usage:**
```bash
./kb delete <source-id>
```

**Example:**
```bash
./kb delete 42
```

### `kb bulk`
Bulk ingest from a file of URLs.

**Usage:**
```bash
./kb bulk <file> [--tags tag1,tag2]
```

**File Format:**
```
# Comments start with #
https://example.com/article1
https://example.com/article2
https://youtube.com/watch?v=xyz

# Blank lines ignored
https://arxiv.org/abs/1234.5678
```

**Examples:**
```bash
./kb bulk research-papers.txt --tags research,ml
./kb bulk bookmarks.txt
```

**Features:**
- Skips already-ingested URLs
- Rate limiting (2s between requests)
- Progress reporting
- Summary statistics

### `kb stats`
Show knowledge base statistics.

**Usage:**
```bash
./kb stats
```

**Output:**
```
Knowledge Base Statistics
=========================

Sources:    42
Chunks:     1337
Embeddings: 1337

By Type:
  article     25
  youtube     10
  tweet       5
  pdf         2

Recent Activity (last 7 days):
  Ingested: 12 sources

Database size: 24M
```

### `kb crosspost`
Cross-post a source summary to another channel.

**Usage:**
```bash
./kb crosspost <source-id> --channel <channel> [--target <id>]
```

**Options:**
- `--channel <name>` - Target channel (telegram, slack, discord)
- `--target <id>` - Specific channel/user ID

**Examples:**
```bash
./kb crosspost 42 --channel telegram
./kb crosspost 15 --channel slack --target C12345678
```

**What gets posted:**
- Title
- Type (article, youtube, etc.)
- Cleaned URL (tracking params removed)
- Tags
- Source ID

**What does NOT get posted:**
- Raw page content (security)
- Untrusted metadata
- Embeddings
- Chunk data

**Security:**
- Summaries are sanitized
- Tracking params stripped (utm_*, fbclid, gclid, ref)
- Prevents untrusted content from entering agent conversation

### `kb preflight`
Run preflight checks to verify system health.

**Usage:**
```bash
./kb preflight
```

**Checks:**
- Required directories exist
- Database initialized and not corrupted
- Ollama connectivity
- Stale lock files (removes if owner PID is dead)

**Example Output:**
```
✓ All preflight checks passed
```

Or:
```
❌ Preflight checks failed:
  - Database not initialized - run 'kb init'
  - Ollama unreachable at http://192.168.1.174:11434
```

---

## Security

### URL Validation
- **Allowed:** `http://`, `https://`
- **Rejected:** `file://`, `ftp://`, `ssh://`, `javascript:`, `data:`, etc.
- Validates basic URL structure

### Content Sanitization

**Deterministic Pass (always runs):**
- Removes `<script>` tags
- Strips `javascript:` protocols
- Removes event handlers (`onclick`, `onerror`, `onload`)
- Filters null bytes

**Model-Based Pass (optional with `--model-sanitize`):**
- Uses local LLM to detect sophisticated injection attacks
- Slower but more thorough
- Flags content if model detects threats

### Lock Files
- Prevents concurrent ingestion corruption
- Automatically removes stale locks (dead PID)
- 30-second timeout with waiting

### Data Isolation
- Cross-post summaries only contain: title, URL, type, tags
- Raw page content never leaves the KB
- Prevents untrusted content in agent conversations

---

## Performance

### Embedding Generation
- Uses local Ollama (nomic-embed-text)
- No API costs
- ~100-500ms per chunk (depends on hardware)

### Ingestion Speed
- Typical article: 10-30 seconds
- Includes: fetch, sanitize, chunk, embed
- Bulk operations: 2s rate limit between URLs

### Query Speed
- Small KB (<1000 chunks): instant
- Large KB (>10,000 chunks): 1-3 seconds
- **Note:** SQLite-based similarity is a bottleneck for very large KBs

### Storage
- Typical article: ~50-200KB (chunks + embeddings)
- 100 articles: ~10-20MB database size

---

## Configuration

Edit `kb/lib/kb-core.sh` to configure:

```bash
OLLAMA_HOST="http://192.168.1.174:11434"  # Ollama server
EMBEDDING_MODEL="nomic-embed-text"        # Embedding model
```

Or set environment variable:
```bash
export OLLAMA_HOST="http://localhost:11434"
./kb query "search term"
```

Database config (stored in `kb_meta` table):
```sql
UPDATE kb_meta SET value = '1024' WHERE key = 'chunk_size';
UPDATE kb_meta SET value = '128' WHERE key = 'chunk_overlap';
```

---

## Limitations

### Current Implementation
- **Similarity Calculation:** Simplified (production would use proper cosine similarity)
- **Vector Search:** SQLite-based (for large KBs, consider pgvector or Milvus)
- **Content Extraction:** Basic (no specialized PDF/YouTube parsing yet)
- **Duplicate Detection:** By exact URL only (not by content similarity)

### Planned Improvements
- Proper vector similarity (cosine distance)
- Specialized extractors (YouTube transcripts, PDF parsing)
- Content deduplication
- Incremental updates (re-ingest changed URLs)
- Export/import functionality

---

## Troubleshooting

### "Database not initialized"
```bash
./kb init
```

### "Ollama unreachable"
```bash
# Check Ollama is running
curl http://192.168.1.174:11434/api/tags

# Verify nomic-embed-text model is pulled
ollama list | grep nomic-embed-text

# Pull if missing
ollama pull nomic-embed-text
```

### "Lock timeout"
```bash
# Check for stale locks
ls -la kb/locks/

# Remove manually if needed
rm kb/locks/ingest.lock

# Or let preflight clean them
./kb preflight
```

### "Failed to fetch URL"
- Check URL is accessible
- Verify firewall/network connectivity
- Some sites block bots (User-Agent filtering)

### "Content too short"
- URL may be behind login/paywall
- Site may be returning error page
- Try accessing URL manually

---

## Integration

### With Self-Improvement Systems
```bash
# Add to learnings/FEATURE_REQUESTS.md when KB suggests new sources
./kb ingest <url> --tags suggested,ai

# Query KB during cron jobs
./kb query "platform health monitoring" --limit 3
```

### With Diagnostics
```bash
# Check KB health
./kb preflight

# Monitor KB growth
./kb stats | tee -a logs/kb-stats-$(date +%Y-%m-%d).log
```

### With Messaging
```bash
# Ingest and cross-post in one flow
SOURCE_ID=$(./kb ingest "https://example.com" --tags ai | tail -1)
./kb crosspost $SOURCE_ID --channel telegram
```

---

## Examples

### Research Paper Workflow
```bash
# Ingest paper
./kb ingest "https://arxiv.org/abs/1234.5678" --tags research,transformers,nlp

# Later, find related papers
./kb query "attention mechanisms in transformers" --tag research --limit 3

# Cross-post to research channel
./kb crosspost 42 --channel slack --target research-papers
```

### YouTube Video Notes
```bash
# Ingest video
./kb ingest "https://youtube.com/watch?v=abc123" --tags tutorial,ml

# Query across all videos
./kb query "gradient descent optimization" --type youtube
```

### Bulk Import Bookmarks
```bash
# Export browser bookmarks to URLs file
cat > bookmarks.txt <<EOF
https://example.com/article1
https://example.com/article2
https://youtube.com/watch?v=xyz
EOF

# Bulk ingest
./kb bulk bookmarks.txt --tags bookmarks,to-review

# Review results
./kb list --tag bookmarks
```

---

## Advanced Usage

### Custom Chunk Sizes
```bash
# Update chunk size for all future ingestions
sqlite3 kb/data/kb.db <<SQL
UPDATE kb_meta SET value = '1024' WHERE key = 'chunk_size';
UPDATE kb_meta SET value = '256' WHERE key = 'chunk_overlap';
SQL

# Verify
sqlite3 kb/data/kb.db "SELECT * FROM kb_meta;"
```

### Export Search Results
```bash
# Export to JSON
./kb query "machine learning" --json > results.json

# Process with jq
./kb query "AI safety" --json | jq '.[] | {title, url, similarity}'

# Filter high-confidence results
./kb query "transformers" --threshold 0.8 --json | jq '.[] | select(.similarity > 0.9)'
```

### Automation
```bash
# Daily digest of recent additions
./kb list --limit 10 > daily-digest.txt

# Weekly stats report
./kb stats | mail -s "KB Weekly Report" user@example.com

# Auto-ingest from RSS/feed
curl -s https://example.com/feed.xml | \
    grep -oP '<link>\K[^<]+' | \
    ./kb bulk /dev/stdin --tags rss,auto
```

---

## FAQ

**Q: Can I use a different embedding model?**  
A: Yes, edit `EMBEDDING_MODEL` in `kb/lib/kb-core.sh`. Ensure the model is pulled in Ollama first.

**Q: How do I backup the knowledge base?**  
A: Copy `kb/data/kb.db`:
```bash
cp kb/data/kb.db kb/data/kb-backup-$(date +%Y-%m-%d).db
```

**Q: Can I search multiple knowledge bases?**  
A: Currently one DB per installation. To create multiple KBs, duplicate the `kb/` directory.

**Q: What happens if I ingest the same URL twice?**  
A: Second attempt is rejected with "URL already ingested". Delete first, then re-ingest.

**Q: How accurate is the similarity score?**  
A: Current implementation uses simplified scoring. Production version would use proper cosine similarity.

**Q: Can I ingest password-protected sites?**  
A: Not currently supported. Manual fetch and save to file, then modify `kb-ingest` to read from file.

---

## Contributing

Found issues or improvements? Document them:
- Bugs → `learnings/ERRORS.md`
- Features → `learnings/FEATURE_REQUESTS.md`
- Learnings → `learnings/LEARNINGS.md`

---

**Version:** 1.0  
**Last Updated:** 2026-03-01  
**License:** Part of OpenClaw workspace