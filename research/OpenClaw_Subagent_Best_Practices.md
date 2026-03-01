# OpenClaw Sub-Agent Configuration: Deep Dive & Best Practices

**Research Date:** March 1, 2026  
**Status:** Complete practical guide from docs + community patterns  
**Key Sources:** Official docs, DEV Community, LumaDock, Reddit, YouTube

---

## Executive Summary

Sub-agents in OpenClaw are **background workers spawned from a running agent** that execute tasks in isolation, then announce results back to the requester. They're the most powerful tool for task delegation and parallel execution when configured properly.

The core tradeoff: **flexibility vs complexity**. Start simple (one-off spawns), then add orchestrator patterns only when you need parallel pipelines.

---

## Part 1: Foundation — What Are Sub-Agents?

### Core Concept

- **Sub-agents are NOT permanent agents.** They're temporary sessions spun up on-demand.
- Each sub-agent runs in its own session: `agent:<agentId>:subagent:<uuid>`
- They receive results, announce back to the requester chat, then auto-archive (default: 60 minutes).
- Sub-agents do **not** inherit `SOUL.md`, `IDENTITY.md`, `USER.md`, or other personality files — only `AGENTS.md` + `TOOLS.md`.

### When to Use Sub-Agents vs Persistent Agents

| Use Case | Sub-Agent | Persistent Agent |
|----------|-----------|------------------|
| Parallel research while you chat | ✅ | ❌ (blocks main) |
| Run cost-controlled batch work | ✅ | ❌ (wrong model) |
| Separate channel personality | ❌ (too expensive) | ✅ |
| Domain isolation (coding vs writing) | ❌ (no persistent memory) | ✅ |
| Quick side task | ✅ | ❌ (overkill) |

---

## Part 2: Spawning Sub-Agents

### Method 1: Manual Spawn (Chat Command)

```bash
/subagents spawn main "Research the latest Claude API updates and summarize"
```

**Pros:** Simple, on-demand, immediate visibility  
**Cons:** One-off, non-blocking returns immediately (you need to check `/subagents list` later)

### Method 2: Programmatic Spawn (sessions_spawn Tool)

```python
sessions_spawn({
    task: "Analyze system logs for errors in the past 24h",
    label: "Log analysis",
    agentId: "main",  # optional; spawns under this agent
    model: "anthropic/claude-sonnet-4-5",  # override default
    thinking: "medium",  # override default
    runTimeoutSeconds: 300,  # kill after 5 minutes
    cleanup: "keep"  # default; "delete" archives immediately
})
```

**Returns immediately:**
```json
{
  "status": "accepted",
  "runId": "subagent-abc123",
  "childSessionKey": "agent:main:subagent:abc123-uuid"
}
```

**Pros:** Programmatic control, timeout limits, model/thinking overrides  
**Cons:** Requires agent decision-making (good for orchestrators)

### Method 3: Thread-Bound Sessions (Discord only, currently)

```python
sessions_spawn({
    task: "Let's build a Discord bot",
    label: "Bot builder",
    thread: true,        # bind to Discord thread
    mode: "session",     // persistent, not one-shot
    runTimeoutSeconds: 3600  // 1 hour max
})
```

**Pros:** Follow-up messages stay in same thread + session  
**Cons:** Discord-only, requires thread binding config

---

## Part 3: Core Configuration for Success

### Minimal Config

```json5
{
  agents: {
    defaults: {
      subagents: {
        // Cost control: use a cheaper model for sub-agents
        model: "anthropic/claude-sonnet-4-5",
        
        // Timeout protection
        runTimeoutSeconds: 600,  // 10 min default for sessions_spawn
        
        // Archive cleanup
        archiveAfterMinutes: 60  // auto-delete after 1 hour
      }
    }
  }
}
```

### Production-Grade Config

```json5
{
  agents: {
    defaults: {
      subagents: {
        // Model selection
        model: "anthropic/claude-sonnet-4-5",    // cheaper than main
        thinking: "low",                          // reduce overhead
        
        // Concurrency & safety
        maxConcurrent: 8,          // global concurrent sub-agent cap
        maxChildrenPerAgent: 5,    // per-orchestrator spawn limit
        maxSpawnDepth: 2,          // allow orchestrators to spawn workers
        runTimeoutSeconds: 900,    // 15 min default
        
        // Cleanup
        archiveAfterMinutes: 30    // aggressive cleanup for busy systems
      }
    }
  },
  
  // Tool restrictions per-agent (if using multiple agents)
  tools: {
    subagents: {
      tools: {
        deny: ["gateway", "cron"],  // disable admin tools
        // allow: ["read", "exec", "process"]  // if specified, becomes allow-only
      }
    }
  }
}
```

---

## Part 4: The Orchestrator Pattern (Nested Sub-Agents)

Enable depth-2 nesting only when you need **main → orchestrator → workers**.

### When to Use

- Main agent: plans complex tasks, synthesizes results
- Depth-1 orchestrator: breaks down work, spawns parallel workers
- Depth-2 workers: do focused grunt work (research, analysis, generation)

### Config

```json5
{
  agents: {
    defaults: {
      subagents: {
        maxSpawnDepth: 2,          // allow depth 1 to spawn depth 2
        maxChildrenPerAgent: 5,    // max 5 active children per agent
        maxConcurrent: 8,          // global cap across all depths
      }
    }
  }
}
```

### Tool Access by Depth

| Depth | Session Key | Can Spawn? | Session Tools? | Other Tools? |
|-------|------------|-----------|----------------|-------------|
| 0 (Main) | `agent:main` | Always | Yes | All |
| 1 (Orchestrator) | `agent:main:subagent:uuid` | YES (if maxSpawnDepth ≥ 2) | YES (spawn + manage) | All except denied |
| 2 (Worker) | `agent:main:subagent:uuid:subagent:uuid` | NO | NO | All except denied |

### Anti-Pattern Discovered (GitHub #20034)

**BUG:** All Ollama-based subagents hang indefinitely (v2026.2.19-2).

**Workaround:** Use cloud models (Claude, OpenAI) for subagents only. Direct Ollama API calls work fine; subagent routing doesn't.

**Your setup:** You have this issue. All your local Ollama subagents will hang. Use cloud models for now.

---

## Part 5: Results & Announcements

### The Announce Flow

1. Sub-agent completes (or times out)
2. **Announce step** runs in the sub-agent's own session
3. Result posted to requester's channel (best-effort)
4. Session auto-archives

### Skip Announcements

Return exactly `ANNOUNCE_SKIP` to prevent posting:

```python
# Sub-agent code
if is_internal_research:
    return "ANNOUNCE_SKIP"
else:
    return f"Found {results_count} items. See details above."
```

### Announce Output Format

```
Status: completed successfully
Result: (assistant reply or latest tool result)
Notes: (error details if any)
Runtime: 5m12s
Tokens: 2341 in / 892 out / 3233 total
Cost: $0.047
Session: agent:main:subagent:abc123-uuid
Transcript: ~/.openclaw/agents/main/sessions/agent:main:subagent:abc123-uuid
```

### Delivery Reliability

- First attempt: direct `agent` delivery with idempotency key
- Fallback: queue routing
- Final: exponential backoff retry, then give up
- **Best-effort only** — if gateway restarts, pending announces are lost

---

## Part 6: Cost Control (Critical)

### Token Counting

Each sub-agent maintains **its own context and token budget**. The system prompt is rebuilt for each spawn.

**Token Injection per Sub-Agent:**
- System prompt baseline: ~500 tokens
- Workspace files (AGENTS.md): ~200–500 tokens
- Tools list: ~195 + 97 per tool
- Skills: ~195 + 97 per skill

**Total overhead:** 900–1500 tokens per sub-agent run.

### Cost Optimization

```json5
// Main agent: expensive but capable
agents: {
  list: [{
    id: "main",
    model: { primary: "anthropic/claude-opus-4-6" },  // $15/mtok in
  }]
}

// Sub-agents: cheap workers
agents: {
  defaults: {
    subagents: {
      model: "anthropic/claude-sonnet-4-5",  // $3/mtok in (5x cheaper)
      thinking: "low"  // reduce thinking overhead
    }
  }
}
```

**Typical savings:** 40–60% token reduction vs. monolithic setup, especially for parallel research tasks.

### Token Monitoring

```bash
# After spawning
/subagents info <id>
/subagents log <id>

# Per-session
/status

# Bulk
openclaw sessions --json | jq '.[] | select(.tokens)'
```

---

## Part 7: Common Pitfalls & Fixes

### 1. Sub-agents Can't Use Main Agent's Skills

**Problem:** Skills in your main workspace aren't available to sub-agents.

**Root cause:** Sub-agents load from their own isolated AGENTS.md/TOOLS.md context.

**Solution:**
- Put critical skills in `~/.openclaw/skills` (shared)
- Include skill instructions in the sub-agent task prompt
- OR pass explicit tool lists in config: `tools.allow`

### 2. Sub-agents Never Show Results

**Problem:** You spawned a sub-agent but saw no announcement.

**Root cause:**
- Announce delivery failed (channel disconnect, rate limit)
- Sub-agent returned `ANNOUNCE_SKIP`
- Sub-agent timed out silently
- Tool deny list blocked announcement delivery

**Debugging:**
```bash
/subagents info <id>     # check status
/subagents log <id>      # read full transcript
```

### 3. Orchestrator Sub-agents Can't Spawn Workers

**Problem:** Depth-1 orchestrator tried to call `sessions_spawn` and got denied.

**Root cause:** `maxSpawnDepth` still set to default (1).

**Fix:**
```json5
agents: {
  defaults: {
    subagents: {
      maxSpawnDepth: 2  // explicitly enable depth 1 → depth 2
    }
  }
}
```

### 4. Sub-agents Hang (Ollama Issue)

**Problem:** You spawned a sub-agent; it shows "running" forever.

**Root cause:** Ollama routing bug (GitHub #20034, unfixed in v2026.2.19-2).

**Your setup:** This is YOUR issue. All Ollama subagents hang.

**Workaround:** Use cloud models for all subagents. Keep Ollama for direct main-agent calls only.

### 5. Runaway Concurrency

**Problem:** You spawned 50 sub-agents and the gateway CPU spiked.

**Root cause:** No concurrency limits.

**Fix:**
```json5
agents: {
  defaults: {
    subagents: {
      maxConcurrent: 8,          // global cap
      maxChildrenPerAgent: 5,    // per-agent cap
      maxSpawnDepth: 2           // nesting cap
    }
  }
}
```

---

## Part 8: Real-World Patterns (From Community)

### Pattern 1: Parallel Research

**Goal:** Main agent asks 3 researchers to fetch different sources in parallel.

```python
# Main agent decision
researchers = [
    ("researcher_1", "Find latest news on Claude API"),
    ("researcher_2", "Find latest news on Ollama"),
    ("researcher_3", "Find latest news on vLLM"),
]

for label, task in researchers:
    sessions_spawn({
        task: task,
        label: label,
        model: "anthropic/claude-sonnet-4-5",
        runTimeoutSeconds: 120  // 2 min per researcher
    })

# Main agent waits for all announces, then synthesizes
```

**Timing:** All 3 run in parallel (respecting `maxConcurrent: 8`). Main agent gets results back via announces.

### Pattern 2: Premium Main + Cheap Workers

**Goal:** Opus orchestrates, Sonnet workers execute.

```json5
{
  agents: {
    list: [{
      id: "main",
      model: { primary: "anthropic/claude-opus-4-6" }  // expensive but smart
    }],
    defaults: {
      subagents: {
        model: "anthropic/claude-sonnet-4-5"  // cheap workers
      }
    }
  }
}
```

**Cost impact:** Main spends $50/mtok in, workers spend $3/mtok in. If 80% of tokens are worker tokens, total cost drops to ~10% of "all Opus" setup.

### Pattern 3: Domain Routing + Sub-agents

**Goal:** Coding agent spawns multiple compile/test sub-agents in parallel.

```python
# In coding agent workspace
agents: {
  list: [{
    id: "coding",
    workspace: "~/.openclaw/workspace-coding",
    model: { primary: "anthropic/claude-sonnet-4-5" }
  }]
}

# When coding agent needs tests:
sessions_spawn({
    task: "Run pytest on src/core/",
    agentId: "coding",
    model: "anthropic/claude-haiku-4-5",  // tiny for test runs
    runTimeoutSeconds: 300
})
```

### Pattern 4: Thread-Bound Persistent Sessions (Discord)

**Goal:** "/task something big" creates a Discord thread that stays bound to the sub-agent.

```python
# In Discord group chat
/subagents spawn main "Build a Wordle solver" --thread true --mode session

# Discord creates a thread, binds to that sub-agent session
# Follow-up messages in that thread keep routing to the same sub-agent
# Use /session idle to control auto-unfocus time
```

---

## Part 9: Monitoring & Debugging

### Session Introspection

```bash
# List all sub-agents for current requester
/subagents list

# Get one sub-agent's full details
/subagents info abc123

# Read transcript (last N lines)
/subagents log abc123 50

# Send a message to running sub-agent
/subagents send abc123 "Please also check for errors"

# Steering (interrupt + redirect)
/subagents steer abc123 "Stop and just list the top 5 findings"

# Kill it
/subagents kill abc123
```

### Token Budgeting

```bash
# See context injection per session
/context list
/context detail

# Check usage per response
/usage  // appends token footer to each message

# JSON dump for external monitoring
openclaw sessions --json | jq '.[] | {id, tokens, cost}'
```

### Config Debugging

```bash
# Verify agent list & bindings
openclaw agents list --bindings

# Check current gateway config
openclaw gateway config.get

# Validate subagent settings specifically
jq '.agents.defaults.subagents' ~/.openclaw/openclaw.json
```

---

## Part 10: Your Setup Recommendations

### Given Your Configuration

**Current State:**
- `qwen3.5:35b` primary local model (Ollama at 192.168.1.174: