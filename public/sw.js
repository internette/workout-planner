// The app's service worker. It does two things:
// - It answers every request from the network, caching nothing, so it changes nothing about how the app loads or
//   signs in. Chrome only offers to install a site (our "Install Moonshot" prompt) that has a worker with a fetch handler.
// - It shows the workout in progress as a notification, for the page (see features/live).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Chrome throws on this combination, and it is not ours to answer anyway.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
  event.respondWith(fetch(request));
});

// The session in progress, as a notification. The page sends what it should say whenever that changes (a tick, a pause,
// the minutes going by) and this shows it under one tag, so each update replaces the last rather than adding another.
// When the session ends the page asks for it to go, or sends the "Quest cleared" one in its place.
const LIVE_TAG = 'moonshot-live';
self.addEventListener('message', (event) => {
  const m = event.data || {};
  if (m.type === 'live-show') {
    event.waitUntil(
      self.registration.showNotification(m.title, {
        tag: LIVE_TAG,
        body: m.body,
        icon: '/icons/icon-192.png',
        // The small icon in the status bar. Android keeps only its shape (the alpha) and tints it, so it is the
        // crescent in white on transparent (the design system's brand/moonshot-badge.svg); the app icon here showed as a
        // filled square.
        badge: '/icons/badge-96.png',
        timestamp: m.timestamp,
        // Updating it mustn't buzz: only the first one of a session makes a sound, as notifications usually do.
        silent: !!m.silent,
        renotify: false,
        actions: m.actions || [],
        data: m.data,
      }),
    );
  } else if (m.type === 'live-clear') {
    event.waitUntil(
      self.registration.getNotifications({ tag: LIVE_TAG }).then((list) => list.forEach((n) => n.close())),
    );
  }
});

// A tap on it, or on one of its buttons, goes to the page: an open one is brought forward and told what was tapped;
// with none open, the session's page opens with the tap in its address, to do once it has loaded.
self.addEventListener('notificationclick', (event) => {
  const n = event.notification;
  const data = n.data || {};
  const action = event.action || 'open';
  n.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const win = wins.find((w) => new URL(w.url).origin === self.location.origin);
      if (win) {
        win.postMessage({ type: 'live-action', action, id: data.id });
        return action === 'open' || action === 'finish' || action === 'write' ? win.focus() : undefined;
      }
      return self.clients.openWindow(data.url + '?live=' + encodeURIComponent(action) + '&id=' + encodeURIComponent(data.id));
    }),
  );
});

// Swiped away: the page leaves it gone until there's something new to say.
self.addEventListener('notificationclose', (event) => {
  const data = event.notification.data || {};
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((wins) => wins.forEach((w) => w.postMessage({ type: 'live-dismissed', id: data.id }))),
  );
});
