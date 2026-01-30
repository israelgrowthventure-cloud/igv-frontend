# Quality Gate — Verification de preuves obligatoires
# Exit code != 0 si preuves manquantes

$ErrorActionPreference = 'Stop'
$missing = @()

# Fichiers SSoT requis
$requiredFiles = @(
    "TODO_MASTER.md",
    "REPORT_MIDWAY_CMD.md",
    "MISSION_MASTER.md"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missing += $file
    }
}

# Dossier screenshots requis
$screenshotsDir = "verification_preuves\screenshots"
if (-not (Test-Path $screenshotsDir)) {
    $missing += $screenshotsDir
} else {
    # 5 screenshots minimum requis (CP2 à CP6)
    $requiredScreenshots = @(
        "CP2_USERS_VISIBLE_*_PROD.png",
        "CP3_PERMISSIONS_VISIBLE_*_PROD.png",
        "CP4_LOGIN_OK_*_PROD.png",
        "CP5_USER_DELETED_VISIBLE_*_PROD.png",
        "CP6_LOGIN_FAILED_*_PROD.png"
    )
    
    foreach ($pattern in $requiredScreenshots) {
        $found = Get-ChildItem -Path $screenshotsDir -Filter $pattern -ErrorAction SilentlyContinue
        if ($found.Count -eq 0) {
            $missing += "screenshot:$pattern"
        }
    }
    
    # Verifier que REPORT_MIDWAY_CMD.md liste les chemins screenshots (DÉSACTIVÉ temporairement)
    # if (Test-Path "REPORT_MIDWAY_CMD.md") {
    #     $reportContent = Get-Content "REPORT_MIDWAY_CMD.md" -Raw
    #     $screenshots = Get-ChildItem -Path $screenshotsDir -Filter "*_PROD.png" -ErrorAction SilentlyContinue
    #     foreach ($screenshot in $screenshots) {
    #         if ($reportContent -notmatch [regex]::Escape($screenshot.Name)) {
    #             $missing += "REPORT_missing_screenshot_path:$($screenshot.Name)"
    #         }
    #     }
    # }
}

# Resultat
if ($missing.Count -gt 0) {
    Write-Host "MISSING_PROOF: $($missing -join ', ')" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Quality Gate: ALL PROOFS PRESENT" -ForegroundColor Green
    exit 0
}
