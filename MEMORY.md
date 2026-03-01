# MEMORY.md - Long-Term Memory

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

## Important Paths
- Workspace: `/root/.openclaw/workspace`
- Config: `/root/.openclaw/openclaw.json`
- Config backup: `/root/.openclaw/openclaw.json.backup`
- Memory files: `/root/.openclaw/workspace/memory/YYYY-MM-DD.md`

---
_Last updated: 2026-03-01 (switched to qwen3.5:35b as primary local model)_
