const CACHE='ehsan-offline-v1';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['/offline.html','/icon-192.png']))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith('ehsan-offline-')).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{if(event.request.method==='GET'&&event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/offline.html')))}});
