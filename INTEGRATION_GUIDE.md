# Mission Control: Dashboard + Server Integration Guide

## What's New

Your Mission Control dashboard is now integrated with the local Node.js server. Everything works seamlessly:

✅ **Browser localStorage** = Primary data storage (always works, even offline)
✅ **Server (localhost:8899)** = Backup + data enrichment layer
✅ **Weather API** = Live conditions displayed in header
✅ **Activity logging** = Track all user actions on the server
✅ **Graceful fallback** = If server goes down, dashboard still works perfectly

---

## Quick Start

### 1. Start the server

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

### 2. Open the dashboard

```
http://localhost:8899
```

### 3. Watch the magic

✨ On page load:
- Server status dot turns **green** ✓
- "Server: Online" appears in header
- Weather widget shows **temperature + condition**
- Dashboard syncs with server backup

---

## How It Works

### Data Flow

```
Browser (localStorage)
    ↓↑ (primary)
    ↓ (backup)
Server (JSON files)
    ↓ (enrichment)
Weather API (wttr.in)
Activity Log
```

### Timeline

1. **Page Load (0s)**
   - Fetch `/mc/data` from server
   - Merge with localStorage (localStorage = primary)
   - Fetch weather from `/mc/weather`
   - Set status indicator to green

2. **Every Change (1s debounce)**
   - Save to localStorage immediately
   - Queue server sync
   - POST change description to `/mc/activity`

3. **Every 5 Minutes (300s)**
   - POST entire dashboard state to `/mc/data`
   - Server creates backup of your data

4. **Every 30 Seconds**
   - Check server connection status
   - Update status indicator (green/red)

5. **Every 30 Minutes**
   - Fetch fresh weather
   - Update temperature + condition in header

6. **On Page Close**
   - Final server sync if connected
   - Save to localStorage (always works)

### Server Status Indicator

**Green ✓** = Server is online
- Data syncing to backup
- Weather updating
- Activity logging

**Red ✗** = Server is offline
- Dashboard still works (localStorage-only mode)
- No activity logging
- No weather updates
- Will reconnect automatically when server comes back online

---

## Features in Detail

### 1. Data Sync

**How it works:**
- All changes saved to **localStorage immediately**
- After 1 second of inactivity, changes POST to server
- Every 5 minutes, full state syncs to server
- On page load, server data merges with localStorage (localStorage wins if newer)

**Why this way:**
- You never lose work (localStorage always saves)
- Server is a safety backup, not a requirement
- No network latency slowing down your work
- Automatic recovery if browser crashes

**What's backed up:**
- All priorities, projects, meetings
- Revenue & agent data
- Timeline, intel, notes
- User preferences
- Everything except password (none to store)

### 2. Weather Integration

**Display location:** Header, next to server status indicator

**Data shown:**
- Current temperature (°C)
- Weather condition (Sunny, Cloudy, Rainy, etc.)
- Weather emoji (☀️ ☁️ 🌧️)

**Update frequency:** Every 30 minutes (or on manual refresh)

**Configure location:**
Edit line in `mission-control.html`:
```javascript
const SERVER_CONFIG = {
    ...
    city: 'Gold Coast,QLD',  // ← Change this
    ...
};
```

Then reload the page.

### 3. Activity Logging

**What gets logged:**
- Priority created/completed
- Tasks created
- Meetings created/updated
- Meetings agenda items toggled
- Notes updated
- Data synced to server
- All with timestamps

**Where to view:**
```bash
# See activity log file
cat /root/.openclaw/workspace/mc-activity.json | jq '.'

# Or via API
curl http://localhost:8899/mc/activity
```

**Example log entry:**
```json
{
  "id": "a1709294400123",
  "type": "priority_add",
  "message": "Added week priority: Finish Trailer",
  "timestamp": "2026-03-01T21:20:00.123Z"
}
```

### 4. Fallback & Offline Mode

**If server goes down:**
✅ Dashboard still works perfectly
✅ All data saved to localStorage
✅ Weather widget freezes at last known value
✅ Server status shows red
✅ Activity not logged (server only)

**When server comes back online:**
✅ Status indicator turns green
✅ Automatic sync of any changes you made
✅ Fresh weather update
✅ New activity logged

**You never have to do anything!** The fallback is automatic.

---

## Configuration

### Change Server Port

Edit `server.js`:
```javascript
const PORT = 8899;  // ← Change this
```

Then update `mission-control.html`:
```javascript
const SERVER_CONFIG = {
    ...
    baseUrl: 'http://localhost:8899',  // ← Update this
    ...
};
```

### Change Weather City

Edit `mission-control.html`:
```javascript
const SERVER_CONFIG = {
    ...
    city: 'Sydney,NSW',  // ← Change this
    ...
};
```

### Change Sync Interval

Edit `mission-control.html`:
```javascript
const SERVER_CONFIG = {
    ...
    syncInterval: 5 * 60 * 1000,  // ← 5 minutes, change to whatever
    ...
};
```

### Disable Server Integration (Optional)

Edit `mission-control.html`:
```javascript
const SERVER_CONFIG = {
    enabled: false,  // ← Set to false
    ...
};
```

---

## Monitoring

### Check Server Status

```bash
curl http://localhost:8899/mc/status | jq '.'
```

Returns:
```json
{
  "server": "online",
  "uptime": "2h 15m",
  "uptimeMs": 8100000,
  "lastRefresh": "2026-03-01T21:20:00.123Z",
  "connection": "healthy",
  "version": "1.0.0",
  "port": 8899,
  "timestamp": 1709294400123
}
```

### View Dashboard Data

```bash
curl http://localhost:8899/mc/data | jq '.'
```

### View Activity Log

```bash
curl http://localhost:8899/mc/activity | jq '.'
```

Latest 50 entries are shown.

### Check Weather Endpoint

```bash
curl 'http://localhost:8899/mc/weather?city=Gold%20Coast,QLD' | jq '.'
```

Returns:
```json
{
  "city": "Gold Coast,QLD",
  "temperature": 28,
  "condition": "Sunny",
  "feelsLike": 32,
  "humidity": 65,
  "windSpeed": 12,
  "timestamp": "2026-03-01T21:20:00.123Z"
}
```

---

## Troubleshooting

### Server not connecting

1. Make sure server is running:
   ```bash
   # In terminal where you ran: node server.js
   # You should see the startup banner
   ```

2. Check if port 8899 is available:
   ```bash
   lsof -i :8899
   ```

3. If port is busy, kill the process:
   ```bash
   kill -9 <PID>
   ```

4. Or change the port (see Configuration above)

5. Reload the dashboard page

### Weather not updating

1. Check your city setting in `mission-control.html`
2. Make sure it's a real city (e.g., "Gold Coast,QLD")
3. Check the browser console (F12 > Console) for errors
4. Try a different city name

Example valid cities:
- `Gold Coast,QLD`
- `Sydney,NSW`
- `Brisbane,QLD`
- `Melbourne,VIC`
- `London,UK`
- `New York,USA`

### Server went offline

No action needed! Your dashboard:
- ✅ Still works perfectly
- ✅ Saves to localStorage
- ✅ Status shows red
- ✅ Will sync when server comes back

To bring server back:
```bash
# Stop the old one (Ctrl+C in terminal)
# Or: pkill -f "node server.js"

# Start it again
cd /root/.openclaw/workspace
node server.js
```

### Activity not logging

1. Check server is running and green status shows
2. Make sure you're making changes (not just viewing)
3. Check activity log file exists:
   ```bash
   ls -la /root/.openclaw/workspace/mc-activity.json
   ```

4. View recent activity:
   ```bash
   curl http://localhost:8899/mc/activity | jq '.[-5:]'
   ```

### Data didn't sync

1. Check server status in header (green/red)
2. Try manually closing/reopening the page
3. Try restarting the server
4. Check `mc-data.json` exists:
   ```bash
   ls -la /root/.openclaw/workspace/mc-data.json
   ```

---

## API Reference (for developers)

All endpoints return JSON.

### GET /mc/status
Server health check

```bash
curl http://localhost:8899/mc/status
```

### GET /mc/data
Read dashboard state

```bash
curl http://localhost:8899/mc/data > backup.json
```

### POST /mc/data
Save dashboard state

```bash
curl -X POST http://localhost:8899/mc/data \
  -H 'Content-Type: application/json' \
  -d @backup.json
```

### GET /mc/weather?city=CITY
Live weather

```bash
curl 'http://localhost:8899/mc/weather?city=Gold%20Coast,QLD'
```

### GET /mc/activity
Activity log (last 50)

```bash
curl http://localhost:8899/mc/activity
```

### POST /mc/activity
Log activity

```bash
curl -X POST http://localhost:8899/mc/activity \
  -H 'Content-Type: application/json' \
  -d '{"message":"Test activity","type":"test"}'
```

---

## Dashboard Features (All Working!)

| Feature | Works Offline? | Syncs to Server? | Notes |
|---------|---|---|---|
| Priorities & Tasks | ✅ | ✅ | Syncs every 5 min |
| Projects & Kanban | ✅ | ✅ | Real-time localStorage |
| Timeline | ✅ | ✅ | Backed up server-side |
| Revenue & Clients | ✅ | ✅ | Full persistence |
| Meetings | ✅ | ✅ | Activity logged |
| Agents & Decisions | ✅ | ✅ | Command center live |
| Intel & News | ✅ | ✅ | Categories synced |
| Notes | ✅ | ✅ | Auto-saves + syncs |
| Weather | ⚠️ | N/A | Frozen if offline |
| Activity Log | ✅ | ⚠️ | Local only if server down |

---

## Performance Notes

- **Startup:** 0-100ms (instant)
- **Data sync:** 1-2s debounce (after changes)
- **Server sync:** Every 5 minutes (background)
- **Weather update:** Every 30 minutes
- **Connection check:** Every 30 seconds
- **localStorage:** Synchronous, instant

Everything is designed to be **fast, responsive, and reliable**.

---

## Next Steps

1. ✅ Run `node server.js`
2. ✅ Open `http://localhost:8899`
3. ✅ Watch the status indicator go green
4. ✅ Check weather in header
5. ✅ Make some changes (add priority, create task, etc.)
6. ✅ Check the activity log: `curl http://localhost:8899/mc/activity`
7. ✅ Stop the server (Ctrl+C) and keep using dashboard
8. ✅ Start the server again and see automatic sync

You now have a **bulletproof, offline-first** command center with optional cloud backup.

Welcome to Mission Control! 🚀
