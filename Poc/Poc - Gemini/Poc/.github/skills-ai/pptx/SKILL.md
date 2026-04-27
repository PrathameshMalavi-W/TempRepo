---
name: pptx
description: Use this skill whenever you need to read and analyze the contents of PowerPoint (.pptx) files. This skill teaches you how to extract slide titles, text content, speaker notes, and tables from .pptx files so you can analyze them for requirements, business context, or other information. Required for processing RFP presentations, stakeholder decks, or any .pptx file in the rfp/ or app/ directories.
---

# PPTX Skill — Reading and Analyzing PowerPoint Presentations

A `.pptx` file is a binary ZIP archive. Slide content includes title text, body text, speaker notes, embedded tables, and charts. This skill extracts all readable text content.

## Prerequisites Check (MANDATORY before running any script)

Before using this skill, verify the required tools exist. **Do not install anything without user permission.**

```bash
# Check Python
python --version || python3 --version

# Check python-pptx
python -c "from pptx import Presentation; print('python-pptx OK')" 2>/dev/null || echo "MISSING: python-pptx"
```

If any dependency is missing, **stop and inform the user** with the exact install command:
```
pip install python-pptx
```
Ask for permission before installing. Only proceed once confirmed.

---

## Extraction Script

```bash
python .github/skills-ai/pptx/scripts/extract_pptx.py rfp/presentation.pptx
```

**Example:**
```bash
python .github/skills-ai/pptx/scripts/extract_pptx.py rfp/solution-overview.pptx > /tmp/pptx_extracted.md
```

The script outputs **structured markdown** with:
- Slide number and title for every slide
- All text from every text box / placeholder
- Speaker notes (often contain additional context not on the slide)
- Tables rendered as markdown tables
- Clear slide separators (`---`) for navigation

---

## Sample Output Format

```markdown
## Slide 1: Executive Summary

**Title:** Executive Summary

**Content:**
- Key objective: Replace legacy HR system
- Target go-live: Q3 2025
- Budget: €500,000

**Notes:**
The HR department has highlighted data migration as the top risk...

---

## Slide 2: Current System Overview

**Title:** Current System Overview

| Module | Status | Priority |
|--------|--------|----------|
| Payroll | Legacy | High |
| Timesheets | Legacy | Medium |
...
```

---

## How to Analyze the Extracted Content

1. **Read slide titles first** — they tell you the document's narrative arc
2. **Speaker notes are gold** — presenters often add detailed explanations in notes that never appear on slides
3. **Look for requirement slides** — usually titled "Must Have", "User Stories", "Functional Requirements"
4. **Tables on slides** — often contain feature comparison matrices or priority rankings
5. **Last slides** — "Next Steps", "Appendix" slides often contain additional requirements

---

## Common PPTX Patterns in RFP Documents

| Pattern | What to extract |
|---------|----------------|
| Requirements slide | Bullet lists of "must have" / "nice to have" features |
| Architecture overview | System component names → map to OneCX capabilities |
| User persona slides | User roles and their needs → functional requirements |
| Timeline/Roadmap slides | Priority ordering of features |
| Compliance slides | Non-functional requirements |

---

## Notes on Charts and Images

Charts and images embedded in slides **cannot be read as text** — only the chart title and axis labels (if present as text boxes). If a slide contains only a diagram, note it as "Slide N: [Image/Chart — content not extractable]" and continue.

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `BadZipFile` | File is `.ppt` not `.pptx` | Ask user to save as `.pptx` first (Open in PowerPoint → Save As → .pptx) |
| Empty output | Password-protected file | Ask user for unprotected version |
| Missing slides | File corruption | Script skips corrupted slides and continues |
