# HEARTBEAT.md - Checks & Monitoring

## SMART MEMORY LOADING (do this first, every heartbeat)

Before anything else, load context efficiently:
1. Read memory/projects.md - compact project registry (~1K tokens)
2. Read MEMORY.md - curated long-term memory (~3K tokens)
3. Only load daily notes (memory/YYYY-MM-DD.md) when asked about specific past work
4. Only run vector search when a specific question about past work comes up

This gives full context at ~10% of the token cost. Daily notes are archives, not runtime docs.

---

## Weather Check (Thermoregulation Alert)
Paul's thermoregulation limits: **29°C max / 75% humidity max**

Run every 2 hours during waking hours (6am - 11pm Brisbane time) to check current conditions and alert if exceeded.

- **Temperature threshold:** 29°C
- **Humidity threshold:** 75%
- **Alert on:** Either threshold exceeded (heat stroke/discomfort risk)
- **Action:** Message Paul directly if outside safe zone
- **Location:** Gold Coast area (use wttr.in or Open-Meteo API)

## Vector Memory Flush (every heartbeat)
Run: python3 ~/.openclaw/workspace/skills/vector-memory/scripts/memory_flush.py
If total_stored = 0, that is fine - means nothing new to embed.

## Future Checklist (add as needed)
- Email inbox (high-priority only)
- Calendar alerts (events in next 2 hours)
- GitHub status (pending PRs/issues on report-writer)
- Notion task updates (overdue items)
