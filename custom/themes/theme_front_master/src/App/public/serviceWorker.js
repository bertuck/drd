const CACHE_VERSION = 'v4';
const RUNTIME = 'runtime3';
const CACHE_URLS = [
    'public/index.html',
    'public/index.jsx'
];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_VERSION)
          .then(cache => cache.addAll(CACHE_URLS))
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [CACHE_VERSION, RUNTIME];

    event.waitUntil((async function() {
        console.log("activating");

        const cacheNames = await caches.keys();
        const cachesToDelete = cacheNames.filter(cacheName => !currentCaches.includes(cacheName));

        const promisesToDelete = cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete));
        await Promise.all(promisesToDelete);

        await self.clients.claim(); // notify that this is the most up-to-date worker
        console.log("activated");
    })());
});

self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith((async function() {
            console.log(event.request.url);
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                //console.log(cachedResponse);
            }
            if (cachedResponse) return cachedResponse;

            // If we dont have it in catch, let's fetch and cache it.
            const cache = await caches.open(RUNTIME);
            const response = await fetch(event.request);
            // Put a copy of the response in the runtime cache.
            await cache.put(event.request, response.clone());

            return response;
        })());
    }
});

