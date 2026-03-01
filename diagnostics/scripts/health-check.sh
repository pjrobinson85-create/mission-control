#!/bin/bash
# System Health Check - Comprehensive diagnostic for OpenClaw gateway
# Usage: ./health-check.sh [--verbose]

set +e  # Don't exit on individual check failures - we want to see all results

VERBOSE=false
[[ "$1" == "--verbose" ]] && VERBOSE=true

STATE_DIR="$HOME/.openclaw/workspace/diagnostics/state"
mkdir -p "$STATE_DIR"

STATE_FILE="$STATE_DIR/health-state.json"
LOG_DIR="/tmp/openclaw"
PASS=0
FAIL=0
DETAILS=()

# Helper functions
pass() {
    ((PASS++))
    $VERBOSE && echo "✓ $1"
}

fail() {
    ((FAIL++))
    echo "✗ $1" >&2
    DETAILS+=("$1")
}

info() {
    $VERBOSE && echo "ℹ $1"
}

# 1. Check if gateway process is running
info "Checking gateway process..."
if pgrep -f "openclaw-gateway" > /dev/null; then
    PID=$(pgrep -f "openclaw-gateway")
    pass "Gateway process running (PID: $PID)"
else
    fail "Gateway process not running"
fi

# 2. Check if port is reachable
info "Checking port 18789..."
if timeout 2 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/18789" 2>/dev/null; then
    pass "Port 18789 reachable"
else
    fail "Port 18789 unreachable"
fi

# 3. Check gateway RPC health
info "Checking gateway RPC..."
if command -v openclaw >/dev/null 2>&1; then
    if timeout 5 openclaw gateway status >/dev/null 2>&1; then
        pass "Gateway RPC responding"
    else
        fail "Gateway RPC not responding"
    fi
else
    info "openclaw CLI not in PATH, skipping RPC check"
fi

# 4. Check recent error logs (last 100 lines)
info "Scanning recent logs for errors..."
if [ -d "$LOG_DIR" ]; then
    LATEST_LOG=$(ls -t "$LOG_DIR"/openclaw-*.log 2>/dev/null | head -1)
    if [ -n "$LATEST_LOG" ]; then
        ERROR_COUNT=$(tail -100 "$LATEST_LOG" | grep -ci "error\|exception\|fatal" || true)
        if [ "$ERROR_COUNT" -gt 10 ]; then
            fail "High error count in recent logs: $ERROR_COUNT errors in last 100 lines"
        elif [ "$ERROR_COUNT" -gt 0 ]; then
            pass "Recent logs have $ERROR_COUNT errors (acceptable threshold)"
        else
            pass "No errors in recent logs"
        fi
    else
        info "No log files found in $LOG_DIR"
    fi
else
    info "Log directory $LOG_DIR does not exist"
fi

# 5. Check disk space
info "Checking disk space..."
DISK_USAGE=$(df -h "$HOME" | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    fail "Disk usage critical: ${DISK_USAGE}%"
elif [ "$DISK_USAGE" -gt 75 ]; then
    pass "Disk usage high: ${DISK_USAGE}% (warning threshold)"
else
    pass "Disk usage healthy: ${DISK_USAGE}%"
fi

# 6. Check workspace integrity
info "Checking workspace integrity..."
WORKSPACE="$HOME/.openclaw/workspace"
if [ -d "$WORKSPACE" ]; then
    REQUIRED_FILES=("AGENTS.md" "SOUL.md" "USER.md" "learnings")
    MISSING=()
    for f in "${REQUIRED_FILES[@]}"; do
        [ ! -e "$WORKSPACE/$f" ] && MISSING+=("$f")
    done
    if [ ${#MISSING[@]} -eq 0 ]; then
        pass "Workspace structure intact"
    else
        fail "Workspace missing files: ${MISSING[*]}"
    fi
else
    fail "Workspace directory not found: $WORKSPACE"
fi

# 7. Output summary
echo ""
echo "========== HEALTH CHECK SUMMARY =========="
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "Failures:"
    for detail in "${DETAILS[@]}"; do
        echo "  - $detail"
    done
    echo ""
    
    # Alert frequency tracking (exponential backoff)
    if [ -f "$STATE_FILE" ]; then
        LAST_ALERT=$(jq -r '.lastAlertMs // 0' "$STATE_FILE" 2>/dev/null || echo 0)
        ALERT_COUNT=$(jq -r '.alertCount // 0' "$STATE_FILE" 2>/dev/null || echo 0)
    else
        LAST_ALERT=0
        ALERT_COUNT=0
    fi
    
    NOW_MS=$(date +%s%3N)
    TIME_SINCE_LAST=$((NOW_MS - LAST_ALERT))
    
    # Exponential backoff: 5min, 15min, 1hr, 3hr, 12hr
    BACKOFF_MS=$((5 * 60 * 1000 * (3 ** ALERT_COUNT)))
    MAX_BACKOFF=$((12 * 60 * 60 * 1000))
    [ $BACKOFF_MS -gt $MAX_BACKOFF ] && BACKOFF_MS=$MAX_BACKOFF
    
    if [ $TIME_SINCE_LAST -gt $BACKOFF_MS ]; then
        echo "⚠️  ALERT: Health check failures detected (attempt #$((ALERT_COUNT + 1)))"
        echo "{\"lastAlertMs\": $NOW_MS, \"alertCount\": $((ALERT_COUNT + 1))}" > "$STATE_FILE"
    else
        NEXT_ALERT_SEC=$(((BACKOFF_MS - TIME_SINCE_LAST) / 1000))
        echo "Next alert in $NEXT_ALERT_SEC seconds (backoff active)"
    fi
    
    exit 1
else
    echo "✓ All checks passed"
    # Reset alert count on success
    echo "{\"lastAlertMs\": 0, \"alertCount\": 0}" > "$STATE_FILE"
    exit 0
fi
