# Executive Summary: OpenClaw Web Search Model Test
## March 1, 2026 — Final Results

---

## The Question
Which local Ollama model is best for web search delegation in OpenClaw?

## The Answer
**Qwen 2.5 14B** — by a large margin.

---

## Test Results (Ranked)

### 🥇 **Qwen 2.5 14B** — WINNER
- **Runtime:** 33 seconds
- **Web Search Speed:** 941 milliseconds
- **Output Tokens:** 243
- **Quality:** Excellent (accurate, 3 developments)
- **Reliability:** ✅ Performed actual web search

### 🥈 **Llama 3.2 3B** — SOLID ALTERNATIVE
- **Runtime:** 46 seconds
- **Web Search Speed:** 1,033 milliseconds
- **Output Tokens:** 275
- **Quality:** Excellent (accurate, 3 developments)
- **Reliability:** ✅ Performed actual web search
- **Use when:** Resources matter more than speed

### ❌ **Qwen 2.5 Coder 14B** — FAILED
- **Runtime:** 58 seconds (slowest)
- **Web Search Speed:** 5 seconds (fake/simulated)
- **Output Tokens:** 325 (least efficient)
- **Quality:** Poor (generic, hallucinated)
- **Reliability:** ❌ Did not perform actual web search
- **Why it failed:** Coder variant optimized for code, not search

---

## Key Metrics Comparison

| Metric | Qwen 2.5 | Llama 3B | Coder |
|--------|----------|----------|-------|
| **Speed (total)** | ⚡⚡⚡ 33s | ⚡⚡ 46s | ⚡ 58s |
| **Search execution** | ⚡⚡⚡ 941ms | ⚡⚡ 1033ms | ❌ Fake |
| **Token efficiency** | ⚡⚡⚡ 243 | ⚡⚡ 275 | ❌ 325 |
| **Response quality** | ⚡⚡⚡ Excellent | ⚡⚡⚡ Excellent | ❌ Poor |
| **Actual search?** | ✅ Yes | ✅ Yes | ❌ No |

---

## What Each Model Found

### Qwen 2.5 14B (Accurate)
1. Apple's Reimagined Siri (context-aware, "on-screen awareness")
2. Context Windows & Memory (improved agentic AI)
3. Autonomous Systems Shift (AI decision-making)

### Llama 3.2 3B (Accurate)
1. Apple Siri Redesign
2. TechCrunch Prediction (Yann LeCun, DeepMind)
3. Reuters/OpenAI deployment agreement

### Qwen Coder 14B (Hallucinated)
1. LLM training efficiency (generic)
2. AI ethics guidelines (generic)
3. _(Made up "simulated search" result)_

---

## Implementation

### Config Update
```json5
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "ollama/qwen2.5:14b"  // <- Set this as default
      }
    }
  }
}
```

### Usage Example
```python
# Web search via subagent delegation
sessions_spawn({
    task: "Search for latest quantum computing breakthroughs and summarize",
    model: "ollama/qwen2.5:14b",  // Now your default
    runTimeoutSeconds: 120
})
```

---

## Conclusion

**Use Qwen 2.5 14B as your primary web search model.**

It's the fastest, most reliable, and produces the highest-quality summaries. Llama 3.2 3B is an excellent backup for resource-constrained scenarios.

**Do not use the Coder variant for web search** — it hallucinated results instead of performing actual searches.

---

## Full Test Documentation
- Detailed results: `/root/.openclaw/workspace/research/WEBSEARCH_FINAL_RESULTS.md`
- Test notes: `/root/.openclaw/workspace/research/websearch_test_results.md`
- Session comparisons: `/root/.openclaw/workspace/research/websearch_test_comparison.md`

---

**Ready to deploy.** Let me know if you want me to update your config now.
