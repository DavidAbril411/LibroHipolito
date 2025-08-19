@echo off
echo 🚀 Iniciando servidor local para PWA Hipólito...
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar si http-server está instalado
call npm list -g http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando http-server...
    call npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ Error instalando http-server
        pause
        exit /b 1
    )
)

echo ✅ Iniciando servidor HTTP en puerto 8080...
echo.
echo 🌐 URL para PWA Builder: http://localhost:8080/inicio.html
echo 📱 URL para testing: http://localhost:8080
echo.
echo 💡 Usa Ctrl+C para detener el servidor
echo.
echo 🔗 Pasos siguientes:
echo    1. Ve a https://www.pwabuilder.com/
echo    2. Ingresa: http://localhost:8080/inicio.html
echo    3. Genera tu APK
echo.

:: Iniciar servidor
call http-server -p 8080 -c-1

pause
