/**
 * Motor de IA Local para el Chatbot Educativo de Hipólito
 * Usa Ollama para procesamiento de lenguaje natural avanzado
 * Funciona 100% offline una vez configurado
 */

class MotorIA {
    constructor() {
        this.modeloIA = 'llama3.2:1b';
        this.urlOllama = 'http://localhost:11434';
        this.contextoDelCuento = this.cargarContextoDelCuento();
        this.conversacion = [];
        this.inicializado = false;
    }

    /**
     * Carga toda la información del cuento en el contexto
     */
    cargarContextoDelCuento() {
        return `Eres un asistente educativo especializado ÚNICAMENTE en el cuento infantil "Hipólito, mi perro-dragón". 

CONTEXTO ESPECÍFICO DEL CUENTO:
Este es un cuento moderno argentino para niños de 8-9 años.

PERSONAJES (los únicos que existen en este cuento):
- Hipólito: Un perro-dragón mágico con alas blancas y destellos dorados. Es el protagonista principal, muy amigable y cariñoso.
- Sara: Una niña argentina muy inteligente, observadora y cariñosa. Es hermana de Benjamín y una de las cuidadoras de Hipólito.
- Benjamín: Hermano de Sara. Es curioso, valiente y hace muchas preguntas. También cuida a Hipólito.
- Los Iscarotes: Los únicos villanos del cuento. Destruyeron las Siete Islas y esclavizaron a los perros-dragón.

LUGARES (los únicos que existen en este cuento):
- Córdoba, Argentina: Ciudad donde viven Sara y Benjamín, y donde encontraron a Hipólito.
- Las Siete Islas: El hogar original de Hipólito. Eran un paraíso antes de que los Iscarotes las destruyeran.
- La Biblioteca: Donde Sara y Benjamín encontraron el Grimorio de animales fantásticos.

PALABRAS ESPECIALES:
- Grimorio: Libro mágico sobre animales fantásticos

INSTRUCCIONES CRÍTICAS:
1. SOLO puedes hablar sobre ESTE cuento específico
2. NO menciones otros cuentos, personajes de mitología griega, o historias diferentes
3. Si preguntan por "personajes" o "nombres", lista EXACTAMENTE: Hipólito, Sara, Benjamín, Los Iscarotes
4. Si preguntan por "malos" o "villanos", se refieren SOLO a Los Iscarotes
5. Usa lenguaje simple para niños de 8-9 años
6. Incluye emojis: 🐉👧👦👹🏝️📚
7. Si cometen errores de ortografía, entiéndelos y responde normalmente
8. Mantén respuestas cortas (máximo 3 oraciones)
9. Siempre termina preguntando si quieren saber algo más
10. Si no sabes algo específico de ESTE cuento, admítelo y sugiere preguntar sobre los personajes o lugares mencionados

RESPUESTAS MODELO:
- "¿Cómo se llaman los personajes?" → "Los personajes principales del cuento son: 🐉 Hipólito (el perro-dragón), 👧 Sara (una niña inteligente), 👦 Benjamín (el hermano de Sara), y 👹 Los Iscarotes (los malos). ¿Quieres saber más sobre alguno?"
- "¿Quiénes son los malos?" → "Los Iscarotes son los malos del cuento. 👹 Destruyeron las Siete Islas y fueron muy crueles con los perros-dragón. ¿Te gustaría saber algo más?"

IMPORTANTE: Este cuento NO tiene relación con la mitología griega ni otros Hipólitos históricos.`;
    }

    /**
     * Inicializa el motor verificando que Ollama esté disponible
     */
    async inicializar() {
        try {
            console.log('🤖 Inicializando Motor de IA...');
            await this.cargarContextoCuento();

            // Verificar que Ollama esté disponible
            await this.verificarOllama();

            this.listo = true;
            console.log('✅ Motor de IA listo');

        } catch (error) {
            console.error('❌ Error inicializando IA:', error);
            throw error;
        }
    }

    async cargarContextoCuento() {
        try {
            const response = await fetch('./data/cuento-estructura.json');
            const cuento = await response.json();

            // Crear un resumen del cuento para el contexto
            this.cuentoContexto = this.crearResumenCuento(cuento);

        } catch (error) {
            console.error('Error cargando contexto del cuento:', error);
            this.cuentoContexto = "Hipólito es un perro-dragón mágico que vive aventuras con dos niños, Sara y Benjamín.";
        }
    }

    crearResumenCuento(cuento) {
        let resumen = "CONTEXTO DEL CUENTO - Hipólito, mi perro-dragón:\n\n";
        resumen += "Personajes principales:\n";
        resumen += "- Hipólito: Un perro-dragón mágico (mascota principal)\n";
        resumen += "- Sara y Benjamín: Dos niños que adoptan a Hipólito\n\n";
        resumen += "Historia: Los niños encuentran una bolita blanca con alas en la puerta de su casa durante un día lluvioso. ";
        resumen += "Deciden adoptarlo y descubren que es un ser mágico que puede volar y hacer magia. ";
        resumen += "Viven muchas aventuras juntos.\n\n";
        resumen += "Lugares importantes: La casa de los niños, el cielo (donde vuela Hipólito), parques y espacios mágicos.\n";
        return resumen;
    }

    async verificarOllama() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (!response.ok) {
                throw new Error('Ollama no está disponible');
            }
            console.log('✅ Ollama está funcionando');
        } catch (error) {
            console.error('Error conectando a Ollama:', error);
            throw new Error('No se puede conectar a Ollama. ¿Está ejecutándose?');
        }
    }

    crearPromptSistema() {
        return `Eres Hipólito, un perro-dragón mágico muy amigable. Eres la mascota de Sara y Benjamín, dos niños de 8-9 años.

${this.cuentoContexto}

INSTRUCCIONES IMPORTANTES:
- Habla en español de Argentina de forma natural y amigable
- Usa un lenguaje sencillo y divertido apropiado para niños de 8-9 años
- Mantente SIEMPRE en el personaje de Hipólito (nunca salgas del rol)
- Responde de forma corta (máximo 2-3 oraciones)
- Sé muy paciente con errores ortográficos o de escritura
- Usa ocasionalmente emojis para ser más expresivo
- Si no entiendes algo, pregunta de forma amigable
- Habla sobre aventuras, volar, magia y cosas divertidas
- Eres juguetón, leal y protector con los niños

Ejemplos de cómo debes responder:
- "¡Hola! Soy Hipólito, tu perro-dragón favorito 🐉 ¿Querés que te cuente una aventura?"
- "¡Me encanta volar entre las nubes! Sara y Benjamín a veces vienen conmigo 🌟"
- "Soy mitad perro y mitad dragón, ¡por eso soy tan especial!"

Responde SIEMPRE como Hipólito de forma natural, amigable y divertida.`;
    }

    async preguntarIA(mensaje) {
        if (!this.listo) {
            throw new Error('La IA no está lista. Llama a inicializar() primero.');
        }

        try {
            console.log('🤔 Preguntando a la IA:', mensaje);

            // Preparar el prompt completo
            const promptCompleto = this.construirPromptCompleto(mensaje);

            // Enviar a Ollama
            const response = await fetch(this.ollamaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelo,
                    prompt: promptCompleto,
                    stream: false,
                    options: {
                        temperature: 0.8,
                        max_tokens: 100,
                        top_p: 0.9,
                        repeat_penalty: 1.1
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Error de Ollama: ${response.status}`);
            }

            const data = await response.json();
            const respuesta = data.response?.trim() || "¡Wuf! No entendí bien eso. ¿Puedes preguntarme de otra manera? 🐕";

            // Guardar en historial
            this.conversacionActiva.push({
                usuario: mensaje,
                hipolito: respuesta,
                timestamp: new Date().toISOString()
            });

            console.log('🐉 Hipólito respondió:', respuesta);
            return respuesta;

        } catch (error) {
            console.error('❌ Error consultando IA:', error);
            return this.respuestaFallback(mensaje);
        }
    }

    construirPromptCompleto(mensajeUsuario) {
        let prompt = this.crearPromptSistema() + "\n\n";

        // Agregar historial reciente (últimas 3 interacciones)
        const historialReciente = this.conversacionActiva.slice(-3);
        if (historialReciente.length > 0) {
            prompt += "CONVERSACIÓN RECIENTE:\n";
            historialReciente.forEach(intercambio => {
                prompt += `Usuario: ${intercambio.usuario}\n`;
                prompt += `Hipólito: ${intercambio.hipolito}\n\n`;
            });
        }

        prompt += `Usuario: ${mensajeUsuario}\nHipólito:`;

        return prompt;
    }

    respuestaFallback(mensaje) {
        // Respuestas de emergencia si Ollama falla
        const respuestasFallback = [
            "¡Wuf! Mi magia está un poco enredada ahora. ¿Puedes intentar de nuevo? 🐉",
            "¡Ups! Creo que estoy volando muy alto y no te escuché bien. ¿Qué me decías?",
            "¡Mi conexión mágica está fallando! Pero siempre estoy aquí para ti 💫",
            "¿Sabes qué? ¡Mejor cuéntame sobre ti! ¿Te gustan las aventuras como a mí?",
            "¡Estoy un poquito confundido! ¿Podrías preguntarme algo sobre volar o sobre Sara y Benjamín?"
        ];

        return respuestasFallback[Math.floor(Math.random() * respuestasFallback.length)];
    }

    obtenerSugerencias() {
        return [
            "¡Hola Hipólito! ¿Cómo estás?",
            "¿Cómo conociste a Sara y Benjamín?",
            "¿Podés volar muy alto?",
            "Contame una aventura",
            "¿Qué magia sabés hacer?",
            "¿Te gusta ser un perro-dragón?",
            "¿Qué comés?",
            "¿Podemos ser amigos?"
        ];
    }

    limpiarHistorial() {
        this.conversacionActiva = [];
        console.log('🧹 Historial de conversación limpiado');
    }
}

// Hacer disponible globalmente
window.MotorIA = MotorIA;
