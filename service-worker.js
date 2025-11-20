// Nome do cache e arquivos a serem armazenados em cache
const CACHE_NAME = 'teleprompter-pro-cache-v1';
const urlsToCache = [
    '/index.html',
    // O Tailwind é carregado via CDN, por isso não o colocamos aqui, mas é crucial
    // que o arquivo principal seja armazenado em cache para uso offline.
];

self.addEventListener('install', event => {
    // Faz o Service Worker esperar até que o cache seja aberto
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Adiciona todos os recursos necessários ao cache
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Interceta pedidos de rede
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache, se encontrado
                if (response) {
                    return response;
                }
                // Caso contrário, busca na rede
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Deleta caches antigos
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
