const SHELL_CACHE = 'recos-bnm-shell-v1'
const COLLECTIONS_CACHE = 'recos-bnm-collections-v1'
const COLLECTIONS_URL = '/api/collections'

const SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_FILES)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              (name === SHELL_CACHE || name === COLLECTIONS_CACHE) &&
              name !== SHELL_CACHE &&
              name !== COLLECTIONS_CACHE
            )
          })
          .map((name) => caches.delete(name))
      )
    })
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (event.request.url.includes(COLLECTIONS_URL)) {
    event.respondWith(networkFirstWithCache(event.request))
    return
  }

  if (
    event.request.mode === 'navigate' ||
    SHELL_FILES.includes(url.pathname) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(cacheFirstWithNetwork(event.request))
    return
  }

  event.respondWith(networkFirst(event.request))
})

async function cacheFirstWithNetwork(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(COLLECTIONS_CACHE)
      const cachedItems = await cache.match(request)
      let items = []
      if (cachedItems) {
        items = await cachedItems.json()
      }
      const newItem = await response.clone().json()
      items.unshift(newItem)
      if (items.length > 10) {
        items = items.slice(0, 10)
      }
      const limitedResponse = new Response(JSON.stringify(items), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      })
      cache.put(request, limitedResponse.clone())
      return response
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}
