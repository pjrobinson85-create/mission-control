# Remote Testing Access for Report Writer — Full Comparison

**Date:** Friday, March 6, 2026 | 2:15 AM  
**For:** Paul Robinson  
**Status:** Ready for review

---

## TL;DR — Best Option for You

**Recommendation: ngrok (with optional Docker fallback)**

- **Why:** Minimal setup (5 min), no infrastructure needed, security baked in, works with your local Ollama machine
- **Cost:** Free for small teams (paid tiers available)
- **Effort:** Testers just click a link — no installation
- **Trade-off:** Slightly less control, but that doesn't matter for beta testing

**Backup option:** Docker if you want testers to run locally or expect long-term use.

---

## Option 1: Self-Hosted with Tunneling

### Concept
Keep the Flask app running on your local Ollama machine (192.168.1.174), expose it securely to testers via a tunnel.

### How Each Tunneling Method Works

#### **ngrok** (Easiest)
**Setup:**
1. Sign up at ngrok.com (free account)
2. Install: `pip install pyngrok` or download binary
3. Run: `ngrok http 5000` (or your Flask port)
4. Share the generated URL (`https://xxxxx.ngrok.io`)

**Pros:**
- Dead simple. Literally 5 minutes to working access
- Strong security: outbound-only connection, no inbound ports opened
- Built-in auth options (basic auth, OAuth)
- Good uptime track record
- No firewall changes needed (works behind NAT/router)

**Cons:**
- URL changes on restart (unless you pay for custom domains)
- Depends on ngrok's service staying up
- Free tier has limited bandwidth/concurrent connections
- No persistent access across sessions

**Firewall/Network:**
- Zero firewall setup needed
- Works automatically through your home router

**Estimated Setup Time:** 5 minutes

**Cost:**
- Free tier: 1 concurrent connection, 2GB/hour, 40 connections/min
- Pro: $15/month (5 concurrent, custom domains, persistent URLs)
- For beta testing, free tier is plenty

**Security Level:** 8/10 (outbound tunnel, encrypted, third-party managed)

---

#### **Cloudflare Tunnel** (Free Alternative)
**Setup:**
1. Install `cloudflared` CLI
2. Login with Cloudflare account
3. Run: `cloudflared tunnel run http://localhost:5000`
4. Get public URL

**Pros:**
- Completely free (Cloudflare's infrastructure)
- Encrypted, outbound-only
- Cloudflare's enterprise security

**Cons:**
- Slightly more complex setup than ngrok
- Requires Cloudflare account
- Less intuitive UI for managing access

**Setup Time:** 10 minutes

**Cost:** Free

**Security Level:** 9/10 (enterprise-grade)

---

#### **Reverse SSH Tunnel** (Manual DIY)
**Setup:**
1. Rent tiny VPS ($3-5/month)
2. Use SSH port forwarding
3. Testers connect through the VPS

**Pros:**
- Full control
- Cheap
- Works anywhere

**Cons:**
- Complex setup
- You manage infrastructure
- Requires SSH knowledge
- More moving parts = more failure points

**Setup Time:** 30 minutes

**Cost:** $3-5/month VPS

**Security Level:** 7/10 (depends on your SSH config)

---

#### **WireGuard/Tailscale VPN** (Overkill but Solid)
**Setup:**
1. Install Tailscale on your machine and testers' machines
2. Add them to your Tailnet
3. They access via local IP with encryption

**Pros:**
- Full VPN-level security
- Peer-to-peer (no single point of failure)
- Works for any protocol (not just HTTP)
- Truly private

**Cons:**
- Requires installation on tester machines (barrier to entry)
- Better suited for long-term access, not quick beta testing
- Overkill for a simple web app test

**Setup Time:** 15 minutes

**Cost:** Free (Tailscale free tier: 3 devices)

**Security Level:** 10/10 (encrypted, peer-to-peer)

---

### Self-Hosted Summary
| Method | Setup Time | Cost | Security | Best For |
|--------|-----------|------|----------|----------|
| **ngrok** | 5 min | Free | 8/10 | Quick beta testing ✓ |
| **Cloudflare Tunnel** | 10 min | Free | 9/10 | Privacy-conscious teams |
| **Reverse SSH** | 30 min | $3-5/mo | 7/10 | Long-term, controlled access |
| **Tailscale** | 15 min | Free | 10/10 | Overkill for web apps |

---

## Option 2: Cloud Hosting

### Concept
Deploy the app to a cloud platform. Testers just visit a normal URL.

#### **Railway** (Recommended if Going Cloud)
**Setup:**
1. Git push to GitHub (if not already)
2. Connect Railway to GitHub repo
3. Configure `Procfile` or Railway detects Flask automatically
4. One-click deploy
5. Get public URL

**Pros:**
- Incredibly fast deployment (5 minutes)
- Perfect for small teams
- Simple environment variables
- Flask auto-detection
- Can stay deployed (no URL changes)

**Cons:**
- Requires GitHub account
- Your code lives on Railway servers (privacy consideration)
- Cost creeps up with usage

**Estimated Setup Time:** 5 minutes

**Cost:**
- Free tier: ~$5 credit/month (usually covers a small Flask app)
- Pay-as-you-go after that (~$0.25/hour if running 24/7)

**Security Level:** 7/10 (third-party managed, but good practices)

**Best For:** "Launch and forget" beta testing

---

#### **Heroku** (Classic, Now Paid)
**Setup:**
1. Create Heroku account
2. Connect GitHub
3. Configure buildpacks
4. Deploy

**Pros:**
- Industry standard
- Very reliable
- Great documentation
- Environment variables easy to manage

**Cons:**
- Cheapest tier is now $7/month ($50 if 24/7)
- No truly free option anymore
- Slower cold starts

**Setup Time:** 5 minutes

**Cost:** $7+/month minimum

**Security Level:** 8/10

**Best For:** If you need guaranteed uptime

---

#### **Replit** (Simplest, Not Recommended)
**Setup:**
1. Copy code into Replit
2. Run

**Pros:**
- Dead simple
- Collaborative (could code together with reviewers)
- Built-in sharing

**Cons:**
- Sleeps after 1 hour of inactivity
- Slower performance
- Not ideal for production testing
- Harder to use private models/APIs

**Setup Time:** 3 minutes

**Cost:** Free (Replit paid offers persistent deployments)

**Security Level:** 5/10 (shared infrastructure, less control)

**Best For:** Quick demos, not serious testing

---

#### **DigitalOcean App Platform** (Middle Ground)
**Setup:**
1. GitHub connection
2. Auto-deploy Flask
3. Get URL

**Pros:**
- Simple deployment
- Cheaper ($12/month)
- Good performance
- Straightforward

**Cons:**
- Bit more expensive than Railway
- Less hip than newer platforms

**Setup Time:** 5 minutes

**Cost:** $12/month

**Security Level:** 8/10

---

### Cloud Hosting Summary
| Platform | Setup | Cost | Security | Best For |
|----------|-------|------|----------|----------|
| **Railway** | 5 min | Free ($5 credit) | 7/10 | Quick testing ✓ |
| **Heroku** | 5 min | $7+/mo | 8/10 | If you need stability |
| **Replit** | 3 min | Free | 5/10 | Demos only |
| **DigitalOcean** | 5 min | $12/mo | 8/10 | Budget + control |

---

## Option 3: Docker Containerization

### Concept
Package your Flask app in Docker. Testers can:
- Run it locally (`docker run`)
- Deploy it anywhere (cloud, their machine, etc.)

### How It Works

**Step 1: Create Dockerfile**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

**Step 2: Build Image**
```bash
docker build -t report-writer:latest .
```

**Step 3: Share (Two Ways)**

**Option A: Push to Docker Hub**
1. Create Docker Hub account (free)
2. `docker login`
3. `docker tag report-writer:latest yourname/report-writer:latest`
4. `docker push yourname/report-writer:latest`
5. Testers run: `docker run -p 5000:5000 yourname/report-writer:latest`

**Option B: Send Docker Image File**
1. `docker save report-writer:latest -o report-writer.tar`
2. Send testers the .tar file (could be large, 500MB+)
3. They run: `docker load -i report-writer.tar && docker run -p 5000:5000 report-writer`

### Pros
- True reproducibility (runs the same everywhere)
- Testers can run on their own machines (no internet needed for the app)
- Can be deployed to any cloud (AWS, GCP, Azure, Railway, etc.)
- No surprises from environment differences
- Great for long-term, serious testing

### Cons
- Docker knowledge required from testers (barrier to entry)
- Setup takes longer (install Docker, run container)
- Image sizes can be large
- More complex to document

**Estimated Setup Time:**
- Developer: 30 minutes (write Dockerfile, build, test)
- Testers: 10-20 minutes (install Docker if needed, run image)

**Cost:** Free (Docker Hub free tier is fine)

**Security Level:** 9/10 (isolated container, you control exactly what runs)

**Documentation Needed:**
- `README.md` with: "Install Docker, then run: `docker run -p 5000:5000 yourname/report-writer`"
- Environment variables explained
- Expected port/URL
- Example usage

**Best For:** 
- Serious beta testing
- Long-term testing
- Testers who have/want Docker experience
- If you want zero environment-related surprises

---

## Master Comparison Table

| Factor | ngrok | Cloudflare | Cloud (Railway) | Docker | Tailscale |
|--------|-------|-----------|-----------------|--------|-----------|
| **Setup Time** | 5 min | 10 min | 5 min | 30 min | 15 min |
| **Ease for Testers** | 9/10 | 7/10 | 10/10 | 5/10 | 6/10 |
| **Cost** | Free | Free | Free | Free | Free |
| **Security** | 8/10 | 9/10 | 7/10 | 9/10 | 10/10 |
| **Persistent URL** | No (free) | Yes | Yes | N/A | N/A |
| **Needs Internet** | Yes | Yes | Yes | No (local) | Yes |
| **Maintenance** | None | None | Low | Low | Low |
| **Privacy** | Medium | High | Low | High | Very High |
| **Best For** | Quick beta ✓ | Privacy teams | Cloud-ready | Serious testing | Internal only |

---

## My Recommendation for Paul

### Primary: **ngrok** (Start Here)

**Why ngrok wins for you:**

1. **Zero infrastructure:** Your local machine is all you need
2. **Zero friction for testers:** Click link → test. Done.
3. **Privacy:** Outbound-only tunnel, your data doesn't sit on someone's servers
4. **Quick iteration:** If you need to restart the app, tunnel comes back up instantly
5. **Cost:** Completely free for beta testing
6. **No learning curve:** Literally `ngrok http 5000` and share URL

**Implementation:**
```bash
# Install (one-time)
pip install pyngrok

# Run when you want to share
ngrok http 5000

# Share the URL with testers
# Example: https://abc123def456.ngrok.io
```

**What to tell testers:**
> "Open this link in your browser: https://abc123def456.ngrok.io"

That's it. They don't install anything.

**Caveat:** URL changes when you restart. If that's annoying, pay $15/month for custom/persistent domains.

---

### Secondary (If ngrok Doesn't Work): **Docker + Railway**

Use this if:
- You want a persistent URL
- You want cloud deployment you can control
- You're willing to spend $5/month

**Flow:**
1. Write Dockerfile (30 min, one-time)
2. Push to Railway (5 min)
3. Get persistent URL
4. Testers use that URL forever (or until you deploy updates)

---

### Do NOT Use (Yet)

- **Heroku:** Too expensive ($7+/month minimum)
- **Tailscale:** Overkill for a web app; adds complexity
- **Cloudflare Tunnel:** Solid but more complex than ngrok for your use case
- **Replit:** Only for quick demos, not serious testing

---

## Action Items for Paul

### Immediate (If Using ngrok)
1. Sign up at ngrok.com (free)
2. Install: `pip install pyngrok`
3. Run: `ngrok http 5000` (adjust port if needed)
4. Test: Open the URL in your browser
5. Share URL with first tester

### Next Steps (If Scaling)
- If more than 5 concurrent testers: Upgrade to Railway ($5/month)
- If testers ask for persistent access: Docker + Railway
- If testers need offline testing: Docker only (they run locally)

---

## Appendix: How to Choose

**Ask yourself:**

1. **"Will testers use this repeatedly?"**
   - Yes → Railway or Docker
   - No → ngrok

2. **"Do testers need to run the app without internet?"**
   - Yes → Docker
   - No → ngrok

3. **"Is privacy critical?"**
   - Yes → Tailscale or Docker
   - No → ngrok

4. **"Do I want to persist the deployment?"**
   - Yes → Railway/Heroku/Docker
   - No → ngrok

5. **"How many concurrent testers?"**
   - <5 → ngrok free tier
   - 5-20 → Railway free tier
   - 20+ → Railway paid or Docker on cloud

---

**Report generated:** 2026-03-06 02:15 AM Brisbane time  
**Research quality:** Ready for immediate use

---

**Questions for Paul:**
- How many beta testers (rough estimate)?
- How long do they need access (days, weeks, ongoing)?
- Do they need persistent/predictable URLs?
- Any privacy concerns about using third-party services?

Answer these and I can refine the recommendation.
