# 🔍 Script para verificar que todas las referencias apunten correctamente
# inicio.html = ENTRADA PRINCIPAL / HUB DE ACTIVIDADES
# index.html = CUENTO COMPLETO / HISTORIA INTERACTIVA

Write-Host "🔍 Verificando referencias en el proyecto..." -ForegroundColor Cyan
Write-Host ""

# Función para buscar texto en archivos
function Search-Text {
    param($Pattern, $Path, $Description)
    
    Write-Host "🔎 Buscando: $Description" -ForegroundColor Yellow
    $results = Select-String -Path $Path -Pattern $Pattern -SimpleMatch 2>$null
    
    if ($results) {
        Write-Host "   ✅ Encontrado en:" -ForegroundColor Green
        foreach ($result in $results) {
            $file = Split-Path $result.Filename -Leaf
            Write-Host "      📄 $file (línea $($result.LineNumber))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ No encontrado" -ForegroundColor Red
    }
    Write-Host ""
}

# Verificar archivos críticos
Write-Host "📋 VERIFICACIÓN DE ARCHIVOS CRÍTICOS" -ForegroundColor Magenta
Write-Host "=" * 50

# Verificar manifest.json
Write-Host "📱 Verificando manifest.json..." -ForegroundColor Cyan
$manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
Write-Host "   start_url: $($manifest.start_url)" -ForegroundColor $(if ($manifest.start_url -eq "./inicio.html") { "Green" } else { "Red" })

# Verificar service worker
Write-Host "⚙️ Verificando service-worker.js..." -ForegroundColor Cyan
$sw = Get-Content "service-worker.js" -Raw
if ($sw -match "inicio\.html") {
    Write-Host "   ✅ Referencias a inicio.html encontradas" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Verificar referencias en service worker" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 VERIFICACIÓN DE DOCUMENTACIÓN" -ForegroundColor Magenta
Write-Host "=" * 50

# Verificar referencias correctas
Search-Text "inicio.html" "*.md" "inicio.html como entrada principal"
Search-Text "start_url.*inicio" "*.json" "start_url apuntando a inicio.html"
Search-Text "localhost:8080/inicio.html" "*.md,*.ps1,*.bat" "URLs correctas en documentación"

Write-Host "📋 VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host ""
Write-Host "📝 ESTRUCTURA CORRECTA:" -ForegroundColor Cyan
Write-Host "   🏠 inicio.html  = ENTRADA PRINCIPAL (Hub de actividades)" -ForegroundColor Green
Write-Host "   📚 index.html   = CUENTO COMPLETO (Historia interactiva)" -ForegroundColor Green
Write-Host "   💬 chat-*.html  = INTERFACES DE CHAT ESPECÍFICAS" -ForegroundColor Green
Write-Host ""
