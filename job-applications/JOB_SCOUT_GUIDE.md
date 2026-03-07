# Job Scout Guide for Paul

## Quick Start

Your **Job Scout agent** is now active in the "Openclaw" Telegram group. Here's how to use it.

## What Scout Does (Automatically)

### 1. Weekly Job Discovery
- Searches LinkedIn, Seek, Indeed, engineering boards
- Looks for: Mechanical Engineer, Production Engineer, Design Engineer roles
- Location: Gold Coast/Queensland preferred (remote/hybrid considered)
- **Filters:** Only shows jobs with 60%+ match to your background
- **Frequency:** 2-3 times per week
- **Format:** Posts top opportunities in the Telegram group with summaries and fit scores

### 2. Company Research (When You Ask)
You: *"Research [Company Name]"*
Scout will analyze:
- Who they are, what they make
- Size, location, culture
- Why you're a good fit specifically
- Any red flags
- Takes ~5-10 minutes

### 3. Application Briefs (When You Approve)
You: *"Create brief for [Company Name] job"*
Scout builds a structured document:
- **Section 1:** Company research (who are they, what they do, why they matter)
- **Section 2:** Job analysis (requirements vs your background, fit assessment)
- **Section 3:** Strategy (key talking points, how to position yourself)
- **Output:** DOCX + Markdown in `/job-applications/[Company Name]/`

### 4. Resume & Cover Letters (When You're Ready)
You: *"Build resume and cover letter for [Company Name]"*
Scout generates:
- **Resume:** Tailored from your best template (Telwater/Unidan/Advanced Cranes)
  - Customized for this specific role
  - Keyword-optimized from job ad
  - Emphasizes your unique combination: fabrication + engineering
  - DOCX + PDF, ready to submit
  
- **Cover Letter:** Professional, warm, informed
  - Shows company research
  - Specific examples of relevant work
  - Why THIS job at THIS company
  - Optional: strategic mention of disability (if it strengthens your story)
  - DOCX + PDF, ready to submit

## How to Use Scout in Telegram

### Scenario 1: Scout Posts a Job Opportunity

**Scout message:**
```
🎯 New Opportunity: Production Engineer at Telwater

📍 Location: Coomera, Gold Coast
💼 Role: Production Engineering / Tooling Design
📅 Posted: Today
💰 Salary: [Range if available]

Your Fit: 85% ✅✅

Why this matters:
[explanation]

Next steps:
1️⃣ Want me to research this in detail?
2️⃣ Skip it?
```

**You have 3 options:**
1. **"Research this"** → Scout digs deeper, comes back with detailed company analysis
2. **"Not interested"** → Scout notes it and moves on
3. **Silence** → Scout will follow up in a day or two, or moves to next opportunity

### Scenario 2: Scout Has Done Company Research

Scout sends detailed brief:
```
RESEARCH: Telwater

Company Context:
- Australia's largest boat manufacturer
- 250+ staff, Coomera (Gold Coast)
- Founded 1988, owned by Yamaha (March 2025)
- Manufactures boats + trailers, 4 brands

Why you're a fit:
- Your marine fabrication background (Swift Marine, Coomera)
- Familiarity with Gold Coast marine industry
- Your unique combo = perfect for production engineering

Job Requirements vs Your Background:
✅ Production Engineering experience (Habitec projects)
✅ Manufacturing/tooling knowledge (apprenticeship + trade)
✅ SolidWorks/CAD (Habitec consultant work)
🤔 [Any small gaps] - Here's how we address it

Key Points for Application:
- Emphasize: fabrication + engineering foundation
- Mention: familiar with Gold Coast marine industry
- Demonstrate: understanding of manufacturing constraints
- Story: "I've designed with manufacturing in mind"
```

**You reply:**
- **"Build resume and cover letter"** → Scout creates tailored materials
- **"Let me think about this"** → Scout waits, follows up if needed
- **"Skip"** → Scout moves on

### Scenario 3: Scout Is Building Your Application

**Process (automated):**
1. Scout chooses best resume template for this role
2. Customizes: Professional summary, key skills, relevant experience
3. Optimizes keywords from job ad
4. Generates DOCX + PDF versions
5. Builds cover letter with company research insights
6. Posts message: *"Resume and cover letter ready at [link]"*

**You then:**
- Download and review
- Request changes: *"Update resume paragraph 2 to emphasize tooling experience"*
- Approve: *"Ready to submit"*
- Scout prepares email with cover letter, resume, brief as attachments

## Where Files Are Stored

```
/root/.openclaw/workspace/job-applications/
├── JOB_HUNTING_TRACKER.md          ← Central tracking (open this to see progress)
├── JOB_SCOUT_GUIDE.md              ← This file
└── [Company Name]/
    ├── [Company]-Brief.docx        ← Scout's research brief
    ├── [Company]-Brief.md          ← Markdown version
    ├── [Company]-Resume.docx       ← Your tailored resume
    ├── [Company]-Resume.pdf        ← PDF version (for submitting)
    ├── [Company]-Cover-Letter.docx ← Your cover letter
    └── [Company]-Cover-Letter.pdf  ← PDF version (for submitting)
```

You can open `JOB_HUNTING_TRACKER.md` anytime to see:
- All opportunities found
- Status of each application
- Dates and follow-up reminders
- Outcomes (interviews, rejections, offers)

## What Scout Knows About You

**Your unique strengths:**
- Bachelor of Mechanical Engineering (Griffith, 2023)
- 4-year Certificate III Sheet Metal Fabrication apprenticeship (2004-2008)
- 5+ years hands-on manufacturing experience
- This combination is **rare and valuable** for production engineering roles
- You understand *how things are actually made*, not just theoretical engineering

**Your current experience:**
- Habitec consultant (2020–present): custom adaptive devices
- Full design cycle: concept → SolidWorks → structural analysis → prototyping → manufacturing coordination
- Independent project management, technical documentation
- Design with disability in mind (accessibility perspective)

**Your location & accessibility:**
- Tallebudgera, QLD 4209 (Gold Coast)
- Wheelchair-dependent, fatigue-limited
- Office/design work preferred (not factory floor)
- Wheelchair-accessible workplace essential
- Open to mentioning disability strategically (it's part of your story + design perspective)

**Your focus:**
- Production Engineering, Design Engineering, Manufacturing Engineering
- Industries: Marine/maritime (first choice), manufacturing, automotive, aerospace, robotics
- Remote/hybrid flexibility preferred (helps manage fatigue)
- Gold Coast/Queensland preferred, but open to relocation for right opportunity

## Communication Tips

**Be direct with Scout:**
- *"Find me marine manufacturing jobs in Queensland"* → Scout knows this means your preference
- *"This one doesn't feel right"* → Scout logs it and moves on
- *"I need a week to think"* → Scout pauses and respects your pace
- *"Can you emphasize X more in the resume?"* → Scout revises and sends updated version

**Questions Scout can answer:**
- *"Is this a good fit for me?"* → Scout analyzes and scores
- *"What's this company about?"* → Scout researches and summarizes
- *"How do I explain [gap]?"* → Scout helps craft strategic talking point
- *"What should my cover letter say?"* → Scout drafts and you approve

**Scout's pace:**
- Proactive: 2-3 opportunities per week automatically
- Responsive: Answers questions/requests within hours
- Respectful: Doesn't spam; waits for your signal before diving deep on opportunities
- Strategic: Focuses on quality (right fit) over quantity (lots of applications)

## Disability & Application Strategy

Scout respects your privacy and strategic choice on mentioning disability.

**General rule:**
- Mention disability only if it strengthens your story (e.g., accessibility design background)
- Don't apologize for who you are
- Accessibility is a must (wheelchair-accessible office), so Scout checks this early
- Your disability doesn't define your capability; your experience does

**Scout will flag:**
- "This company is in a multi-story building with no elevator" (accessibility concern)
- "Role emphasizes standing all day" (not a good fit given fatigue limits)
- "Company culture suggests they value 'flexibility'" (might be receptive to work arrangements)

## Success Metrics

Scout measures success by:
- **Quality**: Every application is personalized, well-researched, authentic
- **Fit**: Only applying to roles with 60%+ skill match (avoid wasted effort)
- **Response rate**: % of applications that get interviews (goal: 30%+)
- **Interviews**: Secure interviews with companies you're excited about
- **Offers**: Land a role that fits your skills and lifestyle

## Tips for Best Results

1. **Be honest with Scout:** If you're not feeling a role, say so. Scout learns your preferences.
2. **Give feedback:** "This company paid me too little" or "I loved their culture" helps Scout find better fits.
3. **Review materials:** Scout generates good drafts; your feedback makes them great.
4. **Be timely:** If Scout researches a company and you're interested, let them know within 1-2 days (job market moves fast).
5. **Respect your energy:** Scout can work in background; you focus on interviews and decision-making.

## What's Next

Scout is ready to:
1. **Start job discovery** this week
2. **Post top opportunities** to Telegram group
3. **Wait for your signal** on which to pursue
4. **Research, build briefs, create materials** when you approve
5. **Track everything** so you never lose an opportunity

Your job: Respond when Scout posts opportunities, give feedback on fits, and let Scout handle the heavy lifting.

---

## Questions?

- **How do I see all opportunities?** → Check `JOB_HUNTING_TRACKER.md`
- **Can I apply directly?** → Yes, but Scout can help make it stronger
- **What if I find a job myself?** → Post in Telegram and Scout will research + build materials
- **How often does Scout search?** → 2-3x per week minimum, more if you're actively job hunting
- **Can Scout apply for me?** → No, you submit applications. Scout builds the materials and coach you through the process.

Let's find you a great role! 🚀

---

_Job Scout Agent ID: agent:scout:subagent:283a1e1d-3eda-4419-8bb1-e7aa2315c00e_
_Location: Openclaw Telegram group_
_Started: March 2, 2026_
