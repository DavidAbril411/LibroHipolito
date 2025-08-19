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
}

/**
 * Verifica si ya respondió algo muy similar antes
    if (preguntaLower.includes('que mas') || preguntaLower.includes('que más') ||
        preguntaLower.includes('contame mas') || preguntaLower.includes('contame más') ||
        preguntaLower.includes('y que mas') || preguntaLower.includes('y que más') ||
        preguntaLower.includes('que mas me podes') || preguntaLower.includes('algo mas')) {
        // Basarse en el contexto de la conversación previa
        if (this.conversacion.length > 0) {
            const ultimaRespuesta = this.conversacion[this.conversacion.length - 1].hipolito;

            // Si ya habló de personajes, ahora contar aventuras
            if (ultimaRespuesta.includes('personajes') || ultimaRespuesta.includes('Sara') || ultimaRespuesta.includes('Benjamín')) {
                return "Una vez volé muy alto con Sara y Benjamín para mostrarles toda Córdoba desde el cielo 🐉";
            }

            // Si ya habló de aventuras, ahora sobre las Siete Islas
            if (ultimaRespuesta.includes('aventura') || ultimaRespuesta.includes('volé') || ultimaRespuesta.includes('Córdoba')) {
                return "Las Siete Islas eran mi hogar hermoso hasta que los Iscarotes las destruyeron para extraer carbón 🐉";
            }

            // Si ya habló de Siete Islas, ahora sobre magia
            if (ultimaRespuesta.includes('Siete Islas') || ultimaRespuesta.includes('Iscarotes')) {
                return "Puedo volar, transportar a Sara y Benjamín, y mis ojos se vuelven color fuego cuando uso magia 🐉";
            }
        }

        // Respuesta por defecto
        return "También los ayudé a encontrar el Grimorio de animales fantásticos en la biblioteca 🐉";
    }

    // RESPUESTAS AFIRMATIVAS VAGAS - Sistema mejorado para contexto
    if ((preguntaLower === 'si' || preguntaLower === 'sí' || preguntaLower === 'dale' || preguntaLower === 'bueno' ||
        preguntaLower === 'ok' || preguntaLower === 'si por favor' || preguntaLower === 'si contame' ||
        preguntaLower === 'wow' || preguntaLower === 'woow' || preguntaLower === 'genial' || preguntaLower === 'increible') &&
        this.conversacion.length > 0) {

        const ultimaRespuesta = this.conversacion[this.conversacion.length - 1].hipolito;
        console.log('🤔 Respuesta vaga detectada, analizando contexto:', ultimaRespuesta);

        // Si la última respuesta mencionaba opciones específicas, elegir una automáticamente
        if (ultimaRespuesta.includes('Sara, Benjamín o las Siete Islas')) {
            return "Las Siete Islas eran mi hogar hermoso hasta que los Iscarotes las destruyeron para extraer carbón 🐉";
        }

        // Si preguntó sobre personajes, dar más detalles
        if (ultimaRespuesta.includes('personajes del cuento')) {
            return "Sara es muy observadora e inteligente, Benjamín es curioso y valiente, yo tengo alas blancas y cara de viejito sabio 🐉";
        }

        // Si mencionó aventuras, contar una específica
        if (ultimaRespuesta.includes('aventuras') || ultimaRespuesta.includes('volar')) {
            return "Una vez volé muy alto con Sara y Benjamín para mostrarles toda Córdoba desde el cielo 🐉";
        }

        // Si preguntó sobre poderes o magia
        if (ultimaRespuesta.includes('magia') || ultimaRespuesta.includes('poderes')) {
            return "Puedo volar, transportar a Sara y Benjamín, y mis ojos se vuelven color fuego cuando uso magia 🐉";
        }

        // Si preguntó sobre características físicas
        if (ultimaRespuesta.includes('cómo son') || ultimaRespuesta.includes('físicamente')) {
            return "Tengo alas blancas con destellos dorados, patas grandes y cara de viejito sabio pero con ganas de niño 🐉";
        }

        // Respuesta por defecto para afirmaciones vagas
        if (preguntaLower === 'wow' || preguntaLower === 'woow' || preguntaLower === 'genial' || preguntaLower === 'increible') {
            return "¡Te puedo contar sobre mis aventuras volando por Córdoba con Sara y Benjamín! 🐉";
        }

        // Para "si" genérico sin contexto claro
        return "Sara y Benjamín me encontraron como una bolita blanca en su puerta un día lluvioso 🐉";
    }

    return null;
}

/**
 * Verifica si ya dio una respuesta similar recientemente para evitar repeticiones
 */
yaRespondioSimilar(respuestaPropuesta) {
    if (this.conversacion.length === 0) return false;

    // Verificar las últimas 2 respuestas
    const ultimasRespuestas = this.conversacion.slice(-2).map(conv => conv.hipolito);

    return ultimasRespuestas.some(respuesta =>
        respuesta === respuestaPropuesta ||
        this.sonRespuestasSimilares(respuesta, respuestaPropuesta)
    );
}

/**
 * Consulta la IA cuando no hay respuesta fija
 */
async consultarIA(mensaje) {
    try {
        // Construir prompt con contexto e historial
        const prompt = this.construirPrompt(mensaje);

        // Enviar a Ollama con parámetros ultra-específicos
        const respuesta = await fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.modelo,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.001,    // ULTRA determinismo máximo
                    num_predict: 12,       // Respuestas EXTREMADAMENTE cortas
                    top_p: 0.01,           // SUPER enfocado al máximo
                    repeat_penalty: 20.0,  // CASTIGO BRUTAL por repetir
                    stop: ["\n", "Usuario:", "RESPUESTA", "Me alegra", "Como Hipólito", "del Cuarto", "hab", "Hipólitos", "ooooo", "😊", "👀", "💫", "Lo siento", "Y eles"],
                    frequency_penalty: 10.0,   // CASTIGO EXTREMO por palabras repetitivas
                    presence_penalty: 5.0      // Máximo incentivo para nuevas palabras
                }
            })
        });

        if (!respuesta.ok) {
            throw new Error('Error en Ollama');
        }

        const datos = await respuesta.json();
        let respuestaHipolito = datos.response?.trim() || this.respuestaEmergencia();

        // Limpiar la respuesta
        respuestaHipolito = this.limpiarRespuesta(respuestaHipolito);

        // Guardar en historial
        this.conversacion.push({
            usuario: mensaje,
            hipolito: respuestaHipolito,
            hora: new Date().toLocaleTimeString()
        });

        // Mantener solo últimas 3 conversaciones
        if (this.conversacion.length > 3) {
            this.conversacion = this.conversacion.slice(-3);
        }

        console.log('🐉 Hipólito responde:', respuestaHipolito);
        return respuestaHipolito;

    } catch (error) {
        console.error('❌ Error preguntando a Hipólito:', error);
        return this.respuestaEmergencia();
    }
}

/**
 * Construye el prompt con contexto e historial
 */
construirPrompt(mensaje) {
    // Detectar tipo de pregunta para respuesta específica
    const preguntaLower = mensaje.toLowerCase();

    let promptEspecifico = this.contexto + "\n\n";

    // DETECCIÓN ULTRA-ESPECÍFICA DE PREGUNTAS
    if (preguntaLower.includes('personaje') || (preguntaLower.includes('quien') && preguntaLower.includes('son')) || preguntaLower.includes('como se llaman')) {
        promptEspecifico += `PREGUNTA DETECTADA: Personajes del cuento
RESPUESTA EXACTA REQUERIDA: "Los personajes del cuento somos Sara, Benjamín, yo (Hipólito) y los malvados Iscarotes 🐉"`;
    }
    else if (preguntaLower.includes('como') && (preguntaLower.includes('conociste') || preguntaLower.includes('conocieron') || preguntaLower.includes('encontraron'))) {
        promptEspecifico += `PREGUNTA DETECTADA: Cómo conoció a Sara y Benjamín
RESPUESTA EXACTA REQUERIDA: "Sara y Benjamín me encontraron en su puerta cuando era una bolita blanca con alas un día lluvioso 🐉"`;
    }
    else if (preguntaLower.includes('siete') || preguntaLower.includes('siente') || preguntaLower.includes('islas')) {
        promptEspecifico += `PREGUNTA DETECTADA: Sobre las Siete Islas
RESPUESTA EXACTA REQUERIDA: "Las Siete Islas eran mi hogar original, un lugar hermoso hasta que los Iscarotes las destruyeron 🐉"`;
    }
    else if (preguntaLower.includes('aventura') || preguntaLower.includes('contame')) {
        promptEspecifico += `PREGUNTA DETECTADA: Contar una aventura
RESPUESTA EXACTA REQUERIDA: "Una vez volé muy alto con Sara y Benjamín para mostrarles toda la ciudad de Córdoba 🐉"`;
    }
    else if (preguntaLower.includes('hola') || preguntaLower.includes('bien') || preguntaLower.includes('estas')) {
        promptEspecifico += `PREGUNTA DETECTADA: Saludo
RESPUESTA EXACTA REQUERIDA: "¡Hola! Todo muy bien, gracias por preguntar 🐉"`;
    }
    else {
        promptEspecifico += `PREGUNTA GENERAL: "${mensaje}"
INSTRUCCIONES ULTRA-ESTRICTAS: 
- Responde como Hipólito en EXACTAMENTE 1 oración completa
- SIEMPRE usa "Soy Hipólito" (NUNCA "Soy Hipólitos")
- Termina con 🐉
- NO uses frases como "Me alegra", "Lo siento", "Como Hipólitos del Cuarto"
- Si no entiendes, di: "¿Podrías preguntarme algo sobre Sara, Benjamín o nuestras aventuras? 🐉"
- PROHIBIDO: respuestas cortadas, texto malformado, plurales incorrectos`;
    }

    promptEspecifico += `\n\nUsuario pregunta: "${mensaje}"\nHipólito debe responder EXACTAMENTE: `;

    return promptEspecifico;
}

/**
 * Limpia y mejora la respuesta de la IA
 */
limpiarRespuesta(respuesta) {
    // Remover prefijos innecesarios
    respuesta = respuesta.replace(/^(Hipólito:|Hipólito responde:|Respuesta:)\s*/i, '');

    // Remover líneas que empiecen con "Usuario:"
    respuesta = respuesta.replace(/Usuario:.*$/gm, '').trim();

    // DETECTAR Y REEMPLAZAR FRASES PROBLEMÁTICAS ESPECÍFICAS
    const frasesProblematicas = [
        /me alegra verte/gi,
        /me alegra ver que estás/gi,
        /lo siento por la confusión/gi,
        /me sentiste desconectado/gi,
        /soy hipólitos/gi,
        /soy hipólitooooo/gi,
        /hipólitooooo/gi,
        /hipólitos del cuarto/gi,
        /como hipólitos/gi,
        /hab\s*🐉/gi,
        /\(un perro-d\s*🐉/gi,
        /Y eles/gi,
        /pero no me uses/gi,
        /vamos a empezar/gi,
        /y eles\s*🐉/gi,
        /anteriormente hab/gi,
        /no entendí bien tu mensaje inicial/gi,
        /😊|🌟|👀|💫/g
    ];

    for (const frase of frasesProblematicas) {
        if (frase.test(respuesta)) {
            console.warn('🚫 Detectada frase problemática:', respuesta);
            return this.generarRespuestaEspecifica();
        }
    }

    // DETECTAR RESPUESTAS CORTADAS O MALFORMADAS
    if (respuesta.length < 15 ||
        respuesta.includes('hab 🐉') ||
        respuesta.includes('(un perro-d') ||
        respuesta.includes('Hipólitos ') ||
        respuesta.includes('Y eles') ||
        respuesta.includes('pero no me uses') ||
        respuesta.includes('vamos a empezar') ||
        respuesta.includes('anteriormente hab') ||
        respuesta.includes('😊') || respuesta.includes('🌟') ||
        respuesta.includes('👀') || respuesta.includes('💫') ||
        /\b\w{1,3}\s*🐉$/.test(respuesta) ||
        /[^\w\s¡!¿?.,]\s*🐉$/.test(respuesta)) {
        console.warn('🚫 Detectada respuesta malformada:', respuesta);
        return this.generarRespuestaEspecifica();
    }

    // Corregir plurales incorrectos
    respuesta = respuesta.replace(/Soy Hipólitos/gi, 'Soy Hipólito');
    respuesta = respuesta.replace(/Hipólitooooo/gi, 'Hipólito');

    // ANTI-REPETICIÓN: Si la respuesta es muy similar a la anterior, cambiarla
    if (this.conversacion.length > 0) {
        const ultimaRespuesta = this.conversacion[this.conversacion.length - 1].hipolito;
        if (this.sonRespuestasSimilares(respuesta, ultimaRespuesta)) {
            respuesta = this.generarRespuestaAlternativa(respuesta);
        }
    }

    // Asegurar que termine con 🐉 y SOLO ese emoji
    if (!respuesta.includes('🐉')) {
        respuesta = respuesta.replace(/[.!?]*$/, '') + ' 🐉';
    }

    // Remover emojis incorrectos pero mantener 🐉
    respuesta = respuesta.replace(/📤|💬|👤|🎯|🧪|✨|😊|👀|💫|🌟/g, '');

    // Limitar a máximo 2 oraciones
    const oraciones = respuesta.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    if (oraciones.length > 2) {
        respuesta = oraciones.slice(0, 2).join('. ') + ' 🐉';
    }

    return respuesta.trim();
}

/**
 * Detecta si dos respuestas son muy similares
 */
sonRespuestasSimilares(respuesta1, respuesta2) {
    if (!respuesta1 || !respuesta2) return false;

    const palabras1 = respuesta1.toLowerCase().split(/\s+/);
    const palabras2 = respuesta2.toLowerCase().split(/\s+/);

    let palabrasComunes = 0;
    for (const palabra of palabras1) {
        if (palabras2.includes(palabra) && palabra.length > 3) {
            palabrasComunes++;
        }
    }

    // Si más del 60% de las palabras son iguales, son muy similares
    return (palabrasComunes / Math.max(palabras1.length, palabras2.length)) > 0.6;
}

/**
 * Genera una respuesta alternativa cuando detecta repetición
 */
generarRespuestaAlternativa(respuestaOriginal) {
    const alternativas = [
        "¡Pregúntame algo diferente sobre el cuento! 🐉",
        "¿Hay algo más específico que quieras saber sobre Sara, Benjamín o las aventuras? 🐉",
        "¡Cuéntame qué parte del cuento te interesa más! 🐉",
        "¿Te gustaría que te hable de mis poderes mágicos o de Córdoba? 🐉"
    ];

    return alternativas[Math.floor(Math.random() * alternativas.length)];
}

/**
 * Genera una respuesta específica cuando la IA está dando respuestas genéricas
 */
generarRespuestaEspecifica() {
    const respuestasEspecificas = [
        "¿Quieres que te cuente sobre Sara, Benjamín o las Siete Islas? 🐉",
        "¡Pregúntame sobre nuestras aventuras en Córdoba o los Iscarotes! 🐉",
        "Puedo contarte sobre mis poderes mágicos o cómo me encontraron 🐉",
        "¿Te interesa saber más sobre los personajes del cuento? 🐉"
    ];
    return respuestasEspecificas[Math.floor(Math.random() * respuestasEspecificas.length)];
}

/**
 * Respuesta de emergencia cuando algo falla
 */
respuestaEmergencia() {
    const respuestas = [
        "¡Wuf! Mis poderes mágicos están un poco enredados 🐉",
        "¡Ups! Estaba volando muy alto y no te escuché bien 🐉",
        "¡Mi magia está fallando! Pero siempre estoy aquí para ti 🐉",
        "¿Podrías preguntarme algo sobre Sara, Benjamín o nuestras aventuras? 🐉"
    ];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
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
        "Contame una aventura tuya",
        "¿Te gusta volar?"
    ];
}

/**
 * Limpia la conversación
 */
limpiarConversacion() {
    this.conversacion = [];
    console.log('🧹 Conversación limpiada');
}

/**
 * Verifica si Ollama está funcionando
 */
async verificarOllama() {
    try {
        const respuesta = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('🔍 Estado de Ollama:', respuesta.status, respuesta.ok);
        return respuesta.ok;
    } catch (error) {
        console.warn('❌ Ollama no disponible:', error.message);
        return false;
    }
}
}

// Hacer disponible globalmente
window.HipolitoIA = HipolitoIA;
