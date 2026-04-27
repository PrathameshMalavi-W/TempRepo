---
name: pptx-resource
description: "Use this skill when you need to read, extract content from, create, or edit PowerPoint presentations (.pptx files). This approach uses python-pptx for content extraction and pptxgenjs (JavaScript) for creating new slides. Use for reading RFP presentations, extracting slide content and speaker notes, creating new presentations. Do NOT use for DOCX, PDF, or XLSX files."
---

# PPTX — Read, Create, Edit (Resource Approach)

This skill uses `python-pptx` for reading and `pptxgenjs` for creation.

## Quick Reference

| Task | Approach |
|------|----------|
| Read / extract content | `python-pptx` |
| Create new presentation | `pptxgenjs` (JavaScript) |
| Edit slides | `python-pptx` |
| Convert to images | LibreOffice → PDF → `pdftoppm` |

---

## Dependency Check (Always Do First)

```bash
python -c "from pptx import Presentation; print('python-pptx OK')"
```

If missing, ask user permission:
```bash
pip install python-pptx
```

---

## Reading Presentations

### Extract All Slide Content

```python
from pptx import Presentation

prs = Presentation("presentation.pptx")
print(f"Total slides: {len(prs.slides)}")

for i, slide in enumerate(prs.slides, start=1):
    print(f"\n=== Slide {i} ===")
    
    # Title
    try:
        if slide.shapes.title and slide.shapes.title.text:
            print(f"Title: {slide.shapes.title.text.strip()}")
    except Exception:
        pass
    
    # All text shapes
    for shape in slide.shapes:
        if shape.has_text_frame:
            for para in shape.text_frame.paragraphs:
                text = para.text.strip()
                if text:
                    print(f"  {'  ' * para.level}- {text}")
    
    # Tables
    for shape in slide.shapes:
        if shape.has_table:
            print("\n  [Table]")
            for row in shape.table.rows:
                cells = [cell.text.strip() for cell in row.cells]
                print("  | " + " | ".join(cells) + " |")
    
    # Speaker notes
    try:
        notes = slide.notes_slide.notes_text_frame.text.strip()
        if notes:
            print(f"\n  [Speaker Notes]\n  {notes}")
    except Exception:
        pass
```

### Extract to Markdown

```python
from pptx import Presentation

def pptx_to_markdown(filepath):
    prs = Presentation(filepath)
    lines = [f"# Presentation: {filepath}\n", f"**Slides:** {len(prs.slides)}\n", "---"]
    
    for i, slide in enumerate(prs.slides, start=1):
        title = ""
        try:
            if slide.shapes.title:
                title = slide.shapes.title.text.strip()
        except Exception:
            pass
        
        lines.append(f"\n## Slide {i}: {title or '[No Title]'}")
        
        for shape in slide.shapes:
            try:
                if shape == slide.shapes.title:
                    continue
            except Exception:
                pass
            
            if shape.has_table:
                lines.append("\n**Table:**")
                for j, row in enumerate(shape.table.rows):
                    cells = [c.text.replace("\n", " ").strip() for c in row.cells]
                    lines.append("| " + " | ".join(cells) + " |")
                    if j == 0:
                        lines.append("| " + " | ".join(["---"] * len(cells)) + " |")
            
            elif shape.has_text_frame:
                for para in shape.text_frame.paragraphs:
                    text = para.text.strip()
                    if text:
                        lines.append("  " * para.level + f"- {text}")
        
        try:
            notes = slide.notes_slide.notes_text_frame.text.strip()
            if notes:
                lines.append(f"\n> **Notes:** {notes}")
        except Exception:
            pass
        
        lines.append("\n---")
    
    return "\n".join(lines)
```

---

## Creating New Presentations (pptxgenjs)

For creating PPTX files, use `pptxgenjs` (JavaScript):

```bash
npm install pptxgenjs
```

```javascript
const PptxGenJS = require("pptxgenjs");
const pptx = new PptxGenJS();

// Add a slide
const slide = pptx.addSlide();

// Add title
slide.addText("Slide Title", {
    x: 0.5, y: 0.5, w: "90%", h: 1.5,
    fontSize: 36, bold: true, color: "363636"
});

// Add content
slide.addText("Content here", {
    x: 0.5, y: 2, w: "90%", h: 4,
    fontSize: 18, color: "666666"
});

// Add a table
slide.addTable(
    [
        [{ text: "Header 1", options: { bold: true, fill: "003366", color: "FFFFFF" } },
         { text: "Header 2", options: { bold: true, fill: "003366", color: "FFFFFF" } }],
        ["Row 1 Col 1", "Row 1 Col 2"],
    ],
    { x: 0.5, y: 2, w: 9, fontSize: 14 }
);

pptx.writeFile({ fileName: "output.pptx" })
    .then(() => console.log("Saved output.pptx"));
```

---

## Converting Slides to Images

```bash
# Step 1: Convert PPTX to PDF via LibreOffice
soffice --headless --convert-to pdf presentation.pptx

# Step 2: Render PDF pages as images
pdftoppm -jpeg -r 150 presentation.pdf slide

# Result: slide-1.jpg, slide-2.jpg, etc.
```

---

## Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `python-pptx` | Read/edit PPTX | `pip install python-pptx` |
| `pptxgenjs` | Create new PPTX | `npm install pptxgenjs` |
| LibreOffice | PPTX → PDF conversion | https://www.libreoffice.org |
| poppler (pdftoppm) | PDF → images | `winget install oschwartz10612.poppler` |

**Always check and ask permission before installing.**
