# 🐉 Hipólito, mi perro-dragón

**Cuento digital interactivo con IA local para comprensión lectora infantil**

## 🚀 Inicio Rápido

1. **Abrir la aplicación:** Ve a `www/inicio.html` (o simplemente abre `index.html` para redirección automática)
2. **Verificar IA:** Asegúrate de que Ollama esté ejecutándose con el modelo `llama3.2:1b`
3. **Comenzar:** Elige entre Chat Infantil para niños o Chat Simple para pruebas

## 📁 Estructura Organizada

```
📂 Proyecto/
├── 🏠 index.html                  # Página de entrada (redirige a www/)
├── 📦 www/                        # Aplicación web principal
│   ├── inicio.html               # Centro de actividades (ENTRADA PRINCIPAL)
│   ├── chat-infantil.html        # Chat para niños
│   ├── chat-simple.html          # Chat simplificado
│   ├── 🎨 css/                   # Estilos
│   │   ├── estilos.css           # Estilos principales
│   │   └── estilos-infantiles.css # Estilos para niños
│   └── 🧠 js/                    # JavaScript
│       ├── hipolito-ia.js        # Motor de IA
│       ├── chat-hipolito.js      # Sistema de chat
│       ├── app-simple.js         # App simplificada
│       ├── cuento.js             # Lógica del cuento
│       └── metricas.js           # Sistema de métricas
│
├── 📊 data/                       # Datos del cuento
│   ├── cuento-estructura.json    # Estructura de la historia
│   ├── preguntas-respuestas.json # Base de conocimiento
│   └── vocabulario.json          # Glosario educativo
│
├── 🖼️ assets/                     # Recursos multimedia
│   └── iconos/                   # Iconos de la PWA
│
├── 📖 docs-consolidated/          # Documentación completa
│   ├── README-PRINCIPAL.md       # Documentación principal
│   ├── CONFIGURACION.md          # Guía de configuración
│   └── INICIO-RAPIDO.md          # Guía de inicio rápido
│
├── 🔧 tools/                      # Herramientas de desarrollo
├── 📱 android/                    # Proyecto Capacitor (opcional)
├── 🗂️ archivos/                   # Archivos organizados
│   └── deprecated/               # Código obsoleto
│
├── 📄 manifest.json              # Configuración PWA
├── ⚙️ service-worker.js          # Service Worker para offline
└── 📦 package.json               # Dependencias Node.js
```

## 🎯 Archivos Principales

| Archivo                  | Descripción                 | Para Quién                |
| ------------------------ | --------------------------- | ------------------------- |
| `www/inicio.html`        | 🏠 Centro de actividades    | Todos (entrada principal) |
| `www/chat-infantil.html` | 👶 Chat diseñado para niños | Niños de 8-9 años         |
| `www/chat-simple.html`   | ⚡ Chat simplificado        | Pruebas rápidas           |

## 🔧 Requisitos del Sistema

- **Navegador moderno** (Chrome, Firefox, Edge, Safari)
- **Ollama** ejecutándose localmente en puerto 11434
- **Modelo IA:** `llama3.2:1b` instalado en Ollama

## 💡 Características

- ✅ **100% Local:** Funciona sin internet usando Ollama
- ✅ **Educativo:** Enfocado en comprensión lectora
- ✅ **Seguro:** Sin envío de datos a servidores externos
- ✅ **Accesible:** Diseño inclusivo y responsive
- ✅ **PWA:** Instalable como aplicación nativa

## 📚 Documentación Completa

Consulta la carpeta `docs-consolidated/` para:

- Configuración técnica detallada
- Manual para educadores
- Guías de desarrollo
- Información de investigación

---

**Versión:** 2.0 - IA Local | **Audiencia:** Niños 8-9 años | **Licencia:** Educativa
