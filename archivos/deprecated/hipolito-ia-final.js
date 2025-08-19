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

        // PREGUNTAS SOBRE NOMBRE
        if (this.esPreguntaSobreNombre(preguntaLower)) {
            return "Sara dijo que Hipólito es un nombre adecuado para un perro-dragón de alas blancas con destellos dorados 🐉";
        }

        // QUÉ CLASE DE ANIMAL ES
        if (this.esPreguntaSobreAnimal(preguntaLower)) {
            return "Soy un perro-dragón con alas blancas con destellos dorados y patas grandes para aterrizar 🐉";
        }

        // OTROS PROTAGONISTAS
        if (this.esPreguntaSobreProtagonistas(preguntaLower)) {
            return "Sara y Benjamín son los hermanos protagonistas que me encontraron en su puerta 🐉";
        }

        // ANTAGONISTAS
        if (this.esPreguntaSobreAntagonistas(preguntaLower)) {
            return "Los Iscarotes son los antagonistas, devotos del fuego que destruyeron las Siete Islas 🐉";
        }

        // ISLA MÁS IMPORTANTE COMERCIAL
        if (this.esPreguntaSobreIslaComercial(preguntaLower)) {
            return "La Isla 7 era la más importante a nivel económico de todas las Siete Islas 🐉";
        }

        // HOMBRE MISTERIOSO
        if (this.esPreguntaSobreHombreMisterioso(preguntaLower)) {
            return "El hombre misterioso nos engañó llevándonos a una trampa, pero yo gruñí para alertar del peligro 🐉";
        }

        // QUÉ ISLA TIENE CUEVAS
        if (this.esPreguntaSobreCuevas(preguntaLower)) {
            return "La Isla 7 tiene grandes cuevas donde los perros-dragón podían esconderse 🐉";
        }

        // IDENTIFICACIÓN BÁSICA
        if (preguntaLower.includes('quien eres') || preguntaLower.includes('como te llamas')) {
            return "Soy Hipólito, un perro-dragón hijo de Anaris y nieto de Falkor de las Siete Islas 🐉";
        }

        // FAMILIA Y LINAJE
        if (this.esPreguntaSobreFamilia(preguntaLower)) {
            return "Soy hijo de Anaris y nieto de Falkor, todos somos perros-dragón de las Siete Islas 🐉";
        }

        // OTRAS RESPUESTAS ESPECÍFICAS
        return this.buscarOtrasRespuestas(preguntaLower);
    }

    // Funciones auxiliares para clasificar preguntas
    esPreguntaSobreNombre(pregunta) {
        const palabrasNombre = ['por que se llama', 'porque se llama', 'por que te llamas', 'porque te llamas',
            'de donde viene tu nombre', 'quien te puso el nombre', 'como eligieron tu nombre', 'hipolito nombre'];
        return palabrasNombre.some(palabra => pregunta.includes(palabra));
    }

    esPreguntaSobreAnimal(pregunta) {
        const palabrasAnimal = ['que clase de animal', 'que tipo de animal', 'que animal eres', 'clase de animal',
            'especie eres', 'raza eres', 'tipo de criatura', 'que criatura eres'];
        return palabrasAnimal.some(palabra => pregunta.includes(palabra));
    }

    esPreguntaSobreProtagonistas(pregunta) {
        const palabrasProtag = ['otros dos protagonistas', 'otros protagonistas', 'como se llaman los otros',
            'nombres de los otros', 'cuales son los protagonistas', 'quienes son los protagonistas',
            'personajes principales', 'nombres protagonistas'];
        return palabrasProtag.some(palabra => pregunta.includes(palabra));
    }

    esPreguntaSobreAntagonistas(pregunta) {
        const palabrasAntag = ['antagonistas', 'villanos', 'como se llaman los antagonistas', 'malvados',
            'enemigos', 'malos del cuento', 'iscarotes', 'quien es el antagonista'];
        return palabrasAntag.some(palabra => pregunta.includes(palabra));
    }

    esPreguntaSobreIslaComercial(pregunta) {
        const palabrasIsla = ['isla mas importante', 'isla más importante', 'importante a nivel comercial',
            'comercial en el islote', 'isla economica', 'isla económica', 'cual isla comercial',
            'isla 7', 'isla numero 7', 'isla siete'];
        return palabrasIsla.some(palabra => pregunta.includes(palabra));
    }

    esPreguntaSobreHombreMisterioso(pregunta) {
        return pregunta.includes('hombre misterioso') &&
            (pregunta.includes('engaña') || pregunta.includes('verdad') || pregunta.includes('engañ') ||
                pregunta.includes('miente') || pregunta.includes('confiable') || pregunta.includes('confiar') ||
                pregunta.includes('dice la verdad') || pregunta.includes('malo'));
    }

    esPreguntaSobreCuevas(pregunta) {
        return ((pregunta.includes('isla tiene') && pregunta.includes('cueva')) ||
            (pregunta.includes('que isla') && pregunta.includes('cueva')) ||
            pregunta.includes('cuevas en las islas') || pregunta.includes('donde hay cuevas') ||
            pregunta.includes('isla con cuevas') || pregunta.includes('cuevas grandes'));
    }

    esPreguntaSobreFamilia(pregunta) {
        const palabrasFamilia = ['familia', 'padres', 'anaris', 'falkor', 'papa', 'papá',
            'mama', 'mamá', 'abuelo', 'hijo de quien'];
        return palabrasFamilia.some(palabra => pregunta.includes(palabra));
    }

    buscarOtrasRespuestas(pregunta) {
        // CARACTERÍSTICAS FÍSICAS GENERALES
        if (pregunta.includes('como eres') || pregunta.includes('describete') ||
            pregunta.includes('como son') || pregunta.includes('fisicamente')) {
            return "Tengo alas blancas con destellos dorados, cara de viejito sabio y ganas de niño chiquito 🐉";
        }

        // CÓMO CONOCIÓ A SARA Y BENJAMÍN
        if (pregunta.includes('como conociste') || pregunta.includes('como te encontraron') ||
            pregunta.includes('donde te encontraron') || pregunta.includes('dia lluvioso') ||
            pregunta.includes('bolita blanca')) {
            return "Me encontraron como bolita blanca de plumas y pelos en su puerta un día lluvioso 🐉";
        }

        // SIETE ISLAS - INFORMACIÓN GENERAL
        if (pregunta.includes('siete islas') || pregunta.includes('7 islas') ||
            pregunta.includes('islas donde') || pregunta.includes('tu hogar')) {
            return "Las Siete Islas eran mi hogar hermoso hasta que los Iscarotes las destruyeron para extraer carbón 🐉";
        }

        // MAGIA Y PODERES
        if (pregunta.includes('magia') || pregunta.includes('poderes') ||
            pregunta.includes('poder magico') || pregunta.includes('piedra magica')) {
            return "Mi piedra mágica nos transporta cuando todos la tocamos juntos, y puedo volar muy alto 🐉";
        }

        // OTROS CASOS ESPECÍFICOS
        if (pregunta.includes('cicatriz') || pregunta.includes('tres puntas')) {
            return "Tengo una cicatriz de tres puntas cerca del cuello entre la cabeza y las alas 🐉";
        }

        if (pregunta.includes('que comes') || pregunta.includes('grimorio')) {
            return "Me como todo lo que encuentro, incluyendo el Grimorio de animales fantásticos 🐉";
        }

        if (pregunta.includes('mariposas') || pregunta.includes('azules')) {
            return "Tengo mariposas azules que me dan besitos en la nariz y me acompañan siempre 🐉";
        }

        if (pregunta.includes('hola') || pregunta.includes('como estas')) {
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
