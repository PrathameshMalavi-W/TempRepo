# SYSTEM OVERVIEW — OneCX Forge

> A complete technical reference for the **OneCX Forge** AI agent orchestration system.  
> Every file in this repository is explained in detail so you can confidently modify any part of the system.

---

## Table of Contents

1. [What Is This System?](#1-what-is-this-system)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Workflow — End to End](#3-workflow--end-to-end)
4. [Repository Structure Map](#4-repository-structure-map)
5. [File-by-File Reference](#5-file-by-file-reference)
   - [README.md](#readmemd)
   - [note.txt](#notetxt)
   - [.vscode/mcp.json](#vscodemcpjson)
   - [.devcontainer/Dockerfile](#devcontainerdockerfile)
   - [.devcontainer/devcontainer.json](#devcontainerdevcontainerjson)
   - [.devcontainer/post-create.sh](#devcontainerpost-createsh)
   - [.github/agents/onecx-forge.agent.md](#githubagentsonecx-forgeagentmd)
   - [.github/prompts/create-rfp-poc.prompt.md](#githubpromptscreate-rfp-pocpromptmd)
   - [.github/prompts/create-custom-poc.prompt.md](#githubpromptscreate-custom-pocpromptmd)
   - [.github/prompts/migrate-legacy-app.prompt.md](#githubpromptsmigrate-legacy-apppromptmd)
   - [.github/agent-prompts/requirements-engineer.md](#githubagent-promptsrequirements-engineermd)
   - [.github/agent-prompts/planner.md](#githubagent-promptsplannermd)
   - [.github/agent-prompts/developer.md](#githubagent-promptsdevelopermd)
   - [.github/agent-prompts/deployer.md](#githubagent-promptsdeployermd) ⭐ NEW
   - [.github/skills/onecx-capabilities/SKILL.md](#githubskillsonecx-capabilitiesskillmd)
   - [.github/skills/docx/SKILL.md](#githubskillsdocxskillmd)
   - [.github/skills/pdf/SKILL.md](#githubskillspdfskillmd)
   - [.github/skills/pptx/SKILL.md](#githubskillspptxskillmd)
   - [.github/skills/xlsx/SKILL.md](#githubskillsxlsxskillmd)
   - [.github/skills/onecx-local-env-cli/SKILL.md](#githubskillsonecx-local-env-cliskillmd) ⭐ NEW
   - [prd/README.md](#prdreadmemd)
   - [plans/README.md](#plansreadmemd)
6. [Input Folders — What the User Provides](#6-input-folders--what-the-user-provides)
7. [Output Folders — What the System Produces](#7-output-folders--what-the-system-produces)
8. [Agent Roles and Responsibilities](#8-agent-roles-and-responsibilities)
9. [The Three Entry Point Modes](#9-the-three-entry-point-modes)
10. [MCP Servers — External AI Tools](#10-mcp-servers--external-ai-tools)
11. [Skills System](#11-skills-system)
12. [Local Dependencies — What Must Be Installed](#12-local-dependencies--what-must-be-installed)
13. [Orchestration State Tracking](#13-orchestration-state-tracking)
14. [Validation Rules Explained](#14-validation-rules-explained)
15. [How to Modify the System](#15-how-to-modify-the-system)

---

## 1. What Is This System?

**OneCX Forge** is a multi-agent AI orchestration system built to run inside **VS Code with GitHub Copilot**. Its sole purpose is to automatically generate a fully working **OneCX-based Proof of Concept (PoC)** application from one of three types of input:

| Input Type | What the User Provides | How to Start |
|---|---|---|
| **RFP** | A folder of RFP documents + a scope file | `/create-rfp-poc` slash command |
| **Legacy App** | The source files of an existing non-OneCX app | `/migrate-legacy-app` slash command |
| **Custom** | A goal description written by hand | `/create-custom-poc` slash command |

The system is **not a single AI prompt**. It is a **chain of specialized AI subagents**, each with a distinct role, that are invoked sequentially by a top-level orchestrating agent. Each agent reads specific files, produces specific outputs, and hands off to the next agent.

The four subagents in the chain are:
1. **Requirements Engineer** — turns raw input into a structured PRD
2. **Planner** — turns the PRD into step-by-step implementation plans
3. **Developer** — turns each plan into actual working code
4. **Deployer** ⭐ — deploys the PoC to the local OneCX environment _(optional, only on user request)_

---

## 2. High-Level Architecture

```
User Input (RFP files / legacy app / custom goal)
        │
        ▼
┌─────────────────────────────────────┐
│         OneCX Forge (Orchestrator)   │
│  .github/agents/onecx-forge.agent.md│
│                                     │
│  - Validates input                  │
│  - Tracks progress (orchestration.md│
│  - Delegates to 4 subagents in order│
└────────────┬────────────────────────┘
             │
     ┌───────▼───────┐
     │  Stage 1      │  → prd/PRD.md
     │  Requirements │
     │  Engineer     │
     └───────┬───────┘
             │
     ┌───────▼───────┐
     │  Stage 2      │  → plans/*.md
     │  Planner      │
     └───────┬───────┘
             │
     ┌───────▼───────┐
     │  Stage 3      │  → {poc-name}/ (full Angular app)
     │  Developer    │
     │  (per plan)   │
     └───────┬───────┘
             │
     ┌───────▼──────────────────────┐
     │  Stage 4 (OPTIONAL)          │  → PoC running in browser
     │  Deployer                    │
     │  (only when user requests it)│
     └──────────────────────────────┘
```

---

## 3. Workflow — End to End

### When a user types `/create-rfp-poc`

1. **Orchestrator starts** — reads the prompt from `.github/prompts/create-rfp-poc.prompt.md`
2. **Orchestrator validates** — checks that `rfp/SCOPE.md` exists and `rfp/` contains documents
3. **Stage 1 (Requirements Engineer)** is invoked:
   - Reads all files in `rfp/` using the file-reading skills (docx, pdf, pptx, xlsx)
   - Extracts requirements guided by `rfp/SCOPE.md`
   - Writes structured requirements to `prd/PRD.md`
4. **Stage 2 (Planner)** is invoked:
   - Reads `prd/PRD.md`
   - Creates one or more `plans/*.md` files with implementation tasks
5. **Stage 3 (Developer)** is invoked once per plan:
   - Reads the plan file
   - Generates the Angular PoC code in `{poc-name}/`
6. **Stage 4 (Deployer)** is invoked **only if the user explicitly requested deployment**:
   - Reads `onecx-local-env.path` for the local env directory
   - Starts the OneCX environment (Docker Compose)
   - Registers the PoC as an MFE using the `onecx-local-env-cli` skill
   - Verifies the app is accessible at `http://onecx.localhost/onecx-shell/`
7. **Orchestrator delivers** the final summary

---

## 4. Repository Structure Map

```
.
├── README.md                              ← Getting started guide
├── SYSTEM_OVERVIEW.md                     ← This file
├── onecx-local-env.path                   ← OPTIONAL: path to onecx-local-env folder
│
├── .devcontainer/
│   ├── Dockerfile                         ← Dev container image definition
│   ├── devcontainer.json                  ← VS Code dev container config
│   └── post-create.sh                     ← Runs after container creation
│
├── .vscode/
│   └── mcp.json                           ← MCP server configuration for Copilot
│
├── .github/
│   ├── agents/
│   │   └── onecx-forge.agent.md           ← TOP-LEVEL ORCHESTRATOR (start here)
│   │
│   ├── prompts/
│   │   ├── create-rfp-poc.prompt.md       ← Slash command entry point: /create-rfp-poc
│   │   ├── create-custom-poc.prompt.md    ← Slash command entry point: /create-custom-poc
│   │   └── migrate-legacy-app.prompt.md   ← Slash command entry point: /migrate-legacy-app
│   │
│   ├── agent-prompts/
│   │   ├── requirements-engineer.md       ← Stage 1: extracts PRD from input
│   │   ├── planner.md                     ← Stage 2: creates implementation plans
│   │   ├── developer.md                   ← Stage 3: implements code from plans
│   │   └── deployer.md                    ← Stage 4 (NEW): deploys PoC to local env
│   │
│   └── skills/
│       ├── onecx-capabilities/
│       │   └── SKILL.md                   ← Reference list of OneCX components
│       ├── docx/
│       │   ├── SKILL.md                   ← How to read DOCX files
│       │   └── scripts/
│       │       └── extract_docx.py        ← Python extraction script
│       ├── pdf/
│       │   ├── SKILL.md                   ← How to read PDF files
│       │   └── scripts/
│       │       └── extract_pdf.py         ← Python extraction script
│       ├── pptx/
│       │   ├── SKILL.md                   ← How to read PPTX files
│       │   └── scripts/
│       │       └── extract_pptx.py        ← Python extraction script
│       ├── xlsx/
│       │   ├── SKILL.md                   ← How to read XLSX files
│       │   └── scripts/
│       │       └── extract_xlsx.py        ← Python extraction script
│       └── onecx-local-env-cli/
│           └── SKILL.md                   ← (NEW) How to control the OneCX local env
│
├── rfp/                                   ← INPUT: RFP documents provided by user
│   ├── SCOPE.md                           ← Required: focus instructions
│   ├── *.docx / *.pdf / *.xlsx / *.pptx  ← The actual RFP files
│
├── app/                                   ← INPUT: Legacy app files (for migration)
│
├── GOAL.md (optional)                     ← INPUT: Custom requirements for /create-custom-poc
│
├── prd/
│   ├── README.md                          ← Explains PRD format
│   └── PRD.md                             ← OUTPUT: Generated by Requirements Engineer
│
└── plans/
    ├── README.md                          ← Explains plan format
    └── *.md                               ← OUTPUT: Generated by Planner
```

---

## 5. File-by-File Reference

### README.md
Quick-start guide for new users. Explains the three workflow modes (RFP, Legacy, Custom), prerequisites, and how to run the system.

### note.txt
Internal development notes. Not part of the agent workflow.

### .vscode/mcp.json
Configures the **Model Context Protocol (MCP)** servers that provide external tool capabilities to GitHub Copilot agents. Currently registers the OneCX MCP server which gives agents access to live OneCX component documentation.

### .devcontainer/Dockerfile
Defines the Docker image for the development container. Based on Node.js 22 (Debian Bookworm). Agents that need to run scripts will find all required tools pre-installed inside the container.

> **Current status:** The dev container is defined but not yet fully validated. For local development without Docker, install all dependencies manually (see Section 12).

### .devcontainer/devcontainer.json
VS Code dev container configuration. Specifies:
- The Dockerfile to use
- Extensions to auto-install (GitHub Copilot, etc.)
- The `post-create.sh` script to run on first start

### .devcontainer/post-create.sh
Runs once when the dev container is first created. Typically runs `npm install` and sets up any global tools.

---

### .github/agents/onecx-forge.agent.md
**The top-level orchestrator**. This is the most important file in the system. It defines:
- What types of requirements the orchestrator accepts (RFP, Legacy, Custom)
- Validation rules for each type
- The 4-stage chain of command (Requirements → Planning → Implementation → Deployment)
- Progress tracking rules using `orchestration.md`
- How to spawn subagents (read prompt file → replace placeholders → invoke)

**Do not edit casually.** Changes to this file affect the entire workflow.

---

### .github/prompts/create-rfp-poc.prompt.md
The VS Code slash command entry point for `/create-rfp-poc`. When the user types this command, GitHub Copilot reads this prompt and forward control to the orchestrator. Minimal file — just a wrapper that activates the orchestrator in RFP mode.

### .github/prompts/create-custom-poc.prompt.md
Same as above but for `/create-custom-poc` mode.

### .github/prompts/migrate-legacy-app.prompt.md
Same as above but for `/migrate-legacy-app` mode.

---

### .github/agent-prompts/requirements-engineer.md
The **Stage 1** agent prompt. The Requirements Engineer:
- Detects the requirement basis type (RFP/Legacy/Custom) and reads the relevant input files
- For **RFP mode**: reads `rfp/SCOPE.md` then reads all RFP files using the file-reading skills (docx, pdf, pptx, xlsx)
- Extracts functional requirements, non-functional requirements, user roles, and definitions
- Writes the complete PRD to `prd/PRD.md` following the PRD template format
- The PRD is the **single source of truth** for all subsequent stages

### .github/agent-prompts/planner.md
The **Stage 2** agent prompt. The Planner:
- Reads `prd/PRD.md`
- Groups requirements into logical implementation stages
- For each stage, creates a plan file in `plans/` with frontmatter (name, order) and detailed tasks
- Each task in the plan maps requirements to specific OneCX components (using the `onecx-capabilities` skill)

### .github/agent-prompts/developer.md
The **Stage 3** agent prompt. The Developer:
- Receives one plan file as its primary input
- Implements all tasks defined in the plan using the OneCX Angular framework
- Creates the PoC code in a folder named after the PoC
- Verifies each task as it completes it
- Updates plan task statuses to reflect completion

### .github/agent-prompts/deployer.md ⭐ NEW
The **Stage 4** agent prompt. The Deployer:
- Only runs when the user explicitly requests local deployment
- Discovers the onecx-local-env path from `onecx-local-env.path` (or asks the user)
- Verifies Docker is running
- Starts the OneCX local environment if not already running
- Installs PoC npm dependencies
- Generates MFE registration files using `@onecx/onecx-local-env-cli`
- Imports the app into OneCX (Product Store + Workspace)
- Verifies the app is accessible at `http://onecx.localhost/onecx-shell/`
- Reports the final deployment status back to the orchestrator

---

### .github/skills/onecx-capabilities/SKILL.md
A reference sheet listing all OneCX components (Shell, Workspace, Permission, etc.) with descriptions. Used by the Planner to map requirements to OneCX primitives.

### .github/skills/docx/SKILL.md
Instructions for reading `.docx` Word files. Teaches the agent exactly how to run the extraction script, interpret the output, and find requirements in different Word document patterns. Requires: `python-docx` pip package.

### .github/skills/docx/scripts/extract_docx.py ⭐ NEW
Python script that extracts all text, headings, tables, and lists from a `.docx` file and outputs structured markdown. Supports section filtering and handles corrupted files gracefully.

### .github/skills/pdf/SKILL.md
Instructions for reading `.pdf` files. Covers text-based PDFs (pdfplumber) and image-based scanned PDFs. Teaches page-range extraction and table detection. Requires: `pdfplumber` pip package.

### .github/skills/pdf/scripts/extract_pdf.py ⭐ NEW
Python script that extracts text and tables from PDFs. Supports page range filtering, auto-detects PDF type (text vs. image-based), and falls back to `pymupdf` if pdfplumber fails.

### .github/skills/pptx/SKILL.md
Instructions for reading `.pptx` PowerPoint files. Covers slide text, speaker notes extraction, and table content. Speaker notes are highlighted as a particularly valuable source of detailed context. Requires: `python-pptx` pip package.

### .github/skills/pptx/scripts/extract_pptx.py ⭐ NEW
Python script that extracts all slide content — titles, content text boxes, tables, and speaker notes — from a `.pptx` file into structured markdown.

### .github/skills/xlsx/SKILL.md
Instructions for reading `.xlsx` Excel files. Covers multi-sheet extraction, table conversion, and formula evaluation. Teaches the agent how to interpret requirements matrices, data models, and priority tables. Requires: `openpyxl` pip package.

### .github/skills/xlsx/scripts/extract_xlsx.py ⭐ NEW
Python script that converts all sheets of an Excel workbook to markdown tables. Supports single-sheet extraction, row limits, and sheet name listing.

### .github/skills/onecx-local-env-cli/SKILL.md ⭐ NEW
Instructions for managing the OneCX Local Environment. Covers:
- Discovering and validating the `onecx-local-env` path (from `onecx-local-env.path` config file)
- Starting/stopping the environment via `start-onecx.sh` / `stop-onecx.sh`
- Registering a new app as an MFE using `@onecx/onecx-local-env-cli`
- Running `import-onecx.sh` to import product/workspace data
- Troubleshooting common deployment issues (port conflicts, auth failures, etc.)

---

### prd/README.md
Explains the required format for `PRD.md`. Defines all sections that the Requirements Engineer must include: executive summary, functional requirements (FR-xxx), non-functional requirements (NFR-xxx), user roles, glossary, and out of scope items.

### plans/README.md
Explains the required format for plan files. Defines frontmatter schema (name, order, description), task structure (task ID, description, acceptance criteria, OneCX component mapping), and verification steps.

---

## 6. Input Folders — What the User Provides

### For RFP Mode (`rfp/`)
```
rfp/
├── SCOPE.md        ← REQUIRED: Focus instructions ("focus on sections 2, 3 only")
├── requirements.docx   ← Any name, any of the 4 supported formats
├── data-model.xlsx
├── architecture.pdf
└── overview.pptx
```

The `SCOPE.md` file is critical — it tells the Requirements Engineer which sections to focus on and which to ignore. Without it, the agent reads the entire document which may include irrelevant boilerplate.

### For Legacy App Mode (`app/`)
The original application's source files in any structure. The Requirements Engineer reverse-engineers requirements from the code and documentation.

### For Custom Mode
Either a `GOAL.md` file at the workspace root, or requirements provided directly in the chat.

---

## 7. Output Folders — What the System Produces

| Folder / File | Produced by | Content |
|---|---|---|
| `orchestration.md` | Orchestrator | Progress log, decisions, status of each stage |
| `prd/PRD.md` | Requirements Engineer | Full Product Requirements Document |
| `plans/*.md` | Planner | One file per implementation stage |
| `{poc-name}/` | Developer | The complete Angular PoC codebase |
| `{poc-name}/onecx-import/` | Deployer | MFE registration files for import into OneCX |
| `onecx-local-env.path` | Deployer (on first run) | Saved path to the onecx-local-env directory |

---

## 8. Agent Roles and Responsibilities

| Agent | Stage | Input | Output | Skills Used |
|---|---|---|---|---|
| OneCX Forge (Orchestrator) | — | User message, all files | orchestration.md | — |
| Requirements Engineer | 1 | rfp/, app/, or GOAL.md | prd/PRD.md | docx, pdf, pptx, xlsx |
| Planner | 2 | prd/PRD.md | plans/*.md | onecx-capabilities |
| Developer | 3 | plans/*.md | {poc-name}/ | onecx-capabilities |
| Deployer ⭐ | 4 (optional) | {poc-name}/, user config | Deployed app, summary | onecx-local-env-cli |

---

## 9. The Three Entry Point Modes

| Mode | Slash Command | Key Input | Requirements Source |
|---|---|---|---|
| RFP | `/create-rfp-poc` | `rfp/` folder | DOCX, PDF, XLSX, PPTX files |
| Legacy | `/migrate-legacy-app` | `app/` folder | Source code reverse-engineering |
| Custom | `/create-custom-poc` | `GOAL.md` or chat | Free-form requirements |

---

## 10. MCP Servers — External AI Tools

Configured in `.vscode/mcp.json`. The MCP (Model Context Protocol) servers provide agents with access to live external data sources beyond what's in the repository.

| Server | Purpose |
|---|---|
| OneCX MCP | Access to live OneCX component documentation and APIs |

Agents can query these via tool calls during their work.

---

## 11. Skills System

Skills are modular instruction folders consumed by agents. Each skill folder contains a `SKILL.md` file (and optionally `scripts/` with helper programs).

| Skill | Purpose | Used by |
|---|---|---|
| `onecx-capabilities` | List of OneCX components and their capabilities | Planner, Developer |
| `docx` | Read DOCX Word files | Requirements Engineer |
| `pdf` | Read PDF files | Requirements Engineer |
| `pptx` | Read PPTX PowerPoint files | Requirements Engineer |
| `xlsx` | Read XLSX Excel files | Requirements Engineer |
| `onecx-local-env-cli` ⭐ | Manage OneCX local Docker environment | Deployer |

**How agents use skills:** The orchestrator's subagent instructions reference skill files. The agent reads the SKILL.md and follows the instructions verbatim.

**How skills use scripts:** Where file manipulation is needed (e.g., extracting content from binary files), the skill instructs the agent to run a Python script located in the skill's `scripts/` directory.

---

## 12. Local Dependencies — What Must Be Installed

The following tools must be installed on the developer's machine for the skills to work. Each skill checks for its dependencies before running and will ask the user for permission before installing anything missing.

### Always Required
| Tool | Purpose | Check |
|---|---|---|
| Python ≥ 3.9 | Running extraction scripts | `python --version` |
| Node.js ≥ 18 | Running Angular app | `node --version` |
| npm | Package management | `npm --version` |

### For RFP File Reading
| Package | Purpose | Install |
|---|---|---|
| `python-docx` | Read DOCX files | `pip install python-docx` |
| `pdfplumber` | Read PDF files | `pip install pdfplumber` |
| `python-pptx` | Read PPTX files | `pip install python-pptx` |
| `openpyxl` | Read XLSX files | `pip install openpyxl` |
| `pymupdf` (optional) | PDF fallback | `pip install pymupdf` |

**One-time setup command:**
```bash
pip install python-docx pdfplumber python-pptx openpyxl
```

### For Local Deployment (Stage 4)
| Tool | Purpose | Check |
|---|---|---|
| Docker Desktop | Run OneCX containers | `docker info` |
| Docker Compose v2 | Compose orchestration | `docker compose version` |
| Git Bash (Windows) | Run `.sh` scripts on Windows | `bash --version` |
| `@onecx/onecx-local-env-cli` | Generate MFE import files | `npx @onecx/onecx-local-env-cli --version` |

### Dev Container (Future)
When the dev container is fully operational, all of the above will be pre-installed automatically. The Dockerfile will be updated to include all Python packages.

---

## 13. Orchestration State Tracking

The orchestrator maintains a file called `orchestration.md` in the workspace root. This file:
- Logs which stage is currently active
- Records decisions made (e.g., "Detected RFP mode — 3 RFP files found")
- Tracks the status of each stage (Not Started / In Progress / Completed / Failed)
- Records any errors or retries

If you open `orchestration.md` during a run, you can see exactly what the orchestrator is doing and why.

---

## 14. Validation Rules Explained

The orchestrator validates all inputs before starting any work. If validation fails, **nothing is created** and the user is given an exact error message.

| Mode | Required | Common mistake |
|---|---|---|
| RFP | `rfp/SCOPE.md` (non-empty) + at least 1 other file in `rfp/` | Forgetting the `SCOPE.md` file |
| Legacy | `app/` with at least 1 file | Empty `app/` folder |
| Custom | `GOAL.md` (non-empty) OR requirements in chat | Empty `GOAL.md` |
| All modes | PoC name provided by user | Forgetting to specify the name |

---

## 15. How to Modify the System

| What you want to change | Where to edit |
|---|---|
| Add a new requirement input type (e.g., Jira export) | `onecx-forge.agent.md` (Validation section) + new skill |
| Change PRD format | `prd/README.md` + `requirements-engineer.md` |
| Change plan format | `plans/README.md` + `planner.md` |
| Add a new OneCX component to the catalog | `onecx-capabilities/SKILL.md` |
| Add a new file format skill | Create `skills/{format}/SKILL.md` + extraction script |
| Modify deployment behavior | `deployer.md` + `onecx-local-env-cli/SKILL.md` |
| Add a new subagent stage | `onecx-forge.agent.md` (Chain of Command) + new prompt file |
| Change validation rules | `onecx-forge.agent.md` (Validation section) |
