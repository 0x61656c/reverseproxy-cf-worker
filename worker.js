addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    console.log(request.url);
    const segments = request.url.split('/').filter(segment => segment !== 
'')
    console.log(segments.length);
    if (
        (
            request.url.startsWith("https://example.com") || 
            request.url.startsWith("https://www.example.com") ||
            request.url.startsWith("https://proxy.example.workers.dev")
        ) 
            && 
        (
            !(request.url.startsWith("https://example.com/subdirectory")) 
||
            segments.length < 4
        )
    ) {
        const url = new URL(request.url);
        url.hostname = 'proxy.example.com';
        const proxiedRequest = new Request(url, {
            method: request.method,
            headers: request.headers
        });
        const response = await fetch(proxiedRequest);
        return response;
    } else {
        // return the request unmodified
        return fetch(request);
    }
}

