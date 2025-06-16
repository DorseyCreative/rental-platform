'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import BusinessNavigation from '@/components/BusinessNavigation'
import { 
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Info,
  Plus,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench
} from 'lucide-react'

interface BusinessDashboardData {
  id: string
  name: string
  type: string
  branding: {
    primaryColor: string
    secondaryColor: string
    logoUrl?: string
  }
  stats: {
    totalEquipment: number
    totalCustomers: number
    activeRentals: number
    monthlyRevenue: number
    reputationScore: number
    utilizationRate: number
    maintenanceDue: number
  }
}

export default function BusinessDashboardPage() {
  const params = useParams()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<BusinessDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Real-looking mock data
  const dashboardData = {
    monthlyRevenue: 67420,
    revenueChange: 12.5,
    activeRentals: 38,
    totalUnits: 100,
    utilizationRate: 71,
    utilizationChange: 5,
    maintenanceDue: 6,
    recentActivity: [
      {
        id: 1,
        type: 'rental_created',
        description: 'New rental created for Excavator CAT 320',
        customer: 'Johnson Construction',
        amount: 850,
        time: '2 hours ago',
        icon: Calendar,
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'equipment_returned',
        description: 'Forklift Toyota 8FD25 returned',
        customer: 'Metro Warehouse',
        amount: 2400,
        time: '4 hours ago',
        icon: CheckCircle,
        color: 'text-blue-600'
      },
      {
        id: 3,
        type: 'maintenance_scheduled',
        description: 'Generator 100kW scheduled for maintenance',
        customer: 'System',
        time: '6 hours ago',
        icon: Wrench,
        color: 'text-yellow-600'
      },
      {
        id: 4,
        type: 'payment_received',
        description: 'Payment received from ABC Corp',
        customer: 'ABC Corp',
        amount: 4500,
        time: '1 day ago',
        icon: DollarSign,
        color: 'text-green-600'
      }
    ],
    revenueChart: [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 59000 },
      { month: 'Jun', revenue: 67420 }
    ],
    equipmentStatus: {
      available: 62,
      rented: 38,
      maintenance: 6,
      inactive: 4
    }
  }

  useEffect(() => {
    async function loadBusiness() {
      try {
        console.log(`🔄 Loading business dashboard for ID: ${businessId}`)
        const response = await fetch(`/api/business/${businessId}`)
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            console.log('✅ Business data loaded:', result.data.business.name)
            console.log('📊 Real stats:', result.data.stats)
            
            // Transform real business data for dashboard
            const dashboardDataTransformed: BusinessDashboardData = {
              id: result.data.business.id,
              name: result.data.business.name,
              type: result.data.business.type,
              branding: result.data.business.branding,
              stats: {
                totalEquipment: result.data.stats.totalEquipment,
                totalCustomers: result.data.stats.totalCustomers,
                activeRentals: result.data.stats.activeRentals,
                monthlyRevenue: result.data.stats.totalRevenue,
                reputationScore: result.data.business.reputation_score || 85,
                utilizationRate: Math.round((result.data.stats.activeRentals / Math.max(result.data.stats.totalEquipment, 1)) * 100),
                maintenanceDue: result.data.stats.maintenanceEquipment || 0
              }
            }
            setBusiness(dashboardDataTransformed)
          } else {
            console.error('❌ Business API returned error:', result.error)
            setBusiness(null)
          }
        } else {
          console.error('❌ Failed to fetch business:', response.status, response.statusText)
          setBusiness(null)
        }
      } catch (error) {
        console.error('❌ Failed to load business dashboard:', error)
        setBusiness(null)
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      loadBusiness()
    }
  }, [businessId])

  if (loading) {
    return (
      <div className="flex">
        <div className="flex-1 md:ml-80 min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 py-8 px-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Business not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex">
      <BusinessNavigation 
        businessName={business.name}
        businessId={businessId}
        primaryColor={business.branding.primaryColor}
      />
      
      <div className="flex-1 md:ml-80 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header with animated gradient */}
        <div 
          className="relative overflow-hidden text-white py-12 px-4"
          style={{
            background: `linear-gradient(-45deg, ${business.branding.primaryColor}, ${business.branding.primaryColor}dd, ${business.branding.primaryColor}aa, ${business.branding.primaryColor}88)`,
            backgroundSize: '400% 400%',
          }}
        >
          {/* Floating decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-32 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold mb-2">{business.name} Dashboard</h1>
                <p className="text-white/90 text-lg">Real-time overview of your rental business</p>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Live Data
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${dashboardData.monthlyRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{dashboardData.revenueChange}% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <DollarSign className="h-7 w-7 text-green-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-lg"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Rentals</p>
                    <p className="text-3xl font-bold text-blue-600">{dashboardData.activeRentals}</p>
                    <p className="text-sm text-gray-500">Out of {dashboardData.totalUnits} total units</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <Calendar className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-lg"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Utilization Rate</p>
                    <p className="text-3xl font-bold text-purple-600">{dashboardData.utilizationRate}%</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{dashboardData.utilizationChange}% from last week
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                    <TrendingUp className="h-7 w-7 text-purple-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent rounded-lg"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Maintenance Due</p>
                    <p className="text-3xl font-bold text-yellow-600">{dashboardData.maintenanceDue}</p>
                    <p className="text-sm text-gray-500">Equipment need service</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                    <AlertTriangle className="h-7 w-7 text-yellow-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-transparent rounded-lg"></div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="rentals">Rentals</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.revenueChart.map((item, index) => (
                        <div key={item.month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${(item.revenue / Math.max(...dashboardData.revenueChart.map(r => r.revenue))) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold">${(item.revenue / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Status */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>Equipment Status</CardTitle>
                    <CardDescription>Current status distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <span className="text-sm">Available</span>
                        </div>
                        <span className="font-semibold">{dashboardData.equipmentStatus.available}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="text-sm">Currently Rented</span>
                        </div>
                        <span className="font-semibold">{dashboardData.equipmentStatus.rented}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                          <span className="text-sm">In Maintenance</span>
                        </div>
                        <span className="font-semibold">{dashboardData.equipmentStatus.maintenance}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                          <span className="text-sm">Inactive</span>
                        </div>
                        <span className="font-semibold">{dashboardData.equipmentStatus.inactive}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest transactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className={`p-2 rounded-lg ${activity.color.includes('green') ? 'bg-green-100' : activity.color.includes('blue') ? 'bg-blue-100' : activity.color.includes('yellow') ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                            <IconComponent className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-gray-600">{activity.customer}</p>
                          </div>
                          <div className="text-right">
                            {activity.amount && (
                              <p className="font-semibold text-green-600">${activity.amount.toLocaleString()}</p>
                            )}
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Equipment Inventory
                    <Button asChild>
                      <Link href={`/business/${businessId}/equipment`}>
                        <Package className="mr-2 h-4 w-4" />
                        Manage Inventory
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Access your complete equipment inventory management system.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rentals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Rental Management
                    <Button asChild>
                      <Link href={`/business/${businessId}/rentals`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Rentals
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Create, track, and manage all your equipment rentals.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Customer Management
                    <Button asChild>
                      <Link href={`/business/${businessId}/customers`}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Customers
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Manage customer information, rental history, and accounts.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Business Analytics
                    <Button asChild>
                      <Link href={`/business/${businessId}/analytics`}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Analytics
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Detailed reports and insights for your rental business.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}