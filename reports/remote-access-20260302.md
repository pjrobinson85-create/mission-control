# Remote Testing Access for Report-Writer Flask App

**Research Date:** March 2, 2026 (02:04 AM AEDT)  
**Purpose:** Compare best options for providing secure remote access to beta testers  
**Context:** Small beta group, privacy-conscious, Flask web app on local Ollama machine (192.168.1.174:11434)

---

## EXECUTIVE SUMMARY

**Recommendation:** **ngrok (free tier) → Replit (if staying online long-term)**

For Paul's immediate need (small beta group, short testing cycles), **ngrok free tier** offers the fastest path to testing with minimal setup. For longer-term persistent access (continuous beta feedback), **Railway** offers best value and simplicity.

---

## OPTION 1: SELF-HOSTED (Local Ollama Machine)

Expose the Flask app from the local machine (192.168.1.174) to the internet via tunneling.

### 1A. ngrok (Recommended for speed)

**What it is:** Secure tunnel tool that creates a public URL pointing to your local port.

**Setup Steps:**
1. Install: `pip install ngrok` or download binary
2. Create free account at ngrok.com
3. Get auth token from dashboard
4. Run: `ngrok http 5000` (or your Flask port)
5. Share generated public URL (e.g., `https://abc123.ngrok.io`)

**Authentication Options:**
- Public URL (anyone with URL can access)
- Basic auth in Flask app (add middleware)
- IP whitelist in ngrok (paid plan only)
- OAuth in Flask app (more complex)

**Network Setup:**
- No firewall changes needed
- No VPN required
- Works across ISP/NAT automatically

**Setup Time:** ~10 minutes (including account creation)

**Pros:**
- ✅ Extremely fast (10 minutes end-to-end)
- ✅ Zero network configuration
- ✅ Works from home with standard internet
- ✅ Free tier is genuinely useful
- ✅ Built-in request inspection/logging
- ✅ No server costs
- ✅ Instant restarts (if app crashes)

**Cons:**
- ❌ URL changes every restart (paid plan: fixed URLs)
- ❌ Rate-limited on free tier (20 connections/min)
- ❌ ngrok processes traffic (privacy concern if data-sensitive)
- ❌ Only 2h sessions on free tier (must re-run)
- ❌ Random URLs broadcast security by obscurity

**Cost:** $0–$39/month (free → Pro)  
**Best for:** Quick demos, rapid iteration, small closed beta

---

### 1B. Cloudflare Tunnel (Zero Trust alternative)

**What it is:** Free, privacy-first tunnel alternative to ngrok.

**Setup Steps:**
1. Install `cloudflared` CLI
2. Create free Cloudflare account (no credit card)
3. Run: `cloudflared tunnel --url http://localhost:5000`
4. Gets a tunnel subdomain automatically

**Authentication:**
- Public URL (same as ngrok)
- Can add Cloudflare Zero Trust auth (some free features)

**Setup Time:** ~5 minutes

**Pros:**
- ✅ Completely free, no rate limits
- ✅ Privacy-first (Cloudflare doesn't see HTTP traffic with encryption)
- ✅ Persistent tunnel URL (if using custom domain)
- ✅ No session limits
- ✅ Better for privacy-conscious use

**Cons:**
- ❌ Slightly more complex setup than ngrok
- ❌ Less user-friendly dashboard
- ❌ Random subdomain default (can add custom domain)

**Cost:** $0 (truly free)  
**Best for:** Privacy-conscious, longer test windows, minimal setup friction

---

### 1C. SSH Reverse Proxy + Tailscale (VPN approach)

**What it is:** Set up a VPN so testers connect directly to your local network.

**Setup Steps:**
1. Install Tailscale on local machine + testers' devices
2. Accept connections in Tailscale dashboard
3. Testers access Flask app via local IP (192.168.x.x)

**Authentication:**
- Tailscale handles identity (auth via SSO, GitHub, email)
- Flask app behind network → no public exposure

**Network Setup:**
- All devices must run Tailscale
- No port forwarding/firewall changes needed
- WireGuard-based (industry-standard encryption)

**Setup Time:** ~20 minutes (per tester)

**Pros:**
- ✅ Most secure option (private network, no public exposure)
- ✅ Works well with multiple testers
- ✅ Persistent, stable access
- ✅ Testers see local IP (faster, no tunnel overhead)
- ✅ Free for personal use (up to 100 devices)

**Cons:**
- ❌ Requires testers to install Tailscale
- ❌ Not one-click for non-technical users
- ❌ VPN overhead (slight latency)
- ❌ Overkill for public beta

**Cost:** $0 (free tier) or $10/month (Team plan, for admin features)  
**Best for:** Private beta with trusted testers, highest privacy/security

---

## OPTION 2: CLOUD HOSTING (Deploy permanently)

Move the Flask app to a cloud server so users access a live instance.

### 2A. Railway (Recommended for persistence)

**What it is:** Modern PaaS platform (Heroku replacement) with usage-based pricing.

**Setup Steps:**
1. Create Railway account (free $5 credit)
2. Connect GitHub repo
3. Railway auto-detects Flask app
4. Configure environment variables
5. Deploy (auto on git push)
6. Get auto-generated domain (myapp.up.railway.app)

**Cost Calculation (for small app):**
- 0.5 GB RAM, minimal CPU: ~$5–10/month
- Higher: ~$15–20/month
- Serverless mode: pay only when testers use app

**Authentication:**
- Public URL (add Flask auth layer for control)
- Environment variables for secrets
- Railway logs all requests

**Setup Time:** ~15 minutes (if GitHub repo ready)

**Pros:**
- ✅ Set once, always online
- ✅ Automatic scaling (no manual tuning)
- ✅ Better than Heroku (cheaper, more flexible)
- ✅ Auto-deploys on git push
- ✅ Built-in logging/monitoring
- ✅ Custom domain support
- ✅ Persistent across restarts

**Cons:**
- ❌ Recurring monthly cost ($5–20+)
- ❌ Data lives on Railway's servers (privacy)
- ❌ App always running (minor privacy leak)
- ❌ Needs credit card
- ❌ Not local anymore

**Cost:** $5–20/month (usage-based)  
**Best for:** Ongoing beta testing, always-available instance, multiple testers

---

### 2B. Heroku (Legacy, avoid)

**What it is:** Original PaaS, now less competitive.

**Why not:**
- ❌ Expensive ($7+ minimum per month)
- ❌ Less flexible than Railway
- ❌ Older platform, declining features

**Setup Time:** ~15 minutes

**Cost:** $7–50/month  
**Best for:** Legacy projects only

---

### 2C. Replit (Simple, limited)

**What it is:** Cloud IDE + deployment platform, easy for beginners.

**Setup Steps:**
1. Upload Flask code to Replit
2. Create `pyproject.toml` with dependencies
3. Click "Deploy"
4. Get public URL

**Cost:**
- Starter plan: 1 free app, expires after 30 days (can re-publish)
- Paid: ~$7/month for persistent deployment

**Authentication:**
- Public URL only

**Setup Time:** ~5 minutes

**Pros:**
- ✅ Simplest setup (no GitHub needed)
- ✅ Free option if okay with 30-day expiry
- ✅ Good for very simple apps
- ✅ No CLI knowledge needed

**Cons:**
- ❌ Free tier not suitable for ongoing beta
- ❌ 30-day expiry is annoying
- ❌ Paid tier ($7) is cheaper than development friction
- ❌ Limited customization

**Cost:** Free (30 days) or $7/month  
**Best for:** Quick one-off demos, not serious beta testing

---

## OPTION 3: DOCKER CONTAINERIZATION

Package the Flask app in Docker for portable, reproducible testing.

### Strategy: Tester runs Docker locally or in cloud

**Dockerfile Example:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
```

**Tester Access Models:**

**A. Self-hosted locally (testers run on their machine)**
- Testers: `docker run -p 5000:5000 report-writer:latest`
- Access: `http://localhost:5000`

**B. Docker image in registry (Docker Hub)**
- Push image: `docker push myusername/report-writer:latest`
- Testers: `docker pull myusername/report-writer:latest`
- Run locally with above command

**Setup Time:**
- Docker setup: ~30 minutes (write Dockerfile, test locally)
- Per tester: ~10 minutes (install Docker, pull image, run)

**Pros:**
- ✅ Reproducible environment (works same on all machines)
- ✅ No server costs
- ✅ Testers run locally (best privacy)
- ✅ Easy to update (just pull new image)
- ✅ Can be deployed to cloud later
- ✅ Professional approach (good for portfolio)

**Cons:**
- ❌ Requires Docker knowledge from testers
- ❌ Not one-click (need command line)
- ❌ Initial setup time (Dockerfile testing)
- ❌ Storage overhead (each tester downloads ~500 MB)
- ❌ Not suitable for non-technical testers

**Cost:** $0 (Docker Hub free tier)  
**Best for:** Technical beta testers, long-term maintainability, reproducibility

---

## COMPARISON TABLE

| Factor | ngrok | Cloudflare Tunnel | Tailscale VPN | Railway | Replit | Docker |
|--------|-------|-------------------|---------------|---------|--------|--------|
| **Setup (mins)** | 10 | 5 | 20 | 15 | 5 | 30 |
| **Tester setup** | 0 (click link) | 0 (click link) | 15 (install VPN) | 0 (click link) | 0 (click link) | 10 (install Docker) |
| **Ease of use** | 10/10 | 9/10 | 6/10 | 9/10 | 10/10 | 4/10 |
| **Stability** | Fair | Good | Excellent | Excellent | Good | Excellent |
| **URL persistence** | No* | Yes | Yes | Yes | Yes | N/A |
| **Monthly cost** | $0–39 | $0 | $0–10 | $5–20 | $0–7 | $0 |
| **Privacy level** | Medium | High | Highest | Low | Low | Highest |
| **Always online** | No | No | Yes** | Yes | No (free) | No (tester-dependent) |
| **Good for small beta** | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| **Good for long-term** | ❌ | ⚠️ | ✅ | ✅ | ❌ | ✅ |
| **Requires login** | None needed | None needed | Email/SSO | Email | Email | None needed |

*ngrok free: random URL per restart. Paid: fixed URLs.  
**Tailscale: testers' machines always on, or access when you're online.

---

## DETAILED COMPARISON: Paul's Use Case

**Paul's situation:**
- Privacy-conscious ✓
- Small beta group (2–5 testers)
- Report-Writer app (medium complexity, local Ollama)
- Wants simplicity (not CLI-savvy testers)
- Testing cycles: unclear duration

### **BEST PATH: Hybrid Approach**

**Phase 1 (Quick demo, next 1–2 days):**
- Use **ngrok free tier**
- Share URL via Telegram (one-click access)
- Get fast feedback on core features
- No cost, zero friction

**Phase 2 (Ongoing beta, 1–2 weeks):**
- Switch to **Railway** (fixed URL, always online)
- Redeploy Flask app with single git push
- Testers bookmark one URL, revisit anytime
- Cost: ~$10/month (acceptable for beta)

**Phase 3 (If feedback → production):**
- Keep Railway (already live)
- Add authentication layer (Flask login + session)
- Monitor usage, plan scaling

---

## IMPLEMENTATION ROADMAP

### **Immediate (next 2 hours):**

1. **Test ngrok locally** (5 min)
   - `pip install pyngrok`
   - Run Flask app
   - Start ngrok tunnel
   - Test public URL works

2. **Create README.md for testers** (5 min)
   - "Click this link: https://abc123.ngrok.io"
   - "Try reporting a document"
   - "Send feedback via Telegram"

3. **Send to first tester** (Telegram) (2 min)
   - Keep it simple
   - "New version ready to test, click here"

### **If Phase 1 works (next 1–2 days):**

4. **Set up Railway deployment** (20 min)
   - Create Railway account
   - Connect GitHub repo (report-writer)
   - Configure env variables
   - Deploy

5. **Update README with Railway URL**
   - Same instructions, persistent link

---

## SECURITY NOTES

**Privacy considerations by option:**

1. **ngrok/Replit/Railway:** Your app code & data visible to platform (ngrok/Railway employees can inspect traffic)
   - **Risk:** Low for testing (not production data)
   - **Mitigation:** Don't process sensitive data; use throwaway test docs

2. **Tailscale/Docker:** No platform visibility (data stays local or on tester's machine)
   - **Risk:** Minimal
   - **Best for:** Privacy-sensitive workflows

3. **Cloudflare Tunnel:** Encrypted tunnel (Cloudflare can't read HTTP traffic)
   - **Risk:** Low
   - **Trade-off:** Less user-friendly than ngrok

---

## NEXT STEPS

1. **Confirm with Paul:** Which approach fits?
   - Fast demo (ngrok) → set for this week
   - Longer beta (Railway) → set for ongoing testing
   - Both → use hybrid approach

2. **Test locally:** Ensure report-writer Flask app runs on port 5000 (or note current port)

3. **Prepare testers list:** Who will test? 1 person or 5?

4. **Document setup:** Write tester instructions (even just "click link, try uploading a doc")

---

## FILES TO CREATE

- [ ] `TESTER_SETUP.md` — Instructions for testers
- [ ] Dockerfile (if Docker approach) — Package the app
- [ ] `.env.example` — Template for Flask config
- [ ] `requirements.txt` — Ensure all Flask dependencies listed

---

## CONCLUSION

**For Paul's report-writer app:** Start with **ngrok** (today, 10 min setup), then migrate to **Railway** (tomorrow, 20 min) for sustained testing. Docker is overkill unless testers are technical.

---

_Report generated: 2026-03-02 02:04 AEDT | Research: ngrok, Railway, Cloudflare, Tailscale, Replit