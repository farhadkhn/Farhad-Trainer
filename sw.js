const CACHE="farhad-trainer-v2-2.1.0";
const STATIC=["./","./index.html","./styles.css?v=2.1.0","./app.js?v=2.1.0","./manifest.webmanifest?v=2.1.0","./icon-192.png?v=2.1.0","./icon-512.png?v=2.1.0"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).catch(()=>{}))});
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith((async()=>{try{const fresh=await fetch(e.request,{cache:"no-store"});const c=await caches.open(CACHE);c.put(e.request,fresh.clone());return fresh}catch(err){return(await caches.match(e.request))||(await caches.match("./index.html"))}})())});
