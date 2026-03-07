"""
SearXNG Client for OpenClaw Scout Agent
Provides metasearch via local SearXNG instance
Uses HTML scraping due to JSON API bot detection
"""

import requests
from urllib.parse import urlencode
from html.parser import HTMLParser

class SearXNGHTMLParser(HTMLParser):
    """Parse SearXNG HTML results"""
    
    def __init__(self):
        super().__init__()
        self.results = []
        self.current_result = {}
        self.in_result = False
        self.in_title = False
        self.in_url = False
        self.in_snippet = False
    
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'article':
            self.in_result = True
            self.current_result = {}
        elif tag == 'h3' and self.in_result:
            self.in_title = True
        elif tag == 'a' and 'href' in attrs_dict and self.in_result:
            self.current_result['url'] = attrs_dict['href']
            self.in_url = True
        elif tag == 'p' and 'class' in attrs_dict and 'excerpt' in attrs_dict['class'] and self.in_result:
            self.in_snippet = True
    
    def handle_data(self, data):
        if self.in_title:
            self.current_result['title'] = data.strip()
        elif self.in_snippet:
            self.current_result['snippet'] = data.strip()
    
    def handle_endtag(self, tag):
        if tag == 'article' and self.in_result:
            if 'title' in self.current_result and 'url' in self.current_result:
                self.results.append(self.current_result)
            self.in_result = False
            self.current_result = {}
        elif tag == 'h3':
            self.in_title = False
        elif tag == 'a':
            self.in_url = False
        elif tag == 'p':
            self.in_snippet = False

class SearXNGClient:
    """Local SearXNG metasearch client"""
    
    def __init__(self, base_url="http://localhost:8888"):
        self.base_url = base_url
        self.timeout = 30
    
    def search(self, query, num_results=5, language='en'):
        """Search using local SearXNG (HTML parsing)"""
        try:
            params = {
                'q': query,
                'language': language,
            }
            
            url = f"{self.base_url}/search?{urlencode(params)}"
            
            # Standard browser headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) OpenClaw-Scout/1.0'
            }
            
            response = requests.get(url, headers=headers, timeout=self.timeout)
            response.raise_for_status()
            
            # Parse HTML
            parser = SearXNGHTMLParser()
            parser.feed(response.text)
            
            results = []
            for result in parser.results[:num_results]:
                results.append({
                    'title': result.get('title', 'Untitled'),
                    'url': result.get('url', ''),
                    'snippet': result.get('snippet', ''),
                    'source': 'searxng'
                })
            
            return {
                'status': 'success',
                'query': query,
                'results': results,
                'count': len(results)
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'query': query,
                'results': [],
                'count': 0
            }
    
    def health_check(self):
        """Check if SearXNG is running"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            return response.status_code == 200
        except:
            return False

if __name__ == '__main__':
    client = SearXNGClient()
    if client.health_check():
        print("✅ SearXNG is running")
        results = client.search("openai", num_results=3)
        print(f"Query: {results['query']}")
        print(f"Found: {results['count']} results\n")
        for i, r in enumerate(results['results'], 1):
            print(f"{i}. {r['title']}")
            print(f"   {r['snippet'][:80]}...\n")
    else:
        print("❌ SearXNG not responding")
