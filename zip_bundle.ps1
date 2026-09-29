# ============================================================
# ZIP BUNDLE SCRIPT — NISAR x LAHARI COMBINED SANCTUARY
# ============================================================
$sourceDir = $PSScriptRoot
$zipPath = "C:\Users\nisar\Desktop\Combination.zip"

Write-Host "Creating zip archive of $sourceDir at $zipPath..." -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force
    Write-Host "Existing zip archive removed." -ForegroundColor Yellow
}

$items = Get-ChildItem -Path $sourceDir -Exclude @("*.zip", ".git*", "scratch", "zip_bundle.ps1")

Compress-Archive -Path $items.FullName -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    $size = (Get-Item $zipPath).Length / 1MB
    Write-Host ("Successfully created Combination.zip ({0:N2} MB)" -f $size) -ForegroundColor Green
} else {
    Write-Host "Failed to create Combination.zip" -ForegroundColor Red
}
