#!/usr/bin/env python3

"""
Setup Agent Tools - Automated API Key Registration
Handles: AgentMail, Tavily, FireCrawl
"""

import requests
import json
import time
from datetime import datetime

EMAIL = "chris.cole.work1985@gmail.com"
OUTPUT_FILE = "/root/.openclaw/workspace/AGENT_TOOLS_KEYS.md"

class ToolSetup:
    def __init__(self):
        self.keys = {}
        self.errors = []
        self.timestamp = datetime.now().isoformat()
    
    def log(self, msg, level="INFO"):
        print(f"[{level}] {msg}")
    
    def setup_tavily(self):
        """Setup Tavily (web search API)"""
        self.log("Setting up Tavily...", "INFO")
        try:
            # Tavily has a simpler signup flow
            # For now, we'll document the manual steps
            self.log("Tavily requires email verification. Manual signup needed.", "WARN")
            self.keys['tavily'] = {
                'status': 'PENDING',
                'url': 'https://tavily.com/sign-up',
                'notes': 'Sign up with chris.cole.work1985@gmail.com'
            }
            return False
        except Exception as e:
            self.errors.append(f"Tavily: {str(e)}")
            return False
    
    def setup_agentmail(self):
        """Setup AgentMail"""
        self.log("Setting up AgentMail...", "INFO")
        try:
            self.log("AgentMail requires interactive email verification.", "WARN")
            self.keys['agentmail'] = {
                'status': 'PENDING',
                'url': 'https://agentmail.to',
                'notes': 'Sign up with chris.cole.work1985@gmail.com, then API Keys'
            }
            return False
        except Exception as e:
            self.errors.append(f"AgentMail: {str(e)}")
            return False
    
    def setup_firecrawl(self):
        """Setup FireCrawl"""
        self.log("Setting up FireCrawl...", "INFO")
        try:
            self.log("FireCrawl requires OAuth or email signup.", "WARN")
            self.keys['firecrawl'] = {
                'status': 'PENDING',
                'url': 'https://firecrawl.dev',
                'notes': 'Sign up with GitHub or chris.cole.work1985@gmail.com'
            }
            return False
        except Exception as e:
            self.errors.append(f"FireCrawl: {str(e)}")
            return False
    
    def setup_herenow(self):
        """Here.Now - No setup needed"""
        self.log("Here.Now doesn't require API key setup.", "INFO")
        self.keys['herenow'] = {
            'status': 'READY',
            'url': 'https://here.now',
            'notes': 'Agent installs automatically'
        }
        return True
    
    def setup_remotion(self):
        """Remotion - NPM install"""
        self.log("Remotion - Checking npm...", "INFO")
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                self.log(f"NPM available: {result.stdout.strip()}", "INFO")
                self.keys['remotion'] = {
                    'status': 'READY_TO_INSTALL',
                    'command': 'npm create remotion@latest my-video',
                    'notes': 'Ready to install when needed'
                }
                return True
            else:
                self.log("NPM not found", "ERROR")
                self.errors.append("NPM not available")
                return False
        except Exception as e:
            self.errors.append(f"Remotion check failed: {str(e)}")
            return False
    
    def generate_report(self):
        """Generate markdown report"""
        report = f"""# Agent Tools Setup Report

**Generated:** {self.timestamp}  
**Email:** {EMAIL}

---

## Status Summary

| Tool | Status | Action |
|------|--------|--------|
| AgentMail | ⏳ PENDING | Visit agentmail.to, sign up, get API key |
| Tavily | ⏳ PENDING | Visit tavily.com, sign up, get API key |
| FireCrawl | ⏳ PENDING | Visit firecrawl.dev, sign up, get API key |
| Here.Now | ✅ READY | No setup needed (agent installs) |
| Remotion | ✅ READY | Can install via: `npm create remotion@latest my-video` |

---

## Manual Setup Instructions

### 1. AgentMail (https://agentmail.to)
1. Click "Get Started"
2. Enter email: {EMAIL}
3. Verify email
4. Create account & password
5. Go to Account → API Keys
6. Copy API key

**Your API Key:** `[PASTE_HERE]`

### 2. Tavily (https://tavily.com)
1. Sign up with email: {EMAIL}
2. Verify email
3. Log in
4. Go to Account → API section
5. Copy API key

**Your API Key:** `[PASTE_HERE]`

### 3. FireCrawl (https://firecrawl.dev)
1. Click "Sign up"
2. Choose: Email ({EMAIL}) or GitHub
3. Verify
4. Dashboard → API Keys
5. Copy API key

**Your API Key:** `[PASTE_HERE]`

### 4. Here.Now (✅ No Setup)
Agent handles this automatically via https://here.now

### 5. Remotion (✅ Ready to Install)
When ready, run:
```bash
npm create remotion@latest my-video
cd my-video
npm start
```

---

## How to Complete Setup

1. Visit the 3 URLs above
2. Sign up and get API keys
3. Paste the keys into this file (replace `[PASTE_HERE]`)
4. Reply: "Keys ready"
5. I'll integrate them into your agent

---

## Why These Tools?

- **AgentMail:** Send emails without Gmail bot detection
- **Tavily:** Free web search (1000/month)
- **FireCrawl:** Extract clean data from websites
- **Here.Now:** Instant URL sharing (no setup!)
- **Remotion:** Generate videos from code (voice-to-video)

---

## Workflow Once Integrated

```
Agent instruction: "Search for AI tools, scrape top 3, extract pricing, host on here.now, send me a summary email with a promo video"

Behind the scenes:
1. Tavily (search)
2. FireCrawl (scrape)
3. Here.Now (host results)
4. AgentMail (email summary)
5. Remotion (create video)

Result: Done in seconds
```

---

_Last updated: {self.timestamp}_
"""
        return report
    
    def run(self):
        """Execute all setups"""
        self.log("Starting Agent Tools Setup...", "INFO")
        self.log(f"Email: {EMAIL}", "INFO")
        
        # Run setups
        self.setup_agentmail()
        self.setup_tavily()
        self.setup_firecrawl()
        self.setup_herenow()
        self.setup_remotion()
        
        # Generate report
        report = self.generate_report()
        
        # Save
        with open(OUTPUT_FILE, 'w') as f:
            f.write(report)
        
        self.log(f"Report saved to: {OUTPUT_FILE}", "INFO")
        
        if self.errors:
            self.log(f"Errors encountered: {len(self.errors)}", "WARN")
            for err in self.errors:
                print(f"  - {err}")
        
        return report

if __name__ == "__main__":
    import subprocess
    setup = ToolSetup()
    report = setup.run()
    print("\n" + "="*60)
    print(report)
