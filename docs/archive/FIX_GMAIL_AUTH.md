# Fix: Gmail Authorization Error

**Problem:** "Access blocked: Authorization Error chris.cole.work1985@gmail.com"

**Cause:** The OAuth credentials don't authorize that email account.

---

## Solution: Create New OAuth Credentials

You need to set up a NEW OAuth app in Google Cloud Console.

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Sign in with your Google account (or create one)
3. Create a new project (or select existing)

### Step 2: Enable Gmail API

1. Search for "Gmail API" in the search bar
2. Click "Gmail API"
3. Click **"Enable"** (blue button)

### Step 3: Create OAuth Consent Screen

1. On the left menu: Click **"OAuth consent screen"**
2. Choose: **External** (recommended)
3. Click **"Create"**

Fill in the form:
- **App name:** OpenClaw
- **User support email:** Your email
- **Developer contact:** Your email
- Click **"Save and Continue"**

### Step 4: Add Gmail Scopes

1. Click **"Add or Remove Scopes"**
2. Search for: `gmail`
3. Select these 3 scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify`
4. Click **"Update"**
5. Click **"Save and Continue"**

### Step 5: Add Test Users

1. Click **"Add Users"**
2. Add: **chris.cole.work1985@gmail.com**
3. Click **"Save and Continue"**
4. Review and click **"Back to Dashboard"**

### Step 6: Create OAuth Credentials

1. On the left menu: Click **"Credentials"**
2. Click **"+ Create Credentials"** (blue button)
3. Choose: **OAuth 2.0 Client ID**
4. Application type: **Desktop Application**
5. Name it: `OpenClaw Gmail`
6. Click **"Create"**
7. Click **"Download JSON"** (saves to your Downloads)

### Step 7: Update Debian Machine

**On Windows:**
- Find the downloaded JSON file (in Downloads)
- Rename it to: `google-credentials.json`

**Copy to Debian:**
```bash
scp google-credentials.json root@<debian-lxc-ip>:/root/.openclaw/credentials/
```

Or if using SSH:
```bash
ssh root@<debian-lxc-ip>
# Then upload the file somehow (SFTP, paste contents, etc.)
```

### Step 8: Try Again on Debian

```bash
cd /root/.openclaw/workspace
python3 gmail_remote_auth.py
```

This time it should work!

---

## Checklist

- [ ] Gmail API enabled
- [ ] OAuth Consent Screen created
- [ ] Gmail scopes added (3 scopes)
- [ ] chris.cole.work1985@gmail.com added as test user
- [ ] OAuth Client ID created (Desktop App)
- [ ] JSON downloaded
- [ ] JSON copied to Debian: `/root/.openclaw/credentials/google-credentials.json`
- [ ] Ran `python3 gmail_remote_auth.py`

---

## Alternative: Use a Different Email

If you can't get chris.cole.work1985@gmail.com to work:

1. Use your personal email instead (e.g., paulrobinson85@outlook.com)
2. Add that email as a test user in the OAuth Consent Screen
3. Authorize with that email
4. Update the `gmail_helper.py` to use that email

---

## Still Stuck?

Common issues:

1. **"Credentials not valid"** → Download JSON again, it might be cached
2. **"gmail.send scope not found"** → Make sure you selected the right scopes
3. **"Email not in test users"** → Add it to the OAuth Consent Screen > Test Users
4. **"Not allowed to access"** → Might need to wait 5-10 minutes after setup

Wait a few minutes and try again!
