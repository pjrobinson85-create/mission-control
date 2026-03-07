# Resume & Cover Letter Builder Skill

## Purpose
Generate tailored resumes and cover letters for Paul Robinson based on specific job opportunities, company research, and job ad analysis.

## Core Workflow

### Resume Generation

#### 1. Template Selection
Choose the best matching resume template:
- **Telwater** (BEST) — Production/Manufacturing Engineering focus
  - Emphasizes: fabrication foundation, production engineering, process design, tooling
  - Industries: Marine, automotive, manufacturing, industrial
- **Unidan** — Broader engineering consultant background
  - Emphasizes: design, consulting, adaptive devices, diverse projects
  - Industries: Biomedical, accessibility, custom engineering
- **Advanced Cranes** — Commercial/industrial machinery focus
  - Emphasizes: heavy machinery, commercial fabrication, industrial applications
  - Industries: Cranes, heavy equipment, commercial

#### 2. Customization Strategy
**For each role, tailor:**
- **Professional Summary** — Reframe to match job requirements
  - Keep core: "Mechanical Engineer + fabrication trade foundation"
  - Adjust focus: Production engineering? Design? Consulting?
  - Add context: Why Paul is applying to THIS company
  
- **Key Skills** — Reorder by relevance to job ad
  - Production Engineering skills first if that's the role
  - Manufacturing/fabrication experience highlighted
  - Software (SolidWorks, CAD, analysis tools) if job requires
  - Process design, tooling, prototyping, materials selection
  
- **Work Experience** — Emphasize relevant projects and achievements
  - Habitec projects that match job requirements
  - Specific examples: tooling design, manufacturing challenges solved, cost savings, process improvements
  - Fabrication background applied to engineering problems
  - Project timelines, team coordination, independent project management
  
- **Education** — Highlight relevant coursework if applicable
  - Bachelor of Mechanical Engineering (Griffith, 2023)
  - Certificate III Sheet Metal Fabrication (2004-2008)
  - Relevant electives or projects

#### 3. Keyword Optimization
- Extract key terms from job ad (requirements, desired skills)
- Mirror job ad language where authentic
- Include technical terms relevant to the role
- Maintain natural, professional tone

#### 4. Document Generation
- **Format:** DOCX (using python-docx) + PDF export
- **Structure:** Match Paul's preferred layout from templates
- **Fonts:** Professional (Times New Roman, Calibri, or similar)
- **Spacing:** 1.15 or 1.5 line spacing, clean margins
- **Length:** 1-2 pages (keep to 1 page where possible)

### Cover Letter Generation

#### 1. Structure
```
[Your Details]
[Date]
[Employer Details]

Dear [Hiring Manager],

[PARAGRAPH 1 — Hook]
- Reference the specific role and company
- Brief personal context (optional: disability if relevant to accessibility or design background)
- Why this role matters to you

[PARAGRAPH 2 — Why You're a Fit]
- 2-3 most relevant experiences/projects
- How they directly apply to job requirements
- Specific examples that demonstrate capability
- Connect fabrication + engineering background

[PARAGRAPH 3 — Why THIS Company]
- Evidence of company research
- Why you want to work there specifically
- Values alignment or exciting projects
- Show genuine interest

[PARAGRAPH 4 — Closing]
- Reiterate enthusiasm
- Call to action (meeting, discussion, etc.)
- Professional sign-off

Best regards,
Paul Robinson
0421 847 001
probinson85@live.com.au
```

#### 2. Tone & Voice
- **Professional but warm** — Not stiff, genuinely interested
- **Confident without arrogance** — "I have the skills to..." not "I probably could..."
- **Informed** — Show company research, specific role knowledge
- **Honest** — Authentic about background and motivation
- **Disability-smart:** 
  - Mention if it's relevant to accessibility/inclusive design background
  - Frame as strength where applicable
  - Don't apologize for who you are
  - Mention only if it helps the story (e.g., "I've designed with disability in mind")

#### 3. Key Points to Address
- **Your unique combination:** Fabrication + engineering degree (not common)
- **Why now:** Interest in production engineering, new challenges, specific company
- **Capability:** Specific examples of problem-solving, design, manufacturing knowledge
- **Culture fit:** Show you understand the company and align with values
- **Accessibility context** (if relevant): Frame disability as design perspective, not barrier

#### 4. Document Generation
- **Format:** DOCX + PDF export
- **Formatting:** Professional letter layout
- **Length:** 250-350 words (fits on 1 page)
- **Tone:** Warm, informed, professional

## Implementation

### Python Function Structure
```python
def build_resume(job_title, company_name, job_requirements, template='telwater'):
    """
    Generate a tailored resume for a specific job.
    
    Args:
        job_title: e.g., "Production Engineer"
        company_name: e.g., "Telwater"
        job_requirements: List of required/desired skills from job ad
        template: 'telwater', 'unidan', or 'advanced-cranes'
    
    Returns:
        Path to generated DOCX and PDF files
    """
    
    # Load base resume template
    # Customize sections based on job_requirements
    # Optimize keywords
    # Generate DOCX and PDF
    # Save to /root/.openclaw/workspace/job-applications/[Company Name]/
    
    return (docx_path, pdf_path)

def build_cover_letter(job_title, company_name, company_context, 
                       job_ad, key_achievements, disability_mention=False):
    """
    Generate a tailored cover letter.
    
    Args:
        job_title: Role title
        company_name: Company name
        company_context: Research findings (who they are, what they do)
        job_ad: Full job posting text
        key_achievements: List of relevant achievements to highlight
        disability_mention: Whether to mention disability context (strategic choice)
    
    Returns:
        Path to generated DOCX and PDF files
    """
    
    # Generate cover letter from structure above
    # Personalize with company/job details
    # Include specific achievements and research
    # Save to /root/.openclaw/workspace/job-applications/[Company Name]/
    
    return (docx_path, pdf_path)
```

## Key Information Sources

### Resume Templates
- `/root/.openclaw/workspace/resume/Telwater/Paul_Robinson_Resume_Telwater.docx`
- `/root/.openclaw/workspace/resume/Unidan/Paul_Robinson_Resume_Unidan.docx`
- `/root/.openclaw/workspace/resume/Advanced Cranes/Paul_Robinson_Resume_Advanced_Cranes.docx`

### Cover Letter Examples
- `/root/.openclaw/workspace/resume/Telwater/Paul_Robinson_Cover_Letter_Telwater.docx`
- `/root/.openclaw/workspace/resume/Unidan/Paul_Robinson_Cover_Letter_Unidan.docx`
- `/root/.openclaw/workspace/resume/Advanced Cranes/Paul_Robinson_Cover_Letter_Advanced_Cranes.docx`

### Application Brief Examples
- `/root/.openclaw/workspace/resume/Telwater/Telwater_Brief.docx`
- `/root/.openclaw/workspace/resume/Unidan/Unidan_Application_Brief.docx`
- `/root/.openclaw/workspace/resume/Advanced Cranes/Advanced_Cranes_Application_Brief.docx`

## Paul's Background (Quick Reference)

**Education:**
- Bachelor of Mechanical Engineering with Honours (Griffith University, 2023)
- Certificate III Sheet Metal Fabrication apprenticeship (2004-2008)

**Key Experience:**
- **Habitec (2020–present):** Mechanical Engineering Consultant
  - Custom adaptive devices for people with disabilities
  - Full design cycle: concept, SolidWorks modelling, structural analysis, prototype testing
  - Coordinate with manufacturers, technical documentation
  - Independent project management
  
- **Swift Marine (2004-2008):** Sheet Metal Fabricator Apprentice
  - Marine aluminium fabrication
  - MIG/TIG welding, brake press, guillotine
  - Marine-grade weld standards, corrosion protection
  - Gold Coast marine industry
  
- **Superior Stainless (2009-2011):** Fabricator/Welder
  - Commercial stainless, mild steel, aluminium
  - Tight tolerances, high surface finish
  - Complex bent and welded assemblies
  - Shop drawing interpretation

**Key Skills:**
- SolidWorks CAD/modelling
- Structural analysis and materials selection
- Tooling and fixture design
- Process design and optimization
- Prototype testing and validation
- Technical documentation
- Manufacturing coordination
- Fabrication knowledge (practical, hands-on)
- Problem-solving, independent work

**Location & Contact:**
- Tallebudgera, QLD 4209 (Gold Coast)
- 0421 847 001
- probinson85@live.com.au
- LinkedIn: linkedin.com/in/paulrobinson1985

## Best Practices

1. **Customize, don't fabricate** — Only emphasize real experience and achievements
2. **Keyword match** — Use job ad language where authentic
3. **Specific examples** — "Designed a brake jig that improved cycle time by 15%" > "Good at design"
4. **Disability strategy** — Mention if it strengthens the story (accessibility design), ignore if it doesn't
5. **Company research** — Evidence of genuine interest in THAT company and THAT role
6. **Proofread** — No typos, consistent formatting, professional presentation
7. **Soft copy workflow** — DOCX for editing, PDF for final submission
8. **Output naming:** `[Company Name] - Paul Robinson - Resume.docx` / `.pdf`
9. **Keep originals** — Archive original templates, store custom versions in job-applications/

## Output Structure

```
/root/.openclaw/workspace/job-applications/
├── [Company Name]/
│   ├── [Company Name] - Paul Robinson - Application Brief.docx
│   ├── [Company Name] - Paul Robinson - Resume.docx
│   ├── [Company Name] - Paul Robinson - Resume.pdf
│   ├── [Company Name] - Paul Robinson - Cover Letter.docx
│   └── [Company Name] - Paul Robinson - Cover Letter.pdf
├── [Next Company]/
│   └── [same structure]
```

## Integration with Job Scout Skill

1. **Job Scout finds opportunity** → Analyzes fit, creates application brief
2. **Paul approves direction** → "Yes, build application materials for this"
3. **Resume Builder generates:**
   - Tailored resume (DOCX + PDF)
   - Tailored cover letter (DOCX + PDF)
4. **Paul reviews, provides feedback** → Updates and refinements
5. **Ready to submit** → PDF versions + email template ready to send

---

_This skill transforms job opportunities into submission-ready application packages. Focus on quality and authenticity._
