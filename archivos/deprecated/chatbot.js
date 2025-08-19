/**
 * Motor del Chatbot Educativo para Hipólito
 * Integra NLP básico con interfaz de usuario
 * Diseñado para niños de 8-9 años
 */

class ChatbotEducativo {
    constructor(nlpMotor, sistemaMetricas) {
        this.nlp = nlpMotor;
        this.metricas = sistemaMetricas;
        this.historialConversacion = [];
        this.contextoActual = '';
        this.nivelUsuario = 'intermedio'; // basico, intermedio, avanzado
        this.esperandoRespuesta = false;
        this.mensajeBienvenidaMostrado = false;

        // Elementos DOM
        this.chatContainer = null;
        this.chatMensajes = null;
        this.inputChat = null;
        this.btnEnviar = null;
        this.sugerenciasContainer = null;

        // La inicialización debe ser llamada externamente
        this.listo = false;
    }

    async inicializar() {
        try {
            console.log('🤖 Inicializando chatbot educativo...');

            // Esperar a que el NLP esté listo
            if (!this.nlp?.datosListos) {
                console.log('⏳ Esperando a que el NLP esté listo...');
                await this.nlp?.inicializar();
                if (this.nlp) {
                    this.nlp.datosListos = true;
                }
            }

            this.configurarElementosDOM();
            this.configurarEventos();
            this.mostrarMensajeBienvenida();

            this.listo = true;
            console.log('✅ Chatbot educativo inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando chatbot:', error);
            this.mostrarErrorConexion();
            // Permitir funcionamiento básico incluso con errores
            this.listo = true;
        }
    }

    configurarElementosDOM() {
        this.chatContainer = document.getElementById('chatbot-container');
        this.chatMensajes = document.getElementById('chat-mensajes');
        this.inputChat = document.getElementById('input-chat');
        this.btnEnviar = document.getElementById('btn-enviar');
        this.sugerenciasContainer = document.querySelector('.sugerencias-botones');

        if (!this.chatContainer) {
            console.warn('⚠️ Elementos del chatbot no encontrados en el DOM');
            return false;
        }

        console.log('✅ Elementos DOM del chatbot configurados');
        return true;
    }

    configurarEventos() {
        // Envío de mensajes
        if (this.btnEnviar) {
            this.btnEnviar.addEventListener('click', () => this.enviarMensaje());
        }

        if (this.inputChat) {
            this.inputChat.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.enviarMensaje();
                }
            });

            // Detectar cuando el usuario está escribiendo
            this.inputChat.addEventListener('input', () => this.usuarioEscribiendo());
        }

        // Sugerencias rápidas
        if (this.sugerenciasContainer) {
            this.sugerenciasContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-sugerencia')) {
                    const pregunta = e.target.dataset.pregunta;
                    this.procesarPreguntaSugerida(pregunta);
                }
            });
        }

        // Control de visibilidad del chat
        this.configurarControlesChat();
    }

    configurarControlesChat() {
        const btnChat = document.getElementById('btn-chat');
        const btnMinimizar = document.getElementById('btn-minimizar-chat');
        const btnCerrar = document.getElementById('btn-cerrar-chat');

        if (btnChat) {
            btnChat.addEventListener('click', () => this.mostrarChat());
        }

        if (btnMinimizar) {
            btnMinimizar.addEventListener('click', () => this.minimizarChat());
        }

        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.ocultarChat());
        }
    }

    mostrarMensajeBienvenida() {
        // Evitar duplicados si ya se mostró
        if (this.mensajeBienvenidaMostrado) return;
        this.mensajeBienvenidaMostrado = true;

        const mensajeBienvenida = {
            texto: "¡Hola! Soy tu ayudante para el cuento de Hipólito 🐉\n\n" +
                "Puedes preguntarme:\n" +
                "• ¿Cómo se llaman los personajes?\n" +
                "• ¿Dónde pasa la historia?\n" +
                "• ¿Qué significa una palabra?\n\n" +
                "¿Qué quieres saber?",
            tipo: 'bienvenida',
            timestamp: Date.now()
        };

        this.mostrarMensaje(mensajeBienvenida, 'bot');
        this.actualizarSugerencias();
    }

    async enviarMensaje() {
        const texto = this.inputChat.value.trim();

        if (!texto || this.esperandoRespuesta) return;

        // Limpiar input
        this.inputChat.value = '';
        this.esperandoRespuesta = true;

        // Mostrar mensaje del usuario
        this.mostrarMensaje({ texto, timestamp: Date.now() }, 'usuario');

        // Registrar métrica
        if (this.metricas?.registrarInteraccion) {
            this.metricas.registrarInteraccion('pregunta', {
                texto: texto,
                contexto: this.contextoActual,
                timestamp: Date.now()
            });
        }

        // Mostrar indicador de "escribiendo"
        this.mostrarIndicadorEscribiendo();

        try {
            // Procesar con NLP
            const tiempoInicio = Date.now();
            const respuesta = this.nlp.buscarRespuesta(texto, this.nivelUsuario);
            const tiempoRespuesta = Date.now() - tiempoInicio;

            // Simular delay natural (para que no parezca instantáneo)
            const textoRespuesta = respuesta.texto || respuesta.respuesta || "Respuesta no disponible";
            await this.delay(Math.max(500, Math.min(2000, textoRespuesta.length * 30)));

            // Ocultar indicador
            this.ocultarIndicadorEscribiendo();

            // Mostrar respuesta
            this.mostrarRespuesta(respuesta);

            // Registrar métricas
            this.metricas?.preguntaRealizada?.(texto, respuesta, tiempoRespuesta);

            // Actualizar historial
            this.historialConversacion.push({
                pregunta: texto,
                respuesta: respuesta,
                timestamp: Date.now()
            });

            // Actualizar sugerencias basadas en el contexto
            this.actualizarSugerenciasContextuales(respuesta);

        } catch (error) {
            console.error('Error procesando mensaje:', error);
            this.ocultarIndicadorEscribiendo();
            this.mostrarErrorRespuesta();
        } finally {
            this.esperandoRespuesta = false;
        }
    }

    procesarPreguntaSugerida(pregunta) {
        // Prevenir duplicados
        if (this.esperandoRespuesta) return;

        this.inputChat.value = pregunta;
        this.enviarMensaje();
    }

    mostrarMensaje(mensaje, origen) {
        const elementoMensaje = document.createElement('div');
        elementoMensaje.className = `mensaje ${origen}`;

        const contenido = document.createElement('div');
        contenido.className = 'mensaje-contenido';

        // Procesar texto con formato
        contenido.innerHTML = this.formatearTexto(mensaje.texto);

        elementoMensaje.appendChild(contenido);

        // Agregar timestamp si es necesario
        if (mensaje.timestamp) {
            const tiempo = document.createElement('div');
            tiempo.className = 'mensaje-tiempo';
            tiempo.textContent = this.formatearTiempo(mensaje.timestamp);
            elementoMensaje.appendChild(tiempo);
        }

        this.chatMensajes.appendChild(elementoMensaje);
        this.scrollHaciaAbajo();

        // Animación de entrada
        setTimeout(() => {
            elementoMensaje.classList.add('visible');
        }, 100);
    }

    mostrarRespuesta(respuesta) {
        const textoRespuesta = respuesta.texto || respuesta.respuesta || "No pude procesar tu pregunta.";

        const mensaje = {
            texto: textoRespuesta,
            tipo: respuesta.tipo || 'respuesta',
            confianza: respuesta.confianza || 0.5,
            timestamp: Date.now()
        };

        this.mostrarMensaje(mensaje, 'bot');

        // Agregar botones de feedback si la confianza es baja
        if (respuesta.confianza && respuesta.confianza < 0.7) {
            this.mostrarBotonesFeedback();
        }

        // Mostrar información adicional si está disponible
        if (respuesta.vocabulario && respuesta.vocabulario.length > 0) {
            this.mostrarVocabularioRelacionado(respuesta.vocabulario);
        }
    }

    mostrarBotonesFeedback() {
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';

        feedbackContainer.innerHTML = `
            <p class="feedback-pregunta">¿Te fue útil esta respuesta?</p>
            <div class="feedback-botones">
                <button class="btn-feedback util" data-feedback="util">👍 Sí</button>
                <button class="btn-feedback inutil" data-feedback="inutil">👎 No</button>
            </div>
        `;

        // Agregar eventos
        feedbackContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-feedback')) {
                const feedback = e.target.dataset.feedback;
                this.procesarFeedback(feedback);
                feedbackContainer.remove();
            }
        });

        this.chatMensajes.appendChild(feedbackContainer);
        this.scrollHaciaAbajo();
    }

    procesarFeedback(feedback) {
        const ultimaInteraccion = this.historialConversacion[this.historialConversacion.length - 1];

        if (ultimaInteraccion) {
            this.metricas.respuestaRecibida(
                ultimaInteraccion.pregunta,
                ultimaInteraccion.respuesta,
                0,
                feedback
            );
        }

        if (feedback === 'inutil') {
            this.mostrarMensaje({
                texto: "Lo siento, déjame intentar explicártelo de otra manera. ¿Podrías ser más específico sobre qué parte no entendiste?",
                timestamp: Date.now()
            }, 'bot');
        } else {
            this.mostrarMensaje({
                texto: "¡Perfecto! ¿Hay algo más sobre el cuento que te gustaría saber?",
                timestamp: Date.now()
            }, 'bot');
        }
    }

    mostrarVocabularioRelacionado(vocabulario) {
        const vocabContainer = document.createElement('div');
        vocabContainer.className = 'vocabulario-relacionado';

        const titulo = document.createElement('h4');
        titulo.textContent = '📚 Palabras relacionadas:';
        vocabContainer.appendChild(titulo);

        vocabulario.forEach(palabra => {
            const botonPalabra = document.createElement('button');
            botonPalabra.className = 'btn-vocabulario';
            botonPalabra.textContent = palabra;
            botonPalabra.addEventListener('click', () => {
                this.inputChat.value = `¿Qué significa ${palabra}?`;
                this.enviarMensaje();
            });
            vocabContainer.appendChild(botonPalabra);
        });

        this.chatMensajes.appendChild(vocabContainer);
        this.scrollHaciaAbajo();
    }

    mostrarIndicadorEscribiendo() {
        const indicador = document.createElement('div');
        indicador.className = 'mensaje bot escribiendo';
        indicador.id = 'indicador-escribiendo';

        indicador.innerHTML = `
            <div class="mensaje-contenido">
                <div class="puntos-escribiendo">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        this.chatMensajes.appendChild(indicador);
        this.scrollHaciaAbajo();
    }

    ocultarIndicadorEscribiendo() {
        const indicador = document.getElementById('indicador-escribiendo');
        if (indicador) {
            indicador.remove();
        }
    }

    mostrarErrorRespuesta() {
        this.ocultarIndicadorEscribiendo();
        this.mostrarMensaje({
            texto: "Lo siento, tuve un problema técnico. ¿Podrías intentar preguntame de nuevo?",
            timestamp: Date.now()
        }, 'bot');
    }

    mostrarErrorConexion() {
        if (this.chatMensajes) {
            this.mostrarMensaje({
                texto: "⚠️ Hay un problema técnico con el asistente. Algunas funciones pueden no estar disponibles.",
                timestamp: Date.now()
            }, 'sistema');
        }
    }

    actualizarSugerencias() {
        if (!this.sugerenciasContainer) return;

        const sugerencias = this.nlp.generarSugerencias(this.contextoActual);

        this.sugerenciasContainer.innerHTML = '';
        sugerencias.forEach(sugerencia => {
            const boton = document.createElement('button');
            boton.className = 'btn-sugerencia';
            boton.dataset.pregunta = sugerencia;
            boton.textContent = sugerencia;
            this.sugerenciasContainer.appendChild(boton);
        });
    }

    actualizarSugerenciasContextuales(respuesta) {
        // Generar sugerencias basadas en la respuesta actual
        const sugerenciasContextuales = [];

        if (respuesta.vocabulario && respuesta.vocabulario.length > 0) {
            const palabra = respuesta.vocabulario[0];
            sugerenciasContextuales.push(`¿Qué más sobre ${palabra}?`);
        }

        if (respuesta.conceptos && respuesta.conceptos.length > 0) {
            const concepto = respuesta.conceptos[0];
            sugerenciasContextuales.push(`¿Podrías explicar ${concepto}?`);
        }

        // Agregar sugerencias generales
        sugerenciasContextuales.push("¿Qué pasa después?");
        sugerenciasContextuales.push("¿Quiénes son los personajes principales?");

        if (this.sugerenciasContainer) {
            this.sugerenciasContainer.innerHTML = '';
            sugerenciasContextuales.slice(0, 3).forEach(sugerencia => {
                const boton = document.createElement('button');
                boton.className = 'btn-sugerencia';
                boton.dataset.pregunta = sugerencia;
                boton.textContent = sugerencia;
                this.sugerenciasContainer.appendChild(boton);
            });
        }
    }

    usuarioEscribiendo() {
        // Detectar patrones de confusión (escribir y borrar repetidamente)
        const textoActual = this.inputChat.value;

        if (!this.ultimoTexto) {
            this.ultimoTexto = textoActual;
            return;
        }

        // Si el texto es mucho más corto que el anterior, posiblemente borró mucho
        if (this.ultimoTexto.length - textoActual.length > 10) {
            this.metricas.momentoConfusion(['borrado_extenso'], this.contextoActual);
        }

        this.ultimoTexto = textoActual;
    }

    establecerContexto(contexto) {
        this.contextoActual = contexto;
        console.log('Contexto del chatbot actualizado:', contexto);
    }

    adaptarNivelUsuario(nivel) {
        this.nivelUsuario = nivel;
        console.log('Nivel de usuario adaptado:', nivel);

        // Informar al usuario del cambio
        let mensaje = '';
        switch (nivel) {
            case 'basico':
                mensaje = 'Te voy a explicar las cosas de manera más simple. 😊';
                break;
            case 'avanzado':
                mensaje = 'Veo que entiendes bien, te daré explicaciones más detalladas. 🤓';
                break;
            default:
                mensaje = 'Ajusté mis respuestas a tu nivel de comprensión. 👍';
        }

        this.mostrarMensaje({
            texto: mensaje,
            timestamp: Date.now()
        }, 'bot');
    }

    // Controles de interfaz
    mostrarChat() {
        if (this.chatContainer) {
            this.chatContainer.classList.add('visible');
            this.metricas.ayudaSolicitada('chatbot_abierto', this.contextoActual);
        }
    }

    minimizarChat() {
        if (this.chatContainer) {
            this.chatContainer.classList.add('minimizado');
        }
    }

    ocultarChat() {
        if (this.chatContainer) {
            this.chatContainer.classList.remove('visible');
        }
    }

    // Utilidades
    formatearTexto(texto) {
        return texto
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    formatearTiempo(timestamp) {
        const fecha = new Date(timestamp);
        return fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    scrollHaciaAbajo() {
        if (this.chatMensajes) {
            this.chatMensajes.scrollTop = this.chatMensajes.scrollHeight;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos de acceso para otros componentes
    obtenerHistorial() {
        return this.historialConversacion;
    }

    limpiarChat() {
        if (this.chatMensajes) {
            this.chatMensajes.innerHTML = '';
            this.historialConversacion = [];
            this.mostrarMensajeBienvenida();
        }
    }

    obtenerEstadisticas() {
        return {
            mensajesEnviados: this.historialConversacion.length,
            nivelActual: this.nivelUsuario,
            contextoActual: this.contextoActual,
            chatVisible: this.chatContainer?.classList.contains('visible') || false
        };
    }

    /**
     * Procesa un mensaje directamente (para testing)
     */
    async procesarMensaje(texto) {
        if (!this.nlp?.datosListos) {
            return {
                texto: "Lo siento, aún estoy cargando. Inténtalo en un momento.",
                tipo: "error",
                confianza: 0
            };
        }

        try {
            const respuesta = this.nlp.buscarRespuesta(texto, this.nivelUsuario);
            return {
                texto: respuesta.respuesta || respuesta.texto,
                tipo: respuesta.tipo,
                confianza: respuesta.confianza,
                intencion: respuesta.intencion
            };
        } catch (error) {
            console.error('Error procesando mensaje:', error);
            return {
                texto: "Disculpa, hubo un error procesando tu pregunta. ¿Puedes intentar de nuevo?",
                tipo: "error",
                confianza: 0
            };
        }
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotEducativo;
}
