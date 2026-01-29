#!/usr/bin/env pwsh
#
# Fetch MDI (Material Design Icons) from Iconify and prepare for import
# This script downloads the complete MDI icon set and saves it locally
#

param(
    [string]$OutputFile = "mdi-complete-iconset.json"
)

Write-Host "Fetching MDI icon set from Iconify..." -ForegroundColor Cyan

$url = "https://raw.githubusercontent.com/iconify/icon-sets/master/json/mdi.json"

try {
    # Download the icon set
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    $content = $response.Content
    
    # Save to file
    $content | Out-File -FilePath $OutputFile -Encoding UTF8
    
    # Parse and get info
    $json = $content | ConvertFrom-Json
    $iconCount = $json.icons.PSObject.Properties.Count
    $aliasCount = $json.aliases.PSObject.Properties.Count
    
    Write-Host "Successfully downloaded MDI icon set!" -ForegroundColor Green
    Write-Host "Total icons: $iconCount" -ForegroundColor Green
    Write-Host "Total aliases: $aliasCount" -ForegroundColor Green
    Write-Host "Saved to: $OutputFile" -ForegroundColor Green
}
catch {
    Write-Host "Error downloading icon set: $_" -ForegroundColor Red
    exit 1
}
