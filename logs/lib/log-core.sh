#!/bin/bash
# Core Logging Library for Bash
# Usage: source log-core.sh

LOGS_DIR="${LOGS_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/data/logs}"
mkdir -p "$LOGS_DIR"

# Secret patterns to redact
SECRET_PATTERNS=(
    "password"
    "token"
    "api_key"
    "apikey"
    "secret"
    "credential"
    "authorization"
    "bearer"
)

# Redact secrets from log data
redact_secrets() {
    local data="$1"
    
    for pattern in "${SECRET_PATTERNS[@]}"; do
        # Redact values after these keys (case-insensitive)
        data=$(echo "$data" | sed -E "s/(\"$pattern\"[[:space:]]*:[[:space:]]*\")[^\"]+/\1***REDACTED***/gi")
        data=$(echo "$data" | sed -E "s/($pattern[[:space:]]*=[[:space:]]*)[^,}]+/\1***REDACTED***/gi")
    done
    
    echo "$data"
}

# Get ISO timestamp
iso_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%S.%3NZ"
}

# Log event to JSONL
log_event() {
    local event_name="$1"
    local level="${2:-info}"
    local message="$3"
    local extra_fields="${4:-{}}"
    
    # Build JSON event
    local timestamp=$(iso_timestamp)
    
    # Validate extra_fields is valid JSON
    if ! echo "$extra_fields" | jq empty 2>/dev/null; then
        extra_fields="{}"
    fi
    
    local event=$(jq -nc \
        --arg ts "$timestamp" \
        --arg event "$event_name" \
        --arg level "$level" \
        --arg msg "$message" \
        --argjson extra "$extra_fields" \
        '{
            timestamp: $ts,
            event: $event,
            level: $level,
            message: $msg
        } + $extra')
    
    # Redact secrets
    event=$(redact_secrets "$event")
    
    # Write to per-event log
    local event_log="$LOGS_DIR/${event_name}.jsonl"
    echo "$event" >> "$event_log"
    
    # Mirror to unified stream
    echo "$event" >> "$LOGS_DIR/all.jsonl"
}

# Convenience functions for different log levels
log_debug() {
    log_event "$1" "debug" "$2" "${3:-{}}"
}

log_info() {
    log_event "$1" "info" "$2" "${3:-{}}"
}

log_warn() {
    log_event "$1" "warn" "$2" "${3:-{}}"
}

log_error() {
    log_event "$1" "error" "$2" "${3:-{}}"
}

log_fatal() {
    log_event "$1" "fatal" "$2" "${3:-{}}"
}

# Export functions
export -f log_event log_debug log_info log_warn log_error log_fatal redact_secrets iso_timestamp
