# Job Scout Skill

## Purpose
Find jobs, research companies, analyze job ads, and build tailored resumes and cover letters for Paul Robinson's mechanical engineering career.

## Core Workflow

### 1. Job Search & Discovery
- **Search engines:** LinkedIn, Seek, Indeed, Government Jobs, specialized engineering boards
- **Keywords:** "Mechanical Engineer", "Production Engineer", "Design Engineer", "Manufacturing Engineer"
- **Filters:** Queensland/Gold Coast preferred, remote/hybrid considered, salary range
- **Job board scraping:** Extract job title, company, requirements, description

### 2. Company Research
- **Website analysis:** Who they are, what they do, size, location
- **Industry context:** Manufacturing, automotive, aerospace, marine, fabrication
- **Ownership & stability:** Recent changes, growth signals, new projects
- **Culture signals:** From job ad language, company news, employee reviews
- **Relevance scoring:** How well does Paul's background fit?

### 3. Job Ad Analysis
- **Requirements mapping:** Technical skills, experience, qualifications
- **Paul's fit assessment:** Match percentage, gaps, strengths
- **Red flags:** Unrealistic expectations, poor culture signals, accessibility concerns
- **Opportunity scoring:** How good is this role for Paul?

### 4. Application Brief
Create a structured brief document (markdown + DOCX) that includes:
- **Section 1 — Company Research:**
  * Who they are
  * What they make/do
  * Size, location, structure
  * Ownership & recent changes
  * Relevant context for Paul
- **Section 2 — Job Ad Analysis:**
  * Key requirements vs Paul's background
  * Gaps and how to address them
  * Employer questions & suggested answers
- **Section 3 — Strategic Approach:**
  * Why Paul is a good fit
  * Key talking points
  * Potential concerns to pre-empt

### 5. Resume Tailoring
- **Base resume selection:** Choose best matching version (Unidan, Telwater, Advanced Cranes)
- **Customization:** Emphasize relevant experience, skills, and projects
- **Keyword optimization:** Mirror job ad language and requirements
- **Formatting:** Maintain Paul's preferred structure and design
- **Output:** DOCX + PDF

### 6. Cover Letter Generation
- **Structure:** Professional but warm, addressing specific points from job ad
- **Tone:** Confident, genuine, informed (from company research)
- **Content:**
  * Brief personal context (disability, functional capacity if relevant)
  * Relevant experience & projects
  * Why Paul wants THIS job at THIS company
  * Call to action
- **Output:** DOCX + PDF

## Key Information About Paul

### Background
- **Qualification:** Bachelor of Mechanical Engineering with Honours (Griffith University, 2023)
- **Trade:** 4-year Certificate III apprenticeship — sheet metal fabrication (2004–2008)
- **Experience:** 5+ years hands-on fabrication across marine, industrial, commercial environments
- **Current:** Mechanical Engineering Consultant at Habitec (2020–present) — custom adaptive devices for people with disabilities
- **Location:** Tallebudgera, QLD 4209 (Gold Coast)
- **Contact:** 0421 847 001 | probinson85@live.com.au

### Disability Context (Private)
- **Condition:** Quadriplegic (wheelchair-dependent)
- **Fatigue:** Primary limiting factor, not pain
- **Functional capacity:** Can work full office/design environments
- **Accommodation:** Wheelchair accessible workplace
- **Openness:** Comfortable discussing disability in job contexts — it's part of who he is
- **Strength:** Brings lived experience of accessible design to engineering work

### Resume Templates Available
1. **Telwater (PREFERRED)** — Production engineering focus, marine/manufacturing context
2. **Unidan** — Broader engineering, consultant background
3. **Advanced Cranes** — Commercial/industrial machinery focus
4. **Others:** Bond, BAE, Marine Power, Rehab Eng (archived versions)

### Work Style Preferences
- **Role type:** Production Engineering, Design Engineering, Manufacturing Engineering
- **Industry:** Preferred — Marine/Maritime, Manufacturing, Automotive, Aerospace, Robotics
- **Environment:** Enjoys technical problem-solving, hands-on product development
- **Hyperfocus:** Can lock in deeply when engaged (needs break reminders)
- **Fatigue sensitive:** Prefers roles with flexible hours/work-from-home option when possible

## Tools & APIs

### Web Search & Scraping
```python
from web_search import brave_search
from web_fetch import fetch_url

# Find jobs
results = brave_search("mechanical engineer jobs gold coast site:linkedin.com")
for job in results:
    fetch_url(job['url'])  # Get full job posting
```

### Document Generation
```python
from docx import Document
from docx.shared import Pt, RGBColor, Inches

# Create DOCX
doc = Document()
doc.add_heading('Paul Robinson Resume')
doc.save('resume.docx')
```

### Company Research
- Company websites
- LinkedIn company pages
- Industry news (Google News, TechCrunch, etc.)
- Employee reviews (Glassdoor, Indeed)
- Business registrations (ASIC, ABN lookup)

## Output Structure

### Job Discovery Briefing
```markdown
# Job Opportunity: [Title] at [Company]

## Quick Overview
- **Role:** [Title]
- **Company:** [Name]
- **Location:** [Location]
- **Posted:** [Date]
- **Salary:** [Range if available]
- **Match Score:** [80%+] ✅ / [60-80%] 🤔 / [<60%] ❌

## Key Requirements
- [Requirement 1] — Paul: ✅ / 🤔 / ❌
- [Requirement 2] — Paul: ✅ / 🤔 / ❌

## Paul's Fit
[2-3 sentence summary of how well Paul matches]

## Next Steps
1. Deep research: Company context, team, culture
2. Gap analysis: What needs explaining?
3. Build application brief
4. Tailor resume & write cover letter
5. Submit with confidence
```

### Application Brief (DOCX)
See Telwater/Unidan briefs in `/root/.openclaw/workspace/resume/` for examples.

## Rules & Guardrails

1. **Quality over quantity:** Only present opportunities with 60%+ match to Paul's background
2. **Disability-inclusive:** Screen for accessibility concerns early (no manual labour roles, etc.)
3. **Red flags:** Flag concerning culture signals, unrealistic expectations, hidden red flags
4. **Honesty:** Never oversell or misrepresent Paul's experience
5. **Privacy:** Disability is personal — only mention in contexts where it's strategically relevant
6. **Resume authenticity:** Never fabricate experience; only emphasize what's genuine
7. **Company respect:** Research thoroughly; applications should demonstrate real interest

## Commands

### Search for Jobs
```
Find mechanical engineer jobs in Queensland
```

### Research a Company
```
Research [Company Name] — I'm considering applying
```

### Analyze a Job Ad
```
Here's the job description: [paste job ad]
Analyze this for fit and create an application brief
```

### Build Application Materials
```
Create resume and cover letter for this role: [job details]
Based on [Company Name] job ad: [paste ad]
```

## Files & Locations

- **Resume templates:** `/root/.openclaw/workspace/resume/`
- **Application briefs:** `/root/.openclaw/workspace/resume/[Company Name]/`
- **Completed applications:** `/root/.openclaw/workspace/job-applications/`

## Integration

### With Main Session
- Search jobs, create briefs, build resumes
- Present opportunities to Paul for feedback
- Track applications (which companies, which roles, outcomes)

### With Persistent Agent
- Runs in thread-bound mode (Telegram group)
- Proactive job discovery (2-3x per week)
- Responds to Paul's direct requests
- Keeps running list of opportunities

## Next Steps
1. Create Resume & Cover Letter Builder Skill
2. Spawn persistent Job Scout agent (thread-bound, Telegram)
3. Kick off initial job discovery
4. Build tracking system for applications & outcomes

---

_This skill works with Paul's background and preferences. Customize as you learn more about what he's actually looking for._
