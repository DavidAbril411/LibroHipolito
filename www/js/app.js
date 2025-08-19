/**
 * Aplicación principal "Hipólito, mi perro-dragón"
 * Coordina todos los componentes del sistema educativo
 */

class AplicacionHipolito {
    constructor() {
        this.componentes = {
            nlp: null,
            metricas: null,
            chatbot: null,
            cuento: null
        };

        this.elementosUI = {
            pantallaCargar: null,
            barraProgreso: null,
            btnMenu: null,
            btnChat: null,
            menuLateral: null,
            overlay: null
        };

        this.estadoApp = {
            cargando: true,
            menuAbierto: false,
            chatAbierto: false,
            primeraVez: this.esPrimeraVez()
        };

        this.inicializar();
    }

    async inicializar() {
        try {
            console.log('🐉 Iniciando Hipólito, mi perro-dragón...');

            // Mostrar pantalla de carga
            this.mostrarPantallaCargar();

            // Inicializar componentes
            await this.inicializarComponentes();

            // Configurar interfaz
            this.configurarInterfaz();

            // Configurar eventos
            this.configurarEventos();

            // Ocultar pantalla de carga
            await this.ocultarPantallaCargar();

            // Mostrar tutorial si es primera vez
            if (this.estadoApp.primeraVez) {
                this.mostrarTutorial();
            }

            console.log('✅ Aplicación iniciada correctamente');

        } catch (error) {
            console.error('❌ Error iniciando aplicación:', error);
            this.mostrarErrorInicio();
        }
    }

    mostrarPantallaCargar() {
        this.elementosUI.pantallaCargar = document.getElementById('pantalla-carga');
        this.elementosUI.barraProgreso = document.getElementById('progreso-carga');

        if (this.elementosUI.pantallaCargar) {
            this.elementosUI.pantallaCargar.style.display = 'flex';
        }
    }

    async inicializarComponentes() {
        const pasos = [
            { nombre: 'Métricas', funcion: () => this.inicializarMetricas() },
            { nombre: 'NLP', funcion: () => this.inicializarNLP() },
            { nombre: 'Cuento', funcion: () => this.inicializarCuento() },
            { nombre: 'Chatbot', funcion: () => this.inicializarChatbot() },
            { nombre: 'PWA', funcion: () => this.configurarPWA() }
        ];

        for (let i = 0; i < pasos.length; i++) {
            const paso = pasos[i];

            try {
                console.log(`📦 Cargando ${paso.nombre}...`);
                this.actualizarProgresoCarga((i / pasos.length) * 100);

                await paso.funcion();
                await this.delay(200); // Simular tiempo de carga

            } catch (error) {
                console.error(`Error cargando ${paso.nombre}:`, error);
                throw error;
            }
        }

        this.actualizarProgresoCarga(100);
    }

    async inicializarMetricas() {
        this.componentes.metricas = new SistemaMetricas();
        console.log('📊 Sistema de métricas inicializado');
    }

    async inicializarNLP() {
        this.componentes.nlp = new NLPBasico();
        await this.componentes.nlp.inicializar();
        this.componentes.nlp.datosListos = true;
        console.log('🧠 Motor NLP inicializado');
    }

    async inicializarCuento() {
        this.componentes.cuento = new MotorCuento(this.componentes.metricas);
        await this.componentes.cuento.inicializar();
        this.componentes.cuento.listo = true;

        // Hacer accesible globalmente para eventos inline
        window.motorCuento = this.componentes.cuento;
        console.log('📚 Motor del cuento inicializado');
    }

    async inicializarChatbot() {
        this.componentes.chatbot = new ChatbotEducativo(
            this.componentes.nlp,
            this.componentes.metricas
        );
        await this.componentes.chatbot.inicializar();
        this.componentes.chatbot.listo = true;

        // Hacer accesible globalmente
        window.chatbot = this.componentes.chatbot;
        console.log('🤖 Chatbot educativo inicializado');
    }

    async configurarPWA() {
        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('📱 Service Worker registrado:', registration);

                // Escuchar actualizaciones
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Nueva versión disponible');
                    this.mostrarNotificacionActualizacion();
                });

            } catch (error) {
                console.warn('⚠️ Error registrando Service Worker:', error);
            }
        }

        // Configurar eventos de instalación PWA
        this.configurarInstalacionPWA();
    }

    configurarInterfaz() {
        // Obtener elementos UI
        this.elementosUI.btnMenu = document.getElementById('btn-menu');
        this.elementosUI.btnChat = document.getElementById('btn-chat');
        this.elementosUI.menuLateral = document.getElementById('menu-lateral');
        this.elementosUI.overlay = document.getElementById('overlay');

        // Configurar menú
        this.configurarMenu();

        // Configurar tema automático
        this.configurarTema();

        // Configurar accesibilidad
        this.configurarAccesibilidad();
    }

    configurarEventos() {
        // Eventos del menú
        if (this.elementosUI.btnMenu) {
            this.elementosUI.btnMenu.addEventListener('click', () => this.toggleMenu());
        }

        // Eventos del chat
        if (this.elementosUI.btnChat) {
            this.elementosUI.btnChat.addEventListener('click', () => this.toggleChat());
        }

        // Cerrar menú con overlay
        if (this.elementosUI.overlay) {
            this.elementosUI.overlay.addEventListener('click', () => this.cerrarMenus());
        }

        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.manejarTeclado(e));

        // Eventos de redimensionado
        window.addEventListener('resize', () => this.manejarRedimension());

        // Eventos de conectividad
        window.addEventListener('online', () => this.manejarEstadoConexion(true));
        window.addEventListener('offline', () => this.manejarEstadoConexion(false));

        // Prevenir zoom accidental en móviles
        this.prevenirZoomMovil();
    }

    configurarMenu() {
        const opciones = {
            'menu-inicio': () => this.componentes.cuento.irASeccion('inicio'),
            'menu-mapa': () => this.componentes.cuento.mostrarMapa(),
            'menu-personajes': () => this.componentes.cuento.mostrarPersonajes(),
            'menu-vocabulario': () => this.mostrarVocabulario(),
            'menu-progreso': () => this.componentes.cuento.mostrarEstadisticas(),
            'menu-ayuda': () => this.mostrarAyuda()
        };

        for (const [id, accion] of Object.entries(opciones)) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener('click', (e) => {
                    e.preventDefault();
                    accion();
                    this.cerrarMenu();
                });
            }
        }

        // Botón cerrar menú
        const btnCerrar = document.getElementById('btn-cerrar-menu');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.cerrarMenu());
        }
    }

    configurarTema() {
        // Detectar preferencia de tema
        const prefiereTemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefiereTemaOscuro) {
            document.body.classList.add('tema-oscuro');
        }

        // Escuchar cambios de tema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('tema-oscuro');
            } else {
                document.body.classList.remove('tema-oscuro');
            }
        });
    }

    configurarAccesibilidad() {
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('navegacion-teclado');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('navegacion-teclado');
        });

        // Anunciar cambios importantes
        this.crearAnunciadorAccesibilidad();
    }

    configurarInstalacionPWA() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.mostrarBotonInstalar();
        });

        window.addEventListener('appinstalled', () => {
            console.log('📱 PWA instalada');
            this.componentes.metricas.pwaInstalada();
            deferredPrompt = null;
        });
    }

    // Métodos de interfaz
    toggleMenu() {
        if (this.estadoApp.menuAbierto) {
            this.cerrarMenu();
        } else {
            this.abrirMenu();
        }
    }

    abrirMenu() {
        this.estadoApp.menuAbierto = true;
        this.elementosUI.menuLateral?.classList.add('visible');
        this.elementosUI.overlay?.classList.add('visible');
        this.componentes.metricas.ayudaSolicitada('menu_abierto', this.componentes.cuento.obtenerSeccionActual());
    }

    cerrarMenu() {
        this.estadoApp.menuAbierto = false;
        this.elementosUI.menuLateral?.classList.remove('visible');
        this.elementosUI.overlay?.classList.remove('visible');
    }

    toggleChat() {
        if (this.estadoApp.chatAbierto) {
            this.componentes.chatbot.ocultarChat();
            this.estadoApp.chatAbierto = false;
        } else {
            this.componentes.chatbot.mostrarChat();
            this.estadoApp.chatAbierto = true;
        }
    }

    cerrarMenus() {
        this.cerrarMenu();
        if (this.estadoApp.chatAbierto) {
            this.componentes.chatbot.ocultarChat();
            this.estadoApp.chatAbierto = false;
        }
    }

    // Métodos de contenido
    mostrarVocabulario() {
        const modal = document.createElement('div');
        modal.className = 'modal-vocabulario';
        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <h3>📖 Vocabulario del Cuento</h3>
                    <button class="btn-cerrar" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Aquí puedes consultar las palabras difíciles del cuento. También puedes preguntarle al chatbot sobre cualquier palabra que no entiendas.</p>
                    <div class="vocabulario-categorias">
                        <div class="categoria">
                            <h4>Personajes</h4>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Qué es un perro-dragón?'; chatbot.enviarMensaje()">perro-dragón</span>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Quiénes son los Iscarotes?'; chatbot.enviarMensaje()">Iscarotes</span>
                        </div>
                        <div class="categoria">
                            <h4>Lugares</h4>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Qué es un acantilado?'; chatbot.enviarMensaje()">acantilado</span>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Qué significa inhóspito?'; chatbot.enviarMensaje()">inhóspito</span>
                        </div>
                        <div class="categoria">
                            <h4>Conceptos</h4>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Qué es un grimorio?'; chatbot.enviarMensaje()">grimorio</span>
                            <span class="palabra-vocab" onclick="chatbot.inputChat.value='¿Qué significa extracción?'; chatbot.enviarMensaje()">extracción</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.aplicarEstilosModal(modal);
    }

    mostrarAyuda() {
        const modal = document.createElement('div');
        modal.className = 'modal-ayuda';
        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <h3>❓ Cómo usar la aplicación</h3>
                    <button class="btn-cerrar" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ayuda-seccion">
                        <h4>📚 Leyendo el cuento</h4>
                        <p>Lee cada sección con calma y elige las opciones que más te gusten. Puedes tomar diferentes caminos y llegar a distintos finales.</p>
                    </div>
                    <div class="ayuda-seccion">
                        <h4>🤖 Usando el chatbot</h4>
                        <p>Haz clic en el botón 💬 para abrir el asistente. Puedes preguntarle sobre personajes, lugares o palabras que no entiendas.</p>
                    </div>
                    <div class="ayuda-seccion">
                        <h4>🗺️ Navegando</h4>
                        <p>Usa el menú ☰ para ir a diferentes secciones, ver el mapa, conocer los personajes o revisar tu progreso.</p>
                    </div>
                    <div class="ayuda-seccion">
                        <h4>📊 Tu progreso</h4>
                        <p>La barra en la parte superior muestra cuánto has leído. Puedes ver estadísticas detalladas en el menú.</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.aplicarEstilosModal(modal);
    }

    mostrarTutorial() {
        if (!this.estadoApp.primeraVez) return;

        const tutorial = document.createElement('div');
        tutorial.className = 'tutorial-bienvenida';
        tutorial.innerHTML = `
            <div class="tutorial-contenido">
                <div class="tutorial-paso">
                    <h2>¡Bienvenido a la aventura de Hipólito! 🐉</h2>
                    <p>Esta es una historia interactiva donde <strong>tú decides</strong> qué pasa.</p>
                    <div class="tutorial-imagen">📖</div>
                    <p>Lee cada sección y elige las opciones que más te gusten.</p>
                </div>
                <div class="tutorial-paso">
                    <h3>Tu asistente personal 🤖</h3>
                    <p>Si no entiendes algo, haz clic en el botón 💬 y pregúntame lo que quieras.</p>
                    <div class="tutorial-imagen">💬</div>
                    <p>Puedo explicarte palabras difíciles, hablar de los personajes o ayudarte con la historia.</p>
                </div>
                <div class="tutorial-botones">
                    <button class="btn-decision" onclick="this.parentElement.parentElement.remove(); localStorage.setItem('hipolito_tutorial_visto', 'true');">
                        🚀 ¡Comenzar aventura!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(tutorial);

        tutorial.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        tutorial.querySelector('.tutorial-contenido').style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 16px 64px rgba(0,0,0,0.3);
        `;
    }

    // Métodos de eventos
    manejarTeclado(e) {
        switch (e.key) {
            case 'Escape':
                this.cerrarMenus();
                break;
            case 'F1':
                e.preventDefault();
                this.mostrarAyuda();
                break;
            case '/':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleChat();
                }
                break;
        }
    }

    manejarRedimension() {
        // Ajustar interfaz en dispositivos móviles
        if (window.innerWidth < 768) {
            this.cerrarMenu();
        }

        // Registrar métrica
        this.componentes.metricas.redimensionPantalla(window.innerWidth, window.innerHeight);
    }

    manejarEstadoConexion(online) {
        const mensaje = online ?
            '🌐 Conexión restaurada' :
            '📡 Sin conexión - La app funciona offline';

        this.mostrarNotificacion(mensaje, online ? 'exito' : 'advertencia');

        this.componentes.metricas.cambioConexion(online);
    }

    prevenirZoomMovil() {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Métodos de utilidad
    async ocultarPantallaCargar() {
        if (this.elementosUI.pantallaCargar) {
            this.elementosUI.pantallaCargar.style.opacity = '0';
            await this.delay(500);
            this.elementosUI.pantallaCargar.style.display = 'none';
        }
        this.estadoApp.cargando = false;
    }

    actualizarProgresoCarga(porcentaje) {
        if (this.elementosUI.barraProgreso) {
            this.elementosUI.barraProgreso.style.width = `${porcentaje}%`;
        }
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

        const contenido = modal.querySelector('.modal-contenido');
        if (contenido) {
            contenido.style.cssText = `
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
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;

        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${tipo === 'exito' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#ffc107'};
        `;

        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    mostrarBotonInstalar() {
        const botonInstalar = document.createElement('button');
        botonInstalar.innerHTML = '📱 Instalar App';
        botonInstalar.className = 'btn-instalar-pwa';
        botonInstalar.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: var(--color-primario);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            z-index: 1000;
        `;

        botonInstalar.addEventListener('click', this.instalarPWA.bind(this));
        document.body.appendChild(botonInstalar);
    }

    async instalarPWA() {
        const deferredPrompt = window.deferredPrompt;
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('📱 Usuario aceptó instalación');
        } else {
            console.log('📱 Usuario rechazó instalación');
        }

        window.deferredPrompt = null;
        document.querySelector('.btn-instalar-pwa')?.remove();
    }

    mostrarNotificacionActualizacion() {
        const notif = document.createElement('div');
        notif.innerHTML = `
            <div class="notificacion-actualizacion">
                <p>🔄 Nueva versión disponible</p>
                <button onclick="location.reload()">Actualizar</button>
                <button onclick="this.parentElement.remove()">Después</button>
            </div>
        `;
        document.body.appendChild(notif);
    }

    mostrarErrorInicio() {
        document.body.innerHTML = `
            <div class="error-inicio">
                <h1>😅 ¡Ups! Algo salió mal</h1>
                <p>No pudimos cargar la aplicación completamente.</p>
                <button onclick="location.reload()" class="btn-decision">
                    🔄 Intentar de nuevo
                </button>
            </div>
        `;
    }

    crearAnunciadorAccesibilidad() {
        const anunciador = document.createElement('div');
        anunciador.setAttribute('aria-live', 'polite');
        anunciador.setAttribute('aria-atomic', 'true');
        anunciador.className = 'sr-only';
        anunciador.id = 'anunciador-accesibilidad';
        document.body.appendChild(anunciador);
    }

    anunciar(mensaje) {
        const anunciador = document.getElementById('anunciador-accesibilidad');
        if (anunciador) {
            anunciador.textContent = mensaje;
        }
    }

    esPrimeraVez() {
        return !localStorage.getItem('hipolito_tutorial_visto');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos de acceso para debugging
    obtenerEstado() {
        return {
            componentes: Object.keys(this.componentes).map(k => ({
                nombre: k,
                listo: this.componentes[k]?.listo || this.componentes[k]?.datosListos || !!this.componentes[k]
            })),
            estado: this.estadoApp,
            metricas: this.componentes.metricas?.obtenerResumenSesion()
        };
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.appHipolito = new AplicacionHipolito();
});

// Hacer disponibles clases globalmente para debugging
window.AplicacionHipolito = AplicacionHipolito;
window.NLPBasico = NLPBasico;
window.SistemaMetricas = SistemaMetricas;
window.ChatbotEducativo = ChatbotEducativo;
window.MotorCuento = MotorCuento;
