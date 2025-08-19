/**
 * Motor de IA Simple para Hipólito - Solo Respuestas Específicas
 * Diseñado para dar respuestas precisas y educativas sobre el cuento
 */

class HipolitoIA {
    constructor() {
        this.conversacion = [];
    }

    /**
     * Función principal - SIEMPRE da respuestas específicas y educativas
     */
    async preguntarAHipolito(mensaje) {
        if (!mensaje || mensaje.trim().length === 0) {
            return "¿Qué te gustaría saber sobre mi cuento? 🐉";
        }

        console.log('💬 Usuario pregunta:', mensaje);

        // 1. PRIMERO: Buscar respuesta específica fija
        const respuestaFija = this.buscarRespuestaFija(mensaje);
        if (respuestaFija) {
            console.log('📋 Respuesta específica encontrada:', respuestaFija);

            // Guardar en historial
            this.conversacion.push({
                usuario: mensaje,
                hipolito: respuestaFija,
                hora: new Date().toLocaleTimeString()
            });

            this.mantenerHistorial();
            return respuestaFija;
        }

        // 2. SEGUNDO: Si no hay respuesta específica, dar respuesta educativa contextual
        console.log('🎓 Generando respuesta educativa contextual...');

        const respuestaEducativa = this.generarRespuestaEducativa(mensaje);

        // Guardar en historial
        this.conversacion.push({
            usuario: mensaje,
            hipolito: respuestaEducativa,
            hora: new Date().toLocaleTimeString()
        });

        this.mantenerHistorial();
        return respuestaEducativa;
    }

    /**
     * Busca respuestas específicas para preguntas del cuento
     */
    buscarRespuestaFija(mensaje) {
        const preguntaLower = mensaje.toLowerCase().replace(/[¿?¡!]/g, '').replace(/\s+/g, ' ').trim();

        // PREGUNTAS SOBRE NOMBRE - MÚLTIPLES VARIANTES
        if (preguntaLower.includes('por que se llama') || preguntaLower.includes('porque se llama') ||
            preguntaLower.includes('por que te llamas') || preguntaLower.includes('porque te llamas') ||
            preguntaLower.includes('de donde viene tu nombre') || preguntaLower.includes('quien te puso el nombre') ||
            preguntaLower.includes('como eligieron tu nombre') || preguntaLower.includes('hipolito nombre')) {
            return "Sara dijo que Hipólito es un nombre adecuado para un perro-dragón de alas blancas con destellos dorados 🐉";
        }

        // QUÉ CLASE DE ANIMAL ES
        if (preguntaLower.includes('que clase de animal') || preguntaLower.includes('que tipo de animal') ||
            preguntaLower.includes('que animal eres') || preguntaLower.includes('clase de animal') ||
            preguntaLower.includes('especie eres') || preguntaLower.includes('raza eres') ||
            preguntaLower.includes('tipo de criatura') || preguntaLower.includes('que criatura eres')) {
            return "Soy un perro-dragón con alas blancas con destellos dorados y patas grandes para aterrizar 🐉";
        }

        // OTROS PROTAGONISTAS
        if (preguntaLower.includes('otros dos protagonistas') || preguntaLower.includes('otros protagonistas') ||
            preguntaLower.includes('como se llaman los otros') || preguntaLower.includes('nombres de los otros') ||
            preguntaLower.includes('cuales son los protagonistas') || preguntaLower.includes('quienes son los protagonistas') ||
            preguntaLower.includes('personajes principales') || preguntaLower.includes('nombres protagonistas')) {
            return "Sara y Benjamín son los hermanos protagonistas que me encontraron en su puerta 🐉";
        }

        // ANTAGONISTAS
        if (preguntaLower.includes('antagonistas') || preguntaLower.includes('villanos') ||
            preguntaLower.includes('como se llaman los antagonistas') || preguntaLower.includes('malvados') ||
            preguntaLower.includes('enemigos') || preguntaLower.includes('malos del cuento') ||
            preguntaLower.includes('iscarotes') || preguntaLower.includes('quien es el antagonista')) {
            return "Los Iscarotes son los antagonistas, devotos del fuego que destruyeron las Siete Islas 🐉";
        }

        // ISLA MÁS IMPORTANTE COMERCIAL
        if (preguntaLower.includes('isla mas importante') || preguntaLower.includes('isla más importante') ||
            preguntaLower.includes('importante a nivel comercial') || preguntaLower.includes('comercial en el islote') ||
            preguntaLower.includes('isla economica') || preguntaLower.includes('isla económica') ||
            preguntaLower.includes('cual isla comercial') || preguntaLower.includes('isla 7') ||
            preguntaLower.includes('isla numero 7') || preguntaLower.includes('isla siete')) {
            return "La Isla 7 era la más importante a nivel económico de todas las Siete Islas 🐉";
        }

        // HOMBRE MISTERIOSO
        if (preguntaLower.includes('hombre misterioso') && (preguntaLower.includes('engaña') || preguntaLower.includes('verdad') ||
            preguntaLower.includes('engañ') || preguntaLower.includes('miente') || preguntaLower.includes('confiable') ||
            preguntaLower.includes('confiar') || preguntaLower.includes('dice la verdad') || preguntaLower.includes('malo'))) {
            return "El hombre misterioso nos engañó llevándonos a una trampa, pero yo gruñí para alertar del peligro 🐉";
        }

        // QUÉ ISLA TIENE CUEVAS
        if ((preguntaLower.includes('isla tiene') && preguntaLower.includes('cueva')) ||
            (preguntaLower.includes('que isla') && preguntaLower.includes('cueva')) ||
            preguntaLower.includes('cuevas en las islas') || preguntaLower.includes('donde hay cuevas') ||
            preguntaLower.includes('isla con cuevas') || preguntaLower.includes('cuevas grandes')) {
            return "La Isla 7 tiene grandes cuevas donde los perros-dragón podían esconderse 🐉";
        }

        // IDENTIFICACIÓN BÁSICA
        if (preguntaLower.includes('quien eres') || preguntaLower.includes('como te llamas')) {
            return "Soy Hipólito, un perro-dragón hijo de Anaris y nieto de Falkor de las Siete Islas 🐉";
        }

        // FAMILIA Y LINAJE
        if (preguntaLower.includes('familia') || preguntaLower.includes('padres') ||
            preguntaLower.includes('anaris') || preguntaLower.includes('falkor') ||
            preguntaLower.includes('papa') || preguntaLower.includes('papá') ||
            preguntaLower.includes('mama') || preguntaLower.includes('mamá') ||
            preguntaLower.includes('abuelo') || preguntaLower.includes('hijo de quien')) {
            return "Soy hijo de Anaris y nieto de Falkor, todos somos perros-dragón de las Siete Islas 🐉";
        }

        // CARACTERÍSTICAS FÍSICAS GENERALES
        if (preguntaLower.includes('como eres') || preguntaLower.includes('describete') ||
            preguntaLower.includes('como son') || preguntaLower.includes('fisicamente')) {
            return "Tengo alas blancas con destellos dorados, cara de viejito sabio y ganas de niño chiquito 🐉";
        }

        // CÓMO CONOCIÓ A SARA Y BENJAMÍN
        if (preguntaLower.includes('como conociste') || preguntaLower.includes('como te encontraron') ||
            preguntaLower.includes('donde te encontraron') || preguntaLower.includes('dia lluvioso') ||
            preguntaLower.includes('bolita blanca')) {
            return "Me encontraron como bolita blanca de plumas y pelos en su puerta un día lluvioso 🐉";
        }

        // SIETE ISLAS - INFORMACIÓN GENERAL
        if (preguntaLower.includes('siete islas') || preguntaLower.includes('7 islas') ||
            preguntaLower.includes('islas donde') || preguntaLower.includes('tu hogar')) {
            return "Las Siete Islas eran mi hogar hermoso hasta que los Iscarotes las destruyeron para extraer carbón 🐉";
        }

        // MAGIA Y PODERES
        if (preguntaLower.includes('magia') || preguntaLower.includes('poderes') ||
            preguntaLower.includes('poder magico') || preguntaLower.includes('piedra magica')) {
            return "Mi piedra mágica nos transporta cuando todos la tocamos juntos, y puedo volar muy alto 🐉";
        }

        // CICATRIZ
        if (preguntaLower.includes('cicatriz') || preguntaLower.includes('marca') ||
            preguntaLower.includes('tres puntas')) {
            return "Tengo una cicatriz de tres puntas cerca del cuello entre la cabeza y las alas 🐉";
        }

        // COMIDA Y HÁBITOS
        if (preguntaLower.includes('que comes') || preguntaLower.includes('qué comes') ||
            preguntaLower.includes('comiste') || preguntaLower.includes('libro') ||
            preguntaLower.includes('grimorio')) {
            return "Me como todo lo que encuentro, incluyendo el Grimorio de animales fantásticos 🐉";
        }

        // MARIPOSAS
        if (preguntaLower.includes('mariposas') || preguntaLower.includes('besitos') ||
            preguntaLower.includes('azules')) {
            return "Tengo mariposas azules que me dan besitos en la nariz y me acompañan siempre 🐉";
        }

        // OJOS
        if (preguntaLower.includes('como son tus ojos') || preguntaLower.includes('color de ojos') ||
            preguntaLower.includes('ojos marrones') || preguntaLower.includes('ojos color fuego')) {
            return "Tengo ojos marrones que se vuelven color fuego con destellitos dorados cuando uso magia 🐉";
        }

        // LADRAR
        if (preguntaLower.includes('ladras') || preguntaLower.includes('como ladras') ||
            preguntaLower.includes('voz') || preguntaLower.includes('sonido')) {
            return "Ladro con voz de ancestros, una voz profunda y ancestral de perro-dragón 🐉";
        }

        // ISLAS ESPECÍFICAS
        if (preguntaLower.includes('isla 4') || preguntaLower.includes('frutas') || preguntaLower.includes('verduras')) {
            return "La Isla 4 tenía las mejores frutas y verduras de todas las Siete Islas 🐉";
        }

        if (preguntaLower.includes('isla 2') || preguntaLower.includes('mas pequeña') || preguntaLower.includes('más pequeña')) {
            return "La Isla 2 era la más pequeña de todas las Siete Islas 🐉";
        }

        if (preguntaLower.includes('isla 6') || preguntaLower.includes('volcan') || preguntaLower.includes('volcánica')) {
            return "La Isla 6 era volcánica y tenía montañas de fuego 🐉";
        }

        // LIBRERÍA
        if (preguntaLower.includes('libreria') || preguntaLower.includes('librería') ||
            preguntaLower.includes('calle del sol') || preguntaLower.includes('artes magicas')) {
            return "El hombre misterioso nos llevó a la librería de artes mágicas en Calle del Sol 456 🐉";
        }

        // SALUDOS BÁSICOS
        if (preguntaLower.includes('hola') || preguntaLower.includes('como estas')) {
            return "¡Hola! ¿Ya leíste mi cuento? ¿Qué te pareció cuando Sara propuso mi nombre? 🐉";
        }

        return null; // No hay respuesta específica
    }

    /**
     * Genera respuestas educativas contextuales
     */
    generarRespuestaEducativa(mensaje) {
        const preguntaLower = mensaje.toLowerCase().replace(/[¿?¡!]/g, '').trim();

        // Respuestas educativas específicas según el contexto
        if (preguntaLower.includes('gracias') || preguntaLower.includes('bien') || preguntaLower.includes('genial')) {
            return "¿Qué parte del cuento te gustó más? ¿La aventura con las mariposas azules? 🐉";
        }
        else if (preguntaLower.includes('si') || preguntaLower.includes('sí') || preguntaLower.includes('ok')) {
            return "¿Crees que Sara y Benjamín tomaron buenas decisiones al adoptarme? 🐉";
        }
        else if (preguntaLower.includes('no se') || preguntaLower.includes('no sé') || preguntaLower.includes('no entiendo')) {
            return "¿Te gustaría que te cuente sobre Sara, Benjamín o las Siete Islas? 🐉";
        }
        else if (preguntaLower.includes('mas') || preguntaLower.includes('más') || preguntaLower.includes('otra')) {
            return "¿Qué opinas del comportamiento de los Iscarotes hacia la naturaleza? 🐉";
        }
        else {
            // Preguntas pedagógicas rotativas
            const preguntasPedagogicas = [
                "¿Qué opinas de la decisión de Sara y Benjamín de adoptarme? 🐉",
                "¿Crees que los Iscarotes hicieron bien destruyendo las islas? 🐉",
                "¿Qué hubieras hecho tú si me encontrabas en tu puerta? 🐉",
                "¿Te parece que Sara eligió bien mi nombre? 🐉",
                "¿Qué parte del cuento te gustó más? 🐉",
                "¿Crees que hice bien gruñendo al hombre misterioso? 🐉"
            ];

            const indice = this.conversacion.length % preguntasPedagogicas.length;
            return preguntasPedagogicas[indice];
        }
    }

    /**
     * Mantiene solo las últimas 3 conversaciones
     */
    mantenerHistorial() {
        if (this.conversacion.length > 3) {
            this.conversacion = this.conversacion.slice(-3);
        }
    }

    /**
     * Obtiene estadísticas de la conversación
     */
    obtenerEstadisticas() {
        return {
            totalConversaciones: this.conversacion.length,
            ultimaConversacion: this.conversacion.length > 0 ? this.conversacion[this.conversacion.length - 1].hora : 'Nunca'
        };
    }

    /**
     * Limpia el historial de conversación
     */
    limpiarHistorial() {
        this.conversacion = [];
        console.log('🧹 Historial de conversación limpiado');
    }

    /**
     * Sugerencias de preguntas para los niños
     */
    obtenerSugerencias() {
        return [
            "¡Hola Hipólito! ¿Cómo estás?",
            "¿Cómo conociste a Sara y Benjamín?",
            "¿Cuáles son los personajes del cuento?",
            "¿Cómo eran las Siete Islas?",
            "¿Quiénes son los Iscarotes?",
            "¿Qué magia puedes hacer?",
            "¿Por qué te llamas Hipólito?",
            "¿Qué clase de animal eres?"
        ];
    }
}

// Crear instancia global
window.HipolitoIA = HipolitoIA;
let hipolitoIA = new HipolitoIA();
