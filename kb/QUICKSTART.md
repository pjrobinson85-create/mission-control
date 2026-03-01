# Knowledge Base - Quick Start

## 5-Minute Setup

```bash
cd ~/.openclaw/workspace/kb

# 1. Initialize
./kb init

# 2. Ingest a URL
./kb ingest "https://docs.openclaw.ai" --tags docs,openclaw

# 3. Search
./kb query "OpenClaw gateway configuration"

# Done!
```

---

## Common Workflows

### Research Paper Tracking
```bash
# Ingest
./kb ingest "https://arxiv.org/abs/1234.5678" --tags research,ai

# Search later
./kb query "transformer architecture" --tag research

# List all papers
./kb list --type article --tag research
```

### YouTube Learning
```bash
# Ingest tutorial
./kb ingest "https://youtube.com/watch?v=abc123" --tags tutorial,ml

# Find related content
./kb query "machine learning basics" --type youtube
```

### Bulk Import
```bash
# Create URL list
cat > urls.txt <<EOF
https://example.com/article1
https://example.com/article2
https://youtube.com/watch?v=xyz
EOF

# Import all
./kb bulk urls.txt --tags imported

# Check what's in there
./kb stats
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./kb init` | Initialize KB |
| `./kb ingest URL --tags T` | Add URL |
| `./kb query "text"` | Search |
| `./kb list` | Show all sources |
| `./kb delete ID` | Remove source |
| `./kb stats` | Show statistics |
| `./kb preflight` | Health check |

---

## Security Checklist

✅ Only use `http://` or `https://` URLs  
✅ Enable `--model-sanitize` for untrusted sources  
✅ Review `kb list` periodically to audit ingested content  
✅ Use tags to organize and filter sensitive sources  

---

## Troubleshooting

**Can't initialize:**
```bash
# Check permissions
ls -la kb/data/
mkdir -p kb/data kb/locks
```

**Can't fetch URLs:**
```bash
# Test Ollama connection
curl http://192.168.1.174:11434/api/tags

# Check embedding model
ollama list | grep nomic-embed-text
ollama pull nomic-embed-text
```

**Slow queries:**
```bash
# Check DB size
./kb stats

# Large KBs (>10k chunks) may need optimization
# Consider filtering by tag or type
```

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Set up automatic ingestion (cron job with URL feed)
- Integrate with self-improvement systems
- Cross-post interesting finds to other channels

---

**Quick help:** `./kb help`  
**Command help:** `./kb ingest --help`
