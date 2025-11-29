# Script PowerShell pour remplacer tous les <Link> par <a> avec window.location.href

$files = @(
    "app/dashboard/dossiers/DossiersPageClient.tsx",
    "app/dashboard/actes/ActesPageClient.tsx",
    "app/dashboard/types-actes/page.tsx",
    "app/dashboard/templates/TemplatesPageClient.tsx"
)

foreach ($file in $files) {
    $fullPath = "C:\gravity\notary-app\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        # Lire le contenu
        $content = Get-Content $fullPath -Raw
        
        # Commenter l'import Link
        $content = $content -replace 'import Link from "next/link";', '// import Link from "next/link"; // Removed to fix POST issue'
        
        # Sauvegarder
        $content | Set-Content $fullPath -NoNewline
        
        Write-Host "✓ $file updated" -ForegroundColor Green
    }
    else {
        Write-Host "✗ $file not found" -ForegroundColor Red
    }
}

Write-Host "`nDone! Now you need to manually replace <Link> tags with <a> tags." -ForegroundColor Cyan
Write-Host "Pattern:" -ForegroundColor Cyan
Write-Host '  <Link href="/path"> → <a href="/path" onClick={(e) => { e.preventDefault(); window.location.href = "/path"; }}>' -ForegroundColor White
