---
name: docx-resource
description: "Use this skill when you need to read, create, or edit Word documents (.docx files). This approach uses pandoc for reading content and docx-js (JavaScript) for creating new documents. Use for reading RFP documents, extracting text with tracked changes visible, creating professional Word documents, editing existing DOCX via XML unpacking, or converting .doc to .docx. Do NOT use for PDFs, spreadsheets, or Google Docs."
---

# DOCX — Read, Create, Edit (Resource Approach)

This skill uses the approach documented in the organization's reference material:
- **Reading**: `pandoc` (fastest, best quality)
- **Creating new documents**: `docx` npm package (JavaScript)
- **Editing existing documents**: Unpack XML → edit → repack

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyze content | `pandoc` |
| Create new document | `docx` npm package |
| Edit existing document | Unpack → edit XML → repack |
| Convert .doc → .docx | LibreOffice via `soffice` |

---

## Reading Content (Primary Use for RFP Extraction)

### Using pandoc (Recommended)

```bash
# Check pandoc is installed
pandoc --version

# Extract text to markdown (preserves structure)
pandoc document.docx -o output.md

# Extract with tracked changes visible
pandoc --track-changes=all document.docx -o output.md

# Extract to plain text
pandoc document.docx -t plain -o output.txt
```

**pandoc produces clean markdown** preserving headings, tables, bold/italic, and lists. This is the simplest and fastest reading approach.

### Dependency Check

Before using pandoc, verify it is installed:

```bash
pandoc --version
```

If missing, ask the user:
> "pandoc is required to read this DOCX file. May I install it? On Windows: `winget install JohnMacFarlane.Pandoc` or download from https://pandoc.org/installing.html"

---

## Creating New Documents

Use the `docx` npm package. Install once:
```bash
npm install -g docx
```

### Basic Setup

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
        HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber } = require('docx');
const fs = require('fs');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync('output.docx', buffer));
```

### Page Size (Always Set Explicitly)

```javascript
// docx defaults to A4 — set explicitly for US Letter
sections: [{
  properties: {
    page: {
      size: { width: 12240, height: 15840 },  // 8.5 x 11 inches (1440 DXA = 1 inch)
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }
  },
  children: [/* content */]
}]
```

### Headings and Styles

```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  sections: [{ children: [
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] }),
  ]}]
});
```

### Tables

```javascript
// CRITICAL: Set both columnWidths on table AND width on each cell
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],  // Must sum to table width
  rows: [new TableRow({
    children: [new TableCell({
      borders,
      width: { size: 4680, type: WidthType.DXA },
      shading: { fill: "D5E8F0", type: ShadingType.CLEAR },  // CLEAR not SOLID
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun("Cell")] })]
    })]
  })]
})
```

### Lists (Never use unicode bullets)

```javascript
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{ children: [
    new Paragraph({ numbering: { reference: "bullets", level: 0 },
      children: [new TextRun("Bullet item")] }),
  ]}]
});
```

### Headers and Footers

```javascript
sections: [{
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("Header")] })] })
  },
  footers: {
    default: new Footer({ children: [new Paragraph({
      children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
    })] })
  },
  children: [/* content */]
}]
```

### Critical Rules

- **Set page size explicitly**: defaults to A4
- **Never use `\n`**: use separate Paragraph elements
- **Never use unicode bullets**: use `LevelFormat.BULLET` with numbering config
- **Always use `WidthType.DXA`**: never `WidthType.PERCENTAGE` (breaks in Google Docs)
- **Tables need dual widths**: `columnWidths` array AND cell `width`
- **Use `ShadingType.CLEAR`**: never SOLID for table shading

---

## Editing Existing Documents

Three-step process: **Unpack → Edit XML → Repack**

### Step 1: Unpack
```bash
# Extract DOCX into readable XML files
python -c "
import zipfile, shutil, pathlib
z = zipfile.ZipFile('document.docx')
z.extractall('unpacked/')
print('Unpacked to unpacked/')
"
```

### Step 2: Edit XML
- Main document content is in `unpacked/word/document.xml`
- Edit the XML directly using the Edit tool
- Use `"Claude"` as the author for tracked changes

**Tracked Change — Insertion:**
```xml
<w:ins w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>
```

**Tracked Change — Deletion:**
```xml
<w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
```

### Step 3: Repack
```bash
python -c "
import zipfile, pathlib
with zipfile.ZipFile('output.docx', 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in pathlib.Path('unpacked').rglob('*'):
        if f.is_file():
            zf.write(f, f.relative_to('unpacked'))
print('Repacked to output.docx')
"
```

---

## Converting .doc to .docx

Legacy `.doc` files need conversion first:

```bash
# Using LibreOffice (must be installed)
soffice --headless --convert-to docx document.doc

# Verify LibreOffice is available
soffice --version
```

---

## Dependencies

| Tool | Purpose | Install |
|------|---------|---------|
| `pandoc` | Read DOCX to markdown | `winget install JohnMacFarlane.Pandoc` |
| `docx` (npm) | Create new DOCX | `npm install -g docx` |
| LibreOffice | Convert .doc to .docx | https://www.libreoffice.org |

**Always check before using:**
```bash
pandoc --version    # for reading
node -e "require('docx')" 2>/dev/null || echo "MISSING: npm install -g docx"
```
