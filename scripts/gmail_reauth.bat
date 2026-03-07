@echo off
REM Gmail Re-authorization Script for Windows
REM This script grants broader scopes (read + send) to Gmail token

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo Gmail Re-Authorization Helper for Windows
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo.
    echo Make sure Python is installed and added to PATH
    echo Download from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo Checking credentials...
if not exist "%USERPROFILE%\.openclaw\credentials\google-credentials.json" (
    echo ERROR: google-credentials.json not found
    echo Expected location: %USERPROFILE%\.openclaw\credentials\
    echo.
    pause
    exit /b 1
)

echo.
echo Scopes to be requested:
echo   - gmail.send
echo   - gmail.readonly
echo   - gmail.modify
echo.
echo A browser window will open. Sign in with:
echo   chris.cole.work1985@gmail.com
echo.
echo Then click "Allow" to grant permissions.
echo.
pause

REM Run the Python reauth script
python -c "
import json
import os
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
    with open(CREDS_FILE, 'r') as f:
        creds_config = json.load(f)
    
    flow = InstalledAppFlow.from_client_config(creds_config, SCOPES)
    creds = flow.run_local_server(port=8080)
    
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
    print('============================================================')
    print('SUCCESS!')
    print('============================================================')
    print('Token saved to: ' + str(TOKEN_FILE))
    print('Gmail reading is now enabled!')
    print()
    
except Exception as e:
    print()
    print('ERROR: ' + str(e))
    print()
    raise
" 

if errorlevel 1 (
    echo.
    echo ERROR: Re-authorization failed
    echo.
    echo Troubleshooting:
    echo - Make sure port 8080 is not in use
    echo - Check your internet connection
    echo - Try running again in a few seconds
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Re-authorization Complete!
echo ============================================================
echo.
echo Gmail reading is now enabled.
echo Your OpenClaw setup can now:
echo   - Read unread emails
echo   - Check senders and subjects
echo   - Summarize important messages
echo.
pause
