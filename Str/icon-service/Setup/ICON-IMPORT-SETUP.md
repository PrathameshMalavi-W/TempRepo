# Icon Import Setup Complete ✓

## Summary of Changes

### Files Created

1. **onecx-data/theme/fetch-mdi-icons.ps1** (PowerShell)
   - Downloads complete MDI icon set for Windows users
   - Usage: `.\fetch-mdi-icons.ps1`

2. **onecx-data/theme/fetch-mdi-icons.sh** (Bash)
   - Downloads complete MDI icon set for Linux/macOS users
   - Usage: `./fetch-mdi-icons.sh`

3. **onecx-data/theme/import-iconsets.sh** (Bash)
   - Automatically imports all `iconset-*.json` files
   - Integrated into the main import pipeline
   - Usage: Called by `import-onecx.sh -d theme`

4. **onecx-data/theme/ICONS-README.md**
   - Quick reference for icon imports
   - Available icon sets and formats

5. **onecx-data/theme/ICON-SETUP-GUIDE.md**
   - Comprehensive setup and troubleshooting guide
   - Architecture overview
   - API documentation
   - Custom icon set creation

### Files Modified

1. **versions/v2/import-onecx.sh**
   - Added `OLE_HEADER_CT_OCTETSTREAM` header export
   - Added `bash ./import-iconsets.sh "$1" "$2"` call in theme import section

2. **versions/v1/import-onecx.sh**
   - Added `OLE_HEADER_CT_OCTETSTREAM` header export
   - Added `bash ./import-iconsets.sh "$1" "$2"` call in theme import section

## How to Use

### Step 1: Download MDI Icons

**Windows (PowerShell):**
```powershell
cd onecx-data\theme
.\fetch-mdi-icons.ps1
Move-Item -Path .\mdi-complete-iconset.json -Destination .\iconset-mdi.json
```

**Linux/macOS (Bash):**
```bash
cd onecx-data/theme
chmod +x fetch-mdi-icons.sh
./fetch-mdi-icons.sh
mv mdi-complete-iconset.json iconset-mdi.json
```

### Step 2: Start Local Environment

```bash
./start-onecx.sh
```

Icons will be automatically imported during startup!

## What Happens

1. `start-onecx.sh` launches all containers
2. `import-onecx.sh` is called (or you can call it manually)
3. Theme data is imported, then `import-iconsets.sh` runs automatically
4. Any `iconset-*.json` files are found and uploaded to the theme service
5. Icons are stored in the PostgreSQL database
6. Icons are available via the IconRestController API

## Icon Set Details

### MDI (Material Design Icons)
- ~7000+ icons
- Apache 2.0 License
- Source: https://github.com/iconify/icon-sets/blob/master/json/mdi.json
- Prefix: `mdi`
- Usage: `mdi:home`, `mdi:settings`, `mdi:delete`, etc.

### Other Supported Sets

You can import additional icon sets by downloading and renaming them:

```bash
# Font Awesome
curl -L https://raw.githubusercontent.com/iconify/icon-sets/master/json/fa.json -o iconset-fa.json

# Tabler Icons
curl -L https://raw.githubusercontent.com/iconify/icon-sets/master/json/tabler.json -o iconset-tabler.json

# More at: https://github.com/iconify/icon-sets/tree/master/json
```

## Testing the Icons

After containers are running:

```bash
# Query all icons
curl http://onecx-theme-svc/internal/v1/icons/search

# Search specific icon
curl "http://onecx-theme-svc/internal/v1/icons/search?name=mdi:home"

# Query by refId
curl "http://onecx-theme-svc/internal/v1/icons/search?refId=mdi"
```

## Custom Icon Sets

You can create custom icon sets by adding files matching the pattern `iconset-{refId}.json`.

See ICON-SETUP-GUIDE.md for detailed documentation on creating custom icon sets.

## Database Schema

Icons are stored in the `ICON` table:

| Column | Type | Purpose |
|--------|------|---------|
| ID | UUID | Primary key |
| NAME | VARCHAR | Full name (e.g., `mdi:home`) |
| TYPE | VARCHAR | Icon type (`SVG`) |
| REF_ID | VARCHAR | Reference ID / icon set name |
| BODY | CLOB | SVG content |
| PARENT | VARCHAR | For aliases, references parent icon |

## Next Steps

1. ✓ Downloaded and set up import scripts
2. ✓ Download MDI icons (run fetch script)
3. ✓ Start containers (icons auto-import)
4. ✓ Use icons in your UI components

For detailed troubleshooting and advanced usage, see:
- [ICONS-README.md](./ICONS-README.md)
- [ICON-SETUP-GUIDE.md](./ICON-SETUP-GUIDE.md)

---

**Setup Date**: 2026-01-29
**Status**: Ready to use
