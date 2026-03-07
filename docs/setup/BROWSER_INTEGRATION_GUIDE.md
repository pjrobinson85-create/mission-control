# Agent-Browser Integration with OpenClaw

## How agent-browser Fits Your Workflow

You now have three layers:

1. **Manual Control:** Use agent-browser CLI directly
2. **Scheduled Automation:** Cron jobs + shell scripts
3. **AI Delegation:** Sub-agents using agent-browser for research

---

## Layer 1: Direct CLI Usage

When you want to browse something manually:

```bash
# Open a website
agent-browser open example.com

# Take a screenshot
agent-browser screenshot /tmp/my-page.png

# Get the accessibility tree (good for AI analysis)
agent-browser snapshot -i > /tmp/page-refs.txt

# Interact
agent-browser fill input[name="search"] "NDIS"
agent-browser click "button:has-text('Search')"
agent-browser screenshot /tmp/results.png
```

---

## Layer 2: Scheduled Automation (Cron)

Set up daily/weekly automated browser tasks:

### Example 1: Daily Email Triage (8 AM)

**File:** `/root/.openclaw/cron-jobs/email-triage.json`
```json
{
  "name": "Email Triage (Daily)",
  "schedule": { "kind": "cron", "expr": "0 8 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "Run email triage: Open probinson85@live.com.au inbox, count unread, flag urgent items (URGENT, ASAP, deadline, appointment), take screenshot, return summary"
  },
  "delivery": { "mode": "announce", "channel": "telegram" },
  "sessionTarget": "isolated"
}
```

**Deploy:**
```bash
cron add --job email-triage.json
```

---

### Example 2: Nightly Report Writer Tests (11 PM)

**File:** `/root/.openclaw/cron-jobs/report-tests.json`
```json
{
  "name": "Report Writer Nightly Tests",
  "schedule": { "kind": "cron", "expr": "0 23 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "Test Report Writer: Open localhost:5000, generate reports for SCI, Stroke, MS, CP, TBI, Amputation, verify formatting (Clinical Recommendation section present), save screenshots, return pass/fail summary"
  },
  "delivery": { "mode": "announce", "channel": "telegram" },
  "sessionTarget": "isolated"
}
```

---

### Example 3: Daily NDIS Evidence Check (9 AM)

**File:** `/root/.openclaw/cron-jobs/ndis-evidence.json`
```json
{
  "name": "NDIS Evidence Scanner",
  "schedule": { "kind": "cron", "expr": "0 9 * * *" },
  "payload": {
    "kind": "agentTurn",
    "message": "Check NDIS evidence: Scan probinson85@live.com.au for emails with NDIS, Report, Assessment, Clinical keywords. Count emails from doctors, therapists, hospitals. Return list of evidence sources found. If >3 new items: alert Paul"
  },
  "delivery": { "mode": "announce", "channel": "telegram" },
  "sessionTarget": "isolated"
}
```

---

## Layer 3: AI Research Delegation

When you ask me to research something:

```
"Find 5 free remote testing tools for web apps"
```

I can now:
1. Use agent-browser to visit sites
2. Extract info automatically
3. Compare features & pricing
4. Return structured results

### Example Workflow

```bash
# I would run this (in background)
agent-browser open https://www.browserstack.com
agent-browser snapshot -i > /tmp/browserstack.txt
agent-browser get text ".pricing-table" > /tmp/bs-pricing.txt

agent-browser open https://www.lambdatest.com
agent-browser snapshot -i > /tmp/lambdatest.txt
agent-browser get text ".pricing" > /tmp/lt-pricing.txt

# Return structured comparison to you
```

---

## Your Automation Roadmap

### Week 1: Test & Refine
- ✅ Run email-triage.sh manually
- ✅ Run ndis-evidence-check.sh manually
- ✅ Run report-writer-test.sh manually
- Feedback: What worked? What didn't?

### Week 2: First Automations
- ✅ Deploy email-triage as cron job (8 AM daily)
- ✅ Deploy ndis-evidence as cron job (9 AM daily)
- Get Telegram alerts with results

### Week 3: Scale
- ✅ Add report-writer tests (11 PM nightly)
- ✅ Add calendar sync (8:30 AM daily)
- ✅ Add GitHub PR monitor (9 AM daily)

---

## Troubleshooting

### "agent-browser: command not found"
```bash
npm list -g agent-browser
# Should show: agent-browser@0.15.2
```

### "Browser not installed"
```bash
agent-browser install
agent-browser install --with-deps  # On Linux
```

### "Script hangs on page load"
- Add timeout: `agent-browser wait --timeout 10000`
- Use `--headless` flag (default)
- Check server is running before trying to connect

### "Screenshot not saved"
```bash
# Check permissions
ls -la /tmp/
# Make sure /tmp is writable
chmod 777 /tmp
```

---

## Privacy & Compliance

✅ All browser automation:
- Runs **locally** (no cloud APIs)
- Stores **locally** (/tmp, logs)
- Uses **stored credentials** (encrypted)
- **Audit logged** (/root/.openclaw/logs/)
- **No data exfiltration**

---

## What's Possible Next

Once you're comfortable:

1. **Form filling automation** — Auto-fill NDIS forms
2. **Web scraping** — Track prices, availability
3. **Data extraction** — Pull structured info from websites
4. **Visual regression** — Compare website snapshots over time
5. **Login + flow testing** — Test complete user journeys

---

## Get Started

**Right now:**
```bash
bash /root/.openclaw/workspace/email-triage.sh
```

**Then decide:**
- Schedule it? (add to cron)
- Customize it? (edit keywords)
- Deploy all three? (full automation)

Which would help most? Let me know and I'll set it up!
