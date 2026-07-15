const CACHE='froggy-leap-v16-mobile-cockpit-clean-art';
const CORE=['./','./index.html','./styles.css?v=16','./app.js?v=16','./manifest.webmanifest','./refresh.html','./icons/icon-192.png','./icons/icon-512.png','./characters/classic.svg','./characters/king.svg','./characters/robot.svg','./characters/ghost.svg','./characters/dragon.svg','./characters/dino.svg','./characters/ninja.svg','./characters/alien.svg','./characters/rockstar.svg','./characters/owner.svg'];
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
