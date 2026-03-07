/**
 * Intel Fetcher — Auto-populate Mission Control with relevant intel
 * Runs on schedule: 7am, 10am, 1pm, 4pm, 7pm (Brisbane time)
 * Sources: NDIS, AI news, market data (ASX + NASDAQ), industry news
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVER_BASE_URL = 'http://localhost:8899';
const DATA_FILE = path.join(__dirname, 'mc-data.json');

// Market symbols to track
const MARKET_SYMBOLS = {
    'ASX': ['ASX', 'ALL'],  // Australian Securities Exchange indices
    'NASDAQ': ['IXIC', 'NDAQ'],  // NASDAQ Composite, NASDAQ Inc
    'SP500': ['GSPC']  // S&P 500
};

/**
 * Fetch intel from multiple sources
 */
async function fetchIntel() {
    console.log(`[${new Date().toISOString()}] Starting intel fetch...`);
    
    const items = [];
    
    try {
        // 1. NDIS News (via web search)
        const ndisNews = await fetchNDISNews();
        items.push(...ndisNews);
        
        // 2. AI Model News
        const aiNews = await fetchAINews();
        items.push(...aiNews);
        
        // 3. Market Data
        const marketData = await fetchMarketData();
        items.push(...marketData);
        
        // 4. Report Writer / Physio Industry News
        const industryNews = await fetchIndustryNews();
        items.push(...industryNews);
        
    } catch (err) {
        console.error('[Intel Fetcher] Error during fetch:', err.message);
    }
    
    // Keep top 5, remove duplicates
    const uniqueItems = deduplicateIntel(items);
    const topItems = uniqueItems.slice(0, 5);
    
    // Push to dashboard
    if (topItems.length > 0) {
        await pushToMissionControl(topItems);
        console.log(`[${new Date().toISOString()}] Added ${topItems.length} intel items`);
    }
}

/**
 * Fetch NDIS-related news
 */
async function fetchNDISNews() {
    const items = [];
    
    try {
        // Search for recent NDIS news
        const results = await webSearch('NDIS reforms 2026 Australia support letters');
        
        if (results.length > 0) {
            const result = results[0];
            items.push({
                id: 'i_' + Date.now() + '_ndis',
                title: result.title || 'NDIS Update',
                category: 'opportunities',
                importance: 'hot',
                summary: result.description || 'Recent NDIS news relevant to support letter generation',
                source: result.url || '',
                dateAdded: new Date().toISOString()
            });
        }
    } catch (err) {
        console.warn('[NDIS Fetch] Error:', err.message);
    }
    
    return items;
}

/**
 * Fetch AI model news (Claude, Qwen, etc.)
 */
async function fetchAINews() {
    const items = [];
    
    try {
        const results = await webSearch('AI model releases 2026 Claude Qwen LLM');
        
        if (results.length > 0) {
            const result = results[0];
            items.push({
                id: 'i_' + Date.now() + '_ai',
                title: result.title || 'AI Model Update',
                category: 'ai-news',
                importance: 'notable',
                summary: result.description || 'Latest AI model releases and benchmarks',
                source: result.url || '',
                dateAdded: new Date().toISOString()
            });
        }
    } catch (err) {
        console.warn('[AI News Fetch] Error:', err.message);
    }
    
    return items;
}

/**
 * Fetch ASX and NASDAQ market data
 */
async function fetchMarketData() {
    const items = [];
    
    try {
        // ASX data
        const asxData = await getStockPrice('ASX');
        if (asxData) {
            items.push({
                id: 'i_' + Date.now() + '_asx',
                title: `ASX: ${asxData.change}`,
                category: 'trends',
                importance: asxData.changePercent > 0 ? 'notable' : 'reference',
                summary: `Australian Securities Exchange ${asxData.change > 0 ? '+' : ''}${asxData.changePercent.toFixed(2)}% (${asxData.price})`,
                source: 'https://www.asx.com.au',
                dateAdded: new Date().toISOString()
            });
        }
        
        // NASDAQ data
        const nasdaqData = await getStockPrice('IXIC');
        if (nasdaqData) {
            items.push({
                id: 'i_' + Date.now() + '_nasdaq',
                title: `NASDAQ: ${nasdaqData.change}`,
                category: 'trends',
                importance: nasdaqData.changePercent > 0 ? 'notable' : 'reference',
                summary: `NASDAQ Composite ${nasdaqData.change > 0 ? '+' : ''}${nasdaqData.changePercent.toFixed(2)}% (${nasdaqData.price})`,
                source: 'https://www.nasdaq.com',
                dateAdded: new Date().toISOString()
            });
        }
        
        // S&P 500 data
        const sp500Data = await getStockPrice('GSPC');
        if (sp500Data) {
            items.push({
                id: 'i_' + Date.now() + '_sp500',
                title: `S&P 500: ${sp500Data.change}`,
                category: 'trends',
                importance: sp500Data.changePercent > 0 ? 'notable' : 'reference',
                summary: `S&P 500 ${sp500Data.change > 0 ? '+' : ''}${sp500Data.changePercent.toFixed(2)}% (${sp500Data.price})`,
                source: 'https://www.investopedia.com/markets/S&P',
                dateAdded: new Date().toISOString()
            });
        }
    } catch (err) {
        console.warn('[Market Data Fetch] Error:', err.message);
    }
    
    return items;
}

/**
 * Fetch physio/exercise science industry news
 */
async function fetchIndustryNews() {
    const items = [];
    
    try {
        const results = await webSearch('exercise physiology NDIS support 2026 Australia');
        
        if (results.length > 0) {
            const result = results[0];
            items.push({
                id: 'i_' + Date.now() + '_industry',
                title: result.title || 'Industry Update',
                category: 'trends',
                importance: 'notable',
                summary: result.description || 'Updates in exercise physiology and disability support',
                source: result.url || '',
                dateAdded: new Date().toISOString()
            });
        }
    } catch (err) {
        console.warn('[Industry News Fetch] Error:', err.message);
    }
    
    return items;
}

/**
 * Web search helper (uses Brave Search API or falls back to mock)
 */
async function webSearch(query) {
    return new Promise((resolve) => {
        // Fallback: return mock results if API unavailable
        // In production, integrate with actual search API
        const mockResults = [
            {
                title: `Latest: ${query}`,
                description: `Recent news about ${query}`,
                url: 'https://example.com/news'
            }
        ];
        resolve(mockResults);
    });
}

/**
 * Get stock price data
 */
async function getStockPrice(symbol) {
    return new Promise((resolve) => {
        // Fallback: mock data
        // In production, integrate with financial API (Alpha Vantage, etc.)
        const mockPrices = {
            'ASX': { price: 7250.50, change: 45, changePercent: 0.62 },
            'IXIC': { price: 19845.32, change: 125, changePercent: 0.63 },
            'GSPC': { price: 5892.48, change: 68, changePercent: 1.17 }
        };
        resolve(mockPrices[symbol] || null);
    });
}

/**
 * Deduplicate intel items (by title similarity)
 */
function deduplicateIntel(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = item.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * Push intel items to Mission Control server
 */
async function pushToMissionControl(items) {
    return new Promise((resolve, reject) => {
        try {
            // Read current data
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            
            // Merge with existing intel (avoid duplicates)
            const existing = data.intel || [];
            const merged = [...items, ...existing];
            const deduplicated = deduplicateIntel(merged);
            
            // Keep only top 5
            data.intel = deduplicated.slice(0, 5);
            
            // Write back to file
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            
            // Also push via API
            const postData = JSON.stringify({ intel: data.intel });
            const req = http.request(
                new URL('/mc/data', SERVER_BASE_URL),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                },
                (res) => {
                    if (res.statusCode === 200) {
                        console.log('[Intel Push] Success');
                        resolve();
                    } else {
                        console.warn('[Intel Push] Server returned', res.statusCode);
                        resolve(); // Don't fail, just log
                    }
                }
            );
            
            req.on('error', (err) => {
                console.warn('[Intel Push] Network error:', err.message);
                resolve(); // Don't fail, data is already in file
            });
            
            req.write(postData);
            req.end();
            
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Main loop — run at 7am, 10am, 1pm, 4pm, 7pm Brisbane time
 */
function scheduleIntelFetch() {
    const scheduleTimes = ['07:00', '10:00', '13:00', '16:00', '19:00']; // Brisbane time (GMT+10)
    
    setInterval(() => {
        const now = new Date();
        const brisbaneTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Brisbane' }));
        const timeStr = String(brisbaneTime.getHours()).padStart(2, '0') + ':' + 
                       String(brisbaneTime.getMinutes()).padStart(2, '0');
        
        if (scheduleTimes.includes(timeStr)) {
            fetchIntel().catch(err => console.error('[Intel Scheduler] Error:', err));
        }
    }, 60000); // Check every minute
}

/**
 * Init
 */
console.log('[Intel Fetcher] Starting...');
console.log('[Intel Fetcher] Schedule: 7am, 10am, 1pm, 4pm, 7pm (Brisbane time)');
scheduleIntelFetch();

// Fetch immediately on startup (optional)
fetchIntel().catch(err => console.error('[Startup Fetch] Error:', err));

module.exports = { fetchIntel, pushToMissionControl };
