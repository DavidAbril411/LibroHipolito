/**
 * Chatbot Hipólito con IA Local 🐉
 * Versión simplificada que usa Ollama para entender mejor a los niños
 */

class ChatbotHipolito {
    constructor() {
        this.motorIA = new MotorIA();
        this.interfazLista = false;
        this.esperandoRespuesta = false;

        // Elementos DOM
        this.chatContainer = null;
        this.chatMensajes = null;
        this.inputChat = null;
        this.btnEnviar = null;
        this.sugerenciasContainer = null;
        this.indicadorEscribiendo = null;
    }

    async inicializar() {
        try {
            console.log('🚀 Inicializando Chatbot Hipólito...');

            // Inicializar la IA
            await this.motorIA.inicializar();

            // Configurar interfaz
            this.configurarInterfaz();
            this.mostrarMensajeBienvenida();

            // Mostrar sugerencias después de la bienvenida
            setTimeout(() => {
                this.mostrarSugerencias();
            }, 1000);

            console.log('✅ Chatbot Hipólito listo para conversar');

        } catch (error) {
            console.error('❌ Error inicializando chatbot:', error);
            this.mostrarErrorConexion();
        }
    }

    configurarInterfaz() {
        // Buscar elementos del chat
        this.chatContainer = document.getElementById('chat-container');
        this.chatMensajes = document.getElementById('chat-mensajes');
        this.inputChat = document.getElementById('chat-input');
        this.btnEnviar = document.getElementById('btn-enviar');
        this.sugerenciasContainer = document.getElementById('sugerencias-container');

        if (!this.chatMensajes || !this.inputChat || !this.btnEnviar) {
            throw new Error('No se encontraron los elementos del chat en el DOM');
        }

        // Crear indicador de "escribiendo"
        this.crearIndicadorEscribiendo();

        // Eventos
        this.btnEnviar.addEventListener('click', () => this.enviarMensaje());
        this.inputChat.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarMensaje();
            }
        });

        // Auto-focus en el input
        this.inputChat.focus();

        this.interfazLista = true;
        console.log('🎨 Interfaz configurada');
    }

    crearIndicadorEscribiendo() {
        this.indicadorEscribiendo = document.createElement('div');
        this.indicadorEscribiendo.className = 'mensaje hipolito escribiendo';
        this.indicadorEscribiendo.innerHTML = `
            <div class="avatar">🐉</div>
            <div class="contenido">
                <strong>Hipólito</strong>
                <div class="puntos-escribiendo">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        this.indicadorEscribiendo.style.display = 'none';
        this.chatMensajes.appendChild(this.indicadorEscribiendo);
    }

    async enviarMensaje() {
        const mensaje = this.inputChat.value.trim();

        if (!mensaje || this.esperandoRespuesta) return;

        // Mostrar mensaje del usuario
        this.mostrarMensajeUsuario(mensaje);

        // Limpiar input y deshabilitarlo temporalmente
        this.inputChat.value = '';
        this.esperandoRespuesta = true;
        this.inputChat.disabled = true;
        this.btnEnviar.disabled = true;

        // Mostrar indicador de escritura
        this.mostrarEscribiendo();

        try {
            // Obtener respuesta de la IA
            const respuesta = await this.motorIA.preguntarIA(mensaje);

            // Simular un poco de delay para que se sienta natural
            await this.esperar(800);

            // Mostrar respuesta de Hipólito
            this.mostrarMensajeHipolito(respuesta);

        } catch (error) {
            console.error('Error obteniendo respuesta:', error);
            this.mostrarMensajeHipolito("¡Ups! Mi magia se enredó un poco. ¿Puedes intentar de nuevo? 🐉");
        } finally {
            // Rehabilitar interfaz
            this.ocultarEscribiendo();
            this.esperandoRespuesta = false;
            this.inputChat.disabled = false;
            this.btnEnviar.disabled = false;
            this.inputChat.focus();
        }
    }

    mostrarMensajeUsuario(mensaje) {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = 'mensaje usuario';
        elementoMensaje.innerHTML = `
            <div class="contenido">
                <strong>Tú</strong>
                <p>${this.escaparHTML(mensaje)}</p>
            </div>
            <div class="avatar">👤</div>
        `;

        this.chatMensajes.appendChild(elementoMensaje);
        this.scrollAlFinal();
    }

    mostrarMensajeHipolito(respuesta) {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = 'mensaje hipolito';
        elementoMensaje.innerHTML = `
            <div class="avatar">🐉</div>
            <div class="contenido">
                <strong>Hipólito</strong>
                <p>${this.escaparHTML(respuesta)}</p>
            </div>
        `;

        this.chatMensajes.appendChild(elementoMensaje);
        this.scrollAlFinal();
    }

    mostrarMensajeBienvenida() {
        const bienvenida = "¡Hola! Soy Hipólito, tu perro-dragón favorito 🐉 ¡Puedes preguntarme lo que quieras sobre mis aventuras con Sara y Benjamín!";

        setTimeout(() => {
            this.mostrarMensajeHipolito(bienvenida);
        }, 500);
    }

    mostrarSugerencias() {
        if (!this.sugerenciasContainer) return;

        const sugerencias = this.motorIA.obtenerSugerencias();

        this.sugerenciasContainer.innerHTML = '<h4>💡 Pregúntame sobre:</h4>';

        sugerencias.forEach(sugerencia => {
            const btn = document.createElement('button');
            btn.className = 'sugerencia-btn';
            btn.textContent = sugerencia;
            btn.addEventListener('click', () => {
                this.inputChat.value = sugerencia;
                this.enviarMensaje();
            });
            this.sugerenciasContainer.appendChild(btn);
        });
    }

    mostrarEscribiendo() {
        this.indicadorEscribiendo.style.display = 'flex';
        this.scrollAlFinal();
    }

    ocultarEscribiendo() {
        this.indicadorEscribiendo.style.display = 'none';
    }

    mostrarErrorConexion() {
        if (!this.chatMensajes) return;

        const error = document.createElement('div');
        error.className = 'mensaje error';
        error.innerHTML = `
            <div class="avatar">⚠️</div>
            <div class="contenido">
                <strong>Error de Conexión</strong>
                <p>No se pudo conectar con Hipólito. Asegúrate de que Ollama esté ejecutándose.</p>
                <button onclick="location.reload()" class="btn-reintentar">Reintentar</button>
            </div>
        `;

        this.chatMensajes.appendChild(error);
        this.scrollAlFinal();
    }

    scrollAlFinal() {
        if (this.chatMensajes) {
            this.chatMensajes.scrollTop = this.chatMensajes.scrollHeight;
        }
    }

    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    async esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Método para limpiar la conversación
    limpiarChat() {
        if (this.chatMensajes) {
            // Mantener solo el indicador de escribiendo
            this.chatMensajes.innerHTML = '';
            this.chatMensajes.appendChild(this.indicadorEscribiendo);
        }

        this.motorIA.limpiarHistorial();
        this.mostrarMensajeBienvenida();
    }
}

// Hacer disponible globalmente
window.ChatbotHipolito = ChatbotHipolito;
