---
name: xlsx
description: Use this skill whenever you need to read and analyze the contents of Excel (.xlsx) files. This skill teaches you how to extract all sheets, tables, and structured data from .xlsx files so you can analyze them for requirements, data schemas, feature matrices, or any other information. Required for processing RFP spreadsheets, data models, or any .xlsx file in the rfp/ or app/ directories.
---

# XLSX Skill — Reading and Analyzing Excel Spreadsheets

An `.xlsx` file may contain multiple sheets, each with rows, columns, merged cells, formulas, and named tables. This skill extracts all readable content into structured markdown.

## Prerequisites Check (MANDATORY before running any script)

Before using this skill, verify the required tools exist. **Do not install anything without user permission.**

```bash
# Check Python
python --version || python3 --version

# Check openpyxl
python -c "import openpyxl; print('openpyxl OK')" 2>/dev/null || echo "MISSING: openpyxl"
```

If any dependency is missing, **stop and inform the user** with the exact install command:
```
pip install openpyxl
```
Ask for permission before installing. Only proceed once confirmed.

---

## Extraction Script

```bash
python .github/skills/xlsx/scripts/extract_xlsx.py rfp/data-model.xlsx
```

**Example:**
```bash
python .github/skills/xlsx/scripts/extract_xlsx.py rfp/requirements-matrix.xlsx > /tmp/xlsx_extracted.md
```

The script outputs **structured markdown** with:
- A list of all sheet names at the top
- Each sheet's content as a markdown table
- Sheet names as section headers
- Non-empty cells only — empty rows/columns are skipped
- Merged cell values are preserved under the first cell

---

## Sample Output Format

```markdown
# Workbook: requirements-matrix.xlsx

## Sheets
1. Functional Requirements
2. Non-Functional Requirements
3. Data Model

---

## Sheet: Functional Requirements

| ID | Requirement | Priority | Module | Acceptance Criteria |
|----|-------------|----------|--------|---------------------|
| FR-001 | User must be able to log in with SSO | Must | Auth | Login with corporate credentials succeeds |
| FR-002 | Dashboard must show KPI widgets | Must | Dashboard | At least 4 KPI widgets visible |
| FR-003 | Export to CSV | Should | Reports | All table views have export button |

---

## Sheet: Data Model

| Entity | Attribute | Type | Required | Notes |
|--------|-----------|------|----------|-------|
| User | userId | UUID | Yes | Primary key |
| User | email | String | Yes | Unique |
...
```

---

## Extracting Specific Sheets

```bash
# Extract only one sheet
python .github/skills/xlsx/scripts/extract_xlsx.py rfp/data.xlsx --sheet "Functional Requirements"

# List all sheet names without extracting content
python .github/skills/xlsx/scripts/extract_xlsx.py rfp/data.xlsx --list-sheets
```

---

## How to Analyze the Extracted Content

1. **List all sheets first** — understand what categories of information are present
2. **Requirements sheets** — look for columns named "ID", "Requirement", "Priority", "Acceptance Criteria"
3. **Data model sheets** — look for entity names, attribute types → these define data structure requirements
4. **Feature matrix sheets** — rows are features, columns are modules or user roles (checkbox-style tables)
5. **Priority column** — convert values (High/Medium/Low or MoSCoW) to `Must/Should/Could` in your PRD

---

## Common XLSX Patterns in RFP Documents

| Sheet name pattern | Content type | How to use |
|-------------------|--------------|------------|
| "Requirements", "FR", "Functional" | Functional requirements list | Direct extraction as FR-xxx items |
| "NFR", "Non-functional" | NFR items | Map to NFR-xxx items |
| "Data Model", "Schema", "Entities" | Data structure definition | Informs backend requirements |
| "Roles", "Personas", "Users" | User role definitions | Informs permission requirements |
| "Milestones", "Roadmap" | Priority/timeline | Helps determine Must vs Should |
| "Glossary" | Term definitions | Use for understanding other sheets |

---

## Handling Large Spreadsheets

For spreadsheets with many rows (>500 rows per sheet):

```bash
# Extract with a row limit per sheet to get a representative sample
python .github/skills/xlsx/scripts/extract_xlsx.py rfp/large-data.xlsx --max-rows 100
```

If the sheet is truncated, the script will print a warning. In that case, ask if you should process the full file (it may take longer).

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `InvalidFileException` | File is `.xls` not `.xlsx` | Ask user to save as `.xlsx` (Excel → Save As → .xlsx) |
| `KeyError` on sheet name | Sheet was renamed | Use `--list-sheets` first |
| Formula cells show `None` | Formula result not cached | Script evaluates formulas where possible |
| Password protection | Encrypted file | Ask user for unprotected copy |