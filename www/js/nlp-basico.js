/**
 * Motor de Procesamiento de Lenguaje Natural Básico
 * Para el chatbot educativo de Hipólito
 * Funciona completamente offline sin APIs externas
 */

class NLPBasico {
    constructor() {
        this.vocabulario = null;
        this.preguntasRespuestas = null;
        this.palabrasConectoras = [
            'que', 'es', 'como', 'donde', 'cuando', 'porque', 'quien', 'cual', 'cuanto',
            'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para',
            'y', 'o', 'pero', 'si', 'no', 'me', 'te', 'se', 'le', 'lo', 'mi', 'tu', 'su'
        ];
        this.palabrasAfirmacion = ['si', 'sí', 'claro', 'exacto', 'correcto', 'cierto', 'verdad'];
        this.palabrasNegacion = ['no', 'nunca', 'nada', 'ninguno', 'ninguna', 'tampoco'];
        this.palabrasIntercambio = new Map([
            ['yo', 'tú'], ['tú', 'yo'], ['mi', 'tu'], ['tu', 'mi'],
            ['mío', 'tuyo'], ['tuyo', 'mío'], ['me', 'te'], ['te', 'me']
        ]);

        // La inicialización debe ser llamada externamente
        this.datosListos = false;
    }

    async inicializar() {
        try {
            await this.cargarDatos();
            console.log('NLP Básico inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando NLP:', error);
        }
    }

    async cargarDatos() {
        try {
            // Cargar vocabulario
            const respuestaVocabulario = await fetch('./data/vocabulario.json');
            if (respuestaVocabulario.ok) {
                this.vocabulario = await respuestaVocabulario.json();
                console.log('✅ Vocabulario cargado');
            } else {
                console.warn('⚠️ No se pudo cargar vocabulario, usando datos básicos');
                this.vocabulario = this.crearVocabularioBasico();
            }

            // Cargar preguntas y respuestas
            const respuestaPR = await fetch('./data/preguntas-respuestas.json');
            if (respuestaPR.ok) {
                this.preguntasRespuestas = await respuestaPR.json();
                console.log('✅ Base de conocimiento cargada');
            } else {
                console.warn('⚠️ No se pudo cargar base de conocimiento, usando datos básicos');
                this.preguntasRespuestas = this.crearConocimientoBasico();
            }

        } catch (error) {
            console.error('⚠️ Error cargando datos, usando fallback:', error);
            this.vocabulario = this.crearVocabularioBasico();
            this.preguntasRespuestas = this.crearConocimientoBasico();
        }
    }

    /**
     * Crea un vocabulario básico como fallback
     */
    crearVocabularioBasico() {
        return {
            vocabularioComplejo: {
                'hipolito': {
                    definicion: 'Un perro-dragón mágico, el personaje principal del cuento',
                    definicionSimple: 'Un animal fantástico que es mitad perro y mitad dragón'
                },
                'iscarotes': {
                    definicion: 'Los malos de la historia que no son buenos con los perros-dragón',
                    definicionSimple: 'Los malos del cuento'
                },
                'siete islas': {
                    definicion: 'El lugar mágico donde viven los perros-dragón',
                    definicionSimple: 'Islas mágicas'
                }
            }
        };
    }

    /**
     * Crea conocimiento básico como fallback
     */
    crearConocimientoBasico() {
        return {
            preguntasEspecificas: {
                'quien_es_hipolito': {
                    pregunta: '¿Quién es Hipólito?',
                    respuestaCompleta: 'Hipólito es un perro-dragón muy especial. Tiene alas blancas con destellos dorados y es el protagonista de nuestra historia. Es amigable y cariñoso.',
                    respuestaBasica: 'Hipólito es un perro-dragón mágico, el personaje principal del cuento.',
                    respuestaAvanzada: 'Hipólito es un perro-dragón con alas blancas y destellos dorados, originario de las Siete Islas, que ahora vive con Sara y Benjamín en Córdoba.'
                },
                'personajes_principales': {
                    pregunta: '¿Cómo se llaman los personajes?',
                    respuestaCompleta: 'Los personajes principales son:\n🐉 Hipólito - El perro-dragón protagonista\n👧 Sara - Una niña observadora\n👦 Benjamín - El hermano de Sara\n👹 Los Iscarotes - Los villanos',
                    respuestaBasica: 'Los personajes son Hipólito, Sara, Benjamín y los Iscarotes.',
                    respuestaAvanzada: 'Los protagonistas son Hipólito (un perro-dragón), Sara y Benjamín (hermanos que lo adoptan), y los Iscarotes como antagonistas.'
                }
            }
        };
    }

    /**
     * Normaliza texto eliminando acentos, convirtiendo a minúsculas
     */
    normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^\w\s¿?¡!]/g, ' ') // Mantener solo letras, números y signos de pregunta
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    /**
     * Tokeniza el texto en palabras
     */
    tokenizar(texto) {
        const textoNormalizado = this.normalizar(texto);
        return textoNormalizado.split(' ').filter(palabra => palabra.length > 0);
    }

    /**
     * Elimina palabras conectoras (stopwords en español)
     */
    eliminarConectoras(tokens) {
        return tokens.filter(token => !this.palabrasConectoras.includes(token));
    }

    /**
     * Extrae palabras clave importantes del texto
     */
    extraerPalabrasClave(texto) {
        const tokens = this.tokenizar(texto);
        const palabrasClave = this.eliminarConectoras(tokens);

        // Buscar palabras del vocabulario especializado
        const palabrasEspecializadas = [];

        if (this.vocabulario?.vocabularioComplejo) {
            palabrasClave.forEach(palabra => {
                // Buscar en vocabulario complejo
                for (const [termino, datos] of Object.entries(this.vocabulario.vocabularioComplejo)) {
                    if (termino.includes(palabra) || palabra.includes(termino) ||
                        this.calcularSimilitud(palabra, termino) > 0.7) {
                        palabrasEspecializadas.push({
                            original: palabra,
                            termino: termino,
                            datos: datos
                        });
                    }
                }
            });
        }

        return {
            todas: palabrasClave,
            especializadas: palabrasEspecializadas,
            tokens: tokens
        };
    }

    /**
     * Detecta la intención del usuario basándose en patrones
     */
    detectarIntencion(texto) {
        const textoNormalizado = this.normalizar(texto);

        // Patrones de intención (optimizados para errores de ortografía típicos)
        const patrones = {
            pregunta_personaje: /personaj|personag|quien|quienes|como se llam|como se yam|cono se llam|nombres|sara|benjamin|hipolito|iscarot|protagonis|protagoin|malo|bueno|principal|prinsipal|caracter|actor/,
            pregunta_lugar: /donde|lugar|isla|cordoba|siete isla|vive|esta|biblioteca|pais|ciudad|argentina|casa/,
            pregunta_definicion: /que es|que significa|que quiere decir|definicion|significado|explica|no entiendo|no se que es|que cosa es/,
            pregunta_historia: /que pasa|que paso|como termina|final|historia|cuento|aventura|empieza|comienza|trata|sobre que es/,
            saludo: /hola|buenas|saludos|hey|ola|buenos dias|buenas tardes|hi/,
            despedida: /chau|adios|hasta luego|nos vemos|bay|chao|me voy|bye/,
            afirmacion: /si|sí|claro|exacto|correcto|entiendo|ok|vale|esta bien|perfecto|bien/,
            negacion: /no|nunca|no entiendo|no se|nada|tampoco|mal|incorrecto/,
            ayuda: /ayuda|no entiendo|explicame|no se que hacer|como funciona|que puedo preguntar|como usar|como preguntar/
        };

        for (const [intencion, patron] of Object.entries(patrones)) {
            if (patron.test(textoNormalizado)) {
                return intencion;
            }
        }

        return 'desconocida';
    }

    /**
     * Calcula similitud entre dos textos usando Jaccard
     */
    calcularSimilitud(texto1, texto2) {
        const tokens1 = new Set(this.eliminarConectoras(this.tokenizar(texto1)));
        const tokens2 = new Set(this.eliminarConectoras(this.tokenizar(texto2)));

        const interseccion = new Set([...tokens1].filter(x => tokens2.has(x)));
        const union = new Set([...tokens1, ...tokens2]);

        return interseccion.size / union.size;
    }

    /**
     * Busca la mejor respuesta para una pregunta
     */
    buscarRespuesta(pregunta, nivelComplejidad = 'intermedio') {
        if (!this.preguntasRespuestas) {
            console.log('📝 Usando fallback - sin base de conocimiento');
            return this.respuestaGenerica();
        }

        const palabrasClave = this.extraerPalabrasClave(pregunta);
        const intencion = this.detectarIntencion(pregunta);

        console.log('🔍 Analizando:', {
            pregunta,
            palabrasClave: palabrasClave.todas,
            intencion
        });

        // Priorizar respuestas por intención detectada PRIMERO
        if (intencion === 'pregunta_personaje') {
            console.log('🎯 Detectada pregunta sobre personajes');
            const respuestaPersonaje = this.respuestaPersonajes(palabrasClave);
            return {
                texto: respuestaPersonaje,
                confianza: 0.9,
                tipo: 'personaje',
                intencion: intencion,
                palabrasClave: palabrasClave.todas || palabrasClave
            };
        }

        if (intencion === 'pregunta_lugar') {
            console.log('🎯 Detectada pregunta sobre lugares');
            const respuestaLugar = this.respuestaLugares(palabrasClave);
            return {
                texto: respuestaLugar,
                confianza: 0.9,
                tipo: 'lugar',
                intencion: intencion,
                palabrasClave: palabrasClave.todas || palabrasClave
            };
        }

        // Buscar en preguntas específicas
        const respuestaEspecifica = this.buscarEnPreguntasEspecificas(pregunta, palabrasClave, nivelComplejidad);
        if (respuestaEspecifica) {
            console.log('✅ Encontrada respuesta específica');
            return {
                texto: respuestaEspecifica.texto || respuestaEspecifica.respuesta,
                confianza: respuestaEspecifica.confianza || 0.8,
                tipo: 'especifica',
                intencion: intencion,
                palabrasClave: palabrasClave.todas || palabrasClave
            };
        }

        // Buscar en vocabulario
        const respuestaVocabulario = this.buscarEnVocabulario(palabrasClave);
        if (respuestaVocabulario) {
            console.log('📚 Encontrada definición en vocabulario');
            return {
                texto: respuestaVocabulario.texto || respuestaVocabulario.respuesta,
                confianza: respuestaVocabulario.confianza || 0.7,
                tipo: 'vocabulario',
                intencion: intencion,
                palabrasClave: palabrasClave.todas || palabrasClave
            };
        }

        // Respuesta basada en intención como último recurso
        console.log('🔄 Usando respuesta por intención:', intencion);
        const respuestaIntencion = this.respuestaPorIntencion(intencion, palabrasClave);
        return {
            texto: respuestaIntencion.texto || respuestaIntencion.respuesta,
            confianza: respuestaIntencion.confianza || 0.5,
            tipo: 'intencion',
            intencion: intencion,
            palabrasClave: palabrasClave.todas || palabrasClave
        };
    }

    /**
     * Busca en las preguntas específicas del cuento
     */
    buscarEnPreguntasEspecificas(pregunta, palabrasClave, nivel) {
        if (!this.preguntasRespuestas?.preguntasEspecificas) {
            return null;
        }

        const preguntasEsp = this.preguntasRespuestas.preguntasEspecificas;
        let mejorCoincidencia = null;
        let mejorPuntuacion = 0;

        for (const datos of Object.values(preguntasEsp)) {
            if (!datos.pregunta) continue;

            const similitud = this.calcularSimilitud(pregunta, datos.pregunta);

            if (similitud > mejorPuntuacion && similitud > 0.3) {
                mejorPuntuacion = similitud;
                mejorCoincidencia = datos;
            }
        }

        if (mejorCoincidencia) {
            let respuesta;
            switch (nivel) {
                case 'basico':
                    respuesta = mejorCoincidencia.respuestaBasica || mejorCoincidencia.respuestaCompleta;
                    break;
                case 'avanzado':
                    respuesta = mejorCoincidencia.respuestaAvanzada || mejorCoincidencia.respuestaCompleta;
                    break;
                default:
                    respuesta = mejorCoincidencia.respuestaCompleta;
            }

            return {
                texto: respuesta,
                tipo: 'especifica',
                confianza: mejorPuntuacion,
                conceptos: mejorCoincidencia.conceptosClaves || [],
                vocabulario: mejorCoincidencia.vocabulario || []
            };
        }

        return null;
    }

    /**
     * Busca definiciones en el vocabulario
     */
    buscarEnVocabulario(palabrasClave) {
        if (!this.vocabulario || !palabrasClave?.especializadas || palabrasClave.especializadas.length === 0) {
            // Intentar buscar en todas las palabras clave
            if (palabrasClave?.todas) {
                for (const palabra of palabrasClave.todas) {
                    const definicion = this.buscarDefinicionPalabra(palabra);
                    if (definicion) {
                        return {
                            texto: definicion,
                            tipo: 'vocabulario',
                            confianza: 0.6
                        };
                    }
                }
            }
            return null;
        }

        const termino = palabrasClave.especializadas[0];
        return {
            texto: termino.datos.definicion || termino.datos.definicionSimple || "Definición no disponible",
            tipo: 'vocabulario',
            confianza: 0.8,
            relacionados: termino.datos.relacionados || []
        };
    }

    /**
     * Busca definición de una palabra específica
     */
    buscarDefinicionPalabra(palabra) {
        if (!this.vocabulario?.vocabularioComplejo) {
            return null;
        }

        // Buscar coincidencia exacta
        if (this.vocabulario.vocabularioComplejo[palabra]) {
            return this.vocabulario.vocabularioComplejo[palabra].definicionSimple ||
                this.vocabulario.vocabularioComplejo[palabra].definicion;
        }

        // Buscar coincidencia parcial
        for (const [termino, datos] of Object.entries(this.vocabulario.vocabularioComplejo)) {
            if (termino.includes(palabra) || palabra.includes(termino)) {
                return datos.definicionSimple || datos.definicion;
            }
        }

        return null;
    }

    /**
     * Genera respuesta basada en la intención detectada
     */
    respuestaPorIntencion(intencion, palabrasClave) {
        let respuestaTexto;
        let confianza = 0.7;

        switch (intencion) {
            case 'saludo':
                respuestaTexto = "¡Hola! Soy tu ayudante para el cuento de Hipólito. ¿Qué quieres saber? 🐉";
                break;
            case 'despedida':
                respuestaTexto = "¡Adiós! Espero haberte ayudado con la historia de Hipólito. 👋";
                break;
            case 'ayuda':
                respuestaTexto = "Puedes preguntarme:\n• ¿Cómo se llaman los personajes?\n• ¿Dónde pasa la historia?\n• ¿Qué significa una palabra?\n\n¿Qué quieres saber?";
                break;
            case 'afirmacion':
                respuestaTexto = "¡Genial! ¿Hay algo más del cuento que quieras saber?";
                break;
            case 'negacion':
                respuestaTexto = "No te preocupes, puedo explicártelo más fácil. ¿Qué no entendiste?";
                break;
            case 'pregunta_personaje':
            case 'pregunta_nombres':
                respuestaTexto = this.respuestaPersonajes(palabrasClave);
                confianza = 0.8;
                break;
            case 'pregunta_lugar':
                respuestaTexto = this.respuestaLugares(palabrasClave);
                confianza = 0.8;
                break;
            case 'pregunta_historia':
                respuestaTexto = "La historia de Hipólito tiene muchas aventuras. ¿Te gustaría saber sobre alguna parte específica?";
                break;
            default: {
                const respuestaGen = this.respuestaGenerica();
                respuestaTexto = respuestaGen.texto || respuestaGen;
                confianza = 0.3;
                break;
            }
        }

        return {
            texto: respuestaTexto,
            tipo: 'intencion',
            intencion: intencion,
            confianza: confianza
        };
    }

    /**
     * Respuestas específicas sobre personajes (adaptadas para niños de 8-9 años)
     */
    respuestaPersonajes(palabrasClave) {
        const personajes = {
            'hipolito': 'Hipólito es un perro-dragón súper especial. Tiene alas blancas muy bonitas y es el personaje principal de nuestro cuento.',
            'sara': 'Sara es una niña muy inteligente y cariñosa. Es la hermana de Benjamín y cuida mucho a Hipólito.',
            'benjamin': 'Benjamín es el hermano de Sara. Le gusta hacer preguntas y es muy valiente.',
            'iscarot': 'Los Iscarotes son los malos del cuento. No son buenos con los perros-dragón.'
        };

        const palabras = palabrasClave?.todas || [];

        // Primero buscar si menciona un personaje específico
        for (const palabra of palabras) {
            if (personajes[palabra]) {
                return personajes[palabra];
            }
        }

        // Si pregunta por nombres o personajes en general (detectar mejor las variaciones)
        const preguntaNombres = palabras.some(p =>
            ['llama', 'llaman', 'yaman', 'nombres', 'personaj', 'personag', 'personages', 'protagonis', 'protagoin', 'principal', 'prinsipal', 'caracter', 'actor'].includes(p)
        );

        if (preguntaNombres || palabras.includes('quien') || palabras.includes('quienes')) {
            return "Los personajes principales del cuento son:\n\n" +
                "🐉 **Hipólito** - El perro-dragón con alas blancas (protagonista)\n" +
                "👧 **Sara** - Una niña muy inteligente\n" +
                "👦 **Benjamín** - El hermano de Sara\n" +
                "👹 **Los Iscarotes** - Los malos del cuento\n\n" +
                "¿Quieres saber más sobre alguno?";
        }

        // Respuesta por defecto para cualquier pregunta sobre personajes
        return "Los personajes principales del cuento son:\n\n" +
            "🐉 **Hipólito** - El perro-dragón protagonista\n" +
            "👧 **Sara** - Una niña inteligente\n" +
            "👦 **Benjamín** - El hermano de Sara\n" +
            "👹 **Los Iscarotes** - Los malos\n\n" +
            "¿Quieres saber más sobre alguno?";
    }

    /**
     * Respuestas específicas sobre lugares
     */
    respuestaLugares(palabrasClave) {
        const lugares = {
            'cordoba': 'Córdoba es la ciudad donde viven Sara y Benjamín. Es donde encontraron a Hipólito.',
            'islas': 'Las Siete Islas son el hogar de Hipólito. Son islas mágicas muy bonitas.',
            'isla': 'Cada isla es especial y diferente. Todas son muy bonitas.',
            'biblioteca': 'En la biblioteca Sara y Benjamín encontraron un libro sobre animales fantásticos.'
        };

        const palabras = palabrasClave?.todas || [];
        for (const palabra of palabras) {
            if (lugares[palabra]) {
                return lugares[palabra];
            }
        }

        return "La historia pasa en Córdoba y en las Siete Islas mágicas. ¿Sobre qué lugar quieres saber más?";
    }

    /**
     * Respuesta genérica cuando no se encuentra coincidencia
     */
    respuestaGenerica() {
        const respuestasGenericas = [
            "No entendí bien. ¿Puedes preguntarme de otra forma?",
            "Esa pregunta está difícil. ¿Me preguntas sobre los personajes?",
            "Puedes preguntarme sobre Hipólito, Sara, Benjamín o los lugares del cuento.",
            "No sé esa respuesta, pero puedo ayudarte con otras cosas del cuento."
        ];

        const respuesta = respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)];

        return {
            texto: respuesta,
            tipo: 'generica',
            confianza: 0.3
        };
    }

    /**
     * Genera sugerencias de preguntas basadas en el contexto
     */
    generarSugerencias(contexto = '') {
        const sugerenciasBase = [
            "¿Por qué se llama Hipólito?",
            "¿Qué es un perro-dragón?",
            "¿Quiénes son los Iscarotes?",
            "¿Dónde están las Siete Islas?",
            "¿Qué significa grimorio?",
            "¿Por qué Hipólito gruñe al hombre misterioso?"
        ];

        // Mezclar aleatoriamente y tomar 3-4 sugerencias
        const sugerenciasCopia = [...sugerenciasBase];
        sugerenciasCopia.sort(() => 0.5 - Math.random());
        return sugerenciasCopia.slice(0, 3);
    }

    /**
     * Detecta errores de tipeo comunes usando distancia de Levenshtein simplificada
     */
    corregirTipeo(palabra) {
        if (!this.vocabulario) return palabra;

        const vocabularioCompleto = Object.keys(this.vocabulario.vocabularioComplejo);

        for (const termino of vocabularioCompleto) {
            if (this.distanciaLevenshtein(palabra, termino) <= 2 && palabra.length > 3) {
                return termino;
            }
        }

        return palabra;
    }

    /**
     * Calcula distancia de Levenshtein simplificada
     */
    distanciaLevenshtein(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matriz = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) matriz[i][0] = i;
        for (let j = 0; j <= b.length; j++) matriz[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const costo = a[i - 1] === b[j - 1] ? 0 : 1;
                matriz[i][j] = Math.min(
                    matriz[i - 1][j] + 1,
                    matriz[i][j - 1] + 1,
                    matriz[i - 1][j - 1] + costo
                );
            }
        }

        return matriz[a.length][b.length];
    }

    /**
     * Evalúa la calidad de la respuesta del chatbot
     */
    evaluarRespuesta(pregunta, respuesta, feedbackUsuario = null) {
        const metricas = {
            relevancia: this.calcularRelevancia(pregunta, respuesta.respuesta),
            confianza: respuesta.confianza || 0,
            completitud: this.evaluarCompletitud(respuesta),
            claridad: this.evaluarClaridad(respuesta.respuesta)
        };

        if (feedbackUsuario) {
            metricas.satisfaccionUsuario = feedbackUsuario === 'positivo' ? 1 : 0;
        }

        return metricas;
    }

    calcularRelevancia(pregunta, respuesta) {
        return this.calcularSimilitud(pregunta, respuesta);
    }

    evaluarCompletitud(respuesta) {
        const elementos = ['respuesta', 'tipo', 'confianza'];
        const presentes = elementos.filter(elem => respuesta[elem] !== undefined).length;
        return presentes / elementos.length;
    }

    evaluarClaridad(texto) {
        const longitud = texto.length;
        const palabras = texto.split(' ').length;
        const promedioLongitudPalabra = longitud / palabras;

        // Penalizar respuestas muy cortas o muy largas
        if (palabras < 5) return 0.3;
        if (palabras > 100) return 0.5;
        if (promedioLongitudPalabra > 8) return 0.6;

        return 0.8;
    }

    /**
     * Analiza un texto y retorna información estructurada
     * (Método de compatibilidad para testing)
     */
    analizarTexto(texto) {
        const tokens = this.tokenizar(texto);
        const normalizado = this.normalizar(texto);
        const intencion = this.detectarIntencion(texto);
        const palabrasClave = this.extraerPalabrasClave(texto);

        return {
            tokens: tokens,
            normalizado: normalizado,
            intencion: intencion,
            palabrasClave: palabrasClave.todas,
            palabrasEspecializadas: palabrasClave.especializadas
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NLPBasico;
}
