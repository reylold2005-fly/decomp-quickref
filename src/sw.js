// Offline release: __APP_VERSION__, build __BUILD_ID__.
const BUILD = "__BUILD_ID__", VERSION = "__APP_VERSION__";
const CACHE = "decomp-" + BUILD;
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];
self.addEventListener("install", e => {
  e.waitUntil((async()=>{
    // Fetch the complete release afresh. Keep the old cache if any download fails.
    const responses=await Promise.all(ASSETS.map(async path=>{
      const response=await fetch(new Request(new URL(path,self.registration.scope),{cache:"reload"}));
      if(!response.ok)throw new Error("Incomplete release");
      if(path==="./"||path==="./index.html"){
        const html=await response.clone().text();
        if(!html.includes('name="app-build" content="'+BUILD+'"'))throw new Error("Release mismatch");
      }
      return response;
    }));
    const cache=await caches.open(CACHE);
    await Promise.all(ASSETS.map((path,i)=>cache.put(new URL(path,self.registration.scope),responses[i])));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async()=>{
    await Promise.all((await caches.keys()).filter(k=>k.startsWith("decomp-")&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", e => {
  if(e.data?.type==="GET_VERSION")e.ports[0]?.postMessage({version:VERSION,build:BUILD});
});
self.addEventListener("fetch", e => {
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    return await cache.match(e.request,{ignoreSearch:true})||fetch(e.request);
  })());
});
