# GOG OAuth via SSH Port Forwarding

The OAuth callback needs localhost:40271. Since you're SSH'd into Debian, you need to forward that port from Windows.

## Steps

### Step 1: On Windows (Git Bash or PowerShell)

Replace `192.168.1.100` with your Debian LXC IP:

```bash
ssh -L 40271:localhost:40271 root@192.168.1.100
```

This forwards your Windows localhost:40271 to Debian localhost:40271.

**Keep this terminal open** (don't close it).

### Step 2: On Debian (in a NEW terminal)

In a separate SSH session to Debian:

```bash
cd ~/.config/gogcli
gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive
```

This time it will show the auth URL again.

### Step 3: On Windows (in your browser)

1. Open the URL from the gog command
2. Sign in with chris.cole.work1985@gmail.com
3. Click "Allow"
4. The browser will redirect to localhost:40271
5. **Because of your SSH port forward, it routes back to Debian**
6. Gog receives the callback and saves the token automatically

### Step 4: Back on Debian

The gog command will complete and show:
```
✓ Credentials saved
```

### Step 5: Test

```bash
gog gmail labels list
gog calendar events list
gog drive files list
```

---

## Quick Reference

**Windows Terminal 1 (port forward):**
```bash
ssh -L 40271:localhost:40271 root@<debian-ip>
# Keep this open
```

**Windows Terminal 2 (or after Step 1):**
```bash
ssh root@<debian-ip>
cd ~/.config/gogcli
gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive
```

**When prompted with auth URL:**
1. Copy the URL
2. Paste in your Windows browser
3. Complete authorization
4. Gog auto-saves token

---

## Troubleshooting

**"Connection refused"**
- Make sure the port forward is still running (Terminal 1)
- Check your Debian IP is correct

**"Localhost refused"**
- The gog server isn't listening on port 40271 yet
- Wait a few seconds after running the gog command

**"Callback never received"**
- Make sure you clicked "Allow" on Google consent screen
- Check the browser actually tried to visit localhost:40271

---

## Architecture

```
┌─────────────────────────────────────┐
│     Windows Machine                 │
│  ┌──────────────────────────────┐   │
│  │  Browser                     │   │
│  │  Opens auth URL              │   │
│  │  Clicks "Allow"              │   │
│  │  Redirects to localhost:40271│   │
│  └──────────────────────────────┘   │
│            │                         │
│  ┌─────────▼──────────────────────┐ │
│  │  SSH Port Forward              │ │
│  │  L: 40271 → R: 40271           │ │
│  └─────────▲──────────────────────┘ │
└───────────┼────────────────────────┘
            │ (SSH tunnel)
            │
┌───────────▼────────────────────────┐
│     Debian LXC                      │
│  ┌──────────────────────────────┐   │
│  │  gog auth                    │   │
│  │  Listening on :40271         │   │
│  │  Receives callback           │   │
│  │  Saves credentials           │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Your Debian IP?

If you don't know your Debian LXC IP:

```bash
ip addr show | grep "inet "
```

Look for something like `192.168.1.X` or `10.0.0.X`
