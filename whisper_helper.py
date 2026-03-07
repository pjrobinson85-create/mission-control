#!/usr/bin/env python3
"""
Whisper CPP Helper - Convert audio to text
Handles voice message transcription for OpenClaw
"""

import subprocess
import os
import sys
from pathlib import Path

WHISPER_BIN = "/opt/whisper/whisper-cli"
WHISPER_MODEL = "/opt/whisper/model.bin"
TEMP_DIR = "/tmp/whisper-temp"

def ensure_temp_dir():
    """Create temp directory if needed"""
    Path(TEMP_DIR).mkdir(exist_ok=True)

def transcribe_audio(audio_path: str, language: str = "en") -> str:
    """
    Transcribe an audio file using Whisper CPP
    
    Args:
        audio_path: Path to audio file (wav, mp3, ogg, m4a, flac)
        language: Language code (en, de, fr, es, etc. Default: en)
    
    Returns:
        Transcribed text
    
    Raises:
        FileNotFoundError: If audio file or model not found
        subprocess.CalledProcessError: If transcription fails
    """
    
    if not os.path.isfile(WHISPER_BIN):
        raise FileNotFoundError(f"Whisper binary not found at {WHISPER_BIN}")
    
    if not os.path.isfile(WHISPER_MODEL):
        raise FileNotFoundError(f"Whisper model not found at {WHISPER_MODEL}")
    
    if not os.path.isfile(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    ensure_temp_dir()
    
    # Run whisper
    cmd = [
        WHISPER_BIN,
        "-m", WHISPER_MODEL,
        "-l", language,
        "-otxt",
        audio_path
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            raise subprocess.CalledProcessError(
                result.returncode,
                cmd,
                output=result.stdout,
                stderr=result.stderr
            )
        
        # Read the output text file
        base_path = audio_path.rsplit(".", 1)[0]
        txt_path = f"{base_path}.txt"
        
        if not os.path.isfile(txt_path):
            raise FileNotFoundError(f"Transcription output not found at {txt_path}")
        
        with open(txt_path, "r") as f:
            text = f.read().strip()
        
        # Clean up
        try:
            os.remove(txt_path)
        except:
            pass
        
        return text
    
    except subprocess.TimeoutExpired:
        raise TimeoutError(f"Transcription timed out after 300 seconds")

def convert_telegram_voice(voice_data: bytes, language: str = "en") -> str:
    """
    Convert Telegram voice message to text
    
    Args:
        voice_data: Raw audio data from Telegram
        language: Language code
    
    Returns:
        Transcribed text
    """
    ensure_temp_dir()
    
    # Save temp audio file (Telegram sends OGG/Opus)
    temp_audio = f"{TEMP_DIR}/telegram_voice.ogg"
    with open(temp_audio, "wb") as f:
        f.write(voice_data)
    
    try:
        return transcribe_audio(temp_audio, language)
    finally:
        # Clean up
        try:
            os.remove(temp_audio)
        except:
            pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: whisper_helper.py <audio_file> [language]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "en"
    
    try:
        text = transcribe_audio(audio_file, language)
        print(text)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
