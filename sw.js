async function isBlocked(url) {
    try {
        var README = await fetch(url + "/README.md")
        var content = await README.text()
        if (content.startsWith("# 3kh0 Assets")) {
            return false;
        } else {
            return true;
        }
    } catch {
        return true;
    }
}

async function getCDN(cdns) {
for (let cdn in cdns) {
    var blocked = await isBlocked(cdns[cdn])
    if (!blocked) {
        return cdns[cdn];
    }
}

return cdns[0];
}

async function handleRequest(fetchPath) {
var currentCDN = await getCDN(["https://raw.githack.com/3kh0/3kh0-assets/main", "https://d1wnfatapmxxni.cloudfront.net", "https://d38a7mob3guz4f.cloudfront.net", "https://cloudbase-labs.s3.amazonaws.com"])
    fetchPath = currentCDN + "/" + fetchPath
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
        var fetchPath = path.split("/files/")[1]

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
