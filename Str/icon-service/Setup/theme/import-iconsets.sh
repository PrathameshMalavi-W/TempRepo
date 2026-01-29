#!/bin/bash
#
# Import Icon Sets from JSON files
#
# Usage: import-iconsets.sh [tenant] [verbose]
# Example: import-iconsets.sh default true
#

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

TENANT=${1:-default}
VERBOSE=${2:-false}

#################################################################
# files with iconset pattern: iconset-{refId}.json
iconset_files=`ls iconset-*.json 2>/dev/null`

if [[ $iconset_files == "" ]]; then
  SKIP_MSG=" ==>${RED} skipping${NC}: no iconset files found"
  echo -e "$OLE_LINE_PREFIX${CYAN}Importing Icon Sets${NC}\t$SKIP_MSG"
  exit 0
fi

echo -e "$OLE_LINE_PREFIX${CYAN}Importing Icon Sets${NC}"

#################################################################
# operate on found files
for entry in $iconset_files
do
  filename=$(basename "$entry")
  refId=`echo $filename | sed 's/iconset-//;s/.json//'`
  
  url="http://onecx-theme-svc/internal/v1/icons/upload"
  params="--write-out %{http_code} --silent --output /dev/null -X POST"
  
  if [[ $OLE_SECURITY_AUTH_ENABLED == "true" ]]; then
    status_code=`curl $params \
      -H "$OLE_HEADER_CT_OCTETSTREAM" \
      -H "$OLE_HEADER_AUTH_TOKEN" \
      -H "$OLE_HEADER_APM_TOKEN" \
      --data-binary @$entry \
      "$url?refId=$refId"`
  else
    status_code=`curl $params \
      -H "$OLE_HEADER_CT_OCTETSTREAM" \
      --data-binary @$entry \
      "$url?refId=$refId"`
  fi

  if [[ "$status_code" =~ (200|201)$ ]]; then
    if [[ $VERBOSE == "true" ]]; then
      echo -e "    import: internal, status: ${GREEN}$status_code${NC}, refId: $refId"
    fi
  else
    echo -e "${RED}    import: internal, status: $status_code, refId: $refId ${NC}"
  fi
done
