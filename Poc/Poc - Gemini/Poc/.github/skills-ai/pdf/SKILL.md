---
name: pdf
description: Use this skill whenever you need to read and analyze the contents of PDF files. This skill teaches you how to extract text, tables, and structured content from .pdf files so you can analyze them for requirements, data, or other information. Required for processing RFP documents, architecture documents, or any .pdf file in the rfp/ or app/ directories.
---

# PDF Skill — Reading and Analyzing PDF Documents

A PDF file may contain text as selectable layers (text-based PDF) or as scanned images (image-based PDF). This skill covers both cases.

## Prerequisites Check (MANDATORY before running any script)

Before using this skill, verify the required tools exist. **Do not install anything without user permission.**

```bash
# Check Python
python --version || python3 --version

# Check pdfplumber (primary extraction tool)
python -c "import pdfplumber; print('pdfplumber OK')" 2>/dev/null || echo "MISSING: pdfplumber"

# Check pymupdf as fallback
python -c "import fitz; print('pymupdf OK')" 2>/dev/null || echo "MISSING: pymupdf (optional fallback)"
```

If any dependency is missing, **stop and inform the user** with the exact install command:
```
pip install pdfplumber
# Optional fallback: pip install pymupdf
```
Ask for permission before installing. Only proceed once confirmed.

---

## Step 1: Determine PDF Type

First, check if the PDF contains selectable text or is a scanned image:

```bash
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/document.pdf --check-type
```

The script will output either:
- `TEXT_BASED` — has selectable text, full extraction possible
- `IMAGE_BASED` — scanned document, text extraction limited without OCR

---

## Method 1: Text-Based PDF Extraction (Most Common)

```bash
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/document.pdf
```

**Example:**
```bash
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/tender-requirements.pdf > /tmp/pdf_extracted.md
```

The script outputs **structured markdown** with:
- Page-by-page text with page number markers
- Tables detected and rendered as markdown tables
- Headings inferred from font size/bold formatting
- Bullet points and numbered lists preserved

---

## Method 2: Image-Based PDF (Scanned Documents)

If the PDF is scanned, the script will automatically warn you. In this case:

```bash
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/scanned.pdf --pages 1-5
```

For scanned PDFs, the script extracts whatever text is embedded. If the output is empty or garbled, inform the user that the PDF is image-only and OCR tools (like `tesseract`) would be needed for accurate extraction. Do not install OCR tools without explicit user permission.

---

## Method 3: Direct Page Reading (for small PDFs)

For PDFs with fewer than 10 pages, you can read them page by page using pdfplumber directly in the script context. The extraction script handles this automatically.

---

## How to Analyze the Extracted Content

Once you have the extracted markdown:

1. **Scan page markers** — understand the overall structure of the document
2. **Look for requirement keywords:** "shall", "must", "will", "should", "required", "mandatory"
3. **Extract tables:** Often contain requirement IDs, priority levels, acceptance criteria
4. **Check the table of contents** (usually on page 1-3) to understand which sections matter
5. **Focus on sections flagged in `rfp/SCOPE.md`** — do not extract requirements from out-of-scope sections

---

## Common PDF Patterns in RFP Documents

| Pattern | Pages to check |
|---------|---------------|
| Executive summary | First 1-5 pages |
| Functional requirements | Middle sections, often labeled "Section 3" or "Chapter 4" |
| Technical specifications | Usually after functional requirements |
| Compliance requirements | Near the end, labeled "Standards", "Compliance", "Regulatory" |
| Glossary/Appendix | Last pages — defines abbreviations used throughout |

---

## Extracting Specific Page Ranges

```bash
# Extract only pages 10-25
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/document.pdf --pages 10-25

# Extract a single page
python .github/skills-ai/pdf/scripts/extract_pdf.py rfp/document.pdf --pages 15
```

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `PdfReadError` | Corrupted or encrypted PDF | Ask user to provide an unencrypted version |
| Empty output | Image-based PDF | Inform user, suggest OCR or ask for a text version |
| Garbled text | Non-standard encoding | Try pymupdf as fallback: script auto-retries |
| Memory error | Very large PDF (>500 pages) | Use `--pages` to process in chunks |
