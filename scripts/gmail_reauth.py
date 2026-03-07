#!/usr/bin/env python3
"""
Gmail Re-authorization Script
Grants broader scopes (read + send) to the Gmail token
"""

import json
import os
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials as UserCredentials

# Scopes needed
SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
]

CREDS_DIR = Path.home() / '.openclaw' / 'credentials'
CREDS_FILE = CREDS_DIR / 'google-credentials.json'
TOKEN_FILE = CREDS_DIR / 'google-token.json'

def main():
    print("=" * 60)
    print("Gmail Re-Authorization Helper")
    print("=" * 60)
    print()
    
    # Check credentials file exists
    if not CREDS_FILE.exists():
        print(f"❌ Error: {CREDS_FILE} not found")
        print("   Cannot proceed without OAuth credentials")
        return False
    
    print(f"📁 Using credentials: {CREDS_FILE}")
    print(f"📁 Token will be saved to: {TOKEN_FILE}")
    print()
    print("Requesting scopes:")
    for scope in SCOPES:
        print(f"  ✓ {scope.split('/')[-1]}")
    print()
    
    try:
        # Load credentials
        with open(CREDS_FILE, 'r') as f:
            creds_config = json.load(f)
        
        # Create OAuth flow
        flow = InstalledAppFlow.from_client_config(creds_config, SCOPES)
        
        print("🔐 Starting OAuth flow...")
        print("   A browser window should open. If not, visit the URL shown.")
        print()
        
        # Run local server for auth
        creds = flow.run_local_server(port=8080)
        
        # Save token
        token_data = {
            'token': creds.token,
            'refresh_token': creds.refresh_token,
            'token_uri': creds.token_uri,
            'client_id': creds.client_id,
            'client_secret': creds.client_secret,
            'scopes': creds.scopes
        }
        
        with open(TOKEN_FILE, 'w') as f:
            json.dump(token_data, f, indent=2)
        
        print()
        print("=" * 60)
        print("✅ SUCCESS!")
        print("=" * 60)
        print(f"✓ Token saved to: {TOKEN_FILE}")
        print(f"✓ Scopes granted: {len(SCOPES)}")
        print()
        print("You can now read and send emails!")
        print()
        print("Test it with:")
        print("  python3 -c \"from gmail_helper import GmailHelper; g = GmailHelper(); print(f'Unread: {g.get_email_count()}')\"")
        print()
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print(f"❌ ERROR: {type(e).__name__}")
        print("=" * 60)
        print(f"Details: {str(e)}")
        print()
        print("Troubleshooting:")
        print("1. Make sure you're running this on the same machine with a browser")
        print("2. Check that port 8080 is available (lsof -i :8080)")
        print("3. Try again in a few seconds")
        print()
        return False

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
