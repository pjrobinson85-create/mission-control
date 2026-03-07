# Tailscale Setup Guide for Mac

This guide walks you through accessing the Report Writer app from your Mac laptop.

## What You'll Need

- Mac (macOS 11 Big Sur or later)
- WiFi or internet connection
- An invitation link from Paul

---

## Step 1: Install Tailscale App

### Option A: App Store (Easiest)

1. Open **App Store** on your Mac
2. Search for **"Tailscale"** (made by Tailscale Inc.)
3. Click **Get** → **Install**
4. Wait for installation to complete
5. It will appear in your Applications folder

### Option B: Direct Download

1. Go to [tailscale.com/download/mac](https://tailscale.com/download/mac)
2. Click **Download** for your Mac type (Intel or Apple Silicon)
3. Open the `.dmg` file
4. Drag **Tailscale** to the **Applications** folder

---

## Step 2: Create a Tailscale Account (First Time Only)

1. Open **Applications** folder → Find **Tailscale**
2. Double-click to launch (or search for it in Spotlight: Cmd+Space, type "Tailscale")
3. You'll see a window asking to sign in
4. Click **Sign up** or **Create account**
5. Choose your sign-in method:
   - **Google** (easiest)
   - **GitHub**
   - **Microsoft**
   - **Apple**
   - Email address
6. Follow the prompts
7. You may need to approve Tailscale in System Settings (it will ask automatically)

---

## Step 3: Accept Paul's Invitation

1. **Check your email** for an invite from Tailscale
   - Subject line: *"You're invited to join a Tailnet"* or similar
   - Check Spam/Junk if you don't see it

2. **Click the link** in the email
   - It will open in your browser
   - May automatically open Tailscale app

3. **In the Tailscale window, click "Accept invitation"**
   - You should now see **"Connected"** with a green status dot

4. **Approve in System Settings** if prompted:
   - System Settings → VPN & Network → Tailscale
   - Click "Allow"

---

## Step 4: Access the Report Writer App

### Once connected:

1. **Open Tailscale** (click the Tailscale icon in your menu bar at the top right)
   - You should see **"Connected"** 
   - You'll see Paul's server listed (e.g., "debian-openclaw")

2. **Open a web browser** (Safari, Chrome, Firefox — any will work)

3. **In the address bar, type:**
   ```
   http://100.64.0.1:5000
   ```
   *(Paul will give you the exact IP address — it starts with 100.64)*

4. **Press Enter** → You should see the Report Writer app

---

## Troubleshooting

### "Connection Refused" or "Can't Reach Server"
- **Check Tailscale is connected:** Click Tailscale icon in menu bar → should say "Connected"
- **Verify the IP address:** Ask Paul for the exact address (e.g., 100.64.0.1)
- **Try a fresh browser tab:** Close Safari/Chrome completely, reopen, try again
- **Restart Tailscale:** Click menu bar icon → quit, then reopen

### "Tailscale won't start"
- **Check internet connection:** Make sure WiFi is working
- **Restart your Mac:** Power off completely, then turn back on
- **Reinstall:** Delete Tailscale from Applications, reinstall from App Store

### "I'm invited but Tailscale won't accept it"
- **Sign out and back in:** Tailscale menu → Sign out, then sign back in with your account
- **Try the link again:** Copy/paste directly from email
- **Ask Paul to resend the invite**

### "System Settings keeps asking for approval"
- **Go to System Settings** → VPN & Network → Tailscale
- **Toggle Tailscale on** if it's off
- **Click "Allow"** when prompted

### "I see 'No Devices' in Tailscale"
- **Wait a moment:** Sometimes takes 10–15 seconds to sync
- **Check you accepted the invite:** Look for a confirmation email
- **Restart Tailscale:** Menu bar → quit and reopen

---

## Tips

✅ **Tailscale runs in the background** — just keep it on  
✅ **Works on any WiFi** — no special setup needed  
✅ **Super secure** — all traffic is encrypted  
✅ **Fast** — uses direct connections when possible  
✅ **No VPN mess** — Tailscale manages everything  

---

## Performance Notes

- First connection may take 5–10 seconds
- Subsequent loads should be instant
- If the app feels slow, refresh the page (Cmd+R)
- Ask Paul if the server is running

---

## Questions?

Ask Paul directly. He can:
- Resend the invite link
- Check if your Mac is connected
- Give you the correct IP address
- Verify the server is running

---

**Last updated: March 2, 2026**
