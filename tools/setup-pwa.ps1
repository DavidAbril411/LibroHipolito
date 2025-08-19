# 🚀 Script PowerShell para configurar PWA e iniciar servidor
param(
    [switch]$GenerarIconos,
    [switch]$IniciarServidor,
    [switch]$AbrirPWABuilder,
    [int]$Puerto = 8080
)

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

Write-Host "🐉 " -NoNewline -ForegroundColor Blue
Write-Host "Hipólito PWA & APK Generator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray
Write-Host ""

# Verificar Node.js
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "📥 Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green

# Generar iconos si se solicita
if ($GenerarIconos) {
    Write-Host "🎨 Generando iconos PWA..." -ForegroundColor Yellow
    
    if (Test-Command "magick") {
        $sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
        foreach ($size in $sizes) {
            $output = "assets/iconos/icon-${size}x${size}.png"
            Write-Host "   Generando ${size}x${size}..." -ForegroundColor Gray
            magick "assets/iconos/favicon.svg" -resize "${size}x${size}" $output
        }
        Write-Host "✅ Iconos generados exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ImageMagick no encontrado" -ForegroundColor Yellow
        Write-Host "📥 Instala con: winget install ImageMagick.ImageMagick" -ForegroundColor Cyan
    }
}

# Instalar http-server si no existe
$httpServerInstalled = $false
try {
    npm list -g http-server 2>$null | Out-Null
    $httpServerInstalled = $true
    Write-Host "✅ http-server ya está instalado" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando http-server..." -ForegroundColor Yellow
    npm install -g http-server
    if ($LASTEXITCODE -eq 0) {
        $httpServerInstalled = $true
        Write-Host "✅ http-server instalado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error instalando http-server" -ForegroundColor Red
        exit 1
    }
}

# Iniciar servidor si se solicita
if ($IniciarServidor -or $args.Count -eq 0) {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor HTTP en puerto $Puerto..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📱 URLs importantes:" -ForegroundColor Yellow
    Write-Host "   PWA Principal: http://localhost:$Puerto/inicio.html" -ForegroundColor White
    Write-Host "   Chat Infantil: http://localhost:$Puerto/chat-infantil.html" -ForegroundColor White
    Write-Host "   Testing: http://localhost:$Puerto" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Herramientas para APK:" -ForegroundColor Yellow
    Write-Host "   PWA Builder: https://www.pwabuilder.com/" -ForegroundColor Cyan
    Write-Host "   Capacitor: https://capacitorjs.com/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Usa Ctrl+C para detener el servidor" -ForegroundColor Gray
    Write-Host ""
    
    if ($AbrirPWABuilder) {
        Start-Sleep 2
        Start-Process "https://www.pwabuilder.com/"
        Write-Host "🌐 Abriendo PWA Builder..." -ForegroundColor Green
    }
    
    # Iniciar servidor
    http-server -p $Puerto -c-1
}

Write-Host ""
Write-Host "🎉 Proceso completado" -ForegroundColor Green
Write-Host "📱 ¡Tu PWA está lista para generar APK!" -ForegroundColor Cyan
