/**
 * Sistema de Métricas para Investigación Educativa
 * Recopila datos de interacción sin información personal
 * Compatible con investigación universitaria
 */

class SistemaMetricas {
    constructor() {
        this.sesionActual = this.generarIdSesion();
        this.inicioSesion = Date.now();
        this.metricas = {
            sesion: this.sesionActual,
            dispositivoInfo: this.obtenerInfoDispositivo(),
            interacciones: [],
            lectura: {
                seccionesVisitadas: [],
                tiemposPorSeccion: {},
                decisionesTomadas: [],
                reiniciosHistoria: 0
            },
            chatbot: {
                preguntasRealizadas: [],
                respuestasUtiles: 0,
                respuestasInutiles: 0,
                tiempoPromedioRespuesta: 0,
                temasConsultados: [],
                nivelComprensionEstimado: 'inicial'
            },
            comportamiento: {
                patronesNavegacion: [],
                erroresComunes: [],
                momentosConfusion: [],
                ayudasSolicitadas: 0
            }
        };

        this.inicializarRecoleccion();
    }

    generarIdSesion() {
        return 'ses_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }

    obtenerInfoDispositivo() {
        return {
            pantalla: {
                ancho: window.screen.width,
                alto: window.screen.height,
                ratio: window.devicePixelRatio
            },
            navegador: {
                userAgent: navigator.userAgent.substring(0, 100), // Limitado por privacidad
                idioma: navigator.language,
                online: navigator.onLine
            },
            hora: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    inicializarRecoleccion() {
        // Métricas de tiempo de lectura
        this.observadorVisibilidad();

        // Métricas de interacción
        this.rastrearClicks();
        this.rastrearDesplazamiento();

        // Métricas de performance
        this.medirTiemposCarga();

        // Guardar métricas cada 30 segundos
        setInterval(() => this.guardarMetricas(), 30000);

        // Guardar al cerrar/cambiar página
        window.addEventListener('beforeunload', () => this.finalizarSesion());
        window.addEventListener('visibilitychange', () => this.cambioVisibilidad());
    }

    /**
     * MÉTRICAS DE LECTURA
     */
    seccionIniciada(seccionId, contenido) {
        const evento = {
            tipo: 'seccion_iniciada',
            seccionId: seccionId,
            timestamp: Date.now(),
            longitudContenido: contenido ? contenido.length : 0
        };

        this.metricas.interacciones.push(evento);
        this.metricas.lectura.seccionesVisitadas.push({
            seccion: seccionId,
            inicio: Date.now()
        });

        console.log('Métrica: Sección iniciada', seccionId);
    }

    seccionFinalizada(seccionId) {
        const seccionActual = this.metricas.lectura.seccionesVisitadas.find(
            s => s.seccion === seccionId && !s.fin
        );

        if (seccionActual) {
            seccionActual.fin = Date.now();
            seccionActual.tiempoLectura = seccionActual.fin - seccionActual.inicio;

            this.metricas.lectura.tiemposPorSeccion[seccionId] =
                (this.metricas.lectura.tiemposPorSeccion[seccionId] || 0) + seccionActual.tiempoLectura;
        }

        this.metricas.interacciones.push({
            tipo: 'seccion_finalizada',
            seccionId: seccionId,
            timestamp: Date.now(),
            tiempoLectura: seccionActual ? seccionActual.tiempoLectura : 0
        });
    }

    decisionTomada(seccionId, opcionElegida, opcionesDisponibles) {
        const evento = {
            tipo: 'decision_tomada',
            seccionId: seccionId,
            opcionElegida: opcionElegida,
            totalOpciones: opcionesDisponibles.length,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);
        this.metricas.lectura.decisionesTomadas.push(evento);

        console.log('Métrica: Decisión tomada', opcionElegida);
    }

    /**
     * MÉTRICAS DE CHATBOT
     */
    preguntaRealizada(pregunta, contextoSeccion) {
        const evento = {
            tipo: 'pregunta_chatbot',
            pregunta: this.anonimizarTexto(pregunta),
            longitudPregunta: pregunta.length,
            contextoSeccion: contextoSeccion,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);
        this.metricas.chatbot.preguntasRealizadas.push(evento);

        // Analizar tema de la pregunta
        const tema = this.clasificarTemaPregunta(pregunta);
        this.metricas.chatbot.temasConsultados.push(tema);
    }

    respuestaRecibida(pregunta, respuesta, tiempoRespuesta, utilidad = null) {
        const evento = {
            tipo: 'respuesta_chatbot',
            preguntaId: this.metricas.chatbot.preguntasRealizadas.length - 1,
            tipoRespuesta: respuesta.tipo,
            confianzaRespuesta: respuesta.confianza,
            tiempoRespuesta: tiempoRespuesta,
            utilidad: utilidad,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);

        // Actualizar estadísticas
        if (utilidad === 'util') {
            this.metricas.chatbot.respuestasUtiles++;
        } else if (utilidad === 'inutil') {
            this.metricas.chatbot.respuestasInutiles++;
        }

        // Actualizar tiempo promedio
        const tiempos = this.metricas.chatbot.preguntasRealizadas
            .filter(p => p.tiempoRespuesta)
            .map(p => p.tiempoRespuesta);

        if (tiempos.length > 0) {
            this.metricas.chatbot.tiempoPromedioRespuesta =
                tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
        }
    }

    ayudaSolicitada(tipoAyuda, contexto) {
        this.metricas.interacciones.push({
            tipo: 'ayuda_solicitada',
            tipoAyuda: tipoAyuda,
            contexto: contexto,
            timestamp: Date.now()
        });

        this.metricas.comportamiento.ayudasSolicitadas++;
    }

    /**
     * MÉTRICAS DE COMPORTAMIENTO
     */
    errorDetectado(tipoError, contexto, accionTomada) {
        const evento = {
            tipo: 'error_usuario',
            tipoError: tipoError,
            contexto: contexto,
            accionTomada: accionTomada,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);
        this.metricas.comportamiento.erroresComunes.push(evento);
    }

    momentoConfusion(indicadores, seccionId) {
        const evento = {
            tipo: 'confusion_detectada',
            indicadores: indicadores, // ej: ['tiempo_excesivo', 'clicks_repetidos']
            seccionId: seccionId,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);
        this.metricas.comportamiento.momentosConfusion.push(evento);
    }

    /**
     * ANÁLISIS Y PROCESAMIENTO
     */
    clasificarTemaPregunta(pregunta) {
        const temas = {
            personajes: /hipolito|sara|benjamin|iscarotes|falkor|adriano/i,
            lugares: /isla|cordoba|biblioteca|casa|estrecho|gargolas/i,
            vocabulario: /que significa|que es|definicion|explica/i,
            historia: /que pasa|final|historia|cuento|aventura/i,
            tecnico: /como|donde|boton|menu|ayuda/i
        };

        for (const [tema, patron] of Object.entries(temas)) {
            if (patron.test(pregunta)) {
                return tema;
            }
        }

        return 'otro';
    }

    anonimizarTexto(texto) {
        // Reemplazar posibles nombres propios por marcadores
        return texto
            .replace(/\b[A-Z][a-z]+\b/g, '[NOMBRE]')
            .replace(/\b\d+\b/g, '[NUMERO]')
            .substring(0, 100); // Limitar longitud
    }

    calcularNivelComprension() {
        const preguntas = this.metricas.chatbot.preguntasRealizadas;
        const respuestasUtiles = this.metricas.chatbot.respuestasUtiles;
        const tiemposLectura = Object.values(this.metricas.lectura.tiemposPorSeccion);

        let puntuacion = 0;

        // Factor 1: Proporción de respuestas útiles
        if (preguntas.length > 0) {
            puntuacion += (respuestasUtiles / preguntas.length) * 30;
        }

        // Factor 2: Variedad de temas consultados
        const temasUnicos = new Set(this.metricas.chatbot.temasConsultados);
        puntuacion += Math.min(temasUnicos.size * 10, 30);

        // Factor 3: Tiempo de lectura (ni muy rápido ni muy lento)
        const tiempoPromedio = tiemposLectura.length > 0 ?
            tiemposLectura.reduce((a, b) => a + b, 0) / tiemposLectura.length : 0;

        if (tiempoPromedio > 30000 && tiempoPromedio < 300000) { // Entre 30 seg y 5 min por sección
            puntuacion += 20;
        }

        // Factor 4: Pocas ayudas solicitadas (autonomía)
        if (this.metricas.comportamiento.ayudasSolicitadas < 3) {
            puntuacion += 20;
        }

        // Clasificar nivel
        if (puntuacion >= 80) return 'avanzado';
        if (puntuacion >= 50) return 'intermedio';
        return 'basico';
    }

    /**
     * OBSERVADORES Y EVENTOS
     */
    observadorVisibilidad() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.metricas.interacciones.push({
                    tipo: 'pestaña_oculta',
                    timestamp: Date.now()
                });
            } else {
                this.metricas.interacciones.push({
                    tipo: 'pestaña_visible',
                    timestamp: Date.now()
                });
            }
        });
    }

    rastrearClicks() {
        document.addEventListener('click', (evento) => {
            const elemento = evento.target;
            const tipoElemento = elemento.tagName.toLowerCase();
            const clases = elemento.className;
            const id = elemento.id;

            this.metricas.interacciones.push({
                tipo: 'click',
                elemento: tipoElemento,
                clases: clases,
                id: id,
                timestamp: Date.now()
            });
        });
    }

    rastrearDesplazamiento() {
        let ultimoDesplazamiento = 0;

        window.addEventListener('scroll', () => {
            const ahora = Date.now();
            if (ahora - ultimoDesplazamiento > 1000) { // Cada segundo máximo
                this.metricas.interacciones.push({
                    tipo: 'scroll',
                    posicion: window.scrollY,
                    timestamp: ahora
                });
                ultimoDesplazamiento = ahora;
            }
        });
    }

    medirTiemposCarga() {
        window.addEventListener('load', () => {
            const navegacion = performance.getEntriesByType('navigation')[0];

            this.metricas.interacciones.push({
                tipo: 'tiempo_carga',
                tiempoCarga: navegacion.loadEventEnd - navegacion.fetchStart,
                tiempoDOM: navegacion.domContentLoadedEventEnd - navegacion.fetchStart,
                timestamp: Date.now()
            });
        });
    }

    cambioVisibilidad() {
        const evento = {
            tipo: 'cambio_visibilidad',
            oculto: document.hidden,
            timestamp: Date.now()
        };

        this.metricas.interacciones.push(evento);
    }

    /**
     * PERSISTENCIA DE DATOS
     */
    guardarMetricas() {
        try {
            // Actualizar nivel de comprensión
            this.metricas.chatbot.nivelComprensionEstimado = this.calcularNivelComprension();

            // Guardar en localStorage
            const datosGuardar = {
                ...this.metricas,
                ultimaActualizacion: Date.now()
            };

            localStorage.setItem(`metricas_${this.sesionActual}`, JSON.stringify(datosGuardar));

            // También mantener métricas agregadas
            this.agregarMetricasGlobales();

        } catch (error) {
            console.error('Error guardando métricas:', error);
        }
    }

    agregarMetricasGlobales() {
        try {
            const globales = JSON.parse(localStorage.getItem('metricas_globales') || '{}');

            globales.totalSesiones = (globales.totalSesiones || 0) + 1;
            globales.tiempoTotalUso = (globales.tiempoTotalUso || 0) + (Date.now() - this.inicioSesion);
            globales.preguntasTotales = (globales.preguntasTotales || 0) + this.metricas.chatbot.preguntasRealizadas.length;
            globales.ultimaSesion = Date.now();

            localStorage.setItem('metricas_globales', JSON.stringify(globales));

        } catch (error) {
            console.error('Error actualizando métricas globales:', error);
        }
    }

    finalizarSesion() {
        this.metricas.interacciones.push({
            tipo: 'sesion_finalizada',
            duracionTotal: Date.now() - this.inicioSesion,
            timestamp: Date.now()
        });

        this.guardarMetricas();
    }

    /**
     * EXPORTACIÓN PARA INVESTIGACIÓN
     */
    exportarDatosInvestigacion() {
        const datosLimpios = {
            sesion: this.sesionActual,
            dispositivo: this.metricas.dispositivoInfo,
            duracionSesion: Date.now() - this.inicioSesion,

            // Métricas de lectura
            seccionesCompletadas: this.metricas.lectura.seccionesVisitadas.length,
            tiempoPromedioLectura: this.calcularTiempoPromedioLectura(),
            decisionesTomadas: this.metricas.lectura.decisionesTomadas.length,

            // Métricas de comprensión
            preguntasRealizadas: this.metricas.chatbot.preguntasRealizadas.length,
            respuestasUtiles: this.metricas.chatbot.respuestasUtiles,
            temasExplorados: new Set(this.metricas.chatbot.temasConsultados).size,
            nivelComprension: this.metricas.chatbot.nivelComprensionEstimado,

            // Métricas de comportamiento
            ayudasSolicitadas: this.metricas.comportamiento.ayudasSolicitadas,
            erroresComunes: this.metricas.comportamiento.erroresComunes.length,
            momentosConfusion: this.metricas.comportamiento.momentosConfusion.length,

            // Metadata
            fechaHora: new Date().toISOString(),
            version: '1.0.0'
        };

        return datosLimpios;
    }

    calcularTiempoPromedioLectura() {
        const tiempos = Object.values(this.metricas.lectura.tiemposPorSeccion);
        return tiempos.length > 0 ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length : 0;
    }

    obtenerResumenSesion() {
        return {
            duracion: Math.round((Date.now() - this.inicioSesion) / 1000 / 60), // minutos
            secciones: this.metricas.lectura.seccionesVisitadas.length,
            preguntas: this.metricas.chatbot.preguntasRealizadas.length,
            nivel: this.metricas.chatbot.nivelComprensionEstimado,
            interacciones: this.metricas.interacciones.length
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaMetricas;
}
