#!/bin/bash
# Unified Log Viewer for OpenClaw
# Usage: ./log-viewer.sh [filters] [options]

set +e  # Allow errors - we handle them explicitly

LOG_DIR="/tmp/openclaw"
WORKSPACE="$HOME/.openclaw/workspace"

# Default filters
EVENT_NAME=""
LOG_LEVEL=""
CONTENT_FILTER=""
TIME_RANGE=""
JSON_OUTPUT=false
LIMIT=100

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --event) EVENT_NAME="$2"; shift 2;;
        --level) LOG_LEVEL="$2"; shift 2;;
        --content) CONTENT_FILTER="$2"; shift 2;;
        --time) TIME_RANGE="$2"; shift 2;;
        --json) JSON_OUTPUT=true; shift;;
        --limit) LIMIT="$2"; shift 2;;
        --recent-errors) 
            LOG_LEVEL="error"
            TIME_RANGE="1h"
            shift;;
        --recent-warns)
            LOG_LEVEL="warn"
            TIME_RANGE="1h"
            shift;;
        --tail)
            tail -f "$LOG_DIR"/openclaw-*.log 2>/dev/null | tail -"${2:-50}"
            exit 0
            ;;
        --help|-h)
            cat <<EOF
Unified Log Viewer for OpenClaw

USAGE:
  $0 [OPTIONS]

OPTIONS:
  --event <name>        Filter by event name
  --level <level>       Filter by log level (error, warn, info, debug)
  --content <text>      Filter by content substring
  --time <range>        Time range (1h, 6h, 1d, etc.)
  --json                Output as JSON
  --limit <N>           Limit results (default: 100)
  
QUICK ALIASES:
  --recent-errors       Errors in the last hour
  --recent-warns        Warnings in the last hour
  --tail [N]            Follow log in real-time (last N lines)

EXAMPLES:
  $0 --recent-errors
  $0 --event "cron.run" --level error --limit 50
  $0 --content "timeout" --time 6h --json
  $0 --tail 100
EOF
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1;;
    esac
done

# Find latest log file
LATEST_LOG=$(ls -t "$LOG_DIR"/openclaw-*.log 2>/dev/null | head -1)

if [ -z "$LATEST_LOG" ]; then
    echo "No log files found in $LOG_DIR"
    exit 1
fi

# Build grep filters
GREP_PATTERN=""

if [ -n "$LOG_LEVEL" ]; then
    case $LOG_LEVEL in
        error) GREP_PATTERN="ERROR\|FATAL\|Exception";;
        warn) GREP_PATTERN="WARN";;
        info) GREP_PATTERN="INFO";;
        debug) GREP_PATTERN="DEBUG";;
        *) GREP_PATTERN="$LOG_LEVEL";;
    esac
fi

if [ -n "$EVENT_NAME" ]; then
    [ -n "$GREP_PATTERN" ] && GREP_PATTERN="$GREP_PATTERN.*$EVENT_NAME" || GREP_PATTERN="$EVENT_NAME"
fi

if [ -n "$CONTENT_FILTER" ]; then
    [ -n "$GREP_PATTERN" ] && GREP_PATTERN="$GREP_PATTERN.*$CONTENT_FILTER" || GREP_PATTERN="$CONTENT_FILTER"
fi

# Apply time range filter
if [ -n "$TIME_RANGE" ]; then
    # Convert time range to minutes
    case $TIME_RANGE in
        *h) MINUTES=${TIME_RANGE%h}; MINUTES=$((MINUTES * 60));;
        *d) DAYS=${TIME_RANGE%d}; MINUTES=$((DAYS * 24 * 60));;
        *m) MINUTES=${TIME_RANGE%m};;
        *) MINUTES=60;; # default 1 hour
    esac
    
    CUTOFF=$(date -d "$MINUTES minutes ago" +%s 2>/dev/null || date -v-${MINUTES}M +%s)
    
    # Filter by timestamp (assuming ISO format logs)
    if [ -n "$GREP_PATTERN" ]; then
        RESULTS=$(grep -E "$GREP_PATTERN" "$LATEST_LOG" | awk -v cutoff="$CUTOFF" '
            {
                # Extract timestamp (assumes format: [YYYY-MM-DD HH:MM:SS] or similar)
                match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9]{2}:[0-9]{2}:[0-9]{2}/)
                if (RSTART > 0) {
                    ts = substr($0, RSTART, RLENGTH)
                    gsub(/[T-]/, " ", ts)
                    cmd = "date -d \"" ts "\" +%s 2>/dev/null || date -j -f \"%Y %m %d %H:%M:%S\" \"" ts "\" +%s"
                    cmd | getline timestamp
                    close(cmd)
                    if (timestamp >= cutoff) print
                }
            }
        ')
    else
        RESULTS=$(awk -v cutoff="$CUTOFF" '
            {
                match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9]{2}:[0-9]{2}:[0-9]{2}/)
                if (RSTART > 0) {
                    ts = substr($0, RSTART, RLENGTH)
                    gsub(/[T-]/, " ", ts)
                    cmd = "date -d \"" ts "\" +%s 2>/dev/null || date -j -f \"%Y %m %d %H:%M:%S\" \"" ts "\" +%s"
                    cmd | getline timestamp
                    close(cmd)
                    if (timestamp >= cutoff) print
                }
            }
        ' "$LATEST_LOG")
    fi
else
    # No time filter
    if [ -n "$GREP_PATTERN" ]; then
        RESULTS=$(grep -E "$GREP_PATTERN" "$LATEST_LOG")
    else
        RESULTS=$(cat "$LATEST_LOG")
    fi
fi

# Apply limit
RESULTS=$(echo "$RESULTS" | tail -n "$LIMIT")

# Output
if [ "$JSON_OUTPUT" = true ]; then
    echo "$RESULTS" | jq -R -s 'split("\n") | map(select(length > 0)) | {count: length, lines: .}'
else
    LINE_COUNT=$(echo "$RESULTS" | grep -c . || echo 0)
    echo "Found $LINE_COUNT matching log entries (limit: $LIMIT)"
    echo "----------------------------------------"
    echo "$RESULTS"
fi
