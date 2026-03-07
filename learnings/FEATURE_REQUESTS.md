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

### Task Status Auto-Sync from Telegram Messages
- **Description:** Parse incoming Telegram updates for task status keywords ("done", "completed", "✅", "in progress", "waiting for", etc.) and automatically update `tasks.json` status fields without manual file editing. Supports inline task updates like "✅ report-email-georgia" to mark specific task complete.
- **Benefit:** Eliminates repetitive manual task file updates, keeps task list in sync with real-world progress, enables natural language task management via chat, reduces friction for status changes
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-02
- **Automation trigger:** Integrated into main session message handler (runs on each incoming message containing task keywords)
- **Implementation:** Parse message text regex, match against task IDs in tasks.json, update status field, log change with timestamp
- **Example usage:** 
  - "Done with the Georgia email ✅" → marks `report-email-georgia` as `completed`
  - "working on NDIS now" → marks `ndis-gather-evidence` as `in-progress`
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Recurring Task Reminder Ramping
- **Description:** Extend medication/bowel reminders to a configurable multi-stage escalation system. Define reminder stages (gentle → check-in → firm → critical) with custom messages, delays between stages, and optional notifications. Apply same pattern to other recurring tasks (morning startup routine, email reviews, etc.).
- **Benefit:** Reduces notification spam while ensuring critical tasks aren't missed, customizable escalation patterns for different contexts, supports ADHD executive function needs (multiple activation attempts), one-time setup applies to all recurring tasks
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-02
- **Automation trigger:** Already partially implemented for meds (tasks.json shows ramping), expand to all recurring tasks with centralized config in `reminder-config.json`
- **Current pattern:** Med reminders at T+0 (gentle), T+15min (check), T+30min (firm)
- **Extensible to:** Bowel routine reminders, email checkin window, calendar alerts, task startup nudges
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Stress-Bowel Correlation Tracker
- **Description:** Log stress levels (1-10 scale) and bowel routine outcomes (success/accident/cancelled) to track correlation with medication timing changes. Generate weekly summary with pattern visualization and confidence intervals. Feeds into medical team notes for identifying optimal schedule.
- **Benefit:** Data-driven health management, supports hypothesis testing (earlier meds vs stress mitigation), provides medical team with concrete evidence for medication adjustments, enables personalized routine optimization
- **Effort:** Medium
- **Status:** proposed
- **Date:** 2026-03-02
- **Automation trigger:** Daily prompt at end of routine days (Mon/Thu) asking for stress rating, outcome, and notes. Auto-logs to `stress-tracking.json` with timestamps.
- **Data collected:** Date, day, stress_pre (before routine), stress_post (after), outcome (success/accident/cancelled), triggers_noted (list), medication_timing (actual time taken), external_factors (visitors, work, etc.)
- **Output:** Weekly health review in learnings/ with trend arrows, correlation strength, hypothesis updates
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Report-Writer Test Output Auto-Archiver
- **Description:** Cron job that scans report-writer `/test-output/` directory daily (1:00 AM) and archives reports older than 7 days to `archive/report-outputs/{YYYY-MM-DD}/`. Keeps live test outputs clean, maintains audit trail of generated reports (useful for quality review + reproducibility testing), auto-compresses old archives to gzip.
- **Benefit:** 
  - Prevents test-output folder bloat (hundreds of files accumulate quickly during testing)
  - Automatic audit trail for generated reports (supports compliance + learning from past outputs)
  - Enables trend analysis: compare outputs across time to validate improvements
  - Zero manual cleanup work
  - Safe archival: easy recovery if needed for regression testing
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-03
- **Automation trigger:** Daily cron (1:00 AM) via `archive-report-outputs.sh`
- **Implementation:**
  - Script finds `.docx` / `.pdf` files in `/test-output/` older than 7 days
  - Moves to `archive/report-outputs/{date}/{filename}`
  - Compresses archives every Sunday (keep 4 weeks uncompressed, archive rest to .tar.gz)
  - Logs operations to `logs/archive.log`
  - Alerts if archive fails (no deletion happens)
- **Current blocker:** Report-writer test outputs pile up during development cycles; no systematic cleanup
- **Integration point:** Pairs with Report-Writer Database Export (below) for complete audit trail
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

### Report-Writer + NDIS Document Consolidation Index
- **Description:** Master index file (`NDIS_DOCUMENTS.md`) that auto-tracks all files needed for NDIS review: generated reports (with timestamps + qwen3.5 reviewer scores), evidence docs (doctor/OT/EP/psych reports), email templates, decision logs. Updates daily via cron, shows missing docs in red, ready-to-send items in green. Supports quick "what do I still need?" without hunting through folders.
- **Benefit:**
  - Single source of truth for NDIS evidence gathering (eliminates "which reports do I have?" uncertainty)
  - Tracks evidence status (missing, draft, final, sent) with visual indicators
  - Automated checklist generation: shows what's complete vs what Paul still needs from providers
  - Reduces paralysis-by-uncertainty on the NDIS project (clear next steps always visible)
  - Supports email workflow: auto-identifies "ready to send" items for Paul to action
  - One-time setup, zero manual maintenance after that
- **Effort:** Low
- **Status:** proposed
- **Date:** 2026-03-03
- **Automation trigger:** Daily cron (1:30 AM) via `index-ndis-documents.py`
- **Implementation:**
  - Scans `/root/.openclaw/workspace/` for NDIS-related files (reports/, evidence/, emails/, docs/)
  - Indexes each file: name, type, date created, date modified, status (inferred from filename patterns or metadata)
  - Generates markdown report with status lights:
    - 🔴 Missing (not yet gathered)
    - 🟡 Draft (needs work)
    - 🟢 Ready (can send to Lynne)
    - 🔵 Sent (completed)
  - Auto-populates with known required docs:
    - Example: "Doctor's diagnostic letter — 🟡 Draft (dated 2026-02-20, needs update with functional impact)"
    - Example: "OT report — 🔴 Missing (awaiting request response from [provider name])"
  - Links to each file for quick access
  - Alerts section: highlights which provider responses Paul is still waiting for (enables reminder emails)
- **Current blocker:** Paul's uncertainty about NDIS status ("do I have all the reports? what am I missing?") is paralysis-inducing; system scatters evidence across folders with no checklist
- **Integration point:** Pairs with email workflow to support "send reminders to providers" + "track response status"
- **Paul decision prompt:** Accept this? (Reply: accept / reject)

---

**Usage:** Track all improvement ideas regardless of source. Review periodically and update status as decisions are made.
