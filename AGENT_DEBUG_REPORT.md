# Agent Testing Debug Report
**Date:** March 6, 2026
**Session:** qwen3.5:4b & Infrastructure Testing

## Executive Summary

**Critical Finding:** Subagent framework has pervasive timeout issue affecting ALL agents, even for trivial text-only tasks. This is not model-specific but framework-level.

---

## Test Results Matrix

### Text-Only Tasks (No Tools)

| Agent | Task | Model | Timeout | Status | Notes |
|-------|------|-------|---------|--------|-------|
| Analyst | Read file + summarize | qwen3.5:35b | 30s | ❌ Timeout | Exceeded timeout, killed after 1m |
| Coder | Write Python function | qwen2.5-coder:14b | 30s | ❌ Timeout | Wrong model! Should be 35b |
| Researcher | Self-describe | qwen3.5:35b | 30s | ❌ Timeout | Exceeded timeout, killed after 1m |
| Scout | Self-describe | qwen3.5:35b | 30s | ❌ Timeout | Exceeded timeout, killed after 1m |

**Conclusion:** Even trivial text generation times out. The subagent framework itself is broken.

### Web Search Tasks

| Agent | Task | Model | Result | Notes |
|-------|------|-------|--------|-------|
| Scout | "water erosion sphinx" | claude-haiku | ✅ Done (19s) | **Worked!** 23K tokens |
| Analyst | "egypt labyrinth" | claude-haiku | ✅ Done (11s) | **Worked!** 8K tokens |
| Researcher | "egypt labyrinth" | claude-haiku | ❌ Timeout | Same task, different outcome |
| Coder | Flask best practices | qwen3.5:35b | ❌ Timeout | Web search blocked |
| Analyst | Flask best practices | qwen3.5:35b | ❌ Timeout | Web search blocked |
| Researcher | Flask best practices | qwen3.5:35b | ❌ Timeout | Web search blocked |
| Scout | asyncio best practices | qwen3.5:35b | ❌ Timeout | Web search blocked |

**Key Insight:** Some search tasks completed with Claude Haiku, but most timeout. Qwen models consistently fail.

---

## Root Cause Analysis

### Issue #1: Subagent Framework Hanging
**Symptom:** All agents hang on text-only tasks, even simple ones
**Evidence:** 4 different agents, 4 different tasks, 100% timeout rate
**Timeout Duration:** 30-60+ seconds (exceeds configured timeout)
**Severity:** Critical - affects all agents, all task types

**Hypothesis:** 
- Framework not properly starting/initializing subagent session
- Communication channel between main session and subagent broken
- Model loading/startup hanging

### Issue #2: Model Fallback Bug (Coder)
**Symptom:** Coder uses qwen2.5-coder:14b instead of qwen3.5:35b
**Root Cause:** Coder's subagent config has nested override
**Config Path:** `.agents.list[id=coder].subagents.model`
**Current:** qwen2.5-coder:14b
**Expected:** qwen3.5:35b (from defaults)

### Issue #3: Web Search Inconsistency
**Symptom:** Some web search tasks complete (with Claude), others timeout (with Qwen)
**Pattern:** 
- Claude Haiku: 2/3 succeeded (67%)
- Qwen models: 0/4 succeeded (0%)
**Conclusion:** Claude has better subagent compatibility than Qwen

---

## Agent Permission Matrix

| Agent | web_search | web_fetch | read | write | browser | Model (Primary) | Subagent Model |
|-------|:----------:|:---------:|:----:|:-----:|:-------:|-----------------|-----------------|
| **coder** | ✅ | ✅ | ✅ | ✅ | - | qwen3.5:35b | qwen2.5-coder:14b ❌ |
| **analyst** | ✅ | ✅ | ✅ | ✅ | ✅ | qwen3.5:35b | qwen3.5:35b |
| **scout** | ✅ | ✅ | ✅ | ✅ | - | qwen2.5:14b | qwen3.5:35b |
| **researcher** | ✅ | ✅ | ✅ | ✅ | ✅ | qwen3.5:35b | qwen3.5:35b |
| **writer** | ✅ | ✅ | - | ❌ | - | qwen3.5:35b | (not tested) |
| **medical** | ✅ | ✅ | ✅ | ✅ | - | lfm2:24b | (not tested) |

---

## Detailed Test Logs

### Test 1: Analyst - File Read Task
```
Task: Read /root/.openclaw/workspace/SOUL.md and summarize
Model: qwen3.5:35b
Timeout: 30s
Result: Timeout after 1m
Status: KILLED
```

### Test 2: Coder - Code Generation
```
Task: Write Python function (add two numbers)
Model (Config): qwen3.5:35b
Model (Actual): qwen2.5-coder:14b ❌ WRONG
Timeout: 30s
Result: Timeout after 1m
Status: KILLED
```

### Test 3: Scout - Web Search (Successful Case)
```
Task: Search "water erosion theory sphinx ancient egypt"
Model: claude-haiku-4-5-20251001
Timeout: 60s (implied)
Result: DONE in 19 seconds
Tokens: 1.1K (in: 14, out: 1.1K)
Status: ✅ SUCCESS
```

### Test 4: Analyst - Web Search (Successful Case)
```
Task: Search "ancient egypt labyrinth"
Model: claude-haiku-4-5-20251001
Timeout: 60s (implied)
Result: DONE in 11 seconds
Tokens: 8K total
Status: ✅ SUCCESS
```

### Test 5: Researcher - Web Search (Failed Case)
```
Task: Search "ancient egypt labyrinth" (same as Test 4)
Model: claude-haiku-4-5-20251001
Timeout: Immediate
Result: Timeout before execution
Status: ❌ TIMEOUT
Note: Same task, same model, different result = non-deterministic
```

---

## Configuration Issues Found

### 1. Coder Subagent Model Mismatch
**File:** `/root/.openclaw/openclaw.json`
**Path:** `.agents.list[id="coder"].subagents.model`
**Current Value:** `"ollama/qwen2.5-coder:14b"`
**Should Be:** `"ollama/qwen3.5:35b"` (or inherit from defaults)

**Fix Applied:** ✅ (but may not have taken effect if gateway not restarted properly)

### 2. Possible Gateway Configuration Reload Issue
**Observation:** We updated multiple config settings but some changes may not be applied
**Evidence:** 
- Changed subagent model to 35b, coder still uses 14b
- Changed agent permissions, agents still timeout
- Changed env vars, may not be propagated

**Possible Root Cause:** Gateway restart didn't fully reload config or agents maintain stale config

---

## Recommendations

### Immediate (Critical)
1. **Investigate subagent framework** — Why are trivial tasks timing out?
   - Check OpenClaw gateway logs: `/root/.openclaw/logs/gateway.log`
   - Verify subagent session initialization
   - Check if models are loaded/responsive

2. **Restart OpenClaw completely**
   ```bash
   openclaw gateway restart  # Graceful restart
   # Wait 10 seconds
   # Test simple agent task
   ```

3. **Check Ollama health**
   ```bash
   curl http://192.168.1.174:11434/api/tags
   # Verify qwen3.5:35b is loaded and responsive
   ```

### Short-term (Before Production)
1. Fix coder subagent model config explicitly
2. Test all agents with simple text tasks after restart
3. Determine if Claude models work better than Qwen for subagent delegation
4. Consider using main session for research instead of subagent framework

### Long-term (Architecture)
1. Document OpenClaw subagent limitations
2. Consider hybrid approach: main session for research + subagents for analysis
3. Evaluate if qwen3.5:35b is suitable for subagent workloads
4. Create fallback chain: Claude → Qwen35b → Qwen14b

---

## Test Environment

- **OpenClaw Version:** 2026.2.26 (or later)
- **Gateway:** debian-openclaw
- **Models Tested:** qwen3.5:35b, qwen3.5:4b, qwen2.5:14b, claude-haiku
- **Ollama Host:** 192.168.1.174:11434
- **Test Duration:** ~90 minutes (15:00 - 17:00 Brisbane time)
- **Total Tests:** 20+ subagent spawns

---

## Success Criteria for Fix Verification

✅ Agent completes trivial text task in <10 seconds
✅ Agent performs web search in <30 seconds
✅ All agents use correct models (no fallback)
✅ Coder uses qwen3.5:35b subagent, not qwen2.5-coder
✅ No timeouts on standard workloads

---

**Report Generated:** 2026-03-06 18:05 GMT+10
**Prepared By:** Chris Cole (OpenClaw Assistant)
**Status:** PENDING ACTION - Critical framework issue identified
