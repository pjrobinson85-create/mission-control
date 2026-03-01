# Mission Control — Live Command Center Dashboard

A modern, offline-first command center dashboard for personal task management, health tracking, and project monitoring. Built with vanilla JavaScript, Node.js, and SQLite-like JSON storage.

**Live Demo:** http://192.168.1.212:8899 (on LAN)

## Features

### Dashboard & Tabs
- 📊 **Dashboard** — Your command center at a glance with critical alerts and metrics
- 📋 **Tasks** — Kanban-style task board (Backlog, In Progress, Done)
- 🚨 **Critical Blockers** — What's stopping you, with age and impact analysis
- 💊 **Health & Wellness** — Medication schedule, bowel routine tracking, stress levels
- 🎯 **Projects** — Project progress bars and task summary
- 📅 **Timeline** — Roadmap to your goals with milestone tracking
- 💰 **Revenue** — Monthly revenue tracking and client management
- 🏢 **Command Center** — AI agent management and task delegation
- 📞 **Meetings** — Calendar integration with countdown timers
- 📡 **Intel** — News, trends, and market intelligence categorized by importance
- 📝 **Notes** — Quick notes with auto-save

### Data Management
- ✅ **Offline-First** — All data stored locally in browser (localStorage)
- ☁️ **Server Backup** — Optional Node.js server for data persistence and sync
- 🔄 **Auto-Sync** — Multi-device synchronization over LAN
- 💾 **JSON Storage** — Simple, human-readable data format
- 📊 **Activity Logging** — Complete audit trail of all actions

### Network & Access
- 🌐 **LAN Access** — Share dashboard across all devices on your network
- 🔒 **No Authentication** — Private network, no passwords needed
- 📱 **Responsive** — Works on phone, tablet, laptop, desktop
- 🖥️ **No Dependencies** — Server uses only Node.js built-in modules

## Quick Start

### 1. Start the Server

```bash
cd /root/.openclaw/workspace
node server.js
```

Output:
```
🚀 Mission Control Server Started
Local: http://localhost:8899
LAN:   http://192.168.1.212:8899
Status: ✓ Online
```

### 2. Open the Dashboard

**Local machine:**
```
http://localhost:8899/mission-control-live.html
```

**From another device (LAN):**
```
http://192.168.1.212:8899/mission-control-live.html
```

## Architecture

### Frontend
- **mission-control-live.html** — Pure HTML/CSS/JS dashboard (677 lines)
- No frameworks, no build step
- Real-time data pulling from server
- Auto-updates every 30 seconds

### Backend
- **server.js** — Node.js HTTP server (single file, ~500 lines)
- Only Node.js built-in modules (http, fs, path, url)
- 6 REST API endpoints for data access
- CORS enabled for multi-device sync

### Data Storage
- **tasks.json** — Your task list with projects and priorities
- **medication-state.json** — Health tracking
- **bowel-schedule.json** — Medical routine scheduling
- **stress-tracking.json** — Stress level monitoring
- **focus-state.json** — Productivity and energy tracking
- **mc-data.json** — Server backup of dashboard state
- **mc-activity.json** — Activity log with timestamps

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/mc/status` | Server health & uptime |
| GET | `/mc/data` | Read dashboard backup |
| POST | `/mc/data` | Save dashboard backup |
| GET | `/mc/tasks` | Live task data |
| GET | `/mc/health` | Medication, bowel, stress, focus state |
| GET | `/mc/blocker` | Critical blockers analysis |
| GET | `/mc/weather?city=...` | Live weather conditions |
| GET | `/mc/activity` | Activity log (last 50 entries) |
| POST | `/mc/activity` | Log activity entry |

## Configuration

### Change Server Port

Edit `server.js`:
```javascript
const PORT = 8899;  // Change this
```

### Change Weather City

Edit `mission-control-live.html`:
```javascript
const SERVER_CONFIG = {
    city: 'Sydney,NSW',  // Change this
};
```

### Disable Server (Offline-Only)

Edit `mission-control-live.html`:
```javascript
const SERVER_CONFIG = {
    enabled: false,  // Set to false
};
```

## Data Structure

### Tasks
```json
{
  "projects": [
    {
      "id": "ndis-review",
      "name": "NDIS Review",
      "description": "...",
      "color": "blue"
    }
  ],
  "tasks": [
    {
      "id": "ndis-email-lynne",
      "project": "ndis-review",
      "title": "Email Lynne: timeline + permission form",
      "priority": "critical",
      "status": "blocked",
      "notes": "...",
      "blocked_reason": "Need clarity on what Lynne expects"
    }
  ]
}
```

### Health
```json
{
  "medications": [
    {
      "id": "morning",
      "name": "Morning Medication",
      "time": "09:00",
      "taken_today": false
    }
  ]
}
```

## Performance

- **Startup:** <100ms (instant)
- **Page Load:** ~2 seconds
- **Data Refresh:** Every 30 seconds
- **Storage:** ~1-5 MB (browser localStorage)
- **Server Memory:** ~50 MB

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
mission-control/
├── mission-control-live.html    # Live dashboard (main UI)
├── mission-control.html         # Original dashboard (sample data)
├── server.js                    # Node.js backend server
├── START.sh                     # Startup script
│
├── Data Files (auto-created):
├── mc-data.json                 # Dashboard backup
├── mc-activity.json             # Activity log
├── tasks.json                   # Task database
├── medication-state.json        # Health tracking
├── bowel-schedule.json          # Medical routine
├── stress-tracking.json         # Stress levels
└── focus-state.json             # Productivity state
│
└── Documentation:
    ├── README.md                # This file
    ├── QUICKSTART.md            # 2-minute setup
    ├── LAN_SETUP.md             # Network access guide
    ├── INTEGRATION_GUIDE.md      # Dashboard+server connection
    ├── LIVE_DEPLOYMENT.md       # Phase 1 deployment notes
    └── SERVER_SETUP.md          # Auto-start configuration
```

## Troubleshooting

### Server won't start (port in use)
```bash
lsof -i :8899
kill -9 <PID>
node server.js
```

### Can't access from another device
1. Check both devices on same WiFi
2. Use the LAN IP address (not localhost)
3. Check firewall allows port 8899

### Dashboard shows "Server: Offline"
1. Verify server is running
2. Check network connectivity
3. Refresh the page

### Data not syncing across devices
1. Refresh the page on other device
2. Wait up to 5 minutes for sync interval
3. Check server is still running

## Future Enhancements (Phase 2)

- 📅 Google Calendar integration
- 🤖 AI-powered task recommendations
- 📊 Advanced analytics & insights
- 🔔 Proactive notifications
- 🎯 Goal tracking & progress visualization
- 💬 Chat-based task interface

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Node.js (built-in modules only)
- **Storage:** JSON files + browser localStorage
- **Deployment:** Single server (any OS), self-contained

## License

MIT

## Author

Built for Paul Robinson (Aurora Engineering)

## Contributing

This is a personal project, but improvements and feedback are welcome. Open an issue or submit a PR!

## Support

For issues, questions, or feature requests:
- Check the documentation files (QUICKSTART.md, LAN_SETUP.md, etc.)
- Open an issue on GitHub
- Review the browser console (F12) for errors

---

**Mission Control** — Stay on top of everything. 🚀
