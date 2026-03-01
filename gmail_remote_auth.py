#!/usr/bin/env python3
"""
Gmail Remote Authorization (for headless servers)
Generates an authorization URL you open on your Windows machine,
then you provide the authorization code back to this script.
"""

import json
import sys
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
]

# If you get "Authorization Error", use SCOPES_MINIMAL instead:
SCOPES_MINIMAL = [
    'https://www.googleapis.com/auth/gmail.send'
]

CREDS_DIR = Path.home() / '.openclaw' / 'credentials'
CREDS_FILE = CREDS_DIR / 'google-credentials.json'
TOKEN_FILE = CREDS_DIR / 'google-token.json'

def main():
    print("=" * 70)
    print("Gmail Remote Authorization (Headless Server)")
    print("=" * 70)
    print()
    
    # Check credentials file
    if not CREDS_FILE.exists():
        print(f"❌ Error: {CREDS_FILE} not found")
        print("   Cannot proceed without OAuth credentials")
        return False
    
    print(f"📁 Using credentials: {CREDS_FILE}")
    print(f"📁 Token will be saved to: {TOKEN_FILE}")
    print()
    
    try:
        print("📋 Loading credentials...")
        with open(CREDS_FILE, 'r') as f:
            creds_config = json.load(f)
        
        print("🔐 Creating authorization flow...")
        # Create flow WITHOUT local server (headless mode)
        flow = InstalledAppFlow.from_client_config(creds_config, SCOPES)
        
        # Generate authorization URL
        auth_url, state = flow.authorization_url(prompt='consent')
        
        print()
        print("=" * 70)
        print("COPY THIS URL AND OPEN IT ON YOUR WINDOWS MACHINE")
        print("=" * 70)
        print()
        print(auth_url)
        print()
        print("=" * 70)
        print()
        
        print("📝 Instructions:")
        print("  1. Copy the URL above")
        print("  2. Paste it into your Windows browser")
        print("  3. Sign in with: chris.cole.work1985@gmail.com")
        print("  4. Click 'Allow'")
        print("  5. You'll see a page with an authorization code")
        print("  6. Copy the ENTIRE authorization code")
        print("  7. Paste it in the prompt below")
        print()
        print("-" * 70)
        print()
        
        # Get authorization code from user
        auth_code = input("Enter the authorization code (from the redirect page): ").strip()
        
        if not auth_code:
            print()
            print("❌ No authorization code provided")
            return False
        
        print()
        print("🔄 Exchanging authorization code for token...")
        
        # Exchange code for token
        try:
            credentials = flow.fetch_token(code=auth_code)
        except Exception as e:
            print(f"❌ Error exchanging code: {str(e)}")
            print()
            print("Possible causes:")
            print("  - Code is invalid or expired")
            print("  - Code was already used")
            print("  - Copied the code incorrectly")
            print()
            print("Try again and make sure to copy the ENTIRE code.")
            return False
        
        # Save token
        token_data = {
            'token': credentials['access_token'],
            'refresh_token': credentials.get('refresh_token'),
            'token_uri': credentials.get('token_uri'),
            'client_id': creds_config['installed']['client_id'],
            'client_secret': creds_config['installed']['client_secret'],
            'scopes': SCOPES
        }
        
        with open(TOKEN_FILE, 'w') as f:
            json.dump(token_data, f, indent=2)
        
        print()
        print("=" * 70)
        print("✅ SUCCESS!")
        print("=" * 70)
        print(f"✓ Token saved to: {TOKEN_FILE}")
        print(f"✓ Gmail reading/sending is now enabled")
        print()
        
        # Test it
        print("🧪 Testing Gmail access...")
        try:
            from gmail_helper import GmailHelper
            gmail = GmailHelper()
            unread = gmail.get_email_count()
            if isinstance(unread, str):
                print(f"   (Email reading will work once fully synced)")
            else:
                print(f"   ✓ Unread emails: {unread}")
        except Exception as e:
            print(f"   Note: {str(e)}")
        
        print()
        print("✅ All set! Your OpenClaw can now read and send emails.")
        print()
        return True
        
    except Exception as e:
        print()
        print("=" * 70)
        print(f"❌ ERROR: {type(e).__name__}")
        print("=" * 70)
        print(f"Details: {str(e)}")
        print()
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
