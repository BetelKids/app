/* Lucrător de serviciu: ține coaja aplicației în memorie, ca să pornească și fără internet.
   Conținutul propriu-zis vine de la Google Apps Script și NU se păstrează niciodată local. */
const VERSIUNE = 'sd-v2';
const COAJA = [
  './', './index.html', './config.js', './manifest.webmanifest', './offline.html',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSIUNE).then(function (c) { return c.addAll(COAJA); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (chei) {
    return Promise.all(chei.filter(function (k) { return k !== VERSIUNE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const cerere = e.request;
  if (cerere.method !== 'GET') return;
  const url = new URL(cerere.url);

  // tot ce vine de la Google (aplicația propriu-zisă) merge direct în rețea
  if (url.origin !== self.location.origin) return;

  if (cerere.mode === 'navigate') {
    e.respondWith(
      fetch(cerere).catch(function () {
        return caches.match('./index.html').then(function (r) { return r || caches.match('./offline.html'); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(cerere).then(function (din_cache) {
      return din_cache || fetch(cerere).then(function (raspuns) {
        if (raspuns && raspuns.status === 200 && raspuns.type === 'basic') {
          const copie = raspuns.clone();
          caches.open(VERSIUNE).then(function (c) { c.put(cerere, copie); });
        }
        return raspuns;
      }).catch(function () { return caches.match('./offline.html'); });
    })
  );
});
