#!/bin/bash
# Test Runner: Qwen 3.5 9B as Subagent Model
# 
# This script runs a series of tests to evaluate qwen3.5:9b performance
# in various subagent roles (analysis, reasoning, code, writing).
#
# Usage: ./run-9b-tests.sh
# Results: test-results-9b.json

set -e

RESULTS_FILE="test-results-9b.json"
START_TIME=$(date +%s)

echo "🧪 Qwen 3.5 9B Subagent Test Suite"
echo "==================================================="
echo "Model: ollama/qwen3.5:9b"
echo "Start: $(date)"
echo ""

# Ensure results directory exists
mkdir -p test-results

# Initialize results JSON
cat > "$RESULTS_FILE" << 'EOF'
{
  "config": {
    "model": "ollama/qwen3.5:9b",
    "timestamp": "START_TIME_PLACEHOLDER",
    "hostname": "HOSTNAME_PLACEHOLDER"
  },
  "tests": [],
  "summary": {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "avgResponseTime": 0
  }
}
EOF

# Replace placeholders
sed -i "s/START_TIME_PLACEHOLDER/$(date -u +%Y-%m-%dT%H:%M:%SZ)/g" "$RESULTS_FILE"
sed -i "s/HOSTNAME_PLACEHOLDER/$(hostname)/g" "$RESULTS_FILE"

# Test categories with sample prompts
declare -A TESTS

# Speed & Responsiveness
TESTS[speed-simple]="What are the top 3 benefits of using a local LLM? Answer in 2-3 sentences."
TESTS[speed-code-review]="Review this Python code for bugs: 'def divide(a, b): return a / b'. Find 2 issues."

# Document Analysis
TESTS[analysis-summarize]="Summarize the NDIS scheme in 3 bullet points. Focus on funding and eligibility."
TESTS[analysis-extract]="List 5 key requirements for NDIS exercise physiology support letters."

# Code Generation
TESTS[code-celsius-to-f]="Write a Python function to convert Celsius to Fahrenheit with a docstring."
TESTS[code-optimize]="Optimize this: 'result = []; [result.append(x*2) for x in data if x > 0]; return result'"

# Reasoning & Logic
TESTS[reasoning-prioritize]="Rank these by impact: Task A (4h, high urgency, low impact), Task B (2h, low urgency, high impact), Task C (1h, medium/medium). Why?"
TESTS[reasoning-model-choice]="Compare 9B vs 35B models for web search. Pros/cons for each in terms of speed, accuracy, resources."

# Writing Quality
TESTS[writing-email]="Draft a professional email requesting a meeting about NDIS review timeline (3-4 sentences)."
TESTS[writing-explain]="Explain thermoregulation in quadriplegic individuals for a non-medical audience (simple language)."

# Constraint Handling
TESTS[constraint-word-limit]="Explain machine learning in exactly 50 words or less."
TESTS[constraint-json]="List 5 assistant features as JSON: {\"features\": [...]}"

# Multi-step Tasks
TESTS[multistep-research]="Plan 3-step research approach to understanding NDIS application timelines. What to research in each step?"
TESTS[multistep-workflow]="Design a workflow for processing exercise physiology reports: input → processing → output. Be specific."

echo "Running ${#TESTS[@]} tests..."
echo ""

PASSED=0
FAILED=0
TEST_COUNT=0

for test_id in "${!TESTS[@]}"; do
  TEST_COUNT=$((TEST_COUNT + 1))
  PROMPT="${TESTS[$test_id]}"
  
  echo -n "[$TEST_COUNT/${#TESTS[@]}] $test_id... "
  
  # Run test via openclaw API (would normally use sessions_spawn)
  # For now, we'll create a template that documents what needs to run
  
  echo "✅ (template created)"
done

echo ""
echo "==================================================="
echo "📊 Summary"
echo "==================================================="
echo "Total tests: $TEST_COUNT"
echo "Status: Ready to run"
echo ""
echo "To execute these tests, you'll need to:"
echo "  1. Convert each prompt into a subagent call"
echo "  2. Measure response time + quality"
echo "  3. Compare with qwen3.5:35b baseline"
echo ""
echo "Results will be saved to: $RESULTS_FILE"
