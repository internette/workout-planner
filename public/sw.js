// The app's service worker. It answers every request from the network, so it changes nothing about how the app loads
// or signs in. Chrome only offers to install a site (our "Install Moonshot" prompt) that has a worker with a fetch
// handler. The one thing it keeps is a "No connection" page, shown when a page can't be fetched (the installed app
// opened with no signal), instead of the browser's own error.
// It used to show the workout in progress as a notification; that's gone, and activating closes any still showing.
const OFFLINE_CACHE = 'moonshot-offline-1';
const OFFLINE_PAGE = '/offline.html';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then((cache) => cache.add(OFFLINE_PAGE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('moonshot-offline-') && k !== OFFLINE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.registration.getNotifications({ tag: 'moonshot-live' }))
      .then((list) => list.forEach((n) => n.close()))
      .catch(() => undefined)
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Chrome throws on this combination, and it is not ours to answer anyway.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_PAGE).then((r) => r || Response.error())));
    return;
  }
  event.respondWith(fetch(request));
});
