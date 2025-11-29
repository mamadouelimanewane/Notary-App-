@echo off
echo ========================================
echo NETTOYAGE COMPLET - Notary App
echo ========================================
echo.

echo [1/4] Arret de tous les processus Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Suppression du cache .next...
if exist .next (
    rmdir /s /q .next 2>nul
    echo     ✓ Cache .next supprime
) else (
    echo     ✓ Pas de cache .next
)

echo [3/4] Suppression du cache node_modules...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache 2>nul
    echo     ✓ Cache node_modules supprime
) else (
    echo     ✓ Pas de cache node_modules
)

echo [4/4] Demarrage du serveur...
echo.
echo ========================================
echo SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
npm run dev
