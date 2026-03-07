# Agent Spawn & Completion Test Suite

**Purpose:** Verify that subagents spawn correctly, execute tasks, and auto-announce completion with actual output.

**Test Date:** 2026-03-07
**Tester:** Chris Cole

---

## Test 1: Scout - Basic Web Search
**Agent:** scout  
**Model:** Default (qwen3.5:35b)  
**Task:** Perform a web search on renewable energy trends  
**Expected:** Agent spawns, executes web_search tool, returns results  
**Timeout:** 60 seconds  

**Command:**
```
sessions_spawn(
  agentId: "scout"
  task: "Do a web search for renewable energy trends in 2026. Find the latest developments, market growth, and emerging technologies."
  mode: "run"
  timeoutSeconds: 60
)
```

**Success Criteria:**
- [ ] Agent accepted (status: accepted)
- [ ] Auto-announce message appears with search results
- [ ] Results contain specific data (URLs, dates, facts)
- [ ] Not generic/templated content
- [ ] Completion time is reasonable for model size

**Result:** [PENDING]

---

## Test 2: Analyst - Question Without Tools
**Agent:** analyst  
**Model:** Default  
**Task:** Answer a knowledge question (no tool use required)  
**Expected:** Agent returns substantive answer quickly  
**Timeout:** 60 seconds  

**Command:**
```
sessions_spawn(
  agentId: "analyst"
  task: "Explain the pathophysiology of autonomic dysreflexia in spinal cord injury patients."
  mode: "run"
  timeoutSeconds: 60
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] Auto-announce appears with medical explanation
- [ ] Content is specific and accurate
- [ ] Not copy-pasted or generic
- [ ] Response time is fast (implies model working)

**Result:** [PENDING]

---

## Test 3: Researcher - Web Search + Analysis
**Agent:** researcher  
**Model:** Default  
**Task:** Search and analyze a topic  
**Expected:** Agent uses web_search, synthesizes findings  
**Timeout:** 120 seconds  

**Command:**
```
sessions_spawn(
  agentId: "researcher"
  task: "Search for adaptive sports programs in Queensland. Find 5+ organizations, their services, and contact information. Compile into a brief summary."
  mode: "run"
  timeoutSeconds: 120
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] Auto-announce with search results
- [ ] Specific organizations named (not generic)
- [ ] Contact info or websites included
- [ ] Synthesis/analysis present (not just raw search dumps)

**Result:** [PENDING]

---

## Test 4: Coder - Code Generation (if available)
**Agent:** coder  
**Model:** Default  
**Task:** Generate simple code  
**Expected:** Agent returns executable code  
**Timeout:** 120 seconds  

**Command:**
```
sessions_spawn(
  agentId: "coder"
  task: "Write a Python script that reads a CSV file, filters rows where column 'status' equals 'active', and outputs to a new CSV."
  mode: "run"
  timeoutSeconds: 120
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] Auto-announce with code
- [ ] Code is syntactically valid (could run)
- [ ] Logic matches the request
- [ ] Not generic template code

**Result:** [PENDING]

---

## Test 5: Custom Model Override (qwen3.5:27b)
**Agent:** analyst  
**Model:** ollama/qwen3.5:27b  
**Task:** Simple question  
**Expected:** Agent uses specified model (slower than default)  
**Timeout:** 180 seconds  

**Command:**
```
sessions_spawn(
  agentId: "analyst"
  model: "ollama/qwen3.5:27b"
  task: "What are the top 5 complications of spinal cord injury rehabilitation?"
  mode: "run"
  timeoutSeconds: 180
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] modelApplied: true
- [ ] Auto-announce appears
- [ ] Response time is noticeably slower than Test 2
- [ ] Content quality reflects larger model
- [ ] Output is agent's, not Chris's

**Result:** [PENDING]

---

## Test 6: Tool Invocation - SearXNG (if configured)
**Agent:** analyst  
**Model:** Default  
**Task:** Use SearXNG skill  
**Expected:** Agent invokes searxng tool and returns results  
**Timeout:** 120 seconds  

**Command:**
```
sessions_spawn(
  agentId: "analyst"
  task: "Use the searxng skill to search for 'adaptive shooting sports gold coast'. Return results with links and summaries."
  mode: "run"
  timeoutSeconds: 120
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] Agent either succeeds OR fails with clear error
- [ ] If success: auto-announce with search results
- [ ] If failure: error message explaining tool issue
- [ ] Not hanging/timing out silently

**Result:** [PENDING]

---

## Test 7: Timeout Behavior
**Agent:** analyst  
**Model:** Default  
**Task:** Deliberately long task  
**Expected:** Agent times out gracefully  
**Timeout:** 10 seconds (short intentionally)  

**Command:**
```
sessions_spawn(
  agentId: "analyst"
  task: "Write a 5000-word essay on the history of wheelchair sports from 1900 to 2026."
  mode: "run"
  timeoutSeconds: 10
)
```

**Success Criteria:**
- [ ] Agent accepted
- [ ] Does NOT auto-announce success after 10s
- [ ] System notifies (timeout message appears)
- [ ] No hanging indefinitely
- [ ] Clear error/timeout indication

**Result:** [PENDING]

---

## Verification Checklist

After running all tests, verify:

- [ ] All agents are accessible (not permission denied)
- [ ] Web_search tool works for scout/researcher/analyst
- [ ] SearXNG skill either works or fails clearly
- [ ] Model overrides are actually applied (verify response time)
- [ ] Auto-announce is coming through consistently
- [ ] No agent outputs are being provided by Chris directly
- [ ] Timeout behavior is predictable

---

## Known Issues to Track

| Issue | Status | Notes |
|-------|--------|-------|
| SearXNG timeout on analyst | PENDING | Need to verify if skill is configured |
| Model override not applying | PENDING | qwen3.5:27b appears to fallback to Claude |
| Agent output speed | PENDING | Verify agents are actually running on Ollama |

---

## Summary

**All tests pending.** Run in order, record results, identify blockers.

**Next steps after testing:**
1. Document which tools/skills work with which agents
2. Identify config issues preventing model overrides
3. Fix SearXNG integration if needed
4. Update AGENTS.md with lessons learned
