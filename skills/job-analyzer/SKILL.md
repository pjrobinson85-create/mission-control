# Job Analyzer Skill

## Purpose
Analyze specific job postings provided by Paul and assess fit, create application briefs, and generate tailored resume/cover letter materials.

## How It Works

### Input: Job Details
Paul provides one or more of:
- Job title
- Company name
- Job description (pasted from Seek, LinkedIn, Indeed, etc.)
- Key requirements
- Location
- Salary range (optional)

### Output: Complete Analysis

#### 1. Fit Assessment
```
Your Fit: [0-100%]
- Score breakdown
- Core skills match
- Experience alignment
- Education relevance
```

#### 2. Detailed Analysis
- **Strengths**: What Paul brings that matches
- **Gaps**: What Paul needs to address
- **Red Flags**: Concerns or dealbreakers
- **Opportunities**: How to position Paul's unique background

#### 3. Application Brief
- **Section 1**: Company Research (who they are, what they do, culture)
- **Section 2**: Job Ad Analysis (requirements vs Paul's fit)
- **Section 3**: Strategic Approach (talking points, how to address gaps)

#### 4. Application Materials
- Tailored resume (customized from Telwater/Unidan/Advanced Cranes template)
- Tailored cover letter (from company research)
- Both in DOCX and PDF

## Input Formats Accepted

### Format 1: Just the Basics
```
Job Title: Production Engineer
Company: Telwater
Location: Coomera, Gold Coast
```
→ Scout will search for the company and job details

### Format 2: Full Job Description
```
Job Title: Production Engineer
Company: Telwater
Location: Coomera, Gold Coast
Salary: $75k-$95k

Key Responsibilities:
- Design and develop tooling systems
- Optimize manufacturing processes
- Manage supplier coordination
- etc.

Requirements:
- Bachelor of Engineering
- 3+ years production engineering
- CAD proficiency
- etc.
```
→ Immediate analysis with provided details

### Format 3: Copy-Paste from Seek/LinkedIn
Entire job posting pasted
→ Extract and analyze

## Analysis Framework

### Fit Scoring (0-100%)

| Score | Rating | Action |
|-------|--------|--------|
| 80%+ | Excellent Fit | **DEFINITELY APPLY** |
| 70-79% | Very Good Fit | **WORTH PURSUING** |
| 60-69% | Good Fit | **CONSIDER APPLYING** |
| <60% | Poor Fit | **SKIP** |

### Strength Categories

**Perfect Matches** (Paul already has):
- Mechanical engineering degree ✅
- Fabrication trade certification ✅
- Design cycle experience (Habitec) ✅
- CAD/SolidWorks ✅
- Fabrication knowledge ✅

**Adaptable Skills** (Paul can demonstrate):
- Production engineering (from fabrication + engineering combo)
- Tooling design (fabrication background)
- Process optimization (Habitec projects)
- Problem-solving (demonstrated)
- Leadership (independent project management)

**Gaps to Address**:
- Specific industry experience (e.g., automotive, aerospace)
- Large-scale manufacturing (if role requires)
- Certain software/tools (can be learned quickly)

## Key Information: Paul Robinson

**Education:**
- Bachelor of Mechanical Engineering with Honours (Griffith University, 2023)
- Certificate III Sheet Metal Fabrication (2004-2008)

**Experience:**
- Habitec Consultant (2020–present): Full design cycle, adaptive devices, SolidWorks, structural analysis, prototyping, manufacturing coordination
- Swift Marine (2004-2008): Sheet metal fabrication, marine standards, welding
- Superior Stainless (2009-2011): Commercial fabrication

**Unique Value:**
- Rare combination of hands-on fabrication + engineering analysis
- Most production engineers lack fabrication experience
- Most fabricators lack engineering capability
- Paul has both = competitive advantage for manufacturing/production roles

**Disability Context:**
- Quadriplegic, wheelchair user
- Fatigue-limited (primary constraint)
- Fully capable of office/design work
- Wheelchair-accessible workplace essential
- Comfortable mentioning disability strategically if it strengthens story

**Location:** Tallebudgera, QLD 4209
**Contact:** 0421 847 001 | probinson85@live.com.au

## Output Format

### Quick Analysis (1-2 minutes)
```
🎯 [Job Title] at [Company]
📍 [Location]
💼 Your Fit: [XX%] ✅/🤔/❌
💰 Salary: [Range if available]

**Why this matters:**
[2-3 sentences on why Paul should care]

**Quick fit check:**
✅ [Match 1]
✅ [Match 2]
🤔 [Gap/consideration if any]

**Recommendation:** [APPLY / CONSIDER / SKIP]

**Next steps:**
1️⃣ Want me to build an application brief?
2️⃣ Create resume + cover letter?
3️⃣ Skip this one?
```

### Full Application Brief (5-10 minutes)
Complete 3-section brief covering:
- Company research
- Job ad analysis
- Strategic approach
- Deliverable: DOCX + markdown

### Complete Package (15-20 minutes)
Brief + tailored resume + cover letter
- Deliverable: All files (DOCX + PDF)

## Tools Available

- **web_search**: Find company info, industry context, competitor analysis
- **web_fetch**: Read job postings, company websites, reviews
- **read/write**: Manage application files
- **image**: Analyze documents if needed

## Rules & Guardrails

1. **Quality over speed** — Better to spend time on fit assessment than rush through
2. **Honest assessment** — Never oversell or misrepresent Paul's experience
3. **Privacy-aware** — Disability mentioned only strategically
4. **Authenticity** — Never fabricate experience, only emphasize genuine background
5. **Research-backed** — Company research based on real sources, not guesses

## Commands

**Quick Analysis:**
"Analyze this job for Paul: [job title, company, requirements]"

**Full Brief:**
"Build an application brief for [company/role]"

**Complete Package:**
"Create resume and cover letter for [company/role]"

**From Job Posting:**
"Here's a job posting - analyze it for fit, then build materials"

## Next Steps

1. Paul provides job details (title, company, description)
2. Analyzer assesses fit (2 min)
3. Paul approves brief building or materials creation
4. Analyzer builds materials (5-15 min depending on scope)
5. Paul reviews and submits

---

_This skill bridges Scout's job discovery with practical application material generation._
