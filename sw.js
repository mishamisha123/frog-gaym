const CACHE='froggy-leap-v47-piggy-first-installments';
const CORE=['./','./index.html','./styles.css?v=46-owner-ops','./app.js?v=46-owner-ops','./manifest.webmanifest','./refresh.html','./icons/icon-192.png','./icons/icon-512.png','./assets/job-fry.png','./assets/job-bag.png','./assets/job-kitchen-bg.webp','./assets/lake-preview-forest.webp','./assets/lake-preview-swamp.webp','./assets/lake-preview-cherry.webp','./assets/lake-preview-night.webp','./assets/lake-preview-volcano.webp','./assets/lake-preview-frozen.webp','./assets/lake-preview-space.webp'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.searchParams.has('piggy-time')){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>{
    const update=fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>cached);
    return cached||update;
  }));
});
