# Voice Task Capture Setup

## ✅ Status: Ready to Use

**Installed:** March 7, 2026  
**Location:** `/root/.openclaw/workspace/scripts/voice-task-capture.sh`

---

## How It Works

1. **Send voice message** to Telegram
2. **Telegram downloads** the voice file (OpenClaw handles this automatically)
3. **Whisper transcribes** the audio locally (no API key, runs on your machine)
4. **Task saved** to `voice-tasks.md` with timestamp

---

## Manual Usage (Testing)

If you have a voice file saved locally:

```bash
cd /root/.openclaw/workspace
./scripts/voice-task-capture.sh /path/to/voice.ogg
```

---

## Automatic Integration (TODO)

To make this fully automatic when you send voice messages on Telegram, we need to:

1. **Check if OpenClaw saves voice files** (it might already do this)
2. **Add a hook** to auto-run the transcription script
3. **Or:** Add voice handling to the main agent loop

For now, you can:
- Send voice message → I manually run the transcription script
- Or: We set up a file watcher on the voice downloads folder

---

## Voice Tasks File

**Location:** `/root/.openclaw/workspace/voice-tasks.md`

Tasks are appended with timestamps:

```markdown
## [2026-03-07 19:20] Voice Task
Remind me to call Georgia about the report writer testing

## [2026-03-07 19:45] Voice Task
Add NDIS review prep to tomorrow's task list
```

---

## Tech Stack

- **Whisper model:** `turbo` (fast, good accuracy)
- **No API costs:** 100% local transcription
- **Supported formats:** `.ogg`, `.m4a`, `.mp3`, `.wav` (Telegram uses `.ogg` or `.m4a`)
- **Model storage:** `~/.cache/whisper/` (downloads on first use)

---

## Next Steps

1. Test with a voice message now
2. Check if OpenClaw auto-saves Telegram voice files
3. If yes → set up auto-transcription
4. If no → add voice file download handling

Want to test it now? Send me a voice message on Telegram!
