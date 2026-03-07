# Gmail Setup for Windows

## Quick Start

1. **Download the script:**
   - Copy `gmail_reauth.bat` to your Windows machine
   - (You can get it from your OpenClaw workspace)

2. **Run it:**
   ```
   Double-click: gmail_reauth.bat
   ```

3. **Follow the prompts:**
   - A browser window opens → Google login
   - Sign in: `chris.cole.work1985@gmail.com`
   - Click **"Allow"** to grant permissions
   - Done!

---

## Requirements

### Python (Required)
- **Version:** 3.8 or newer
- **Download:** https://www.python.org/downloads/
- **Install:** During setup, CHECK the box: ✅ "Add Python to PATH"

### Google Libraries (Required)
Run this ONCE after Python is installed:

```cmd
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

---

## Step-by-Step Instructions

### Step 1: Install Python

1. Go to https://www.python.org/downloads/
2. Download the latest Python (3.10+ recommended)
3. Run the installer
4. **IMPORTANT:** Check ✅ "Add Python to PATH"
5. Click "Install Now"
6. Wait for completion, then close

### Step 2: Install Required Libraries

Open Command Prompt (Windows key + R, type `cmd`):

```cmd
pip install --upgrade google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

Wait for it to finish (should say "Successfully installed").

### Step 3: Run the Gmail Setup Script

1. Copy `gmail_reauth.bat` to your `C:\Users\YourName\.openclaw\workspace\` folder
2. Double-click it
3. A Command Prompt window opens
4. A browser window opens → Google login screen
5. Sign in with: `chris.cole.work1985@gmail.com`
6. Click **"Allow"**
7. Close the browser window
8. Command Prompt shows "SUCCESS!"
9. Press any key to close

---

## Troubleshooting

### "Python not found"
- **Fix:** Re-install Python and make sure to CHECK "Add Python to PATH"
- Restart your computer after installing

### "Module not found" error
- **Fix:** Install the libraries again:
  ```cmd
  pip install --upgrade google-auth-oauthlib google-auth-httplib2 google-api-python-client
  ```

### "Port 8080 in use"
- **Fix:** Wait 30 seconds and try again
- Or close other applications using that port

### Browser doesn't open
- **Manual:** Copy the URL from the Command Prompt window and paste it into your browser

---

## What Gets Saved

After successful re-auth, this file is updated:
- `%USERPROFILE%\.openclaw\credentials\google-token.json`

This file grants OpenClaw permission to:
- ✅ Send emails
- ✅ Read emails
- ✅ Mark emails as read

---

## Testing It Works

After re-auth, test with this command:

```cmd
python -c "from gmail_helper import GmailHelper; g = GmailHelper(); print(f'Unread emails: {g.get_email_count()}')"
```

Should show: `Unread emails: X` (where X is a number)

---

## Support

If it doesn't work:
1. Make sure Python is installed: `python --version`
2. Make sure libraries are installed: `pip list | find "google"`
3. Check your internet connection
4. Try again with a different browser
