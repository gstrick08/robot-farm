// Offline cache. Bump VERSION on every deploy so the iPad picks up the new game.
const VERSION = 'robotfarm-6';
const CORE = [
  './', 'index.html', 'logic.js', 'ui.css', 'adventure.css', 'adventure-world.js', 'art.js', 'presentation.js', 'sounds.js', 'driving.js', 'drive-math.js', 'equipment.js', 'job-progress.js',
  'manifest.webmanifest', 'icon.png', 'fonts/Andika-Regular.woff2', 'fonts/Fredoka-Latin.woff2',
  ...['tap', 'gold', 'silver', 'hmm', 'coin', 'harvest', 'bag', 'complete', 'rocket', 'medal', 'farm'].map(n => `audio/${n}.m4a`),
];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); } // sounds/fonts cache on first use
    return res;
  })));
});
