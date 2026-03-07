# TOOLS.md - Paul's Setup

## Email & Calendar Access (Setup Complete - March 1, 2026)
- **Chris's Email:** chris.cole.work1985@gmail.com
- **Paul's Email Addresses:**
  - probinson85@live.com.au (Microsoft account)
  - paulrobinson85@outlook.com.au (secondary)
- **Calendar Access:**
  - chris.cole.work1985@gmail.com (primary, read/write)
  - pjrobinson85@gmail.com (secondary, read-only)
- **Email Guardrails:**
  - Whitelist only: probinson85@live.com.au, paulrobinson85@outlook.com.au
  - Rate limits: 5/hour, 20/day
  - All sends logged to `/root/.openclaw/logs/email-audit.log`
  - Requires approval for new recipients
  - Monthly audit summary sent to Paul

## Medication & Health
- **Morning meds:** 9:00 AM (trial time)
- **Evening meds:** 6:30 PM
- **Bowel routine:** Monday & Thursday mornings (Peristeen)
- **Senakot reminder:** Sun & Wed at 6:30 PM (with evening meds) — night before routine
- **Recent:** Bowel accident Sunday morning, won't go again until Wednesday
- **Pattern observed:** Accidents happen later same day after routine (possibly stress + medication timing)
- **Next test:** Try taking bowel meds 1-2 hours earlier, track stress on routine days
- **Pain/fatigue notes:** Fatigue is primary blocker, not pain
- **Stress link:** Lately more stress-related — need to track correlation

## Task Capture
- **Phone list:** Currently using (basic)
- **Voice notes:** ✅ SETUP COMPLETE (Whisper transcription, local)
  - Script: `/root/.openclaw/workspace/scripts/voice-task-capture.sh`
  - Output: `/root/.openclaw/workspace/voice-tasks.md`
  - Model: Whisper turbo (local, no API costs)
  - Status: Ready for testing
  - Guide: `/root/.openclaw/workspace/VOICE_SETUP.md`
- **Telegram:** Primary communication channel
- **GitHub:** report-writer repo needs integration

## Hardware & Access
- **Ollama:** 192.168.1.174:11434 (qwen3.5:35b primary)
- **Models ready:** qwen3.5:35b, qwen2.5:14b, llama3.2:3b
- **Cloud backup:** Claude Haiku for subagents
- **Speech input:** ✅ Voice control configured (Whisper local)

## Email & Calendar Integration (Setup Complete)
- **Gmail:** chris.cole.work1985@gmail.com
  - Tokens: `/root/.openclaw/credentials/google-token.json`
  - Whitelist: probinson85@live.com.au, paulrobinson85@outlook.com.au
  - Rate limit: 5/hour, 20/day
  - Audit log: `/root/.openclaw/logs/email-audit.log`

- **Calendars (Read Access):**
  - chris.cole.work1985@gmail.com (primary)
    - Token: `/root/.openclaw/credentials/google-calendar-token.json`
  - pjrobinson85@gmail.com (secondary)
    - Token: `/root/.openclaw/credentials/google-pj-calendar-token.json`

- **Google Credentials:**
  - File: `/root/.openclaw/credentials/google-credentials.json`
  - Available to all sessions (main + subagents)

## Communication Preferences
- **Notifications:** Fewer, bigger check-ins (not constant pings)
- **Platform:** Telegram only
- **Tone:** Direct, honest, no corporate speak
- **Emojis:** Minimal

## Distraction Management
- **Environment:** Shared house, lots of people
- **Solution:** Need focus time protection, not environmental changes (can't control)
- **Hyperfocus mode:** Don't interrupt when locked in (but check in every 45 mins)

---

Will add GitHub integration and other tools as configured.
