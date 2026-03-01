/**
 * Interaction Store
 * Logs all LLM calls to SQLite database with cost estimation
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const DB_DIR = path.join(process.env.HOME || '/root', '.openclaw', 'workspace', 'shared', 'data');
const DB_PATH = path.join(DB_DIR, 'llm-calls.db');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database with WAL mode
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to open LLM calls database:', err);
    }
});

// Enable WAL mode for better concurrency
db.run('PRAGMA journal_mode = WAL;');
db.run('PRAGMA synchronous = NORMAL;');

// Create table
const SCHEMA = `
CREATE TABLE IF NOT EXISTS llm_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    caller TEXT,
    prompt TEXT,
    response TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_estimate REAL,
    duration_ms INTEGER,
    ok INTEGER NOT NULL DEFAULT 1,
    error TEXT
);

CREATE INDEX IF NOT EXISTS idx_llm_calls_timestamp ON llm_calls(timestamp);
CREATE INDEX IF NOT EXISTS idx_llm_calls_provider ON llm_calls(provider);
CREATE INDEX IF NOT EXISTS idx_llm_calls_model ON llm_calls(model);
CREATE INDEX IF NOT EXISTS idx_llm_calls_caller ON llm_calls(caller);
CREATE INDEX IF NOT EXISTS idx_llm_calls_ok ON llm_calls(ok);
`;

db.exec(SCHEMA, (err) => {
    if (err) {
        console.error('Failed to create llm_calls table:', err);
    }
});

// Pricing table (USD per 1M tokens)
const PRICING = {
    // Anthropic Claude models
    'claude-opus-4-20250514': { input: 15.00, output: 75.00 },
    'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
    'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00 },
    'claude-haiku-4-20250514': { input: 0.25, output: 1.25 },
    'claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
    
    // OpenAI models
    'gpt-4-turbo-preview': { input: 10.00, output: 30.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    
    // Default fallback
    'default': { input: 1.00, output: 2.00 },
};

/**
 * Estimate token count from character count
 * Rough estimate: ~4 characters per token
 * @param {string} text - Text to estimate
 * @returns {number} - Estimated token count
 */
function estimateTokensFromChars(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}

/**
 * Estimate cost for a model call
 * @param {string} model - Model name
 * @param {number} inputTokens - Input token count
 * @param {number} outputTokens - Output token count
 * @returns {number} - Cost in USD
 */
function estimateCost(model, inputTokens, outputTokens) {
    const pricing = PRICING[model] || PRICING.default;
    
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    
    return inputCost + outputCost;
}

/**
 * Redact sensitive information from text
 * @param {string} text - Text to redact
 * @returns {string} - Redacted text
 */
function redactSecrets(text) {
    if (!text) return text;
    
    // Redact patterns that look like API keys or bearer tokens
    let redacted = text;
    
    // API key patterns (e.g., sk-..., api_...)
    redacted = redacted.replace(/\b(sk|api|key|token)[-_][a-zA-Z0-9]{20,}\b/gi, '***REDACTED***');
    
    // Bearer tokens
    redacted = redacted.replace(/Bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, 'Bearer ***REDACTED***');
    
    // OAuth tokens
    redacted = redacted.replace(/(oauth|access)[-_]token[:\s]*[a-zA-Z0-9\-._~+/]+=*/gi, 'oauth_token: ***REDACTED***');
    
    return redacted;
}

/**
 * Truncate text to maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxChars - Maximum characters (default: 10000)
 * @returns {string} - Truncated text
 */
function truncateText(text, maxChars = 10000) {
    if (!text) return text;
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '... [truncated]';
}

/**
 * Log an LLM call to the database
 * Fire-and-forget operation (doesn't block or throw)
 * @param {Object} params - Call parameters
 * @param {string} params.provider - Provider name (e.g., "anthropic", "openai")
 * @param {string} params.model - Model name
 * @param {string} params.caller - Calling script/function name
 * @param {string} params.prompt - Input prompt
 * @param {string} params.response - Model response
 * @param {number} params.inputTokens - Input token count (optional, estimated if not provided)
 * @param {number} params.outputTokens - Output token count (optional, estimated if not provided)
 * @param {number} params.durationMs - Call duration in milliseconds
 * @param {boolean} params.ok - Whether call succeeded
 * @param {string} params.error - Error message if call failed
 */
function logLlmCall(params) {
    try {
        const {
            provider,
            model,
            caller = 'unknown',
            prompt = '',
            response = '',
            inputTokens,
            outputTokens,
            durationMs = 0,
            ok = true,
            error = null,
        } = params;
        
        // Truncate and redact
        const safePrompt = truncateText(redactSecrets(prompt), 10000);
        const safeResponse = truncateText(redactSecrets(response), 10000);
        const safeError = error ? redactSecrets(error) : null;
        
        // Estimate tokens if not provided
        const finalInputTokens = inputTokens || estimateTokensFromChars(prompt);
        const finalOutputTokens = outputTokens || estimateTokensFromChars(response);
        
        // Estimate cost
        const costEstimate = estimateCost(model, finalInputTokens, finalOutputTokens);
        
        // Insert into database (fire-and-forget)
        const stmt = db.prepare(`
            INSERT INTO llm_calls (
                timestamp, provider, model, caller, prompt, response,
                input_tokens, output_tokens, cost_estimate, duration_ms, ok, error
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            new Date().toISOString(),
            provider,
            model,
            caller,
            safePrompt,
            safeResponse,
            finalInputTokens,
            finalOutputTokens,
            costEstimate,
            durationMs,
            ok ? 1 : 0,
            safeError,
            (err) => {
                if (err) {
                    console.error('Failed to log LLM call:', err);
                }
            }
        );
        
        stmt.finalize();
    } catch (err) {
        // Fire-and-forget: don't throw, just log to console
        console.error('Error in logLlmCall:', err);
    }
}

/**
 * Get database statistics
 * @returns {Promise<Object>} - Statistics
 */
function getStats() {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT 
                COUNT(*) as total_calls,
                SUM(CASE WHEN ok = 1 THEN 1 ELSE 0 END) as successful_calls,
                SUM(CASE WHEN ok = 0 THEN 1 ELSE 0 END) as failed_calls,
                SUM(cost_estimate) as total_cost,
                AVG(duration_ms) as avg_duration_ms
            FROM llm_calls
        `, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Get recent calls
 * @param {number} limit - Number of calls to retrieve
 * @returns {Promise<Array>} - Recent calls
 */
function getRecentCalls(limit = 10) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT 
                timestamp, provider, model, caller, 
                input_tokens, output_tokens, cost_estimate, duration_ms, ok, error
            FROM llm_calls
            ORDER BY timestamp DESC
            LIMIT ?
        `, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Close database connection
 */
function close() {
    db.close();
}

module.exports = {
    logLlmCall,
    estimateTokensFromChars,
    estimateCost,
    redactSecrets,
    truncateText,
    getStats,
    getRecentCalls,
    close,
    DB_PATH,
    PRICING,
};
