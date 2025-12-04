# Script de déploiement Firebase Hosting
# Pour l'Admin Panel React KnachSoft

Write-Host "🚀 Déploiement Firebase Hosting - KnachSoft Admin Panel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1 : Build du React
Write-Host "📦 [1/3] Build de l'Admin Panel React..." -ForegroundColor Yellow
cd client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build React" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build React terminé" -ForegroundColor Green
Write-Host ""

# Étape 2 : Copie dans public/
Write-Host "📂 [2/3] Copie du build dans public/..." -ForegroundColor Yellow
cd ..
npm run copy-build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la copie" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Copie terminée" -ForegroundColor Green
Write-Host ""

# Étape 3 : Déploiement Firebase
Write-Host "🔥 [3/3] Déploiement sur Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting:admin
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deploiement termine avec succes !" -ForegroundColor Green
Write-Host "Admin Panel: https://knachsoft-admin.web.app" -ForegroundColor Cyan
Write-Host "Site existant NON touche: https://knachsoft.web.app" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

