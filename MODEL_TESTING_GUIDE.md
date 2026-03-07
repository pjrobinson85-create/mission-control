# Model Testing Guide — New Ollama Models

## Quick Start

You've added **lfm2:24b** and **qwen3.5:9b** to Ollama. Here's how to test them systematically.

### Option A: Quick Manual Tests (15 mins)
Use these curl commands to test each model:

#### Test 1: Speed & Efficiency (qwen3.5:9b)
```bash
curl -X POST http://192.168.1.174:11434/api/generate \
  -d '{
    "model": "qwen3.5:9b",
    "prompt": "Generate a Python function that extracts dates from text in formats DD/MM/YYYY, DD-MM-YYYY, and written format (e.g., \"3 March 2026\"). Include error handling and documentation.",
    "stream": false
  }' | jq '.response'
```

**What to check:**
- How fast does it respond? (vs qwen3.5:35b)
- Is the code correct and complete?
- Does it hallucinate or miss requirements?
- Rating: 1-10 for speed/quality ratio

---

#### Test 2: Medical Knowledge (lfm2:24b)
```bash
curl -X POST http://192.168.1.174:11434/api/generate \
  -d '{
    "model": "lfm2:24b",
    "prompt": "You are an exercise physiology expert. A patient with C6 spinal cord injury needs NDIS support. Write a brief clinical rationale (150 words) explaining WHY they need ongoing exercise physiology support. Include: specific impairments from C6 SCI, participation barriers, achievable goals, and expected outcomes.",
    "stream": false
  }' | jq '.response'
```

**What to check:**
- Does it understand C6 SCI implications?
- Is the clinical language appropriate?
- Any hallucinated treatments or diagnoses?
- Rating: 1-10 for medical accuracy/usefulness

---

#### Test 3: Long-Form Analysis (qwen3.5:9b)
```bash
curl -X POST http://192.168.1.174:11434/api/generate \
  -d '{
    "model": "qwen3.5:9b",
    "prompt": "Analyze this patient: C6 spinal cord injury (2 years post-injury), full upper extremity strength, absent sensation below C6, flaccid lower extremities, managed via intermittent catheterization, uses power wheelchair, depression PHQ-9:14, anxiety GAD-7:11, normal cognition, cardiovascular deconditioning. Summarize in 3-5 sentences: (1) Functional areas most impacted, (2) Participation barriers, (3) Evidence of support need, (4) Safety concerns.",
    "stream": false
  }' | jq '.response'
```

**What to check:**
- Does it capture all 4 required areas?
- Accuracy of functional assessment?
- Any hallucinations or missed details?
- Rating: 1-10 for analyst suitability

---

### Option B: Automated Testing (with script)
```bash
cd /root/.openclaw/workspace
bash MANUAL_MODEL_TESTS.sh
```

This runs all 3 tests and saves results to `MODEL_TESTS_RESULTS.md`

---

## Full Test Suite (if going deeper)

### Test Categories

| Category | Best For | Test Task | Metrics |
|----------|----------|-----------|---------|
| **Speed** | Scout/lightweight | Code generation | Response time, tokens |
| **Analysis** | Analyst role | Medical summary | Accuracy, completeness, hallucinations |
| **Code Quality** | Coder role | Code review/fix | Bug detection, fix quality |
| **Medical** | Report writer | NDIS letter section | Clinical accuracy, tone |
| **Knowledge** | General reasoning | Multi-part questions | Accuracy %, depth |

---

## Scoring Rubric (1-10 for each role)

### Scout Role (Lightweight Web Search)
- **Speed:** Must be <2s for simple queries
- **Quality:** Accurate synthesis, no hallucinations
- **Memory:** Low footprint (prefers <20GB VRAM)
- **Ideal:** qwen3.5:9b if fast + accurate

### Analyst Role (Document Analysis)
- **Accuracy:** 90%+ on multi-part analysis
- **Completeness:** Captures all key points
- **Reasoning:** Explains reasoning clearly
- **Hallucinations:** None acceptable
- **Ideal:** lfm2:24b or qwen3.5:35b

### Coder Role (Code Generation)
- **Correctness:** Code runs without syntax errors
- **Quality:** Follows best practices, includes error handling
- **Completeness:** Solves full problem
- **Documentation:** Clear comments/docstrings
- **Ideal:** qwen3.5:35b or qwen3.5:9b if comparable

### Medical Role (NDIS Reports)
- **Clinical Accuracy:** Correct condition knowledge
- **Specificity:** Patient-specific details, not generic
- **Hallucinations:** ZERO—no made-up symptoms/treatments
- **Tone:** Professional, evidence-based
- **Ideal:** lfm2:24b or thewindmom/llama3-med42-8b

---

## Recording Results

For each test, record:

```
Model: [name:version]
Task: [number & name]
Test Time: [ISO timestamp]

INPUT PROMPT: [exact prompt used]

OUTPUT (first 500 chars):
[response excerpt]

METRICS:
- Response Time: X.Xs
- Token Estimate: ~X in / ~Y out
- Quality Rating: N/10
- Hallucinations: [none/minor/major with examples]
- Best Use Case: [role or task type]

NOTES:
[observations, quirks, comparison to baseline]
```

---

## Decision Matrix (After Testing)

Once all tests complete, fill this out:

| Model | Speed | Analysis | Code | Medical | Best Fit | Recommendation |
|-------|-------|----------|------|---------|----------|---|
| qwen3.5:9b | 8/10 | 6/10 | 7/10 | 5/10 | Scout or Coder | ✅ Use if fast + accurate |
| lfm2:24b | 5/10 | 8/10 | 6/10 | 8/10 | Analyst or Medical | ✅ Use for medical tasks |
| qwen3.5:35b | 5/10 | 9/10 | 9/10 | 8/10 | General | ✅ Keep as primary |
| qwen2.5:14b | 7/10 | 7/10 | 6/10 | 5/10 | Web search | ✅ Keep as Scout |

---

## Next Steps

1. **Run tests** (Option A or B above)
2. **Record results** in MODEL_TESTS_RESULTS.md
3. **Fill decision matrix** with scores
4. **Recommend:** Which models add value? Which should be primary for which roles?
5. **Update config:** Once approved, update OpenClaw agent config to use new models

---

## Current Baseline (For Comparison)

### qwen3.5:35b
- Speed: Moderate (5-10s for complex tasks)
- Quality: Excellent across all categories
- Memory: High (24GB+ VRAM)
- Role: Primary general-purpose model

### qwen2.5:14b
- Speed: Good (3-5s)
- Quality: Excellent for web search
- Memory: Moderate (12GB VRAM)
- Role: Scout (web search specialist)

### llama3.2:3b
- Speed: Very fast (<2s)
- Quality: Basic (good for simple tasks)
- Memory: Low (2GB VRAM)
- Role: Lightweight tasks

### thewindmom/llama3-med42-8b
- Speed: Moderate (5-8s)
- Quality: Excellent medical knowledge
- Memory: Moderate (8GB VRAM)
- Role: Medical/clinical tasks

---

## Success Criteria

✅ **qwen3.5:9b** wins if:
- 50%+ faster than qwen3.5:35b
- Quality stays >85% on key tasks
- Good fit for Scout (web search)

✅ **lfm2:24b** wins if:
- Medical accuracy >9/10
- Analysis quality >8.5/10
- Comparable to qwen3.5:35b on reasoning

❌ Models are deprecated if:
- Consistent hallucinations
- Worse quality than smaller alternatives
- No clear improvement over existing fleet

---

## Questions to Guide Your Testing

1. **Speed:** Which model responds fastest for simple tasks?
2. **Quality:** Which model produces the most accurate output?
3. **Specialization:** Does lfm2 have medical expertise? Does qwen3.5:9b sacrifice quality for speed?
4. **Hallucinations:** Which models make up facts?
5. **Fit:** Which role does each model fit best?
6. **Replacement:** Should any existing models be replaced?

Good luck! Report back once you've tested them.
