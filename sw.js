const CACHE_NAME = 'conquista-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png',
    './logo.png'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

// Estratégia de Interceptação: Network First (Sempre online)
self.addEventListener('fetch', event => {
    // Ignora as chamadas de banco de dados do Supabase (devem sempre usar a rede)
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        fetch(event.request).catch(() => {
            // Se falhar (offline), retorna o visual básico salvo no cache
            return caches.match(event.request);
        })
    );
});