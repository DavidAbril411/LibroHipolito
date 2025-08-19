/**
 * Chat Simple para Hipólito IA
 * Interfaz súper sencilla para conversar con Hipólito
 */

class ChatHipolito {
    constructor() {
        this.hipolitoIA = new HipolitoIA();
        this.iniciado = false;
        this.escribiendo = false;

        // Elementos del DOM
        this.contenedorMensajes = null;
        this.inputMensaje = null;
        this.botonEnviar = null;
        this.indicadorEstado = null;
        this.sugerencias = null;
    }

    /**
     * Inicializa todo el sistema de chat
     */
    async inicializar() {
        try {
            console.log('💬 Inicializando Chat de Hipólito...');

            // Configurar elementos DOM
            this.configurarDOM();

            // Inicializar IA
            await this.hipolitoIA.inicializar();

            // Configurar eventos
            this.configurarEventos();

            // Limpiar mensajes previos
            this.contenedorMensajes.innerHTML = '';

            // Mostrar mensaje de bienvenida
            this.mostrarBienvenida();

            // Mostrar sugerencias
            this.mostrarSugerencias();

            // Habilitar chat
            this.habilitarChat();

            this.iniciado = true;
            console.log('✅ Chat de Hipólito listo');

        } catch (error) {
            console.error('❌ Error iniciando chat:', error);
            this.mostrarError(error.message);
            throw error; // Re-lanzar para que la app principal lo maneje
        }
    }

    /**
     * Configura los elementos del DOM
     */
    configurarDOM() {
        this.contenedorMensajes = document.getElementById('chat-mensajes');
        this.inputMensaje = document.getElementById('chat-input');
        this.botonEnviar = document.getElementById('btn-enviar');
        this.indicadorEstado = document.getElementById('estado-conexion');
        this.sugerencias = document.getElementById('sugerencias');

        if (!this.contenedorMensajes || !this.inputMensaje || !this.botonEnviar) {
            throw new Error('No se encontraron los elementos del chat en el HTML');
        }

        console.log('📋 Elementos DOM configurados');
    }

    /**
     * Configura eventos de interacción
     */
    configurarEventos() {
        // Botón enviar
        this.botonEnviar.addEventListener('click', () => this.enviarMensaje());

        // Enter en el input
        this.inputMensaje.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarMensaje();
            }
        });

        // Sugerencias
        if (this.sugerencias) {
            this.sugerencias.addEventListener('click', (e) => {
                if (e.target.classList.contains('sugerencia')) {
                    const pregunta = e.target.textContent;
                    this.inputMensaje.value = pregunta;
                    this.enviarMensaje();
                }
            });
        }

        console.log('⚡ Eventos configurados');
    }

    /**
     * Envía un mensaje a Hipólito
     */
    async enviarMensaje() {
        const mensaje = this.inputMensaje.value.trim();

        if (!mensaje || this.escribiendo) return;

        // Mostrar mensaje del usuario
        this.mostrarMensajeUsuario(mensaje);

        // Limpiar input
        this.inputMensaje.value = '';

        // Mostrar que Hipólito está escribiendo
        this.mostrarEscribiendo();

        try {
            // Obtener respuesta de Hipólito
            const respuesta = await this.hipolitoIA.preguntarAHipolito(mensaje);

            // Ocultar indicador de escribiendo
            this.ocultarEscribiendo();

            // Mostrar respuesta de Hipólito
            this.mostrarMensajeHipolito(respuesta);

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.ocultarEscribiendo();
            this.mostrarMensajeHipolito("¡Ups! Algo salió mal. ¿Puedes intentar de nuevo? 🐉");
        }
    }

    /**
     * Muestra un mensaje del usuario
     */
    mostrarMensajeUsuario(mensaje) {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = 'mensaje usuario';
        elementoMensaje.innerHTML = `
            <div class="contenido">
                <strong>Tú:</strong>
                <p>${this.escaparHTML(mensaje)}</p>
            </div>
            <div class="avatar">👤</div>
        `;

        this.contenedorMensajes.appendChild(elementoMensaje);
        this.scrollAlFinal();
    }

    /**
     * Muestra un mensaje de Hipólito
     */
    mostrarMensajeHipolito(respuesta) {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = 'mensaje hipolito';
        elementoMensaje.innerHTML = `
            <div class="avatar">🐉</div>
            <div class="contenido">
                <strong>Hipólito:</strong>
                <p>${this.escaparHTML(respuesta)}</p>
            </div>
        `;

        this.contenedorMensajes.appendChild(elementoMensaje);
        this.scrollAlFinal();
    }

    /**
     * Muestra mensaje de bienvenida
     */
    mostrarBienvenida() {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = 'mensaje hipolito bienvenida';
        elementoMensaje.innerHTML = `
            <div class="avatar">🐉</div>
            <div class="contenido">
                <strong>Hipólito:</strong>
                <p>¡Hola! Soy Hipólito, tu perro-dragón favorito 🐉✨</p>
                <p>¡Puedes preguntarme sobre mis aventuras con Sara y Benjamín!</p>
            </div>
        `;

        this.contenedorMensajes.appendChild(elementoMensaje);
        this.scrollAlFinal();
    }

    /**
     * Muestra indicador de que Hipólito está escribiendo
     */
    mostrarEscribiendo() {
        this.escribiendo = true;

        const indicador = document.createElement('div');
        indicador.className = 'mensaje hipolito escribiendo';
        indicador.id = 'indicador-escribiendo';
        indicador.innerHTML = `
            <div class="avatar">🐉</div>
            <div class="contenido">
                <div class="puntos-escribiendo">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        this.contenedorMensajes.appendChild(indicador);
        this.scrollAlFinal();

        // Deshabilitar input temporalmente
        this.inputMensaje.disabled = true;
        this.botonEnviar.disabled = true;
    }

    /**
     * Oculta indicador de escribiendo
     */
    ocultarEscribiendo() {
        this.escribiendo = false;

        const indicador = document.getElementById('indicador-escribiendo');
        if (indicador) {
            indicador.remove();
        }

        // Habilitar input nuevamente
        this.inputMensaje.disabled = false;
        this.botonEnviar.disabled = false;
        this.inputMensaje.focus();
    }

    /**
     * Muestra sugerencias de preguntas
     */
    mostrarSugerencias() {
        if (!this.sugerencias) return;

        const sugerenciasArray = this.hipolitoIA.obtenerSugerencias();

        this.sugerencias.innerHTML = `
            <h4>💡 Pregúntale a Hipólito:</h4>
            <div class="lista-sugerencias">
                ${sugerenciasArray.map(sug =>
            `<button class="sugerencia">${sug}</button>`
        ).join('')}
            </div>
        `;
    }

    /**
     * Muestra un error
     */
    mostrarError(mensaje) {
        if (this.indicadorEstado) {
            this.indicadorEstado.className = 'estado-conexion error';
            this.indicadorEstado.innerHTML = `❌ ${mensaje}`;
        }

        if (this.contenedorMensajes) {
            const elementoError = document.createElement('div');
            elementoError.className = 'mensaje error';
            elementoError.innerHTML = `
                <div class="avatar">⚠️</div>
                <div class="contenido">
                    <strong>Error:</strong>
                    <p>${mensaje}</p>
                    <button onclick="location.reload()" class="btn-reintentar">
                        🔄 Reintentar
                    </button>
                </div>
            `;

            this.contenedorMensajes.appendChild(elementoError);
        }
    }

    /**
     * Habilita el chat para uso
     */
    habilitarChat() {
        if (this.inputMensaje) {
            this.inputMensaje.disabled = false;
            this.inputMensaje.placeholder = "Escribe tu mensaje para Hipólito...";
            this.inputMensaje.focus();
        }

        if (this.botonEnviar) {
            this.botonEnviar.disabled = false;
        }

        if (this.indicadorEstado) {
            this.indicadorEstado.className = 'estado-conexion exito';
            this.indicadorEstado.innerHTML = '✅ Hipólito está listo para conversar';

            // Auto-ocultar después de 3 segundos
            setTimeout(() => {
                if (this.indicadorEstado) {
                    this.indicadorEstado.style.display = 'none';
                }
            }, 3000);
        }
    }

    /**
     * Hace scroll al final del chat
     */
    scrollAlFinal() {
        if (this.contenedorMensajes) {
            this.contenedorMensajes.scrollTop = this.contenedorMensajes.scrollHeight;
        }
    }

    /**
     * Escapa HTML para seguridad
     */
    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    /**
     * Limpia toda la conversación
     */
    limpiarChat() {
        if (this.contenedorMensajes) {
            this.contenedorMensajes.innerHTML = '';
        }

        this.hipolitoIA.limpiarConversacion();
        this.mostrarBienvenida();

        console.log('🧹 Chat limpiado');
    }

    /**
     * Verifica el estado de la conexión
     */
    async verificarConexion() {
        const conectado = await this.hipolitoIA.verificarOllama();

        if (!conectado) {
            this.mostrarError('Ollama no está disponible. ¿Está ejecutándose?');
        }

        return conectado;
    }
}

// Hacer disponible globalmente
window.ChatHipolito = ChatHipolito;
