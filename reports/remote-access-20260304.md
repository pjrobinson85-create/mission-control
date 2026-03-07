# Remote Testing Access for Report-Writer App
**Research Date:** March 4, 2026  
**Context:** Flask web app, privacy-conscious, small beta group, minimize friction

---

## 1. SELF-HOSTED (Local Ollama Machine)

### Option A: ngrok (Fastest, Zero Setup)
**What it does:** Creates a public HTTPS tunnel to your local Flask app in 30 seconds.

**Setup:**
```bash
# 1. Install ngrok (Mac/Linux/Windows)
# Download from https://ngrok.com or: brew install ngrok

# 2. Sign up (free tier available)
# 3. Run Flask app locally
# 4. In another terminal:
ngrok http 5000
# → Returns public URL: https://abc123.ngrok.io
```

**Authentication:**
- Default: None (URL is the secret)
- Optional: Add basic auth via ngrok dashboard or Flask middleware
- Rate limiting: Free tier has limits (~60 req/min)

**Security:**
- HTTPS by default ✓
- URL is semi-private (not searchable, but not truly secret)
- Testers can bookmark it
- Session-based (generates new URL each restart)

**Setup Time:** 2 minutes  
**Cost:** Free tier works for small testing. Paid: $5/month+

**Pros:**
- ✅ Dead simple — literally 2 commands
- ✅ No networking knowledge needed
- ✅ Works behind home routers (NAT traversal)
- ✅ Perfect for quick demos/feedback loops
- ✅ HTTPS secured

**Cons:**
- ❌ URL changes on restart (annoying if app restarts frequently)
- ❌ Free tier rate limits (fine for 2-3 testers)
- ❌ Dependency on ngrok service (if ngrok down, access fails)
- ❌ Not ideal for long-term stable testing (weeks)

**Best for:** Quick feedback cycles, small tester groups, Paul testing with Georgia Carter

---

### Option B: Cloudflare Tunnel (Better Long-Term)
**What it does:** Like ngrok but more stable, persistent URLs, free tier is generous.

**Setup:**
```bash
# 1. Create Cloudflare account (free)
# 2. Add your domain (even if just subdomain)
# 3. Install cloudflared CLI
# 4. Authenticate: cloudflared login
# 5. Create tunnel:
cloudflared tunnel create report-writer
# 6. Route it:
cloudflared tunnel route dns report-writer testing.yourdomain.com
# 7. Run:
cloudflared tunnel run report-writer
# Flask app on localhost:5000 → https://testing.yourdomain.com
```

**Authentication:**
- Can layer Cloudflare Access (basic auth, email verification, etc.)
- Free tier supports simple auth
- Alternatively: Basic auth in Flask

**Security:**
- HTTPS with Cloudflare cert ✓
- Firewall rules available
- Can restrict by email domain (if testing with specific group)

**Setup Time:** 5-10 minutes (first time)  
**Cost:** Free (generous), $20/mo for advanced features

**Pros:**
- ✅ Persistent URL (doesn't change on restart)
- ✅ Professional-grade infrastructure
- ✅ Built-in DDoS protection
- ✅ Free tier is genuinely free
- ✅ Can add access controls
- ✅ Works globally
- ✅ Better for production-like testing

**Cons:**
- ❌ Requires domain (even free subdomain)
- ❌ Slightly more initial setup than ngrok
- ❌ Need to understand Cloudflare dashboard

**Best for:** Longer testing windows, professional setup, when URL needs to stay stable

---

### Option C: WireGuard VPN (Most Secure, Needs Admin)
**What it does:** Users install a VPN client, connect to your network, access Flask app like it's local.

**Setup:**
```bash
# On your machine (Ollama server):
sudo apt install wireguard wireguard-tools

# Generate keys, configure peers (testers)
# Give each tester a .conf file
# They install WireGuard app, import config
# Access Flask at http://192.168.1.174:5000 (your local IP)
```

**Authentication:**
- WireGuard cert-based (high security)
- Flask can still have login

**Setup Time:** 30-45 minutes (first setup), 2 min per tester  
**Cost:** Free (open-source)

**Pros:**
- ✅ Most private (VPN is encrypted end-to-end)
- ✅ No dependency on third-party service
- ✅ Very fast (direct connection)
- ✅ Pro-grade security
- ✅ Free forever
- ✅ Full control

**Cons:**
- ❌ Complex setup (needs understanding of VPN)
- ❌ Requires port forwarding/firewall knowledge
- ❌ Needs admin access on home router
- ❌ Tester friction (install app, import key, troubleshoot)
- ❌ Overkill for simple feedback testing
- ❌ If your ISP blocks VPN ports, won't work

**Best for:** Privacy-obsessed teams, long-term beta testing, corporate environment

---

## 2. CLOUD HOSTING (Quick Deployment)

### Option A: Railway.app (Best Overall)
**What it does:** One-click deploy Flask apps from GitHub. Free tier is genuinely useful.

**Setup:**
```
1. Push Flask app to GitHub
2. Sign up at railway.app (GitHub login)
3. Click "New Project" → Import from GitHub
4. Select your repo → Done
5. Get auto-generated URL: https://report-writer.up.railway.app
```

**Cost:**
- Free tier: $5/month credit (includes 500 hours)
- Paid: $5/month per project minimum
- Perfect for one app = $5/month

**Authentication:**
- Can add simple login via Flask
- Railway itself has no user management

**Setup Time:** 3-5 minutes  
**Privacy:** Code hosted on Railway servers (not your machine)

**Pros:**
- ✅ Absurdly easy (literally 5 clicks)
- ✅ Persistent URL
- ✅ Auto-deploys on GitHub push (CI/CD included)
- ✅ Free tier is real value ($5/mo)
- ✅ Professional hosting
- ✅ Built-in logging/monitoring
- ✅ Databases included if needed
- ✅ Good for small teams

**Cons:**
- ❌ Code lives on Railway's servers (privacy consideration)
- ❌ $5/month is not free (but very cheap)
- ❌ Small cold-start delay
- ❌ Locked into Railway ecosystem

**Best for:** Quick launch, don't want to manage servers, small team, Paul wants "done yesterday"

---

### Option B: Heroku (Classic, More Expensive)
**What it does:** Original hero of easy deployments (now owned by Salesforce, features reduced).

**Setup:**
```bash
heroku create report-writer
git push heroku main
heroku open
```

**Cost:**
- Used to be free, now: $7/month minimum (eco dyno)
- Plus databases, add-ons

**Setup Time:** 5 minutes

**Pros:**
- ✅ Industry standard (lots of docs)
- ✅ Very easy deployment

**Cons:**
- ❌ More expensive than Railway
- ❌ No longer free tier
- ❌ Ecosystem less vibrant post-Salesforce

**Verdict:** Railway is strictly better now. Skip Heroku.

---

### Option C: Replit (Fun but Limited)
**What it does:** Browser-based IDE + hosting. Fun for learning, limited for production.

**Setup:**
```
1. Upload Flask app to Replit
2. Click "Run"
3. Get shareable URL
4. Testers click URL in browser (no install)
```

**Cost:** Free tier works, $7/mo for production credits

**Setup Time:** 2 minutes

**Pros:**
- ✅ Easiest possible onboarding (browser-based)
- ✅ No tester setup (just click link)
- ✅ Free tier exists

**Cons:**
- ❌ Slow/limited free tier
- ❌ Dies if inactive 15 min (need paid tier)
- ❌ Not designed for serious testing
- ❌ Limited customization

**Verdict:** Fun for demos, not for serious beta testing.

---

## 3. DOCKER CONTAINERIZATION

**What it does:** Package Flask app as a Docker image. Testers run it locally or push to cloud.

### Setup

**Step 1: Create Dockerfile**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

**Step 2: Build & Test**
```bash
docker build -t report-writer .
docker run -p 5000:5000 report-writer
# → http://localhost:5000
```

**Step 3: Share with Testers**

Option A: Push to Docker Hub (public registry)
```bash
docker tag report-writer yourusername/report-writer:latest
docker push yourusername/report-writer:latest
# Tester runs: docker run -p 5000:5000 yourusername/report-writer
```

Option B: Share .tar file
```bash
docker save -o report-writer.tar report-writer:latest
# Send .tar file to testers
# They run: docker load -i report-writer.tar
```

**Setup Time:**
- First Dockerfile: 15 minutes
- Updates: 2 minutes per release

**Cost:** Free (if using Docker Hub public registry)

**Documentation Needed:**
- README with: "docker run -p 5000:5000 ..." command
- System requirements (Docker installed)
- Port/config explanations

**Pros:**
- ✅ Testers run app exactly as you packaged it (consistency)
- ✅ Works on any OS (Mac/Linux/Windows with Docker)
- ✅ No server to manage (testers run locally)
- ✅ Easy updates (pull new image)
- ✅ Professional/scalable
- ✅ Free forever

**Cons:**
- ❌ Requires Docker install (barrier for non-technical testers)
- ❌ Takes time to explain/setup for first-timers
- ❌ If testers use Ollama, they might be comfortable (but still friction)
- ❌ Can't access from other machines easily (unless you expose it)

**Best for:** Technical testers (Georgia, fellow devs), reproducible testing, future scaling

---

## 4. COMPARISON TABLE

| Factor | ngrok | Cloudflare Tunnel | WireGuard VPN | Railway | Docker Local |
|--------|-------|-------------------|---------------|---------|--------------|
| **Ease of Setup** | 9/10 | 7/10 | 3/10 | 9/10 | 6/10 |
| **Ease for Testers** | 9/10 | 9/10 | 4/10 | 10/10 | 4/10 |
| **URL Stability** | 5/10 | 10/10 | 10/10 | 10/10 | N/A (local) |
| **Cost** | Free* | Free | Free | $5/mo | Free |
| **Security** | Good | Good | Excellent | Good | Depends |
| **Best For** | Quick demos | Stable access | Privacy-first | Production-ready | Technical testing |
| **Setup Time** | 2 min | 5 min | 30 min | 3 min | 15 min + learn |

---

## RECOMMENDATION FOR PAUL

### **Primary: Railway.app** ✅

**Why?**
1. **Simplicity:** Push to GitHub → done. No infrastructure to manage.
2. **Cost:** $5/month is negligible for app testing.
3. **Stability:** Persistent URL, professional hosting.
4. **Automation:** Auto-deploys on code changes (no manual steps).
5. **Testing:** Georgia can click link, start testing immediately.
6. **Timeline:** App ready in 3 minutes, not 3 hours.

**Setup (for Paul):**
```
1. Push report-writer to GitHub
2. Sign up at railway.app (GitHub login)
3. Click "New Project" → Import report-writer repo
4. Add environment variables (if needed)
5. Railway handles the rest
6. Share URL with Georgia: https://report-writer.up.railway.app
```

**Backup: ngrok** (if Railway feels too permanent)
- If Paul wants to test privately first, use ngrok
- Testers just click a link
- No cost upfront
- Switch to Railway once satisfied

### **Secondary: Docker** (medium-term)
- Great for reproducible testing
- Add once Railway is working
- Georgia (developer) can run locally with Docker

---

## QUICK ACTION STEPS

1. **This week:** Deploy to Railway.app (15 min work)
   - Get URL working
   - Send Georgia the link
   - Gather feedback

2. **Next week:** Add Docker setup for broader testing
   - Create Dockerfile
   - Write README
   - Share with testers who prefer local

3. **If privacy is critical:** Switch to Cloudflare Tunnel
   - More control, still simple
   - Free, persistent URL
   - Slight learning curve

---

## DECISIONS FOR PAUL

**Question 1:** Does the app need to be accessible 24/7, or just during testing windows?
- If 24/7 → Railway or Cloudflare
- If windows only → ngrok is fine

**Question 2:** How many testers? (Current: Georgia + maybe 1-2 others?)
- 1-3 testers → ngrok works
- 5+ testers → Railway recommended

**Question 3:** Is privacy (code not on external servers) critical?
- Yes → Docker locally + WireGuard or Cloudflare
- No → Railway (easiest)

**Current recommendation:** Railway. Revisit if requirements change.

---

## REFERENCE LINKS

- **Railway:** https://railway.app/
- **ngrok:** https://ngrok.com/
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Docker:** https://docs.docker.com/get-started/
- **WireGuard:** https://www.wireguard.com/

---

**Status:** Ready for Paul review. Next step: Confirm chosen option, then proceed with setup.
