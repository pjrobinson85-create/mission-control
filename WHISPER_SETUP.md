# Whisper CPP Setup Complete ✅

## What's Installed

**Whisper CPP** — Fast, local speech-to-text using C++ implementation
- **Location:** `/opt/whisper/`
- **Model:** `base` (142MB, 99+ languages - multilingual!)
- **Legacy:** `base.en` also available (English-only, slightly faster)
- **Binary:** `/opt/whisper/whisper-cli`

## How to Use

### Quick Transcription
```bash
/opt/whisper/whisper-cli -m /opt/whisper/model.bin -l en input.wav

# Outputs: input.txt with transcribed text
```

### Using the Python Helper (Recommended)
```python
from whisper_helper import transcribe_audio

# Transcribe any audio file
text = transcribe_audio("/path/to/audio.wav", language="en")
print(text)
```

### From Shell Script
```bash
python3 /root/.openclaw/workspace/whisper_helper.py /path/to/audio.wav en
```

## Supported Audio Formats
- WAV
- MP3
- OGG/Opus (Telegram voice messages)
- M4A
- FLAC

## Language Codes
```
en (English) - default
de (German)
fr (French)
es (Spanish)
it (Italian)
pt (Portuguese)
pl (Polish)
tr (Turkish)
zh (Chinese)
ja (Japanese)
ko (Korean)
ru (Russian)
... and 80+ more
```

## Next Steps: Telegram Voice Integration

To use Whisper for Telegram voice messages:

1. **When a voice message arrives:**
   - OpenClaw downloads it as OGG file
   - Pass to `whisper_helper.transcribe_audio()`
   - Get text instantly

2. **Add to OpenClaw handler:**
   ```python
   # In your voice message handler
   from whisper_helper import convert_telegram_voice
   
   text = convert_telegram_voice(voice_data, language="en")
   # Reply with transcribed text
   ```

## Performance Notes
- **Model:** base.en is ~140MB, balanced speed/accuracy
- **Speed:** ~1-2 seconds of audio per second on CPU
- **GPU:** Would be faster if CUDA available (check `nvidia-smi`)
- **RAM:** ~500MB-1GB during transcription

## Available Models (if needed)
To upgrade to a larger/better model:
```bash
cd /tmp/whisper.cpp
bash models/download-ggml-model.sh small.en   # Better accuracy, slower
bash models/download-ggml-model.sh medium.en  # High quality
bash models/download-ggml-model.sh large      # Best, multilingual
```

Copy to `/opt/whisper/model.bin` after download.

## Test It
```bash
# Test with sample file
python3 /root/.openclaw/workspace/whisper_helper.py /tmp/whisper.cpp/samples/jfk.wav en

# Expected output: "...ask not what your country can do for you..."
```

## Files Created
- `/root/.openclaw/workspace/whisper_helper.py` — Python helper class
- `/root/.openclaw/workspace/voice-to-text` — Bash wrapper script
- `/opt/whisper/whisper-cli` — Main binary
- `/opt/whisper/model.bin` — Language model (base.en)

## Integration with OpenClaw
Once Telegram voice message support is enabled in your config, this will automatically:
1. Capture voice messages from chat
2. Transcribe them using Whisper
3. Add to task list or respond with transcribed text

Ready to integrate!
