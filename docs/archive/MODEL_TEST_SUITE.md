# Model Testing Suite — March 3, 2026

## New Models to Test
- **lfm2:24b** (new, unknown profile)
- **qwen3.5:9b** (new, smaller Qwen variant)

## Existing Baseline Models
- qwen3.5:35b (current primary)
- qwen2.5:14b (web search champion)
- llama3.2:3b (lightweight)
- qwen3.5:397b-cloud (largest available)

---

## Test Categories & Use Cases

### 1. **Speed & Efficiency** (Scout/Fast Tasks)
**Task:** Generate a Python function to extract dates from text using regex
**Metric:** Response time, token count, code quality
**Best for:** Identifying lightweight model for Scout (fast web search)

### 2. **Long-Form Analysis** (Analyst Role)
**Task:** Summarize complex medical abstract (1200 words) + extract key findings
**Metric:** Accuracy, completeness, hallucination rate, token efficiency
**Best for:** Document analysis, NDIS evidence gathering

### 3. **Code Quality & Debugging** (Coder Role)
**Task:** Review and fix buggy async Python code (missing await, race condition)
**Metric:** Bug detection rate, fix quality, explanation clarity
**Best for:** Code generation and review tasks

### 4. **Knowledge Reasoning** (Analyst/General)
**Task:** Answer multi-part questions on:
- Python async/await patterns
- NDIS policy interpretation
- Medical terminology accuracy
- Business logic reasoning
**Metric:** Accuracy, depth, hallucination rate
**Best for:** General intelligence & specialization detection

### 5. **Medical/Clinical Accuracy** (Report Writer)
**Task:** Generate NDIS Section 34 support letter section for SCI patient
**Metric:** Clinical accuracy, specificity, no hallucinations, proper tone
**Best for:** Identifying medical-capable model for report writer

### 6. **Web Search Synthesis** (Researcher Role)
**Task:** Research latest AI model releases (March 2026) + summarize trends
**Metric:** Search relevance, synthesis quality, timeliness
**Best for:** Finding best model for web-based research tasks

---

## Test Execution Strategy

### Phase 1: Smoke Tests (Quick - 30 mins)
Each new model tested on **Task #1 (Speed & Efficiency)**
- Time to response
- Token count
- Output quality (PASS/FAIL)
- Any timeouts or errors

**Go/No-Go:** If model times out or fails, flag immediately

### Phase 2: Deep Dive (2-3 hours)
Top performers from Phase 1 run **Tasks #2-6**
- Full metrics recorded
- Hallucination tracking
- Comparative scoring

### Phase 3: Analysis & Recommendations (30 mins)
- Score each model for each role (1-10)
- Identify best-fit assignments
- Create deployment recommendations

---

## Recording Template

```
MODEL: [name:version]
TASK: [#number]
TIME_START: [ISO timestamp]

PROMPT: [full input]

RESPONSE: [first 1000 chars...]

METRICS:
- Response Time: X.Xs
- Tokens In/Out: X / Y
- Quality: PASS/FAIL
- Hallucinations: [none/minor/major]
- Notes: [observations]
```

---

## Role Assignment Targets

Once testing complete, assign models to:
- **Coder** — Code generation, debugging, execution tasks
- **Analyst** — Long-form reading, extraction, reasoning
- **Researcher** — Web search + synthesis, knowledge integration  
- **Scout** — Lightweight & fast web search tasks
- **Medical** — Clinical accuracy for NDIS report generation

Current assignments:
- Coder: qwen3.5:35b
- Analyst: qwen3.5:35b
- Researcher: qwen3.5:35b
- Scout: qwen2.5:14b ← _Can this be replaced by qwen3.5:9b?_
- Medical: thewindmom/llama3-med42-8b

---

## Success Criteria for New Models

✅ **qwen3.5:9b** useful if:
- 2-3x faster than qwen3.5:35b
- Quality stays >90% of 35b on key tasks
- Good Scout replacement (fast web search)
- Smaller memory footprint

✅ **lfm2:24b** useful if:
- Better reasoning than 9b variants
- Strong medical knowledge
- Matches/beats qwen3.5:35b on analysis
- Specialization in any key area

❌ **Deprecate if:**
- Hallucinations or unreliable output
- No clear improvement over existing models
- Performance worse than lighter alternatives

---

## Progress Tracking

- [ ] Phase 1: Smoke tests complete
- [ ] Phase 2: Deep dive testing complete
- [ ] Phase 3: Analysis & recommendations
- [ ] Deployment: Updated agent config

**Results will be saved to:** `MODEL_TESTS_RESULTS.md`
