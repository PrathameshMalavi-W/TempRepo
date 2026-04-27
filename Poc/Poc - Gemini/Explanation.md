# Beginner's Guide to OneCX Forge

Welcome! If you are new to this project and are feeling a bit overwhelmed, don't worry. This document explains the core concepts in plain English, provides examples, and outlines exactly what this system does and why.

---

## 1. What is an RFP and what are "RFP Skills"?

**RFP stands for "Request for Proposal."** 
When a large company or government agency wants to buy new software (or hire someone to build it), they write a massive set of documents called an RFP. It details exactly what the software must do, how secure it must be, and what the user interface should look like. 

**Example:** Imagine a bank wants a new mobile app. Their RFP might include:
- A Word Document (`.docx`) listing all the features (e.g., "Users must be able to log in securely").
- An Excel Spreadsheet (`.xlsx`) explaining the database structure.
- A PowerPoint Presentation (`.pptx`) showing mockups of the screens.
- A PDF (`.pdf`) displaying the network architecture.

**What are RFP Skills?**
Reading hundreds of pages of these documents is tedious and error-prone for humans. In this project, we created "Skills" for our AI. A "Skill" is essentially a set of instructions and custom Python scripts that teach the AI how to accurately open, read, and understand those files (`.docx`, `.pdf`, `.pptx`, `.xlsx`). 
By establishing these skills, the AI can rapidly digest the bank's requirements, avoid proprietary licensing issues by using open-source tools, and summarize exactly what needs to be built.

---

## 2. What is a "Dev Container"?

A **Dev Container (Development Container)** is a way to package a full, working software development environment inside a "box" (using Docker). 

**Why use it?**
Normally, when a new developer joins a project, they spend their first three days installing specific versions of Node.js, Python, Angular, databases, and so on. If they have a mismatched version on their computer, the code crashes ("It works on my machine!" syndrome).

With a Dev Container, we write a setup file (`Dockerfile` and `devcontainer.json`). When you open the project in VS Code, VS Code automatically downloads this exact predefined "box" in the background. The AI agents and you are both placed inside this box.
- Everyone has the exact same version of Python, Node, and Angular.
- You don't have to pollute your personal computer with hundreds of libraries.
- It ensures our AI agents always have the required command-line tools available.

### Current Status of the Dev Container
The idea is to use this Dev Container to create the perfect environment automatically. **However, it is currently still under development and will be finalized in the future.**

Because it is not ready yet, **we are doing things locally for now.**

---

## 3. The Local Environment Setup (Required Libraries)

Since we are running this on your actual computer (locally) instead of a Dev Container right now, we need to install the specialized tools our AI uses to process RFP documents. 

I have explicitly asked you for permission to install the following Python libraries so our AI can read the documents safely:

- **`python-docx`**: Allows the AI to read MS Word documents.
- **`pdfplumber`**: Allows the AI to read and extract text/tables from PDFs.
- **`python-pptx`**: Allows the AI to read MS PowerPoint slideshows and speaker notes.
- **`openpyxl`**: Allows the AI to read and extract formulas and grids from MS Excel spreadsheets.
- **`pymupdf`**: Acts as a backup mechanism for extracting tougher PDF documents.

These are standard, open-source community libraries. They allow us to bypass proprietary licenses while getting the exact same capability (the dual-skill architecture: using AI to orchestrate and standard open-source references for file data extraction).

---

## 4. What This System Does (The AI Story)

**OneCX Forge** is an AI agent workflow (an orchestration system). It is not just one chatbot you talk to. It is actually a **team of specialized virtual experts** passing notes to each other.

Here is exactly what I do, why I do it, and what my subagents do:

### 🎭 The Roles (The Workflow)

1. **The Orchestrator (Manager)**
   - **Task:** When you start the tool (e.g., typing `/create-rfp-poc`), I act as the manager. I validate that your RFP files exist, and then I hire the sub-agents in a strict order. I track progress in an `orchestration.md` file.
   - **Why:** To make sure nothing happens out of order. We can't write code before we know the requirements!

2. **Stage 1: The Requirements Engineer**
   - **Task:** Uses the "RFP Skills" (the Python scripts mentioned above) to read your Word, PDF, and Excel files. Extracts what the software essentially needs to do and writes a single source of truth document: a Product Requirements Document (`PRD.md`).
   - **Why:** Raw RFP files are chaotic. The PRD standardizes everything so the next AI agent can easily read it.

3. **Stage 2: The Planner**
   - **Task:** Reads the `PRD.md` and maps the requirement tickets (like "User must login") into a series of highly specific "To-Do" lists placed in the `plans/` folder. It maps requirements to actual structural parts of the **OneCX** framework.
   - **Why:** You wouldn't build a house without a blueprint. The plan files sequence the work so the developer doesn't get confused.

4. **Stage 3: The Developer**
   - **Task:** Reads the plan files and writes the actual Angular code and scaffolding to implement the Proof of Concept (PoC) app. It sets tasks to "completed" as it finishes them.
   - **Why:** This is the agent doing the grunt work of generating code.

5. **Stage 4: The Deployer (Future/WIP)**
   - **Task:** A capability in development that uses the `onecx-local-env-cli` skill to automatically take the completed PoC code and deploy it into your local environment running natively.
   - **Why:** Viewing code is nice, but seeing the application literally run in your browser is the ultimate goal!

---

## Conclusion
By designing the system this way, we break a massive, impossible prompt into small, reliable, testable pieces. Your RFP documents come in $\rightarrow$ the Environment provides the extraction tools $\rightarrow$ the AI Agents read, plan, build, and deploy. 

You remain the boss of the whole factory.
