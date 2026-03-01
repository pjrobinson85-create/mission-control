# Web Search Model Comparison — Results & Analysis

## Test Execution Summary

**Date:** Sunday, March 1, 2026 — 11:25-11:35 UTC+10  
**Test Type:** Parallel subagent web search task  
**Query:** "latest AI developments March 2026"  
**Evaluation Metrics:** Runtime, token usage, response quality, search success

---

## Results

### Test 1: Llama 3.2 3B ✅ COMPLETED

**Runtime:** 46 seconds  
**Model:** `ollama/llama3.2:3b`  
**Token Usage:** 20.2k total (19.9k in / 275 out)  
**Search Time:** ~1,033 milliseconds (web search only)

**Response Quality:**
- ✅ Found 3 distinct developments (Apple Siri, TechCrunch prediction, Reuters report)
- ✅ Clear, concise 2-3 sentence summary
- ✅ Specific dates and companies mentioned
- ✅ Good semantic organization

**Summary Provided:**
> - **Apple Announces Siri Redesign**: Apple officially announced a completely reimagined, AI-powered version of Siri for release in 2026. The new Siri will be context-aware and feature "on-screen awareness," marking a significant transformation.
> - **TechCrunch Prediction**: TechCrunch predicts that 2026 will mark the transition of AI from hype to practical application with signs pointing towards major developments, including Yann LeCun starting his own world model lab seeking $5 billion valuation and Google's DeepMind continuing its efforts on Genie.
> - **Reuters Report**: Reuters reported an agreement by OpenAI to deploy AI models in the U.S., indicating continued growth and expansion of AI technologies within global markets.

**Notes:** Excellent performance for a 3B model. Web search executed cleanly. Response was well-structured despite small context window (8K tokens). Only 275 tokens used for output, showing efficient summarization.

---

### Test 2: Qwen 2.5 14B ⏳ PENDING

**Runtime:** _(awaiting completion)_  
**Model:** `ollama/qwen2.5:14b`  
**Token Usage:** _(awaiting)_  
**Search Time:** _(awaiting)_

**Status:** Running — awaiting announcement from subagent

---

### Test 3: Qwen 2.5 Coder 14B ⏳ PENDING

**Runtime:** _(awaiting completion)_  
**Model:** `ollama/qwen2.5-coder:14b`  
**Token Usage:** _(awaiting)_  
**Search Time:** _(awaiting)_

**Note:** Running as subagent under coder agent (instead of Qwen 35B, which is not in registry)

**Status:** Running — awaiting announcement from subagent

---

## Preliminary Analysis (Llama 3B)

### Strengths
- **Fast:** 46 seconds total, web search completed in ~1 second
- **Efficient:** Only 275 output tokens despite detailed response
- **Accurate:** Found current/relevant AI news (Apple Siri, OpenAI, DeepMind)
- **Small footprint:** 3B params, fits on modest hardware
- **Clean execution:** No errors, web search succeeded

### Weaknesses
- **Limited depth:** Smaller context window (8K) might struggle with longer tasks
- **Potential hallucination risk:** Smaller models sometimes conflate news sources

### Suitability for Web Search Agent
**Rating: 8/10** — Excellent for lightweight, fast web search tasks. Good for delegation when speed matters.

---

## Next Steps (Awaiting Other Tests)

1. Collect results from Qwen 2.5 14B and Qwen 2.5 Coder 14B
2. Compare runtimes side-by-side
3. Evaluate response quality across all three
4. Measure token efficiency (tokens per output char)
5. Final recommendation: Which model best for web search agent role

---

## Recommendation Template (To Fill)

| Model | Runtime | Tokens | Quality | Speed | Rec? |
|-------|---------|--------|---------|-------|------|
| Llama 3.2 3B | 46s | 20.2k | Excellent | ⚡⚡⚡ | ✅ |
| Qwen 2.5 14B | _(pending)_ | _(pending)_ | _(pending)_ | ? | ? |
| Qwen 2.5 Coder 14B | _(pending)_ | _(pending)_ | _(pending)_ | ? | ? |

**Final Pick for Web Search Agent:** _(To be determined)_

