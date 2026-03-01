# OpenClaw Diagnostic Toolkit

Comprehensive diagnostic and debugging tools for your OpenClaw agent system.

## Quick Start

```bash
cd ~/. openclaw/workspace/diagnostics
./diag help
```

## Tools Overview

### 1. System Health Check (`diag health`)

Monitors core system components and alerts on failures with exponential backoff.

**Features:**
- Gateway process status
- Port reachability checks
- RPC health verification
- Error log scanning
- Disk space monitoring
- Workspace integrity verification
- Alert frequency tracking (prevents spam)

**Usage:**
```bash
./diag health              # Quick check
./diag health --verbose    # Detailed output
```

**Alert Backoff Schedule:**
- Attempt 1: 5 minutes
- Attempt 2: 15 minutes
- Attempt 3: 1 hour
- Attempt 4: 3 hours
- Attempt 5+: 12 hours (max)

Resets to zero on successful health check.

---

### 2. Cron Job Debugging (`diag cron`)

Query cron history, detect persistent failures, and clean stale jobs.

**Commands:**

#### Query History
```bash
./diag cron query [options]
  --name <pattern>      Filter by job name (substring)
  --status <s|f>        Filter by success/failure
  --limit <N>           Limit results (default: 50)
```

**Examples:**
```bash
./diag cron query --name "Health" --status failure
./diag cron query --limit 100
```

#### Detect Persistent Failures
Flags jobs that failed 3+ times within a 6-hour window.

```bash
./diag cron detect-failures
```

**Output:**
```
⚠️  PERSISTENT FAILURE: Platform Health Review
   Failures in last 6 hours: 4
   Recent runs:
     [failure] 2026-03-01 02:15:33
     [failure] 2026-03-01 02:00:12
     ...
```

#### Clean Stale Jobs
Finds jobs stuck in "running" state for >2 hours (handles crashes, machine sleep).

```bash
./diag cron clean-stale
```

---

### 3. Unified Log Viewer (`diag logs`)

Single interface to OpenClaw's event log stream with powerful filtering.

**Filters:**
```bash
--event <name>        Event name filter
--level <level>       Log level (error, warn, info, debug)
--content <text>      Content substring search
--time <range>        Time range (1h, 6h, 1d)
--json                JSON output mode
--limit <N>           Result limit (default: 100)
```

**Quick Aliases:**
```bash
./diag logs --recent-errors    # Errors in last hour
./diag logs --recent-warns     # Warnings in last hour
./diag logs --tail [N]         # Follow log (real-time)
```

**Examples:**
```bash
# Find timeout errors in last 6 hours
./diag logs --content "timeout" --time 6h --level error

# Watch logs in real-time
./diag logs --tail 100

# Export errors as JSON for analysis
./diag logs --recent-errors --json > errors.json

# Search for specific event
./diag logs --event "cron.run" --status failure
```

---

### 4. Model & Provider Diagnostics (`diag model`)

Status checks, canary tests, and usage dashboards for LLM providers.

**Commands:**

#### Status
Shows current model configuration and connection status.

```bash
./diag model status
```

**Output:**
```
========== MODEL STATUS ==========

Default Model: ollama/qwen3.5:35b

Ollama Connection:
  Host: http://192.168.1.174:11434
  Status: ✓ Connected
  Available models:
    - qwen3.5:35b
    - qwen3.5:27b
    - llama3.2:3b

Context Settings:
  Context window: 32000
  Max output: 8000

Plugin Connections:
  telegram: enabled
  ollama: enabled
```

#### Canary Test
Sends a test prompt to verify model is working correctly.

```bash
./diag model canary [model]
```

**Examples:**
```bash
./diag model canary                    # Test default model
./diag model canary ollama/qwen3.5:35b # Test specific model
```

**Output:**
```
========== CANARY TEST ==========

Testing model: ollama/qwen3.5:35b

Sending test prompt...
✓ SUCCESS
Response: CANARY_OK
✓ Model responding correctly
```

#### Usage Dashboard
Storage, cron stats, and activity metrics.

```bash
./diag model usage
```

**Output:**
```
========== USAGE DASHBOARD ==========

Storage:
  Workspace: 24M
  Learnings: 48K
  Memory: 120K

Cron Jobs:
  Total jobs: 6
  (Run stats require individual job queries)

Recent Activity (last 24h):
  Errors: 2
  Warnings: 8

Model Costs:
  Anthropic: https://console.anthropic.com
  Local models (Ollama): Free
```

---

## Master Command: `diag all`

Run all diagnostics in sequence for comprehensive system check.

```bash
./diag all
```

Executes:
1. Health check (verbose)
2. Cron failure detection
3. Model status

---

## Directory Structure

```
diagnostics/
├── diag                    # Master command
├── scripts/
│   ├── health-check.sh     # System health monitor
│   ├── cron-debug.sh       # Cron debugging tools
│   ├── log-viewer.sh       # Log query interface
│   └── model-diagnostics.sh # Model/provider tools
├── state/
│   └── health-state.json   # Alert backoff state
└── README.md               # This file
```

---

## Integration with Self-Improvement Systems

These diagnostics complement the learnings framework:

- **Health checks** → Feed data to Platform Health Review
- **Cron debugging** → Informs Innovation Scout about reliability
- **Log analysis** → Populates ERRORS.md with patterns
- **Model diagnostics** → Tracks provider performance

---

## Automation Recommendations

### Daily Health Check (Cron)
```bash
# Add to cron: 0 */6 * * * (every 6 hours)
cd ~/.openclaw/workspace/diagnostics && ./diag health
```

### Weekly Deep Diagnostics
```bash
# Add to cron: 0 6 * * 0 (Sundays 6 AM)
cd ~/.openclaw/workspace/diagnostics && ./diag all
```

### Alert on Persistent Failures
```bash
# Add to cron: 0 */3 * * * (every 3 hours)
cd ~/.openclaw/workspace/diagnostics && ./diag cron detect-failures
```

---

## Troubleshooting

### "openclaw: command not found"
The CLI may not be in PATH. Use full path:
```bash
/usr/local/bin/openclaw cron list
# or
node /usr/lib/node_modules/openclaw/dist/cli.js cron list
```

### "No log files found"
Check log directory exists:
```bash
ls -la /tmp/openclaw/
```

### Cron API errors
Verify gateway is running:
```bash
./diag health
```

---

## Contributing

Found a bug or have an improvement? Document it:
- Bugs → `learnings/ERRORS.md`
- Features → `learnings/FEATURE_REQUESTS.md`
- Learnings → `learnings/LEARNINGS.md`

---

**Last Updated:** 2026-03-01  
**Version:** 1.0
