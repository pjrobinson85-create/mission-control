# Web Search Model Performance Test — March 1, 2026

## Objective
Determine which local Ollama model performs best for web search tasks, considering:
- Response speed
- Search quality
- Token efficiency
- Suitability as a web search agent

## Test Setup

**Query:** "latest AI developments March 2026"  
**Task:** Search, summarize in 2-3 sentences, report timing  
**Timeout:** 120 seconds per subagent  
**Brave Search:** 5 results max, 30 second timeout

### Models Under Test

| Model | Params | Type | Context | Status |
|-------|--------|------|---------|--------|
| Qwen 3.5 35B | 35B | Local | 32K | Running (coder agent) |
| Qwen 2.5 14B | 14B | Local | 32K | Running |
| Llama 3.2 3B | 3B | Local | 8K | Running |

## Execution Timeline

**11:25 UTC+10** - Tests spawned as parallel subagents  
**Test 1:** Coder agent (Qwen 35B) - runId `b4652260-4b7d-4c52-9e2e-5ca7109ef543`  
**Test 2:** Qwen 2.5 14B - runId `46bf11a6-8435-49d2-8254-0f1696ee856b`  
**Test 3:** Llama 3.2 3B - runId `59e43d67-df4c-435d-bd2b-ac156692a990`  

---

## Results (Pending Announcements)

### Test 1: Qwen 3.5 35B (Coder Agent)
- **Runtime:** _(awaiting)_
- **Response quality:** _(awaiting)_
- **Token usage:** _(awaiting)_
- **Status:** Running

### Test 2: Qwen 2.5 14B
- **Runtime:** _(awaiting)_
- **Response quality:** _(awaiting)_
- **Token usage:** _(awaiting)_
- **Status:** Running

### Test 3: Llama 3.2 3B
- **Runtime:** _(awaiting)_
- **Response quality:** _(awaiting)_
- **Token usage:** _(awaiting)_
- **Status:** Running

---

## Analysis (To Follow)

Once results are announced back:
1. Compare response times
2. Evaluate response quality/depth
3. Check token efficiency
4. Assess web search success rate (did it actually search?)
5. Recommend best model for web search agent

---

## Notes

- All three models are available in local Ollama at `192.168.1.174:11434`
- Qwen 35B available via coder agent (primary model)
- Qwen 2.5 14B + Llama 3.2 3B available directly as subagent models
- This test will inform web search agent selection (for future delegated research tasks)
