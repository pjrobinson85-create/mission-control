/**
 * Anthropic SDK Wrapper
 * Uses @anthropic-ai/claude-agent-sdk with OAuth authentication
 */

const fs = require('fs');
const path = require('path');
const { normalizeAnthropicModel } = require('./model-utils');
const { logLlmCall } = require('./interaction-store');

let AnthropicSDK;
try {
    AnthropicSDK = require('@anthropic-ai/claude-agent-sdk');
} catch (err) {
    console.error('⚠️  @anthropic-ai/claude-agent-sdk not installed');
    console.error('Run: npm install @anthropic-ai/claude-agent-sdk');
}

// Smoke test state
let smokeTestPassed = false;
let smokeTestError = null;

/**
 * Resolve OAuth token from environment
 * @returns {string|null} - OAuth token or null
 */
function resolveOAuthToken() {
    // 1. Check CLAUDE_CODE_OAUTH_TOKEN env var
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
        return process.env.CLAUDE_CODE_OAUTH_TOKEN;
    }
    
    // 2. Try to parse from .env file
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^CLAUDE_CODE_OAUTH_TOKEN=(.+)$/m);
        if (match) {
            return match[1].trim();
        }
    }
    
    return null;
}

/**
 * Check for credential conflicts
 * @throws {Error} - If both OAuth token and API key are set
 */
function checkCredentialConflicts() {
    const oauthToken = resolveOAuthToken();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (oauthToken && apiKey) {
        throw new Error(
            'Credential conflict: Both CLAUDE_CODE_OAUTH_TOKEN and ANTHROPIC_API_KEY are set. ' +
            'In OAuth-only mode, remove ANTHROPIC_API_KEY from your environment.'
        );
    }
    
    if (!oauthToken && !apiKey) {
        throw new Error(
            'No Anthropic credentials found. Set either:\n' +
            '  - CLAUDE_CODE_OAUTH_TOKEN (recommended, OAuth)\n' +
            '  - ANTHROPIC_API_KEY (legacy, API key)\n' +
            '\nFor OAuth setup:\n' +
            '  1. Run: claude login\n' +
            '  2. Add to .env: CLAUDE_CODE_OAUTH_TOKEN=<your-token>'
        );
    }
}

/**
 * Run smoke test to verify OAuth credentials
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function runSmokeTest(timeoutMs = 20000) {
    if (smokeTestPassed) {
        return; // Already passed
    }
    
    if (smokeTestError) {
        throw smokeTestError; // Already failed
    }
    
    // Check if smoke test is disabled
    if (process.env.SKIP_ANTHROPIC_SMOKE_TEST === 'true') {
        console.log('⚠️  Anthropic smoke test disabled via SKIP_ANTHROPIC_SMOKE_TEST=true');
        smokeTestPassed = true;
        return;
    }
    
    try {
        console.log('Running Anthropic OAuth smoke test...');
        
        const result = await runAnthropicAgentPromptInternal({
            model: 'claude-haiku-4-5-20251001', // Cheapest model
            prompt: 'Reply with exactly AUTH_OK and nothing else.',
            timeoutMs,
            caller: 'smoke-test',
            skipLog: true,
            skipSmokeTest: true, // Prevent infinite recursion
        });
        
        if (!result.text.includes('AUTH_OK')) {
            throw new Error(`Smoke test failed: unexpected response "${result.text}"`);
        }
        
        console.log('✓ Anthropic OAuth smoke test passed');
        smokeTestPassed = true;
    } catch (err) {
        smokeTestError = new Error(
            `Anthropic OAuth credentials are invalid or unreachable:\n${err.message}\n\n` +
            'Verify your OAuth token:\n' +
            '  1. Run: claude login\n' +
            '  2. Check CLAUDE_CODE_OAUTH_TOKEN in .env or environment'
        );
        throw smokeTestError;
    }
}

/**
 * Run prompt using Anthropic Agent SDK (internal, no smoke test)
 * @param {Object} params - Parameters
 * @param {string} params.model - Model name
 * @param {string} params.prompt - User prompt
 * @param {number} params.timeoutMs - Timeout in milliseconds
 * @param {string} params.caller - Caller name
 * @param {number} params.maxTurns - Max conversation turns (default: 1)
 * @param {boolean} params.skipLog - Skip logging to database
 * @param {boolean} params.skipSmokeTest - Skip smoke test (internal use only)
 * @returns {Promise<Object>} - { text, provider: "anthropic" }
 */
async function runAnthropicAgentPromptInternal(params) {
    const {
        model,
        prompt,
        timeoutMs = 60000,
        caller = 'unknown',
        maxTurns = 1,
        skipLog = false,
        skipSmokeTest = false,
    } = params;
    
    // Check for SDK
    if (!AnthropicSDK) {
        throw new Error('@anthropic-ai/claude-agent-sdk not installed');
    }
    
    // Check credentials
    checkCredentialConflicts();
    const oauthToken = resolveOAuthToken();
    
    if (!oauthToken) {
        throw new Error('No OAuth token available for Anthropic SDK');
    }
    
    // Normalize model name
    const normalizedModel = normalizeAnthropicModel(model);
    
    const startTime = Date.now();
    let response = '';
    let error = null;
    let ok = true;
    
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        // Initialize SDK client
        const client = new AnthropicSDK.ClaudeAgentSDK({
            oauthToken,
        });
        
        // Run query in toolless mode
        const result = await client.query({
            model: normalizedModel,
            messages: [
                { role: 'user', content: prompt }
            ],
            tools: [], // Toolless mode
            maxTurns,
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Extract text from response
        if (result.messages && result.messages.length > 0) {
            const lastMessage = result.messages[result.messages.length - 1];
            
            if (Array.isArray(lastMessage.content)) {
                // Content is array of blocks
                response = lastMessage.content
                    .filter(block => block.type === 'text')
                    .map(block => block.text)
                    .join('\n');
            } else if (typeof lastMessage.content === 'string') {
                // Content is plain string
                response = lastMessage.content;
            }
        }
        
        if (!response) {
            throw new Error('No text response received from Anthropic SDK');
        }
    } catch (err) {
        ok = false;
        error = err.message;
        
        if (err.name === 'AbortError') {
            throw new Error(`Anthropic SDK call timed out after ${timeoutMs}ms`);
        }
        
        throw err;
    } finally {
        const durationMs = Date.now() - startTime;
        
        // Log call (unless skipLog is true)
        if (!skipLog) {
            logLlmCall({
                provider: 'anthropic',
                model: normalizedModel,
                caller,
                prompt,
                response,
                durationMs,
                ok,
                error,
            });
        }
    }
    
    return {
        text: response,
        provider: 'anthropic',
    };
}

/**
 * Run prompt using Anthropic Agent SDK
 * @param {Object} params - Parameters
 * @param {string} params.model - Model name
 * @param {string} params.prompt - User prompt
 * @param {number} params.timeoutMs - Timeout in milliseconds (default: 60000)
 * @param {string} params.caller - Caller name
 * @param {number} params.maxTurns - Max conversation turns (default: 1)
 * @param {boolean} params.skipLog - Skip logging to database
 * @returns {Promise<Object>} - { text, provider: "anthropic" }
 */
async function runAnthropicAgentPrompt(params) {
    // Run smoke test before first real request
    await runSmokeTest();
    
    return runAnthropicAgentPromptInternal(params);
}

module.exports = {
    runAnthropicAgentPrompt,
    resolveOAuthToken,
    checkCredentialConflicts,
    runSmokeTest,
};
