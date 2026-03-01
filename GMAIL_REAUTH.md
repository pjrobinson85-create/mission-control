# Gmail Re-Authorization with Read Access

Current status: Gmail token only has `gmail.send` scope. Need to add `gmail.readonly` to read emails.

## Quick Fix (5 minutes)

Run this Python script to re-authorize with broader scopes:

```bash
cd /root/.openclaw/workspace
python3 gmail_reauth.py
```

This will:
1. Open a browser to Google OAuth consent screen
2. Ask you to authorize "chris.cole.work1985@gmail.com"
3. Grant these scopes:
   - `gmail.send` (send emails)
   - `gmail.readonly` (read emails)
   - `gmail.modify` (mark as read, etc.)
4. Save new token to `/root/.openclaw/credentials/google-token.json`

## Manual Method (if script fails)

1. Go to: https://myaccount.google.com/permissions
2. Find "OpenClaw" app
3. Click it → "Remove access"
4. Run the script again (will ask for fresh authorization)

## Scopes Being Requested

```
https://www.googleapis.com/auth/gmail.send     ← Can send emails
https://www.googleapis.com/auth/gmail.readonly ← Can read emails
https://www.googleapis.com/auth/gmail.modify   ← Can modify labels, mark read
```

## After Re-auth

Once done, test with:
```bash
python3 << 'EOF'
from gmail_helper import GmailHelper
gmail = GmailHelper()
print(f"Unread emails: {gmail.get_email_count()}")
EOF
```

---

**Note:** You'll need to be at your computer to click "Allow" on the Google consent screen.
