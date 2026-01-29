# Setting Up Icon Imports for OneCX Theme Service

## Overview

The OneCX theme service now supports importing icon sets into the database. This guide shows you how to import Material Design Icons (MDI) or other icon sets for use in your local development environment.

## Architecture

The icon import process works as follows:

```
Icon Set JSON File (iconset-*.json)
         ↓
  [start-onecx.sh starts containers]
         ↓
  [import-onecx.sh is called]
         ↓
  [import-iconsets.sh finds iconset-*.json files]
         ↓
  [Uploads to onecx-theme-svc/internal/v1/icons/upload]
         ↓
  [Icons stored in PostgreSQL database]
         ↓
  [Available via IconRestController API]
```

## Quick Start

### For Windows Users (PowerShell)

```powershell
cd onecx-data\theme

# Download MDI icons
.\fetch-mdi-icons.ps1

# Rename for import
Move-Item -Path .\mdi-complete-iconset.json -Destination .\iconset-mdi.json

# Go back and start containers
cd ..\..
.\start-onecx.sh
```

### For Linux/macOS Users (Bash)

```bash
cd onecx-data/theme

# Download MDI icons
chmod +x fetch-mdi-icons.sh
./fetch-mdi-icons.sh

# Rename for import
mv mdi-complete-iconset.json iconset-mdi.json

# Go back and start containers
cd ../..
./start-onecx.sh
```

## What Gets Downloaded

The Material Design Icons set includes:
- **~7000+ icons** from the Material Design project
- **SVG format** for crisp rendering at any size
- **Aliases** for icon variations
- **License**: Apache 2.0

## File Format

Icon set files must be named `iconset-{refId}.json` where `{refId}` is how you reference the icons.

Example structure:
```json
{
  "prefix": "mdi",
  "info": {
    "name": "Material Design Icons",
    "total": 7000,
    "author": {
      "name": "Pictogrammers",
      "url": "https://github.com/Templarian/MaterialDesign"
    },
    "license": {
      "title": "Apache 2.0",
      "spdx": "Apache-2.0",
      "url": "https://github.com/Templarian/MaterialDesign/blob/master/LICENSE"
    }
  },
  "icons": {
    "home": {
      "body": "<path fill=\"currentColor\" d=\"M...\"/>"
    },
    "settings": {
      "body": "<path fill=\"currentColor\" d=\"M...\"/>"
    }
  },
  "aliases": {
    "home-variant": {
      "parent": "home"
    }
  }
}
```

## Multiple Icon Sets

You can import multiple icon sets by creating multiple files:

```
iconset-mdi.json       # Material Design Icons
iconset-fa.json        # Font Awesome
iconset-tabler.json    # Tabler Icons
iconset-custom.json    # Your custom icons
```

Each will be imported automatically when containers start.

## Import Other Icon Sets

### Font Awesome
```bash
curl -L https://raw.githubusercontent.com/iconify/icon-sets/master/json/fa.json -o iconset-fa.json
```

### Tabler Icons
```bash
curl -L https://raw.githubusercontent.com/iconify/icon-sets/master/json/tabler.json -o iconset-tabler.json
```

### Browse More Sets
Visit: https://github.com/iconify/icon-sets/tree/master/json

## Icon References in Code

Once imported, reference icons using the format: `{prefix}:{icon-name}`

Examples:
```
mdi:home
mdi:settings
mdi:delete
fa:check
tabler:star
```

## Database Schema

Icons are stored in the `ICON` table:

```sql
CREATE TABLE icon (
    ID UUID PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    TYPE VARCHAR(50) NOT NULL,
    REF_ID VARCHAR(255) NOT NULL,
    BODY CLOB,
    PARENT VARCHAR(255),
    CREATED_AT TIMESTAMP,
    MODIFIED_AT TIMESTAMP
);
```

- **NAME**: Full icon name (e.g., `mdi:home`)
- **TYPE**: Icon type (currently `SVG`)
- **REF_ID**: Reference ID/icon set name (e.g., `mdi`)
- **BODY**: SVG content for rendering
- **PARENT**: For aliases, references the parent icon name

## API Endpoints

### Upload Icon Set (Internal)
```bash
curl -X POST \
  -H "Content-Type: application/octet-stream" \
  --data-binary @iconset-mdi.json \
  "http://onecx-theme-svc/internal/v1/icons/upload?refId=mdi"
```

### Search Icons (Internal)
```bash
curl "http://onecx-theme-svc/internal/v1/icons/search"
```

### Query Parameters
- `name`: Filter by icon name (e.g., `?name=mdi:home`)
- `refId`: Filter by reference ID (e.g., `?refId=mdi`)
- `pageNumber`: Pagination (default: 0)
- `pageSize`: Page size (default: 50)

## Troubleshooting

### Icons Not Importing

Check container logs:
```bash
docker-compose logs onecx-theme-svc
```

Look for error messages during import.

### Validation Issues

Validate your JSON file:
```bash
# Linux/macOS
jq . iconset-mdi.json

# Or use online JSON validator
# https://jsonlint.com/
```

### Service Not Ready

The import scripts wait for the service to be ready. If it times out:

1. Check if containers are running:
   ```bash
   docker-compose ps
   ```

2. Wait for service to start:
   ```bash
   docker-compose logs -f onecx-theme-svc
   ```

3. Manually import after services start:
   ```bash
   cd onecx-data/theme
   bash import-iconsets.sh default true
   ```

### Large Icon Sets

If the import times out, you can split the icon set:

1. Use a JSON processor to split the `icons` object
2. Create multiple files with different refIds
3. Import them separately

Example: `iconset-mdi-part1.json`, `iconset-mdi-part2.json`

## Creating Custom Icon Sets

To create your own icon set:

1. Create a JSON file following the format above
2. Include `prefix`, `icons`, and `aliases` sections
3. Name it `iconset-{your-prefix}.json`
4. Place in `onecx-data/theme/`
5. Icons will be imported with the next container start

Example custom set:
```json
{
  "prefix": "custom",
  "info": {
    "name": "My Custom Icons",
    "total": 3
  },
  "icons": {
    "logo": {
      "body": "<svg><circle cx=\"50\" cy=\"50\" r=\"40\"/></svg>"
    },
    "icon-home": {
      "body": "<svg><rect width=\"100\" height=\"100\"/></svg>"
    },
    "icon-menu": {
      "body": "<svg><line x1=\"0\" y1=\"0\" x2=\"100\" y2=\"100\"/></svg>"
    }
  },
  "aliases": {
    "home": {
      "parent": "icon-home"
    }
  }
}
```

## Performance Considerations

- **Large icon sets** (10000+ icons) may take longer to import
- **First load** will populate the database on container startup
- **Subsequent runs** with the same refId will replace existing icons
- **Aliases** are processed after icons, so parent icons must exist

## Security

Icon uploads require:
- Internal API access (not exposed externally by default)
- Proper authentication headers if security is enabled
- Valid JSON format with proper SVG content

See environment files in `versions/v1/` and `versions/v2/` for security configuration.

## Support

For issues or questions:
1. Check the container logs
2. Validate JSON format
3. Ensure all required fields are present
4. Verify service connectivity

---

**Last Updated**: 2026-01-29
**Compatible With**: OneCX Theme Service with Icon Support
