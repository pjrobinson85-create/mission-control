# Agent-Browser Automation Plan for Paul

## Overview
Agent-browser enables web automation without manual interaction. Here are your highest-value automation opportunities, ranked by impact + feasibility.

---

## 🔴 TIER 1: HIGH IMPACT (Do First)

### 1. **NDIS Review Evidence Collection** (BLOCKS: Your #1 Priority)
**Problem:** Manual email gathering from multiple providers is slow, scattered, uncertain

**Automation:**
```bash
# Daily browser check of email accounts for:
# - Doctor reports (from GP email)
# - OT reports (therapist emails)
# - EP reports (Exercise Physiology reports)
# - Psychologist reports
# - Pathology results

agent-browser open https://mail.google.com
agent-browser wait "#id-login-button"  # Wait for login
agent-browser fill input[type="email"] "probinson85@live.com.au"
agent-browser click "#id-next"
agent-browser screenshot ./ndis-inbox.png
agent-browser snapshot > ndis-inbox-refs.txt
```

**Workflow:**
- Cron job: Daily 9 AM check
- Scan inbox for "NDIS", "report", "evidence", "assessment"
- Extract sender names & subjects
- Add to Mission Control "Blocked Items" section with links
- Alert if >3 new evidence items arrive

**Time saved:** 20 mins/day × 5 days = 100 mins/week

---

### 2. **Report Writer Testing Automation** (UNBLOCKS: Your #2 Project)
**Problem:** Manual testing of report generation with different conditions is repetitive

**Automation:**
```bash
# Test loop: Open report writer, generate 5 sample reports, check formatting
agent-browser open http://localhost:5000
agent-browser wait "h1:has-text('Report Writer')"

# For each condition (SCI, stroke, MS, etc.):
agent-browser select "condition" "Spinal Cord Injury"
agent-browser click "Generate Report"
agent-browser wait ".report-output"
agent-browser screenshot ./report-sci.png
agent-browser get text ".report-output" > report-sci.txt
```

**Workflow:**
- Nightly test run (11 PM)
- Generate 5 different condition reports
- Compare against baseline PDFs
- Log any formatting changes
- Email you summary by 8 AM

**Time saved:** 45 mins testing → 5 mins review

---

### 3. **Email Response Triage** (Daily dopamine hit)
**Problem:** You read emails manually; some need immediate responses, others can wait

**Automation:**
```bash
# Morning routine: Open both email accounts, flag urgent ones
agent-browser open https://mail.google.com
agent-browser wait --load networkidle

# Find emails with keywords: URGENT, ASAP, deadline, appointment, invoice
agent-browser find text "URGENT" click "--all"  # Select all urgent
agent-browser click ".star-button"  # Star them

# Screenshot inbox
agent-browser screenshot ./email-triage.png
```

**Workflow:**
- 8 AM: Auto-run, flag urgent emails
- You get 3-5 starred items to respond to (instead of 50+ unread)
- Rest are archived/scheduled for later
- Sends you quick summary: "3 urgent, 12 waiting"

**Time saved:** 15 mins/day email scanning

---

## 🟡 TIER 2: MEDIUM IMPACT (After Tier 1)

### 4. **Google Calendar → Mission Control Sync**
**Problem:** Your calendar isn't in Mission Control yet; need manual check

**Automation:**
```bash
# Open Google Calendar, extract events
agent-browser open https://calendar.google.com
agent-browser wait ".event-title"
agent-browser snapshot -i  # Interactive elements (events)
# Parse events and POST to /mc/data endpoint
```

**Workflow:**
- Every morning 8 AM: Fetch today + tomorrow's events
- Add to Mission Control dashboard
- Show countdown to next meeting
- Add to Telegram reminder if <2 hours away

**Time saved:** 5 mins/day calendar checking

---

### 5. **GitHub Report-Writer PR Monitoring** (For business launch)
**Problem:** You need to check PR status, reviews, test results manually

**Automation:**
```bash
# Open GitHub report-writer repo
agent-browser open https://github.com/YOUR-REPO/report-writer/pulls
agent-browser wait ".pr-list"

# Screenshot PR board, extract status
agent-browser snapshot -i > pr-status.txt
# Parse: "3 open, 1 in review, 0 blocked"
```

**Workflow:**
- 9 AM daily: Check PR status
- If any blocked: Alert you with blocker details
- If ready to merge: Notify stakeholders (Georgia, etc.)
- Summarize in Telegram: "Report Writer: 1 PR ready, 2 under review"

**Time saved:** 10 mins/day PR checking

---

### 6. **NDIS Application Status Checker** (Peace of mind)
**Problem:** You're waiting on NDIS decisions; no proactive notification when status changes

**Automation:**
```bash
# NDIS portal check (if available via web login)
agent-browser open https://my.ndis.gov.au
agent-browser fill "username" "[STORED]"
agent-browser fill "password" "[STORED]"
agent-browser click "Login"
agent-browser wait ".application-status"

# Extract status: "Awaiting assessment", "Approved", "Pending review", etc.
agent-browser get text ".status-badge" > ndis-status.txt
```

**Workflow:**
- Daily 10 AM: Check NDIS portal
- If status changes: Alert immediately via Telegram
- Log date of change for documentation
- Email summary to Lynne if needed

**Time saved:** 5 mins/day + peace of mind

---

## 🟢 TIER 3: NICE-TO-HAVE (Polish)

### 7. **Weather Monitoring with Screenshots**
**Problem:** Already monitoring, but browser screenshots could help spot unusual conditions

**Automation:**
- Daily 8 AM: Fetch BoM weather, take screenshot of radar
- Check thermoregulation thresholds (29°C / 75% humidity)
- Alert if at-risk conditions predicted

---

### 8. **News Aggregation for "Intel" Tab**
**Problem:** Manually adding intel; could auto-scrape relevant sources

**Automation:**
- Daily 9 AM: Visit Qwen, NDIS, accessibility news sources
- Extract headlines matching keywords
- Auto-add to Mission Control Intel tab

---

### 9. **Jeetrike Parts Tracker**
**Problem:** Hunting for bike parts manually across sites

**Automation:**
- Weekly: Check eBay, Marketplace, bike forums for Jeetrike parts
- Screenshot listings matching your wishlist
- Price compare across sites
- Alert if price drops below threshold

---

## 🔧 Implementation Priority

**Week 1:**
1. ✅ NDIS evidence collector (Gmail scraper)
2. ✅ Report Writer test automation
3. ✅ Email triage urgency filter

**Week 2:**
4. ✅ Calendar sync to Mission Control
5. ✅ GitHub PR monitor

**Week 3:**
6. ✅ NDIS portal status checker (if portal login works)

---

## 💾 Integration Points

### With OpenClaw Cron
```json
{
  "action": "add",
  "job": {
    "name": "NDIS Evidence Check",
    "schedule": { "kind": "cron", "expr": "0 9 * * *" },
    "payload": {
      "kind": "agentTurn",
      "message": "Run NDIS email scanner: check for new evidence in probinson85@live.com.au, extract doc names, update Mission Control blockers"
    },
    "sessionTarget": "isolated"
  }
}
```

### With Your Telegram
- Automated summaries posted to @Jimmyj12345
- Links to screenshots in Mission Control
- Quick actions: "View full inbox", "Approve PR", "Check calendar"

### With Mission Control Dashboard
- New Intel tab entries auto-populated
- Calendar events synced
- Task blockers auto-detected (waiting on NDIS, email response needed, etc.)

---

## ⚠️ Privacy & Safety

All automations:
- ✅ Run locally (no cloud API calls)
- ✅ Use stored credentials encrypted (or Telegram OAuth)
- ✅ Store screenshots locally only
- ✅ Audit logged to `/root/.openclaw/logs/agent-browser-audit.log`
- ✅ No data exfiltrated (email content stays private)

---

## Next Steps

1. **Approve Tier 1 automations** — Which would help most?
2. **Test with one task** — Pick NDIS evidence collector or email triage
3. **Iterate fast** — Run for 1 week, adjust based on real workflow

Which ONE would unblock you most right now?
- NDIS evidence gathering (blocks everything)
- Report Writer testing (unblocks launch)
- Email triage (daily dopamine)
- Calendar sync (planning clarity)
