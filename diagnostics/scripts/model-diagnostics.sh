#!/bin/bash
# Model & Provider Diagnostics
# Usage: 
#   ./model-diagnostics.sh status
#   ./model-diagnostics.sh canary [model]
#   ./model-diagnostics.sh usage

set +e  # Allow errors - we handle them explicitly

WORKSPACE="$HOME/.openclaw/workspace"
CONFIG="$HOME/.openclaw/openclaw.json"

COMMAND="${1:-help}"

# Show current model status
show_status() {
    echo "========== MODEL STATUS =========="
    echo ""
    
    # Get default model from config
    if [ -f "$CONFIG" ]; then
        DEFAULT_MODEL=$(jq -r '.agent.defaultModel // "not set"' "$CONFIG")
        echo "Default Model: $DEFAULT_MODEL"
        
        # Check Ollama connection if using local models
        if [[ "$DEFAULT_MODEL" == ollama/* ]]; then
            echo ""
            echo "Ollama Connection:"
            OLLAMA_HOST=$(jq -r '.providers.ollama.url // "http://192.168.1.174:11434"' "$CONFIG")
            echo "  Host: $OLLAMA_HOST"
            
            if curl -s --max-time 2 "$OLLAMA_HOST/api/tags" >/dev/null 2>&1; then
                echo "  Status: ✓ Connected"
                echo "  Available models:"
                curl -s "$OLLAMA_HOST/api/tags" | jq -r '.models[]? | "    - \(.name)"' 2>/dev/null || echo "    (failed to list)"
            else
                echo "  Status: ✗ Unreachable"
            fi
        fi
        
        # Check Anthropic if configured
        ANTHROPIC_KEY=$(jq -r '.providers.anthropic.apiKey // ""' "$CONFIG")
        if [ -n "$ANTHROPIC_KEY" ] && [ "$ANTHROPIC_KEY" != "null" ]; then
            echo ""
            echo "Anthropic Connection:"
            echo "  API Key: ${ANTHROPIC_KEY:0:15}..."
            echo "  Status: (canary test recommended)"
        fi
        
        echo ""
        echo "Context Settings:"
        jq -r '.agent | "  Context window: \(.contextWindow // "default")\n  Max output: \(.maxOutputTokens // "default")"' "$CONFIG"
        
    else
        echo "Config not found: $CONFIG"
        exit 1
    fi
    
    echo ""
    echo "Plugin Connections:"
    if [ -f "$CONFIG" ]; then
        jq -r '.plugins // {} | to_entries[] | "  \(.key): \(.value.enabled // "enabled")"' "$CONFIG"
    fi
}

# Run canary test
run_canary() {
    local model="${1:-}"
    
    echo "========== CANARY TEST =========="
    echo ""
    
    if [ -z "$model" ]; then
        model=$(jq -r '.agent.defaultModel // "anthropic/claude-haiku-4-5-20251001"' "$CONFIG")
        echo "Using default model: $model"
    else
        echo "Testing model: $model"
    fi
    
    echo ""
    echo "Sending test prompt..."
    
    # Create a simple test prompt
    TEST_PROMPT="Reply with exactly: CANARY_OK"
    
    # Use openclaw to send a test message (assuming there's a test command or we use sessions_spawn)
    # For now, we'll just verify the model is accessible
    
    if [[ "$model" == ollama/* ]]; then
        OLLAMA_HOST=$(jq -r '.providers.ollama.url // "http://192.168.1.174:11434"' "$CONFIG")
        MODEL_NAME="${model#ollama/}"
        
        RESPONSE=$(curl -s --max-time 10 "$OLLAMA_HOST/api/generate" \
            -d "{\"model\": \"$MODEL_NAME\", \"prompt\": \"$TEST_PROMPT\", \"stream\": false}" \
            2>/dev/null || echo '{"error":"timeout or unreachable"}')
        
        if echo "$RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
            ERROR=$(echo "$RESPONSE" | jq -r '.error')
            echo "✗ FAILED: $ERROR"
            exit 1
        else
            REPLY=$(echo "$RESPONSE" | jq -r '.response // "no response"')
            echo "✓ SUCCESS"
            echo "Response: $REPLY"
            
            if [[ "$REPLY" == *"CANARY_OK"* ]]; then
                echo "✓ Model responding correctly"
            else
                echo "⚠  Model responded but output unexpected"
            fi
        fi
    elif [[ "$model" == anthropic/* ]]; then
        echo "Anthropic canary test requires API call - use openclaw directly for full test"
        echo "Suggestion: openclaw chat --model $model --message 'test'"
    else
        echo "Unknown provider for model: $model"
        exit 1
    fi
}

# Show usage dashboard
show_usage() {
    echo "========== USAGE DASHBOARD =========="
    echo ""
    
    # Workspace storage
    echo "Storage:"
    du -sh "$WORKSPACE" 2>/dev/null | awk '{print "  Workspace: " $1}'
    du -sh "$WORKSPACE/learnings" 2>/dev/null | awk '{print "  Learnings: " $1}' || echo "  Learnings: (not found)"
    du -sh "$WORKSPACE/memory" 2>/dev/null | awk '{print "  Memory: " $1}' || echo "  Memory: (not found)"
    
    echo ""
    echo "Cron Jobs:"
    
    # Get cron job count and recent run stats
    if command -v openclaw >/dev/null 2>&1; then
        JOB_COUNT=$(openclaw cron list --json 2>/dev/null | jq '.jobs | length' || echo 0)
        echo "  Total jobs: $JOB_COUNT"
        
        # Try to get recent run stats (requires cron runs API)
        echo "  (Run stats require individual job queries - use cron-debug.sh for details)"
    else
        echo "  openclaw CLI not available"
    fi
    
    echo ""
    echo "Recent Activity (last 24h):"
    
    # Scan logs for API calls
    LOG_DIR="/tmp/openclaw"
    LATEST_LOG=$(ls -t "$LOG_DIR"/openclaw-*.log 2>/dev/null | head -1)
    
    if [ -n "$LATEST_LOG" ]; then
        YESTERDAY=$(date -d "1 day ago" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)
        
        ERROR_COUNT=$(grep -c "ERROR\|FATAL" "$LATEST_LOG" 2>/dev/null || echo 0)
        WARN_COUNT=$(grep -c "WARN" "$LATEST_LOG" 2>/dev/null || echo 0)
        
        echo "  Errors: $ERROR_COUNT"
        echo "  Warnings: $WARN_COUNT"
    else
        echo "  No logs found"
    fi
    
    echo ""
    echo "Model Costs:"
    echo "  (Cost tracking requires provider API integration - check provider dashboards)"
    echo "  Anthropic: https://console.anthropic.com"
    echo "  Local models (Ollama): Free"
}

# Show help
show_help() {
    cat <<EOF
Model & Provider Diagnostics

USAGE:
  $0 status              Show current model configuration and connections
  $0 canary [model]      Send test prompt to verify model is working
  $0 usage               Show usage dashboard (storage, cron, API calls)

EXAMPLES:
  $0 status
  $0 canary ollama/qwen3.5:35b
  $0 usage
EOF
}

# Route command
case $COMMAND in
    status) show_status;;
    canary) shift; run_canary "$@";;
    usage) show_usage;;
    help|--help|-h) show_help;;
    *) echo "Unknown command: $COMMAND"; show_help; exit 1;;
esac
