# Unified LLM Router - Setup Guide

Step-by-step instructions to get the LLM router running.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Access to Anthropic/OpenAI/Ollama (depending on which providers you want to use)

---

## 1. Install Dependencies

```bash
cd ~/.openclaw/workspace/shared
npm install
```

This installs:
- `@anthropic-ai/claude-agent-sdk`
- `openai`
- `sqlite3`

---

## 2. Anthropic OAuth Setup (Recommended)

### Install Claude CLI

```bash
npm install -g @anthropic-ai/claude-agent-sdk
```

### Login to Get OAuth Token

```bash
claude login
```

This will:
1. Open a browser
2. Prompt you to log in to Anthropic
3. Grant permissions
4. Save your OAuth token locally

The token is stored in:
- macOS: `~/Library/Application Support/claude/auth.json`
- Linux: `~/.config/claude/auth.json`
- Windows: `%APPDATA%\claude\auth.json`

### Add Token to Environment

Option A - Environment variable:
```bash
export CLAUDE_CODE_OAUTH_TOKEN="<your-token>"
```

Option B - `.env` file (recommended):
```bash
echo "CLAUDE_CODE_OAUTH_TOKEN=<your-token>" >> .env
```

To get your token:
```bash
# macOS/Linux
cat ~/Library/Application\ Support/claude/auth.json
# or
cat ~/.config/claude/auth.json
```

Extract the `access_token` value.

---

## 3. OpenAI Setup (Optional)

If you want to use OpenAI models:

```bash
export OPENAI_API_KEY="sk-..."
# or add to .env
echo "OPENAI_API_KEY=sk-..." >> .env
```

Get your API key from: https://platform.openai.com/api-keys

---

## 4. Ollama Setup (Optional)

If you want to use Ollama models:

### Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or use existing Ollama server
```

### Configure Host

```bash
export OLLAMA_HOST="http://localhost:11434"
# or add to .env
echo "OLLAMA_HOST=http://192.168.1.174:11434" >> .env
```

Default: `http://192.168.1.174:11434`

### Pull Models

```bash
ollama pull llama3.2:3b
ollama pull qwen2.5:14b
```

---

## 5. Verify Setup

### Check Environment

```bash
# Anthropic
echo $CLAUDE_CODE_OAUTH_TOKEN

# OpenAI
echo $OPENAI_API_KEY

# Ollama
echo $OLLAMA_HOST
```

### Run Tests

```bash
npm test
```

Expected output:
```
=== Testing Model Utilities ===
✓ Provider detection working

=== Testing Anthropic Call ===
✓ Anthropic call succeeded
  Text: Hello from Anthropic
  Duration: 1500ms

=== Testing OpenAI Call ===
✓ OpenAI call succeeded
  Text: Hello from OpenAI
  Duration: 2000ms

=== Testing Ollama Call ===
✓ Ollama call succeeded
  Text: Hello from Ollama
  Duration: 500ms
```

---

## 6. First Call

Create `example.js`:

```javascript
const { runLlm } = require('./llm-router');

async function main() {
    const result = await runLlm("What is 2+2?", {
        model: "haiku",
        caller: "example-script",
    });
    
    console.log(result.text);
}

main();
```

Run it:
```bash
node example.js
```

---

## Troubleshooting

### "No Anthropic credentials found"

**Problem:** OAuth token not found.

**Solution:**
```bash
# Re-run login
claude login

# Check token exists
cat ~/Library/Application\ Support/claude/auth.json

# Add to environment
export CLAUDE_CODE_OAUTH_TOKEN="<token>"
```

### "Credential conflict"

**Problem:** Both `CLAUDE_CODE_OAUTH_TOKEN` and `ANTHROPIC_API_KEY` are set.

**Solution:**
```bash
# Remove old API key
unset ANTHROPIC_API_KEY

# Or remove from .env
sed -i '/ANTHROPIC_API_KEY/d' .env
```

### "Smoke test failed"

**Problem:** OAuth token is invalid or expired.

**Solution:**
```bash
# Re-authenticate
claude login

# Update token in .env
```

### "@anthropic-ai/claude-agent-sdk not installed"

**Problem:** Missing dependency.

**Solution:**
```bash
npm install @anthropic-ai/claude-agent-sdk
```

### "OPENAI_API_KEY not set"

**Problem:** Trying to use OpenAI without API key.

**Solution:**
```bash
export OPENAI_API_KEY="sk-..."
# or
echo "OPENAI_API_KEY=sk-..." >> .env
```

### "Ollama API returned 404"

**Problem:** Model not pulled or Ollama not running.

**Solution:**
```bash
# Start Ollama
ollama serve

# Pull model
ollama pull llama3.2:3b

# Test manually
curl http://localhost:11434/api/tags
```

---

## Configuration Summary

### Required for Anthropic

```bash
# Option 1: OAuth (recommended)
CLAUDE_CODE_OAUTH_TOKEN=<your-token>

# Option 2: API Key (legacy, conflicts with OAuth)
# ANTHROPIC_API_KEY=sk-ant-...
```

### Required for OpenAI

```bash
OPENAI_API_KEY=sk-...
```

### Required for Ollama

```bash
OLLAMA_HOST=http://localhost:11434  # Optional, has default
```

### Optional Settings

```bash
# Skip Anthropic smoke test (not recommended)
SKIP_ANTHROPIC_SMOKE_TEST=true
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure OAuth/API keys
3. ✅ Run tests
4. ✅ Make first call
5. 📖 Read [README.md](README.md) for full documentation
6. 🔧 Integrate into your applications

---

## Support

- GitHub Issues: [openclaw/openclaw](https://github.com/openclaw/openclaw)
- Discord: [discord.com/invite/clawd](https://discord.com/invite/clawd)
- Docs: [docs.openclaw.ai](https://docs.openclaw.ai)

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-01
