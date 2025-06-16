import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Heavy Equipment Rental Platform',
    short_name: 'Equipment Rental',
    description: 'Multi-tenant rental business platform with AI-powered onboarding',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    orientation: 'portrait-primary',
    scope: '/',
    categories: ['business', 'productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png'
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Driver App',
        short_name: 'Driver',
        description: 'Mobile driver delivery app',
        url: '/driver',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Customer Portal',
        short_name: 'Portal',
        description: 'Customer self-service portal',
        url: '/portal',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Business analytics dashboard',
        url: '/dashboard',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192'
          }
        ]
      }
    ],
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    prefer_related_applications: false
  }
}