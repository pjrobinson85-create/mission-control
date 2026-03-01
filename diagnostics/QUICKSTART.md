# Diagnostic Toolkit - Quick Reference

## Installation

Already installed at: `~/.openclaw/workspace/diagnostics/`

## Quick Commands

```bash
cd ~/.openclaw/workspace/diagnostics

# System health check
./diag health

# Find failing cron jobs
./diag cron detect-failures

# Show recent errors
./diag logs --recent-errors

# Check model status
./diag model status

# Test model connectivity
./diag model canary

# Run everything
./diag all
```

## Most Useful Commands

### Daily Health Check
```bash
./diag health --verbose
```
Checks: gateway process, port, RPC, logs, disk, workspace integrity

### Debug Cron Job Failures
```bash
./diag cron detect-failures
```
Flags jobs that failed 3+ times in 6 hours

### Watch Logs in Real-Time
```bash
./diag logs --tail 100
```
Follow log stream (like `tail -f`)

### Find Specific Errors
```bash
./diag logs --content "timeout" --time 6h
```
Search for "timeout" in logs from last 6 hours

### Check Storage Usage
```bash
./diag model usage
```
Shows workspace size, cron stats, recent activity

## Troubleshooting

**"openclaw: command not found"**
- Scripts will fall back to node if CLI not in PATH
- Non-critical, most features still work

**"No log files found"**
- Logs are in `/tmp/openclaw/`
- Check gateway is running: `./diag health`

**Cron queries fail**
- Verify gateway connection: `openclaw gateway status`
- Check gateway auth token is set

## Alert Backoff

Health check alerts use exponential backoff:
- 1st alert: immediate
- 2nd alert: 5 minutes later
- 3rd alert: 15 minutes later
- 4th alert: 1 hour later
- 5th+ alert: 3-12 hours later

Resets when health check passes.

## Automation

Add to cron for automated monitoring:

```bash
# Every 6 hours: health check
0 */6 * * * cd ~/.openclaw/workspace/diagnostics && ./diag health

# Every 3 hours: check for persistent failures
0 */3 * * * cd ~/.openclaw/workspace/diagnostics && ./diag cron detect-failures

# Sundays at 6 AM: full diagnostic
0 6 * * 0 cd ~/.openclaw/workspace/diagnostics && ./diag all
```

## Full Documentation

See `README.md` for complete documentation.
