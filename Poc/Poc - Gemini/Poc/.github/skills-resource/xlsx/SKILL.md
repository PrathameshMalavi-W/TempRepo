---
name: xlsx-resource
description: "Use this skill when you need to read, extract, recalculate, or create Excel spreadsheets (.xlsx files). This approach uses openpyxl for reading and formula-evaluated data extraction, with LibreOffice for formula recalculation. Use for reading RFP data, requirements matrices, budget tables, or feature lists in Excel. Do NOT use for DOCX, PDF, or PPTX files."
---

# XLSX — Read, Extract, Recalculate (Resource Approach)

This skill uses `openpyxl` for reading Excel data. For formula recalculation, LibreOffice is required.

## Quick Reference

| Task | Approach |
|------|----------|
| Read cell values | `openpyxl` with `data_only=True` |
| Read formulas | `openpyxl` with `data_only=False` |
| Recalculate formulas | LibreOffice (headless) |
| List sheets | `openpyxl` |
| Convert to markdown | Custom extraction script |

---

## Dependency Check (Always Do First)

```bash
python -c "import openpyxl; print('openpyxl OK')"
```

If missing, ask user permission:
```bash
pip install openpyxl
```

---

## Reading Workbook Content

### List All Sheets

```python
import openpyxl

wb = openpyxl.load_workbook("data.xlsx", data_only=True)
print("Sheets:")
for i, name in enumerate(wb.sheetnames, 1):
    ws = wb[name]
    print(f"  {i}. {name} ({ws.max_row} rows × {ws.max_column} cols)")
```

### Extract a Sheet to Markdown

```python
import openpyxl

def sheet_to_markdown(ws, max_rows=None):
    """Convert an openpyxl worksheet to markdown table."""
    data = []
    for row in ws.iter_rows(values_only=True):
        # Skip completely empty rows
        if all(v is None for v in row):
            continue
        cleaned = [str(v).replace("\n", " ").strip() if v is not None else "" for v in row]
        # Strip trailing empty cells
        while cleaned and cleaned[-1] == "":
            cleaned.pop()
        if cleaned:
            data.append(cleaned)
    
    if not data:
        return "*[Sheet is empty]*"
    
    if max_rows and len(data) > max_rows + 1:
        data = data[:max_rows + 1]
        truncated = True
    else:
        truncated = False
    
    col_count = max(len(row) for row in data)
    lines = []
    for i, row in enumerate(data):
        padded = row + [""] * (col_count - len(row))
        escaped = [c.replace("|", "\\|") for c in padded]
        lines.append("| " + " | ".join(escaped) + " |")
        if i == 0:
            lines.append("| " + " | ".join(["---"] * col_count) + " |")
    
    if truncated:
        lines.append(f"\n*[Truncated at {max_rows} rows]*")
    
    return "\n".join(lines)

# Usage
wb = openpyxl.load_workbook("data.xlsx", data_only=True)
for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    print(f"\n## Sheet: {sheet_name}\n")
    print(sheet_to_markdown(ws, max_rows=100))
```

### Read Specific Sheet

```python
wb = openpyxl.load_workbook("data.xlsx", data_only=True)

# Exact name
ws = wb["Functional Requirements"]

# Partial name match (case-insensitive)
target = "requirements"
matching = [name for name in wb.sheetnames if target.lower() in name.lower()]
if matching:
    ws = wb[matching[0]]
```

---

## Formula Recalculation (LibreOffice)

When `data_only=True` returns `None` for formula cells (formula not cached), use LibreOffice to force recalculation:

```bash
# Recalculate and save a copy
soffice --headless --norestore --convert-to xlsx --outdir ./recalced/ data.xlsx
```

After recalculation, read the output file normally with `data_only=True`.

Check LibreOffice is available:
```bash
soffice --version
```

If missing: https://www.libreoffice.org/download/download/

---

## Detecting Formula vs Value Cells

```python
# With data_only=False to see formulas
wb_formulas = openpyxl.load_workbook("data.xlsx", data_only=False)
ws = wb_formulas.active

formula_cells = []
for row in ws.iter_rows():
    for cell in row:
        if cell.value and isinstance(cell.value, str) and cell.value.startswith("="):
            formula_cells.append(f"{cell.coordinate}: {cell.value}")

print(f"Found {len(formula_cells)} formula cells:")
for f in formula_cells[:20]:
    print(f"  {f}")
```

---

## Detecting Excel Errors in Cells

After loading with `data_only=True`, check for error values:

```python
EXCEL_ERRORS = ["#VALUE!", "#DIV/0!", "#REF!", "#NAME?", "#NULL!", "#NUM!", "#N/A"]

wb = openpyxl.load_workbook("data.xlsx", data_only=True)
for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    for row in ws.iter_rows():
        for cell in row:
            if cell.value and isinstance(cell.value, str):
                for err in EXCEL_ERRORS:
                    if err in cell.value:
                        print(f"Error in {sheet_name}!{cell.coordinate}: {cell.value}")
```

---

## Full RFP Extraction

```python
import openpyxl
import sys

def extract_xlsx(filepath, sheet_filter=None):
    wb = openpyxl.load_workbook(filepath, data_only=True)
    
    out = [f"# Workbook: {filepath}\n"]
    out.append("## Sheets")
    for i, name in enumerate(wb.sheetnames, 1):
        out.append(f"{i}. {name}")
    out.append("\n---")
    
    sheets = wb.sheetnames
    if sheet_filter:
        sheets = [s for s in sheets if sheet_filter.lower() in s.lower()]
    
    for sheet_name in sheets:
        ws = wb[sheet_name]
        out.append(f"\n## Sheet: {sheet_name}\n")
        out.append(sheet_to_markdown(ws))
    
    return "\n".join(out)

if __name__ == "__main__":
    print(extract_xlsx(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
```

---

## Dependencies

| Package | Purpose | Install |
|---------|---------|---------|
| `openpyxl` | Read/write XLSX | `pip install openpyxl` |
| LibreOffice | Formula recalculation | https://www.libreoffice.org |

**Always check and ask permission before installing.**
