---
name: docx
description: Use this skill whenever you need to read and analyze the contents of DOCX (Word) files. This skill teaches you how to extract text, tables, headings, and structured content from .docx files so you can analyze them for requirements, data, or other information. Required for processing RFP documents, legacy app documentation, or any .docx file in the rfp/ or app/ directories.
---

# DOCX Skill — Reading and Analyzing Word Documents

A `.docx` file is a binary ZIP archive containing XML. You cannot read it directly as text. This skill provides you with the exact steps to extract its content into a form you can analyze.

## Prerequisites Check (MANDATORY before running any script)

Before using this skill, verify the required tools exist. **Do not install anything without user permission.**

```bash
# Check Python
python --version || python3 --version

# Check python-docx
python -c "import docx; print('python-docx OK')" 2>/dev/null || echo "MISSING: python-docx"

# Check pandoc (alternative extraction method)
pandoc --version 2>/dev/null || echo "MISSING: pandoc"
```

If any dependency is missing, **stop and inform the user** with the exact install command:
```
pip install python-docx
# OR for pandoc: https://pandoc.org/installing.html
```
Ask for permission before installing. Only proceed once confirmed.

---

## Method 1: Script-Based Extraction (Recommended)

Run the extraction script located in this skill's `scripts/` directory:

```bash
python .github/skills-ai/docx/scripts/extract_docx.py <path-to-file.docx>
```

**Example:**
```bash
python .github/skills-ai/docx/scripts/extract_docx.py rfp/requirements.docx
```

The script outputs **structured markdown** to stdout, organized as:
- Document metadata (title, author, created date)
- All headings (H1–H6) preserving hierarchy
- Paragraph text under each heading
- Tables rendered as markdown tables
- Bullet/numbered list items

**Capture the output for analysis:**
```bash
python .github/skills-ai/docx/scripts/extract_docx.py rfp/requirements.docx > /tmp/docx_extracted.md
```

---

## Method 2: Pandoc (Simpler, if pandoc is available)

```bash
pandoc rfp/requirements.docx -o /tmp/requirements_extracted.md --track-changes=all
```

This converts the entire Word document to Markdown. The `--track-changes=all` flag includes tracked change content.

---

## How to Analyze the Extracted Content

Once you have the extracted markdown:

1. **Scan all headings first** — these define the document structure and section names
2. **Look for requirement keywords:** "shall", "must", "will", "should", "required", "mandatory"
3. **Extract tables:** Tables often contain structured requirements, data schemas, or feature matrices
4. **Read bullet lists:** These commonly enumerate functional requirements or acceptance criteria
5. **Check appendices:** Requirements are often hidden in appendices labeled "Annex", "Appendix A", etc.

---

## Common DOCX Patterns in RFP Documents

| Pattern | Where to look |
|---------|--------------|
| Functional requirements | Numbered sections, tables with "ID / Description / Priority" columns |
| Data models | Tables with column names and data types |
| User stories | Bullet lists with "As a [user], I want..." |
| Acceptance criteria | Lists under each requirement numbered item |
| Scope boundaries | "In Scope" / "Out of Scope" sections |

---

## Handling Multi-Section Documents

If the DOCX has multiple sections or is very large, extract section by section:

```bash
# The script supports filtering by heading keyword
python .github/skills-ai/docx/scripts/extract_docx.py rfp/requirements.docx --section "Functional Requirements"
```

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `PackageNotFoundError` | File is `.doc` not `.docx` | Ask user to save as `.docx` first |
| `BadZipFile` | Corrupted file | Try pandoc as fallback |
| `UnicodeDecodeError` | Encoding issue | Script handles this automatically with fallback encoding |
| File not found | Wrong path | Check the exact filename and path in `rfp/` |
