const cacheName = 'payback-pt-soft.com-v28';
  const contentToCache = [
    "/payback/favicon.ico",
    "/payback/index.html",
    "/payback/manifest.json",
    "/payback/css/main.css",
    "/payback/img/pb_logo--desktop.svg",
    "/payback/img/pb_logo--fav.svg",
    "/payback/img/pb_logo-192.png",
    "/payback/img/pb_logo-512.png",
    "/payback/js/JsBarcode.all.min.js"
  ];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
  });

  self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });

  self.addEventListener('activate', function(event) {
    console.log('[Service Worker] activate');
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cn) {
            return cn != cacheName
          }).map(function(cn) {
            console.log(`[Service Worker] Clear Cache: ${cn}`);
            return caches.delete(cn);
          })
        );
      })
    );
  });

  self.skipWaiting()