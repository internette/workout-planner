// A pass-through service worker. Chrome only fires its install event (the one behind our "Install Moonshot" prompt)
// for a site that has a service worker with a fetch handler. This one caches nothing and answers every request from
// the network, so it changes nothing about how the app loads or signs in.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Chrome throws on this combination, and it is not ours to answer anyway.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
  event.respondWith(fetch(request));
});
