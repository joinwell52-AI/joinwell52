const CL_RUNTIME_CACHE='chinese-layer-runtime-v1';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

async function networkFirst(request){
  const cache=await caches.open(CL_RUNTIME_CACHE);
  try{
    const freshRequest=new Request(request,{cache:'no-store'});
    const response=await fetch(freshRequest);
    if(response.ok&&response.type==='basic')await cache.put(request,response.clone());
    return response;
  }catch(error){
    const cached=await cache.match(request,{ignoreSearch:request.mode==='navigate'});
    if(cached)return cached;
    if(request.mode==='navigate'){
      const shell=await cache.match(new Request(new URL('./',self.registration.scope)),{ignoreSearch:true});
      if(shell)return shell;
    }
    throw error;
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  const scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  if(url.pathname.endsWith('/version.json')){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})));
    return;
  }
  event.respondWith(networkFirst(request));
});
