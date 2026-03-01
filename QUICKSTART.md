# Mission Control Server — Quick Start (2 minutes)

## Start the server right now

```bash
cd /root/.openclaw/workspace
node server.js
```

You'll see:
```
═══════════════════════════════════════════════════════════
  🚀 Mission Control Server Started
═══════════════════════════════════════════════════════════
  URL:     http://localhost:8899
  Port:    8899
  Status:  ✓ Online
═══════════════════════════════════════════════════════════
```

## Open in browser

```
http://localhost:8899
```

Done! Your dashboard is live with a backend server.

---

## What just happened?

1. **Node.js HTTP server** started on port 8899
2. **Mission Control dashboard** is being served at the root
3. **API endpoints** are ready for data sync
4. **Activity logging** is tracking everything
5. **Weather API** integration is live

---

## Test the API endpoints

### Check server status
```bash
curl http://localhost:8899/mc/status
```

### Get weather
```bash
curl "http://localhost:8899/mc/weather?city=Gold%20Coast,QLD"
```

### View activity log
```bash
curl http://localhost:8899/mc/activity
```

---

## Data files created

The server auto-creates:
- `mc-data.json` — Your dashboard state backup
- `mc-activity.json` — Server activity log

Both stored in `/root/.openclaw/workspace/`

---

## Stop the server

Press **Ctrl+C** in the terminal

---

## Make it auto-start

See `SERVER_SETUP.md` for:
- Linux (systemd)
- macOS (LaunchAgent)
- Windows (Task Scheduler)

---

## API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/mc/status` | Server health |
| GET | `/mc/data` | Read dashboard data |
| POST | `/mc/data` | Save dashboard data |
| GET | `/mc/weather?city=...` | Live weather |
| GET | `/mc/activity` | Activity log |
| POST | `/mc/activity` | Log activity |

---

## That's it!

Your Mission Control dashboard is now powered by a real backend server. All data persists. Activity is logged. Weather updates live.

Next step: Update your dashboard to use these endpoints!

Questions? See `SERVER_SETUP.md` for detailed setup and troubleshooting.
