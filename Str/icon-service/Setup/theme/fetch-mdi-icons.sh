#!/bin/bash
#
# Fetch MDI (Material Design Icons) from Iconify and prepare for import
# This script downloads the complete MDI icon set and saves it locally
#
# Usage: ./fetch-mdi-icons.sh [output-file]
# Example: ./fetch-mdi-icons.sh
# Example: ./fetch-mdi-icons.sh my-icons.json
#

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

OUTPUT_FILE=${1:-mdi-complete-iconset.json}
URL="https://raw.githubusercontent.com/iconify/icon-sets/master/json/mdi.json"

echo -e "${CYAN}Fetching MDI icon set from Iconify...${NC}"
echo "URL: $URL"
echo "Output: $OUTPUT_FILE"

if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed. Required to parse JSON.${NC}"
    echo "Install: apt-get install jq (Ubuntu/Debian) or brew install jq (macOS)"
    exit 1
fi

# Download the icon set
echo -e "${CYAN}Downloading...${NC}"
if ! curl -f -s -L -o "$OUTPUT_FILE" "$URL"; then
    echo -e "${RED}Error downloading icon set${NC}"
    exit 1
fi

# Validate JSON
echo -e "${CYAN}Validating JSON...${NC}"
if ! jq empty "$OUTPUT_FILE" 2>/dev/null; then
    echo -e "${RED}Error: Invalid JSON file${NC}"
    rm -f "$OUTPUT_FILE"
    exit 1
fi

# Get stats
ICON_COUNT=$(jq '.icons | length' "$OUTPUT_FILE" 2>/dev/null || echo "?")
ALIAS_COUNT=$(jq '.aliases | length' "$OUTPUT_FILE" 2>/dev/null || echo "?")
PREFIX=$(jq -r '.prefix' "$OUTPUT_FILE" 2>/dev/null || echo "unknown")

echo -e "${GREEN}Successfully downloaded MDI icon set!${NC}"
echo -e "Prefix:        ${GREEN}$PREFIX${NC}"
echo -e "Total icons:   ${GREEN}$ICON_COUNT${NC}"
echo -e "Total aliases: ${GREEN}$ALIAS_COUNT${NC}"
echo -e "Saved to:      ${GREEN}$OUTPUT_FILE${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "1. Rename the file to match the import pattern:"
echo -e "   ${GREEN}mv $OUTPUT_FILE iconset-mdi.json${NC}"
echo "2. Run the local environment:"
echo -e "   ${GREEN}./start-onecx.sh${NC}"
echo ""
echo "Icons will be automatically imported during startup!"
