# OpenClaw Onboarding Improvement Proposal

**Based on:** Real-world usage with Paul (ADHD + physical disability context)  
**Date:** 2026-03-07  
**Goal:** Make onboarding capture what actually matters for personalized AI assistance

---

## Current ONBOARDING.md vs Real Usage Gap

### What ONBOARDING.md Asks
1. Basic identity (name, timezone)
2. Communication preferences (style, pet peeves)
3. Goals (primary goal, 1-year vision, ideal life)
4. Work style (productivity time, async vs real-time)
5. Context (projects, key people)
6. Agent personality preferences

### What We Actually Needed to Know (Paul's Case)

#### **Critical Medical/Accessibility Context (MISSING)**
- **Condition:** Quadriplegic, wheelchair user
- **Fatigue management:** Primary constraint (not pain)
- **Medication schedule:** Morning/evening meds, bowel routine timing
- **Thermoregulation limits:** 29°C max / 75% humidity (health risk)
- **Voice control needs:** Open to voice notes, not currently using

#### **Neurodivergence Support (MISSING)**
- **ADHD Profile:**
  - Task initiation struggles
  - Hyperfocus sessions (can't stop once locked in)
  - Working memory issues (needs external capture)
  - Decision paralysis from uncertainty
  - Dopamine-driven (needs easy wins + big challenges)
- **Communication needs:**
  - Fewer, bigger check-ins (not constant pings)
  - Direct, honest feedback (no sugar-coating)
  - Ramping reminders (not one-shot)

#### **Daily Rhythm (PARTIAL)**
- Support worker arrival time (6:30 AM)
- Variable morning routine (bowel care 2x/week)
- Active hours & energy patterns
- Best work windows (morning/lunch)

#### **Technology Setup (MISSING)**
- **Hardware:** Ollama models, local vs cloud preferences
- **Existing tools:** Telegram primary, phone list for tasks
- **Integration needs:** Voice notes, GitHub, email whitelist

#### **Project Tracking (TOO VAGUE)**
Current ONBOARDING.md asks: "What are you currently working on?"

Real need:
- **Project 1:** NDIS Review (Timeline: ASAP, Status: Blocked on uncertainty)
- **Project 2:** Report Writer (Timeline: Ready for testing, Status: 85% done)
- **Project 3:** Remote Testing Access (Priority: High, blocks launch)
- **3-month goal:** NDIS + Report Writer + Jeetrike mods → then business ideas

#### **System Boundaries (MISSING)**
- **Do:** Keep task list, ramping reminders, delegate night work, suggest dopamine hits
- **Don't:** Be annoying, spam notifications, suggest stuff that doesn't help
- **Test period:** 3 weeks feedback loop

---

## Proposed Onboarding v2.0

### Phase 1: Essential Context (5 min)
1. **Name & Timezone** (unchanged)
2. **Communication channel** (Telegram/Discord/Signal/etc.)
3. **Notification preference:**
   - Frequent check-ins (every hour)
   - Moderate (few times a day)
   - Minimal (only critical)
   - Custom schedule

### Phase 2: Accessibility & Health (NEW - 3 min)
4. **Physical accessibility needs:**
   - Mobility limitations?
   - Voice control preference?
   - Environmental sensitivities? (heat, noise, etc.)
5. **Health context:**
   - Medication reminders needed?
   - Routine tracking? (bowel care, therapy, etc.)
   - Fatigue management? (pacing, energy tracking)
6. **Neurodivergence support:**
   - ADHD? (task initiation, hyperfocus, working memory)
   - Autism? (sensory, routine, communication)
   - Other? (anxiety, depression, PTSD)

### Phase 3: Work Style (5 min)
7. **Productivity rhythm:**
   - Best work time? (morning/afternoon/evening)
   - Hyperfocus mode? (needs break reminders)
   - Decision-making style? (prefers choices vs delegation)
8. **Task capture method:**
   - Voice notes?
   - Phone list?
   - Telegram messages?
   - Email?
9. **Communication style:**
   - Direct/detailed/brief/casual
   - Emoji preference (none/minimal/expressive)
   - Correction style (gentle/direct/brutally honest)

### Phase 4: Goals & Projects (5 min)
10. **Primary goal right now** (1-2 sentences)
11. **3-6 month goal** (what does winning look like?)
12. **Current projects** (name, timeline, status for each):
    - Project 1: _____ (Timeline: _____, Status: _____)
    - Project 2: _____ (Timeline: _____, Status: _____)
    - Project 3: _____ (Timeline: _____, Status: _____)

### Phase 5: Agent Personality (2 min)
13. **Agent personality:**
    - Helpful but not intrusive
    - Proactive vs reactive
    - Humor level (none/occasional/frequent)
14. **System boundaries:**
    - What should the agent DO proactively?
    - What should the agent NEVER do?

### Phase 6: Tech Setup (OPTIONAL - 5 min)
15. **Local models available?** (Ollama URL, model names)
16. **Email integration?** (Gmail, Outlook, whitelist)
17. **Calendar access?** (Google, Microsoft)
18. **GitHub integration?** (repo links, notification preferences)

---

## Implementation Recommendations

### 1. Progressive Disclosure
- **Tier 1 (Required):** Name, timezone, communication channel (1 min)
- **Tier 2 (Recommended):** Accessibility, work style, goals (10 min)
- **Tier 3 (Optional):** Tech integrations, deep customization (5-10 min)

### 2. Drip Mode Enhancements
Instead of asking random questions, follow a logical flow:
1. Day 1: Essential (name, timezone, channel)
2. Day 2: Accessibility & health (if relevant)
3. Day 3: Work style & communication
4. Day 4: Goals & projects
5. Day 5: Agent personality

### 3. Smart Defaults
- **ADHD mode:** Auto-enable ramping reminders, dopamine hit suggestions, task capture
- **Fatigue management mode:** Auto-enable energy tracking, pacing reminders
- **Hyperfocus mode:** Auto-enable break reminders every 45 min

### 4. Context Inference
Instead of asking everything, infer from conversation:
- Timezone from first message timestamp
- Communication style from message patterns
- Work hours from activity patterns
- Project priorities from what they ask about

### 5. Editable Onboarding
Allow users to update answers anytime:
```
User: "Update onboarding: I'm now using voice notes for task capture"
Agent: "Updated USER.md: Task capture method → Voice notes"
```

---

## Example: Paul's Completed Onboarding (What It Should Look Like)

### Essential Context
- **Name:** Paul
- **Timezone:** Australia/Brisbane (GMT+10)
- **Communication:** Telegram (primary), phone voice notes (secondary)
- **Notification preference:** Fewer, bigger check-ins (not constant pings)

### Accessibility & Health
- **Physical:** Quadriplegic (wheelchair), undiagnosed ADHD
- **Fatigue management:** Primary constraint (not pain)
- **Medication:** Morning 9 AM, Evening 6:30 PM
- **Routine:** Bowel care Mon & Thu (Peristeen), Senakot Sun & Wed
- **Environmental limits:** 29°C max / 75% humidity max (thermoregulation)

### Neurodivergence Support
- **ADHD:** Task initiation struggles, hyperfocus, working memory issues
- **Communication:** Direct, honest, no sugar-coating
- **Triggers:** Uncertainty, decision paralysis, distraction (housemates)
- **Fuel:** Easy wins for dopamine + big challenges after good sleep

### Work Style
- **Best work time:** Morning/lunch
- **Hyperfocus mode:** Can't stop once locked in (needs break reminders every 45 min)
- **Decision-making:** Prefers choices but happy with prioritization
- **Task capture:** Phone list (current), wants voice note system

### Goals & Projects
- **3-month goal:** NDIS + Report Writer + Jeetrike mods → then business ideas
- **Project 1:** NDIS Review (ASAP, blocked on clarity)
- **Project 2:** Report Writer (Ready for testing, 85% done)
- **Project 3:** Remote Testing Access (High priority, blocks launch)

### Agent Personality
- **Style:** Helpful but not annoying, direct, honest
- **Proactive:** Yes — run background tasks during downtime (nights/off-hours)
- **Humor:** Minimal
- **Boundaries:**
  - DO: Keep task list, ramping reminders, suggest dopamine hits, delegate night work
  - DON'T: Spam notifications, suggest stuff that doesn't help

### Tech Setup
- **Local models:** Ollama at 192.168.1.174:11434 (qwen3.5:35b primary)
- **Email:** Whitelist only (probinson85@live.com.au, paulrobinson85@outlook.com.au)
- **Calendar:** Google Calendar (Chris's account, PJ's calendar read)
- **GitHub:** report-writer repo (needs integration)

---

## Benefits of This Approach

1. **Captures critical health/accessibility context** (current version misses)
2. **Neurodivergence support built-in** (ADHD, autism, etc.)
3. **Project tracking with status** (not just "what are you working on?")
4. **Clear system boundaries** (what to do, what not to do)
5. **Tech integration upfront** (Ollama, email, calendar, GitHub)
6. **Progressive disclosure** (don't overwhelm on day 1)
7. **Editable anytime** (update as needs change)

---

## Next Steps

1. **Test with Paul:** See if this captures everything needed
2. **Propose to OpenClaw team:** Submit as onboarding v2.0
3. **Create templates:** ADHD mode, fatigue management mode, etc.
4. **Build inference engine:** Learn from conversation, reduce questions
5. **Feedback loop:** 3-week trial, iterate

---

**Prepared by:** Chris Cole (AI assistant to Paul)  
**Contact:** Available via OpenClaw Discord or GitHub
