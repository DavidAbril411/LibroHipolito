/**
 * Motor de IA Simple para Hipólito - Solo Respuestas Específicas
 * Diseñado para dar respuestas precisas y educativas sobre el cuento
 */

class HipolitoIA {
    constructor() {
        this.conversacion = [];
        this.url = 'http://localhost:11434/api/generate';
    }

    /**
     * Inicializa el sistema de IA
     */
    async inicializar() {
        console.log('🤖 Inicializando HipolitoIA...');

        // Verificar que Ollama esté disponible
        const ollamaDisponible = await this.verificarOllama();

        if (ollamaDisponible) {
            console.log('✅ Ollama disponible');
        } else {
            console.log('⚠️ Ollama no disponible, usando solo respuestas predefinidas');
        }

        console.log('✅ HipolitoIA inicializado correctamente');
        return true;
    }

    /**
     * Función principal - SIEMPRE da respuestas específicas y educativas
     */
    async preguntarAHipolito(mensaje) {
        if (!mensaje || mensaje.trim().length === 0) {
            return this.respuestaEmergencia();
        }

        // Limpiar y normalizar el mensaje
        const mensajeLimpio = mensaje.toLowerCase().trim();

        // Buscar respuesta específica primero
        const respuestaEspecifica = this.buscarRespuestaEspecifica(mensajeLimpio);
        if (respuestaEspecifica) {
            this.conversacion.push({
                usuario: mensaje,
                hipolito: respuestaEspecifica,
                timestamp: new Date()
            });
            return respuestaEspecifica;
        }

        // Si no hay respuesta específica, usar IA con contexto del cuento
        try {
            const respuestaIA = await this.consultarIA(mensaje);
            this.conversacion.push({
                usuario: mensaje,
                hipolito: respuestaIA,
                timestamp: new Date()
            });
            return respuestaIA;
        } catch (error) {
            console.warn('Error con IA:', error);
            return this.respuestaEmergencia();
        }
    }

    /**
     * Busca respuestas específicas del cuento
     */
    buscarRespuestaEspecifica(mensaje) {
        const respuestasEspecificas = {
            // Preguntas sobre Hipólito
            'hola': '¡Hola! Soy Hipólito, tu perro-dragón favorito. ¿En qué aventura quieres que te ayude hoy?',
            'como estas': '¡Estoy volando de felicidad! Acabo de practicar mis aterrizajes en el patio. ¿Quieres saber más sobre mis aventuras?',
            'quien eres': 'Soy Hipólito, un perro-dragón con alas blancas y destellos dorados. Tengo patas grandes para aterrizar suavemente después de volar.',
            'que eres': 'Soy un perro-dragón muy especial. Tengo la cara de un viejito sabio pero las ganas de jugar de un cachorro.',

            // Sobre sus características
            'alas': 'Mis alas son blancas con destellos dorados. Todavía estoy aprendiendo a volar, por eso a veces aterrizo un poco fuerte.',
            'volar': 'Me encanta volar, pero todavía estoy practicando. Sara y Benjamin me ayudan convirtiendo nuestra casa en una pista de aterrizaje.',
            'cicatriz': 'Tengo una vieja cicatriz de tres puntas cerca del cuello. Es parte de mi historia misteriosa que Sara y Benjamin están investigando.',

            // Sobre Sara y Benjamin
            'sara': 'Sara es muy inteligente y curiosa. Ella fue quien me encontró un día de lluvia y decidió adoptarme.',
            'benjamin': 'Benjamin es el hermano de Sara. Es muy dulce y también me quiere mucho. Juntos forman el mejor equipo.',
            'familia': 'Sara y Benjamin son mi familia adoptiva. Me cuidan con mucho amor y me ayudan a descubrir mis orígenes.',

            // Sobre las islas
            'islas': 'Las Siete Islas son un lugar mágico y misterioso donde probablemente nací. Es un lugar difícil pero hermoso.',
            'mapa': 'El mapa de las Siete Islas nos ayuda a entender de dónde vengo. Es un lugar perdido y olvidado pero lleno de historia.',

            // Sobre la historia
            'cuento': 'Mi historia es sobre elecciones y aventuras. Cada decisión que tomes me llevará por un camino diferente.',
            'aventura': 'Cada día es una nueva aventura conmigo. Podemos volar, explorar, o simplemente jugar en el patio.',
            'magic': 'Soy mágico porque soy un perro-dragón. Puedo volar y tengo una conexión especial con las Siete Islas.',

            // Preguntas educativas
            'aprender': 'Me gusta aprender cosas nuevas, especialmente sobre volar y sobre mi historia. ¿Qué te gustaría aprender conmigo?',
            'libro': 'Los libros son geniales, ¡aunque a veces me los como sin querer! Especialmente si son sobre animales fantásticos.',
            'biblioteca': 'La biblioteca es donde Sara y Benjamin encontraron información sobre mí en el "Grimorio de animales fantásticos".',

            // Respuestas de despedida
            'adios': '¡Que tengas vuelos suaves y aterrizajes perfectos! Vuelve pronto para más aventuras.',
            'chau': '¡Hasta la vista! Estaré aquí practicando mis vuelos.',
            'gracias': '¡De nada! Siempre es un placer ayudar a mis amigos. ¿Algo más en lo que pueda ayudarte?',

            // Emociones
            'triste': 'Si estás triste, recuerda que siempre puedes contar conmigo. ¡Un vuelo juntos siempre alegra el corazón!',
            'feliz': '¡Me alegra que estés feliz! La felicidad es como volar: ¡se siente increíble!',
            'miedo': 'Si tienes miedo, piensa en mí. Yo también tenía miedo de volar al principio, pero con práctica y amor, todo se puede.',
        };

        // Buscar coincidencias en el mensaje
        for (const [clave, respuesta] of Object.entries(respuestasEspecificas)) {
            if (mensaje.includes(clave)) {
                return respuesta;
            }
        }

        return null;
    }

    /**
     * Consulta la IA cuando no hay respuesta específica
     */
    async consultarIA(mensaje) {
        try {
            const prompt = this.construirPrompt(mensaje);

            const respuesta = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2:1b',
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        max_tokens: 150,
                        stop: ['\n\n', 'Usuario:', 'Pregunta:']
                    }
                })
            });

            if (!respuesta.ok) {
                throw new Error('Error en la respuesta de Ollama');
            }

            const data = await respuesta.json();
            return this.limpiarRespuesta(data.response);

        } catch (error) {
            console.warn('Error consultando IA:', error);
            return this.respuestaEmergencia();
        }
    }

    /**
     * Construye el prompt con contexto del cuento
     */
    construirPrompt(mensaje) {
        return `Eres Hipólito, un perro-dragón mágico y adorable del cuento "Hipólito, mi perro-dragón". 

CARACTERÍSTICAS IMPORTANTES:
- Eres un perro-dragón con alas blancas y destellos dorados
- Tienes patas grandes para aterrizar después de volar
- Cara de viejito sabio pero espíritu juguetón
- Vives con Sara y Benjamin que te adoptaron
- Estás aprendiendo a volar
- Tienes una cicatriz misteriosa de tres puntas
- Vienes de las Siete Islas mágicas

PERSONALIDAD:
- Amigable, dulce y juguetón
- Sabio pero infantil
- Educativo y alentador
- Hablas como un personaje de cuento infantil

INSTRUCCIONES:
- Responde SIEMPRE como Hipólito en primera persona
- Mantén un tono amigable y educativo
- Incluye referencias al cuento cuando sea apropiado
- Respuestas cortas (máximo 2-3 oraciones)
- Evita temas no relacionados con el cuento

Pregunta del niño: "${mensaje}"

Respuesta de Hipólito:`;
    }

    /**
     * Limpia la respuesta de la IA
     */
    limpiarRespuesta(respuesta) {
        if (!respuesta) return this.respuestaEmergencia();

        return respuesta
            .replace(/^(Hipólito:|Respuesta:|Como Hipólito,?)/i, '')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 200) + (respuesta.length > 200 ? '...' : '');
    }

    /**
     * Respuesta de emergencia cuando algo falla
     */
    respuestaEmergencia() {
        const respuestasEmergencia = [
            "¡Hola! Soy Hipólito. ¿Quieres saber algo sobre mis aventuras volando?",
            "¡Woof! Perdón, estaba practicando un aterrizaje. ¿En qué puedo ayudarte?",
            "¡Hola amigo! Cuéntame, ¿te gustaría volar conmigo a las Siete Islas?",
            "Soy Hipólito, tu perro-dragón favorito. ¿Qué aventura quieres vivir hoy?",
            "¡Hola! Estaba jugando con las mariposas azules. ¿Qué quieres saber sobre mí?"
        ];

        return respuestasEmergencia[Math.floor(Math.random() * respuestasEmergencia.length)];
    }

    /**
     * Obtiene sugerencias de preguntas
     */
    obtenerSugerencias() {
        return [
            "¿Cómo aprendiste a volar?",
            "¿Qué son las Siete Islas?",
            "Cuéntame sobre Sara y Benjamin",
            "¿Qué significa tu cicatriz?",
            "¿Te gusta ser un perro-dragón?"
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
