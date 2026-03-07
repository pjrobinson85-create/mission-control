"""
SearXNG-like wrapper using Brave Search
Provides a simpler metasearch interface compatible with SearXNG patterns
"""

import json
from pathlib import Path

class SearXNG:
    """Local SearXNG-compatible search interface using Brave Search"""
    
    def __init__(self):
        self.name = "SearXNG (via Brave)"
        self.version = "1.0"
        self.enabled_engines = [
            'google', 'duckduckgo', 'bing', 'wikipedia', 'github'
        ]
    
    def search(self, query, categories=None, lang='en', page=1, safesearch=0):
        """
        Search using Brave Search API (configured in OpenClaw)
        Returns results in SearXNG-like format
        """
        from openclaw import search  # Will use the web_search tool
        
        try:
            # Use OpenClaw's configured web_search
            results = search(query)
            
            # Convert to SearXNG format
            formatted = {
                'query': query,
                'number_of_results': len(results),
                'results': []
            }
            
            for i, result in enumerate(results):
                formatted['results'].append({
                    'title': result.get('title', ''),
                    'url': result.get('url', ''),
                    'content': result.get('snippet', ''),
                    'engine': 'brave',
                    'score': 1.0 - (i * 0.1)  # Higher score for first results
                })
            
            return formatted
        except Exception as e:
            return {
                'error': str(e),
                'query': query,
                'results': []
            }
    
    def instance_config(self):
        """Return instance configuration"""
        return {
            'name': self.name,
            'version': self.version,
            'enabled_engines': self.enabled_engines,
            'preferences': {
                'autocomplete': 'google',
                'image_proxy': False,
                'cookie': False
            }
        }

# Alias for compatibility
searxng = SearXNG()

if __name__ == '__main__':
    # Test
    results = searxng.search('openai latest news')
    print(json.dumps(results, indent=2))
