// Offline cache for the Document Translator.
// - The page itself and its code libraries are kept in a local cache so the tool opens without internet.
// - Model files are cached by the translation engine itself (browser Cache Storage), so they are not duplicated here.
// - Every request that has to go to the network is reported to the page, so the "network requests" badge is honest.
const CACHE = 'mxtr-v1';
const LIB_HOSTS = /(^|\.)(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)$/;

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html']).catch(() => {})));
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
  if (req.method !== 'GET') { report(req.url); return; }
  const u = new URL(req.url);
  const sameOrigin = u.origin === self.location.origin;
  const isLib = LIB_HOSTS.test(u.hostname);

  if (!sameOrigin && !isLib) { report(req.url); return; } // e.g. model download: browser handles it, we only count it

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: sameOrigin });
    if (hit) {
      if (sameOrigin && navigator.onLine) {
        // refresh the page code quietly in the background so updates arrive on next open
        fetch(req).then((r) => { if (r.ok) cache.put(req, r.clone()); }).catch(() => {});
      }
      return hit;
    }
    report(req.url);
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') cache.put(req, res.clone()).catch(() => {});
    return res;
  })());
});
