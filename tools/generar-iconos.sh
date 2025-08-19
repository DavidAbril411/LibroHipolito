#!/bin/bash
# Script para generar iconos PWA para Hipólito

echo "🎨 Generando iconos para PWA Hipólito..."

# Crear directorio de iconos si no existe
mkdir -p "assets/iconos"

# Si tienes ImageMagick instalado, puedes usar este script:
# convert favicon.svg -resize 72x72 assets/iconos/icon-72x72.png
# convert favicon.svg -resize 96x96 assets/iconos/icon-96x96.png
# convert favicon.svg -resize 128x128 assets/iconos/icon-128x128.png
# convert favicon.svg -resize 144x144 assets/iconos/icon-144x144.png
# convert favicon.svg -resize 152x152 assets/iconos/icon-152x152.png
# convert favicon.svg -resize 192x192 assets/iconos/icon-192x192.png
# convert favicon.svg -resize 384x384 assets/iconos/icon-384x384.png
# convert favicon.svg -resize 512x512 assets/iconos/icon-512x512.png

echo "📱 Para generar iconos automáticamente:"
echo "1. Instala ImageMagick: winget install ImageMagick.ImageMagick"
echo "2. Ejecuta: magick assets/iconos/favicon.svg -resize 192x192 assets/iconos/icon-192x192.png"
echo "3. Repite para todos los tamaños necesarios"

echo "🌐 O usa herramientas online:"
echo "- https://realfavicongenerator.net/"
echo "- https://www.pwabuilder.com/imageGenerator"

echo "✅ Estructura de iconos lista!"
