# FEATURE_REQUESTS.md - Improvement Ideas

## Tracking Format
Each request should include:
- **Description:** What the feature does
- **Benefit:** Why it matters
- **Effort:** Estimated complexity (Low/Medium/High)
- **Status:** proposed | accepted | rejected | implemented
- **Date:** When proposed

---

## From Operations
_(Ideas that emerge from daily work)_

### Diagnostic Toolkit
- **Description:** System health checks, cron debugging, log viewer, model diagnostics with master CLI
- **Benefit:** Proactive issue detection, faster debugging, comprehensive system visibility
- **Effort:** Medium
- **Status:** implemented
- **Date:** 2026-03-01
- **Components:**
  - Health check with alert backoff
  - Cron query/failure detection/stale cleanup
  - Unified log viewer with filters
  - Model status/canary/usage tools
  - Master `diag` command

### RAG Knowledge Base
- **Description:** Secure knowledge management with semantic search, local embeddings, and cross-posting
- **Benefit:** Capture and retrieve information by meaning, not keywords; avoid API costs with local embeddings; secure URL validation and content sanitization
- **Effort:** High
- **Status:** implemented
- **Date:** 2026-03-01
- **Components:**
  - URL ingestion with security (scheme validation, content sanitization)
  - Local Ollama embeddings (nomic-embed-text)
  - SQLite storage (sources, chunks, embeddings)
  - Semantic query engine with filters
  - Lock-based concurrency control
  - Preflight health checks
  - Cross-posting to other channels
  - Bulk operations
  - Management CLI (list, delete, stats)
  - Master `kb` command with full documentation

### Logging Infrastructure
- **Description:** Structured event logging with JSONL storage, database ingestion, rotation, and viewing
- **Benefit:** Unified logging across all tools, automatic secret redaction, long-term queryable storage, automated rotation/cleanup
- **Effort:** High
- **Status:** implemented
- **Date:** 2026-03-01
- **Components:**
  - JSONL format (per-event + unified stream)
  - Auto secret redaction (passwords, tokens, keys)
  - Multi-language libraries (Bash, Python, Node.js)
  - Log viewer CLI with filters
  - Database ingestion with deduplication
  - Size-based rotation with compression
  - Configurable retention policies
  - Real-time tail support
  - Master `log` command with docs
  - Cron-ready automation (ingest + rotate)

### Unified LLM Router
- **Description:** Multi-provider LLM routing layer with OAuth authentication and comprehensive logging
- **Benefit:** Single API for all LLM providers, OAuth security (no static keys), automatic cost tracking, centralized logging
- **Effort:** High
- **Status:** implemented
- **Date:** 2026-03-01
- **Components:**
  - Model utilities (aliases, normalization, provider detection)
  - Interaction store (SQLite logging with cost estimation)
  - Anthropic SDK wrapper (OAuth authentication, smoke tests)
  - Unified router (single entry point for all providers)
  - OpenAI integration
  - Ollama integration
  - Secret redaction
  - Timeout handling
  - Error tracking
  - Statistics queries
  - Comprehensive docs (README, SETUP, examples)

## From User Feedback
_(Features Paul has requested or suggested)_

### Self-Improvement Systems
- **Description:** Learnings directory, automated review councils, tiered testing, error reporting
- **Benefit:** Continuous improvement, proactive issue detection, systematic learning capture
- **Effort:** Medium
- **Status:** implemented
- **Date:** 2026-02-28

## Innovation Scout Discoveries
_(Automation opportunities found by review councils - will populate once councils are running)_

### Memory Maintenance Automation
- **Description:** Automated daily job that reviews `memory/YYYY-MM-DD.md` files, identifies significant events/lessons, and prompts assistant to update `MEMORY.md` with curated learnings. Prevents memory file staleness and ensures long-term insights are captured.
- **Benefit:** Eliminates manual memory reviews, ensures continuity across sessions, captures lessons while fresh, reduces cognitive load on main session
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-01
- **Automation trigger:** Daily cron job (11 PM) or integrated into existing heartbeat system
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Report-Writer Database Export Pipeline
- **Description:** Automated nightly export of report-writer SQLite database (generations, edits, feedback) to JSON/CSV archives with timestamp. Enables external reporting, backup verification, and trend analysis without manual data extraction.
- **Benefit:** Automatic data preservation, enables BI tools to track generation trends, supports compliance/audit trails, frees up manual export work
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-01
- **Automation trigger:** Daily cron job (11:30 PM) after system quiet hours
- **Dependencies:** Report-writer database path, export format preference
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Health Check + Logs Integration
- **Description:** Extend health-check.sh to automatically ingest its findings into the structured logging system (via `log` command) and create daily health summary report in logs/health/. Cross-reference with platform health reviews for trend analysis.
- **Benefit:** Structured searchable health history, reduced manual log parsing, early detection of degradation patterns, unified observability
- **Effort:** Medium
- **Status:** proposed
- **Date:** 2026-03-01
- **Automation trigger:** Integrate into existing health-check cron job
- **Current health-check runs:** Daily 1 AM (implicit from innovation scout schedule)
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

---

**Usage:** Track all improvement ideas regardless of source. Review periodically and update status as decisions are made.
