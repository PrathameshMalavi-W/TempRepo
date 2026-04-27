---
name: pdf-resource
description: "Use this skill when you need to read, analyze, fill, or convert PDF files. This approach uses pdfplumber for text/table extraction, pdf2image for rendering pages as images, and pypdf2 for form field work. Use for reading RFP PDFs, extracting tables, filling PDF forms, identifying scanned vs text-based PDFs. Do NOT use for DOCX, XLSX, or PPTX files."
---

# PDF — Read, Extract, Convert (Resource Approach)

This skill covers reading PDFs for content extraction. For RFP analysis, the primary goal is extracting text, tables, and structure.

## Quick Reference

| Task | Tool |
|------|------|
| Extract text | `pdfplumber` (text-based PDFs) |
| Extract tables | `pdfplumber` |
| Render pages as images | `pdf2image` + `poppler` |
| Fill form fields | `pypdf` |
| Check if scanned | Attempt text extraction; if empty → scanned |

---

## Dependency Check (Always Do First)

```bash
python -c "import pdfplumber; print('pdfplumber OK')"
python -c "import pypdf; print('pypdf OK')"
```

If missing, ask user permission before installing:
```bash
pip install pdfplumber pypdf pdf2image
```

For image conversion, also need `poppler`:
- **Windows**: `winget install oschwartz10612.poppler` or from https://github.com/oschwartz10612/poppler-windows
- **Linux**: `apt install poppler-utils`

---

## Reading Text Content

### Text-Based PDFs

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    for i, page in enumerate(pdf.pages, start=1):
        text = page.extract_text()
        if text:
            print(f"\n--- Page {i} ---")
            print(text)
```

### Specific Page Range

```python
with pdfplumber.open("document.pdf") as pdf:
    # Extract pages 2-5 (0-indexed)
    for page in pdf.pages[1:5]:
        print(page.extract_text())
```

### Detecting Scanned PDFs

```python
with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
    if not text or len(text.strip()) < 10:
        print("WARNING: PDF appears to be scanned/image-based.")
        print("Text extraction will not work. The document may need OCR processing.")
    else:
        print("PDF is text-based — extraction will work.")
```

---

## Extracting Tables

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages, start=1):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"\nPage {i}, Table {j+1}:")
            for row in table:
                # Clean None values
                clean_row = [cell or "" for cell in row]
                print(" | ".join(clean_row))
```

**Convert table to markdown:**
```python
def table_to_markdown(table):
    if not table:
        return ""
    rows = []
    for i, row in enumerate(table):
        cells = [str(c or "").replace("|", "\\|").strip() for c in row]
        rows.append("| " + " | ".join(cells) + " |")
        if i == 0:
            rows.append("| " + " | ".join(["---"] * len(cells)) + " |")
    return "\n".join(rows)
```

---

## Rendering Pages as Images

Useful when a page has complex layout or is scanned:

```python
from pdf2image import convert_from_path

# Convert all pages to images
images = convert_from_path("document.pdf", dpi=150)
for i, img in enumerate(images, start=1):
    img.save(f"page_{i}.jpg", "JPEG")
    print(f"Saved page_{i}.jpg")
```

---

## PDF Form Fields

```python
import pypdf

reader = pypdf.PdfReader("form.pdf")

# List all fields
if reader.get_form_text_fields():
    print("Form fields found:")
    for name, value in reader.get_form_text_fields().items():
        print(f"  {name}: {value}")
else:
    print("No form fields found in this PDF.")
```

---

## Full Extraction Flow for RFP

```python
import pdfplumber
import sys

def extract_rfp_pdf(filepath):
    """Extract full RFP PDF content to structured markdown."""
    with pdfplumber.open(filepath) as pdf:
        output = [f"# PDF: {filepath}\n", f"**Total pages:** {len(pdf.pages)}\n", "---\n"]
        
        for i, page in enumerate(pdf.pages, start=1):
            output.append(f"\n## Page {i}\n")
            
            # Text
            text = page.extract_text()
            if text:
                output.append(text.strip())
            
            # Tables
            tables = page.extract_tables()
            for table in tables:
                if table:
                    output.append("\n**Table:**")
                    for j, row in enumerate(table):
                        cells = [str(c or "").replace("|", "\\|").strip() for c in row]
                        output.append("| " + " | ".join(cells) + " |")
                        if j == 0:
                            output.append("| " + " | ".join(["---"] * len(cells)) + " |")
            
            output.append("\n---")
        
        return "\n".join(output)

if __name__ == "__main__":
    print(extract_rfp_pdf(sys.argv[1]))
```

---

## Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `pdfplumber` | Text + table extraction | `pip install pdfplumber` |
| `pypdf` | Form fields, metadata | `pip install pypdf` |
| `pdf2image` | Page-to-image rendering | `pip install pdf2image` |
| `poppler` | Backend for pdf2image | System package (see above) |

**Always check and ask permission before installing.**
