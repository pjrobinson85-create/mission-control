# Personal Assistant System Plan

## Philosophy
Be useful, not annoying. Fewer notifications, real value. Support Paul's ADHD and fatigue management without constant nagging.

## Current Status
- **Version:** 1.0 (Foundation)
- **Active:** Medication reminders, task tracking, break suggestions
- **Safe to use:** Yes — minimal notification load

---

## Layer 1: Daily Operations (Active Now)

### Medication Enforcement
- **Morning:** 9:00 AM (gentle) → 9:15 AM (check) → 9:30 AM (firm + consequence)
- **Evening:** 6:30 PM (gentle) → 6:45 PM (check) → 7:00 PM (firm + warning)
- **Bowel prep:** Sun/Wed at 8:20 PM (Senakot reminder)
- **Interaction:** Say "took meds" to confirm, stop reminders escalating

### Break & Focus Management
- **Every 45 mins:** Check if hyperfocused ("take a break" suggestion)
- **Optional:** Tell me "starting work" to enable focus mode, "done" to reset
- **Philosophy:** Gentle nudge, not interrupt. You say if you want to ignore it.

### Task Management
- **Storage:** tasks.json (structured, queryable)
- **Projects:** NDIS Review, Report Writer (primary), Jeetrike Mods, Bike Rack (secondary)
- **Commands:**
  - `show my tasks` → All tasks sorted by priority
  - `quick win` → Tasks under 15 minutes (dopamine hit)
  - `high priority` → NDIS + Report Writer only
  - `NDIS work` / `report writer` → Filter by project
  - `I'm stuck` → Let's troubleshoot what's blocking you

---

## Layer 2: Smart Delegation (Rolling Out)

### Night-Time Background Work
**Goal:** Research + analysis happens while you sleep, findings ready in morning

**Current jobs:**
- Coder agent analysis: Review entire report-writer codebase, generate improvement report
- Research agent: Find easiest remote access options for testing (self-hosted vs cloud vs docker)

**How it works:**
- You say "research X" or mark task as `delegated`
- Agent runs overnight (1-3 AM)
- Results posted to Telegram next morning
- You review/integrate during work hours

### Email Drafting
- Break NDIS email to Lynne into steps (ask clarifying questions first)
- Draft → you review → you send
- Takes uncertainty out of "what do I even say?"

---

## Layer 3: ADHD Support (Building)

### Executive Function Scaffolding
When you say "I'm stuck":
1. Ask: What's unclear? (uncertainty diagnosis)
2. Offer: 2-3 possible next steps
3. You pick → we break it into 10-min chunks
4. Track which type of uncertainty blocks you most

### Dopamine-Aware Tasking
- **Morning after poor sleep?** → Suggest quick wins (15 min tasks)
- **Good sleep + energy?** → Suggest bigger challenges (90+ min)
- **Mid-afternoon slump?** → Suggest different task type (switch context)

### Working Memory Offload
- Voice note system (once set up): Fleeting ideas → captured → reviewed daily
- Add to tasks automatically
- Never lose an idea again

### Time-Blindness Management
- "Report due when?" → Set countdown timer
- "How long should this take?" → You estimate, I track actual, learn your patterns
- Warn if you're veering into perfectionism (working 3x estimated time)

---

## Layer 4: Compliance Tracking (Phase 2)

### Medication Compliance
- Log when you take meds (say "took meds")
- Weekly report: X% compliance, patterns (skip Mondays? Evenings?)
- Predictive warnings: "You always skip Tuesday morning"

### Hyperfocus Patterns
- Track when you work longest uninterrupted
- What type of work triggers hyperfocus?
- Optimal break intervals (45 mins? 60? 90?)
- Predict good hyperfocus days

### Effort Estimation
- You say "15 min task" → actually takes 45 min?
- Learn your true patterns
- Suggest realistic time estimates going forward

---

## Layer 5: Integration Points (Phase 3)

### Email & Calendar
- Gmail: Incoming task detection (from Lynne, Georgia, etc.)
- Calendar: Know your hard stops, protect hyperfocus time
- GitHub: report-writer status updates

### Notion
- Brain dump → auto-parse into tasks
- Meeting notes → capture action items

### Voice Input
- Set up voice note capture
- "Voice to text" → task add
- Voice commands: "took meds", "show high priority", etc.

---

## Daily Workflow (Proposed)

### 6:30 AM (Support worker arrives)
- Morning med reminder fires
- You shower, bowel routine (if scheduled)
- Take meds
- Say "took meds" → I stop reminding

### 8:30–11 AM (Up & active)
- Check email/messages
- I suggest: "High priority?" or "Quick win?" based on energy
- You pick a task
- Work on it
- Every 45 mins: Gentle break check (optional)

### Midday
- How's energy? Need a different task type?
- Procrastinating? Let's troubleshoot

### Afternoon/Evening
- More work or rest depending on fatigue
- Evening med reminder at 6:30 PM

### Night (Your downtime)
- I run delegated research, analysis, drafting
- Results waiting for you in morning

### Weekly
- Compliance report (meds taken, tasks completed)
- Patterns emerging? Adjust strategy

---

## Communication Rules

**What I do:**
- Reminders at scheduled times (meds, bowel prep)
- Break checks every 45 mins (optional, you can ignore)
- Respond when you ask ("show my tasks", "I'm stuck", etc.)
- Proactive suggestions based on energy/patterns

**What I don't do:**
- Constant notifications
- Check-ins every 5 minutes
- Unsolicited advice
- Nagging if you ignore one reminder

**Tone:**
- Direct, honest, no corporate speak
- Call out uncertainty when blocking progress
- Celebrate wins
- Respect when you're in flow

---

## Success Metrics (3-Month Test)

### Hard targets:
- NDIS: Emailed Lynne, gathered evidence, form completed
- Report Writer: Tested, GitHub connected, remote access ready
- System: Still using daily, finding value

### Soft targets:
- Compliance: 70%+ medication adherence
- Productivity: More tasks finished vs forgotten
- Fatigue management: Better awareness of energy patterns

### Kill signals:
- Haven't touched it in a week
- More annoyed than helped
- Gets in the way of actual work

---

**Next steps:**
1. Set up voice note capture (phone TTS → Telegram)
2. Deploy coder agent analysis (report-writer)
3. Deploy research agent (remote access options)
4. Weekly compliance check-in (Friday)

Questions? Feedback? Let's adjust.
