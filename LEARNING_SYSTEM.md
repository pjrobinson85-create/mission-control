# Learning System — Self-Optimizing Routine & ADHD Tools

**Purpose:** The system tracks what works, identifies patterns, and optimizes itself automatically.

## How It Works

### 1. Feedback Capture
Every action Paul takes gets logged with outcome data:
- **Task completion** (did it happen? yes/no)
- **Quality** (how well? 1-5 scale)
- **Energy level during** (high/medium/low)
- **Time of day** (when was it attempted?)
- **Context** (what else was happening? distractions, bowel routine, rugby day, etc.)
- **Friction** (how hard was it to start? 1-5 scale)
- **Mood/stress** (any notes?)

Example:
```json
{
  "date": "2026-03-03",
  "task": "Email Lynne about NDIS timeline",
  "completed": true,
  "quality": 4,
  "energy_during": "high",
  "time_of_day": "9:15 AM",
  "context": ["post-bowel-routine", "no-distractions"],
  "friction": 2,
  "mood": "focused",
  "notes": "Easier than expected, did it right after routine check-in"
}
```

### 2. Pattern Recognition (Weekly)
Every Sunday, the system analyzes:
- **What task types succeed at what times?** (Report writing @ 10 AM = 85% success vs 3 PM = 30%)
- **Energy pattern validation** — Does the framework match reality?
- **Context triggers** — What conditions make tasks easier/harder?
- **Friction tracking** — Which reminders/tools actually reduced startup friction?
- **Post-bowel performance** — How reliable is the fatigue pattern?
- **Rugby recovery** — Is Wednesday always slow or variable?

Output: Weekly pattern report + confidence levels

### 3. Auto-Optimization (Monthly)
Based on patterns, the system auto-recommends:
- **Routine adjustments** — "Swap Report Writer to 8:45 AM (87% success) instead of 10:00 AM (62%)"
- **Tool changes** — "Toggl focus timer worked 2x better than Notion reminders. Switch primary tool."
- **Energy rebalancing** — "Tuesday post-rugby recovery is 40% longer than expected. Add extra buffer."
- **Task remapping** — "Decision paralysis happens when task list > 5 items. Cap daily focus to 3 high-priority."
- **Reminder tuning** — "Morning meds 9:00 AM reminder hit 100% last week. Evening meds 6:30 PM hit 60%. Test 6:15 PM instead."

Paul reviews + approves each change before it goes live. No silent changes.

### 4. Integration Points

**Feedback sources:**
- Manual check-ins (Paul marks tasks done in Mission Control + notes quality/friction)
- Reminder acknowledgments (when Paul responds to meds/bowel/task reminders, it's logged)
- Daily standup (brief: what worked, what didn't?)
- Weekly review (deeper pattern analysis)

**Data storage:**
- `/root/.openclaw/workspace/learning/feedback-$(date +%Y-%m-%d).json` — Daily feedback log
- `/root/.openclaw/workspace/learning/patterns-$(date +%Y-%m-%d).json` — Weekly pattern analysis
- `/root/.openclaw/workspace/learning/optimizations-log.md` — History of all recommended + approved changes

**Output locations:**
- Mission Control "Learning" tab (shows weekly patterns + next optimization)
- Weekly summary message to Paul (Telegram)
- Monthly optimization report (with before/after metrics)

## Implementation Steps

### Week 1: Baseline Collection
- Log all actions with feedback
- Collect energy patterns
- Identify initial friction points
- No changes yet—just data gathering

### Week 2: Pattern Analysis
- Run first weekly analysis (Sunday)
- Identify 2-3 strongest patterns
- Propose initial optimizations
- Paul approves/rejects

### Week 3+: Continuous Learning
- Weekly analysis continues
- Approved optimizations take effect
- New feedback collected
- Next optimization cycle (Monday)

## What Gets Measured

### Success Metrics
- **Task completion rate** (baseline → target: 80%+)
- **Average friction score** (baseline → target: <2.5/5)
- **Energy-to-task alignment** (% of tasks done in right energy window)
- **ADHD blocker frequency** (task initiation failures → baseline → target: <1/week)
- **Hyperfocus protection** (% of hyperfocus sessions uninterrupted)
- **Medication adherence** (meds taken on time: target 95%+)

### Diagnostic Metrics
- **Optimal task start time** (by task type)
- **Bowel routine fatigue duration** (hours to recovery)
- **Post-rugby energy recovery** (Tuesday evening → Wednesday full recovery)
- **Context switch cost** (time to refocus after interruption)
- **Decision paralysis triggers** (what conditions cause it?)

## Red Flags (Auto-Alert)
If any of these happen, the system escalates:
- Medication missed 2+ days in a row → Alert Paul
- Task completion drops below 50% → Pause optimizations, revert to baseline
- Energy patterns shift (e.g., normally high 9 AM, suddenly low) → Flag potential health issue
- Friction scores spike → Something in the system broke
- Hyperfocus interrupted >2x in one week → Protect focus time more aggressively

## Notes for Paul
- **You don't have to be perfect.** The system learns from failures too. Missed tasks still get logged—it helps identify why.
- **Feedback is voluntary.** If you can't note quality/friction, just mark done/not-done. That's enough.
- **You control changes.** Every optimization needs your approval. You're the final authority.
- **Privacy first.** All learning data stays local. Nothing leaves the machine.
