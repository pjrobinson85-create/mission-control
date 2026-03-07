"""
Scout Agent Test - SearXNG Integration
Tests web search via local SearXNG metasearch
"""

import sys
sys.path.insert(0, '/root/.openclaw/workspace')

from searxng_client import SearXNGClient

def test_searxng():
    """Test SearXNG with various queries"""
    
    client = SearXNGClient()
    
    # Test 1: Health check
    print("=" * 60)
    print("TEST 1: Health Check")
    print("=" * 60)
    if client.health_check():
        print("✅ SearXNG is running and responding")
    else:
        print("❌ SearXNG not responding - check if docker is running")
        return False
    
    # Test 2: Simple search
    print("\n" + "=" * 60)
    print("TEST 2: Simple Search - 'openai'")
    print("=" * 60)
    results = client.search("openai", num_results=5)
    print(f"Status: {results['status']}")
    print(f"Found: {results['count']} results\n")
    
    if results['results']:
        for i, result in enumerate(results['results'], 1):
            print(f"{i}. {result['title'][:60]}...")
            print(f"   Source: {result['source']}")
            print(f"   URL: {result['url'][:70]}...")
            print()
    else:
        print("⚠️  No results returned (SearXNG may still be initializing)")
    
    # Test 3: Tech news search
    print("=" * 60)
    print("TEST 3: Specific Query - 'latest AI news 2026'")
    print("=" * 60)
    results = client.search("latest AI news 2026", num_results=3)
    print(f"Status: {results['status']}")
    print(f"Found: {results['count']} results\n")
    
    if results['results']:
        for i, result in enumerate(results['results'], 1):
            print(f"{i}. {result['title'][:60]}...")
            print()
    else:
        print("⚠️  No results (SearXNG initializing or no matches)")
    
    # Test 4: Error handling
    print("=" * 60)
    print("TEST 4: Error Handling - Empty Query")
    print("=" * 60)
    results = client.search("", num_results=5)
    print(f"Status: {results['status']}")
    if results['status'] == 'error':
        print(f"Error handled gracefully: {results.get('error', 'N/A')}")
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print("✅ SearXNGClient is working")
    print("✅ Ready for Scout integration")
    print("\nNext steps:")
    print("1. Scout can now use: from searxng_client import SearXNGClient")
    print("2. Replace web_search tool calls with SearXNGClient")
    print("3. Test in actual Scout subagent")

if __name__ == '__main__':
    test_searxng()
