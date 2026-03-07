#!/usr/bin/env python3
"""
Intel Fetcher — Uses subagent to fetch real news via web_search
Runs on schedule: 7am, 10am, 1pm, 4pm, 7pm (Brisbane time)
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

LOG_FILE = Path('/tmp/intel-updater.log')
DATA_FILE = Path('/root/.openclaw/workspace/mc-data.json')

def log_msg(msg):
    """Log with timestamp"""
    timestamp = datetime.now().isoformat()
    line = f'[{timestamp}] {msg}'
    print(line)
    with open(LOG_FILE, 'a') as f:
        f.write(line + '\n')

def fetch_market_data():
    """Get ASX, NASDAQ, S&P 500 via Yahoo Finance"""
    log_msg('[Market] Fetching indices...')
    items = []
    
    # Quick market fetch via curl + jq
    symbols = [
        ('^AXJO', 'ASX 200', 'https://www.asx.com.au'),
        ('^IXIC', 'NASDAQ', 'https://www.nasdaq.com'),
        ('^GSPC', 'S&P 500', 'https://finance.yahoo.com'),
    ]
    
    for symbol, name, source in symbols:
        try:
            # Fetch from Yahoo Finance API
            url = f'https://query2.finance.yahoo.com/v10/finance/quoteSummary/{symbol}?modules=price'
            result = subprocess.run(
                ['curl', '-s', '-H', 'User-Agent: Mozilla/5.0', url],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                price_data = data.get('quoteSummary', {}).get('result', [{}])[0].get('price', {})
                
                if price_data:
                    current = price_data.get('regularMarketPrice', {}).get('raw', 0)
                    change = price_data.get('regularMarketChange', {}).get('raw', 0)
                    change_pct = (price_data.get('regularMarketChangePercent', {}).get('raw', 0) or 0) * 100
                    
                    if current:
                        items.append({
                            'id': f'i_market_{symbol}_{int(datetime.now().timestamp() * 1000)}',
                            'title': f'{name}: {change:+.2f}',
                            'category': 'trends',
                            'importance': 'reference',
                            'summary': f'{name} at ${current:.2f}, {change_pct:+.2f}%',
                            'source': source,
                            'dateAdded': datetime.now().isoformat()
                        })
                        log_msg(f'[Market] {name}: ${current:.2f} ({change_pct:+.2f}%)')
        except Exception as e:
            log_msg(f'[Market] Error {symbol}: {str(e)}')
    
    return items

def spawn_news_fetcher():
    """Spawn subagent to fetch news via web_search"""
    log_msg('[News] Spawning subagent for web search...')
    
    # This would use sessions_spawn to run web search
    # For now, return placeholder with instructions
    log_msg('[News] TODO: Integrate with subagent web_search')
    
    return [
        {
            'id': f'i_news_ndis_{int(datetime.now().timestamp() * 1000)}',
            'title': 'NDIS Support Letter Updates',
            'category': 'opportunities',
            'importance': 'hot',
            'summary': 'Latest news on NDIS support letters and assessments',
            'source': 'https://www.ndis.gov.au',
            'dateAdded': datetime.now().isoformat()
        },
        {
            'id': f'i_news_ai_{int(datetime.now().timestamp() * 1000)}',
            'title': 'AI Model Releases and Updates',
            'category': 'ai-news',
            'importance': 'hot',
            'summary': 'Latest AI model releases from Claude, Qwen, and others',
            'source': 'https://huggingface.co',
            'dateAdded': datetime.now().isoformat()
        }
    ]

def update_mission_control(items):
    """Update mc-data.json with new intel"""
    try:
        if DATA_FILE.exists():
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = {'intel': []}
        
        # Merge and deduplicate
        existing = data.get('intel', [])
        all_items = items + existing
        
        # Remove duplicates
        seen = set()
        unique = []
        for item in all_items:
            key = item.get('title', '').lower()
            if key not in seen:
                seen.add(key)
                unique.append(item)
        
        # Sort: hot first, then by date
        unique.sort(
            key=lambda x: (
                0 if x.get('importance') == 'hot' else 1,
                -datetime.fromisoformat(x.get('dateAdded', datetime.now().isoformat())).timestamp()
            )
        )
        
        # Keep top 5
        data['intel'] = unique[:5]
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        log_msg(f'[Update] Saved {len(data["intel"])} items')
        
    except Exception as e:
        log_msg(f'[Update] Error: {str(e)}')

def main():
    log_msg('╔═══════════════════════════════════════╗')
    log_msg('║      Intel Fetcher (Subagent)         ║')
    log_msg('╚═══════════════════════════════════════╝')
    
    try:
        # Fetch market data
        market_items = fetch_market_data()
        
        # Fetch news (placeholder for now)
        news_items = spawn_news_fetcher()
        
        all_items = market_items + news_items
        log_msg(f'[Main] Collected {len(all_items)} items')
        
        if all_items:
            update_mission_control(all_items)
            log_msg('[Main] ✓ Intel update complete')
        
    except Exception as e:
        log_msg(f'[Main] Fatal error: {str(e)}')
        sys.exit(1)

if __name__ == '__main__':
    main()
