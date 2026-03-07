# Tailscale Setup Guide for iOS

This guide walks you through accessing the Report Writer app from your iPhone or iPad.

## What You'll Need

- iPhone or iPad (iOS 14.4 or later)
- WiFi or cellular connection
- An invitation link from Paul

---

## Step 1: Install Tailscale App

1. Open the **App Store** on your iPhone/iPad
2. Search for **"Tailscale"** (made by Tailscale Inc.)
3. Tap **Get** → **Install**
4. Wait for installation to complete

---

## Step 2: Create a Tailscale Account (First Time Only)

1. Open the Tailscale app
2. Tap **Sign up** or **Create account**
3. Choose your sign-in method:
   - **Google** (easiest)
   - **GitHub**
   - **Microsoft**
   - **Apple**
   - Email address
4. Follow the prompts to create your account
5. You'll see a message: *"No devices yet"* — that's normal

---

## Step 3: Accept Paul's Invitation

1. **Check your email** for an invite from Tailscale (from Paul's account)
   - Subject line: *"You're invited to join a Tailnet"* or similar
   - If you don't see it, **check Spam/Junk folder**

2. **Tap the link** in the email
   - It will open Tailscale app automatically
   - Or manually open the app and paste the link

3. **Tap "Accept invitation"** or **"Join"**
   - You should now be connected to Paul's network

---

## Step 4: Access the Report Writer App

### Once you've joined Paul's tailnet:

1. **Open Tailscale app**
   - You should see a list of connected devices
   - Look for **"debian-openclaw"** or similar (Paul's server)
   - It should show **"Connected"** with a green dot

2. **Open Safari** (or any browser)

3. **In the address bar, type:**
   ```
   http://100.64.0.1:5000
   ```
   *(Paul will give you the exact IP address — it starts with 100.64)*

4. **Press Go** → You should see the Report Writer app

---

## Troubleshooting

### "I don't see the app"
- **Check Tailscale is running:** Open Tailscale app, see if it says "Connected"
- **Try a different browser:** Use Chrome or Firefox instead of Safari
- **Ask Paul for the correct IP address** — it's unique to his setup

### "Permission Denied" or "Can't Connect"
- **Close and reopen Safari** — sometimes helps
- **Turn Tailscale off and on:** Swipe up in Tailscale, wait 5 seconds, tap to reconnect
- **Restart your phone:** Power off, then power back on

### "Tailscale won't start"
- **Check WiFi:** Make sure you're connected to internet
- **Reinstall the app:** Delete Tailscale, reinstall from App Store
- **Contact Paul:** There may be an issue on the server side

### "I'm invited but it won't let me join"
- **Make sure you're signed in** to Tailscale with your own account first
- **Try the link again** — copy/paste from email directly
- **Ask Paul to resend the invite**

---

## Tips

✅ **Keep Tailscale running** while you're testing  
✅ **You only need internet** — no special WiFi setup  
✅ **Works on 4G/5G too** — not just WiFi  
✅ **It's secure** — all traffic is encrypted  
✅ **No VPN needed** — Tailscale handles everything  

---

## Questions?

Ask Paul directly. He can:
- Resend the invite link
- Check if you're connected
- Give you the correct IP address
- Restart the app if something's wrong

---

**Last updated: March 2, 2026**
