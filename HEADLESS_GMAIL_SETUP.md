# Gmail Setup for Headless Server (No Browser)

Use this if OpenClaw is on a Debian LXC/VM with no browser.

## Quick Steps

### On Your Debian LXC (SSH):

```bash
cd /root/.openclaw/workspace
python3 gmail_remote_auth.py
```

The script will:
1. Display a long URL
2. Tell you to copy it

### On Your Windows Machine:

1. **Copy the URL** from the terminal
2. **Open it in your browser** (any browser)
3. **Sign in:** chris.cole.work1985@gmail.com
4. **Click "Allow"**
5. You'll see a page with a code like:
   ```
   4/0AY0e-g1234567890abcdefghijklmnop...
   ```

### Back on Your Debian LXC:

1. **Copy the entire authorization code** (including the long part after `4/0A...`)
2. **Paste it** into the terminal where you're running the script
3. Press Enter

That's it! ✅

---

## Detailed Walkthrough

### Step 1: Start the Authorization on Debian

SSH into your Debian LXC:
```bash
ssh root@<lxc-ip>
cd /root/.openclaw/workspace
python3 gmail_remote_auth.py
```

Output will look like:
```
======================================================================
Gmail Remote Authorization (Headless Server)
======================================================================

📁 Using credentials: /root/.openclaw/credentials/google-credentials.json
📁 Token will be saved to: /root/.openclaw/credentials/google-token.json

📋 Loading credentials...
🔐 Creating authorization flow...

======================================================================
COPY THIS URL AND OPEN IT ON YOUR WINDOWS MACHINE
======================================================================

https://accounts.google.com/o/oauth2/auth?client_id=123456789...

======================================================================
```

### Step 2: Open URL on Windows

1. **Copy the entire URL** (right-click → Copy, or Ctrl+A then Ctrl+C)
2. **Open your Windows browser**
3. **Paste the URL** in the address bar (Ctrl+V)
4. Press Enter

### Step 3: Authorize Google

1. Sign in with: **chris.cole.work1985@gmail.com**
2. Click **"Allow"** (blue button)
3. You'll see a redirect page with a code

### Step 4: Copy the Code

The redirect page shows something like:
```
Authorization successful. You can now close this window.

Your authorization code is:
4/0AY0e-g1234567890abcdefghijklmnopabcdefghijklmnopabcdefghijklmnop
```

**Important:** Copy the ENTIRE code (it's long!)

### Step 5: Paste Code Back to Debian

Go back to your terminal on Debian. You'll see:
```
Enter the authorization code (from the redirect page): █
```

1. **Paste the code** (right-click → Paste, or Ctrl+Shift+V)
2. Press Enter
3. Wait for "SUCCESS!"

---

## Troubleshooting

### "Code is invalid or expired"
- Make sure you copied the **entire** code
- Don't include any extra spaces or line breaks
- Try again (you get 10 minutes per attempt)

### "Connection refused" or network errors
- Check your internet connection on Windows
- Make sure the Debian LXC has internet (test with `ping google.com`)

### "Invalid credentials"
- Make sure `google-credentials.json` exists on the Debian machine
- Check it's in: `/root/.openclaw/credentials/`

### Script says "credentials.json not found"
- Copy the credentials file from your Windows machine to:
  `/root/.openclaw/credentials/google-credentials.json` on the Debian LXC

---

## After Setup

Test it with:
```bash
python3 -c "from gmail_helper import GmailHelper; g = GmailHelper(); print(f'Unread: {g.get_email_count()}')"
```

Should show: `Unread: 5` (or whatever number)

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│     Your Windows Machine            │
│  ┌──────────────────────────────┐   │
│  │  Browser (Firefox/Chrome)    │   │
│  │  - Opens authorization URL   │   │
│  │  - Signs in to Google        │   │
│  │  - Gets authorization code   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              │ (network)
              ▼
┌─────────────────────────────────────┐
│   Debian LXC (Proxmox)              │
│  ┌──────────────────────────────┐   │
│  │  gmail_remote_auth.py        │   │
│  │  - Generates auth URL        │   │
│  │  - Waits for code            │   │
│  │  - Saves token to file       │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  google-token.json           │   │
│  │  (credentials saved here)    │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Need Help?

If something doesn't work:
1. Take a screenshot of the error
2. Note which step failed
3. Try again from the beginning

The code expires after 10 minutes, so you need to complete the flow quickly.
