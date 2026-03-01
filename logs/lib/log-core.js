/**
 * Core Logging Library for Node.js
 * Usage: const { logger, logEvent } = require('./log-core.js');
 */

const fs = require('fs');
const path = require('path');

// Configure logs directory
const LOGS_DIR = process.env.LOGS_DIR || path.join(__dirname, '..', 'data', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Secret patterns to redact
const SECRET_PATTERNS = [
    /password/gi,
    /token/gi,
    /api_key/gi,
    /apikey/gi,
    /secret/gi,
    /credential/gi,
    /authorization/gi,
    /bearer/gi,
];

/**
 * Redact sensitive information from log data
 */
function redactSecrets(data) {
    let result = data;
    
    for (const pattern of SECRET_PATTERNS) {
        // JSON format: "key": "value"
        result = result.replace(
            new RegExp(`("${pattern.source}"[:\\s]*")[^"]+`, 'gi'),
            '$1***REDACTED***'
        );
        // URL param format: key=value
        result = result.replace(
            new RegExp(`(${pattern.source}[=\\s]*)[^&\\s,}]+`, 'gi'),
            '$1***REDACTED***'
        );
    }
    
    return result;
}

/**
 * Generate ISO 8601 timestamp
 */
function isoTimestamp() {
    return new Date().toISOString();
}

/**
 * Log a structured event to JSONL files
 */
function logEvent(eventName, level = 'info', message = '', extraFields = {}) {
    // Build event
    const event = {
        timestamp: isoTimestamp(),
        event: eventName,
        level: level,
        message: message,
        ...extraFields
    };
    
    // Serialize to JSON
    let eventJson = JSON.stringify(event);
    
    // Redact secrets
    eventJson = redactSecrets(eventJson);
    
    // Write to per-event log
    const eventLog = path.join(LOGS_DIR, `${eventName}.jsonl`);
    fs.appendFileSync(eventLog, eventJson + '\n');
    
    // Mirror to unified stream
    const allLog = path.join(LOGS_DIR, 'all.jsonl');
    fs.appendFileSync(allLog, eventJson + '\n');
}

/**
 * Structured logger with convenience methods
 */
class Logger {
    constructor(eventPrefix = '') {
        this.eventPrefix = eventPrefix;
    }
    
    _log(level, eventName, message, extraFields = {}) {
        const fullEvent = this.eventPrefix ? `${this.eventPrefix}.${eventName}` : eventName;
        logEvent(fullEvent, level, message, extraFields);
    }
    
    debug(eventName, message, extraFields = {}) {
        this._log('debug', eventName, message, extraFields);
    }
    
    info(eventName, message, extraFields = {}) {
        this._log('info', eventName, message, extraFields);
    }
    
    warn(eventName, message, extraFields = {}) {
        this._log('warn', eventName, message, extraFields);
    }
    
    error(eventName, message, extraFields = {}) {
        this._log('error', eventName, message, extraFields);
    }
    
    fatal(eventName, message, extraFields = {}) {
        this._log('fatal', eventName, message, extraFields);
    }
}

// Global logger instance
const logger = new Logger();

// Export
module.exports = {
    logEvent,
    logger,
    Logger,
    redactSecrets,
    isoTimestamp,
    LOGS_DIR
};

// Example usage
if (require.main === module) {
    logger.info('test', 'Test log entry', { userId: 123, action: 'login' });
    logger.error('test.failure', 'Test error', { errorCode: 500, token: 'secret123' });
    console.log(`Logs written to ${LOGS_DIR}`);
}
