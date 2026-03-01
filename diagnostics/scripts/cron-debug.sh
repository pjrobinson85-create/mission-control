#!/bin/bash
# Cron Job Debugging Tools
# Usage: 
#   ./cron-debug.sh query [--name <job>] [--status success|failure] [--limit N]
#   ./cron-debug.sh detect-failures
#   ./cron-debug.sh clean-stale

set +e  # Allow errors - we handle them explicitly

WORKSPACE="$HOME/.openclaw/workspace"
STATE_DIR="$WORKSPACE/diagnostics/state"
mkdir -p "$STATE_DIR"

COMMAND="${1:-help}"

# Helper to call OpenClaw cron API
cron_list() {
    openclaw cron list --json 2>/dev/null || echo '{"jobs":[]}'
}

# Query cron history with filters
query_history() {
    local name_filter=""
    local status_filter=""
    local limit=50
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --name) name_filter="$2"; shift 2;;
            --status) status_filter="$2"; shift 2;;
            --limit) limit="$2"; shift 2;;
            *) shift;;
        esac
    done
    
    echo "Querying cron history..."
    echo "Filters: name=${name_filter:-any}, status=${status_filter:-any}, limit=$limit"
    echo ""
    
    # Get all jobs and their runs
    JOBS=$(cron_list | jq -r '.jobs[] | @json')
    
    if [ -z "$JOBS" ]; then
        echo "No cron jobs found"
        return
    fi
    
    echo "$JOBS" | while read -r job; do
        JOB_ID=$(echo "$job" | jq -r '.id')
        JOB_NAME=$(echo "$job" | jq -r '.name')
        
        # Apply name filter
        if [ -n "$name_filter" ] && [[ "$JOB_NAME" != *"$name_filter"* ]]; then
            continue
        fi
        
        # Get runs for this job
        RUNS=$(openclaw cron runs --job-id "$JOB_ID" --limit "$limit" --json 2>/dev/null || echo '{"runs":[]}')
        
        echo "Job: $JOB_NAME (ID: $JOB_ID)"
        echo "$RUNS" | jq -r '.runs[] | 
            select(if "'$status_filter'" != "" then .status == "'$status_filter'" else true end) | 
            "  [\(.status)] \(.startedAtMs | tonumber / 1000 | strftime("%Y-%m-%d %H:%M:%S")) - Duration: \((.finishedAtMs // 0 - .startedAtMs) / 1000)s"'
        echo ""
    done
}

# Detect persistent failures (3+ failures in 6 hours)
detect_failures() {
    echo "Detecting persistent cron job failures..."
    echo ""
    
    SIX_HOURS_AGO_MS=$(($(date +%s) * 1000 - 6 * 60 * 60 * 1000))
    
    JOBS=$(cron_list | jq -r '.jobs[] | @json')
    
    if [ -z "$JOBS" ]; then
        echo "No cron jobs found"
        return
    fi
    
    FOUND_FAILURES=false
    
    echo "$JOBS" | while read -r job; do
        JOB_ID=$(echo "$job" | jq -r '.id')
        JOB_NAME=$(echo "$job" | jq -r '.name')
        
        # Get recent runs
        RUNS=$(openclaw cron runs --job-id "$JOB_ID" --limit 20 --json 2>/dev/null || echo '{"runs":[]}')
        
        # Count failures in last 6 hours
        FAILURE_COUNT=$(echo "$RUNS" | jq -r --arg cutoff "$SIX_HOURS_AGO_MS" '
            [.runs[] | select(.startedAtMs >= ($cutoff | tonumber) and .status == "failure")] | length
        ')
        
        if [ "$FAILURE_COUNT" -ge 3 ]; then
            echo "⚠️  PERSISTENT FAILURE: $JOB_NAME"
            echo "   Failures in last 6 hours: $FAILURE_COUNT"
            echo "   Recent runs:"
            echo "$RUNS" | jq -r '.runs[0:5][] | 
                "     [\(.status)] \(.startedAtMs | tonumber / 1000 | strftime("%Y-%m-%d %H:%M:%S"))"'
            echo ""
            FOUND_FAILURES=true
        fi
    done
    
    if [ "$FOUND_FAILURES" = false ]; then
        echo "✓ No persistent failures detected"
    fi
}

# Clean stale jobs (stuck in "running" for >2 hours)
clean_stale() {
    echo "Cleaning stale cron jobs..."
    echo ""
    
    TWO_HOURS_AGO_MS=$(($(date +%s) * 1000 - 2 * 60 * 60 * 1000))
    
    JOBS=$(cron_list | jq -r '.jobs[] | @json')
    
    if [ -z "$JOBS" ]; then
        echo "No cron jobs found"
        return
    fi
    
    CLEANED=0
    
    echo "$JOBS" | while read -r job; do
        JOB_ID=$(echo "$job" | jq -r '.id')
        JOB_NAME=$(echo "$job" | jq -r '.name')
        
        # Get recent runs
        RUNS=$(openclaw cron runs --job-id "$JOB_ID" --limit 10 --json 2>/dev/null || echo '{"runs":[]}')
        
        # Find stale running jobs
        STALE=$(echo "$RUNS" | jq -r --arg cutoff "$TWO_HOURS_AGO_MS" '
            [.runs[] | select(.status == "running" and .startedAtMs < ($cutoff | tonumber))]
        ')
        
        STALE_COUNT=$(echo "$STALE" | jq 'length')
        
        if [ "$STALE_COUNT" -gt 0 ]; then
            echo "Found $STALE_COUNT stale run(s) for: $JOB_NAME"
            echo "$STALE" | jq -r '.[] | 
                "  Run started: \(.startedAtMs | tonumber / 1000 | strftime("%Y-%m-%d %H:%M:%S"))"'
            echo "  (Marking as failed - manual intervention required)"
            ((CLEANED++))
            echo ""
        fi
    done
    
    if [ $CLEANED -eq 0 ]; then
        echo "✓ No stale jobs found"
    else
        echo "⚠️  Found $CLEANED stale job(s) - manual cleanup recommended"
    fi
}

# Show help
show_help() {
    cat <<EOF
Cron Job Debugging Tools

USAGE:
  $0 query [options]           Query cron job history
  $0 detect-failures           Detect jobs with 3+ failures in 6 hours
  $0 clean-stale               Find jobs stuck in "running" for >2 hours

QUERY OPTIONS:
  --name <pattern>             Filter by job name (substring match)
  --status <success|failure>   Filter by status
  --limit <N>                  Limit results (default: 50)

EXAMPLES:
  $0 query --name "Health" --status failure --limit 10
  $0 detect-failures
  $0 clean-stale
EOF
}

# Route command
case $COMMAND in
    query) shift; query_history "$@";;
    detect-failures) detect_failures;;
    clean-stale) clean_stale;;
    help|--help|-h) show_help;;
    *) echo "Unknown command: $COMMAND"; show_help; exit 1;;
esac
