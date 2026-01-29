#!/usr/bin/env python3
"""
Quick setup reference for Icon imports in OneCX theme-svc
Run this to understand the complete workflow
"""

import json

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def print_code(code, language="bash"):
    print(f"```{language}")
    print(code)
    print("```\n")

print_section("ONECX ICON IMPORT SETUP REFERENCE")

print("This setup enables automatic icon set imports for the theme service.")
print("\nKey Components:")
print("  1. fetch-mdi-icons.[ps1|sh]    - Download icon sets")
print("  2. import-iconsets.sh          - Import icon sets to database")
print("  3. Modified import scripts     - Integrated icon import")

print_section("WORKFLOW DIAGRAM")

workflow = """
USER START
   |
   v
┌─────────────────────────────────────┐
│  Run: ./fetch-mdi-icons.[ps1|sh]   │
│  Creates: iconset-mdi.json         │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  Run: ./start-onecx.sh              │
│  Starts all Docker containers       │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  Containers Running                 │
│  - PostgreSQL                       │
│  - Keycloak                         │
│  - onecx-theme-svc                  │
│  - ... other services ...           │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  import-onecx.sh called             │
│  (automatic or manual)              │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  Theme data imported                │
│  (import-themes.sh)                 │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  NEW: Icon sets imported            │
│  (import-iconsets.sh) ← NEW!        │
│  - Finds iconset-*.json files       │
│  - Uploads each to theme-svc        │
└────────────┬────────────────────────┘
             |
             v
┌─────────────────────────────────────┐
│  Icons in Database                  │
│  - Stored in ICON table             │
│  - Available via API                │
│  - Ready for use in UI              │
└────────────┬────────────────────────┘
             |
             v
SETUP COMPLETE ✓
"""

print(workflow)

print_section("QUICK START COMMANDS")

print("Windows (PowerShell):")
print_code("""
cd onecx-data\\theme
.\\fetch-mdi-icons.ps1
Move-Item -Path .\\mdi-complete-iconset.json -Destination .\\iconset-mdi.json
cd ..\\..
.\\start-onecx.sh
""", "powershell")

print("Linux/macOS (Bash):")
print_code("""
cd onecx-data/theme
chmod +x fetch-mdi-icons.sh
./fetch-mdi-icons.sh
mv mdi-complete-iconset.json iconset-mdi.json
cd ../..
./start-onecx.sh
""")

print_section("FILE STRUCTURE")

structure = {
    "onecx-local-env": {
        "onecx-data": {
            "theme": {
                "fetch-mdi-icons.ps1": "PowerShell script to download MDI icons",
                "fetch-mdi-icons.sh": "Bash script to download MDI icons",
                "import-iconsets.sh": "NEW - Import icon sets from JSON files",
                "import-themes.sh": "Existing - Import theme data",
                "ICONS-README.md": "NEW - Quick reference",
                "ICON-SETUP-GUIDE.md": "NEW - Comprehensive guide",
                "iconset-mdi.json": "Icon set file (created by fetch script)"
            }
        },
        "versions": {
            "v1": {
                "import-onecx.sh": "MODIFIED - Now calls import-iconsets.sh"
            },
            "v2": {
                "import-onecx.sh": "MODIFIED - Now calls import-iconsets.sh"
            }
        },
        "ICON-IMPORT-SETUP.md": "NEW - Setup summary"
    }
}

def print_tree(d, indent=0):
    for key, value in d.items():
        print("  " * indent + f"├─ {key}")
        if isinstance(value, dict):
            print_tree(value, indent + 1)
        else:
            print("  " * (indent + 1) + f"└─ {value}")

print_tree(structure)

print_section("ICON SET FILE FORMAT")

example = {
    "prefix": "mdi",
    "info": {
        "name": "Material Design Icons",
        "total": 7000,
        "author": {"name": "Pictogrammers"},
        "license": {"title": "Apache 2.0"}
    },
    "icons": {
        "home": {"body": "<path fill=\"currentColor\" d=\"M...\"/>"},
        "settings": {"body": "<path fill=\"currentColor\" d=\"M...\"/>"}
    },
    "aliases": {
        "settings-outline": {"parent": "settings"}
    }
}

print(json.dumps(example, indent=2))
print("\nKey fields:")
print("  - prefix: Icon reference prefix (e.g., 'mdi:home')")
print("  - icons: Icon definitions with SVG bodies")
print("  - aliases: Icon aliases pointing to parent icons")

print_section("SUPPORTED ICON SETS")

sets = [
    {
        "name": "Material Design Icons (MDI)",
        "prefix": "mdi",
        "count": "7000+",
        "license": "Apache 2.0",
        "url": "https://github.com/iconify/icon-sets/blob/master/json/mdi.json"
    },
    {
        "name": "Font Awesome",
        "prefix": "fa",
        "count": "5000+",
        "license": "CC BY 4.0",
        "url": "https://github.com/iconify/icon-sets/blob/master/json/fa.json"
    },
    {
        "name": "Tabler Icons",
        "prefix": "tabler",
        "count": "4000+",
        "license": "MIT",
        "url": "https://github.com/iconify/icon-sets/blob/master/json/tabler.json"
    }
]

for s in sets:
    print(f"Name:     {s['name']}")
    print(f"Prefix:   {s['prefix']}")
    print(f"Icons:    {s['count']}")
    print(f"License:  {s['license']}")
    print(f"URL:      {s['url']}")
    print()

print_section("TESTING ICONS")

print("After setup, test icons with curl:")
print_code("""
# List all icons
curl http://onecx-theme-svc/internal/v1/icons/search

# Search by name
curl "http://onecx-theme-svc/internal/v1/icons/search?name=mdi:home"

# Search by refId
curl "http://onecx-theme-svc/internal/v1/icons/search?refId=mdi"
""")

print_section("DATABASE SCHEMA")

print("Icons are stored in the ICON table:")
print_code("""
CREATE TABLE icon (
    ID UUID PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,          -- e.g., 'mdi:home'
    TYPE VARCHAR(50) NOT NULL,           -- 'SVG'
    REF_ID VARCHAR(255) NOT NULL,        -- 'mdi'
    BODY CLOB,                           -- SVG content
    PARENT VARCHAR(255),                 -- For aliases
    CREATED_AT TIMESTAMP,
    MODIFIED_AT TIMESTAMP
);
""", "sql")

print_section("TROUBLESHOOTING")

issues = [
    {
        "issue": "Icons not importing",
        "solution": "Check container logs: docker-compose logs onecx-theme-svc"
    },
    {
        "issue": "JSON validation errors",
        "solution": "Validate JSON: jq . iconset-mdi.json"
    },
    {
        "issue": "Service not found",
        "solution": "Ensure containers are running: docker-compose ps"
    },
    {
        "issue": "Import script not found",
        "solution": "Make script executable: chmod +x *.sh"
    }
]

for i, item in enumerate(issues, 1):
    print(f"{i}. {item['issue']}")
    print(f"   Solution: {item['solution']}")
    print()

print_section("NEXT STEPS")

steps = [
    "Download MDI icons using fetch script",
    "Rename file to iconset-mdi.json",
    "Start containers with ./start-onecx.sh",
    "Verify icons in database with test curl commands",
    "Use icons in UI components"
]

for i, step in enumerate(steps, 1):
    print(f"{i}. {step}")

print("\n" + "="*70)
print("  Setup Complete! See ICON-IMPORT-SETUP.md for full details")
print("="*70 + "\n")
