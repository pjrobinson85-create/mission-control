#!/bin/bash
# Voice Task Capture - Transcribe voice messages and add to task inbox
#
# Usage:
#   ./voice-task-capture.sh /path/to/voice.ogg
#   ./voice-task-capture.sh /path/to/voice.m4a

set -e

VOICE_FILE="$1"
TASKS_FILE="/root/.openclaw/workspace/voice-tasks.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

if [ -z "$VOICE_FILE" ] || [ ! -f "$VOICE_FILE" ]; then
    echo "Error: Voice file not found: $VOICE_FILE"
    exit 1
fi

# Transcribe using Whisper (local, no API key)
echo "Transcribing audio..."
TRANSCRIPT=$(whisper "$VOICE_FILE" --model turbo --output_format txt --output_dir /tmp --fp16 False 2>/dev/null | tail -1)

# If whisper creates a .txt file, read from it
TXT_FILE="${VOICE_FILE%.*}.txt"
if [ -f "$TXT_FILE" ]; then
    TRANSCRIPT=$(cat "$TXT_FILE")
fi

# Fallback: try /tmp/*.txt
if [ -z "$TRANSCRIPT" ]; then
    LATEST_TXT=$(ls -t /tmp/*.txt 2>/dev/null | head -1)
    if [ -f "$LATEST_TXT" ]; then
        TRANSCRIPT=$(cat "$LATEST_TXT")
    fi
fi

if [ -z "$TRANSCRIPT" ]; then
    echo "Error: Transcription failed"
    exit 1
fi

# Add to task inbox
echo "" >> "$TASKS_FILE"
echo "## [$TIMESTAMP] Voice Task" >> "$TASKS_FILE"
echo "$TRANSCRIPT" >> "$TASKS_FILE"
echo "" >> "$TASKS_FILE"

echo "✓ Task captured:"
echo "$TRANSCRIPT"
echo ""
echo "Added to: $TASKS_FILE"
