// Service Worker for PWA functionality
const CACHE_NAME = 'rental-platform-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/driver',
  '/portal',
  '/dashboard',
  '/onboarding',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html' // Fallback page
]

// API routes to cache
const API_CACHE_PATTERNS = [
  '/api/analyze-business',
  '/api/notifications/sms',
  '/api/payments'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    handleFetch(request)
  )
})

async function handleFetch(request) {
  const url = new URL(request.url)
  
  try {
    // Static assets - Cache First strategy
    if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
      return await cacheFirst(request, STATIC_CACHE)
    }
    
    // API requests - Network First strategy with fallback
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE)
    }
    
    // Images and other assets - Stale While Revalidate
    if (request.destination === 'image' || 
        request.destination === 'font' ||
        request.destination === 'style' ||
        request.destination === 'script') {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE)
    }
    
    // Pages - Network First with offline fallback
    if (request.destination === 'document') {
      return await networkFirstWithOfflinePage(request, DYNAMIC_CACHE)
    }
    
    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE)
    
  } catch (error) {
    console.error('🚨 Service Worker: Fetch error', error)
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return await caches.match('/offline.html')
    }
    
    // Return generic offline response
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    })
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  const networkResponse = await fetch(request)
  const cache = await caches.open(cacheName)
  cache.put(request, networkResponse.clone())
  return networkResponse
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request)
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        const cache = caches.open(cacheName)
        cache.then(c => c.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch(() => cachedResponse) // Return cache if network fails
  
  return cachedResponse || fetchPromise
}

// Network First with Offline Page
async function networkFirstWithOfflinePage(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fall back to offline page
    return await caches.match('/offline.html')
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered', event.tag)
  
  if (event.tag === 'sync-deliveries') {
    event.waitUntil(syncDeliveries())
  }
  
  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Rental Platform', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/driver')
    )
  }
})

// Sync functions
async function syncDeliveries() {
  try {
    // Get pending deliveries from IndexedDB
    // Sync with server
    console.log('🚚 Syncing pending deliveries...')
  } catch (error) {
    console.error('❌ Failed to sync deliveries:', error)
  }
}

async function syncPhotos() {
  try {
    // Get pending photos from IndexedDB
    // Upload to server
    console.log('📸 Syncing pending photos...')
  } catch (error) {
    console.error('❌ Failed to sync photos:', error)
  }
}