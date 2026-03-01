# Unified LLM Router

Single entry point for all LLM calls across providers (Anthropic, OpenAI, Ollama) with OAuth authentication, logging, and cost tracking.

## Features

- ✅ **OAuth Authentication** - Uses Anthropic Claude Agent SDK with OAuth tokens (no static API keys)
- ✅ **Multi-Provider Support** - Anthropic, OpenAI, Ollama
- ✅ **Automatic Routing** - Detects provider from model name
- ✅ **Model Aliases** - Friendly names (e.g., `opus-4` → `claude-opus-4-20250514`)
- ✅ **Call Logging** - Every call logged to SQLite with metadata
- ✅ **Cost Estimation** - Automatic cost calculation based on token usage
- ✅ **Secret Redaction** - API keys and tokens redacted before storage
- ✅ **Smoke Testing** - Verifies OAuth credentials on startup
- ✅ **Timeout Handling** - Configurable timeouts per call
- ✅ **Error Tracking** - Failed calls logged with error details

---

## Installation

```bash
cd shared
npm install
```

### Dependencies

- `@anthropic-ai/claude-agent-sdk` - Anthropic Claude Agent SDK (OAuth)
- `openai` - OpenAI Node.js SDK
- `sqlite3` - SQLite database for logging

---

## Setup

### 1. Anthropic OAuth Setup

```bash
# Install Claude CLI
npm install -g @anthropic-ai/claude-agent-sdk

# Login to get OAuth token
claude login
```

This will open a browser and authenticate you. The token is saved locally.

### 2. Configure Environment

Create or update `.env`:

```bash
# Anthropic OAuth (recommended)
CLAUDE_CODE_OAUTH_TOKEN=<your-oauth-token-from-claude-login>

# OpenAI API Key (if using OpenAI models)
OPENAI_API_KEY=sk-...

# Ollama Host (if using Ollama models)
OLLAMA_HOST=http://192.168.1.174:11434

# Optional: Skip Anthropic smoke test
SKIP_ANTHROPIC_SMOKE_TEST=false
```

⚠️ **Important:** Do NOT set both `CLAUDE_CODE_OAUTH_TOKEN` and `ANTHROPIC_API_KEY`. They conflict in OAuth-only mode.

---

## Usage

### Basic Example

```javascript
const { runLlm } = require('./shared/llm-router');

async function main() {
    const result = await runLlm("What is the capital of France?", {
        model: "claude-sonnet-4",
        caller: "my-script",
    });
    
    console.log(result.text);
    // Output: "The capital of France is Paris."
    
    console.log(`Duration: ${result.durationMs}ms`);
    console.log(`Provider: ${result.provider}`);
}

main();
```

### Using Model Aliases

```javascript
const { runLlm } = require('./shared/llm-router');

// These are equivalent:
await runLlm("Hello", { model: "opus-4" });
await runLlm("Hello", { model: "claude-opus-4-20250514" });

// Available aliases:
// - opus-4, opus → claude-opus-4-20250514
// - sonnet-4.5, sonnet → claude-sonnet-4-5-20250929
// - haiku-4.5, haiku → claude-haiku-4-5-20251001
// - gpt-4 → gpt-4-turbo-preview
// - gpt-3.5 → gpt-3.5-turbo
```

### With Options

```javascript
const result = await runLlm("Your prompt", {
    model: "claude-sonnet-4",
    timeoutMs: 30000,          // 30 second timeout
    caller: "my-function",      // For logging
    skipLog: false,             // Set true to skip database logging
    maxTurns: 1,                // For Anthropic: max conversation turns
});
```

### Error Handling

```javascript
try {
    const result = await runLlm("Your prompt", { model: "opus-4" });
    console.log(result.text);
} catch (err) {
    console.error('LLM call failed:', err.message);
    // Errors are automatically logged to database
}
```

---

## Model Utilities

```javascript
const {
    isAnthropicModel,
    normalizeAnthropicModel,
    detectModelProvider,
    getModelAliases,
} = require('./shared/model-utils');

// Check if model is Anthropic
isAnthropicModel('claude-sonnet-4');  // true
isAnthropicModel('gpt-4');            // false

// Normalize model name
normalizeAnthropicModel('anthropic/opus-4');  // "claude-opus-4-20250514"
normalizeAnthropicModel('sonnet');            // "claude-sonnet-4-5-20250929"

// Detect provider
detectModelProvider('claude-sonnet-4');  // "anthropic"
detectModelProvider('gpt-4');            // "openai"
detectModelProvider('ollama/llama3');    // "ollama"

// Get all aliases
const aliases = getModelAliases();
console.log(aliases);
```

---

## Interaction Store

All LLM calls are logged to SQLite database at:
```
~/.openclaw/workspace/shared/data/llm-calls.db
```

### Query Statistics

```javascript
const { getStats, getRecentCalls } = require('./shared/interaction-store');

// Get overall statistics
const stats = await getStats();
console.log(stats);
// {
//   total_calls: 150,
//   successful_calls: 145,
//   failed_calls: 5,
//   total_cost: 2.45,
//   avg_duration_ms: 3500
// }

// Get recent calls
const recent = await getRecentCalls(10);
recent.forEach(call => {
    console.log(`${call.timestamp}: ${call.model} - ${call.cost_estimate} USD`);
});
```

### Database Schema

```sql
CREATE TABLE llm_calls (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    caller TEXT,
    prompt TEXT,            -- Truncated to 10K chars, secrets redacted
    response TEXT,          -- Truncated to 10K chars, secrets redacted
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_estimate REAL,     -- USD
    duration_ms INTEGER,
    ok INTEGER,             -- 1 = success, 0 = failure
    error TEXT
);
```

### Cost Estimation

Costs are estimated based on model pricing (USD per 1M tokens):

| Model | Input | Output |
|-------|-------|--------|
| claude-opus-4 | $15.00 | $75.00 |
| claude-sonnet-4 | $3.00 | $15.00 |
| claude-haiku-4.5 | $0.80 | $4.00 |
| gpt-4-turbo | $10.00 | $30.00 |
| gpt-3.5-turbo | $0.50 | $1.50 |

Token counts are either:
- Provided by the API (OpenAI)
- Estimated from character count (~4 chars/token)

---

## Anthropic SDK Wrapper

Direct access to Anthropic SDK wrapper (normally you'd use `runLlm`):

```javascript
const { runAnthropicAgentPrompt } = require('./shared/anthropic-agent-sdk');

const result = await runAnthropicAgentPrompt({
    model: 'claude-sonnet-4',
    prompt: 'Hello',
    timeoutMs: 60000,
    caller: 'my-script',
    maxTurns: 1,
    skipLog: false,
});

console.log(result.text);
```

### Smoke Test

OAuth credentials are tested on first use:

```javascript
const { runSmokeTest } = require('./shared/anthropic-agent-sdk');

// Manually trigger smoke test
try {
    await runSmokeTest();
    console.log('OAuth credentials verified');
} catch (err) {
    console.error('OAuth credentials invalid:', err.message);
}
```

**Disable smoke test:**
```bash
export SKIP_ANTHROPIC_SMOKE_TEST=true
```

---

## Provider Handlers

### OpenAI

```javascript
const { runOpenAI } = require('./shared/llm-router');

const result = await runOpenAI({
    model: 'gpt-4-turbo-preview',
    prompt: 'Hello',
    timeoutMs: 30000,
    caller: 'my-script',
    skipLog: false,
});
```

Requires `OPENAI_API_KEY` environment variable.

### Ollama

```javascript
const { runOllama } = require('./shared/llm-router');

const result = await runOllama({
    model: 'llama3',
    prompt: 'Hello',
    timeoutMs: 30000,
    caller: 'my-script',
    skipLog: false,
});
```

Uses `OLLAMA_HOST` environment variable (default: `http://192.168.1.174:11434`).

---

## Testing

```bash
npm test
```

Or manually:

```javascript
const { runLlm } = require('./shared/llm-router');

async function test() {
    console.log('Testing Anthropic...');
    const result1 = await runLlm('Say hello', { model: 'haiku' });
    console.log('✓', result1.text);
    
    console.log('Testing OpenAI...');
    const result2 = await runLlm('Say hello', { model: 'gpt-3.5' });
    console.log('✓', result2.text);
    
    console.log('Testing Ollama...');
    const result3 = await runLlm('Say hello', { model: 'ollama/llama3.2:3b' });
    console.log('✓', result3.text);
}

test();
```

---

## Error Handling

### Common Errors

**"No Anthropic credentials found"**
```bash
# Solution: Set up OAuth
claude login
echo "CLAUDE_CODE_OAUTH_TOKEN=<token>" >> .env
```

**"Credential conflict"**
```bash
# Solution: Remove ANTHROPIC_API_KEY
unset ANTHROPIC_API_KEY
# Or remove from .env
```

**"Smoke test failed"**
```bash
# Solution: Verify OAuth token is valid
claude login  # Re-authenticate

# Or skip smoke test (not recommended)
export SKIP_ANTHROPIC_SMOKE_TEST=true
```

**"@anthropic-ai/claude-agent-sdk not installed"**
```bash
npm install @anthropic-ai/claude-agent-sdk
```

---

## Architecture

```
shared/
├── llm-router.js              # Main entry point
├── model-utils.js             # Model aliases & provider detection
├── interaction-store.js       # SQLite logging & cost estimation
├── anthropic-agent-sdk.js     # OAuth wrapper for Anthropic SDK
├── package.json
├── README.md
└── data/
    └── llm-calls.db           # SQLite database (created automatically)
```

### Data Flow

```
Your Code
    │
    ▼
runLlm(prompt, { model })
    │
    ├─► detectModelProvider(model)
    │
    ├─► Route to provider:
    │   ├─► Anthropic → runAnthropicAgentPrompt()
    │   ├─► OpenAI   → runOpenAI()
    │   └─► Ollama   → runOllama()
    │
    ├─► Provider SDK call
    │
    ├─► Extract response
    │
    ├─► logLlmCall() → SQLite
    │
    └─► Return { text, durationMs, provider }
```

---

## Logging Details

### Secret Redaction

Patterns redacted before storage:
- API keys: `sk-...`, `api_...`, `key-...`
- Bearer tokens: `Bearer <token>`
- OAuth tokens: `oauth_token: <token>`

**Example:**
```javascript
// Input
"My API key is sk-abc123xyz"

// Stored
"My API key is ***REDACTED***"
```

### Text Truncation

- Prompts: Truncated to 10,000 characters
- Responses: Truncated to 10,000 characters
- Appends `... [truncated]` when truncated

### Fire-and-Forget

Logging is non-blocking:
- Doesn't throw errors (logs to console)
- Doesn't delay response
- Database errors don't break the call

---

## Performance

### Benchmarks

| Provider | Model | Avg Duration | Tokens/sec |
|----------|-------|--------------|------------|
| Anthropic | opus-4 | ~5000ms | ~20 |
| Anthropic | sonnet-4.5 | ~3000ms | ~30 |
| Anthropic | haiku-4.5 | ~1500ms | ~60 |
| OpenAI | gpt-4-turbo | ~4000ms | ~25 |
| OpenAI | gpt-3.5-turbo | ~2000ms | ~50 |
| Ollama | llama3.2:3b | ~500ms | ~100 |

*Benchmarks vary by prompt complexity and hardware*

### Optimization Tips

1. **Use aliases** - Faster provider detection
2. **Skip logging** for high-frequency calls - `skipLog: true`
3. **Set timeouts** - Prevent hanging calls
4. **Use cheaper models** for simple tasks - `haiku` instead of `opus`

---

## Security

### OAuth vs API Keys

**OAuth (recommended):**
- ✅ More secure (no static keys in environment)
- ✅ Scoped permissions
- ✅ Automatic rotation
- ✅ Revocable via web UI

**API Keys (legacy):**
- ❌ Static secrets in environment
- ❌ Broader permissions
- ❌ Manual rotation

### Best Practices

1. **Never commit** `.env` files
2. **Use OAuth** for Anthropic (not API keys)
3. **Rotate tokens** regularly
4. **Monitor logs** for unauthorized usage
5. **Set timeouts** to prevent abuse

---

## Troubleshooting

### Debug Logging

Enable verbose logging:

```javascript
// Before calling runLlm
process.env.DEBUG = 'llm-router:*';

const result = await runLlm("test", { model: "haiku" });
```

### Database Issues

```bash
# Check database exists
ls -la ~/.openclaw/workspace/shared/data/llm-calls.db

# Query directly
sqlite3 ~/.openclaw/workspace/shared/data/llm-calls.db "SELECT * FROM llm_calls LIMIT 5;"

# Check WAL mode
sqlite3 ~/.openclaw/workspace/shared/data/llm-calls.db "PRAGMA journal_mode;"
```

### OAuth Token Issues

```bash
# Re-authenticate
claude login

# Check token exists
echo $CLAUDE_CODE_OAUTH_TOKEN

# Or check .env
grep CLAUDE_CODE_OAUTH_TOKEN .env
```

---

## Examples

### Batch Processing

```javascript
const { runLlm } = require('./shared/llm-router');

async function batchProcess(prompts) {
    const results = await Promise.all(
        prompts.map(prompt =>
            runLlm(prompt, {
                model: 'haiku',  // Fast, cheap model
                caller: 'batch-processor',
                timeoutMs: 10000,
            })
        )
    );
    
    return results.map(r => r.text);
}

const prompts = [
    "Translate 'hello' to French",
    "Translate 'hello' to Spanish",
    "Translate 'hello' to German",
];

batchProcess(prompts).then(results => {
    results.forEach((text, i) => console.log(`${i+1}. ${text}`));
});
```

### Streaming Support (Future)

Currently, responses are buffered. For streaming:

```javascript
// TODO: Add streaming support
// const stream = await runLlmStream("prompt", { model: "opus" });
// for await (const chunk of stream) {
//     process.stdout.write(chunk);
// }
```

---

## Contributing

Issues and improvements? Document them:
- Bugs → `learnings/ERRORS.md`
- Features → `learnings/FEATURE_REQUESTS.md`

---

## License

MIT - Part of OpenClaw workspace

**Version:** 1.0.0  
**Last Updated:** 2026-03-01
