---
name: rfp-analysis
description: Specialized skill for extracting and analyzing requirements from RFP documents
tags: [rfp, requirements, analysis, document-processing]
---

# RFP Analysis Skill

## Purpose

This skill guides AI agents to properly analyze Request for Proposal (RFP) documents and extract structured requirements that are suitable for OneCX Proof of Concept generation.

## When to Use This Skill

- When processing files in the `rfp/` folder
- When the Requirements Engineer needs to parse RFP documents (DOCX, XLSX, PDF, PPTX)
- When extracting functional and non-functional requirements for PoC scope
- When mapping business requirements to OneCX capabilities

## RFP Document Structure Recognition

### 1. Scope Identification - Find These Sections

Look for explicit scope boundaries in RFP documents:

- **In Scope** / **In-Scope Items**: What MUST be built
- **Out of Scope** / **Exclusions**: What's explicitly NOT included
- **Project Boundaries**: What's on the edge of scope
- **Phase 1, Phase 2, etc.**: Phased delivery (only Phase 1 may be PoC)
- **Deliverables**: What must be produced

**Extraction Example:**

```
RFP Text:
"SCOPE OF WORK

In Scope:
1. Employee search and filtering UI
2. Employee CRUD (Create, Read, Update, Delete) operations
3. Audit logging of all changes
4. Reporting dashboard for department managers

Out of Scope:
1. Payroll processing
2. Benefits management
3. Performance appraisals
4. HR workflow automation"

Extract As:
in_scope: [
  "Employee search and filtering UI",
  "Employee CRUD operations",
  "Audit logging of changes",
  "Reporting dashboard"
]
out_of_scope: [
  "Payroll processing",
  "Benefits management",
  "Performance appraisals",
  "HR workflows"
]
```

### 2. Requirement Extraction - Look for Keywords

Requirements are typically statements containing mandatory/advisory keywords:

| Keyword | Priority | Type | Required ID Format |
|---|---|---|---|
| **must** | HIGH | Mandatory | `FR-001` or `NFR-001` |
| **must not** | HIGH | Constraint | `C-001` |
| **shall** | HIGH | Legal/contractual | `FR-001` |
| **should** | MEDIUM | Important | `FR-002` or `SFR-002` |
| **should not** | MEDIUM | Constraint | `C-002` |
| **could** | LOW | Nice-to-have | `FR-003` or `OFR-003` |
| **may** | LOW | Optional | `FR-004` |

**Extraction Example:**

```
RFP Text:
"The system MUST support concurrent access by 500 users.
It SHOULD provide search results in less than 2 seconds.
It COULD include export to PDF."

Extract As:
- FR-001: Concurrent user support
  Priority: MUST (HIGH)
  Detail: "System shall support 500 concurrent users"
  Source: "System Requirements", Section 3.2
  Acceptance: "Verified with load testing tool"

- SFR-001: Search performance
  Priority: SHOULD (MEDIUM)
  Detail: "Search results shall be returned in < 2 seconds"
  Source: "Non-Functional Requirements", Section 4.1
  Acceptance: "99% of queries < 2 seconds"

- OFR-001: PDF export
  Priority: COULD (LOW)
  Detail: "System may support export to PDF format"
  Source: "Optional Features", Section 5
  Acceptance: "User can click 'Export to PDF' button"
```

### 3. Constraint & Dependency Identification

Extract technical, regulatory, and business constraints:

| Constraint Type | What to Look For | Example |
|---|---|---|
| **Technical** | Platform, framework, database requirements | "Must run on Docker", "PostgreSQL only" |
| **Regulatory** | Compliance requirements | "GDPR compliant", "SOC 2 certification" |
| **Timeline** | Deadlines, phases, go-live dates | "Phase 1 by Q3 2024" |
| **Budget** | Cost constraints, licensing restrictions | "No expensive third-party licenses" |
| **Integration** | Must connect to existing systems | "Integrate with Active Directory" |

**Extraction Example:**

```
RFP Text:
"The solution must be GDPR compliant and must integrate with
existing Active Directory for authentication. Implementation
must complete by December 2024. Application must run on
Kubernetes infrastructure."

Extract As:
Constraints:
- REGULATORY: GDPR compliance required
- TECHNICAL: Kubernetes deployment
- TECHNICAL: Active Directory integration (LDAP)
- TIMELINE: Completion by December 2024
- TECHNICAL: No Windows-only solutions
```

### 4. Success Criteria & Acceptance Extraction

Look for how the vendor will be paid / how success is measured:

```
RFP Text:
"Success Criteria:
- All required features implemented and tested
- 99.5% uptime in production
- All users can log in successfully
- Search performance meets targets
- Documentation and training delivered"

Extract As:
success_criteria: [
  "All FR-xxx requirements implemented",
  "All SFR-xxx non-functional requirements met",
  "99.5% uptime target achieved",
  "Authentication successful for all user accounts",
  "Search response time < 2 seconds (99% of queries)",
  "Complete technical and user documentation",
  "User training completed for all user groups"
]
```

## Processing Workflow

### Step 1: Read SCOPE.md First
- Extract `in_scope` items
- Extract `out_of_scope` items
- Extract `key_features` (if present)
- Use this as your filter for other files

### Step 2: Process Each File in rfp/ Folder

**For .xlsx files (spreadsheets):**
- Look for requirement matrices (Requirement ID, Description, Type, Priority)
- Extract each row as a structured requirement
- Use scripts: `extract_requirements_from_xlsx.py`

**For .docx files (Word documents):**
- Extract text content
- Find sections by headings
- Extract tables and convert to structured data
- Use document skills: DOCX skill (already available)

**For .pdf files (PDFs):**
- Extract all text content
- Extract any tables (may need manual attention)
- Use skills: PDF skill (already available)

**For .pptx files (PowerPoint):**
- Extract slide text and notes
- Extract key points from bullets
- Use skills: PPTX skill (already available)

### Step 3: Normalize and Structure

Convert all findings into structured format:

```yaml
requirements:
  - id: FR-001
    title: "Employee Search"
    description: "Users must search employees by name and ID"
    type: Functional
    priority: MUST
    source:
      file: "requirements.xlsx"
      location: "Row 3, Columns A-D"
      raw_text: "Users MUST be able to search for employees..."
    acceptance_criteria:
      - "Search results load in < 2 seconds"
      - "Search works with partial name matching"
      - "Search returns up to 100 results"
    tags:
      - "search"
      - "employee-management"
      - "high-priority"
    
  - id: NFR-001
    title: "Concurrent Users"
    description: "System shall support 500 concurrent users"
    type: Non-Functional
    priority: MUST
    source:
      file: "technical-spec.docx"
      location: "Section 3.2, Page 5"
    acceptance_criteria:
      - "Load test with 500 concurrent users"
      - "Response time stays under 2 seconds"
    tags:
      - "performance"
      - "scalability"
      - "high-priority"
```

## OneCX Capability Mapping

Match each requirement to OneCX capabilities:

### Mapping Table

| Requirement Type | OneCX Capability | Generator | Effort | Notes |
|---|---|---|---|---|
| Search pages | Search Page | `@onecx/generators:search-page` | 3-4h | Built-in OneCX generator |
| Detail pages | Detail Page | `@onecx/generators:detail-page` | 2-3h | For viewing items |
| Create/Update | Dialog Form | `@onecx/generators:dialog-form` | 4-6h | Modal forms for CRUD |
| Delete | Confirmation Dialog | Custom | 1-2h | Simple confirmation modal |
| Audit trails | NGRX + Logging | `@onecx/generators:ngrx-store` | 6-8h | State management |
| Authentication | Auth Guard | `@onecx/angular-accelerator` | 2-3h | OIDC/LDAP integration |
| Lists with tables | Data Table | `@onecx/angular-accelerator` | 3-4h | PrimeNG DataTable |
| Forms | Form Builder | `@onecx/angular-accelerator` | 4-5h | Reactive forms |
| Performance | Optimization | Manual | 4-8h | Virtual scrolling, pagination |

### Non-OneCX Capabilities (Custom Implementation)

Requirements that OneCX doesn't provide out-of-box:

- LDAP integration (custom authentication provider)
- Third-party API integrations
- Custom business logic
- Complex reporting
- Advanced analytics

**Action:** Tag as `needs_custom_implementation` and estimate manual effort.

## Files You'll Encounter

### SCOPE.md (Mandatory - User Must Create)

```markdown
# Scope Definition for Employee Management POC

## In Scope
- Employee search by name and ID
- View employee details and history
- Create new employee records
- Update employee information
- Soft-delete (archive) employees
- Audit trail of changes
- Basic reporting

## Out of Scope
- Payroll processing
- Benefits management
- Performance management
- Holiday/vacation management
- Compensation analysis

## Key Features (Priority Order)
1. Fast search (< 2 seconds for 10K records)
2. Full CRUD with audit trail
3. LDAP authentication
4. Modern responsive UI
5. Mobile-friendly
```

### requirements.xlsx (Spreadsheet Matrix)

Typical format:
```
| ID    | Requirement | Type       | Priority | Acceptance Criteria |
|-------|-------------|-----------|----------|-------------------|
| FR-01 | Search employees | Functional | MUST | Response < 2 sec |
| FR-02 | View details | Functional | MUST | Show all fields |
| NFR-01| Concurrent users | Non-Func | MUST | 500 users at once |
```

**Extract using:** `extract_requirements_from_xlsx.py`

### proposal.pdf (Business Overview)

Contains:
- Executive summary
- Business case
- Goals and objectives
- High-level timeline

**Extract:** Text sections, tables

### technical-spec.docx (Technical Details)

Contains:
- System architecture
- Technical constraints
- Technology stack recommendations
- Infrastructure requirements
- Integration needs

**Extract using:** DOCX skill (already available)

### timeline.pptx (Project Timeline)

Contains:
- Project phases and milestones
- Delivery schedule
- Key go-live dates

**Extract using:** PPTX skill (already available)

## Extraction Rules (Golden Rules)

### Rule 1: Prioritize MUST Requirements
Focus on requirements with "MUST" keyword. These are deal-breakers.
"SHOULD" and "COULD" are secondary.

### Rule 2: Gather Context Before Filtering
Read SCOPE.md FIRST. Then read other files and filter by in_scope items.

### Rule 3: Preserve Source Provenance
ALWAYS track where each requirement came from:
```
FR-001 extracted from: requirements.xlsx, row 3
Source text: "User must search employees..."
Confidence: HIGH (explicitly stated)
```

### Rule 4: Don't Infer Beyond RFP
If a feature seems logical but isn't mentioned in RFP → DO NOT INFER IT.
Add to "Assumptions & Open Questions" instead.

```
❌ Wrong:
RFP says "search employees"
You infer: "User probably wants advanced filtering, sorting, favorites..."
Add all of these as features.

✅ Right:
RFP says "search employees"
You extract: FR-001 "Users shall search employees by name and ID"
You add to Open Questions: "What advanced search filters are needed?"
```

### Rule 5: Normalize Language
Convert business/marketing language to technical requirements:

```
Before (RFP marketing language):
"Super-fast lightning-quick employee lookup with real-time filtering"

After (Normalized technical requirement):
NFR-001: "Employee search shall return results in < 2 seconds 
for datasets up to 100,000 records"
```

### Rule 6: Handle Conflicts
If RFP has conflicting requirements → Flag them:

```
Conflict Detected:
- REQ-5: "System must be simple with < 5 screens"
- REQ-12: "System must have 20+ reports"
→ Action: Flag as open question for clarification
```

## Verification Checklist

After extracting requirements, verify:

```
RFP Analysis Verification
=========================

□ All MUST (mandatory) requirements extracted
□ Representative SHOULD (important) requirements extracted
□ Technical constraints identified
□ Regulatory/compliance requirements identified
□ Success criteria documented
□ Each requirement has:
  □ Unique ID (FR-001, NFR-001, etc.)
  □ Clear description
  □ Priority level (MUST/SHOULD/COULD)
  □ Source reference (file, page, section)
  □ Acceptance criteria
□ Out-of-scope items clearly marked
□ Assumptions documented
□ Open questions listed
□ OneCX capability mapping attempted
□ No inferred requirements outside RFP scope
□ Conflicting requirements flagged
□ Total requirement count is reasonable (10-50 for PoC)
```

## Error Handling

### What to Do When...

**RFP is incomplete/contradictory:**
→ Document as "Assumption: We are interpreting X as..."
→ Add to "Open Questions" section

**OneCX can't fulfill a requirement:**
→ Mark as `needs_custom_implementation`
→ Estimate custom effort
→ Flag for discussion

**File format is unsupported:**
→ Extract text manually
→ Document the process
→ Request better format for next RFP

**Scope is too large for PoC:**
→ Use SCOPE.md to narrow down to Phase 1
→ Mark Phase 2+ items as `out_of_poc_scope`
→ Recommend: "Phase 1 focuses on core CRUD, Phase 2 adds reporting"

## Output Format

Requirements Engineer should produce `prd/PRD.md` with:

```markdown
# Product Requirements Document

## Overview
[Executive summary of what's being built]

## Requirements

### Functional Requirements (FR-xxx)
- FR-001: ...
- FR-002: ...

### Non-Functional Requirements (NFR-xxx)
- NFR-001: Performance
- NFR-002: Scalability
- NFR-003: Security

### Constraints (C-xxx)
- C-001: ...

## Requirements Traceability
[Maps each requirement to RFP source]

## OneCX Capability Mapping
[Maps requirements to OneCX generators if possible]

## Assumptions & Open Questions
[What's unclear, what needs clarification]
```

---

## References

- **OneCX Generators:** https://onecx.github.io/docs/documentation/current/onecx-nx-plugins/generator/create-app.html
- **OneCX Components:** https://onecx.github.io/docs/documentation/current/index.html
- **RFP Best Practices:** https://en.wikipedia.org/wiki/Request_for_proposal
