#!/bin/bash
# NDIS Evidence Collection Automation
# Scans email for reports/evidence from providers, extracts key info

set -e

RESULTS_DIR="/tmp/ndis-evidence-$(date +%Y%m%d)"
LOG="/root/.openclaw/logs/ndis-evidence.log"
GMAIL_URL="https://mail.google.com/mail/u/0"

mkdir -p "$RESULTS_DIR"

echo "[$(date)] Starting NDIS evidence check..." >> "$LOG"
echo "🔍 NDIS Evidence Collection"
echo "============================"

# Keywords to search for evidence
KEYWORDS=(
    "NDIS"
    "Report"
    "Assessment"
    "Evaluation"
    "Recommendation"
    "Clinical"
)

echo "Opening Gmail..."
agent-browser open "$GMAIL_URL"

# Wait for Gmail to load
agent-browser wait --load networkidle

# Take inbox screenshot
agent-browser screenshot "$RESULTS_DIR/inbox.png"
echo "📸 Screenshot saved: $RESULTS_DIR/inbox.png"

# Get interactive snapshot (emails)
agent-browser snapshot -i --compact > "$RESULTS_DIR/emails.txt"

# Parse for evidence items
echo ""
echo "📧 Evidence Items Found:"
echo "========================"

EVIDENCE_COUNT=0

for keyword in "${KEYWORDS[@]}"; do
    # Search Gmail for keyword
    agent-browser open "$GMAIL_URL?q=$keyword"
    agent-browser wait --load networkidle
    
    # Count results
    RESULTS=$(agent-browser get count "[role='row']" || echo "0")
    
    if [ "$RESULTS" -gt 0 ]; then
        EVIDENCE_COUNT=$((EVIDENCE_COUNT + RESULTS))
        echo "Found: $RESULTS emails with '$keyword'"
        
        # Screenshot this search
        agent-browser screenshot "$RESULTS_DIR/search-${keyword,,}.png"
    fi
done

# Go back to inbox
agent-browser open "$GMAIL_URL"
agent-browser wait --load networkidle

# Extract sender names from key providers
echo ""
echo "🏥 Evidence Sources:"
echo "==================="

# Look for emails from known providers
PROVIDERS=(
    "doctor"
    "gp"
    "physiotherapist"
    "therapist"
    "psychologist"
    "hospital"
    "clinic"
    "medical"
)

PROVIDER_COUNT=0

for provider in "${PROVIDERS[@]}"; do
    agent-browser open "$GMAIL_URL?q=from:*$provider*"
    agent-browser wait 2000
    
    MATCHES=$(agent-browser get count "[role='row']" || echo "0")
    if [ "$MATCHES" -gt 0 ]; then
        PROVIDER_COUNT=$((PROVIDER_COUNT + MATCHES))
        echo "  • $provider: $MATCHES emails"
    fi
done

# Create summary JSON
SUMMARY_FILE="$RESULTS_DIR/summary.json"
cat > "$SUMMARY_FILE" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "total_evidence_items": $EVIDENCE_COUNT,
  "provider_sources": $PROVIDER_COUNT,
  "screenshots": {
    "inbox": "$RESULTS_DIR/inbox.png",
    "searches": "$RESULTS_DIR/search-*.png"
  },
  "keywords_checked": ${#KEYWORDS[@]},
  "providers_checked": ${#PROVIDERS[@]},
  "output_dir": "$RESULTS_DIR"
}
EOF

echo ""
echo "📊 Summary"
echo "=========="
echo "Total evidence items: $EVIDENCE_COUNT"
echo "Provider sources found: $PROVIDER_COUNT"
echo "Summary saved: $SUMMARY_FILE"
echo ""

# Display summary
cat "$SUMMARY_FILE" | jq '.'

echo ""
echo "✅ NDIS evidence check complete"
echo "[$(date)] Evidence check done: $EVIDENCE_COUNT items, $PROVIDER_COUNT sources" >> "$LOG"

# Return results for integration
echo "RESULTS_DIR=$RESULTS_DIR"
