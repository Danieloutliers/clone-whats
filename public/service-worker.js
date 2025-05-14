// Nome do cache
const CACHE_NAME = 'whatsapp-fake-v1';

// Arquivos que serão armazenados em cache para acesso offline
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/media/received.mp3',
  '/media/sent.mp3',
  '/images/Whatsapp_background_image.webp',
  '/pwa-icons/whatsapp-icon.svg',
  '/pwa-icons/icon-192x192.svg',
  '/pwa-icons/icon-512x512.svg',
  '/register-sw.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  // Força a ativação imediata do service worker
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Excluir caches antigos que não estão na whitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Garante que o service worker assume o controle imediatamente
  self.clients.claim();
});

// Interceptação de requisições para servir a partir do cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone da requisição, pois ela só pode ser consumida uma vez
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(
            (response) => {
              // Verificar se a resposta é válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone da resposta, pois ela só pode ser consumida uma vez
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Armazenar a nova requisição no cache
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          )
          .catch(() => {
            // Se falhar ao buscar a página (offline), mostrar a página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});