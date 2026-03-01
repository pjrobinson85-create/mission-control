/**
 * Unified LLM Router
 * Single entry point for all LLM calls across providers
 */

const { isAnthropicModel, detectModelProvider } = require('./model-utils');
const { runAnthropicAgentPrompt } = require('./anthropic-agent-sdk');
const { logLlmCall } = require('./interaction-store');

/**
 * Run an LLM call (unified entry point)
 * @param {string} prompt - User prompt
 * @param {Object} options - Options
 * @param {string} options.model - Model name (required)
 * @param {number} options.timeoutMs - Timeout in milliseconds (default: 60000)
 * @param {string} options.caller - Calling script/function name (default: "unknown")
 * @param {boolean} options.skipLog - Skip logging to database (default: false)
 * @param {number} options.maxTurns - Max conversation turns for Anthropic (default: 1)
 * @returns {Promise<Object>} - { text, durationMs, provider }
 */
async function runLlm(prompt, options = {}) {
    const {
        model,
        timeoutMs = 60000,
        caller = 'unknown',
        skipLog = false,
        maxTurns = 1,
    } = options;
    
    if (!model) {
        throw new Error('Model is required for LLM call');
    }
    
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt must be a non-empty string');
    }
    
    const startTime = Date.now();
    
    try {
        // Detect provider
        const provider = detectModelProvider(model);
        
        if (!provider) {
            throw new Error(`Unable to detect provider for model: ${model}`);
        }
        
        let result;
        
        // Route to appropriate provider
        if (provider === 'anthropic' || isAnthropicModel(model)) {
            // Route to Anthropic SDK wrapper
            result = await runAnthropicAgentPrompt({
                model,
                prompt,
                timeoutMs,
                caller,
                maxTurns,
                skipLog,
            });
        } else if (provider === 'openai') {
            // Route to OpenAI handler
            result = await runOpenAI({
                model,
                prompt,
                timeoutMs,
                caller,
                skipLog,
            });
        } else if (provider === 'ollama') {
            // Route to Ollama handler
            result = await runOllama({
                model,
                prompt,
                timeoutMs,
                caller,
                skipLog,
            });
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        
        const durationMs = Date.now() - startTime;
        
        return {
            text: result.text,
            durationMs,
            provider: result.provider || provider,
        };
    } catch (err) {
        const durationMs = Date.now() - startTime;
        
        // Log failure (unless skipLog is true)
        if (!skipLog) {
            const provider = detectModelProvider(model) || 'unknown';
            logLlmCall({
                provider,
                model,
                caller,
                prompt,
                response: '',
                durationMs,
                ok: false,
                error: err.message,
            });
        }
        
        throw err;
    }
}

/**
 * Run OpenAI call
 * @param {Object} params - Parameters
 * @returns {Promise<Object>} - { text, provider: "openai" }
 */
async function runOpenAI(params) {
    const {
        model,
        prompt,
        timeoutMs = 60000,
        caller = 'unknown',
        skipLog = false,
    } = params;
    
    // Check for OpenAI SDK
    let OpenAI;
    try {
        OpenAI = require('openai');
    } catch (err) {
        throw new Error('openai package not installed. Run: npm install openai');
    }
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable not set');
    }
    
    const startTime = Date.now();
    let response = '';
    let error = null;
    let ok = true;
    let inputTokens = 0;
    let outputTokens = 0;
    
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: timeoutMs,
        });
        
        const completion = await client.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
        });
        
        response = completion.choices[0]?.message?.content || '';
        
        // Extract token usage
        if (completion.usage) {
            inputTokens = completion.usage.prompt_tokens;
            outputTokens = completion.usage.completion_tokens;
        }
        
        if (!response) {
            throw new Error('No response from OpenAI');
        }
    } catch (err) {
        ok = false;
        error = err.message;
        throw err;
    } finally {
        const durationMs = Date.now() - startTime;
        
        // Log call (unless skipLog is true)
        if (!skipLog) {
            logLlmCall({
                provider: 'openai',
                model,
                caller,
                prompt,
                response,
                inputTokens,
                outputTokens,
                durationMs,
                ok,
                error,
            });
        }
    }
    
    return {
        text: response,
        provider: 'openai',
    };
}

/**
 * Run Ollama call
 * @param {Object} params - Parameters
 * @returns {Promise<Object>} - { text, provider: "ollama" }
 */
async function runOllama(params) {
    const {
        model,
        prompt,
        timeoutMs = 60000,
        caller = 'unknown',
        skipLog = false,
    } = params;
    
    const ollamaHost = process.env.OLLAMA_HOST || 'http://192.168.1.174:11434';
    
    const startTime = Date.now();
    let response = '';
    let error = null;
    let ok = true;
    
    try {
        // Strip ollama/ prefix if present
        const cleanModel = model.replace(/^ollama\//, '');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        const res = await fetch(`${ollamaHost}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: cleanModel,
                prompt,
                stream: false,
            }),
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            throw new Error(`Ollama API returned ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        response = data.response || '';
        
        if (!response) {
            throw new Error('No response from Ollama');
        }
    } catch (err) {
        ok = false;
        error = err.message;
        
        if (err.name === 'AbortError') {
            throw new Error(`Ollama call timed out after ${timeoutMs}ms`);
        }
        
        throw err;
    } finally {
        const durationMs = Date.now() - startTime;
        
        // Log call (unless skipLog is true)
        if (!skipLog) {
            logLlmCall({
                provider: 'ollama',
                model,
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
        provider: 'ollama',
    };
}

module.exports = {
    runLlm,
    runOpenAI,
    runOllama,
};
