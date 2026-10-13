// Service worker : app utilisable hors-ligne une fois ouverte une première fois.
const CACHE = 'qm-v14';
const SHELL = ['./', 'index.html', 'styles.css', 'js/icons.js', 'js/data.js', 'js/ingredients-fr.js', 'js/ingredients-zh.js', 'js/recipe-names.js', 'js/i18n.js', 'js/engine.js', 'js/shop.js', 'js/prices.js', 'js/firebase-config.js', 'js/sync.js', 'js/app.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Fichiers de l’app : réseau d’abord (pour les mises à jour), cache en secours.
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  // Photos des plats / ingrédients : cache d’abord.
  if (url.hostname.endsWith('themealdb.com') && url.pathname.startsWith('/images/')) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
    })));
  }
});
