$source = "C:\Users\HP\OneDrive\Documents\FULL-STACK JAVASCRIPT DEVELOPER\Project-25-Abnosh"
$temp = "C:\Users\HP\OneDrive\Documents\FULL-STACK JAVASCRIPT DEVELOPER\Project-25-Abnosh\temp_export"
$dest = "C:\Users\HP\OneDrive\Documents\FULL-STACK JAVASCRIPT DEVELOPER\Project-25-Abnosh\project_export.zip"

Write-Host "Staging files..."
if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item -ItemType Directory -Path $temp | Out-Null

# Robocopy (Mirror, Exclude Dirs, Exclude Files)
# /XD = Exclude Dirs, /XF = Exclude Files, /NFL /NDL = No logs
robocopy $source $temp /MIR /XD node_modules .next .git .gemini scripts temp_export /XF project_export.zip session.lock /NFL /NDL

# Robocopy returns exit codes 0-7 for success, 8+ for failure
if ($LASTEXITCODE -ge 8) {
    Write-Error "Robocopy failed with code $LASTEXITCODE"
    exit
}

Write-Host "Compressing..."
Compress-Archive -Path "$temp\*" -DestinationPath $dest -Force

Write-Host "Cleaning up..."
Remove-Item $temp -Recurse -Force

Write-Host "Success: Project zipped to $dest"
