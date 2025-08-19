# Script PowerShell para generar iconos básicos PWA
Write-Host "🎨 Generando iconos para PWA Hipólito..." -ForegroundColor Green

# Crear iconos básicos usando el SVG existente como base
$iconSizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "📱 Iconos necesarios para PWA:" -ForegroundColor Yellow
foreach ($size in $iconSizes) {
    Write-Host "   - icon-${size}x${size}.png" -ForegroundColor Cyan
}

Write-Host "`n🛠️ Para generar iconos automáticamente:" -ForegroundColor Yellow
Write-Host "1. Instala ImageMagick:" -ForegroundColor White
Write-Host "   winget install ImageMagick.ImageMagick" -ForegroundColor Gray

Write-Host "`n2. Genera los iconos:" -ForegroundColor White
foreach ($size in $iconSizes) {
    $command = "magick assets/iconos/favicon.svg -resize ${size}x${size} assets/iconos/icon-${size}x${size}.png"
    Write-Host "   $command" -ForegroundColor Gray
}

Write-Host "`n🌐 Alternativa - Herramientas online:" -ForegroundColor Yellow
Write-Host "   - https://realfavicongenerator.net/" -ForegroundColor Cyan
Write-Host "   - https://www.pwabuilder.com/imageGenerator" -ForegroundColor Cyan

Write-Host "`n✅ Script listo. Ejecuta los comandos de arriba para generar iconos." -ForegroundColor Green
