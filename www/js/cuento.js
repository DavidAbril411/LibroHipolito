/**
 * Motor principal del cuento interactivo "Hipólito, mi perro-dragón"
 * Maneja la navegación, decisiones y progreso de lectura
 */

class MotorCuento {
    constructor(sistemaMetricas) {
        this.metricas = sistemaMetricas;
        this.estructuraCuento = null;
        this.seccionActual = 'inicio';
        this.progreso = {
            seccionesVisitadas: new Set(),
            decisionesTomadas: [],
            tiempoTotal: 0,
            inicioLectura: Date.now()
        };

        // Elementos DOM
        this.contenedorSeccion = null;
        this.barraProgreso = null;
        this.textoProgreso = null;

        // La inicialización debe ser llamada externamente
        this.listo = false;
    }

    async inicializar() {
        try {
            await this.cargarEstructura();
            this.configurarElementosDOM();
            this.mostrarSeccion(this.seccionActual);

            console.log('Motor del cuento inicializado');
        } catch (error) {
            console.error('Error inicializando motor del cuento:', error);
            this.mostrarError();
        }
    }

    async cargarEstructura() {
        try {
            const respuesta = await fetch('./data/cuento-estructura.json');
            this.estructuraCuento = await respuesta.json();
        } catch (error) {
            console.error('Error cargando estructura del cuento:', error);
            throw error;
        }
    }

    configurarElementosDOM() {
        this.contenedorSeccion = document.getElementById('seccion-actual');
        this.barraProgreso = document.getElementById('barra-progreso');
        this.textoProgreso = document.getElementById('progreso-texto');

        if (!this.contenedorSeccion) {
            console.error('Elemento contenedor del cuento no encontrado');
        }
    }

    mostrarSeccion(idSeccion) {
        if (!this.estructuraCuento?.estructura?.[idSeccion]) {
            console.error('Sección no encontrada:', idSeccion);
            return;
        }

        const seccion = this.estructuraCuento.estructura[idSeccion];

        // Registrar visita
        this.progreso.seccionesVisitadas.add(idSeccion);
        this.seccionActual = idSeccion;

        // Métricas
        this.metricas.seccionIniciada(idSeccion, seccion.texto || '');

        // Actualizar contexto del chatbot si está disponible
        if (window.chatbot) {
            window.chatbot.establecerContexto(idSeccion);
        }

        // Renderizar contenido
        this.renderizarSeccion(seccion);

        // Actualizar progreso
        this.actualizarProgreso();

        // Scroll hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('Mostrando sección:', idSeccion);
    }

    renderizarSeccion(seccion) {
        if (!this.contenedorSeccion) return;

        let html = `<div class="seccion-cuento">`;

        // Título de sección
        if (seccion.titulo) {
            html += `<h2>${seccion.titulo}</h2>`;
        }

        // Texto narrativo
        if (seccion.texto) {
            html += `<div class="texto-cuento">${this.formatearTexto(seccion.texto)}</div>`;
        }

        // Descripción larga
        if (seccion.descripcionLarga) {
            html += `<div class="texto-cuento">${this.formatearTexto(seccion.descripcionLarga)}</div>`;
        }

        // Diálogos
        if (seccion.dialogo && seccion.dialogo.length > 0) {
            html += this.renderizarDialogos(seccion.dialogo);
        }

        // Información adicional (mapas, etc.)
        if (seccion.informacionAdicional) {
            html += this.renderizarInformacionAdicional(seccion.informacionAdicional);
        }

        // Decisiones
        if (seccion.decision) {
            html += this.renderizarDecision(seccion.decision);
        }

        // Continuación automática
        if (seccion.continua) {
            html += this.renderizarContinuacion(seccion.continua);
        }

        // Final de historia
        if (seccion.esFinal) {
            html += this.renderizarFinal(seccion);
        }

        html += `</div>`;

        this.contenedorSeccion.innerHTML = html;

        // Configurar eventos después de renderizar
        this.configurarEventosSeccion();
    }

    renderizarDialogos(dialogos) {
        let html = '';

        dialogos.forEach(dialogo => {
            html += `
                <div class="dialogo">
                    <div class="personaje">${dialogo.personaje}:</div>
                    <div class="texto-dialogo">${this.formatearTexto(dialogo.texto)}</div>
                </div>
            `;
        });

        return html;
    }

    renderizarInformacionAdicional(info) {
        let html = `<div class="informacion-adicional">`;

        if (typeof info === 'object') {
            html += `<h3>🗺️ Información del Mapa</h3>`;
            for (const [clave, valor] of Object.entries(info)) {
                html += `
                    <div class="info-item">
                        <strong>${clave.replace('isla', 'Isla ').toUpperCase()}:</strong>
                        ${valor}
                    </div>
                `;
            }
        } else {
            html += this.formatearTexto(info);
        }

        html += `</div>`;
        return html;
    }

    renderizarDecision(decision) {
        let html = `
            <div class="decisiones">
                <h3>🤔 ${decision.pregunta}</h3>
                <div class="opciones-decision">
        `;

        decision.opciones.forEach(opcion => {
            html += `
                <button class="btn-decision" 
                        data-opcion="${opcion.id}" 
                        data-destino="${opcion.destino}">
                    ${opcion.texto}
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderizarContinuacion(destino) {
        return `
            <div class="continuacion">
                <button class="btn-decision btn-continuar" 
                        data-destino="${destino}">
                    ➡️ Continuar historia
                </button>
            </div>
        `;
    }

    renderizarFinal(seccion) {
        const tipoFinal = seccion.tipoFinal || 'neutro';
        const iconos = {
            bueno: '🎉',
            malo: '😔',
            neutro: '📖'
        };

        const colores = {
            bueno: 'var(--color-exito)',
            malo: 'var(--color-error)',
            neutro: 'var(--color-primario)'
        };

        return `
            <div class="final-historia" style="border-color: ${colores[tipoFinal]}">
                <h3>${iconos[tipoFinal]} Final de la Historia</h3>
                <p>Querido lector, querida lectora, no te preocupes, puedes continuar explorando otros posibles finales.</p>
                <div class="acciones-final">
                    <button class="btn-decision" onclick="motorCuento.reiniciarHistoria()">
                        🔄 Empezar de nuevo
                    </button>
                    <button class="btn-decision" onclick="motorCuento.mostrarEstadisticas()">
                        📊 Ver mi progreso
                    </button>
                </div>
            </div>
        `;
    }

    configurarEventosSeccion() {
        // Botones de decisión
        const botonesDecision = document.querySelectorAll('.btn-decision[data-destino]');
        botonesDecision.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const destino = e.target.dataset.destino;
                const opcion = e.target.dataset.opcion;
                this.tomarDecision(destino, opcion);
            });
        });

        // Botón continuar
        const botonContinuar = document.querySelector('.btn-continuar');
        if (botonContinuar) {
            botonContinuar.addEventListener('click', (e) => {
                const destino = e.target.dataset.destino;
                this.continuarHistoria(destino);
            });
        }
    }

    tomarDecision(destino, opcionId) {
        // Finalizar sección actual
        this.metricas.seccionFinalizada(this.seccionActual);

        // Registrar decisión
        const decision = {
            seccionOrigen: this.seccionActual,
            opcionElegida: opcionId,
            destino: destino,
            timestamp: Date.now()
        };

        this.progreso.decisionesTomadas.push(decision);

        // Obtener opciones disponibles para métricas
        const seccionActualData = this.estructuraCuento.estructura[this.seccionActual];
        const opcionesDisponibles = seccionActualData.decision ? seccionActualData.decision.opciones : [];

        this.metricas.decisionTomada(this.seccionActual, opcionId, opcionesDisponibles);

        // Mostrar nueva sección
        this.mostrarSeccion(destino);

        console.log('Decisión tomada:', decision);
    }

    continuarHistoria(destino) {
        this.metricas.seccionFinalizada(this.seccionActual);
        this.mostrarSeccion(destino);
    }

    formatearTexto(texto) {
        return texto
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    actualizarProgreso() {
        const totalSecciones = Object.keys(this.estructuraCuento.estructura).length;
        const seccionesVisitadas = this.progreso.seccionesVisitadas.size;
        const porcentaje = Math.round((seccionesVisitadas / totalSecciones) * 100);

        if (this.barraProgreso) {
            this.barraProgreso.style.width = `${porcentaje}%`;
        }

        if (this.textoProgreso) {
            this.textoProgreso.textContent = `${porcentaje}%`;
        }

        console.log(`Progreso: ${seccionesVisitadas}/${totalSecciones} secciones (${porcentaje}%)`);
    }

    reiniciarHistoria() {
        // Confirmar reinicio
        const confirmar = confirm('¿Estás seguro de que quieres empezar la historia desde el principio?');
        if (!confirmar) return;

        // Registrar reinicio
        this.metricas.reiniciarHistoria();

        // Resetear progreso
        this.progreso = {
            seccionesVisitadas: new Set(),
            decisionesTomadas: [],
            tiempoTotal: Date.now() - this.progreso.inicioLectura,
            inicioLectura: Date.now()
        };

        // Volver al inicio
        this.mostrarSeccion('inicio');

        console.log('Historia reiniciada');
    }

    mostrarEstadisticas() {
        const stats = this.obtenerEstadisticas();

        const modal = document.createElement('div');
        modal.className = 'modal-estadisticas';
        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <h3>📊 Tu Progreso de Lectura</h3>
                    <button class="btn-cerrar" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stat-item">
                        <span class="stat-label">Secciones exploradas:</span>
                        <span class="stat-valor">${stats.seccionesVisitadas}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Decisiones tomadas:</span>
                        <span class="stat-valor">${stats.decisionesTomadas}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tiempo leyendo:</span>
                        <span class="stat-valor">${stats.tiempoFormateado}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Finales alcanzados:</span>
                        <span class="stat-valor">${stats.finalesAlcanzados}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-decision" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Estilos inline para el modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        modal.querySelector('.modal-contenido').style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        `;
    }

    obtenerEstadisticas() {
        const tiempoTotal = Date.now() - this.progreso.inicioLectura;
        const minutos = Math.floor(tiempoTotal / 60000);
        const segundos = Math.floor((tiempoTotal % 60000) / 1000);

        // Contar finales alcanzados
        const finalesAlcanzados = Array.from(this.progreso.seccionesVisitadas)
            .filter(seccionId => {
                const seccion = this.estructuraCuento.estructura[seccionId];
                return seccion?.esFinal;
            }).length;

        return {
            seccionesVisitadas: this.progreso.seccionesVisitadas.size,
            decisionesTomadas: this.progreso.decisionesTomadas.length,
            tiempoTotal: tiempoTotal,
            tiempoFormateado: `${minutos}m ${segundos}s`,
            finalesAlcanzados: finalesAlcanzados
        };
    }

    // Navegación por menú
    irASeccion(idSeccion) {
        if (this.estructuraCuento.estructura[idSeccion]) {
            this.mostrarSeccion(idSeccion);
        }
    }

    mostrarMapa() {
        this.mostrarSeccion('mapa_islas');
    }

    mostrarPersonajes() {
        const personajes = this.estructuraCuento.personajes;

        const modal = document.createElement('div');
        modal.className = 'modal-personajes';

        let html = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <h3>👥 Personajes de la Historia</h3>
                    <button class="btn-cerrar" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
        `;

        for (const personaje of Object.values(personajes)) {
            html += `
                <div class="personaje-card">
                    <h4>${personaje.nombre}</h4>
                    <p>${personaje.descripcion}</p>
                    ${personaje.caracteristicas ? `
                        <ul>
                            ${personaje.caracteristicas.map(car => `<li>${car}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        }

        html += `
                </div>
                <div class="modal-footer">
                    <button class="btn-decision" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        modal.innerHTML = html;
        document.body.appendChild(modal);

        // Aplicar estilos
        this.aplicarEstilosModal(modal);
    }

    aplicarEstilosModal(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            overflow-y: auto;
        `;

        modal.querySelector('.modal-contenido').style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        `;
    }

    mostrarError() {
        if (this.contenedorSeccion) {
            this.contenedorSeccion.innerHTML = `
                <div class="error-cuento">
                    <h2>😅 ¡Ups! Hubo un problema</h2>
                    <p>No pudimos cargar la historia de Hipólito. Por favor, recarga la página e intenta de nuevo.</p>
                    <button class="btn-decision" onclick="location.reload()">
                        🔄 Recargar página
                    </button>
                </div>
            `;
        }
    }

    // Métodos de acceso para otros componentes
    obtenerSeccionActual() {
        return this.seccionActual;
    }

    obtenerProgreso() {
        return { ...this.progreso };
    }

    obtenerPersonajes() {
        return this.estructuraCuento ? this.estructuraCuento.personajes : {};
    }

    obtenerLugares() {
        return this.estructuraCuento ? this.estructuraCuento.lugares : {};
    }

    obtenerTemas() {
        return this.estructuraCuento ? this.estructuraCuento.temas : {};
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotorCuento;
}
