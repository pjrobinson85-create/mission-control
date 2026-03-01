/**
 * Model Utilities
 * Handles model name mapping, normalization, and provider detection
 */

// Friendly alias → official model name mapping
const MODEL_ALIASES = {
    // Claude models
    'opus-4': 'claude-opus-4-20250514',
    'sonnet-4': 'claude-sonnet-4-20250514',
    'sonnet-4.5': 'claude-sonnet-4-5-20250929',
    'haiku-4': 'claude-haiku-4-20250514',
    'haiku-4.5': 'claude-haiku-4-5-20251001',
    
    // Short aliases
    'opus': 'claude-opus-4-20250514',
    'sonnet': 'claude-sonnet-4-5-20250929',
    'haiku': 'claude-haiku-4-5-20251001',
    
    // OpenAI models
    'gpt-4': 'gpt-4-turbo-preview',
    'gpt-4-turbo': 'gpt-4-turbo-preview',
    'gpt-3.5': 'gpt-3.5-turbo',
};

// Provider prefixes to strip during normalization
const PROVIDER_PREFIXES = [
    'anthropic/',
    'openai/',
    'ollama/',
];

/**
 * Check if a model name is an Anthropic model
 * @param {string} model - Model name
 * @returns {boolean}
 */
function isAnthropicModel(model) {
    if (!model) return false;
    
    const normalized = model.toLowerCase();
    return normalized.includes('claude') ||
           normalized.includes('opus') ||
           normalized.includes('sonnet') ||
           normalized.includes('haiku');
}

/**
 * Normalize Anthropic model name
 * Resolves aliases and strips provider prefixes
 * @param {string} model - Model name
 * @returns {string} - Normalized model name
 */
function normalizeAnthropicModel(model) {
    if (!model) return model;
    
    // Strip provider prefixes
    let normalized = model;
    for (const prefix of PROVIDER_PREFIXES) {
        if (normalized.startsWith(prefix)) {
            normalized = normalized.substring(prefix.length);
            break;
        }
    }
    
    // Resolve alias
    if (MODEL_ALIASES[normalized]) {
        normalized = MODEL_ALIASES[normalized];
    }
    
    return normalized;
}

/**
 * Detect which provider a model belongs to
 * @param {string} model - Model name
 * @returns {string|null} - "anthropic", "openai", or null
 */
function detectModelProvider(model) {
    if (!model) return null;
    
    const normalized = model.toLowerCase();
    
    // Check for explicit provider prefix
    if (normalized.startsWith('anthropic/')) return 'anthropic';
    if (normalized.startsWith('openai/')) return 'openai';
    if (normalized.startsWith('ollama/')) return 'ollama';
    
    // Infer from model name
    if (isAnthropicModel(model)) return 'anthropic';
    if (normalized.includes('gpt')) return 'openai';
    
    return null;
}

/**
 * Get all available model aliases
 * @returns {Object} - Map of alias → official name
 */
function getModelAliases() {
    return { ...MODEL_ALIASES };
}

/**
 * Check if a model alias exists
 * @param {string} alias - Alias to check
 * @returns {boolean}
 */
function hasAlias(alias) {
    return alias in MODEL_ALIASES;
}

module.exports = {
    MODEL_ALIASES,
    isAnthropicModel,
    normalizeAnthropicModel,
    detectModelProvider,
    getModelAliases,
    hasAlias,
};
