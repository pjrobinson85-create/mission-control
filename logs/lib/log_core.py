#!/usr/bin/env python3
"""
Core Logging Library for Python
Usage: from log_core import logger, log_event
"""

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional

# Configure logs directory
LOGS_DIR = Path(os.environ.get('LOGS_DIR', Path(__file__).parent.parent / 'data' / 'logs'))
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Secret patterns to redact
SECRET_PATTERNS = [
    r'password',
    r'token',
    r'api_key',
    r'apikey',
    r'secret',
    r'credential',
    r'authorization',
    r'bearer',
]

def redact_secrets(data: str) -> str:
    """Redact sensitive information from log data."""
    for pattern in SECRET_PATTERNS:
        # JSON format: "key": "value"
        data = re.sub(
            rf'("{pattern}"[:\s]*")[^"]+',
            r'\1***REDACTED***',
            data,
            flags=re.IGNORECASE
        )
        # URL param format: key=value
        data = re.sub(
            rf'({pattern}[=\s]*)[^&\s,}}]+',
            r'\1***REDACTED***',
            data,
            flags=re.IGNORECASE
        )
    return data

def iso_timestamp() -> str:
    """Generate ISO 8601 timestamp."""
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

def log_event(
    event_name: str,
    level: str = 'info',
    message: str = '',
    **extra_fields
) -> None:
    """
    Log a structured event to JSONL files.
    
    Args:
        event_name: Name of the event (e.g., 'user.login', 'api.call')
        level: Log level ('debug', 'info', 'warn', 'error', 'fatal')
        message: Human-readable message
        **extra_fields: Additional fields to include in the log entry
    """
    # Build event
    event = {
        'timestamp': iso_timestamp(),
        'event': event_name,
        'level': level,
        'message': message,
        **extra_fields
    }
    
    # Serialize to JSON
    event_json = json.dumps(event, separators=(',', ':'))
    
    # Redact secrets
    event_json = redact_secrets(event_json)
    
    # Write to per-event log
    event_log = LOGS_DIR / f'{event_name}.jsonl'
    with open(event_log, 'a') as f:
        f.write(event_json + '\n')
    
    # Mirror to unified stream
    all_log = LOGS_DIR / 'all.jsonl'
    with open(all_log, 'a') as f:
        f.write(event_json + '\n')

class Logger:
    """Structured logger with convenience methods."""
    
    def __init__(self, event_prefix: str = ''):
        self.event_prefix = event_prefix
    
    def _log(self, level: str, event_name: str, message: str, **kwargs):
        full_event = f'{self.event_prefix}.{event_name}' if self.event_prefix else event_name
        log_event(full_event, level, message, **kwargs)
    
    def debug(self, event_name: str, message: str, **kwargs):
        self._log('debug', event_name, message, **kwargs)
    
    def info(self, event_name: str, message: str, **kwargs):
        self._log('info', event_name, message, **kwargs)
    
    def warn(self, event_name: str, message: str, **kwargs):
        self._log('warn', event_name, message, **kwargs)
    
    def error(self, event_name: str, message: str, **kwargs):
        self._log('error', event_name, message, **kwargs)
    
    def fatal(self, event_name: str, message: str, **kwargs):
        self._log('fatal', event_name, message, **kwargs)

# Global logger instance
logger = Logger()

# Example usage
if __name__ == '__main__':
    logger.info('test', 'Test log entry', user_id=123, action='login')
    logger.error('test.failure', 'Test error', error_code=500, token='secret123')
    print(f'Logs written to {LOGS_DIR}')
