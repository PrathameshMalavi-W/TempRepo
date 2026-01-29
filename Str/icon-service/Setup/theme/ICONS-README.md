# Icon Set Import for OneCX Theme Service

This directory contains scripts to import icon sets (like Material Design Icons) into your OneCX theme database for local development.

## Quick Start

### 1. Fetch the MDI Icon Set

Run the PowerShell script to download the complete Material Design Icons set:

```powershell
./fetch-mdi-icons.ps1
```

This will create `mdi-complete-iconset.json` with all ~7000+ MDI icons.

### 2. Move the Icon Set to Import Location

```powershell
Move-Item -Path .\mdi-complete-iconset.json -Destination .\iconset-mdi.json
```

The filename format should be: `iconset-{refId}.json` where `{refId}` identifies the icon set (e.g., `mdi`, `fa`, `custom`).

### 3. Run Local Environment

When you run your local environment:

```bash
./start-onecx.sh
```

The icon sets will be automatically imported during the startup process.

## Icon Set Format

Icon sets must be in JSON format with the following structure:

```json
{
  "prefix": "mdi",
  "info": {
    "name": "Material Design Icons",
    "total": 7000,
    "author": {...},
    "license": {...}
  },
  "icons": {
    "icon-name": {
      "body": "<svg path...>SVG content</svg>"
    }
  },
  "aliases": {
    "alias-name": {
      "parent": "icon-name"
    }
  }
}
```

- **prefix**: Used to namespace icons (icons are referenced as `prefix:icon-name`)
- **icons**: Object containing icon definitions with SVG body
- **aliases**: Optional aliases that reference other icons

## Supported Icon Sets

- **MDI (Material Design Icons)** - ~7000+ icons - Apache 2.0
  - https://github.com/iconify/icon-sets/blob/master/json/mdi.json
  
- **Font Awesome** - Available through Iconify
  - https://github.com/iconify/icon-sets/blob/master/json/fa.json
  
- **Tabler Icons** - ~4000+ icons - MIT
  - https://github.com/iconify/icon-sets/blob/master/json/tabler.json

You can find more icon sets at: https://github.com/iconify/icon-sets

## Import Process

The import happens automatically when containers start:

1. `start-onecx.sh` launches all containers
2. During startup, any `iconset-*.json` files in this directory are detected
3. Each icon set is uploaded to the theme service via the internal API
4. Icons are stored in the database with their `refId` and can be queried by name

## Manual Import

If containers are already running, you can manually import icons:

```bash
# From the onecx-data/theme directory
curl -X POST \
  -H "Content-Type: application/octet-stream" \
  --data-binary @iconset-mdi.json \
  "http://onecx-theme-svc/internal/v1/icons/upload?refId=mdi"
```

## Testing Icons in the Database

Once imported, query the theme service API:

```bash
# List all icons (internal API)
curl http://onecx-theme-svc/internal/v1/icons/search

# Search for specific icons
curl "http://onecx-theme-svc/internal/v1/icons/search?name=mdi:home"
```

## Troubleshooting

### Icons not importing
- Check that the JSON file is valid: `jq . iconset-mdi.json`
- Ensure the file is named `iconset-*.json`
- Check container logs: `docker-compose logs onecx-theme-svc`

### Icon set too large
- If the icon set is too large to import at once, you can split it into multiple files
- Each file should maintain the prefix, icons, and aliases structure

### Custom Icon Sets
- You can create your own icon sets by following the JSON format above
- Name them `iconset-{your-prefix}.json`
- The `prefix` in the JSON file should match your refId
