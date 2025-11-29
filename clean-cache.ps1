# Script de nettoyage des caches Next.js
# Usage: .\clean-cache.ps1

Write-Host "🧹 Nettoyage des caches Next.js..." -ForegroundColor Cyan
Write-Host ""

# Supprimer .next
if (Test-Path ".next") {
    Write-Host "🗑️  Suppression de .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✅ .next supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next n'existe pas" -ForegroundColor Gray
}

# Supprimer node_modules/.cache
if (Test-Path "node_modules\.cache") {
    Write-Host "🗑️  Suppression de node_modules\.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
    Write-Host "✅ node_modules\.cache supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️  node_modules\.cache n'existe pas" -ForegroundColor Gray
}

# Supprimer .turbo
if (Test-Path ".turbo") {
    Write-Host "🗑️  Suppression de .turbo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
    Write-Host "✅ .turbo supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .turbo n'existe pas" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Nettoyage terminé !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Redémarrer le serveur : npm run dev" -ForegroundColor White
Write-Host "   2. Vider le cache du navigateur : Ctrl+Shift+Delete" -ForegroundColor White
Write-Host "   3. Rafraîchir la page : Ctrl+F5" -ForegroundColor White
Write-Host ""
