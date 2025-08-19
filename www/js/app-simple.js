/**
 * Aplicación Simple "Hipólito, mi perro-dragón"
 * Versión reescrita para ser súper simple de usar
 * Con IA local integrada (Ollama + llama3.2:1b)
 */

class AplicacionHipolitoSimple {
    constructor() {
        this.componentes = {
            chat: null,
            cuento: null,
            metricas: null
        };

        this.estado = {
            cargando: true,
            chatAbierto: false,
            menuAbierto: false,
            primeraVez: !localStorage.getItem('hipolito_visto')
        };

        this.inicializar();
    }

    /**
     * Inicializa toda la aplicación
     */
    async inicializar() {
        try {
            console.log('🐉 Iniciando Hipólito (Versión Simple)...');

            // Mostrar pantalla de carga
            this.mostrarCarga();

            // Inicializar componentes paso a paso
            await this.inicializarComponentes();

            // Configurar interfaz
            this.configurarInterfaz();

            // Ocultar pantalla de carga
            await this.ocultarCarga();

            // Mostrar tutorial si es primera vez
            if (this.estado.primeraVez) {
                this.mostrarTutorial();
            }

            console.log('✅ Aplicación lista para usar');

        } catch (error) {
            console.error('❌ Error iniciando aplicación:', error);
            this.mostrarError(error.message);
        }
    }

    /**
     * Inicializa los componentes principales
     */
    async inicializarComponentes() {
        console.log('📦 Cargando componentes...');

        // 1. Métricas (básico)
        this.actualizarCarga(20, 'Iniciando sistema...');
        this.componentes.metricas = new SistemaMetricas();

        // 2. Cuento
        this.actualizarCarga(40, 'Cargando cuento...');
        this.componentes.cuento = new MotorCuento(this.componentes.metricas);
        await this.componentes.cuento.inicializar();

        // 3. Chat con IA
        this.actualizarCarga(60, 'Conectando con Hipólito...');
        await this.inicializarChatIA();

        this.actualizarCarga(100, '¡Todo listo!');
        await this.esperar(500);
    }

    /**
     * Inicializa el chat con IA de forma inteligente
     */
    async inicializarChatIA() {
        try {
            // Crear el chat
            this.componentes.chat = new ChatHipolito();

            // Intentar inicializar con IA
            await this.componentes.chat.inicializar();

            console.log('✅ Chat con IA inicializado');

        } catch (error) {
            console.warn('⚠️ IA no disponible, usando fallback:', error.message);

            // Fallback: mostrar mensaje explicativo
            this.mostrarMensajeIA(
                '🤖 Hipólito necesita que Ollama esté ejecutándose para conversar contigo.\n\n' +
                'Por ahora puedes leer el cuento y usar el menú para navegar. ' +
                'Cuando tengas Ollama listo, recarga la página para hablar con Hipólito.'
            );
        }
    }

    /**
     * Configura la interfaz y eventos
     */
    configurarInterfaz() {
        console.log('🎨 Configurando interfaz...');

        // Botones principales
        this.configurarBotonMenu();
        this.configurarBotonChat();
        this.configurarMenu();

        // Eventos globales
        this.configurarEventosGlobales();

        // Hacer global para integración con cuento
        window.chatHipolito = this.componentes.chat;
        window.motorCuento = this.componentes.cuento;
    }

    /**
     * Configura el botón del menú
     */
    configurarBotonMenu() {
        const btnMenu = document.getElementById('btn-menu');
        if (btnMenu) {
            btnMenu.addEventListener('click', () => this.toggleMenu());
        }
    }

    /**
     * Configura el botón del chat
     */
    configurarBotonChat() {
        const btnChat = document.getElementById('btn-chat');
        if (btnChat) {
            btnChat.addEventListener('click', () => this.toggleChat());
        }

        // Botones de control del chat
        const btnCerrarChat = document.getElementById('btn-cerrar-chat');
        if (btnCerrarChat) {
            btnCerrarChat.addEventListener('click', () => this.cerrarChat());
        }

        const btnMinimizarChat = document.getElementById('btn-minimizar-chat');
        if (btnMinimizarChat) {
            btnMinimizarChat.addEventListener('click', () => this.minimizarChat());
        }
    }

    /**
     * Configura las opciones del menú
     */
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

        // Overlay para cerrar menú
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.cerrarMenus());
        }

        // Botón cerrar menú
        const btnCerrarMenu = document.getElementById('btn-cerrar-menu');
        if (btnCerrarMenu) {
            btnCerrarMenu.addEventListener('click', () => this.cerrarMenu());
        }
    }

    /**
     * Configura eventos globales
     */
    configurarEventosGlobales() {
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarMenus();
            }
        });

        // Redimensión
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                this.cerrarMenu();
            }
        });
    }

    /**
     * Toggle del menú
     */
    toggleMenu() {
        if (this.estado.menuAbierto) {
            this.cerrarMenu();
        } else {
            this.abrirMenu();
        }
    }

    abrirMenu() {
        const menu = document.getElementById('menu-lateral');
        const overlay = document.getElementById('overlay');

        if (menu) menu.classList.add('abierto');
        if (overlay) overlay.classList.add('visible');

        this.estado.menuAbierto = true;
    }

    cerrarMenu() {
        const menu = document.getElementById('menu-lateral');
        const overlay = document.getElementById('overlay');

        if (menu) menu.classList.remove('abierto');
        if (overlay) overlay.classList.remove('visible');

        this.estado.menuAbierto = false;
    }

    /**
     * Toggle del chat
     */
    toggleChat() {
        if (this.estado.chatAbierto) {
            this.cerrarChat();
        } else {
            this.abrirChat();
        }
    }

    abrirChat() {
        const chatContainer = document.getElementById('chatbot-container');
        if (chatContainer) {
            chatContainer.classList.add('visible');
            this.estado.chatAbierto = true;

            // Focus en input si existe
            const inputChat = document.getElementById('input-chat');
            if (inputChat) {
                setTimeout(() => inputChat.focus(), 100);
            }
        }
    }

    cerrarChat() {
        const chatContainer = document.getElementById('chatbot-container');
        if (chatContainer) {
            chatContainer.classList.remove('visible');
            this.estado.chatAbierto = false;
        }
    }

    minimizarChat() {
        const chatContainer = document.getElementById('chatbot-container');
        if (chatContainer) {
            chatContainer.classList.add('minimizado');
        }
    }

    /**
     * Cierra todos los menús abiertos
     */
    cerrarMenus() {
        this.cerrarMenu();
        this.cerrarChat();
    }

    /**
     * Muestra vocabulario
     */
    mostrarVocabulario() {
        this.mostrarModal('📖 Vocabulario', `
            <p>Aquí tienes algunas palabras importantes del cuento:</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                <div>
                    <h4>🐉 Personajes</h4>
                    <p><strong>Hipólito:</strong> Perro-dragón mágico</p>
                    <p><strong>Sara:</strong> Niña inteligente</p>
                    <p><strong>Benjamín:</strong> Hermano de Sara</p>
                    <p><strong>Iscarotes:</strong> Los malvados</p>
                </div>
                <div>
                    <h4>🏝️ Lugares</h4>
                    <p><strong>Córdoba:</strong> Ciudad argentina</p>
                    <p><strong>Siete Islas:</strong> Hogar de Hipólito</p>
                </div>
            </div>
            <p style="margin-top: 20px; color: #666;">
                💡 También puedes preguntarle a Hipólito sobre cualquier palabra que no entiendas.
            </p>
        `);
    }

    /**
     * Muestra ayuda
     */
    mostrarAyuda() {
        this.mostrarModal('❓ Cómo usar la aplicación', `
            <div style="display: grid; gap: 20px;">
                <div>
                    <h4>📚 Leyendo el cuento</h4>
                    <p>Lee cada sección y elige las opciones que más te gusten. Puedes explorar diferentes caminos.</p>
                </div>
                <div>
                    <h4>🐉 Hablando con Hipólito</h4>
                    <p>Haz clic en el botón 💬 para abrir el chat. Hipólito puede explicarte palabras, personajes o lugares.</p>
                </div>
                <div>
                    <h4>🗺️ Navegando</h4>
                    <p>Usa el menú ☰ para ir a diferentes secciones, ver el mapa o revisar tu progreso.</p>
                </div>
            </div>
        `);
    }

    /**
     * Muestra tutorial de primera vez
     */
    mostrarTutorial() {
        this.mostrarModal('¡Bienvenido a la aventura de Hipólito! 🐉', `
            <div style="text-align: center;">
                <div style="font-size: 3em; margin: 20px 0;">🐉✨</div>
                <p style="font-size: 1.2em; margin-bottom: 20px;">
                    Esta es una historia interactiva donde <strong>tú decides</strong> qué pasa.
                </p>
                <p>Lee cada sección, elige las opciones que más te gusten, y habla con Hipólito cuando tengas dudas.</p>
                <button onclick="this.closest('.modal-overlay').remove(); localStorage.setItem('hipolito_visto', 'true');" 
                        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1em; margin-top: 20px; cursor: pointer;">
                    🚀 ¡Comenzar aventura!
                </button>
            </div>
        `);
    }

    /**
     * Utilidad para mostrar modales
     */
    mostrarModal(titulo, contenido) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 30px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">${titulo}</h3>
                    <button onclick="this.closest('.modal-overlay').remove()" 
                            style="background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 5px;">✕</button>
                </div>
                <div>${contenido}</div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar con click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Muestra un mensaje específico sobre la IA
     */
    mostrarMensajeIA(mensaje) {
        const chatMensajes = document.getElementById('chat-mensajes');
        if (chatMensajes) {
            chatMensajes.innerHTML = `
                <div class="mensaje bot">
                    <div class="mensaje-contenido">
                        ${mensaje.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }
    }

    /**
     * Pantalla de carga
     */
    mostrarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        if (pantallaCarga) {
            pantallaCarga.style.display = 'flex';
        }
    }

    async ocultarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        if (pantallaCarga) {
            await this.esperar(500);
            pantallaCarga.style.opacity = '0';
            await this.esperar(300);
            pantallaCarga.style.display = 'none';
        }
    }

    actualizarCarga(porcentaje, texto = '') {
        const progreso = document.getElementById('progreso-carga');
        const textoElement = document.querySelector('#pantalla-carga h2');

        if (progreso) {
            progreso.style.width = `${porcentaje}%`;
        }

        if (textoElement && texto) {
            textoElement.textContent = texto;
        }
    }

    /**
     * Muestra un error general
     */
    mostrarError(mensaje) {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
                <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; max-width: 500px;">
                    <div style="font-size: 3em; margin-bottom: 20px;">😅</div>
                    <h1>¡Ups! Algo salió mal</h1>
                    <p style="margin: 20px 0;">${mensaje}</p>
                    <button onclick="location.reload()" 
                            style="background: white; color: #333; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1em; cursor: pointer;">
                        🔄 Intentar de nuevo
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Utilidad para esperar
     */
    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Método de acceso para debugging
     */
    obtenerEstado() {
        return {
            estado: this.estado,
            componentes: Object.keys(this.componentes).map(k => ({
                nombre: k,
                disponible: !!this.componentes[k]
            }))
        };
    }
}

// Hacer disponible globalmente
window.AplicacionHipolitoSimple = AplicacionHipolitoSimple;
