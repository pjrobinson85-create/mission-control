# Mission Control Server Setup Guide

## Quick Start (30 seconds)

### 1. Navigate to the workspace
```bash
cd /root/.openclaw/workspace
```

### 2. Start the server
```bash
node server.js
```

### 3. Open in browser
```
http://localhost:8899
```

---

## What You Get

A lightweight Node.js server running on **port 8899** that:
- ✅ Serves your Mission Control dashboard
- ✅ Persists all data to local JSON files
- ✅ Provides REST API endpoints for dashboard features
- ✅ Tracks activity and system status
- ✅ Fetches live weather data
- ✅ Syncs data between server and browser
- ✅ No dependencies, no databases, no complexity

---

## API Endpoints Reference

### System Status
```
GET http://localhost:8899/mc/status
```
Returns: Server uptime, health status, timestamp

### Dashboard Data (Read)
```
GET http://localhost:8899/mc/data
```
Returns: All dashboard state from `mc-data.json`

### Dashboard Data (Write)
```
POST http://localhost:8899/mc/data
Content-Type: application/json

{ "priorities": {...}, "tasks": {...}, ...}
```
Saves dashboard state to `mc-data.json`

### Weather
```
GET http://localhost:8899/mc/weather?city=Gold%20Coast,QLD
```
Returns: Temperature, condition, feels_like, humidity, wind_speed

### Activity Log (Read)
```
GET http://localhost:8899/mc/activity
```
Returns: Last 50 activity entries from `mc-activity.json`

### Activity Log (Write)
```
POST http://localhost:8899/mc/activity
Content-Type: application/json

{ "message": "Task completed", "type": "custom" }
```
Appends entry to `mc-activity.json`

---

## Data Files

The server creates and manages two JSON files in the workspace:

### `mc-data.json`
Stores your complete Mission Control state:
- Dashboard metrics
- Projects & tasks
- Timeline data
- Revenue info
- AI agents
- Meetings
- Intel items
- Everything!

This is your backup. Browser localStorage syncs here when you click "Sync to Server" (feature coming soon).

### `mc-activity.json`
Logs all server activity:
- API calls
- Data saves
- User actions
- Timestamps
- Metadata

Keep the last 500 entries for history. Perfect for debugging and audits.

---

## File Structure

```
/root/.openclaw/workspace/
├── server.js                 ← The server (this file)
├── mission-control.html      ← Your dashboard
├── mc-data.json              ← Dashboard state (created on first save)
├── mc-activity.json          ← Activity log (created automatically)
└── SERVER_SETUP.md           ← This guide
```

---

## Configuration

### Change the port
Edit line in `server.js`:
```javascript
const PORT = 8899;  // ← Change this
```

Then restart the server.

### Change data file location
Edit lines in `server.js`:
```javascript
const DATA_FILE = path.join(__dirname, 'mc-data.json');
const ACTIVITY_FILE = path.join(__dirname, 'mc-activity.json');
```

---

## Auto-Start on Linux (systemd)

Want the server to start automatically when your system boots?

### Create a systemd service

1. Create the service file:
```bash
sudo nano /etc/systemd/system/mission-control.service
```

2. Paste this (replace `/root/.openclaw/workspace` with your actual path):
```ini
[Unit]
Description=Mission Control Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/.openclaw/workspace
ExecStart=/usr/bin/node /root/.openclaw/workspace/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

3. Save and exit (Ctrl+X, Y, Enter)

4. Enable the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable mission-control
sudo systemctl start mission-control
```

5. Check status:
```bash
sudo systemctl status mission-control
```

6. View logs:
```bash
sudo journalctl -u mission-control -f
```

To stop:
```bash
sudo systemctl stop mission-control
```

To disable auto-start:
```bash
sudo systemctl disable mission-control
```

---

## Auto-Start on macOS (LaunchAgent)

### Create a Launch Agent

1. Create the plist file:
```bash
nano ~/.local/share/launchd/local.missioncontrol.plist
```

(Create the directory if it doesn't exist:)
```bash
mkdir -p ~/.local/share/launchd
```

2. Paste this (replace `/path/to/workspace`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>local.missioncontrol</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/workspace/server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/mission-control.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/mission-control-error.log</string>
</dict>
</plist>
```

3. Load it:
```bash
launchctl load ~/.local/share/launchd/local.missioncontrol.plist
```

4. Verify it's running:
```bash
launchctl list | grep missioncontrol
```

5. Tail the logs:
```bash
tail -f /tmp/mission-control.log
```

To unload:
```bash
launchctl unload ~/.local/share/launchd/local.missioncontrol.plist
```

---

## Auto-Start on Windows (Task Scheduler)

### Create a Scheduled Task

1. Open Task Scheduler (search for it)

2. Click "Create Basic Task"

3. Fill in:
   - **Name:** Mission Control Server
   - **Trigger:** At startup
   - **Action:** Start a program
     - Program: `C:\Program Files\nodejs\node.exe` (or your Node.js path)
     - Arguments: `C:\path\to\server.js`
     - Start in: `C:\path\to\workspace`

4. Check "Run with highest privileges"

5. Click Finish

To verify:
1. Open Task Scheduler Library
2. Look for "Mission Control Server"
3. It should show Status: "Ready"

---

## Troubleshooting

### "Port 8899 already in use"
```bash
# Find what's using the port
lsof -i :8899

# Kill the process
kill -9 <PID>

# Or change the port in server.js
```

### "Cannot find module"
Make sure you're using Node.js 12+:
```bash
node --version
```

### "Permission denied"
Make the file executable:
```bash
chmod +x /root/.openclaw/workspace/server.js
```

### "Data files not created"
They're created automatically on first API call. If they don't exist:
```bash
touch /root/.openclaw/workspace/mc-data.json
touch /root/.openclaw/workspace/mc-activity.json
```

### Check the activity log
```bash
cat /root/.openclaw/workspace/mc-activity.json | jq '.' # pretty print
```

---

## Development Notes

### No External Dependencies
This server uses **only Node.js built-in modules**:
- `http` — HTTP server
- `fs` — File I/O
- `path` — Path utilities
- `url` — URL parsing

No npm packages. No `node_modules`. Just Node.js.

### CORS Enabled
All endpoints allow cross-origin requests for local development.

### Error Handling
- Graceful file read/write with defaults
- JSON parse errors return sensible defaults
- All errors logged to activity file
- Server stays up even if files can't be written

### Future Enhancements
- [ ] Add authentication (JWT tokens)
- [ ] Add database (SQLite)
- [ ] Add file uploads for attachments
- [ ] Add WebSocket for real-time sync
- [ ] Add backup/restore functionality
- [ ] Add data export (CSV, Excel)

---

## Examples

### Fetch weather from the CLI
```bash
curl "http://localhost:8899/mc/weather?city=Gold%20Coast,QLD"
```

### Save dashboard data
```bash
curl -X POST http://localhost:8899/mc/data \
  -H "Content-Type: application/json" \
  -d @mc-data.json
```

### Get activity log
```bash
curl http://localhost:8899/mc/activity | jq '.'
```

### Check server status
```bash
curl http://localhost:8899/mc/status | jq '.'
```

---

## Questions?

- Check the activity log: `mc-activity.json`
- Review server output when starting: `node server.js`
- All API responses include timestamps
- Check browser console for client-side errors

Happy coding! 🚀
