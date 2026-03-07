# Live Command Center — Implementation Plan

## What We're Building

A **true live dashboard** that pulls real data from your actual system files and displays it without CLI needed.

---

## Data Sources (What Gets Pulled)

### 1. Tasks & Projects (`tasks.json`)
- Current tasks by status (todo, in-progress, blocked, delegated, done)
- Project groupings (NDIS Review, Report Writer, Jeetrike Mods, etc.)
- Priority levels (critical, high, medium, low)
- Dependencies (e.g., "Email Lynne" blocks "Gather Evidence")
- **Display:** Kanban board + priority queue

### 2. Medication (`medication-state.json`)
- Morning/evening meds due times
- Last taken timestamp
- Reminder level (0=no reminder, 1=gentle, 2=check, 3=firm)
- **Display:** Dashboard pill counter + header alert

### 3. Bowel Schedule (`bowel-schedule.json`)
- Next routine date/time
- Senakot reminder timing
- Recent history (accidents, reschedules)
- Stress patterns
- **Display:** Next routine countdown + Senakot alert

### 4. Focus State (`focus-state.json`)
- Current session status (idle, focused, break, paused)
- Timer if in session
- Energy level
- **Display:** Status indicator + timer

### 5. Stress Tracking (`stress-tracking.json`)
- Current stress level (1-10)
- Daily patterns
- Triggers
- **Display:** Gauge + correlation with tasks

### 6. Google Calendar (via API)
- Upcoming meetings/events
- NDIS deadlines
- Support worker schedule
- **Display:** Calendar view + next event countdown

### 7. Activity Log (`mc-activity.json`)
- All recent actions with timestamps
- **Display:** Activity feed on main dashboard

---

## Dashboard Redesign

### Tab 1: Dashboard (Home)
**Shows:** Your complete status at a glance

```
┌─────────────────────────────────────────────┐
│ 🌤️ Paul's Command Center          Tue 21:54 │
├─────────────────────────────────────────────┤
│                                             │
│  CRITICAL ALERTS                            │
│  ⚠️  NDIS Email to Lynne — BLOCKED (4 days)│
│  🔔 Evening meds due in 1h 36m              │
│                                             │
│  NEXT UP                                    │
│  📅 NDIS Review Planning — Tomorrow 3 PM    │
│  🎯 Report Writer Testing — This week       │
│                                             │
│  YOUR STATUS                                │
│  Medication:     ✓ Morning ✓ Evening        │
│  Bowel routine:  ✓ Last Mon, Next Wed       │
│  Energy:         Medium (4/10)              │
│  Stress:         Moderate (5/10)            │
│  Tasks today:    2/5 done                   │
│                                             │
│  FOCUS TRACKING                             │
│  Current state:  Focused (47 min elapsed)   │
│  Break due:      In 13 minutes              │
│                                             │
└─────────────────────────────────────────────┘
```

### Tab 2: Tasks (Live Priority Queue)
**Shows:** All tasks filtered by status/project

```
BY STATUS:
├─ 🚨 BLOCKED (2)
│  ├─ Email Lynne: timeline + permission [4 days old]
│  └─ Gather evidence reports [depends on Lynne email]
│
├─ 📋 TODO (6)
│  ├─ Email Georgia Carter: test output
│  ├─ Test report writer with qwen3.5
│  ├─ Connect GitHub integration
│  └─ ...
│
├─ 🔄 IN PROGRESS (2)
│  ├─ Bike rack research
│  └─ ...
│
├─ ✅ DONE (0)
│
└─ 🎯 DELEGATED (2)
   ├─ Coder: analyze report writer project
   └─ Research: remote access options
```

### Tab 3: Medical Tracking
**Shows:** Health & wellness real-time

```
MEDICATION
├─ Morning (9:00 AM)  — ⏰ Due in 9h 6m
├─ Evening (6:30 PM)  — ⏰ Due in 20m [SOON!]

BOWEL ROUTINE
├─ Last: Monday 2026-02-24 ✓
├─ Next: Wednesday 2026-03-05
├─ Prep: Senakot Tue 6:30 PM ⏰ Due in 20m
├─ Pattern: Accidents on routine days (tracking stress correlation)

STRESS LEVEL: 5/10 (Moderate)
├─ Recent trigger: NDIS uncertainty
├─ Correlation: Routine days have higher accidents
├─ Recommendation: Try earlier medication timing next week
```

### Tab 4: Critical Blockers
**Shows:** What's holding you up

```
1. NDIS EMAIL TO LYNNE (4 days blocked)
   ├─ Issue: Uncertainty on what to include
   ├─ Blocks: Gather evidence reports
   ├─ Action: Need clarifying conversation with Lynne
   └─ Next: Ask Paul specific questions about NDIS timeline
   
2. REPORT WRITER TESTING (In progress)
   ├─ Waiting: qwen3.5 model full test cycle
   ├─ Dependencies: GitHub integration, remote access research
   └─ Status: 85% done per MEMORY.md
```

### Tab 5: Calendar & Events
**Shows:** Your schedule live from Google Calendar

```
TODAY
├─ No meetings scheduled

UPCOMING
├─ 2026-03-02 3:00 PM — NDIS Review Planning (1h)
├─ 2026-03-03 10:00 AM — Support worker check-in
├─ 2026-03-05 9:00 AM — Bowel routine
└─ 2026-03-05 6:30 PM — Senakot reminder
```

### Tab 6: Focus & Energy Tracking
**Shows:** Your productivity patterns

```
CURRENT SESSION
├─ Status: Focused
├─ Duration: 47 minutes
├─ Break due: 13 minutes
├─ Energy: 4/10 (low)

DAILY SUMMARY
├─ Sessions started: 3
├─ Total focused time: 2h 23m
├─ Breaks taken: 2
├─ Distractions: Housemates (logged 3 times)

RECOMMENDATIONS
├─ Energy is low — consider break soon
├─ Morning session was most productive
└─ Afternoon focus time appears impaired by distractions
```

### Tab 7: Projects
**Shows:** Your actual projects + progress

```
🔵 NDIS Review
   ├─ Priority: Critical
   ├─ Status: Blocked (awaiting Lynne email clarity)
   ├─ Tasks: 2/4 done
   └─ Timeline: ASAP (targeting end of month)

🔵 Report Writer App
   ├─ Priority: Critical  
   ├─ Status: 85% done (per MEMORY.md)
   ├─ Tasks: 5/8 done
   ├─ Sub-tasks: GitHub (todo), Remote access (researching), Testing (in progress)
   └─ Timeline: Ready for launch after testing

🟠 Jeetrike Mods
   ├─ Priority: Low
   ├─ Status: Backlog
   ├─ Tasks: 2 (bottle holder, phone mount)
   └─ Timeline: After report writer launch

🟢 Bike Rack Design
   ├─ Priority: Medium
   ├─ Status: Early research (specs gathered)
   ├─ Tasks: 1/2 done
   └─ Timeline: Q2 (after NDIS + Report Writer)
```

### Tab 8: Activity Feed
**Shows:** Real-time activity log

```
21:54 — Dashboard loaded
21:52 — Server data synced
21:48 — User asked about model
21:41 — LAN configuration completed
20:30 — Evening medication reminder sent
...
```

---

## Backend Integration

### Server Updates Needed

New endpoint: `GET /mc/tasks`
```bash
curl http://localhost:8899/mc/tasks
# Returns: Full task tree from tasks.json + status
```

New endpoint: `GET /mc/health`
```bash
curl http://localhost:8899/mc/health
# Returns: Medication state, bowel schedule, stress level, focus state
```

New endpoint: `GET /mc/calendar`
```bash
curl http://localhost:8899/mc/calendar?days=7
# Returns: Upcoming events from Google Calendar
```

### Dashboard Auto-Refresh

- **Tasks:** Every 30 seconds (check for status changes)
- **Health:** Every 5 minutes (meds, bowel timing)
- **Calendar:** Every 15 minutes (upcoming events)
- **Activity:** Every 10 seconds (latest actions)
- **All:** Full refresh when page gains focus

---

## Implementation Phases

### Phase 1: Core (This Week)
- ✅ Pull live task data from tasks.json
- ✅ Display medication state with time remaining
- ✅ Show bowel schedule + Senakot countdown
- ✅ Build critical blockers tab
- ✅ Activity feed from mc-activity.json

### Phase 2: Advanced (Next Week)
- 🔄 Google Calendar integration
- 🔄 Focus/energy tracking
- 🔄 Stress level gauge
- 🔄 Pattern detection (stress → accidents)

### Phase 3: Smart Alerts (Future)
- 📢 Proactive notifications for blockers
- 🤖 AI suggestions ("Stress is high, take a break?")
- 🎯 Task recommendation engine ("Good time to tackle Report Writer testing")

---

## Why This Matters

**Right now:** You'd need to run CLI commands to see your task list, check medication status, etc.

**With this:** You open one dashboard and see:
- ✅ What needs to be done
- ✅ What's blocking you
- ✅ When your meds are due
- ✅ Your medical schedule
- ✅ Your energy/stress levels
- ✅ Everything at a glance

**No CLI. No confusion. Just clarity.**

---

## Ready?

Should I:
1. **Start Phase 1** (deploy today) — tasks + meds + blockers
2. **Wait for input** (ask questions first)
3. **Go full stack** (all phases at once)

What would be most helpful?
