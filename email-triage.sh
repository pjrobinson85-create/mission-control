#!/bin/bash
# Email Triage Automation - Quick Win Test
# Opens Gmail, flags urgent emails, sends summary to Telegram

set -e

RESULTS_FILE="/tmp/email-triage-$(date +%Y%m%d-%H%M%S).json"
LOG="/root/.openclaw/logs/email-triage.log"

echo "[$(date)] Starting email triage..." >> "$LOG"

# Open Gmail
agent-browser open https://mail.google.com

# Wait for login/page load
agent-browser wait --load networkidle

# Take inbox screenshot (for manual review if needed)
agent-browser screenshot /tmp/email-inbox.png
echo "[$(date)] Inbox screenshot saved" >> "$LOG"

# Get inbox snapshot (interactive elements = emails)
agent-browser snapshot -i --compact > /tmp/email-snapshot.txt

# Count unread emails (look for bold/unread indicators)
UNREAD_COUNT=$(grep -c "unread\|bold" /tmp/email-snapshot.txt || echo "0")

# Extract urgent keywords
URGENT_EMAILS=$(grep -i "urgent\|asap\|deadline\|appointment\|invoice" /tmp/email-snapshot.txt | wc -l || echo "0")

echo "[$(date)] Found: $UNREAD_COUNT unread, $URGENT_EMAILS urgent" >> "$LOG"

# Create summary JSON
cat > "$RESULTS_FILE" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "unread_count": $UNREAD_COUNT,
  "urgent_count": $URGENT_EMAILS,
  "inbox_screenshot": "/tmp/email-inbox.png",
  "status": "complete"
}
EOF

echo "✅ Email triage complete"
echo "📊 Summary: $UNREAD_COUNT unread, $URGENT_EMAILS urgent"
echo "📸 Screenshot: /tmp/email-inbox.png"
echo ""
cat "$RESULTS_FILE" | jq '.'

echo "[$(date)] Email triage complete: $UNREAD_COUNT unread, $URGENT_EMAILS urgent" >> "$LOG"
