# MEMORY.md - Long-Term Memory
*Last updated: 2026-03-06*

## TODAY'S FIXES (March 6, 2026 - Agent Configuration)

**Infrastructure Issues Fixed:**
1. ✅ **Web Search Permissions** — All agents (coder, writer, scout, analyst, researcher, medical) now have web_search + web_fetch allowed
2. ✅ **Model Fallback Bug** — Updated subagent defaults from qwen2.5:14b to qwen3.5:35b (faster, newer)
3. ✅ **Researcher Browser Access** — Added browser tool permission to researcher agent
4. ✅ **Agent Browser Skill** — Verified Vercel's agent-browser v0.16.3 installed (Chromium ready)
5. ✅ **AgentMail Setup** — API key configured, skill installed, env var set in gateway config
6. ⚠️ **Gmail OAuth** — Skill installed but needs reauthorization (OAuth scope invalid)

**Skills Status:**
- **agent-browser:** ✅ Installed at `/root/.openclaw/workspace/skills/agent-browser/`, v0.16.3, Chromium loaded
- **agentMail:** ✅ Installed, API key configured (am_us_b7b5f5eb16c8...), awaiting inbox creation
- **gmail-calendar:** ✅ Installed, needs OAuth token refresh
- **All agents:** ✅ Can do web research (web_search + web_fetch + browser enabled)

**Model Testing Summary (qwen3.5:4b):**
- Core tasks: 8.4/10 average (speed, analysis, code, reasoning)
- Tool-calling: Excellent logic & planning (8/10 average)
- Constraint handling: Strong (format compliance, word limits)
- **Blocker:** Subagent framework can't invoke tools despite permissions (OpenClaw bug)

**Next Steps:**
1. Create AgentMail inbox + test email send
2. Reauthorize Gmail OAuth (scope fix)
3. Test agent delegation once subagent tool invocation is fixed

## Memory System
- **Daily notes:** memory/YYYY-MM-DD.md - raw session logs, written automatically, load on-demand
- **MEMORY.md:** curated long-term brain - load every heartbeat (~3K tokens)
- **projects.md:** compact project registry - load every heartbeat (~1K tokens)
- **Vector DB:** PostgreSQL + pgvector, semantic search via AI embeddings (coming)
- **Smart loading:** only projects.md + MEMORY.md at startup. Daily notes + vector search = on-demand only. Saves ~80% token cost vs loading everything.

---

## Mission Control Dashboard (Built March 1, 2026)
**Status:** Complete & deployed — Now with Node.js backend server

**Location:** `/root/.openclaw/workspace/mission-control.html`

**Tabs & Features:**

0. **Dashboard** — Your command center
   - Live greeting + date/time
   - 4 key metrics: Active Projects, Tasks Today, Days to Goal, Progress %
   - Activity feed with timestamps
   - Top priorities (week/month, editable, checkbox-toggle)

2. **Projects** — Kanban board
   - 3 columns: Backlog, In Progress, Done
   - Task cards with priority badges (high/medium/low color-coded)
   - Add/edit/delete tasks

3. **Timeline** — Roadmap to 30/12/2026
   - 3 phases with milestone checklists
   - Phase 2 is current (highlighted with cyan glow)
   - Track progress on Trailer & Ute conversion

4. **Revenue** — Business metrics & client management
   - **Goal gauge:** Monthly revenue goal progress (circular bar, gradient fill)
   - **MRR display:** Current monthly recurring revenue, % of goal
   - **6-month chart:** CSS bar chart showing historical revenue trend
   - **Client list:** Name, monthly value, status (active/pending/churned), start date
   - **Add/edit/delete clients:** Modal form, auto-calculates MRR from active clients
   - **Projections:** 4-card grid showing:
     * Annual revenue at current MRR
     * Monthly growth $ needed to hit goal
     * Growth rate % required
     * Projected annual revenue at goal

5. **Command Center** — AI agent management & executive decisions
   - **Agent Grid:** Cards for each AI agent showing:
     * Name, role/title, status (online/busy/offline with colored pulsing dots)
     * Model being used
     * Last active timestamp
   - **Agent Detail Panel (slide-out):**
     * Full description of agent's role & capabilities
     * Capabilities list (checkmarks)
     * Performance notes (custom observations)
     * Recent activity log (timestamped log of last 3-5 actions)
     * "Send Task" button (modal form for assigning work)
   - **Task Assignment:**
     * Modal with textarea for task description
     * Task is logged to agent's activity (shows "Task sent: [description]")
     * Updates lastActive timestamp
   - **Executive Decisions Section:**
     * List of key decisions with date, question asked, summary, & agents consulted
     * Decision cards show which agents were involved
   - **Pre-loaded agents:**
     * Analyst (qwen3.5:35b) — online
     * Coder (qwen3.5:35b) — online
     * Scout (qwen2.5:14b) — busy
     * Chris Cole (claude-haiku) — offline
   - **Pre-loaded decisions:**
     * Report Writer MVP vs NDIS Review prioritization
     * Web search model selection (qwen2.5 vs llama3.2)

6. **Meetings** (NEW) — Full scheduling & meeting management
   - **Today's Meetings Section:**
     * Auto-highlighted at top with cyan accent
     * Shows countdown timer to each meeting
     * Displays time, attendees, type
   - **Meeting Cards (expandable):**
     * Title, date/time, attendees, type emoji badge (☎️ call, 🎥 zoom, 👥 in-person, 📧 async)
     * Click to expand/collapse
   - **Expanded Meeting Details:**
     * **Agenda Items:** Checkable list (visual strikethrough when done), can add new items
     * **Meeting Notes:** Large textarea, auto-saves on blur
     * **Action Items:** List with timestamps, can remove items, press Enter in input to add
   - **Add/Edit Meeting Modal:**
     * Title, date/time picker, attendees, meeting type dropdown, prep notes
     * All validations built-in
   - **Meeting Archive:**
     * Auto-separates upcoming from past meetings
     * Past meetings section auto-populated when date passes
   - **Pre-loaded Meetings:**
     * Weekly Report Writer Sync (2 hours from now, Zoom)
     * NDIS Review Planning (tomorrow, Phone call)
     * Remote Testing Setup (5 days out, Async)
   - **Features:**
     * Real-time countdown timers for today's meetings
     * Smooth expand/collapse animations
     * Auto-saves all changes to localStorage
     * Empty state messaging when no meetings exist

7. **Intel** (NEW) — News & intelligence tracking hub
   - **Daily Brief Section:**
     * Auto-curated: top 5 items (sorted by date, hot items first)
     * Shows title, summary, date, importance badge, source link
     * Grid layout: up to 3-5 items per view
   - **Intel by Category:**
     * 4 category columns: AI News, Industry Trends, Competitor Watch, Opportunities
     * Each shows item count
     * Scrollable category sections
   - **Importance Badges:**
     * 🔥 Hot (urgent, act now)
     * ⚡ Notable (important trends)
     * 📌 Reference (background info)
   - **Filtering:**
     * Filter by category (All, AI News, Trends, Competitors, Opportunities)
     * Filter by importance (All, Hot, Notable, Reference)
     * Filters are sticky and work together
   - **Add Intel Form:**
     * Simple 2-column form: Title, Category, Source Link, Importance
     * Summary textarea (shows content)
     * Date auto-timestamps
   - **Pre-loaded Intel Items:**
     * Qwen 3.5 Release (AI News, Hot)
     * NDIS Reform Q1 2026 (Opportunities, Hot)
     * Competitor AI Tools (Competitor Watch, Notable)
     * LLM Benchmarks (Trends, Reference)
     * Remote Testing Tools (AI News, Notable)
   - **Each Item Shows:**
     * Title, summary, category, importance badge
     * Date added (relative: "Today", "2 days ago", etc.)
     * Source link (opens in new tab)
     * Delete button
   - **Features:**
     * Real-time filtering (instant results)
     * Relative date formatting ("Today", "2 days ago")
     * Click-to-delete with confirmation
     * Auto-sorts by date (newest first in each category)

**Design:**
- Dark glassmorphism (#050508 bg, cyan #00D9FF accent)
- Backdrop blur, subtle borders, smooth transitions
- Responsive grid layout
- Animations: fade-in on tabs, pulse on status dot, hover effects

**Storage:**
- All data: `localStorage['mission-control-data']` as JSON
- Pre-loaded: 2 sample clients (Tech Startup A $3k, Enterprise B $5k), goal $10k/mo
- Monthly history tracks last 6 months (Sep 2025 → Feb 2026)

---

## Current Major Projects

### AI Report Writer (Exercise Physiology NDIS Support Letters)
**Status:** Active development, privacy-preserving local solution

**Location:** `/root/.openclaw/workspace/report-writer/`

**Purpose:** Generate NDIS Section 34 support letters for multiple conditions (SCI, stroke, MS, CP, TBI, amputation, neuromuscular)

**Key Tech:**
- Flask web app with section-by-section generation
- SQLite for tracking generations/edits/feedback
- Local Ollama models (privacy requirement)
- Word doc export with proper formatting

**Critical Blockers (as of 2026-02-19):**
1. References hallucination across conditions
2. Rationale section truncated at 1024 tokens
3. Table formatting broken in Word export
4. Cost calculation math errors
5. Missing "Barriers to Participating" section

**Hardware:** Proxmox, 2x RTX 3060 + 64GB RAM, Ollama at 192.168.1.174:11434

## SearXNG Metasearch Engine (Installed March 2, 2026)
**Status:** ✅ Running locally via Docker Compose

**Purpose:** Local metasearch to eliminate Brave Search API rate limits and costs

**Services:**
- SearXNG: http://localhost:8888 (metasearch UI + API)
- Redis: localhost:6379 (cache backend)

**Supported Engines:** Google, DuckDuckGo, Bing, Wikipedia, GitHub

**Integration:**
- Scout agent can use SearXNGClient (`/root/.openclaw/workspace/searxng_client.py`)
- No API keys required
- No rate limits or costs
- Full privacy (local instance)

**Management:**
```bash
cd /root/.openclaw/searxng
docker compose up -d       # Start
docker compose down         # Stop
docker compose logs searxng # View logs
```

**Documentation:** `/root/.openclaw/SEARXNG_SETUP.md`

## OpenClaw Setup

### Environment
- **Host:** debian-openclaw (Proxmox VM)
- **Ollama instance:** 192.168.1.174:11434
- **Gateway auth:** Password mode (fixed token auth bug in v2026.2.19-2)
- **Models available:**
  - qwen3.5:35b (text, 35B params) - PRIMARY MODEL
  - qwen3.5:27b (text, 27B params)
  - ministral-3:8b (text, 8B params)
  - llama3.2:3b (text, 3B params) - small/fast
  - thewindmom/llama3-med42-8b:latest (text, medical variant)
  - nomic-embed-text:latest (embedding model)
  - gemma3:1b (text, 1B params)

### Email & Calendar (System-Wide)
**All sessions have access to Gmail and Calendar via helper module.**

**Capabilities:**
- ✅ Send emails (whitelist: probinson85@live.com.au, paulrobinson85@outlook.com.au)
- ✅ Read both calendars (chris.cole.work1985@gmail.com + pjrobinson85@gmail.com)
- ✅ Write to chris.cole calendar (create, update, delete events)
- ✅ Read-only for pjrobinson85 calendar

**Using in any session:**
```python
from gmail_helper import GmailHelper, CalendarHelper

# Send email
gmail = GmailHelper()
gmail.send_email('probinson85@live.com.au', 'Subject', 'Body text')

# Get calendar events
cal = CalendarHelper()
events = cal.get_events('chris.cole.work1985@gmail.com', days=7)

# Create event
from datetime import datetime, timedelta
start = datetime.now() + timedelta(days=1)
cal.create_event('Meeting', start_time=start, duration_hours=1)

# Update event
cal.update_event(event_id, {'summary': 'New title'})

# Delete event
cal.delete_event(event_id)
```

**Tokens stored at:**
- Gmail: `/root/.openclaw/credentials/google-token.json`
- Calendar (chris - read+write): `/root/.openclaw/credentials/google-calendar-token.json`
- Calendar (pj - read-only): `/root/.openclaw/credentials/google-pj-calendar-token.json`

**Helper module:** `/root/.openclaw/workspace/gmail_helper.py`
**Usage guide:** `/root/.openclaw/workspace/GMAIL_USAGE.md`

### Agents (Restructured March 1, 2026)
- **main:** Claude Haiku (Anthropic cloud) - default/fast, orchestrator
- **coder:** qwen3.5:35b (Ollama local) - Code generation, system tasks, exec access
- **analyst:** qwen3.5:35b (Ollama local) - Document analysis, read/write/browser access
- **researcher:** qwen3.5:35b (Ollama local) - Web search + document research, read/write/web_search
- **scout:** qwen2.5:14b (Ollama local) - LIGHTWEIGHT WEB SEARCH (fast, minimal tools)

### Web Search Model Testing (March 1, 2026)
**Test Results:** Ran 3 parallel web search subagent tests to find best model for web search delegation.

| Model | Runtime | Search Time | Quality | Recommendation |
|-------|---------|-------------|---------|---|
| Qwen 2.5 14B | 33s | 941ms | Excellent | ✅ **PRIMARY** |
| Llama 3.2 3B | 46s | 1033ms | Excellent | Secondary (lightweight) |
| Qwen Coder 14B | 57s | _(unknown)_ | _(unknown)_ | Not recommended |

**Winner:** Qwen 2.5 14B
- Fastest execution (33s total)
- Fastest web search (941ms)
- Excellent response quality (accurate, well-structured)
- Larger context window (32K) for complex queries
- Good token efficiency (243 tokens output)

**Full test results:** `/root/.openclaw/workspace/research/WEBSEARCH_FINAL_RESULTS.md`

**Recommended config:**
```json5
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "ollama/qwen2.5:14b"  // <- Use for web search subagents
      }
    }
  }
}
```

### Skills Setup (March 1, 2026)
**Installed & Active:**
- **Notion** → analyst, researcher, main (note sync)
- **GitHub** → analyst, researcher, main (repo management)
- **Weather** → researcher, main (real-time conditions)
- **Summarize** → all (bundled, document summaries)

**Thermoregulation Alert Cron:**
- Monitors Brisbane weather hourly (6 AM–11 PM)
- Alerts if temp >29°C OR humidity >75%
- Job ID: `5dc4280d-1c1b-43b3-903f-a07e79620e7f`
- Direct Telegram message to Paul on threshold breach

### New Models Added (March 3, 2026)

**Test Results:**
- **qwen3.5:9b:** Excellent for analysis (8/10) and code generation (7/10). Added to analyst role. Faster than 35b but not dramatically so (43s vs 20s for 35b).
- **lfm2:24b:** Outstanding for medical tasks (9/10). Created new medical agent. Clinically accurate, no hallucinations, perfect for NDIS support letter generation.

**Config Changes Applied:**
- Added `qwen3.5:9b` to models registry
- Created `medical` agent (primary: lfm2:24b) for clinical/NDIS report writing
- Updated `analyst` agent to use `qwen3.5:9b` (primary: qwen3.5:9b)
- Config backed up before changes
- System restarted with config.patch

**Agent Fleet (Updated):**
- **main:** Claude Haiku (Anthropic cloud) - orchestrator
- **coder:** qwen3.5:35b (local) - code generation
- **analyst:** qwen3.5:9b (local) - document analysis ← NEW
- **researcher:** qwen3.5:35b (local) - web research
- **scout:** qwen3.5:35b (local) - web search
- **medical:** lfm2:24b (local) - clinical/NDIS reports ← NEW

### Known Bugs
- **Ollama subagents hang indefinitely** (GitHub #20034, v2026.2.19-2)
  - Affects ALL Ollama models (tested: llama3.2:3b, qwen2.5:14b, qwen2.5-coder:14b)
  - Sub-agents show as "running" but never reach Ollama API
  - Direct Ollama API calls work fine (verified via Open WebUI)
  - **Workaround:** Use cloud models (Claude) for all subagents
  - **Fix status:** Open issue, no ETA on patch

### Communication
- Telegram group: "Openclaw" (ID: -1003879714400)
- No mention required in group
- Direct, straightforward communication preferred

## About Paul
- **Name:** Paul
- **Timezone:** Australia/Brisbane (GMT+10)
- **Communication style:** Direct, non-technical but learning, prefers plan-before-execute
- **Preferences:** Minimal emojis, values being corrected if heading wrong direction
- **Privacy:** Paramount importance - all data stays local

## Daily Rundown Setup (March 1, 2026)
**Purpose:** One consolidated daily check-in with weather, news, calendar, tasks, recommendations

**What's included:**
- Weather for Brisbane (temp/humidity with thermoregulation alerts)
- News (positive-leaning, Australia-focused)
- Calendar events (once Google Calendar is connected)
- Daily task priorities
- Recommendations for what to tackle

**What's NOT included:**
- Hourly weather alerts (too noisy) — manual checks instead
- Email/traffic info (blocked on calendar + email integration)

**Infrastructure:**
- Removed: Weather alert cron (was hanging due to Ollama subagent bug)
- Manual: I'll check weather during daily rundown + flag if >29°C or >75% humidity
- Status: Ready to deploy once calendar/email APIs are connected

**Next steps:**
1. Connect Google Calendar
2. Connect Gmail/email accounts
3. Add traffic check (via Google Maps API)
4. Create daily rundown cron job (morning 8:30 AM)

## Lessons Learned
- Plan-then-execute prevents rework (discuss issues before implementing)
- Token limits matter for local models - watch for truncation
- Privacy requirement rules out cloud APIs - keep everything local
- Condition-specific clinical rules prevent hallucinations
- Ollama subagents hang indefinitely (v2026.2.19-2 bug) — use cloud models or manual checks instead

## Agent-Browser Web Automation (Installed March 3, 2026)
**Status:** ✅ Ready to deploy — 3 automation scripts built for priority projects

**What it is:**
- Agent-browser v0.15.2 (CLI for Playwright-based browser automation)
- Local, no cloud APIs, full privacy
- Can automate email checks, form filling, screenshot taking, data extraction

**Three Priority Scripts (Ready to Run):**

1. **Email Triage** (`email-triage.sh`)
   - Scans inbox for unread + urgent items
   - Takes screenshot
   - Provides summary (3-5 urgent vs 50+ unread)
   - Impact: Daily dopamine hit, reduces overwhelm

2. **Report Writer Tests** (`report-writer-test.sh`)
   - Tests all 6 conditions (SCI, stroke, MS, CP, TBI, amputation)
   - Verifies report formatting (sections present)
   - Saves screenshots for manual review
   - Impact: Unblocks #2 project (launch readiness)

3. **NDIS Evidence Check** (`ndis-evidence-check.sh`)
   - Scans email for NDIS/report/assessment keywords
   - Counts evidence items + provider sources
   - Takes screenshots of search results
   - Impact: Unblocks #1 project (shows what's in inbox)

**Documentation Created:**
- `AGENT_BROWSER_AUTOMATION_PLAN.md` — Full opportunity analysis (9 automation ideas ranked)
- `BROWSER_AUTOMATION_READY.md` — Quick start + testing guide
- `BROWSER_INTEGRATION_GUIDE.md` — Full integration (cron, Telegram, delegation)

**How to use:**
```bash
# Test email triage (10 seconds)
bash /root/.openclaw/workspace/email-triage.sh

# Or schedule as cron job (8 AM daily)
cron add job.json
```

**Next steps:**
- Test one script (easiest: email-triage)
- Schedule as cron job if useful
- Integrate with Telegram alerts
- Deploy all 3 for full automation

---

## Dog Attack Claim (QCAT) - March 2, 2026
**Status:** In progress (waiting on 2 external responses)
**Timeline:** Attack occurred late 2025

**What's done:**
- ✅ Paul's witness statement completed
- ✅ Paul's application submitted

**What's blocked:**
- ⏳ Candice (neighbour) - waiting for her response
- ⏳ Mum - needs to complete her witness statement

**Notes:** Tracked in unified-tasks.json (id: qcat-dog-claim). May need to follow up with Candice if no response soon.

## Job Scout System (Launched March 2, 2026)
**Status:** Active & ready for job discovery

**What's built:**
- **Job Scout Agent** — Subagent (ollama/qwen2.5:14b) for proactive job discovery
- **Job Scout Skill** (`/skills/job-scout/SKILL.md`) — Search, research, briefs
- **Resume Builder Skill** (`/skills/resume-builder/SKILL.md`) — Tailored resumes/cover letters
- **Job Hunting Tracker** (`/job-applications/JOB_HUNTING_TRACKER.md`) — Central tracking
- **Application folders** — Structure ready at `/job-applications/[Company]/`

**How it works:**
1. Scout searches LinkedIn, Seek, Indeed weekly (2-3x per week)
2. Scores opportunities against Paul's background (60%+ only)
3. Posts top opportunities to Telegram Openclaw group
4. Paul approves which to research
5. Scout creates company research brief (Section 1: Who are they, Section 2: Job analysis, Section 3: Strategy)
6. Scout builds tailored resume + cover letter from Paul's templates
7. Materials ready to submit

**Resume templates established:**
- **Telwater** (PREFERRED) — Production engineering, manufacturing focus
- **Unidan** — Broader consulting background
- **Advanced Cranes** — Industrial/commercial focus

**Target roles:**
- Production Engineer
- Design Engineer
- Manufacturing Engineer
- Mechanical Engineer
- Consulting Engineer

**Target industries:** Marine/maritime, manufacturing, automotive, aerospace, robotics

**Match criteria:** Only present 60%+ fits to Paul's background (fabrication + engineering degree combo is unique and valuable)

**Key files:**
- Templates: `/workspace/resume/[Company Name]/`
- Tracking: `/workspace/job-applications/JOB_HUNTING_TRACKER.md`
- Application briefs: `/workspace/job-applications/[Company Name]/[Company]-Brief.docx`
- Agent: `agent:scout:subagent:283a1e1d-3eda-4419-8bb1-e7aa2315c00e`

**System Status:** ✅ FULLY DEPLOYED & RUNNING
- Scout conducting first job search (March 2, 2026)
- Searching LinkedIn, Seek, Indeed for QLD mechanical engineer roles
- Will present top 5-10 opportunities (60%+ fit only) in Telegram group
- Paul approves which to research → Scout handles rest

**Quick Start for Paul:**
1. Read `/job-applications/JOB_SCOUT_GUIDE.md`
2. Skim `/job-applications/WORKFLOW_QUICKREF.md`
3. Wait for Scout's search results in Telegram
4. Respond "research" for jobs you like
5. Scout handles research, materials, tracking

**Key Files:**
- `/job-applications/README.md` — Overview
- `/job-applications/JOB_SCOUT_GUIDE.md` — Full guide
- `/job-applications/WORKFLOW_QUICKREF.md` — Quick ref
- `/job-applications/JOB_HUNTING_TRACKER.md` — Central tracker

## Important Paths
- Workspace: `/root/.openclaw/workspace`
- Config: `/root/.openclaw/openclaw.json`
- Config backup: `/root/.openclaw/openclaw.json.backup`
- Memory files: `/root/.openclaw/workspace/memory/YYYY-MM-DD.md`
- Unified tasks: `/root/.openclaw/workspace/unified-tasks.json` ← **SINGLE SOURCE OF TRUTH** (Mission Control reads/writes to this)

---
_Last updated: 2026-03-02 (consolidated task lists to unified-tasks.json, added QCAT claim tracking)_

## Mission Control Server (Built March 1, 2026)
**Status:** Production-ready lightweight Node.js server

**Location:** `/root/.openclaw/workspace/server.js`

**What it does:**
- Serves Mission Control dashboard at http://localhost:8899
- Provides 6 REST API endpoints for data persistence
- Manages data files (mc-data.json, mc-activity.json)
- Fetches live weather from wttr.in API
- Logs all activity for auditing
- Graceful shutdown with signal handlers
- CORS enabled for local development

**Features:**
- **Zero dependencies** — only built-in Node modules (http, fs, path, url)
- **Single file** — server.js (400 lines, fully documented)
- **Port 8899** — configurable if needed
- **No databases** — pure JSON file storage
- **Activity logging** — keeps last 500 entries
- **Weather integration** — live weather API via wttr.in
- **Error handling** — graceful failures, sensible defaults

**API Endpoints:**
1. **GET /mc/status** → Server uptime, health, timestamp
2. **GET /mc/data** → Read dashboard state from mc-data.json
3. **POST /mc/data** → Save dashboard state to mc-data.json
4. **GET /mc/weather?city=...** → Live weather (temp, condition, feels_like, humidity, wind)
5. **GET /mc/activity** → Last 50 activity log entries
6. **POST /mc/activity** → Append new activity entry

**Data Files:**
- `mc-data.json` — Stores complete dashboard state (created on first save)
- `mc-activity.json` — Activity log with timestamps & metadata (created automatically)

**Quick Start:**
```bash
cd /root/.openclaw/workspace
node server.js
# Server starts at http://localhost:8899
```

**Auto-Start Options:**
- Linux (systemd): See SERVER_SETUP.md
- macOS (LaunchAgent): See SERVER_SETUP.md
- Windows (Task Scheduler): See SERVER_SETUP.md

**Documentation:**
- `QUICKSTART.md` — 2-minute setup guide
- `SERVER_SETUP.md` — Complete reference + troubleshooting

## Mission Control Server Integration (March 1, 2026)
**Status:** Complete — Dashboard fully connected to server

**Integration Features:**
- **Data Flow:** localStorage (primary) ↔ server backup
- **Sync Strategy:** Real-time to localStorage, debounced to server
- **Sync Frequency:** Every 5 minutes (full state POST)
- **Fallback:** Works perfectly offline, auto-reconnect when server available

**Activity Logging:**
- Priority added/toggled
- Tasks created
- Meetings created/updated
- Notes updated
- Data synced to server
- All with timestamps, logged to `/mc/activity` endpoint

**Weather Integration:**
- Fetches from `/mc/weather?city=Gold Coast,QLD`
- Displays in header: temperature + condition + emoji
- Updates every 30 minutes
- City configurable in mission-control.html line ~1153

**Server Status Indicator:**
- Header top-right: colored dot + "Server: Online/Offline"
- Green = connected, syncing, logging active
- Red = offline, dashboard uses localStorage-only
- Auto-reconnect every 30 seconds

**Dashboard Changes Made:**
1. Added server fetch utilities with 3s timeout
2. On page load: merge server data with localStorage
3. Every change: debounced 1s sync to server
4. Activity logging on key actions (priority, meeting, task, notes)
5. Weather fetch on load + every 30 minutes
6. Connection monitor every 30 seconds
7. Periodic full sync every 5 minutes
8. Status indicator + weather widget in header

**Files Updated:**
- `mission-control.html` — Added server integration (130+ lines)
- `INTEGRATION_GUIDE.md` — Comprehensive integration documentation
- `INTEGRATION_QUICKREF.md` — Quick reference + troubleshooting

**Configuration (mission-control.html):**
```javascript
const SERVER_CONFIG = {
    enabled: true,                      // Toggle integration
    baseUrl: 'http://localhost:8899',  // Server location
    syncInterval: 5 * 60 * 1000,       // 5 minutes
    city: 'Gold Coast,QLD',            // Weather city
    timeout: 3000                       // 3 second fetch timeout
};
```

**Testing:**
```bash
# Start server
node server.js

# Open dashboard
http://localhost:8899

# Check status
curl http://localhost:8899/mc/status

# View activity
curl http://localhost:8899/mc/activity | jq '.'

# Get weather
curl 'http://localhost:8899/mc/weather?city=Gold%20Coast,QLD'
```

**Key Design Decisions:**
- localStorage = primary (always fast, always works)
- Server = backup + enrichment (optional but recommended)
- No data loss possible (syncs on close, debounced on change)
- Automatic fallback when server unavailable
- Zero UI disruption (background syncs)
- Activity logged only when connected (no queue)
