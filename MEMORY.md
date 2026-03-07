# MEMORY.md - Long-Term Memory
*Last updated: 2026-03-07 (19:29)*

---

## Workspace Structure (March 7, 2026 - 19:29)
**Major reorganization:** 130+ files moved from cluttered root to clean hierarchy

**Root (essential files only):**
- Core: AGENTS.md, SOUL.md, USER.md, IDENTITY.md, TOOLS.md, MEMORY.md, HEARTBEAT.md
- Onboarding: ONBOARDING.md, ONBOARDING_IMPROVEMENT_PROPOSAL.md
- Docs: README.md, GITHUB_README.md

**Folder structure:**
- **data/** — JSON state files, voice-tasks.md
- **docs/** — Reference docs + setup/ + archive/
- **projects/** — gcode-modifier/, report-writer/, job-applications/, mission-control/, health/
- **scripts/** — All helper scripts (.sh, .py, .js, .cjs)
- **skills/** — OpenClaw skills
- **memory/** — Daily logs (YYYY-MM-DD.md)
- **reports/**, **research/**, **resume/**, **learnings/**, **kb/** — Organized content

**Key locations:**
- Voice tasks: `data/voice-tasks.md`
- Voice script: `scripts/voice-task-capture.sh`
- Mission control: `projects/mission-control/`
- Setup guides: `docs/setup/`
- Old/debug files: `docs/archive/`

---

## Skills & Infrastructure (March 7, 2026)
- ✅ **GOG Skill** — Installed and ready
- ✅ **SearXNG** — Docker running + skill installed (Brave still default search)
- ✅ **Whisper** — Local transcription setup complete (voice-task-capture.sh)
- ✅ **AgentMail** — Configured, inbox: paul-meds@agentmail.to
- ✅ **Gmail OAuth** — Deprecated (scope invalid), use AgentMail instead
- ✅ **Google Calendar** — Working (chris.cole + pjrobinson85 read access)

---

## Onboarding Complete (March 7, 2026)

**Paul's Profile:**
- **Medical:** Quadriplegic, ADHD, fatigue-primary (not pain)
- **Medication:** 9 AM, 6:30 PM, Senakot Sun/Wed
- **Bowel routine:** Mon & Thu mornings (Peristeen)
- **Support worker:** Mon-Sat 6:30 AM (not Sunday)
- **Thermoregulation:** 29°C max / 75% humidity max (health risk)

**ADHD Support:**
- Task initiation struggles, hyperfocus mode, working memory issues
- Decision paralysis from uncertainty, too many options
- Fuel: Easy wins for dopamine + big challenges after good sleep
- Break reminders: Track duration, remind at natural pause (not interrupts)

**Work Style:**
- Give 3 options, I set priority (top = my recommendation)
- Direct communication (no sugar-coating, correct when needed)
- Minimal emojis, fewer notifications (bigger check-ins)
- Health tracking (sleep + stress): Natural conversation flow

**Stress Triggers:**
- Uncertainty / unclear next steps
- Too many options
- Decision paralysis
- Housemates (distraction)

---

## Current Projects (March 7, 2026)

### 1. NDIS Review (ASAP, blocked on clarity)
- Email Lynne: timeline + permission form
- Gather evidence: doctor, OT, EP, psychologist reports
- Status: Blocked on uncertainty

### 2. Report Writer (85% done, ready for testing)
- Email Georgia Carter: latest test output
- Test with qwen3.5:35b reviewer
- Connect GitHub integration
- Status: Final polish + testing setup

### 3. Remote Testing Access (high priority, blocks launch)
- Find easiest way for remote user testing
- Blocks report writer launch

### 4. Gcode Modifier (research phase, lower priority)
- Remove Fusion 360 hobby restrictions (G00, M06)
- Location: `projects/gcode-modifier/`
- Research complete (7K words in RESEARCH.md)
- Status: Architecture phase

**3-Month Goal:** NDIS + Report Writer + Jeetrike mods → then business ideas

---

## Key Reports Delivered (March 7, 2026)

**Sent to probinson85@live.com.au:**
1. **Exercise Physiology Marketing Strategy** (13,500+ words)
   - Market analysis, 3-phase SEO, geo-targeting, social media, AI agent feasibility
   - Location: `reports/MARKETING_REPORT_FINAL.md`

2. **Making Strides Competitive Audit & Optimization** (15,000+ words)
   - Current state audit, 8 initiatives ranked by cost/difficulty, 6-month roadmap, financials
   - Location: `reports/MAKING_STRIDES_OPTIMIZATION_REPORT.md`

3. **Reports Summary** (quick reference)
   - Location: `reports/REPORTS_SUMMARY.txt`
   - Key numbers, side-by-side comparison, next steps, financial projections

**Key Research Findings:**
- Market opportunity: Gold Coast dominance in 3–4 months, national in 12–18 months
- Making Strides weakness: 50% content gap, zero geo-targeting, no video/LinkedIn
- Competitive advantage: 20–30 pages vs. their ~10; 1,500–2,500 words vs. their 650–800
- Financial impact: Year 1 revenue potential = $120K–1.2M (conservative estimate)

---

## Email System (March 6-7, 2026)

**AgentMail is PRIMARY and TESTED:**
- ✅ Script: `/root/.openclaw/workspace/skills/agentMail/scripts/send_email.py`
- ✅ Inbox: paul-meds@agentmail.to
- ✅ Confirmed recipients: probinson85@live.com.au, paulrobinson85@outlook.com.au
- ✅ Both reports sent successfully via AgentMail

**Gmail OAuth deprecated:**
- 🔴 Scope invalid, do NOT use for new sends
- Calendar continues to use Google Calendar helper module (no changes)

---

## Agent Infrastructure Fixes (March 6, 2026)

**Permissions & Config:**
1. ✅ Web search permissions — All agents (coder, writer, scout, analyst, researcher, medical) now have web_search + web_fetch
2. ✅ Model fallback bug — Updated subagent defaults from qwen2.5:14b to qwen3.5:35b
3. ✅ Researcher browser access — Added browser tool permission
4. ✅ Agent browser skill — Verified Vercel's agent-browser v0.16.3 installed (Chromium ready)
5. ✅ AgentMail setup — API key configured, skill installed, env var set

**Skills Status:**
- **agent-browser:** ✅ Installed at `skills/agent-browser/`, v0.16.3, Chromium loaded
- **agentMail:** ✅ Installed, API key configured, inbox created
- **gmail-calendar:** ✅ Installed, Calendar working

**Model Testing Summary (qwen3.5:4b):**
- Core tasks: 8.4/10 average (speed, analysis, code, reasoning)
- Tool-calling: Excellent logic & planning (8/10 average)
- Constraint handling: Strong (format compliance, word limits)
- **Blocker:** Subagent framework can't invoke tools despite permissions (OpenClaw bug)

---

## Mission Control Dashboard (March 1, 2026)

**Status:** Complete & deployed with Node.js backend server

**Location:** `projects/mission-control/mission-control.html`

**Tabs:**
0. Dashboard — Command center (metrics, activity feed, priorities)
1. Projects — Kanban board (Backlog, In Progress, Done)
2. Timeline — Roadmap to 30/12/2026 (3 phases, Phase 2 current)
3. Revenue — Business metrics (goal gauge, MRR, 6-month chart, client list)
4. Command Center — AI agent management & executive decisions
5. Meetings — Full scheduling (today's meetings, countdowns, agenda, notes, action items)
6. Intel — News & intelligence tracking (daily brief, category filters, importance badges)

**Design:** Dark glassmorphism (#050508 bg, cyan #00D9FF accent)

**Server:** `scripts/server.cjs` (Node.js, port 8899)
- Real-time sync to localStorage + server backup
- Weather integration (wttr.in)
- Activity logging (last 500 entries)
- Auto-reconnect when offline

---

## SearXNG Metasearch Engine (March 2, 2026)

**Status:** ✅ Running locally via Docker Compose

**Purpose:** Local metasearch to eliminate Brave Search API rate limits and costs

**Services:**
- SearXNG: http://localhost:8888 (metasearch UI + API)
- Redis: localhost:6379 (cache backend)

**Supported Engines:** Google, DuckDuckGo, Bing, Wikipedia, GitHub

**Integration:**
- Scout agent can use SearXNGClient (`scripts/searxng_client.py`)
- No API keys required, no rate limits, full privacy

**Management:**
```bash
cd /root/.openclaw/searxng
docker compose up -d       # Start
docker compose down         # Stop
docker compose logs searxng # View logs
```

---

## Memory System Architecture

**Current (as of March 7):**
- **Daily notes:** `memory/YYYY-MM-DD.md` — Raw session logs, written automatically, load on-demand
- **MEMORY.md:** Curated long-term brain — Load every heartbeat (~3K tokens)
- **projects.md:** Compact project registry — Load every heartbeat (~1K tokens)
- **Vector DB:** PostgreSQL + pgvector, semantic search via AI embeddings (planned)

**Smart loading strategy:**
- Only `projects.md` + `MEMORY.md` at startup
- Daily notes + vector search = on-demand only
- Saves ~80% token cost vs loading everything

---

## OpenClaw Setup

**Environment:**
- **Host:** debian-openclaw (Proxmox VM)
- **Ollama:** 192.168.1.174:11434
- **Models:** qwen3.5:35b (primary), qwen2.5:14b, llama3.2:3b
- **Cloud backup:** Claude Haiku for subagents
- **Telegram:** Primary communication (group: Openclaw)

**Hardware:**
- Proxmox VM: 2x RTX 3060 + 64GB RAM
- Local models for privacy

---

## Lessons Learned

### March 7, 2026 - Workspace Organization
- 130+ files at root = navigation nightmare
- Clean hierarchy = easier to find things
- Separate setup docs from active work
- Archive old/debug files promptly

### March 6-7, 2026 - Email Integration
- Gmail OAuth scope issues = use AgentMail instead
- AgentMail tested & working for Paul's emails
- Calendar still uses Google Calendar helper (no changes needed)

### March 1-6, 2026 - Agent Configuration
- Always verify tool permissions match agent roles
- Document model fallback chains
- Test subagent tool invocation before delegating

---

*Review and update periodically. Daily notes are raw; this is curated.*
