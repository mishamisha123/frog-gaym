const CACHE='froggy-leap-v17-15jump-level-credit-flat-png';
const CORE=['./','./index.html','./styles.css?v=17','./app.js?v=17','./manifest.webmanifest','./refresh.html','./icons/icon-192.png','./icons/icon-512.png','./characters-flat-v17/classic.png','./characters-flat-v17/king.png','./characters-flat-v17/robot.png','./characters-flat-v17/ghost.png','./characters-flat-v17/dragon.png','./characters-flat-v17/dino.png','./characters-flat-v17/ninja.png','./characters-flat-v17/alien.png','./characters-flat-v17/rockstar.png','./characters-flat-v17/owner.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>{
    const update=fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>cached);
    return cached||update;
  }));
});
