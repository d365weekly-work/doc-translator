// Offline cache for the Document Translator.
// - Keeps the page and its two small page libraries so the tool opens without internet.
// - Engine files (model and runtime) are NOT touched here: the engine caches them itself.
// - Every request that goes to the network is reported to the page, so the "network requests" badge is honest.
const CACHE = 'mxtr-v2';
const PAGE_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(['./', './index.html']).catch(() => {});
    for (const u of PAGE_LIBS) {
      try { const r = await fetch(u, { mode: 'cors' }); if (r.ok) await c.put(u, r); } catch {}
    }
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('mxtr-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function report(url) {
  const list = await self.clients.matchAll({ includeUncontrolled: true });
  for (const c of list) c.postMessage({ type: 'net', url });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const u = new URL(req.url);
  const sameOrigin = u.origin === self.location.origin;
  const pageLib = PAGE_LIBS.includes(req.url);

  // Everything else (engine model and runtime files) goes straight to the browser, untouched. We only count it.
  if (req.method !== 'GET' || (!sameOrigin && !pageLib)) { report(req.url); return; }

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req.url, { ignoreSearch: sameOrigin });
    if (hit) {
      if (sameOrigin && navigator.onLine) {
        // refresh the page code quietly so updates arrive on next open
        fetch(req).then((r) => { if (r.ok) cache.put(req, r.clone()); }).catch(() => {});
      }
      return hit;
    }
    report(req.url);
    const res = await fetch(req);
    if (res.ok && res.type !== 'opaque') cache.put(req.url, res.clone()).catch(() => {});
    return res;
  })());
});
