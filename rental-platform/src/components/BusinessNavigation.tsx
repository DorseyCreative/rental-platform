'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Plus,
  ArrowLeft,
  Building2,
  Eye,
  Wrench,
  DollarSign,
  BarChart3,
  FileText,
  Bell,
  HelpCircle
} from 'lucide-react'

interface BusinessNavigationProps {
  businessName: string
  businessId: string
  primaryColor: string
}

export default function BusinessNavigation({ businessName, businessId, primaryColor }: BusinessNavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      title: 'Dashboard',
      href: `/business/${businessId}/dashboard`,
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    {
      title: 'Equipment',
      href: `/business/${businessId}/equipment`,
      icon: Package,
      description: 'Manage inventory',
      children: [
        { title: 'View All Equipment', href: `/business/${businessId}/equipment`, icon: Eye },
        { title: 'Add Equipment', href: `/business/${businessId}/equipment/add`, icon: Plus },
        { title: 'Maintenance', href: `/business/${businessId}/equipment/maintenance`, icon: Wrench }
      ]
    },
    {
      title: 'Customers',
      href: `/business/${businessId}/customers`,
      icon: Users,
      description: 'Customer management',
      children: [
        { title: 'View All Customers', href: `/business/${businessId}/customers`, icon: Eye },
        { title: 'Add Customer', href: `/business/${businessId}/customers/add`, icon: Plus }
      ]
    },
    {
      title: 'Rentals',
      href: `/business/${businessId}/rentals`,
      icon: Calendar,
      description: 'Active & past rentals',
      children: [
        { title: 'Active Rentals', href: `/business/${businessId}/rentals/active`, icon: Calendar },
        { title: 'Create Rental', href: `/business/${businessId}/rentals/create`, icon: Plus },
        { title: 'Rental History', href: `/business/${businessId}/rentals/history`, icon: FileText }
      ]
    },
    {
      title: 'Analytics',
      href: `/business/${businessId}/analytics`,
      icon: TrendingUp,
      description: 'Reports & insights',
      children: [
        { title: 'Revenue Reports', href: `/business/${businessId}/analytics/revenue`, icon: DollarSign },
        { title: 'Equipment Analytics', href: `/business/${businessId}/analytics/equipment`, icon: BarChart3 },
        { title: 'Customer Analytics', href: `/business/${businessId}/analytics/customers`, icon: Users }
      ]
    },
    {
      title: 'Settings',
      href: `/business/${businessId}/settings`,
      icon: Settings,
      description: 'Business configuration',
      children: [
        { title: 'Business Profile', href: `/business/${businessId}/settings/profile`, icon: Building2 },
        { title: 'Notifications', href: `/business/${businessId}/settings/notifications`, icon: Bell },
        { title: 'Help & Support', href: `/business/${businessId}/settings/help`, icon: HelpCircle }
      ]
    }
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b" style={{ backgroundColor: `${primaryColor}10` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {businessName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{businessName}</h3>
            <p className="text-sm text-gray-600">Rental Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
            
            {/* Sub-navigation */}
            {item.children && isActive(item.href) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 p-2 text-sm rounded transition-colors ${
                      pathname === child.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <child.icon className="h-4 w-4" />
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/master-admin" onClick={() => setIsOpen(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Master Admin
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <NavigationContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 h-screen bg-white border-r fixed left-0 top-0 z-30">
        <NavigationContent />
      </div>
    </>
  )
}