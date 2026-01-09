
# Define internal variables for input and output folders
# $InputFolder  = "C:\Source"   # <-- change this to your source folder
$InputFolder  = "\\wsl.localhost\Ubuntu-22.04\root\onecx\repo-onecx\onecx-ui\onecx-portal-ui-libs\libs\angular-auth"
# $OutputFolder = "C:\Target"   # <-- change this to your destination folder
$OutputFolder = "C:\onecx-win\Notes\Files\"   
# Get all .ts files recursively, skipping node_modules
$tsFiles = Get-ChildItem -Path $InputFolder -Recurse -Filter *.ts |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' }

foreach ($file in $tsFiles) {
    # Build relative path (strip input folder prefix)
    $relativePath = $file.DirectoryName.Substring($InputFolder.Length)

    # Build target directory path
    $targetDir = Join-Path $OutputFolder $relativePath

    # Create target directory if not exists
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # Build target file path with .txt extension
    $targetFile = Join-Path $targetDir ($file.BaseName + ".txt")

    # Copy content from .ts file into .txt file
    Get-Content $file.FullName | Set-Content $targetFile
}
