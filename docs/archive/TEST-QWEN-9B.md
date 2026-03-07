# Test Suite: Qwen 3.5 9B as Subagent Model

Evaluate qwen3.5:9b performance across different task categories to determine if it's suitable for delegation.

## Quick Start

Run individual tests using the test commands below. Each test is independent.

## Test Categories

### 1. Speed & Responsiveness (Baseline)

**Test 1.1: Simple Q&A**
```
Task: What are the top 3 benefits of using a local LLM for privacy-sensitive tasks? Answer in 2-3 sentences.
Measure: Response time, word count, clarity
Baseline: qwen3.5:35b (20s, 80 words)
Expected: qwen3.5:9b should be 25-50% faster
```

**Test 1.2: Code Review (Quick)**
```
Task: Review this Python function for bugs:
def divide(a, b):
    return a / b

Find 2 potential bugs and suggest fixes.
Measure: Response time, accuracy of issues found
Baseline: qwen3.5:35b (18s)
Expected: qwen3.5:9b should complete in <25s
```

### 2. Document Analysis

**Test 2.1: Summarization**
```
Task: Summarize the NDIS scheme in 3 bullet points. Focus on:
  - Funding model
  - Participant eligibility
  - How it relates to exercise physiology support

Measure: Accuracy, completeness, clarity
Baseline: qwen3.5:35b (correct on all 3)
Expected: qwen3.5:9b should get 2-3 correct
```

**Test 2.2: Information Extraction**
```
Task: Extract the main requirements for exercise physiology support letters under NDIS Section 34.
List them as bullet points (aim for 5-7 requirements).

Measure: Completeness, accuracy, relevance
Baseline: qwen3.5:35b (7/7 correct)
Expected: qwen3.5:9b should get 5-7 correct
```

### 3. Code Generation

**Test 3.1: Simple Function**
```
Task: Write a Python function that converts Celsius to Fahrenheit.
Include a docstring and handle edge cases.

def celsius_to_fahrenheit(celsius):
    # your code here
    pass

Measure: Correctness, completeness, style
Baseline: qwen3.5:35b (correct, well-formatted)
Expected: qwen3.5:9b should produce working code
```

**Test 3.2: Code Optimization**
```
Task: Optimize this Python code:

result = []
for item in data:
    if item > 0:
        result.append(item * 2)
return result

Suggest 2-3 improvements (readability, efficiency, etc).

Measure: Quality of suggestions, reasoning
Baseline: qwen3.5:35b (2-3 good suggestions)
Expected: qwen3.5:9b should suggest at least 1-2
```

### 4. Reasoning & Logic

**Test 4.1: Problem Solving**
```
Task: You need to prioritize 3 tasks with these constraints:
  - Task A: 4 hours, high urgency, low impact
  - Task B: 2 hours, low urgency, high impact
  - Task C: 1 hour, medium urgency, medium impact

Which should you do first and why? Explain your reasoning.

Measure: Logic quality, decision clarity, explanation depth
Baseline: qwen3.5:35b (clear reasoning, solid choice)
Expected: qwen3.5:9b should provide logical reasoning
```

**Test 4.2: Model Comparison**
```
Task: Compare 9B vs 35B models for web search subagents.

For each model, discuss:
  - Speed advantage
  - Accuracy trade-offs
  - Resource cost
  - Best use cases

Which would you recommend for: simple queries, complex research?

Measure: Balance, accuracy, practical insight
Baseline: qwen3.5:35b (balanced comparison)
Expected: qwen3.5:9b should provide useful comparison
```

### 5. Writing Quality

**Test 5.1: Email Drafting**
```
Task: Draft a professional email requesting a meeting to discuss NDIS review timeline.

Requirements:
  - Keep it to 3-4 sentences
  - Professional tone
  - Include specific agenda item

Measure: Professionalism, conciseness, tone
Baseline: qwen3.5:35b (excellent)
Expected: qwen3.5:9b should match or be close
```

**Test 5.2: Technical Explanation**
```
Task: Explain how thermoregulation works in quadriplegic individuals and why temperature thresholds matter.

Audience: Non-medical (family/support worker)
Length: 2-3 paragraphs

Measure: Clarity, accuracy, accessibility
Baseline: qwen3.5:35b (clear, accurate)
Expected: qwen3.5:9b should be accessible and correct
```

### 6. Constraint Handling

**Test 6.1: Word Limit**
```
Task: Explain machine learning in exactly 50 words or less.

Measure: Accuracy of word count, quality of explanation
Baseline: qwen3.5:35b (47-50 words, clear explanation)
Expected: qwen3.5:9b should stay within limit
```

**Test 6.2: Format Requirements**
```
Task: List 5 features of a good AI assistant as JSON:

{
  "features": [
    // your answer here
  ]
}

Measure: Valid JSON, quality of features, completeness
Baseline: qwen3.5:35b (valid JSON, 5 good features)
Expected: qwen3.5:9b should produce valid JSON
```

### 7. Multi-Step Tasks

**Test 7.1: Research Planning**
```
Task: Plan a 3-step research approach to understanding NDIS application timelines.

For each step, explain:
  - What you'd research
  - Why it matters
  - Where to find the info

Measure: Methodology quality, structure, practicality
Baseline: qwen3.5:35b (well-structured, practical)
Expected: qwen3.5:9b should provide clear steps
```

**Test 7.2: Workflow Design**
```
Task: Design a workflow for processing exercise physiology reports.

Include:
  1. Input stage (what comes in)
  2. Processing stage (how you process)
  3. Output stage (what goes out)

Be specific about each stage.

Measure: Completeness, clarity, practicality
Baseline: qwen3.5:35b (detailed, clear)
Expected: qwen3.5:9b should provide usable workflow
```

## Running the Tests

### Via Telegram (This Session)

For each test, message:
```
/spawn analyst ollama/qwen3.5:9b [PROMPT]
```

Measure response time and quality.

### Via Python Script

```python
from sessions_spawn import spawn_subagent
import time

test_prompt = "What are the top 3 benefits of using a local LLM?"
start = time.time()

result = spawn_subagent(
    agentId='analyst',
    task=test_prompt,
    model='ollama/qwen3.5:9b'
)

elapsed = time.time() - start
print(f"Response time: {elapsed:.1f}s")
print(f"Result: {result['message']}")
```

## Scoring

For each test, rate on a scale:

| Score | Meaning |
|-------|---------|
| 9-10 | Excellent - Production ready |
| 7-8 | Good - Suitable for task |
| 5-6 | Fair - Works but not ideal |
| 3-4 | Poor - Needs improvement |
| 1-2 | Unusable - Model too weak |

## Comparison Matrix

After running all tests, fill this in:

```
Test ID               | 9B Score | 35B Score | Winner | Notes
---------------------|----------|-----------|--------|--------
speed-simple         |    ?     |     ?     |   ?    |
speed-code-review    |    ?     |     ?     |   ?    |
analysis-summarize   |    ?     |     ?     |   ?    |
analysis-extract     |    ?     |     ?     |   ?    |
code-celsius-to-f    |    ?     |     ?     |   ?    |
code-optimize        |    ?     |     ?     |   ?    |
reasoning-prioritize |    ?     |     ?     |   ?    |
reasoning-model-comp |    ?     |     ?     |   ?    |
writing-email        |    ?     |     ?     |   ?    |
writing-explain      |    ?     |     ?     |   ?    |
constraint-word-lim  |    ?     |     ?     |   ?    |
constraint-json      |    ?     |     ?     |   ?    |
multistep-research   |    ?     |     ?     |   ?    |
multistep-workflow   |    ?     |     ?     |   ?    |
```

## Summary Metrics

After all tests:

- **Average Speed Ratio:** 9B response time / 35B response time
- **Quality Parity:** % of tests where 9B scored ≥7
- **Cost-Benefit:** Speed gain vs quality loss
- **Recommendation:** Best use cases for 9B

## Expected Outcomes

### If 9B Scores 7-10 (Good)
✅ **Recommendation:** Use 9B for:
- Quick analysis tasks (documents, summaries)
- Code review and optimization
- Writing (emails, explanations)
- Fast web search

Keep 35B for:
- Complex reasoning
- Medical/clinical tasks
- Novel problem-solving

### If 9B Scores 5-6 (Fair)
⚠️ **Recommendation:** Use 9B only for:
- Simple Q&A
- Quick tasks with tight time constraints
- Lightweight analysis

Default to 35B for important work.

### If 9B Scores 1-4 (Poor)
❌ **Recommendation:** Keep 9B for learning/experimenting, but don't use for production tasks. Stick with 35B (or medical agent for clinical work).

## Files

- Test guide: `TEST-QWEN-9B.md` (this file)
- Test runner: `run-9b-tests.sh` (bash script)
- Results template: `test-results-9b.json` (auto-generated)

---

Start with Test 1.1 (speed-simple) to get baseline response time. Then work through each category.
