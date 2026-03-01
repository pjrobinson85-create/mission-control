#!/usr/bin/env node
/**
 * Test script for unified LLM router
 * Usage: node test.js
 */

const { runLlm } = require('./llm-router');
const { getStats, getRecentCalls } = require('./interaction-store');
const {
    isAnthropicModel,
    normalizeAnthropicModel,
    detectModelProvider,
} = require('./model-utils');

async function testModelUtils() {
    console.log('\n=== Testing Model Utilities ===\n');
    
    // Test provider detection
    const tests = [
        'claude-sonnet-4',
        'opus-4',
        'gpt-4',
        'ollama/llama3',
        'unknown-model',
    ];
    
    tests.forEach(model => {
        const provider = detectModelProvider(model);
        const isAnthropic = isAnthropicModel(model);
        const normalized = normalizeAnthropicModel(model);
        
        console.log(`Model: ${model}`);
        console.log(`  Provider: ${provider}`);
        console.log(`  Is Anthropic: ${isAnthropic}`);
        console.log(`  Normalized: ${normalized}`);
        console.log();
    });
}

async function testAnthropicCall() {
    console.log('\n=== Testing Anthropic Call ===\n');
    
    try {
        const result = await runLlm('Say "Hello from Anthropic" and nothing else.', {
            model: 'haiku',  // Cheapest model
            caller: 'test-script',
            timeoutMs: 20000,
        });
        
        console.log('✓ Anthropic call succeeded');
        console.log(`  Text: ${result.text}`);
        console.log(`  Duration: ${result.durationMs}ms`);
        console.log(`  Provider: ${result.provider}`);
    } catch (err) {
        console.error('✗ Anthropic call failed:', err.message);
    }
}

async function testOpenAICall() {
    console.log('\n=== Testing OpenAI Call ===\n');
    
    if (!process.env.OPENAI_API_KEY) {
        console.log('⊘ Skipped (OPENAI_API_KEY not set)');
        return;
    }
    
    try {
        const result = await runLlm('Say "Hello from OpenAI" and nothing else.', {
            model: 'gpt-3.5',
            caller: 'test-script',
            timeoutMs: 20000,
        });
        
        console.log('✓ OpenAI call succeeded');
        console.log(`  Text: ${result.text}`);
        console.log(`  Duration: ${result.durationMs}ms`);
        console.log(`  Provider: ${result.provider}`);
    } catch (err) {
        console.error('✗ OpenAI call failed:', err.message);
    }
}

async function testOllamaCall() {
    console.log('\n=== Testing Ollama Call ===\n');
    
    try {
        const result = await runLlm('Say "Hello from Ollama" and nothing else.', {
            model: 'ollama/llama3.2:3b',
            caller: 'test-script',
            timeoutMs: 20000,
        });
        
        console.log('✓ Ollama call succeeded');
        console.log(`  Text: ${result.text.substring(0, 100)}...`);
        console.log(`  Duration: ${result.durationMs}ms`);
        console.log(`  Provider: ${result.provider}`);
    } catch (err) {
        console.error('✗ Ollama call failed:', err.message);
        console.error('  (This is expected if Ollama is not running)');
    }
}

async function testStatistics() {
    console.log('\n=== Testing Statistics ===\n');
    
    try {
        const stats = await getStats();
        console.log('Database Statistics:');
        console.log(`  Total calls: ${stats.total_calls}`);
        console.log(`  Successful: ${stats.successful_calls}`);
        console.log(`  Failed: ${stats.failed_calls}`);
        console.log(`  Total cost: $${stats.total_cost?.toFixed(4) || '0.0000'}`);
        console.log(`  Avg duration: ${stats.avg_duration_ms?.toFixed(0) || '0'}ms`);
        
        console.log('\nRecent Calls:');
        const recent = await getRecentCalls(5);
        recent.forEach((call, i) => {
            const status = call.ok ? '✓' : '✗';
            console.log(`  ${i+1}. ${status} ${call.model} - ${call.duration_ms}ms - $${call.cost_estimate?.toFixed(4) || '0.0000'}`);
        });
    } catch (err) {
        console.error('✗ Statistics failed:', err.message);
    }
}

async function testErrorHandling() {
    console.log('\n=== Testing Error Handling ===\n');
    
    try {
        await runLlm('test', { model: 'invalid-model' });
        console.error('✗ Should have thrown error for invalid model');
    } catch (err) {
        console.log('✓ Correctly threw error for invalid model');
        console.log(`  Error: ${err.message}`);
    }
    
    try {
        await runLlm('', { model: 'haiku' });
        console.error('✗ Should have thrown error for empty prompt');
    } catch (err) {
        console.log('✓ Correctly threw error for empty prompt');
        console.log(`  Error: ${err.message}`);
    }
}

async function main() {
    console.log('╔═══════════════════════════════════════╗');
    console.log('║   Unified LLM Router - Test Suite    ║');
    console.log('╚═══════════════════════════════════════╝');
    
    await testModelUtils();
    await testAnthropicCall();
    await testOpenAICall();
    await testOllamaCall();
    await testErrorHandling();
    await testStatistics();
    
    console.log('\n=== Test Suite Complete ===\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
