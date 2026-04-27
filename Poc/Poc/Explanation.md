# OneCX POC Generation System - Complete Explanation & Task Documentation

**Last Updated:** April 27, 2026  
**For Users Who Are New:** This is a detailed guide. Read from top to bottom with accompanying examples.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [What You Need to Know - Three Core Concepts](#2-what-you-need-to-know---three-core-concepts)
   - [Dev Container](#what-is-a-dev-container)
   - [RFP (Request for Proposal)](#what-is-rfp-request-for-proposal)
   - [RFP Skills](#what-are-rfp-skills)
3. [Architecture & Workflow](#3-architecture--workflow)
4. [Skills System Deep Dive](#4-skills-system-deep-dive)
5. [Tasks & Implementation Plan](#5-tasks--implementation-plan)
6. [Required Libraries & Environment Setup](#6-required-libraries--environment-setup)
7. [References & External Resources](#7-references--external-resources)

---

## 1. System Overview

### What is OneCX Forge?

**OneCX Forge** is an **AI-powered orchestration system** that automatically generates fully working **Proof of Concept (PoC)** applications based on the OneCX enterprise platform. It runs inside **VS Code** with **GitHub Copilot** and uses a **multi-agent workflow** to transform requirements into a working application.

**Who uses it?**
- Enterprise architects who need to rapidly prototype OneCX solutions
- Business analysts who have RFP documents and need to turn them into working code
- System integrators who need to migrate legacy applications to OneCX
- Anyone with a custom business requirement who wants a quick PoC

**How does the user invoke it?**
```
User opens VS Code Chat and types:
→ /create-rfp-poc     (for RFP-based generation)
→ /migrate-legacy-app (for legacy app migration)
→ /create-custom-poc  (for custom requirements)
```

**What does it produce?**
A complete, working OneCX Angular application in a subfolder, ready to run locally or deployed to a dev environment.

---

## 2. What You Need to Know - Three Core Concepts

### 2.1: What is a Dev Container? 

**In Simple Terms:**
A **dev container** is a **Docker container** that has been pre-configured to be your **complete development environment**. Instead of installing Node.js, npm, git, Python, and 100 other tools on your computer, you tell Docker to build and run a container that already has all of them.

**Key Benefits:**

| Benefit | What It Means |
|---|---|
| **Consistency** | Everyone on your team uses the *exact same environment* — same Node version, same installed tools. No "but it works on my machine!" |
| **Isolation** | Your dev environment is isolated from your operating system. You can have multiple projects with different tool versions running simultaneously. |
| **Reproducibility** | Anyone new to the team can open the repo in VS Code, and VS Code automatically builds the dev container. They're ready in seconds. |
| **No Installation Headaches** | You don't pollute your system with 50 different versions of Node.js or Python. |

**Visual Example:**

```
WITHOUT Dev Container:
┌─────────────────────────────────────┐
│        Your Windows Machine         │
│  ┌─────────────────────────────────┐│
│  │    VS Code Editor               ││
│  │  ┌─────────────────────────────┐││
│  │  │ My Project                  │││
│  │  │ (needs Node 22, npm 11,   │││
│  │  │  Python 3.11, git)         │││
│  │  └─────────────────────────────┘││
│  │                                 ││
│  │  System Dependencies:          ││
│  │  - Node.js 22                  ││
│  │  - npm 11                      ││
│  │  - Python 3.11                 ││
│  │  - Git                         ││
│  │  - curl, git, etc.             ││
│  └─────────────────────────────────┘│
│                                    │
│  (All these tools installed on     │
│   YOUR machine, polluting it)      │
│                                    │
└─────────────────────────────────────┘
```

```
WITH Dev Container:
┌────────────────────────────────────────┐
│       Your Windows Machine             │
│    (only Docker installed)             │
│ ┌────────────────────────────────────┐ │
│ │  VS Code                           │ │
│ │    (using Dev Container extension) │ │
│ │ ┌────────────────────────────────┐ │ │
│ │ │ Docker Container (isolated)   │ │ │
│ │ │ ┌──────────────────────────────┐│ │ │
│ │ │ │ My Project                  │││ │ │
│ │ │ │ (all dependencies inside)   │││ │ │
│ │ │ └──────────────────────────────┘││ │ │
│ │ │                                  │ │ │
│ │ │ Pre-installed inside container: │ │ │
│ │ │ - Node.js 22                     │ │ │
│ │ │ - npm 11                         │ │ │
│ │ │ - Python 3.11                    │ │ │
│ │ │ - Git, curl, etc.                │ │ │
│ │ └────────────────────────────────┐ │ │
│ └────────────────────────────────────┘ │
│ (Isolated, reproducible, clean)      │
└────────────────────────────────────────┘
```

**Current Status in OneCX Forge:**

> ⚠️ **Dev Container is PLANNED but NOT YET IMPLEMENTED**

The repository includes `.devcontainer/Dockerfile` and `.devcontainer/post-create.sh` as a template, but:
- ✅ The files exist and are ready to be used
- ✅ The Docker image definition is correct
- ⚠️ Teams can start using it immediately if they have Docker
- ⚠️ But users can also work locally without Docker (installing libraries on their machine)

**For Right Now:** We install required libraries locally on your machine (see [Section 6](#6-required-libraries--environment-setup)).

**What's Inside the Dev Container?** (When it's used)

From `Dockerfile`:
```dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

# Installs:
- Node.js 22 (LTS)
- npm 11
- git, curl, certificates
- Python 3.11 + pip + venv
- nx (Nx monorepo CLI)
- npx (npm package runner)
- @angular/cli (Angular CLI)
```

---

### 2.2: What is RFP (Request for Proposal)?

**In Simple Terms:**
An **RFP** is a formal business document that describes what a client wants built. Think of it as a **detailed wish list** for software.

**Real-World Example:**

A bank wants to build a new employee management system. They don't have the tech team, so they ask multiple software vendors: "Can you build this for us? What would it cost?" That document they send to vendors is an **RFP**.

**What's Inside an RFP?**

```
RFP Document Typically Contains:
├── Executive Summary
│   └── What we want at a high level
├── Business Context
│   └── Why we need this
├── Functional Requirements
│   ├── Employee Search (employees must be searchable by name/ID)
│   ├── Employee Details (show full employee information)
│   ├── Employee Management (create, update, delete employees)
│   └── Reporting (generate reports by department)
├── Non-Functional Requirements
│   ├── Performance (must handle 10,000 employees)
│   ├── Security (must comply with GDPR)
│   ├── Availability (must be up 99.9% of the time)
│   └── User Interface (must work on desktop and mobile)
├── Constraints & Assumptions
│   ├── Must use existing database
│   ├── Must integrate with Active Directory
│   └── Deadline: 6 months
├── Budget & Timeline
│   └── Budget: $500K, Timeline: 6 months
└── Success Criteria
    └── Vendor will get paid if users can...
```

**File Formats of RFPs:**

RFPs come in many formats:
- 📄 `.docx` — Microsoft Word documents (most common)
- 📊 `.xlsx` — Excel spreadsheets with requirement tables
- 📑 `.pdf` — PDF documents (scanned or born-digital)
- 🎯 `.pptx` — PowerPoint presentations (executive summary)
- 📝 `.md` or `.txt` — Text files with requirements (less common in enterprise)

**Real Example File Structure:**
```
rfp/
├── SCOPE.md                    ← YOUR GUIDE (what to extract)
│   └── Contains:
│       - In Scope: Employee management, search, reporting
│       - Out of Scope: Payroll, HR workflows
│       - Key Features: Basic CRUD, audit logging
│
├── executive-summary.pdf       ← Business context
├── requirements.xlsx           ← Detailed requirement matrix
├── system-architecture.docx    ← Technical constraints
├── budget-timeline.pptx        ← Project details
└── compliance-requirements.pdf ← Security/regulatory needs
```

**OneCX Forge's Job with RFP:**

1. User puts RFP files in `rfp/` folder
2. User creates `rfp/SCOPE.md` that says: "Focus on employee management, skip payroll"
3. OneCX Forge reads all these files and extracts requirements
4. It turns those requirements into a `prd/PRD.md` (structured requirements document)
5. It then plans how to build it
6. Finally, it generates working OneCX code that implements those requirements

---

### 2.3: What are RFP Skills?

**In Simple Terms:**
**RFP Skills** are specialized sets of instructions that tell the AI how to read, understand, and extract information from different types of documents (Word, Excel, PDF, PowerPoint).

**Why Do We Need Them?**

The AI cannot directly read binary files like `.docx`, `.xlsx`, `.pptx`, or `.pdf`. It needs:
1. **Python scripts** that extract text and metadata from these files
2. **Instructions** on how to use those scripts
3. **Examples** of what the extracted information looks like

**Current RFP Skills in OneCX Forge:**

| Skill | File Type | What It Does | Status |
|---|---|---|---|
| **docx** | `.docx` (Word) | Extracts all text, tables, formatting from Word documents | ✅ Exists |
| **pdf** | `.pdf` | Extracts text, form fields, images from PDFs | ✅ Exists |
| **pptx** | `.pptx` (PowerPoint) | Extracts slide text, notes, speaker notes | ✅ Exists |
| **xlsx** | `.xlsx` (Excel) | Extracts spreadsheet data, formulas, metadata | ✅ Exists |

**What These Skills Look Like (Simplified):**

```
.github/skills/docx/SKILL.md
─────────────────────────────
name: docx
description: How to read and analyze DOCX files

Instructions for the AI:
"When you need to read a DOCX file:
 1. Use the python-docx library to extract text
 2. Extract tables and preserve their structure
 3. Extract images and captions
 4. Preserve formatting (bold, italics, etc.)
 5. Handle headers and footers"

Under the hood (not shown to AI):
scripts/
├── extract_text.py      → reads entire text
├── extract_tables.py    → reads structured tables
├── extract_images.py    → extracts and saves images
└── extract_metadata.py  → gets file properties
```

**Why Skills Matter:**

Without skills:
```
AI sees: "There's a file named requirements.xlsx"
AI says: "I can't open it. I'm not a tool for binary files."
Result: ❌ Requirements not extracted
```

With skills:
```
AI sees: "There's a file named requirements.xlsx"
AI loads the 'xlsx' skill
AI says: "Now I can use Python scripts to extract data"
Result: ✅ All requirements extracted correctly
```

**Licensing Consideration:**

The existing skills (docx, pdf, pptx, xlsx) are based on:
- **Anthropic's public skills repository** (Apache 2.0 licensed)
- **OpenAI's public skills repository** (MIT licensed)

Both are **open source and commercial-friendly**. Your organization can use them in commercial projects.

---

## 3. Architecture & Workflow

### 3.1: High-Level System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    User (VS Code Chat)                   │
│         Types: /create-rfp-poc                           │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│        OneCX Forge Orchestrator Agent                     │
│     (.github/agents/onecx-forge.agent.md)                │
│                                                          │
│  Responsibilities:                                       │
│  1. Determine input type (RFP/LEGACY/CUSTOM)            │
│  2. Validate prerequisites                              │
│  3. Orchestrate the 3-stage workflow                    │
│  4. Verify outputs at each stage                        │
│  5. Track progress in orchestration.md                  │
└───────────────────────┬──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    STAGE 1         STAGE 2         STAGE 3
   (Parallel       (Sequential      (Parallel
    possible)      with feedback)   possible)
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Requirements │ │  Planner     │ │  Developer   │
│ Engineer     │ │  Agent       │ │  Agents      │
│ Agent        │ │              │ │ (1 per plan) │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ Reads:       │ │ Reads:       │ │ Reads:       │
│- rfp/        │ │- prd/PRD.md  │ │- plans/*.md  │
│- app/        │ │              │ │              │
│- GOAL.md     │ │ Writes:      │ │ Writes:      │
│              │ │- plans/*.md  │ │- <poc-name>/ │
│ Writes:      │ │              │ │  (code)      │
│- prd/PRD.md  │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │    PoC Complete & Delivered   │
        │      to User                  │
        └───────────────────────────────┘
```

### 3.2: Three-Stage Workflow

#### **STAGE 1: Requirements Engineering** (1-2 hours for complex RFP)

**What It Does:**
- Reads source materials (RFP files, legacy app code, or goal description)
- Extracts structured requirements
- Creates `prd/PRD.md` (Product Requirements Document)

**Process Flow:**
```
INPUT                    → PROCESSING              → OUTPUT
────────────────────────────────────────────────────────
rfp/SCOPE.md             → Determines scope        │
rfp/requirements.txt     → Reads all formats       │ Generates:
rfp/system-arch.docx     → Uses document skills   │ - prd/PRD.md
rfp/budget.xlsx          → Uses spreadsheet skill │
(or app/ folder)         → Reverse-engineers      │
(or GOAL.md file)        → Extracts requirements  │
```

**PRD Structure:**
```markdown
# Product Requirements Document: Employee Management PoC

## Executive Summary
Build a web-based employee management system that allows administrators to search,
view, create, update, and delete employee records.

## Goals
- Manage up to 10,000 employee records
- Search by name, ID, department
- Audit all changes
- Integrate with LDAP for authentication

## Functional Requirements
- FR-001: Search employees by multiple criteria
- FR-002: View employee details
- FR-003: Create new employee record
- FR-004: Update employee information
- FR-005: Delete employee record
- FR-006: Generate audit logs

## Non-Functional Requirements
- NFR-001: Response time < 2 seconds for search (1000+ records)
- NFR-002: Support 500 concurrent users
- NFR-003: Comply with GDPR

## Requirements Traceability
FR-001 ← Source: requirements.xlsx, Requirement #12
FR-002 ← Source: system-arch.docx, Page 5
... (each requirement mapped to source)
```

#### **STAGE 2: Planning** (1 hour)

**What It Does:**
- Reads `prd/PRD.md`
- Breaks requirements into implementation stages
- Creates execution plans (`plans/01-*.md`, `plans/02-*.md`, etc.)

**Process Flow:**
```
INPUT                 → PROCESSING                    → OUTPUT
──────────────────────────────────────────────────────────────
prd/PRD.md            → Analyzes requirements        │
                      → Groups by feature area       │ Generates:
                      → Determines dependencies      │ plans/01-setup.md
                      → Creates task lists           │ plans/02-search.md
                      → Assigns order                │ plans/03-crud.md
                      → Adds verification steps      │ plans/04-audit.md
```

**Plan File Example:**
```yaml
---
name: "Employee Search Feature"
order: 1                      # Execute second (after workspace setup)
covered_requirements: [FR-001]
depends_on: []
---

## Tasks

- **Task 1: Set up search component**
  - Instructions: Generate OneCX search page using @nx/onecx-cli generator
  - Verification:
    - Search component compiles without errors
    - UI renders in browser
  - Status: not started

- **Task 2: Connect to backend API**
  - Instructions: Wire up API calls to employee search endpoint
  - Verification:
    - API calls return employee data
    - Search filters work
  - Status: not started
```

#### **STAGE 3: Implementation** (2-4 hours)

**What It Does:**
- Reads each plan file sequentially (or in parallel if they have the same `order`)
- Implements tasks
- Generates working code in `<poc-name>/` folder

**Process Flow:**
```
INPUT                    → PROCESSING              → OUTPUT
────────────────────────────────────────────────────────
plans/01-setup.md        → Developer reads plan    │
                         → Follows instructions    │
                         → Generates code          │ Generates:
plans/02-search.md       → Marks tasks complete    │ my-app/
                         → Verifies outputs        │ ├── src/
plans/03-crud.md         → Handles TODOs inline    │ ├── package.json
                         → Updates plan status     │ ├── nx.json
plans/04-audit.md        → Reports when done       │ └── README.md
```

**PoC Output Structure:**
```
my-app/                        ← Generated OneCX PoC
├── src/
│   ├── app/
│   │   ├── core/              ← Core services
│   │   ├── modules/
│   │   │   ├── employees/     ← Feature module
│   │   │   │   ├── pages/
│   │   │   │   │   ├── employee-search.component.ts
│   │   │   │   │   ├── employee-detail.component.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── employees.module.ts
│   │   │   └── ...
│   │   └── app.module.ts
│   └── main.ts
├── package.json
├── angular.json
├── nx.json                    ← Nx monorepo config
└── README.md                  ← Setup & run instructions
```

---

## 4. Skills System Deep Dive

### 4.1: What is a Skill? (Technical Definition)

A **skill** is a reusable knowledge unit that the AI can load and use. It contains:

1. **YAML Frontmatter** — metadata about the skill
   ```yaml
   name: docx
   description: How to read and analyze Word documents
   ```

2. **Instructions** — what the skill teaches the AI
   ```markdown
   When you need to process a Word document:
   - Use python-docx library
   - Extract text, tables, images
   - [detailed instructions...]
   ```

3. **Python Scripts** — code that actually extracts data
   ```python
   from docx import Document
   def extract_text(filepath):
       doc = Document(filepath)
       return [para.text for para in doc.paragraphs]
   ```

### 4.2: Current Skills in OneCX Forge

**📁 Location:** `.github/skills/`

```
.github/skills/
├── docx/
│   ├── SKILL.md                    ← Instructions for AI
│   └── scripts/                    ← Python tools
│       ├── extract_text.py
│       ├── extract_tables.py
│       └── ...
├── pdf/
│   ├── SKILL.md
│   └── scripts/                    ← Python tools for PDFs
├── pptx/
│   ├── SKILL.md
│   └── scripts/                    ← Python tools for PowerPoint
├── xlsx/
│   ├── SKILL.md
│   └── scripts/                    ← Python tools for Excel
└── onecx-capabilities/
    └── SKILL.md                    ← How to use OneCX generators
```

### 4.3: How to Use Existing Skills (for Reference)

**For AI Agents:**
```markdown
# When the AI needs to read a DOCX file:

The Requirements Engineer agent will:
1. Detect file is .docx
2. Load the 'docx' skill from .github/skills/docx/SKILL.md
3. Read the instructions in that SKILL.md
4. Execute the provided Python scripts
5. Extract text, tables, images, formatting
6. Continue analysis
```

**For Humans:**
```bash
# You can manually extract text from a DOCX file:
python .github/skills/docx/scripts/extract_text.py path/to/file.docx

# You can manually extract tables:
python .github/skills/docx/scripts/extract_tables.py path/to/file.docx
```

### 4.4: Licensing of Current Skills

| Skill | Source | License | Commercial Use? |
|---|---|---|---|
| **docx** | Anthropic public repo | Apache 2.0 | ✅ Yes |
| **pdf** | Anthropic public repo | Apache 2.0 | ✅ Yes |
| **pptx** | Anthropic public repo | Apache 2.0 | ✅ Yes |
| **xlsx** | Anthropic public repo | Apache 2.0 | ✅ Yes |
| **onecx-capabilities** | Your organization | Internal | ✅ Yes (yours) |

**What This Means:**
- You can use all these skills in **commercial products**
- You must include the **Apache 2.0 license** in your distribution
- You can **modify them** for your needs
- You must **give attribution** to Anthropic if asked

---

## 5. Tasks & Implementation Plan

This section details the **4 main tasks** you asked to implement:

### 5.1: TASK 1 - Create RFP Analysis Skills

#### Problem We're Solving:
Currently, OneCX Forge can read DOCX, PDF, PPTX, XLSX files. But it doesn't have specialized skills for **analyzing RFP documents**. We need specialized logic to:
- Extract requirements from RFP documents
- Parse requirement tables
- Identify scope and constraints
- Map requirements to OneCX capabilities

#### Task 1a: Create `rfp-analysis` Skill

**New Skill Location:** `.github/skills/rfp-analysis/SKILL.md`

**What This Skill Will Teach the AI:**

```markdown
---
name: rfp-analysis
description: Specialized skill for extracting and analyzing requirements from RFP documents
---

# RFP Analysis Skill

## Purpose
Guide the AI to properly analyze Request for Proposal (RFP) documents and extract
structured requirements suitable for OneCX POC generation.

## When to Use This Skill
- When processing files in the rfp/ folder
- When the Requirements Engineer needs to parse RFP documents
- When extracting functional and non-functional requirements

## RFP Document Structure Recognition

### 1. Scope Identification
Look for these sections in RFP documents:
- "Scope of Work"
- "In Scope" / "Out of Scope"
- "Project Boundaries"
- "Deliverables"

Extract what is explicitly IN vs OUT of scope.

Example:
```
IN SCOPE:
- Employee search and filtering
- Employee CRUD operations
- Audit logging of changes

OUT OF SCOPE:
- Payroll processing
- Benefits management
- Performance appraisals
```

### 2. Requirement Extraction
Look for requirement statements containing keywords:
- "must" → Mandatory (HIGH priority, FR-xxx)
- "should" → Important (MEDIUM priority, FR-xxx or SFR-xxx)
- "could" → Nice-to-have (LOW priority, FR-xxx or SFR-xxx)
- "shall" → Legal/contractual requirement (MUST)

Example from RFP:
```
"The system MUST support concurrent access by 500 users."
→ Extract as: NFR-001: System shall support 500 concurrent users
   Category: Non-Functional
   Type: Scalability
   Priority: MUST
   Source: "System Requirements", page 8
```

### 3. Constraint & Dependency Identification
Extract any constraints or dependencies:
- Technical constraints (platforms, frameworks, databases)
- Regulatory constraints (GDPR, HIPAA, compliance standards)
- Timeline constraints (deadlines, phases)
- Budget constraints
- Integration requirements (with existing systems)

### 4. Success Criteria Extraction
Look for acceptance criteria and test scenarios:
- What constitutes "done"?
- What are the success metrics?
- What tests will be run?

## Files You'll Encounter

### SCOPE.md (Mandatory)
This file defines what to focus on. When reading SCOPE.md:
1. Extract the "In Scope" section
2. Extract the "Out of Scope" section
3. Extract "Key Features" or "High-Priority Items"
4. Use this to filter what you extract from other RFP files

Example SCOPE.md:
```markdown
# Scope of Work for Employee Management POC

## In Scope
- Employee search by name and ID
- View employee details
- Create new employee records
- Update existing records
- Delete (archive) employee records
- Audit trail of changes

## Out of Scope
- Payroll processing
- Benefits management
- Performance management
- Compensation analysis

## Key Features
1. Fast search (< 2 seconds for 10K records)
2. LDAP integration for authentication
3. Field-level audit logging
4. PDF export of employee records
```

### Other RFP Files
- `requirements.xlsx` → May contain requirement matrix. Extract each row as FR-xxx
- `proposal.pdf` → Business overview. Extract context and goals
- `technical-spec.docx` → Technical details. Extract constraints and architecture
- `timeline.pptx` → Timeline and milestones. Extract phase information

## Extraction Rules

### Rule 1: Gather Context First
Always read SCOPE.md first to understand what to focus on. Then read other files
and extract only what's IN SCOPE.

### Rule 2: Preserve Provenance
Track where each requirement came from:
```
FR-001: Employee search
  Extracted from: requirements.xlsx, row 3
  Priority: MUST
  Acceptance Criteria: [list them]
  Source Raw Text: "Users must be able to search..."
```

### Rule 3: Don't Infer Beyond Scope
If a feature is not mentioned in RFP but seems logical:
→ Stop. Don't infer it.
→ Add to "Assumptions & Open Questions" in PRD
→ Wait for clarification.

### Rule 4: Normalize Requirement Language
Convert vendor-specific or marketing language to technical requirements:

Before:
"Super-fast employee lookup with real-time filtering"

After:
NFR-001: Employee search response time must be < 2 seconds for dataset of up to 100,000 records

## OneCX Capability Mapping

When you identify a requirement, determine if OneCX can fulfill it:

### Example Mappings:

**FR-001: Employee Search**
→ OneCX Capability: Search Page Generator
→ Command: `nx generate @onecx/generators:search-page --collection employees`
→ Estimated Effort: 2-4 hours

**FR-002: Employee CRUD**
→ OneCX Capability: Detail Page + NGRX Store + API integration
→ Commands:
  - `nx generate @onecx/generators:detail-page --collection employees`
  - `nx generate @onecx/generators:ngrx-store --collection employees`
→ Estimated Effort: 6-8 hours

**NFR-001: Search Performance (< 2 sec for 100K records)**
→ OneCX Capability: Angular change detection optimization + backend pagination
→ Configuration: Implement server-side pagination, virtual scroll
→ Estimated Effort: 4-6 hours

**NFR-002: LDAP Integration**
→ Custom Integration (OneCX doesn't provide out-of-box LDAP connector)
→ Action: Implement custom authentication provider
→ Estimated Effort: 8-12 hours

## Verification Checklist

After extracting requirements from RFP, verify:

- [ ] All "MUST" (mandatory) requirements are identified
- [ ] At least one representative "SHOULD" (important) requirement is identified
- [ ] Constraints are documented (technical, regulatory, timeline)
- [ ] Each requirement has a source reference
- [ ] Conflicting requirements are flagged
- [ ] Out-of-scope features are clearly marked
- [ ] Assumptions are documented
```

#### Task 1b: Create RFP Extraction Python Scripts

**Location:** `.github/skills/rfp-analysis/scripts/`

**Scripts Needed:**

1. **`process_rfp_scope.py`** — Parses SCOPE.md
```python
#!/usr/bin/env python3
"""
Extract scoping information from SCOPE.md file.
Returns JSON with in_scope, out_of_scope, key_features.
"""
import sys

def parse_scope_file(filepath):
    """
    Parse SCOPE.md file and extract sections.
    Returns dict with in_scope, out_of_scope, key_features.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse markdown sections
    result = {
        'in_scope': extract_section(content, 'In Scope'),
        'out_of_scope': extract_section(content, 'Out of Scope'),
        'key_features': extract_section(content, 'Key Features'),
    }
    return result

def extract_section(content, section_name):
    """Extract a markdown section by heading name."""
    # [Implementation details...]
    pass

if __name__ == '__main__':
    filepath = sys.argv[1]
    result = parse_scope_file(filepath)
    import json
    print(json.dumps(result, indent=2))
```

2. **`extract_requirements_from_xlsx.py`** — Parses requirement matrices
```python
#!/usr/bin/env python3
"""
Extract requirements from Excel spreadsheet.
Expected format:
  Column A: Requirement ID (REQ-001)
  Column B: Requirement Text
  Column C: Type (FR, NFR, Constraint)
  Column D: Priority (MUST, SHOULD, COULD)
"""
import openpyxl
import sys

def extract_requirements(filepath):
    """Load xlsx and extract requirement rows."""
    workbook = openpyxl.load_workbook(filepath)
    sheet = workbook.active
    
    requirements = []
    for row in sheet.iter_rows(min_row=2, values_only=False):
        req_id, text, type_, priority = [cell.value for cell in row[:4]]
        if req_id:
            requirements.append({
                'id': req_id,
                'text': text,
                'type': type_,
                'priority': priority,
            })
    
    return requirements

if __name__ == '__main__':
    filepath = sys.argv[1]
    reqs = extract_requirements(filepath)
    import json
    print(json.dumps(reqs, indent=2))
```

3. **`analyze_requirement_coverage.py`** — Maps requirements to OneCX generators
```python
#!/usr/bin/env python3
"""
Analyze which requirements OneCX can handle, which need custom implementation.
"""

ONECX_CAPABILITIES = {
    'search': {
        'generator': '@onecx/generators:search-page',
        'keywords': ['search', 'filter', 'query', 'find'],
        'effort_hours': 3,
    },
    'detail': {
        'generator': '@onecx/generators:detail-page',
        'keywords': ['show', 'display', 'view', 'detail'],
        'effort_hours': 2,
    },
    'crud': {
        'generator': '@onecx/generators:dialog-form',
        'keywords': ['create', 'update', 'edit', 'delete', 'remove'],
        'effort_hours': 6,
    },
    'forms': {
        'generator': '@onecx/angular-accelerator:form',
        'keywords': ['form', 'input', 'validate'],
        'effort_hours': 4,
    },
}

def analyze_requirement(requirement_text):
    """
    Analyze a requirement and suggest OneCX capabilities.
    Returns list of matching capabilities and effort estimates.
    """
    requirement_lower = requirement_text.lower()
    matches = []
    
    for cap_name, cap_info in ONECX_CAPABILITIES.items():
        for keyword in cap_info['keywords']:
            if keyword in requirement_lower:
                matches.append({
                    'capability': cap_name,
                    'generator': cap_info['generator'],
                    'effort_hours': cap_info['effort_hours'],
                })
                break
    
    return matches
```

---

### 5.2: TASK 2 - Create `onecx-local-env-cli` Skill

#### Problem We're Solving:
The generated PoC needs to be deployed to a **local OneCX environment** for testing. This requires:
- Understanding the local environment setup
- Correct environment variables
- Database initialization
- Running startup scripts
- Health checks

#### Task 2a: Create `onecx-local-env-cli` Skill

**New Skill Location:** `.github/skills/onecx-local-env-cli/SKILL.md`

**Reference Documentation:**
- Official OneCX docs: https://onecx.github.io/docs/documentation/current/onecx-docs-start/first-app/create_angular_app.html
- Local environment: `D:\onecx\onecx\onecx-all\onecx-local-env`
- Shell UI example: `D:\onecx\onecx\onecx-all\onecx-shell-ui`
- Tenant UI example: `D:\onecx\onecx\onecx-all\onecx-tenant-ui`

**Skill Content:**

```markdown
---
name: onecx-local-env-cli
description: Deploy and manage OneCX POC applications in a local development environment
---

# OneCX Local Environment CLI Skill

## What is a Local OneCX Environment?

A local OneCX environment is a Docker-based setup that runs all OneCX core services
on your machine or a dev machine. It includes:

- PostgreSQL database
- Portal Gateway API
- Authorization Service
- Portal Backend Services
- Tenant Management
- Other microservices

## Prerequisites

Before deploying a POC to local environment, verify:

- [ ] Docker is installed and running (`docker --version`)
- [ ] Docker Compose is installed (`docker-compose --version`)
- [ ] You have access to the local-env setup files
- [ ] You have 8+ GB RAM available
- [ ] You have 20+ GB disk space

## Local Environment Structure

```
onecx-local-env/
├── docker-compose.yml          ← Main configuration
├── .env                        ← Environment variables (you create this)
├── scripts/
│   ├── start.sh               ← Start all services
│   ├── stop.sh                ← Stop all services
│   ├── health-check.sh        ← Verify services are running
│   ├── init-db.sh             ← Initialize database
│   └── reset.sh               ← Full reset (delete all data)
├── config/
│   ├── postgres.conf
│   ├── application.yml
│   └── settings.json
└── data/                       ← Persistent data (git-ignored)
    ├── postgres/
    ├── elasticsearch/
    └── redis/
```

## Quick Start: Deploy Your POC

### Step 1: Check Prerequisites

```bash
# Verify Docker and Docker Compose
docker --version         # Should be Docker 20.10+
docker-compose --version # Should be 2.0+

# Check available disk space (need 20+ GB)
df -h /
```

### Step 2: Initialize Environment Variables

Create `.env` file in local environment:

```bash
# .env (copy this into onecx-local-env directory)

# Database Configuration
POSTGRES_DB=onecx_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_dev_password_123
DB_HOST=postgres
DB_PORT=5432

# API Gateway Configuration
GATEWAY_HOST=localhost
GATEWAY_PORT=8080
GATEWAY_PROTOCOL=http
GATEWAY_URL=http://localhost:8080

# Your POC Configuration
POC_APP_NAME=my-employee-management
POC_APP_PORT=4200
POC_APP_PATH=/apps/my-employee-management

# JWT/Security
JWT_SECRET=your-secret-key-here-min-32-chars-long!
AUTHORIZATION_URL=http://localhost:8080/auth

# Logging
LOG_LEVEL=INFO
DEBUG_MODE=false
```

### Step 3: Start Local Environment

```bash
cd onecx-local-env

# Start all services in background
./scripts/start.sh

# Monitor logs
docker-compose logs -f

# Check health (in another terminal)
./scripts/health-check.sh
```

### Step 4: Wait for Services to Be Ready

Services startup sequence (watch logs):
```
1. PostgreSQL starts (2-3 minutes)
2. Redis starts (30 seconds)
3. Elasticsearch starts (1-2 minutes)
4. Authorization Service starts (1 minute)
5. Gateway API starts (2 minutes)
6. All ready for applications
```

Health check example:
```bash
# You should see this output:
✓ PostgreSQL is ready
✓ Redis is ready
✓ Elasticsearch is ready
✓ Authorization Service is responding
✓ Gateway API is responding

All services are ready! You can now deploy applications.
```

### Step 5: Deploy Your POC Application

```bash
# Navigate to your generated POC
cd /path/to/my-employee-management

# Add OneCX environment configuration
cat >> .env.production << EOF
GATEWAY_URL=http://localhost:8080
AUTH_URL=http://localhost:8080/auth
API_BASE_URL=http://localhost:8080/api
EOF

# Install dependencies
npm install

# Build for production
npm run build:prod

# Start development server (connects to local environment)
npm run start

# Output: Application available at http://localhost:4200
```

### Step 6: Access Your POC

- **Application URL:** http://localhost:4200
- **Portal Gateway API:** http://localhost:8080/api
- **Authorization:** Use test credentials

## Environment Variables Reference

| Variable | Purpose | Example |
|---|---|---|
| `GATEWAY_URL` | URL to OneCX gateway | `http://localhost:8080` |
| `AUTH_URL` | Authorization endpoint | `http://localhost:8080/auth` |
| `API_BASE_URL` | Backend API root | `http://localhost:8080/api` |
| `DB_HOST` | Database hostname | `localhost` or `postgres` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `onecx_dev` |
| `JWT_SECRET` | JWT signing secret | `[32+ char string]` |

## Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker ps

# Check for port conflicts (8080, 5432, 6379, 9200 must be free)
netstat -an | grep LISTEN

# Reset everything and start fresh
./scripts/reset.sh
./scripts/start.sh
```

### Database Connection Errors

```bash
# Verify database is ready
docker-compose exec postgres psql -U postgres -c "SELECT 1"

# Check postgres logs
docker-compose logs postgres
```

### POC Application Can't Connect to Gateway

```bash
# Verify gateway is running
curl http://localhost:8080/health

# Check your POC's environment variables
cat .env.production

# Verify DNS resolution
nslookup localhost
```

## OneCX Local Development Integration

### For Shell UI (Portal Container):

```bash
# Shell UI location: onecx-shell-ui/

# Deploy shell UI to local environment
cd onecx-shell-ui
npm install
npm run build

# Shell UI serves at: http://localhost:4200/shell/
```

### For Tenant UI (Tenant Container):

```bash
# Tenant UI location: onecx-tenant-ui/

# Deploy tenant UI to local environment
cd onecx-tenant-ui
npm install
npm run build

# Tenant UI serves at: http://localhost:4200/tenant/
# (or your POC's path)
```

## Stopping & Cleanup

```bash
# Stop all services (keep data)
./scripts/stop.sh

# Stop and remove all containers (keep data volumes)
docker-compose down

# Full reset (DELETE all data, start fresh)
./scripts/reset.sh
./scripts/start.sh
```

## Validation Checklist

After deployment, verify:

- [ ] POC loads in browser at http://localhost:4200
- [ ] Authentication works (can log in)
- [ ] API calls to gateway succeed
- [ ] Database queries return data
- [ ] Audit logs are recorded
- [ ] No CORS errors in console
- [ ] Performance is acceptable (< 2 sec load time)
```

#### Task 2b: Create Deployment Helper Scripts

**Location:** `.github/skills/onecx-local-env-cli/scripts/`

Scripts to create:

1. **`deploy-to-local-env.sh`** — Main deployment script
```bash
#!/usr/bin/env bash
set -euo pipefail

# Deploy a OneCX POC to the local development environment

POC_NAME=${1:-}
POC_PATH=${2:-.}

if [ -z "$POC_NAME" ]; then
  echo "Usage: $0 <poc-name> [poc-path]"
  echo "Example: $0 my-app /path/to/my-app"
  exit 1
fi

echo "🚀 Deploying $POC_NAME to local environment..."

# Step 1: Verify local environment is running
echo "✓ Checking if local environment is ready..."
if ! docker-compose -f onecx-local-env/docker-compose.yml ps | grep -q "postgres"; then
  echo "❌ Local environment is not running"
  echo "Run: cd onecx-local-env && ./scripts/start.sh"
  exit 1
fi

# Step 2: Build POC application
echo "✓ Building $POC_NAME..."
cd "$POC_PATH"
npm install
npm run build:prod

# Step 3: Start POC application
echo "✓ Starting $POC_NAME..."
npm run start &
POC_PID=$!

# Step 4: Wait for application to be ready
echo "✓ Waiting for application to respond..."
for i in {1..30}; do
  if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ $POC_NAME is ready at http://localhost:4200"
    exit 0
  fi
  echo "   Attempt $i/30..."
  sleep 1
done

echo "❌ Application did not start"
kill $POC_PID 2>/dev/null || true
exit 1
```

2. **`verify-local-env.py`** — Check environment readiness
```python
#!/usr/bin/env python3
"""
Verify that the local OneCX environment is ready for application deployment.
"""
import subprocess
import sys
import time
import requests

def check_docker():
    """Verify Docker is running."""
    try:
        subprocess.run(['docker', 'ps'], capture_output=True, check=True)
        return True, "Docker is running"
    except:
        return False, "Docker is not running"

def check_services():
    """Check if core services are responding."""
    services = {
        'PostgreSQL': 'localhost:5432',
        'Gateway API': 'http://localhost:8080/health',
        'Portal': 'http://localhost:8080',
    }
    
    results = {}
    for service_name, endpoint in services.items():
        if 'http' in endpoint:
            try:
                response = requests.get(endpoint, timeout=2)
                results[service_name] = (response.status_code == 200, "Ready")
            except:
                results[service_name] = (False, "Not responding")
        else:
            # TCP check
            host, port = endpoint.split(':')
            try:
                with socket.create_connection((host, int(port)), timeout=1):
                    results[service_name] = (True, "Ready")
            except:
                results[service_name] = (False, "Not accessible")
    
    return results

def main():
    print("🔍 Verifying Local OneCX Environment...\n")
    
    # Check Docker
    ok, msg = check_docker()
    print(f"{'✓' if ok else '❌'} {msg}")
    if not ok:
        sys.exit(1)
    
    # Check services
    print("\nChecking services...")
    results = check_services()
    for service, (ok, msg) in results.items():
        print(f"{'✓' if ok else '❌'} {service}: {msg}")
    
    all_ok = all(ok for ok, _ in results.values())
    print()
    if all_ok:
        print("✅ All systems ready for deployment!")
        return 0
    else:
        print("⚠️  Some services are not ready. Run: onecx-local-env/scripts/start.sh")
        return 1

if __name__ == '__main__':
    sys.exit(main())
```

---

### 5.3: TASK 3 - Create RFP-to-Deployment Orchestrator Subagent

#### Problem We're Solving:
We need a **fourth subagent** that orchestrates deploying the generated PoC to the local OneCX environment. This agent should:
- Take the completed PoC from Stage 3
- Configure it for the local environment
- Deploy it to local OneCX
- Run validation tests
- Generate deployment report

#### Task 3a: Create Deployment Orchestrator Agent

**New Agent Location:** `.github/agents/deployment-orchestrator.agent.md`

**Agent Definition:**

```yaml
---
name: Deployment Orchestrator
description: Orchestrates deployment of generated OneCX POCs to local development environment
argument-hint: After POC generation is complete, this agent deploys it to local OneCX environment
---

# Deployment Orchestrator Agent

## Role
You are an experienced DevOps engineer who specializes in deploying OneCX applications.
Your job is to take a completed POC application and safely deploy it to a local development environment.

You are NOT a developer. You do not modify application code. Your responsibility is:
1. Validate the POC is ready for deployment
2. Configure environment variables
3. Build and start the application
4. Verify it connects to the local OneCX environment
5. Run smoke tests
6. Document the deployment

## Prerequisites
Before you start:
- [ ] POC generation is complete (folder exists, source code is present)
- [ ] Local OneCX environment is running (services are up)
- [ ] POC has a package.json and build configuration
- [ ] Node.js and npm are installed locally

## Workflow (7 Steps)

### Step 1: Validate POC is Complete
- Check that the POC folder exists
- Verify it contains: package.json, src/main.ts, nx.json
- Check that all generator outputs exist (components, services, modules)
- Verify no placeholder or TODO files remain

**Action if validation fails:** Stop immediately and report what's missing.

### Step 2: Load onecx-local-env-cli Skill
Load the `onecx-local-env-cli` skill to understand:
- How to configure environment variables
- How to deploy to local OneCX
- Troubleshooting procedures

### Step 3: Verify Local Environment is Ready
Run `verify-local-env.py` script:
```bash
python .github/skills/onecx-local-env-cli/scripts/verify-local-env.py
```

Expected output:
```
✓ Docker is running
✓ PostgreSQL: Ready
✓ Gateway API: Ready
✓ Portal: Ready
✅ All systems ready for deployment!
```

**Action if environment is not ready:** Stop and tell the orchestrator that local environment must be started first.

### Step 4: Configure POC for Local Environment
Create/update `.env.local` in the POC folder:

```env
# LocalONCEX environment endpoints
GATEWAY_URL=http://localhost:8080
AUTH_URL=http://localhost:8080/auth
API_BASE_URL=http://localhost:8080/api

# Application settings
NODE_ENV=development
DEBUG=true
ENABLE_MOCK_DATA=false

# Logging
LOG_LEVEL=INFO
```

Also update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  gatewayUrl: 'http://localhost:8080',
  authUrl: 'http://localhost:8080/auth',
  apiBaseUrl: 'http://localhost:8080/api',
};
```

### Step 5: Build and Start POC
Execute:
```bash
cd <poc-folder>
npm install
npm run build:prod
npm run start
```

Monitor output for:
- ✓ No build errors
- ✓ Application starts on port 4200
- ✓ No startup exceptions

**Action if build fails:** Stop and report error details. Do NOT attempt to fix code.

### Step 6: Run Smoke Tests
Verify application is functioning:

```bash
# Test 1: Application loads
curl -s http://localhost:4200 | grep -q "<app>" && echo "✓ App loads"

# Test 2: API gateway connection
curl -s http://localhost:8080/health | grep -q "OK" && echo "✓ Gateway responds"

# Test 3: Authentication
curl -s http://localhost:8080/auth/config | grep -q "oauth" && echo "✓ Auth configured"

# Test 4: Application routes
curl -s http://localhost:4200/api/health | head -1
```

Create smoke-test report:
```
DEPLOYMENT SMOKE TEST REPORT
=============================

Test 1: Application Loads      ✓ PASS
Test 2: Gateway Connection     ✓ PASS
Test 3: Auth Configuration     ✓ PASS
Test 4: Routes Respond         ✓ PASS

Status: READY FOR USE
URL: http://localhost:4200
```

### Step 7: Document and Report
Create `deployment-report.md` in the POC folder:

```markdown
# Deployment Report

## Application
- Name: my-employee-management
- Version: 1.0.0
- Generated: 2026-04-27

## Deployment Destination
- Environment: Local OneCX Development
- Host: localhost
- Port: 4200
- URL: http://localhost:4200

## Configuration
- Gateway URL: http://localhost:8080
- Auth URL: http://localhost:8080/auth
- Database: onecx_dev (PostgreSQL)
- Node Environment: development

## Deployment Status
- Build: ✓ Successful
- startup: ✓ Successful
- Smoke Tests: ✓ All Passed

## Post-Deployment Steps
1. Open browser to http://localhost:4200
2. Log in with your local credentials
3. Test employee search and CRUD operations
4. Review audit logs

## Next Steps
- Run integration tests: `npm run test`
- Check logs: `docker-compose logs -f`
- To stop: `npm run stop`
```

## Error Handling

### If Build Fails
Stop. Report to orchestrator:
"Build failed with error: [error message]. This is a code issue, not deployment."

### If Application Won't Start
Stop. Check:
- Node.js version (`node --version` should be 18+)
- Free memory (`free -h`)
- Port 4200 availability (`lsof -i :4200`)

### If Local Environment is Down
Stop. Tell user:
"Local OneCX environment is not running. Run: cd onecx-local-env && ./scripts/start.sh"

## Verification Checklist

After deployment, confirm:

- [ ] Application loads in browser at http://localhost:4200
- [ ] No CORS errors in browser console
- [ ] Authentication works
- [ ] API calls to gateway succeed
- [ ] Database connection is working
- [ ] Deployment report was created
- [ ] Smoke tests all passed

## Output Contract

This agent produces:
- `.env.local` — Environment configuration (in POC folder)
- `deployment-report.md` — Deployment summary
- Console logs — Detailed deployment trace
```

#### Task 3b: Update Orchestrator to Invoke Deployment Agent

**File:** `.github/agents/onecx-forge.agent.md`

**Change Required:**
After Stage 3 (Development) completes successfully, add a new STAGE 4:

```markdown
## STAGE 4: Deployment (Optional, triggered if user requests)

**Agent:** Deployment Orchestrator (`.github/agents/deployment-orchestrator.agent.md`)
**Input:** Completed POC folder
**Output:** Running application at `http://localhost:4200 + deployment-report.md
**When to trigger:** If the orchestrator receives `/deploy` command or if user explicitly asks

### Workflow Step
- Before invoking deployment agent, ask user: "Would you like me to deploy this POC to your local OneCX environment?"
- If user confirms: proceed with deployment agent
- If user declines: finish orchestration with POC folder ready

### Verification Rule
- POC must be running and accessible at `http://localhost:4200
- Smoke tests must all pass
- `deployment-report.md` must exist and contain ✓ status markers
```

---

## 6. Required Libraries & Environment Setup

### 6.1: Dependencies By Skill

| Skill/Component | Language | Required Libraries | Installation |
|---|---|---|---|
| **docx** | Python | `python-docx` | `pip install python-docx` |
| **pdf** | Python | `PyPDF2, pdfplumber` | `pip install PyPDF2 pdfplumber` |
| **pptx** | Python | `python-pptx` | `pip install python-pptx` |
| **xlsx** | Python | `openpyxl` | `pip install openpyxl` |
| **Core System** | Node.js | `node >= 18, npm >= 9` | Use `nvm` or official installer |
| **Generators** | Node.js | `@nx/cli, @angular/cli` | `npm install -g nx @angular/cli` |
| **Local Environment** | Docker | `docker >= 20.10, docker-compose >= 2.0` | Docker Desktop or equivalent |

### 6.2: Local Installation Steps (Without Dev Container)

Execute this setup:

```bash
#!/usr/bin/env bash
# setup-local-environment.sh

echo "🔧 Setting up OneCX Forge local environment..."

# Step 1: Verify Node.js
echo -n "Node.js version: "
node --version || { echo "❌ Node.js not installed. Install from https://nodejs.org/"; exit 1; }

echo -n "npm version: "
npm --version || { echo "❌ npm not installed"; exit 1; }

# Step 2: Install Python dependencies
echo "Installing Python dependencies..."
pip install python-docx PyPDF2 pdfplumber python-pptx openpyxl

# Step 3: Install Node.js tools globally
echo "Installing Node.js tools globally..."
npm install -g nx @angular/cli

# Step 4: Verify Docker
echo "Checking Docker..."
docker --version || { echo "⚠️  Docker not installed (needed for local environment)"; }
docker-compose --version || { echo "⚠️  Docker Compose not installed"; }

# Step 5: Install project dependencies
echo "Installing project dependencies..."
npm install

# Step 6: Verify MCP servers
echo "✓ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Open VS Code: code ."
echo "2. Install GitHub Copilot Chat extension (if not already)"
echo "3. Type /create-rfp-poc in a chat window to start"
```

### 6.3: Docker & Development Container

If you want to use the dev container:

```bash
# Step 1: Install Docker Desktop
# Windows: https://docs.docker.com/desktop/install/windows-install/
# Mac: https://docs.docker.com/desktop/install/mac-install/
# Linux: https://docs.docker.com/desktop/install/linux-install/

# Step 2: Open folder in VS Code Dev Container
# - Open this folder in VS Code
# - Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
# - Type "Dev Containers: Reopen in Container"
# - Wait 2-3 minutes for container to build and start

# Step 3: Inside container, verify setup
node --version
npm --version
nx version
ng version
```

### 6.4: Dependency Installation Manifest

**File:** `.github/skills/environment-setup/DEPENDENCIES.md`

Create this file to document all dependencies:

```markdown
# OneCX Forge - Dependency Manifest

## System Requirements

- **OS:** Windows, macOS, or Linux
- **RAM:** 8 GB minimum, 16 GB recommended
- **Disk Space:** 30 GB free space

## Required Software

### Node.js & npm
- **Required Version:** Node.js >= 18, npm >= 9
- **Why:** JavaScript runtime and package manager
- **Install:**
  ```bash
  # Option 1: Use nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 22
  nvm use 22
  
  # Option 2: Direct download
  # https://nodejs.org/ → Download LTS version
  ```

### Python 3.9+
- **Why:** Parse Office documents and manage dependencies
- **Install:**
  ```bash
  # Windows: https://www.python.org/downloads/
  # macOS: brew install python3
  # Linux: apt install python3
  ```

## Python Dependencies

```bash
pip install \
  python-docx==0.8.11 \
  PyPDF2==3.13.1 \
  pdfplumber==0.10.2 \
  python-pptx==0.6.21 \
  openpyxl==3.10.0
```

## Node.js Global Packages

```bash
npm install -g \
  nx@latest \
  @angular/cli@latest \
  @onecx/cx-cli@latest
```

## Optional: Docker (for local environment)

- **Required Version:** Docker >= 20.10, docker-compose >= 2.0
- **Download:** https://www.docker.com/products/docker-desktop

## Verification

After installation, run:
```bash
node --version      # Should output: v18.x.x or higher
npm --version       # Should output: 9.x.x or higher
python3 --version   # Should output: 3.9.x or higher
nx version         # Should show Nx version
docker --version    # Should output: Docker version XXX
```
```

---

## 7. References & External Resources

### Official OneCX Documentation
- **Starting Guide:** https://onecx.github.io/docs/documentation/current/onecx-docs-start/first-app/create_angular_app.html
- **Generators:** https://onecx.github.io/docs/documentation/current/onecx-nx-plugins/generator/create-app.html
- **Components:** https://onecx.github.io/docs/documentation/current/index.html
- **GitHub Repository:** https://github.com/onecx

### External Skill References
- **Anthropic Skills:** https://github.com/anthropics/skills
  - DOCX Skill: https://github.com/anthropics/skills/tree/main/skills/docx
  - PDF Skill: https://github.com/anthropics/skills/tree/main/skills/pdf
  - PPTX Skill: https://github.com/anthropics/skills/tree/main/skills/pptx
  - XLSX Skill: https://github.com/anthropics/skills/tree/main/skills/xlsx
  - **License:** Apache 2.0 (Commercial Use OK)

- **OpenAI Skills:** https://github.com/openai/skills
  - Various document processing skills
  - **License:** MIT (Commercial Use OK)

### Local Environment References
- **Local OneCX Setup:** `D:\onecx\onecx\onecx-all\onecx-local-env`
- **Shell UI Example:** `D:\onecx\onecx\onecx-all\onecx-shell-ui`
- **Tenant UI Example:** `D:\onecx\onecx\onecx-all\onecx-tenant-ui`
- **docker-compose.yml:** Defines all microservices
- **Environment scripts:** start.sh, stop.sh, health-check.sh, reset.sh

### Licensing Summary

| Component | Source | License | Commercial OK? |
|---|---|---|---|
| OneCX Framework | 1000kit | Proprietary / Open Source | ✅ Check individual modules |
| Anthropic DOCX Skill | Anthropic | Apache 2.0 | ✅ Yes (attribution required) |
| Skill PDF Skill | Anthropic | Apache 2.0 | ✅ Yes (attribution required) |
| PPTX Skill | Anthropic | Apache 2.0 | ✅ Yes (attribution required) |
| XLSX Skill | Anthropic | Apache 2.0 | ✅ Yes (attribution required) |
| OpenAI Assets | OpenAI | MIT | ✅ Yes |
| OneCX Local Environment | 1000kit | As per OneCX | ✅ Internal use |
| Organization Skills | Your Org | Internal | ✅ Yes (yours) |

---

## Summary of Key Concepts for Naive Users

### Three Main Ideas Explained Simply:

#### 1️⃣ Dev Container = Isolated Computer
```
Imagine you have a laptop. Normally you install Node.js, Python, Git on it.
A dev container is like having a VIRTUAL laptop inside your laptop that
already has everything installed. It's isolated, reproducible, and clean.
```

#### 2️⃣ RFP = Detailed Wish List
```
Customer: "We need a system to manage employees."
Software Vendor: "OK, send us a detailed document of what you need."
That document is an RFP. It lists all the requirements, constraints, budget, timeline.
```

#### 3️⃣ RFP Skills = Tools to Read Business Documents
```
RFP documents are in Word, Excel, PDF format.
AI can't directly read binary files.
RFP Skills are Python scripts that say: "Here's how to extract text from Word."
So AI can learn what's needed from those business documents.
```

### The Complete Workflow:

```
1. User has an RFP document (Word, PDF, Excel)
2. User puts it in rfp/ folder + creates rfp/SCOPE.md
3. User types /create-rfp-poc in VS Code Chat

↓ OneCX Forge starts orchestrating ↓

4. Requirements Engineer reads RFP files using RFP Skills
   - Extracts "must have" vs "nice to have" requirements
   - Creates prd/PRD.md (structured requirements)

5. Planner reads PRD and creates implementation plan
   - Breaks into stages (setup, search, CRUD, audit)
   - Creates plans/01-setup.md, plans/02-search.md, etc.

6. Developer agents implement each stage
   - Generates OneCX code using generators
   - Tests each component
   - Produces working application in my-app/ folder

7. (NEW) Deployment Orchestrator deploys to local environment
   - Configures environment variables
   - Starts the application
   - Runs validation tests
   - Creates deployment report

8. User can now access the working POC at http://localhost:4200
```

---

## Tasks Implementation Checklist

### ✅ DONE (Analyzed)
- [x] Understood OneCX Forge architecture
- [x] Identified data flow and orchestration
- [x] Reviewed existing skills (docx, pdf, pptx, xlsx)
- [x] Understood licensing requirements (Apache 2.0, MIT OK for commercial)

### 📝 TODO - Implementation Tasks

#### Task 1: RFP Skills Development
- [ ] Create `.github/skills/rfp-analysis/SKILL.md`
- [ ] Create `process_rfp_scope.py` script
- [ ] Create `extract_requirements_from_xlsx.py` script
- [ ] Create `analyze_requirement_coverage.py` script
- [ ] Document OneCX-to-requirement mapping matrix
- [ ] Test with sample RFP files

#### Task 2: onecx-local-env-cli Skill
- [ ] Create `.github/skills/onecx-local-env-cli/SKILL.md`
- [ ] Create `deploy-to-local-env.sh` script
- [ ] Create `verify-local-env.py` script
- [ ] Document environment variable setup
- [ ] Create troubleshooting guide
- [ ] Test deployment end-to-end

#### Task 3: Deployment Orchestrator Agent
- [ ] Create `.github/agents/deployment-orchestrator.agent.md`
- [ ] Update `.github/agents/onecx-forge.agent.md` to call it
- [ ] Create smoke-test suite
- [ ] Generate deployment-report template
- [ ] Error handling and rollback procedures

#### Task 4: Integration & Testing
- [ ] Test full workflow: RFP → PRD → Plans → POC → Deployed
- [ ] Create end-to-end example with sample RFP
- [ ] Document all error scenarios
- [ ] Create troubleshooting guide
- [ ] Update README.md with new workflow

---

## Document Maintenance

- **Last Updated:** April 27, 2026
- **Status:** Comprehensive explanation document created
- **Next Review:** After Task implementations are complete
- **Owner:** OneCX Forge Orchestration Team
