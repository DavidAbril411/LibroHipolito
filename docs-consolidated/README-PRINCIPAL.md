# 🐉 Hipólito, mi perro-dragón

## Descripción

**Hipólito, mi perro-dragón** es un proyecto educativo interactivo que combina narrativa digital con inteligencia artificial local para crear una experiencia de aprendizaje única para niños de 8-9 años. Los estudiantes pueden leer la historia de Hipólito y luego conversar directamente con él a través de un chatbot con IA, reforzando la comprensión lectora y fomentando la creatividad.

## 🎯 Características Principales

### ✨ Interfaz Diseñada para Niños
- **Botones grandes y coloridos** fáciles de usar
- **Tipografía amigable** (Comic Sans MS) y texto claro
- **Colores vibrantes** y animaciones suaves
- **Navegación intuitiva** sin elementos complejos

### 🤖 Chatbot Inteligente
- **IA local** con Ollama (100% privado y seguro)
- **Modelo llama3.2:1b** optimizado para conversaciones educativas
- **Memoria de conversación** para mantener contexto
- **Respuestas naturales** como si fuera el verdadero Hipólito

### 📚 Experiencia Educativa Completa
- **Historia interactiva** con navegación por capítulos
- **Chat dedicado para niños** con sugerencias y ayuda
- **Material para educadores** con guías de uso
- **Sistema de métricas** para seguimiento del progreso

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Ollama instalado** ([Descargar aquí](https://ollama.ai/))
- **Modelo llama3.2:1b** descargado

### Instalación de Ollama y Modelo

1. **Instalar Ollama:**
   ```bash
   # Descargar desde https://ollama.ai/
   # Seguir las instrucciones para tu sistema operativo
   ```

2. **Descargar el modelo:**
   ```bash
   ollama pull llama3.2:1b
   ```

3. **Verificar instalación:**
   ```bash
   ollama list
   # Debe aparecer llama3.2:1b en la lista
   ```

### Uso del Proyecto

1. **Abrir el Centro de Actividades:**
   - Ir a `inicio.html` en tu navegador
   - Verificar que Ollama esté ejecutándose

2. **Para Niños - Chat Directo:**
   - Hacer clic en "Chat con Hipólito"
   - Comenzar a conversar inmediatamente

3. **Para Lectura Completa:**
   - Hacer clic en "Cuento Interactivo"
   - Navegar por la historia usando los botones

## 📁 Estructura del Proyecto

```
Hipólito, mi perro-dragón/
├── 📄 inicio.html              # 🏠 Centro de actividades (ENTRADA PRINCIPAL)
├── 💬 chat-infantil.html       # 👶 Chat dedicado para niños
├── 📚 index.html               # 📖 Historia completa interactiva
├── ⚡ chat-simple.html         # 🔧 Chat simplificado para pruebas
│
├── 🎨 css/
│   ├── estilos.css             # Estilos principales
│   └── estilos-infantiles.css  # Estilos especiales para niños
│
├── 🧠 js/
│   ├── hipolito-ia.js          # Motor de IA y conexión con Ollama
│   ├── chat-hipolito.js        # Lógica del chat interactivo
│   ├── cuento.js               # Navegación de la historia
│   ├── app-simple.js           # Aplicación simplificada
│   └── metricas.js             # Seguimiento y analytics
│
├── 📊 data/
│   ├── preguntas-respuestas.json  # Base de datos de conversaciones
│   ├── cuento-estructura.json     # Estructura del cuento
│   └── vocabulario.json           # Glosario y vocabulario
│
├── 🖼️ assets/
│   ├── iconos/                 # Iconos del proyecto
│   └── imagenes/               # Imágenes (por agregar)
│
├── 📋 archivos/
│   ├── 📖 documentacion/       # Documentación técnica
│   ├── 🧪 pruebas/            # Herramientas de testing
│   └── 🗄️ deprecated/         # Código legacy
│
├── 📖 docs/
│   └── manual-docentes.md      # Manual para educadores
│
├── ⚙️ CONFIGURACION.md         # Configuración técnica
└── 📱 manifest.json           # Configuración PWA
```

## 🎮 Modos de Uso

### 👶 Para Niños (8-9 años)
**Archivo:** `chat-infantil.html`
- Interfaz colorida y simple
- Botones grandes fáciles de presionar
- Sugerencias de preguntas
- Mensaje de bienvenida automático

### 📚 Para Lectura Educativa
**Archivo:** `index.html`
- Historia completa por capítulos
- Chat integrado para preguntas
- Navegación intuitiva
- Material educativo completo

### ⚡ Para Pruebas Rápidas
**Archivo:** `chat-simple.html`
- Interfaz minimalista
- Testing directo de respuestas
- Debug y desarrollo

### 🏠 Centro de Control
**Archivo:** `inicio.html`
- Hub principal de actividades
- Verificación del sistema
- Acceso a todas las funciones

## 👩‍🏫 Para Educadores

### Objetivos Pedagógicos
- **Comprensión lectora:** Interacción con personajes de la historia
- **Expresión oral:** Conversación natural con IA
- **Creatividad:** Exploración de nuevas situaciones con Hipólito
- **Tecnología educativa:** Familiarización con IA en un entorno seguro

### Guía de Uso en Clase
1. **Preparación:** Verificar que Ollama esté funcionando
2. **Lectura:** Los estudiantes leen algunos capítulos
3. **Conversación:** Acceden al chat para explorar la historia
4. **Reflexión:** Discusión grupal sobre la experiencia

### Métricas y Seguimiento
- Número de interacciones por estudiante
- Tipos de preguntas más frecuentes
- Tiempo de uso por sesión
- Progreso en la comprensión del cuento

## 🔧 Configuración Técnica

### Configuración de Ollama
```bash
# Asegurar que Ollama esté ejecutándose
ollama serve

# Verificar estado
curl http://localhost:11434/api/tags
```

### Variables de Configuración
- **Puerto Ollama:** 11434 (por defecto)
- **Modelo IA:** llama3.2:1b
- **Timeout:** 30 segundos
- **Memoria de chat:** 10 mensajes

### Personalización
- Editar `data/preguntas-respuestas.json` para nuevas respuestas
- Modificar `css/estilos-infantiles.css` para cambiar colores
- Actualizar `js/hipolito-ia.js` para ajustar comportamiento

## 🛠️ Desarrollo y Contribución

### Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **IA:** Ollama + llama3.2:1b
- **Diseño:** Gradientes CSS, animaciones, responsive design
- **Accesibilidad:** ARIA labels, alto contraste, navegación por teclado

### Estructura de Código
- **Modular:** Cada funcionalidad en su propio archivo JS
- **Responsive:** Diseño adaptable a móviles y tablets
- **Accesible:** Cumple estándares WCAG 2.1
- **Mantenible:** Código documentado y bien estructurado

### Testing
```bash
# Abrir archivos de prueba en archivos/pruebas/
# - test-casos-problematicos.html
# - prueba-final.html
# - test-chat.html
```

## 📈 Roadmap y Mejoras Futuras

### Versión 2.1 (Próxima)
- [ ] Síntesis de voz (text-to-speech)
- [ ] Más animaciones y efectos visuales
- [ ] Sistema de logros y badges
- [ ] Modo multiidioma

### Versión 2.2
- [ ] Ilustraciones del cuento
- [ ] Mini-juegos educativos
- [ ] Chat grupal para clases
- [ ] Dashboard para profesores

### Versión 3.0
- [ ] Aplicación móvil nativa
- [ ] Más historias y personajes
- [ ] IA más avanzada
- [ ] Realidad aumentada

## 🔒 Privacidad y Seguridad

### Características de Seguridad
- **IA 100% local:** No se envían datos a servidores externos
- **Sin registro de usuario:** No se almacenan datos personales
- **Código abierto:** Transparencia total en funcionamiento
- **Control parental:** Respuestas controladas y educativas

### Cumplimiento de Normativas
- **COPPA compliant:** Diseñado para menores de 13 años
- **GDPR ready:** No recolección de datos personales
- **Educación:** Cumple estándares educativos internacionales

## 🆘 Soporte y Resolución de Problemas

### Problemas Comunes

**❌ "Hipólito está dormido"**
```bash
# Solución: Iniciar Ollama
ollama serve
```

**❌ "Modelo no encontrado"**
```bash
# Solución: Descargar modelo
ollama pull llama3.2:1b
```

**❌ "Chat no responde"**
- Verificar conexión a internet
- Reiniciar navegador
- Comprobar que JavaScript esté habilitado

### Contacto y Soporte
- **Documentación:** Ver `archivos/documentacion/`
- **Pruebas:** Usar `archivos/pruebas/`
- **Configuración:** Consultar `CONFIGURACION.md`

## 📜 Licencia

Este proyecto está diseñado para uso educativo. Se permite:
- ✅ Uso en aulas y centros educativos
- ✅ Modificación para necesidades pedagógicas
- ✅ Distribución en contextos educativos
- ✅ Estudio y aprendizaje del código

## 🙏 Agradecimientos

- **OpenAI/Meta** por los modelos de lenguaje
- **Ollama** por facilitar la IA local
- **Comunidad educativa** por feedback y testing
- **Desarrolladores** que contribuyen al proyecto

---

## 🚀 ¡Empezar Ahora!

1. **Descargar Ollama:** https://ollama.ai/
2. **Instalar modelo:** `ollama pull llama3.2:1b`
3. **Abrir:** `inicio.html` en tu navegador
4. **¡Conversar con Hipólito!** 🐉✨

---

*Hecho con ❤️ para la educación y el aprendizaje creativo*

**Versión:** 2.0  
**Última actualización:** Diciembre 2024  
**Compatibilidad:** Navegadores modernos + Ollama