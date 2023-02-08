async function handleRequest(fetchPath) {
    if (!fetchPath.endsWith(".html")) {
        return fetch(fetchPath)
    }

    var customFetch = await fetch(fetchPath)
    var htmlCode = await customFetch.text()

    var newHeaders = Object.assign({}, customFetch.rawHeaders)

    newHeaders['content-type'] = "text/html"

    return new Response(htmlCode, {
        status: customFetch.status,
        headers: newHeaders
    })
}

self.addEventListener("fetch", function(e) {
    var path = new URL(e.request.url).pathname

    if (path.startsWith("/files/")) {
        var fetchPath = "https://raw.githack.com/3kh0/3kh0-assets/main/" + path.split("/files/")[1]

        return e.respondWith(handleRequest(fetchPath))
    } else {
        return e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );  
    }
})

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open("3kh0").then(function(cache) {
      return cache.addAll(["/manifest.json"]);
    })
  );
  self.skipWaiting();
});
