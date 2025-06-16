'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Rocket, 
  LayoutDashboard, 
  Upload, 
  Shield, 
  Users, 
  Truck,
  Menu,
  X,
  ChevronRight,
  Eye
} from 'lucide-react'
import { useState } from 'react'

const baseNavigationItems = [
  { href: '/', label: 'Home', icon: Home, description: 'Welcome page' },
  { href: '/onboarding', label: 'Setup Wizard', icon: Rocket, description: 'Configure your rental business' },
  { href: '/analyze', label: 'Business Analyzer', icon: Eye, description: 'Analyze business websites & reputation' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Business overview & metrics' },
  { href: '/import', label: 'Import Data', icon: Upload, description: 'Import equipment, customers, etc.' },
  { href: '/admin', label: 'Admin Panel', icon: Shield, description: 'Manage system settings' },
  { href: '/portal', label: 'Customer Portal', icon: Users, description: 'Customer-facing interface' },
  { href: '/driver', label: 'Driver App', icon: Truck, description: 'Delivery & pickup management' },
]

const systemOwnerItems = [
  { href: '/master-admin', label: 'Master Admin', icon: Shield, description: 'Platform-wide administration' },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // For demo purposes - show Master Admin in development
  // In production, this would come from user authentication
  const [isSystemOwner, setIsSystemOwner] = useState(true)
  
  const navigationItems = [
    ...baseNavigationItems,
    ...(isSystemOwner ? systemOwnerItems : [])
  ]

  // Find current page info
  const currentPage = navigationItems.find(item => item.href === pathname)

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden md:flex bg-white border-b px-4 py-3 items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-semibold text-lg">Rental Platform</span>
          </Link>
          
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Page Indicator */}
        {currentPage && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentPage.label}:</span> {currentPage.description}
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-semibold">Rental Platform</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 top-14 bg-white z-40 overflow-y-auto">
            <div className="px-4 py-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`flex items-center justify-between p-3 rounded-lg mb-1 transition-colors ${
                    pathname === item.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb for context */}
      {currentPage && (
        <div className="bg-gray-50 px-4 py-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">{currentPage.label}</span>
          </div>
        </div>
      )}
    </>
  )
}