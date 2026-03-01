# GOG Setup for Headless Debian (Based on YouTube Tutorial)

## Where You Are Now
✅ Credentials.json fixed  
❌ Auth command waiting for browser  

## The Problem
`gog auth add` tries to open a browser, which doesn't exist on headless Debian.

## Solution: Use gog with Manual OAuth

### Step 1: Get the Authorization URL

Run this on Debian to see the auth URL:

```bash
cd ~/.config/gogcli
timeout 10 gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive 2>&1 || true
```

It will show something like:
```
Please visit this URL to authorize:
https://accounts.google.com/o/oauth2/auth?...
```

### Step 2: Copy & Open on Windows

1. **Copy the full URL** from the terminal
2. **Paste into your Windows browser**
3. **Sign in** with chris.cole.work1985@gmail.com
4. **Click "Allow"**
5. You'll get a redirect with an authorization code

### Step 3: Check ~/.config/gogcli/

After you authorize, gog should automatically save tokens to:
```
~/.config/gogcli/credentials/
```

Check if files appeared:
```bash
ls -la ~/.config/gogcli/credentials/
```

If nothing appeared, the auth failed. You may need to:
1. Delete everything in `~/.config/gogcli/`
2. Start fresh with `gog auth add` command

---

## Alternative: Use Environment Variable (Easier)

Set up gog to use a specific token URL:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/root/.openclaw/credentials/google-token.json
gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive
```

---

## After Setup: Test gog

Once authorized, test with:

```bash
# List Gmail labels
gog gmail labels list

# List Calendar events
gog calendar events list

# List Drive files
gog drive files list
```

---

## If It Still Doesn't Work

The issue might be that gog expects interactive terminal input. On headless servers, you might need:

```bash
script -q -c "gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive" /dev/null
```

Or use `unbuffer` if available:

```bash
unbuffer gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive
```

---

## Reference: Video

Based on: https://www.youtube.com/watch?v=h_N2Y2XyR3M

The video assumes you have a browser. For headless, just copy the auth URL and complete it on Windows.

---

## Quick Summary

**On Debian:**
```bash
cd ~/.config/gogcli
timeout 10 gog auth add chris.cole.work1985@gmail.com --services gmail,calendar,drive 2>&1 || true
```

**Get the URL, open on Windows, authorize, let gog save the token.**

**Test:**
```bash
gog gmail labels list
```

If this works, you're done! 🎉
