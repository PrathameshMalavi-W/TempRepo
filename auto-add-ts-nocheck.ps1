# add-nocheck-recursive.ps1

# $TargetDir = "C:\Z_CP\BuildWorkingRef\e-commerce-youtube-ui\src"
$TargetDir = "C:\Users\prath\OneDrive\Desktop\TempRepo\Files"
$Header    = "// @ts-nocheck"

Get-ChildItem -Path $TargetDir -Filter "*.ts" -File -Recurse | ForEach-Object {
    $file = $_.FullName

    # read first line only
    $firstLine = Get-Content $file -TotalCount 1

    if ($firstLine -eq $Header) {
        Write-Host "Skipping (already has header): $file"
    }
    else {
        # read full file, prepend header
        $content = Get-Content $file -Raw
        $newContent = $Header + "`r`n" + $content
        Set-Content -Path $file -Value $newContent -Encoding UTF8
        Write-Host "Updated: $file"
    }
}
