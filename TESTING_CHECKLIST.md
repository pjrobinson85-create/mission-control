# Report Writer - Testing Checklist for Paul

**Status**: Report Writer is 85% ready for testing. Code review complete.

---

## Before You Start Testing

### P0 Security Fixes (Do Tonight - 1.5 hours)
These MUST be done before running with real client data.

- [ ] **Add Authentication** (30 min)
  - Location: `app.py` (add to `create_app()`)
  - Add basic auth middleware to all `/api/*` routes
  - Use env var `APP_PASSWORD`
  - Example: If password not set, default to "changeme"

- [ ] **Fix Database Permissions** (5 min)
  - Location: `utils/database.py` → `init_db()` function
  - After `conn.close()`, add: `os.chmod(DB_PATH, 0o600)`
  - This prevents world-readable access to client data

- [ ] **Add Export Cleanup** (15 min)
  - Location: `routes/report_routes.py` → `/export` route
  - After DOCX is saved, delete any files in `exports/` older than 24 hours
  - Prevents sensitive documents from accumulating

- [ ] **Add Logging** (30 min)
  - Location: `app.py` (import logging module)
  - Replace all `print()` with `logging.info()` / `logging.error()`
  - Log to: `/var/log/report-writer.log` (or `/tmp/report-writer.log` if no permissions)

---

## What To Test (In Order)

### 1. Basic Generation ✅
**Goal**: Ensure sections generate without errors

**Steps**:
1. Start the app: `python app.py --ollama-url http://192.168.1.174:11434 --model qwen3.5:35b`
2. Open browser: `http://localhost:5000`
3. Load sample client "Test Client 1" (dropdown)
4. Click "Generate Full Report"
5. Watch each section generate (should take 2-3 min total)
6. Check that NO sections show `[ERROR: ...]`

**Expected**: All 13 sections generate with reasonable text (100-300 words each)
**Report if**: Any section is blank, shows errors, or takes >1 min per section

---

### 2. Rationale Sections Completeness ⚠️
**Goal**: Verify all 7 rationale bullets actually generate (known blocker)

**Steps**:
1. After "Generate Full Report" completes, scroll to "Rationale" section
2. Check that ALL of these sub-sections appear (expand if collapsed):
   - [ ] Rationale: Specialised Knowledge
   - [ ] Rationale: Functional Capacity
   - [ ] Rationale: Participation
   - [ ] Rationale: Psychosocial
   - [ ] Rationale: Safety
   - [ ] Rationale: Measurable Outcomes
   - [ ] Rationale: Informal Networks

3. Click "Export as DOCX"
4. Open the Word document
5. Verify all 7 bullets appear in the final report

**Expected**: All 7 bullets present in DOCX export
**Report if**: Any bullets missing or blank (THIS IS A CRITICAL BLOCKER)

---

### 3. Table Rendering 📊
**Goal**: Check that goals/outcomes tables format correctly

**Steps**:
1. In browser, look at "Previous Goals" section (should have a table)
2. Look for columns: Goal | Assessment | Baseline | Current | Change
3. Check values are readable (not smashed together or missing)
4. Click "Export as DOCX" and open Word document
5. Verify tables are properly formatted (not broken into pipe characters)

**Expected**: Tables render cleanly in both web UI and DOCX
**Report if**: Tables show as raw markdown pipes (e.g., `|Goal|Assessment|`) or cells are misaligned

---

### 4. Hallucination Detection ✅
**Goal**: Ensure LLM output is cleaned of markdown/headers

**Steps**:
1. Generate a section (any section)
2. Look at the output in the browser
3. Check for any of these (should NOT appear):
   - [ ] `**bold text**` (should be plain text)
   - [ ] `# Heading` (should be removed)
   - [ ] `|Table|Pipes|` in non-table sections
   - [ ] `\n` literals (should be actual line breaks)

**Expected**: All output is clean plain text, no markdown
**Report if**: Any markdown artifacts appear in generated sections

---

### 5. Reference Citations ⚠️
**Goal**: Check if model invents fake references (known blocker)

**Steps**:
1. Generate the "References" section
2. Look at citations
3. For SCI diagnosis, check if citations look real (should match approved list)
4. For non-SCI diagnosis (try stroke if available), note any suspicious citations
5. Examples of hallucinations (if you see these, report):
   - "Johnson et al., 2024" (too new, likely fake)
   - "Smith et al., 2019" (very generic, probably hallucinated)

**Expected**: For SCI, citations should be real NDIS-approved references
**Report if**: References look made up or aren't in the approved list

---

### 6. Cost Calculation Placeholders 📝
**Goal**: Check how costs are displayed in export

**Steps**:
1. Generate a full report
2. Click "Export as DOCX"
3. Open Word document
4. Scroll to "Funding" / "Cost" section
5. Check what's displayed:
   - Should see placeholders like `[MANUAL CALCULATION]` or hardcoded values?

**Expected**: Should see placeholders (e.g., `[Hours × Rate × 1.1 GST = ___]`)
**Report if**: See hardcoded costs like "$35,401.88" (those are placeholders, not real calculations)

---

### 7. Barriers Section Accuracy 🚧
**Goal**: Check that barriers text makes sense

**Steps**:
1. Generate full report
2. Look at "Barriers to Participating" section
3. Check if it says something like:
   - Good: "Barriers have been minimal. Client attended 95% of sessions."
   - Good: "Primary barriers include fatigue and transport. However, EP intervention addresses..."
   - Bad: "Barriers to Participating: ..." (shouldn't repeat the heading)

**Expected**: Text should be prose without the section heading repeated
**Report if**: First line just repeats "Barriers to Participating:" or text doesn't flow

---

### 8. Clinical Accuracy (By Diagnosis) 🏥
**Goal**: Spot-check that clinical content matches condition

**Steps**:
1. Pick a diagnosis-specific test case (SCI, Stroke, CP if available)
2. Read through "Motor Impairments" section
3. Verify:
   - For **SCI**: Mentions wheelchair, spasticity, bladder/bowel, neurological level
   - For **Stroke**: Mentions affected/unaffected side, hemiplegia/hemiparesis
   - For **CP**: Mentions tone, motor control, functional limitations
4. Check "Secondary Complications" section
   - For **SCI at C level**: Should mention autonomic dysreflexia
   - For **Stroke**: Should mention sensory loss, visual field defects
5. Read "Rationale" sections
   - Should be specific to this diagnosis (not generic)

**Expected**: Content tailored to diagnosis, specific to client
**Report if**: Generic content (e.g., "typical SCI patient") or mismatched to diagnosis

---

### 9. DOCX Export Quality 📄
**Goal**: Check that Word document looks professional

**Steps**:
1. Generate full report
2. Click "Export as DOCX"
3. Open in Word
4. Check formatting:
   - [ ] No raw markdown (`**bold**`, `###`, etc.)
   - [ ] Proper spacing between sections
   - [ ] Pronouns correct (he/she matches client gender)
   - [ ] Client name appears in introduction
   - [ ] Tables are properly formatted (not pipe characters)
   - [ ] Page breaks reasonable (not orphaned headings)
5. Try printing to PDF
6. Check it looks clean

**Expected**: Professional, printable document with no formatting artifacts
**Report if**: Broken formatting, misaligned tables, visible markdown

---

### 10. Performance ⚡
**Goal**: Check generation speed

**Steps**:
1. Generate full report
2. Note time taken (watch the progress)
3. Individual sections should take 10-30 seconds each
4. Full report (13 sections) should take 2-4 minutes total
5. Export to DOCX should be instant

**Expected**: 
  - Per section: 15-25 seconds
  - Full report: <4 minutes
  - Export: <1 second

**Report if**: 
  - Any section takes >60 seconds
  - Full report takes >10 minutes
  - Model connection errors appear

---

## What NOT To Worry About (Known Issues, Already Documented)

- ❌ "Cannot connect to Ollama" on first try (sometimes needs retry)
- ❌ Some typos in sample data (test data is deliberately imperfect)
- ❌ Hardcoded costs in export (these are placeholders, being fixed)
- ❌ If a section truncates mid-sentence (token limit, split into micro-sections)

---

## Issue Reporting Format

If you find a problem, send a message with:

```
ISSUE: [Title]
SECTION: [Which section]
STEPS: 
  1. ...
  2. ...
EXPECTED: [What should happen]
ACTUAL: [What happened instead]
SCREENSHOT: [If applicable]
```

Example:
```
ISSUE: Rationale section missing Safety bullet
SECTION: Rationale (Safety)
STEPS:
  1. Generated full report for SCI client
  2. Checked Rationale section
EXPECTED: All 7 rationale bullets present
ACTUAL: Only 6 bullets visible (Safety missing)
```

---

## Critical Path Issues to Catch

These are the blockers that need fixing before wider testing:

1. **Rationale Section Completeness** — Must see all 7 bullets in export
2. **Reference Hallucination** — Check if citations are real or made up
3. **Table Rendering** — Should be proper Word tables, not markdown pipes
4. **Clinical Accuracy** — Content should match diagnosis-specific rules
5. **DOCX Export Quality** — Should be professional/printable

If any of these fail → report immediately, it blocks wider rollout.

---

## Success Criteria (Before Wider Testing)

✅ Must have:
- All 13 sections generate without errors
- All 7 rationale bullets appear in DOCX export
- Tables render properly in DOCX
- Clinical content is accurate per diagnosis
- DOCX export is printable/professional quality
- Generation completes in <5 minutes

---

**Start Time**: ___________
**End Time**: ___________
**Issues Found**: _________
**Overall Grade**: ____/10

Good luck! 🚀
