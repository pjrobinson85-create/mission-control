# Gmail Re-authorization Script for PowerShell (Windows)
# Run with: powershell -ExecutionPolicy Bypass -File gmail_reauth.ps1

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Gmail Re-Authorization Helper for Windows (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Python found: $pythonCheck" -ForegroundColor Green
Write-Host ""

# Check credentials file
$credsDir = "$env:USERPROFILE\.openclaw\credentials"
$credsFile = "$credsDir\google-credentials.json"
$tokenFile = "$credsDir\google-token.json"

Write-Host "Checking credentials..." -ForegroundColor Yellow
if (!(Test-Path $credsFile)) {
    Write-Host "ERROR: $credsFile not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure OpenClaw credentials are set up." -ForegroundColor Yellow
    Write-Host "Expected location: $credsDir\" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Credentials found" -ForegroundColor Green
Write-Host ""

# Show what we're doing
Write-Host "Scopes to be requested:" -ForegroundColor Yellow
Write-Host "  - gmail.send" -ForegroundColor Gray
Write-Host "  - gmail.readonly" -ForegroundColor Gray
Write-Host "  - gmail.modify" -ForegroundColor Gray
Write-Host ""

Write-Host "IMPORTANT: A browser window will open." -ForegroundColor Yellow
Write-Host "  1. Sign in with: chris.cole.work1985@gmail.com" -ForegroundColor Gray
Write-Host "  2. Click 'Allow' to grant permissions" -ForegroundColor Gray
Write-Host "  3. The script will complete automatically" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to proceed?" -ForegroundColor Cyan
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "Starting OAuth flow..." -ForegroundColor Yellow
Write-Host ""

# Run Python script inline
$pythonScript = @"
import json
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
]

CREDS_DIR = Path.home() / '.openclaw' / 'credentials'
CREDS_FILE = CREDS_DIR / 'google-credentials.json'
TOKEN_FILE = CREDS_DIR / 'google-token.json'

try:
    print('[*] Loading credentials...')
    with open(CREDS_FILE, 'r') as f:
        creds_config = json.load(f)
    
    print('[*] Creating OAuth flow...')
    flow = InstalledAppFlow.from_client_config(creds_config, SCOPES)
    
    print('[*] Starting local server on port 8080...')
    print('[*] Opening browser...')
    creds = flow.run_local_server(port=8080, open_browser=True)
    
    print('[*] Saving token...')
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
    print('=' * 60)
    print('SUCCESS!')
    print('=' * 60)
    print(f'Token saved to: {TOKEN_FILE}')
    print('Gmail reading is now enabled!')
    print()
    
except Exception as e:
    print()
    print('ERROR: ' + str(e))
    print()
    raise
"@

python -Command $pythonScript

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Re-authorization failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure port 8080 is not in use" -ForegroundColor Gray
    Write-Host "  - Check your internet connection" -ForegroundColor Gray
    Write-Host "  - Try running again in a few seconds" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Re-authorization Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Gmail reading is now enabled." -ForegroundColor Green
Write-Host "Your OpenClaw setup can now:" -ForegroundColor Cyan
Write-Host "  - Read unread emails" -ForegroundColor Gray
Write-Host "  - Check senders and subjects" -ForegroundColor Gray
Write-Host "  - Summarize important messages" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
