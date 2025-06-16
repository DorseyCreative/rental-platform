'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getBusiness, Business } from '@/lib/supabase'

interface WhiteLabelTheme {
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  businessName: string
  accentColor: string
  textColor: string
  backgroundColor: string
}

interface WhiteLabelContextType {
  theme: WhiteLabelTheme
  business: Business | null
  isLoading: boolean
  updateTheme: (updates: Partial<WhiteLabelTheme>) => void
}

const defaultTheme: WhiteLabelTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  textColor: '#1F2937',
  backgroundColor: '#FFFFFF',
  businessName: 'Rental Platform'
}

const WhiteLabelContext = createContext<WhiteLabelContextType>({
  theme: defaultTheme,
  business: null,
  isLoading: true,
  updateTheme: () => {}
})

export function useWhiteLabel() {
  return useContext(WhiteLabelContext)
}

interface WhiteLabelProviderProps {
  children: React.ReactNode
  businessSlug?: string
}

export function WhiteLabelProvider({ children, businessSlug }: WhiteLabelProviderProps) {
  const [theme, setTheme] = useState<WhiteLabelTheme>(defaultTheme)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBusiness() {
      if (!businessSlug) {
        setIsLoading(false)
        return
      }

      try {
        const businessData = await getBusiness(businessSlug)
        if (businessData) {
          setBusiness(businessData)
          
          // Generate theme from business branding
          const newTheme: WhiteLabelTheme = {
            primaryColor: businessData.branding?.primaryColor || defaultTheme.primaryColor,
            secondaryColor: businessData.branding?.secondaryColor || defaultTheme.secondaryColor,
            logoUrl: businessData.branding?.logoUrl,
            businessName: businessData.name,
            accentColor: generateAccentColor(businessData.branding?.primaryColor || defaultTheme.primaryColor),
            textColor: generateTextColor(businessData.branding?.primaryColor || defaultTheme.primaryColor),
            backgroundColor: '#FFFFFF'
          }
          
          setTheme(newTheme)
          applyThemeToDocument(newTheme)
        }
      } catch (error) {
        console.error('Failed to load business:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBusiness()
  }, [businessSlug])

  const updateTheme = (updates: Partial<WhiteLabelTheme>) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    applyThemeToDocument(newTheme)
  }

  return (
    <WhiteLabelContext.Provider value={{ theme, business, isLoading, updateTheme }}>
      {children}
    </WhiteLabelContext.Provider>
  )
}

function applyThemeToDocument(theme: WhiteLabelTheme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  
  // Convert hex to HSL for CSS custom properties
  const primaryHsl = hexToHsl(theme.primaryColor)
  const secondaryHsl = hexToHsl(theme.secondaryColor)
  const accentHsl = hexToHsl(theme.accentColor)
  
  // Apply CSS custom properties
  root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`)
  root.style.setProperty('--secondary', `${secondaryHsl.h} ${secondaryHsl.s}% ${secondaryHsl.l}%`)
  root.style.setProperty('--accent', `${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%`)
  
  // Update meta theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute('content', theme.primaryColor)
  }
  
  // Update favicon color (for browsers that support it)
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (favicon) {
    // Generate a colored favicon using canvas
    generateColoredFavicon(theme.primaryColor)
  }
}

function generateAccentColor(primaryColor: string): string {
  const hsl = hexToHsl(primaryColor)
  // Shift hue by 60 degrees for complementary color
  const newHue = (hsl.h + 60) % 360
  return hslToHex(newHue, hsl.s, Math.min(hsl.l + 10, 90))
}

function generateTextColor(primaryColor: string): string {
  const hsl = hexToHsl(primaryColor)
  // Use dark text for light backgrounds, light text for dark backgrounds
  return hsl.l > 50 ? '#1F2937' : '#F9FAFB'
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove hash
  hex = hex.replace('#', '')
  
  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function generateColoredFavicon(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  // Draw colored favicon
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 32, 32)
  ctx.fillStyle = 'white'
  ctx.fillRect(4, 8, 24, 16)
  ctx.fillStyle = color
  ctx.fillRect(6, 10, 8, 4)
  ctx.fillRect(16, 10, 8, 4)
  ctx.fillRect(26, 10, 4, 4)
  
  // Update favicon
  const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (link) {
    link.href = canvas.toDataURL()
  }
}