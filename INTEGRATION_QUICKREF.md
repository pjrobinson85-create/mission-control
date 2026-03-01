# Mission Control: Integration Quick Reference

## Start Everything (One Command)

```bash
cd /root/.openclaw/workspace && node server.js
```

Then open: **http://localhost:8899**

---

## What Happens Automatically

| Event | Action | Result |
|-------|--------|--------|
| **Page loads** | Fetch `/mc/data` from server | Merge with localStorage |
| **You make a change** | Save to localStorage immediately | 1s delay, then POST to server |
| **Every 5 minutes** | POST full state to server | Backup created |
| **Every 30 seconds** | Check `/mc/status` | Update status indicator |
| **Every 30 minutes** | Fetch `/mc/weather` | Update temp in header |
| **Page closes** | Final server sync | If server online |

---

## Status Indicators

**Header (top right):**

🟢 **Green dot + "Server: Online"**
- Data backing up to server
- Activity being logged
- Weather updating

🔴 **Red dot + "Server: Offline"**
- Dashboard still works
- Using localStorage only
- Will auto-reconnect

---

## Files Involved

| File | Purpose | Status |
|------|---------|--------|
| `server.js` | Node.js backend | ✅ Running on 8899 |
| `mission-control.html` | Dashboard (updated) | ✅ Connected to server |
| `mc-data.json` | Data backup | ✅ Auto-created |
| `mc-activity.json` | Activity log | ✅ Auto-created |

---

## Quick Checks

**Is server running?**
```bash
curl http://localhost:8899/mc/status
```

**What's my latest activity?**
```bash
curl http://localhost:8899/mc/activity | jq '.[-5:]'
```

**Check my backup data:**
```bash
curl http://localhost:8899/mc/data | jq '.priorities'
```

**Get current weather:**
```bash
curl 'http://localhost:8899/mc/weather?city=Gold%20Coast,QLD'
```

---

## Troubleshooting in 60 Seconds

**Dashboard shows "Server: Offline"**
1. Check if server is running: `ps aux | grep node`
2. If not, run: `cd /root/.openclaw/workspace && node server.js`
3. Refresh browser page

**Port 8899 already in use**
```bash
lsof -i :8899        # See what's using it
kill -9 <PID>        # Kill it
node server.js       # Restart server
```

**Server crashed**
1. Check the terminal (error message)
2. Restart: `node server.js`
3. Dashboard keeps working offline

**Weather not showing**
1. Check your city in `mission-control.html` line ~1153
2. Use format: "City,State" (e.g., "Gold Coast,QLD")
3. Reload page

---

## Key Features

✅ **Data Persistence**
- Primary: Browser localStorage (fast, always works)
- Backup: Server JSON files (safety net)

✅ **Activity Tracking**
- Every action logged with timestamp
- View at `/mc/activity` endpoint
- Last 500 entries stored

✅ **Weather Integration**
- Live temperature + condition
- Displayed in header next to status
- Free API (wttr.in)

✅ **Offline-First**
- Works perfectly without server
- Auto-syncs when server returns
- No data loss ever

✅ **Zero Dependencies**
- Server: only Node.js built-ins
- Dashboard: pure HTML/CSS/JS
- No npm, no frameworks

---

## Configuration Changes

**Change server port:**
1. Edit `server.js` line 18: `const PORT = 8899;`
2. Edit `mission-control.html` line ~1151: `baseUrl: 'http://localhost:PORT'`
3. Restart server

**Change weather city:**
1. Edit `mission-control.html` line ~1153: `city: 'Your,City'`
2. Reload browser

**Disable server (stay offline-only):**
1. Edit `mission-control.html` line ~1150: `enabled: false`
2. Reload browser

---

## API Endpoints (for Reference)

```
GET  /mc/status              → Server uptime & health
GET  /mc/data                → Full dashboard state
POST /mc/data                → Backup dashboard state
GET  /mc/weather?city=...    → Live weather
GET  /mc/activity            → Activity log (last 50)
POST /mc/activity            → Log activity entry
```

---

## Dashboard & Server Work Together

**Browser = Fast, Responsive, Primary**
- All data in localStorage
- Changes instant
- Works offline
- User always feels speed

**Server = Reliable, Persistent, Secondary**
- Backup of your data
- Activity audit trail
- Weather enrichment
- Optional but recommended

---

## That's It!

You have:
- ✅ Mission Control dashboard (8 tabs, 50+ features)
- ✅ Node.js backend (6 API endpoints)
- ✅ Data sync (automatic, every 5 min)
- ✅ Weather widget (live in header)
- ✅ Activity logging (every action)
- ✅ Offline mode (fallback always works)
- ✅ Zero complexity (single file server)

**Next: Run it! 🚀**

```bash
cd /root/.openclaw/workspace && node server.js
```

Then: http://localhost:8899
