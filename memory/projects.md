# Active Projects Registry

| Project | Status | Tech Stack | Notes | Disk |
|---------|--------|-----------|-------|------|
| **AI Report Writer** | In Progress (85%) | Flask, SQLite, Ollama (lfm2:24b, qwen3.5:35b) | NDIS Section 34 reports (SCI, stroke, MS, CP, TBI, amputation). Critical issues found in code review (async/await broken, hardcoded costs, no auth). 3-4 hours to MVP. | `/workspace/report-writer` |
| **Job Scout System** | Live | qwen2.5:14b, LinkedIn/Seek/Indeed APIs | Auto-discovers jobs, scores vs background, builds tailored resumes. Templates for Telwater/Unidan/Advanced Cranes. 60%+ fit only. | `/workspace/job-applications` |
| **Mission Control Dashboard** | Live | Node.js, localStorage, wttr.in API | Command center for projects, tasks, revenue, meetings, intel. Server at localhost:8899, syncs to mc-data.json. | `/workspace/mission-control.html` |
| **SearXNG Metasearch** | Live | Docker Compose, Redis, local engines | Privacy-first local metasearch. No API keys, no rate limits. Running at localhost:8888. | `/workspace/searxng` |
| **NDIS Review** | Blocked | Email, evidence gathering | Timeline: ASAP. Need to email Lynne (applications timeline), gather doctor/OT/EP/psychologist reports. Blocked on clarity. | Evidence inbox |
| **Remote Testing Access** | Research | TBD | Find easiest way to provide remote access for Report Writer user testing. High priority (blocks launch). | Research phase |
| **Job Hunting Tracker** | Live | JSON tracking | Central log of applications, responses, companies researched. Auto-updated by Scout system. | `/workspace/job-applications/JOB_HUNTING_TRACKER.md` |
| **Dog Attack Claim (QCAT)** | In Progress | Witness statements | Claim filed. Waiting on Candice (neighbour) and Mum response. | Tracked in unified-tasks.json |
| **Email + Calendar Integration** | Live | Gmail API, Google Calendar | Global access across all sessions. Whitelisted recipients only (Paul's 2 emails). Rate limited 5/hr, 20/day. | `/workspace/gmail_helper.py` |

## Live URLs
- Mission Control Dashboard: http://localhost:8899
- SearXNG: http://localhost:8888
- Report Writer: (local Flask app, not exposed)
- Open WebUI (Ollama): http://192.168.1.174:8080

## Critical Blockers
1. Report Writer: Code review found 5 critical issues (async/await, hardcoded costs, no auth, no HTTPS, DB perms). 3-4 hours to fix.
2. NDIS Review: Blocked on clarity. Need timeline + permission from Lynne.
3. Remote Testing: Research phase. Need tool evaluation.

## Team
- **Paul:** Project owner, decision-maker
- **Chris:** AI assistant (executor, researcher, writer)
- **Agents:** Coder (qwen3.5:35b), Analyst (qwen3.5:9b), Scout (qwen2.5:14b), Medical (lfm2:24b)

---
*Last updated: 2026-03-06*
