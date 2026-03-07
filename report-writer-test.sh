#!/bin/bash
# Report Writer Test Automation
# Generates test reports for all conditions, checks formatting, compares output

set -e

TEST_DIR="/tmp/report-writer-tests-$(date +%Y%m%d-%H%M%S)"
LOG="/root/.openclaw/logs/report-writer-tests.log"
REPORT_URL="${REPORT_URL:-http://localhost:5000}"

mkdir -p "$TEST_DIR"

echo "[$(date)] Starting Report Writer tests..." >> "$LOG"
echo "📝 Report Writer Test Automation"
echo "================================"
echo "URL: $REPORT_URL"
echo "Output: $TEST_DIR"
echo ""

# Check if server is running
if ! curl -s "$REPORT_URL" > /dev/null; then
    echo "❌ Report Writer not accessible at $REPORT_URL"
    exit 1
fi

# Array of test conditions
CONDITIONS=(
    "Spinal Cord Injury"
    "Stroke"
    "Multiple Sclerosis"
    "Cerebral Palsy"
    "Traumatic Brain Injury"
    "Amputation"
)

TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

for condition in "${CONDITIONS[@]}"; do
    TEST_COUNT=$((TEST_COUNT + 1))
    echo "🧪 Test $TEST_COUNT: $condition"
    
    # Open report writer
    agent-browser open "$REPORT_URL"
    
    # Wait for page load
    agent-browser wait --load networkidle
    
    # Select condition
    agent-browser find role combobox select --name "Condition"
    agent-browser find text "$condition" click
    
    # Wait for selection
    sleep 1
    
    # Click generate
    agent-browser find role button click --name "Generate"
    
    # Wait for output
    agent-browser wait --load networkidle
    sleep 2
    
    # Take screenshot of report
    REPORT_IMG="$TEST_DIR/${condition// /_}.png"
    agent-browser screenshot "$REPORT_IMG" --full
    
    # Extract report text
    REPORT_TXT="$TEST_DIR/${condition// /_}.txt"
    agent-browser get text "[class*='report']" > "$REPORT_TXT" || echo "Report content extracted"
    
    # Validate report
    if grep -q "Clinical Recommendation\|Rationale\|Functional Limitations" "$REPORT_TXT" 2>/dev/null; then
        echo "   ✅ PASS - Report structure valid"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "   ❌ FAIL - Missing report sections"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
done

# Summary
echo "================================"
echo "📊 Test Results"
echo "================================"
echo "Total:  $TEST_COUNT"
echo "Passed: $PASS_COUNT ✅"
echo "Failed: $FAIL_COUNT ❌"
echo "Pass Rate: $((PASS_COUNT * 100 / TEST_COUNT))%"
echo ""
echo "📁 Reports saved to: $TEST_DIR"
echo ""

# Create results JSON
RESULTS_FILE="$TEST_DIR/results.json"
cat > "$RESULTS_FILE" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "total_tests": $TEST_COUNT,
  "passed": $PASS_COUNT,
  "failed": $FAIL_COUNT,
  "pass_rate": $((PASS_COUNT * 100 / TEST_COUNT)),
  "output_dir": "$TEST_DIR"
}
EOF

echo "Results saved to: $RESULTS_FILE"

# Log completion
echo "[$(date)] Report Writer tests complete: $PASS_COUNT/$TEST_COUNT passed" >> "$LOG"

# Exit with appropriate code
if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed - review manually"
    exit 1
fi
