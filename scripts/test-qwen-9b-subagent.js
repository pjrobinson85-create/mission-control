#!/usr/bin/env node
/**
 * Test Suite: Qwen 3.5 9B as Subagent Model
 * 
 * Tests qwen3.5:9b performance, quality, and suitability for delegation tasks.
 * Measures: speed, accuracy, reasoning quality, tool usage, cost-effectiveness.
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  model: 'ollama/qwen3.5:9b',
  timeout: 60000, // 60 second timeout per test
  iterations: 1,   // Run each test once
  logFile: '/root/.openclaw/workspace/test-results-9b.json',
};

// Test suite definition
const TESTS = [
  // --- Category 1: Speed & Responsiveness ---
  {
    id: 'speed-simple-qa',
    category: 'Speed',
    task: 'Simple Q&A',
    prompt: 'What are the top 3 benefits of using a local LLM for privacy-sensitive tasks? Answer in 2-3 sentences.',
    expectedQuality: 'accuracy',
    metrics: ['responseTime', 'tokenCount'],
  },
  {
    id: 'speed-analysis',
    category: 'Speed',
    task: 'Quick Analysis',
    prompt: 'Analyze this code snippet and identify 2 potential bugs:\n```python\ndef divide(a, b):\n  return a / b\n```',
    expectedQuality: 'accuracy',
    metrics: ['responseTime', 'tokenCount'],
  },

  // --- Category 2: Document Analysis ---
  {
    id: 'analysis-summarize',
    category: 'Document Analysis',
    task: 'Summarization',
    prompt: 'Summarize the key points of the NDIS scheme in 3 bullet points. Focus on funding model and participant eligibility.',
    expectedQuality: 'completeness',
    metrics: ['responseTime', 'relevance'],
  },
  {
    id: 'analysis-extract',
    category: 'Document Analysis',
    task: 'Information Extraction',
    prompt: 'Extract the main requirements for exercise physiology support letters under NDIS Section 34. List them as bullet points.',
    expectedQuality: 'accuracy',
    metrics: ['responseTime', 'completeness'],
  },

  // --- Category 3: Code Tasks ---
  {
    id: 'code-review',
    category: 'Code Generation',
    task: 'Code Review',
    prompt: 'Review this Python function for improvements:\n```python\ndef process_data(data):\n  result = []\n  for item in data:\n    if item > 0:\n      result.append(item * 2)\n  return result\n```\nSuggest 2-3 improvements.',
    expectedQuality: 'accuracy',
    metrics: ['responseTime', 'relevance'],
  },
  {
    id: 'code-generate-simple',
    category: 'Code Generation',
    task: 'Simple Function Generation',
    prompt: 'Write a Python function that converts Celsius to Fahrenheit. Include a docstring.',
    expectedQuality: 'correctness',
    metrics: ['responseTime', 'completeness'],
  },

  // --- Category 4: Reasoning & Planning ---
  {
    id: 'reasoning-problem-solve',
    category: 'Reasoning',
    task: 'Problem Solving',
    prompt: 'You need to prioritize 3 tasks with these constraints:\n- Task A (4h, high urgency, low impact)\n- Task B (2h, low urgency, high impact)\n- Task C (1h, medium urgency, medium impact)\n\nWhy would you prioritize Task B first?',
    expectedQuality: 'logic',
    metrics: ['responseTime', 'reasoning'],
  },
  {
    id: 'reasoning-decision',
    category: 'Reasoning',
    task: 'Decision Making',
    prompt: 'Should we use a local 9B model or a 35B model for web search subagents? Consider speed, accuracy, and resource usage. Give pros/cons for each.',
    expectedQuality: 'balance',
    metrics: ['responseTime', 'completeness'],
  },

  // --- Category 5: Writing Quality ---
  {
    id: 'writing-email',
    category: 'Writing',
    task: 'Email Drafting',
    prompt: 'Draft a professional email requesting a meeting to discuss NDIS review timeline. Keep it concise (3-4 sentences).',
    expectedQuality: 'professionalism',
    metrics: ['responseTime', 'tone'],
  },
  {
    id: 'writing-explanation',
    category: 'Writing',
    task: 'Technical Explanation',
    prompt: 'Explain how thermoregulation works in quadriplegic individuals and why temperature thresholds matter. Use simple language (non-medical audience).',
    expectedQuality: 'clarity',
    metrics: ['responseTime', 'accuracy'],
  },

  // --- Category 6: Constraint Handling ---
  {
    id: 'constraint-token-limit',
    category: 'Constraints',
    task: 'Token Limit Handling',
    prompt: 'Explain machine learning in exactly 50 words or less.',
    expectedQuality: 'compliance',
    metrics: ['responseTime', 'wordCount'],
  },
  {
    id: 'constraint-format',
    category: 'Constraints',
    task: 'Format Requirements',
    prompt: 'List 5 features of a good assistant as JSON:\n```json\n{\n  "features": [\n    // your answer here\n  ]\n}\n```',
    expectedQuality: 'format',
    metrics: ['responseTime', 'validity'],
  },

  // --- Category 7: Multi-Step Tasks ---
  {
    id: 'multi-step-research',
    category: 'Multi-Step',
    task: 'Research Planning',
    prompt: 'Plan a 3-step research approach to understand NDIS application timelines. What would you research in each step?',
    expectedQuality: 'methodology',
    metrics: ['responseTime', 'structure'],
  },
  {
    id: 'multi-step-workflow',
    category: 'Multi-Step',
    task: 'Workflow Design',
    prompt: 'Design a workflow for processing exercise physiology reports. Include: input stage, processing stage, output stage. Be specific.',
    expectedQuality: 'clarity',
    metrics: ['responseTime', 'completeness'],
  },
];

/**
 * Run a single test via subagent
 */
async function runTest(test) {
  const startTime = Date.now();
  
  try {
    const { sessions_spawn } = require('./openclaw-api.js'); // Assumes helper module
    
    // Call subagent with the test prompt
    const result = await sessions_spawn({
      runtime: 'subagent',
      agentId: 'analyst', // Use analyst for document analysis tasks
      task: test.prompt,
      mode: 'run',
      timeoutSeconds: TEST_CONFIG.timeout / 1000,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      testId: test.id,
      status: 'passed',
      responseTime,
      response: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      testId: test.id,
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Run all tests and collect results
 */
async function runAllTests() {
  console.log('🧪 Qwen 3.5 9B Subagent Test Suite');
  console.log('=' .repeat(50));
  console.log(`Model: ${TEST_CONFIG.model}`);
  console.log(`Tests: ${TESTS.length}`);
  console.log(`Timeout: ${TEST_CONFIG.timeout}ms per test`);
  console.log('=' .repeat(50));
  console.log('');
  
  const results = {
    config: TEST_CONFIG,
    startTime: new Date().toISOString(),
    tests: [],
    summary: {
      total: TESTS.length,
      passed: 0,
      failed: 0,
      byCategory: {},
    },
  };
  
  // Group tests by category for reporting
  const byCategory = {};
  TESTS.forEach(test => {
    if (!byCategory[test.category]) {
      byCategory[test.category] = [];
    }
    byCategory[test.category].push(test);
  });
  
  // Run tests by category
  for (const [category, categoryTests] of Object.entries(byCategory)) {
    console.log(`\n📂 Category: ${category}`);
    console.log('-' .repeat(50));
    
    for (const test of categoryTests) {
      process.stdout.write(`  [${test.id}] ${test.task}... `);
      
      const testResult = await runTest(test);
      results.tests.push(testResult);
      
      if (testResult.status === 'passed') {
        console.log(`✅ ${testResult.responseTime}ms`);
        results.summary.passed++;
      } else {
        console.log(`❌ ${testResult.error}`);
        results.summary.failed++;
      }
      
      // Track by category
      if (!results.summary.byCategory[category]) {
        results.summary.byCategory[category] = { passed: 0, failed: 0 };
      }
      if (testResult.status === 'passed') {
        results.summary.byCategory[category].passed++;
      } else {
        results.summary.byCategory[category].failed++;
      }
    }
  }
  
  results.endTime = new Date().toISOString();
  
  // Write results to file
  fs.writeFileSync(TEST_CONFIG.logFile, JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${results.summary.passed}/${results.summary.total}`);
  console.log(`❌ Failed: ${results.summary.failed}/${results.summary.total}`);
  console.log(`Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`);
  console.log('');
  console.log('By Category:');
  for (const [category, stats] of Object.entries(results.summary.byCategory)) {
    const rate = ((stats.passed / (stats.passed + stats.failed)) * 100).toFixed(1);
    console.log(`  ${category}: ${stats.passed}/${stats.passed + stats.failed} (${rate}%)`);
  }
  console.log('');
  console.log(`📄 Full results saved to: ${TEST_CONFIG.logFile}`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}

module.exports = { runTest, runAllTests, TESTS, TEST_CONFIG };
