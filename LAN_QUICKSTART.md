# Mission Control: LAN Access — Quick Start

## Start Server

```bash
cd /root/.openclaw/workspace
node server.js
```

**You'll see:**
```
═══════════════════════════════════════════════════════════
  🚀 Mission Control Server Started
═══════════════════════════════════════════════════════════
  Local:     http://localhost:8899
  LAN:       http://192.168.1.100:8899
  Port:      8899
  Status:    ✓ Online
═══════════════════════════════════════════════════════════
```

---

## Access From Your Network

### On Server Machine (Same Computer)
```
http://localhost:8899
```

### On Another Device (Same Network)
```
http://192.168.1.100:8899
```
(Use the **LAN** address from server startup)

---

## What Works

✅ Access from phone, tablet, laptop, desktop
✅ All on same WiFi/network
✅ Data syncs in real-time
✅ Works offline (localStorage backup)
✅ No passwords needed (local network)

---

## If Address Changes

1. Click **🌐 LAN Setup** button in dashboard (top right)
2. Enter your server's new IP address
3. Click "Save Configuration"
4. Dashboard remembers it next time

---

## Find Server IP (If Unsure)

**Linux/Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for `192.168.x.x` or `10.0.x.x`

---

## Troubleshooting in 30 Seconds

| Problem | Solution |
|---------|----------|
| Can't connect | Check both devices on same WiFi |
| Connection refused | Is server running? (`node server.js`) |
| Wrong IP | Copy from server startup output |
| Firewall blocked | Allow port 8899: `sudo ufw allow 8899` |
| Devices out of sync | Refresh page (F5) or wait 5 min |

---

## That's It!

Run server → Copy LAN address → Open in any browser on your network

**All your devices, fully synced.** 🚀
