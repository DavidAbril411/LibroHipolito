// Service Worker para Hipólito
const CACHE_NAME = 'hipolito-v1';
const urlsToCache = [
    '/',
    '/cuento-secuencial.html',
    '/chat-infantil.html',
    '/css/estilos.css',
    '/css/estilos-infantiles.css',
    '/js/hipolito-ia-fixed.js',
    '/js/chat-hipolito.js'
];

// Instalación del service worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Archivos en caché');
                // Filtrar URLs que existen antes de agregarlas al caché
                return cache.addAll(urlsToCache).catch(error => {
                    console.warn('⚠️ Algunos archivos no se pudieron cachear:', error);
                    // Intentar cachear archivos uno por uno
                    return Promise.allSettled(
                        urlsToCache.map(url =>
                            cache.add(url).catch(err => console.warn(`No se pudo cachear ${url}:`, err))
                        )
                    );
                });
            })
    );
});

// Activación del service worker
self.addEventListener('activate', event => {
    console.log('✅ Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    console.log('🌐 Service Worker: Petición interceptada:', event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en caché, devolverlo
                if (response) {
                    console.log('📱 Service Worker: Sirviendo desde caché:', event.request.url);
                    return response;
                }

                // Si no está en caché, ir a la red
                console.log('🌍 Service Worker: Petición de red:', event.request.url);
                return fetch(event.request);
            }
            )
    );
});
