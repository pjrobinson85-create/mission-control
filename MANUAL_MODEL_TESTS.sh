#!/bin/bash

# Manual Model Testing Script
# Tests new Ollama models without OpenClaw integration
# Run directly: bash MANUAL_MODEL_TESTS.sh

set -e

OLLAMA_URL="http://192.168.1.174:11434"
RESULTS_FILE="MODEL_TESTS_RESULTS.md"

echo "=========================================="
echo "MODEL TEST SUITE - Phase 1 Smoke Tests"
echo "=========================================="
echo ""

# Initialize results file
cat > "$RESULTS_FILE" << 'EOF'
# Model Test Results — March 3, 2026

## Phase 1: Smoke Tests (Speed & Efficiency)

EOF

# Test 1: qwen3.5:9b
echo "Testing qwen3.5:9b..."
cat >> "$RESULTS_FILE" << 'EOF'

### Test 1: qwen3.5:9b - Speed & Efficiency

**Task:** Generate Python function to extract dates from text

**Prompt:**
EOF

PROMPT_1='Generate a Python function that extracts dates from text. The function should:
1. Find dates in formats: DD/MM/YYYY, DD-MM-YYYY, and written format (e.g., "3 March 2026")
2. Return a list of date objects
3. Include error handling for invalid dates
4. Have clear documentation

Provide only the code, with docstring.'

echo "$PROMPT_1" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Response:**" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

START_TIME=$(date +%s%N)
RESPONSE_1=$(curl -s -X POST "$OLLAMA_URL/api/generate" \
  -d "{\"model\": \"qwen3.5:9b\", \"prompt\": \"$PROMPT_1\", \"stream\": false}" | jq -r '.response')
END_TIME=$(date +%s%N)
ELAPSED=$(( (END_TIME - START_TIME) / 1000000 ))

echo "\`\`\`python" >> "$RESULTS_FILE"
echo "$RESPONSE_1" | head -50 >> "$RESULTS_FILE"
echo "\`\`\`" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Metrics:**" >> "$RESULTS_FILE"
echo "- Response Time: ${ELAPSED}ms" >> "$RESULTS_FILE"
echo "- Quality: [Assess manually]" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test 2: lfm2:24b
echo "Testing lfm2:24b..."
cat >> "$RESULTS_FILE" << 'EOF'

### Test 2: lfm2:24b - Medical/Clinical Accuracy

**Task:** Generate NDIS support letter section

**Prompt:**
EOF

PROMPT_2='You are an exercise physiology expert. A patient with C6 spinal cord injury needs NDIS support. Write a brief clinical rationale (150 words) explaining WHY they need ongoing exercise physiology support, including: specific impairments from C6 SCI, participation barriers, achievable goals, expected outcomes.'

echo "$PROMPT_2" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Response:**" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

START_TIME=$(date +%s%N)
RESPONSE_2=$(curl -s -X POST "$OLLAMA_URL/api/generate" \
  -d "{\"model\": \"lfm2:24b\", \"prompt\": \"$PROMPT_2\", \"stream\": false}" | jq -r '.response')
END_TIME=$(date +%s%N)
ELAPSED=$(( (END_TIME - START_TIME) / 1000000 ))

echo "$RESPONSE_2" | head -100 >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Metrics:**" >> "$RESULTS_FILE"
echo "- Response Time: ${ELAPSED}ms" >> "$RESULTS_FILE"
echo "- Quality: [Assess manually]" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test 3: qwen3.5:9b on analysis
echo "Testing qwen3.5:9b - Analysis..."
cat >> "$RESULTS_FILE" << 'EOF'

### Test 3: qwen3.5:9b - Long-Form Analysis

**Task:** Summarize medical assessment for NDIS

**Prompt:**
EOF

PROMPT_3='Analyze this patient assessment: Spinal cord injury C6 complete, 2-year post-injury. Full upper extremity strength, absent sensation below C6. Lower extremities flaccid. Managed via intermittent catheterization and bowel training. Uses power wheelchair. Depression (PHQ-9: 14), anxiety (GAD-7: 11). OT shows ADL limitations, normal cognition, cardiovascular deconditioning.

Summarize in 3-5 sentences: (1) Functional areas most impacted, (2) Participation barriers, (3) Evidence of ongoing support need, (4) Safety concerns.'

echo "$PROMPT_3" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Response:**" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

START_TIME=$(date +%s%N)
RESPONSE_3=$(curl -s -X POST "$OLLAMA_URL/api/generate" \
  -d "{\"model\": \"qwen3.5:9b\", \"prompt\": \"$PROMPT_3\", \"stream\": false}" | jq -r '.response')
END_TIME=$(date +%s%N)
ELAPSED=$(( (END_TIME - START_TIME) / 1000000 ))

echo "$RESPONSE_3" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"
echo "**Metrics:**" >> "$RESULTS_FILE"
echo "- Response Time: ${ELAPSED}ms" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo ""
echo "=========================================="
echo "Tests complete! Results saved to:"
echo "$RESULTS_FILE"
echo "=========================================="
