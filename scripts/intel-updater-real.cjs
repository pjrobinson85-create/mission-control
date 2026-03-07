#!/usr/bin/env node
/**
 * Intel Updater (Real News) — Fetches actual news via web search
 * Runs at: 7am, 10am, 1pm, 4pm, 7pm (Brisbane time)
 * 
 * Uses: Brave Search API via OpenClaw web_search capability
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');

const DATA_FILE = path.join(__dirname, 'mc-data.json');
const LOG_FILE = '/tmp/intel-updater.log';

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

/**
 * Call OpenClaw web_search via python subprocess
 * This uses the web_search tool available in the gateway
 */
async function webSearch(query, count = 3) {
    return new Promise((resolve) => {
        log(`[Search] Query: "${query}"`);
        
        // Use Python to call web_search via gateway
        // This is a fallback approach; ideally integrate directly with gateway API
        const python = spawn('python3', ['-c', `
import subprocess
import json
import sys

query = ${JSON.stringify(query)}
result = subprocess.run([
    'openclaw', 'web-search',
    '--query', query,
    '--count', '${count}',
    '--json'
], capture_output=True, text=True)

if result.returncode == 0:
    try:
        data = json.loads(result.stdout)
        print(json.dumps(data))
    except:
        print(json.dumps([]))
else:
    print(json.dumps([]))
`]);
        
        let output = '';
        python.stdout.on('data', (data) => output += data);
        python.stderr.on('data', (data) => log(`[Python Error] ${data}`));
        
        python.on('close', (code) => {
            try {
                const results = JSON.parse(output);
                resolve(results || []);
            } catch (err) {
                log(`[Search Parse Error] ${err.message}`);
                resolve([]);
            }
        });
        
        python.on('error', (err) => {
            log(`[Search Error] ${err.message}`);
            resolve([]);
        });
    });
}

/**
 * Fetch market data from Yahoo Finance
 */
async function fetchMarketData() {
    log('[Market] Fetching ASX, NASDAQ, S&P 500...');
    const items = [];
    
    const symbols = [
        { symbol: '^AXJO', name: 'ASX 200', source: 'https://www.asx.com.au' },
        { symbol: '^IXIC', name: 'NASDAQ', source: 'https://www.nasdaq.com' },
        { symbol: '^GSPC', name: 'S&P 500', source: 'https://finance.yahoo.com' }
    ];
    
    for (const s of symbols) {
        try {
            const quote = await getYahooQuote(s.symbol);
            if (quote) {
                items.push({
                    id: `i_market_${s.symbol}_${Date.now()}`,
                    title: `${s.name}: ${quote.change > 0 ? '+' : ''}${quote.change.toFixed(2)}`,
                    category: 'trends',
                    importance: 'reference',
                    summary: `${s.name} at $${quote.price.toFixed(2)}, ${quote.changePercent > 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`,
                    source: s.source,
                    dateAdded: new Date().toISOString()
                });
                log(`[Market] ${s.name}: $${quote.price.toFixed(2)} (${quote.changePercent > 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%)`);
            }
        } catch (err) {
            log(`[Market] Error: ${err.message}`);
        }
    }
    
    return items;
}

/**
 * Yahoo Finance API
 */
function getYahooQuote(symbol) {
    return new Promise((resolve) => {
        const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`;
        
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const price = json.quoteSummary?.result?.[0]?.price;
                    if (price) {
                        resolve({
                            price: price.regularMarketPrice?.raw || 0,
                            change: price.regularMarketChange?.raw || 0,
                            changePercent: (price.regularMarketChangePercent?.raw || 0) * 100
                        });
                    } else {
                        resolve(null);
                    }
                } catch (err) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
        
        setTimeout(() => resolve(null), 5000);
    });
}

/**
 * Fetch NDIS news
 */
async function fetchNDISNews() {
    log('[NDIS] Searching for NDIS support letter news...');
    const results = await webSearch('NDIS support letters disability assessment 2026', 2);
    
    if (results && results.length > 0) {
        return {
            id: `i_ndis_${Date.now()}`,
            title: results[0].title || 'NDIS Update',
            category: 'opportunities',
            importance: 'hot',
            summary: results[0].description || results[0].snippet || 'NDIS news',
            source: results[0].url || '',
            dateAdded: new Date().toISOString()
        };
    }
    return null;
}

/**
 * Fetch AI model news
 */
async function fetchAINews() {
    log('[AI] Searching for AI model releases...');
    const results = await webSearch('Claude Qwen OpenAI Llama AI model release 2026', 2);
    
    if (results && results.length > 0) {
        return {
            id: `i_ai_${Date.now()}`,
            title: results[0].title || 'AI Model Update',
            category: 'ai-news',
            importance: 'hot',
            summary: results[0].description || results[0].snippet || 'AI news',
            source: results[0].url || '',
            dateAdded: new Date().toISOString()
        };
    }
    return null;
}

/**
 * Fetch exercise physiology / disability support news
 */
async function fetchIndustryNews() {
    log('[Industry] Searching for exercise physiology news...');
    const results = await webSearch('exercise physiology disability support NDIS Australia', 2);
    
    if (results && results.length > 0) {
        return {
            id: `i_industry_${Date.now()}`,
            title: results[0].title || 'Industry Update',
            category: 'trends',
            importance: 'notable',
            summary: results[0].description || results[0].snippet || 'Industry news',
            source: results[0].url || '',
            dateAdded: new Date().toISOString()
        };
    }
    return null;
}

/**
 * Fetch remote testing / accessibility tools
 */
async function fetchToolsNews() {
    log('[Tools] Searching for remote testing tools...');
    const results = await webSearch('remote user testing accessibility tools disability', 2);
    
    if (results && results.length > 0) {
        return {
            id: `i_tools_${Date.now()}`,
            title: results[0].title || 'Tools Update',
            category: 'ai-news',
            importance: 'notable',
            summary: results[0].description || results[0].snippet || 'Tools news',
            source: results[0].url || '',
            dateAdded: new Date().toISOString()
        };
    }
    return null;
}

/**
 * Deduplicate and sort
 */
function processIntel(items) {
    const filtered = items.filter(Boolean); // Remove nulls
    const seen = new Set();
    
    const unique = filtered.filter(item => {
        const key = item.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    
    // Sort: hot first, then by date
    return unique.sort((a, b) => {
        if (a.importance === 'hot' && b.importance !== 'hot') return -1;
        if (a.importance !== 'hot' && b.importance === 'hot') return 1;
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }).slice(0, 5); // Top 5
}

/**
 * Update mission control
 */
async function updateMissionControl(items) {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        // Merge: new items on top
        const merged = [...items, ...(data.intel || [])];
        data.intel = processIntel(merged);
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        log(`[Update] Saved ${data.intel.length} items to dashboard`);
        
    } catch (err) {
        log(`[Update] Error: ${err.message}`);
    }
}

/**
 * Main
 */
async function main() {
    log('╔═══════════════════════════════════════╗');
    log('║      Intel Updater (Real News)        ║');
    log('╚═══════════════════════════════════════╝');
    
    try {
        // Fetch in parallel
        const [market, ndis, ai, industry, tools] = await Promise.allSettled([
            fetchMarketData(),
            fetchNDISNews(),
            fetchAINews(),
            fetchIndustryNews(),
            fetchToolsNews()
        ]);
        
        const items = [];
        if (market.status === 'fulfilled') items.push(...market.value);
        if (ndis.status === 'fulfilled' && ndis.value) items.push(ndis.value);
        if (ai.status === 'fulfilled' && ai.value) items.push(ai.value);
        if (industry.status === 'fulfilled' && industry.value) items.push(industry.value);
        if (tools.status === 'fulfilled' && tools.value) items.push(tools.value);
        
        log(`[Main] Collected ${items.length} items`);
        
        if (items.length > 0) {
            await updateMissionControl(items);
            log('[Main] ✓ Intel update complete');
        } else {
            log('[Main] ⚠ No items collected');
        }
        
        process.exit(0);
        
    } catch (err) {
        log(`[Main] Fatal error: ${err.message}`);
        process.exit(1);
    }
}

// Timeout after 30 seconds
setTimeout(() => {
    log('[Main] Timeout - exiting');
    process.exit(0);
}, 30000);

main();
