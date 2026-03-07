# Mission Control: LAN Access Setup Guide

## Quick Start (5 minutes)

### 1. Start the server
```bash
cd /root/.openclaw/workspace
node server.js
```

You'll see output like:
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

**Copy the LAN address** (e.g., `http://192.168.1.100:8899`)

### 2. Access from any device on your network

**On any device connected to your LAN:**
1. Open a web browser
2. Go to: `http://192.168.1.100:8899` (use the address from server startup)
3. Mission Control loads with all your data synced

### 3. (Optional) Save the server address in dashboard

1. Click the **🌐 LAN Setup** button in the header
2. Your current server address shows
3. Click **Save Configuration** to remember this address
4. Next time, dashboard auto-connects to this server

---

## How It Works

### Architecture

```
Server Machine (Debian/Linux)
├── Runs: node server.js
├── Listens on: 0.0.0.0:8899 (all network interfaces)
└── Stores: mc-data.json, mc-activity.json

LAN Network (192.168.x.x)
├── Device A: Opens http://192.168.1.100:8899 → See Dashboard
├── Device B: Opens http://192.168.1.100:8899 → See Same Dashboard
├── Device C: Opens http://192.168.1.100:8899 → Full Sync
└── All devices share same data in real-time

Data Flow:
Browser A → Server → Browser B
Browser B → Server → Browser A
Browser C → Server → All Others
```

### Data Sync Across Devices

```
Device A makes a change
    ↓
Save to localStorage A (instant)
    ↓
POST to /mc/data (5 second debounce)
    ↓
Server saves mc-data.json
    ↓
Device B fetches /mc/data (next sync interval or page load)
    ↓
Device B updates with latest data
    ↓
Both devices now in sync
```

---

## Finding Your Server IP Address

### Method 1: See it in Server Startup (Easiest)

When you run `node server.js`, the server prints:
```
LAN:       http://192.168.1.100:8899
```

Use this address directly.

### Method 2: Find Your Server's IP Manually

**Linux/Mac:**
```bash
# Option 1: Quick method
ifconfig | grep "inet " | grep -v 127.0.0.1

# Option 2: Show all interfaces
ip addr show

# Option 3: Network scan
hostname -I
```

Look for addresses like:
- `192.168.x.x` (home/small office networks)
- `10.0.x.x` (larger networks)
- `172.16.x.x` (some corporate networks)

**Windows:**
```bash
# Open Command Prompt and run:
ipconfig

# Look for "IPv4 Address" under "Ethernet adapter" or "Wireless LAN adapter"
# Should show something like: 192.168.1.100
```

**Example output:**
```
IPv4 Address. . . . . . . . . . . . : 192.168.1.100
```

### Method 3: Router Admin Panel

1. Open your router's web interface (usually `192.168.1.1` or `192.168.0.1`)
2. Look for "Connected Devices" or "DHCP Clients"
3. Find your server machine name
4. Copy its IP address

---

## Accessing From Different Devices

### Same Network (Recommended)

**Setup:**
```
Router → Server (192.168.1.100)
Router → Device A (192.168.1.101)
Router → Device B (192.168.1.102)
Router → Device C (192.168.1.103)
```

**Access:** `http://192.168.1.100:8899`

✅ Works perfectly
✅ Data syncs in real-time
✅ Lowest latency
✅ No internet needed

### Over VPN (Remote Access)

If you need to access from outside your network:

1. Set up a VPN to your home/office network
2. Connect to VPN from remote device
3. Access same URL: `http://192.168.1.100:8899`

---

## LAN Setup Button (In Dashboard)

### Location
Top right corner of header, next to server status indicator.

### Click It To:
- ✅ See your current server address
- ✅ Manually set a custom server IP (if auto-detection fails)
- ✅ Copy the address to share with other devices
- ✅ Save your preferred server address for future sessions

---

## Multi-Device Synchronization

### Real-Time Sync Example

**Scenario:** You're working on 2 devices simultaneously

**Device A (Laptop):**
1. Open `http://192.168.1.100:8899`
2. Add a priority "Design UI"
3. Data saves to localStorage
4. POSTs to server within 1 second
5. Server updates `mc-data.json`

**Device B (Tablet):**
1. Open same URL `http://192.168.1.100:8899`
2. Already has latest data on load (synced from server)
3. Sees "Design UI" priority that was just added
4. Makes a change: "Mark Design UI as done"
5. Syncs back to server
6. Device A loads latest data next check

**Result:** Both devices always in sync, no conflicts, no data loss

---

## Troubleshooting

### Can't connect from another device

**Problem:** Device B shows "Connection Refused" or "Can't reach server"

**Solutions:**
1. **Verify server is running:**
   ```bash
   # On server machine, should see startup banner
   ps aux | grep "node server.js"
   ```

2. **Check firewall:**
   ```bash
   # Allow port 8899
   sudo ufw allow 8899  # Linux
   sudo firewall-cmd --permanent --add-port=8899/tcp  # CentOS
   ```

3. **Verify devices on same network:**
   ```bash
   # On Device B, ping the server
   ping 192.168.1.100
   # Should show replies, not "Destination unreachable"
   ```

4. **Check correct IP address:**
   - Run `node server.js` again
   - Copy the exact LAN address from startup
   - Paste into browser (without typos)

5. **Try localhost if on same machine:**
   ```
   http://localhost:8899
   ```

### Server shows localhost but not LAN address

**Problem:** Startup shows `LAN: localhost:8899` instead of an IP

**Solution:**
```bash
# Server needs a network interface
# Check your network interfaces:
ifconfig

# If no external IP shown, your machine might not be networked
# Try connecting to WiFi or Ethernet first
```

### Dashboard connects to server but shows "Server: Offline"

**Problem:** Status indicator is red despite server running

**Solutions:**
1. Check network connectivity between devices
2. Server might be temporarily unreachable
3. Try refreshing the page (F5)
4. Restart the server:
   ```bash
   # Press Ctrl+C in terminal
   # Then: node server.js
   ```

### One device doesn't see changes from another

**Problem:** Device A makes changes, Device B doesn't see them

**Solution:**
1. Check both devices are connected to same network (same WiFi/Ethernet)
2. Refresh the page on Device B (F5)
3. Wait 5 minutes (sync interval)
4. Check both devices show "Server: Online" (green indicator)

---

## Security Notes

### Current Setup (LAN Only)

✅ **Safe for home/office networks:**
- All devices on trusted network
- No password protection needed
- No encryption in transit (but on private network)
- Data stays in your building

### If Exposing to Internet (Not Recommended)

⚠️ **Not recommended without additional security:**
- No authentication
- No HTTPS
- No rate limiting
- Anyone with URL can access

**If you must expose to internet:**
1. Add reverse proxy (nginx) with HTTPS
2. Add authentication (API key or password)
3. Run behind Cloudflare or similar
4. Use strong firewall rules

---

## Network Bandwidth Usage

### Typical Data Sync

- **Per user action:** 1-5 KB (small change)
- **Full sync every 5 min:** 50-200 KB (full state)
- **Monthly usage (single user):** ~50 MB (minimal)

### Over LAN
- Local network, doesn't use internet bandwidth
- No caps or overage charges
- Optimal performance

---

## Configuration Options

### Auto-Detection (Default)

Server detects its own network address and displays it.

```javascript
// Server automatically detects and logs:
// LAN:       http://192.168.1.100:8899
```

**Pros:** Zero configuration
**Cons:** Depends on network setup

### Manual Configuration (If Needed)

Click **🌐 LAN Setup** button in dashboard:
1. Enter your custom server IP (e.g., `192.168.1.100`)
2. Click "Save Configuration"
3. Dashboard remembers this address for future sessions

---

## Advanced: Static IP for Server

If your server's IP changes (DHCP), access breaks. To fix:

### Linux (netplan):
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

```bash
sudo netplan apply
```

### Router (Easiest):
1. Log into router admin panel
2. Find "DHCP" or "IP Reservation"
3. Assign fixed IP to your server MAC address
4. Server will always be `192.168.1.100`

---

## Example Network Setup

### Home Network

```
WiFi Router (192.168.1.1)
├── Server Machine (192.168.1.100) — Runs: node server.js
├── Laptop (192.168.1.101) — Browser: http://192.168.1.100:8899
├── Tablet (192.168.1.102) — Browser: http://192.168.1.100:8899
└── Phone (192.168.1.103) — Browser: http://192.168.1.100:8899
```

All devices connected to same WiFi, all can access Mission Control.

### Office Network

```
Office Router (10.0.0.1)
├── Linux Server (10.0.0.50) — Runs: node server.js
├── Desktop A (10.0.0.51) — Browser: http://10.0.0.50:8899
├── Desktop B (10.0.0.52) — Browser: http://10.0.0.50:8899
└── Laptop (10.0.0.53) — Browser: http://10.0.0.50:8899
```

---

## Monitoring LAN Access

### View Server Logs

```bash
# Check server startup messages
# (Shown when running node server.js)

# Both addresses printed:
# Local:     http://localhost:8899
# LAN:       http://192.168.1.100:8899
```

### Check Activity From Multiple Devices

```bash
# See activity from all connected devices
curl http://192.168.1.100:8899/mc/activity | jq '.'
```

Activity log shows:
- Which device made changes
- When changes were made
- What changed
- Cross-device sync events

---

## That's It!

You now have Mission Control accessible from **any device on your LAN**.

```
Your Server → All Your Devices
```

**Start the server:**
```bash
node server.js
```

**Open on any device:**
```
http://192.168.1.100:8899
```

**Data syncs in real-time** across all connected devices.

Welcome to a truly distributed, network-enabled command center! 🚀
