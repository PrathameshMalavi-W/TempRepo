# param(
#     [string]$RootPath = "D:\onecx\Apps\onecx-portal-ui-libs\libs"
# )

# if (-not (Test-Path $RootPath)) {
#     Write-Host "Folder $RootPath not found!" -ForegroundColor Red
#     exit 1
# }

# Get-ChildItem -Path $RootPath -Recurse -Directory | ForEach-Object {
#     $fullPath = $_.FullName
#     $folderName = $_.Name
#     Write-Host "Path: $fullPath" -ForegroundColor Cyan
#     Write-Host "Folder: $folderName" -ForegroundColor Yellow
    
#     $tsFiles = Get-ChildItem -Path $fullPath -Filter "*.ts" -File | Select-Object -ExpandProperty Name
#     if ($tsFiles) {
#         Write-Host "TS Files:" -ForegroundColor Green
#         $tsFiles | ForEach-Object { Write-Host "  - $_" }
#     } else {
#         Write-Host "No .ts files" -ForegroundColor Gray
#     }
#     Write-Host ""
# }



param(
    [string]$RootPath = "D:\onecx\Apps\onecx-portal-ui-libs\libs",
    [string]$OutputFile = "ts-scan-results.txt"
)

if (-not (Test-Path $RootPath)) {
    "$RootPath not found!" | Out-File -FilePath $OutputFile -Encoding UTF8
    exit 1
}

$result = @()

Get-ChildItem -Path $RootPath -Recurse -Directory | ForEach-Object {
    $fullPath = $_.FullName
    $folderName = $_.Name
    $result += "Path: $fullPath"
    $result += "Folder: $folderName"
    
    $tsFiles = Get-ChildItem -Path $fullPath -Filter "*.ts" -File | Select-Object -ExpandProperty Name
    if ($tsFiles) {
        $result += "TS Files:"
        $result += $tsFiles | ForEach-Object { "  - $_" }
    } else {
        $result += "No .ts files"
    }
    $result += ""
}

$result | Out-File -FilePath $OutputFile -Encoding UTF8
Write-Host "Results saved to $OutputFile" -ForegroundColor Green