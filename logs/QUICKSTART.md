# Logging Infrastructure - Quick Start

## 5-Minute Setup

```bash
cd ~/.openclaw/workspace/logs

# 1. Initialize
./log init

# 2. Test logging
./log test

# 3. View logs
./log view

# Done!
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./log init` | Initialize infrastructure |
| `./log test` | Create test log entries |
| `./log view` | View logs with filters |
| `./log tail` | Follow logs in real-time |
| `./log ingest` | JSONL → database |
| `./log rotate` | Rotate large files |
| `./log stats` | Show statistics |

---

## Common Usage

### View Logs

```bash
# Recent logs
./log view

# Errors only
./log view --level error

# Specific event
./log view --event "user.login"

# Time range
./log view --from 2026-03-01 --to 2026-03-02

# Follow in real-time
./log tail
```

### Programmatic Logging

**Bash:**
```bash
source logs/lib/log-core.sh
log_info "my.event" "Something happened" '{"key": "value"}'
log_error "my.event" "Error occurred" '{"error": "details"}'
```

**Python:**
```python
from logs.lib.log_core import logger
logger.info('my.event', 'Something happened', key='value')
logger.error('my.event', 'Error occurred', error='details')
```

**Node.js:**
```javascript
const { logger } = require('./logs/lib/log-core.js');
logger.info('my.event', 'Something happened', { key: 'value' });
logger.error('my.event', 'Error occurred', { error: 'details' });
```

---

## Automation

Add to crontab:

```bash
# Nightly ingest (02:00)
0 2 * * * cd ~/.openclaw/workspace/logs && ./log ingest

# Daily rotation (03:00)
0 3 * * * cd ~/.openclaw/workspace/logs && ./log rotate
```

---

## Event Naming

Use dot-notation:
- ✅ `user.login`
- ✅ `api.call.success`
- ✅ `cron.job.complete`
- ❌ `userLogin`
- ❌ `api-call`

---

## Log Levels

| Level | Purpose |
|-------|---------|
| `debug` | Development details |
| `info` | Normal operations |
| `warn` | Potential issues |
| `error` | Handled errors |
| `fatal` | System failures |

---

## Secret Redaction

Automatic redaction of:
- `password`
- `token`
- `api_key`
- `secret`
- `credential`
- `authorization`

```json
// Input
{"password": "secret123"}

// Output
{"password": "***REDACTED***"}
```

---

## Troubleshooting

**No logs appearing?**
```bash
./log init
source logs/lib/log-core.sh
log_info "test" "Test message"
./log view --event test
```

**Database errors?**
```bash
./log init
```

**Missing dependencies?**
```bash
apt-get install -y jq sqlite3
```

---

## Next Steps

- Read [README.md](README.md) for full documentation
- Set up automated ingest/rotation (cron)
- Integrate with your applications
- Configure retention policies

---

**Quick help:** `./log help`
