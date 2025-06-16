'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import BusinessNavigation from '@/components/BusinessNavigation'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Wrench
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  category: string
  model: string
  serialNumber: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  status: 'available' | 'rented' | 'maintenance' | 'inactive'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  location: string
  lastMaintenance: string
  nextMaintenance: string
  description: string
  images: string[]
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
}

interface Business {
  id: string
  name: string
  branding: {
    primaryColor: string
  }
}

export default function EquipmentPage() {
  const params = useParams()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Mock equipment data - in real app this would come from API
  const mockEquipment: Equipment[] = [
    {
      id: 'eq_001',
      name: 'Excavator CAT 320',
      category: 'Heavy Machinery',
      model: 'CAT 320D2L',
      serialNumber: 'CAT320-2023-001',
      dailyRate: 850,
      weeklyRate: 4500,
      monthlyRate: 15000,
      status: 'available',
      condition: 'excellent',
      location: 'Yard A - Bay 3',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      description: '20-ton hydraulic excavator with GPS and advanced hydraulics',
      images: [],
      specifications: {
        'Operating Weight': '20,500 kg',
        'Engine Power': '129 kW',
        'Bucket Capacity': '0.9 m³',
        'Max Dig Depth': '6.5 m'
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 'eq_002',
      name: 'Forklift Toyota 8FD25',
      category: 'Material Handling',
      model: 'Toyota 8FD25',
      serialNumber: 'TOY-2023-047',
      dailyRate: 120,
      weeklyRate: 650,
      monthlyRate: 2200,
      status: 'rented',
      condition: 'good',
      location: 'Yard B - Bay 1',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-07-10',
      description: '2.5-ton diesel forklift with side shift',
      images: [],
      specifications: {
        'Lift Capacity': '2,500 kg',
        'Lift Height': '4.5 m',
        'Fuel Type': 'Diesel',
        'Mast Type': 'Triplex'
      },
      createdAt: '2023-12-15',
      updatedAt: '2024-01-10'
    },
    {
      id: 'eq_003',
      name: 'Generator 100kW',
      category: 'Power Equipment',
      model: 'Caterpillar DE110E0',
      serialNumber: 'GEN-2023-012',
      dailyRate: 180,
      weeklyRate: 980,
      monthlyRate: 3500,
      status: 'maintenance',
      condition: 'fair',
      location: 'Service Bay 2',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      description: '100kW diesel generator with automatic start',
      images: [],
      specifications: {
        'Power Output': '100 kW',
        'Fuel Tank': '400 L',
        'Runtime': '12 hours @ 75% load',
        'Voltage': '480V'
      },
      createdAt: '2023-11-20',
      updatedAt: '2024-01-20'
    }
  ]

  useEffect(() => {
    async function loadData() {
      try {
        // Load business data
        const businessResponse = await fetch(`/api/business/${businessId}`)
        if (businessResponse.ok) {
          const businessResult = await businessResponse.json()
          if (businessResult.success) {
            setBusiness(businessResult.data)
          }
        }

        // Load equipment data (using mock for now)
        setEquipment(mockEquipment)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      loadData()
    }
  }, [businessId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'rented': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle
      case 'rented': return Clock
      case 'maintenance': return Wrench
      case 'inactive': return AlertTriangle
      default: return Package
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(equipment.map(item => item.category)))
  const equipmentStats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    rented: equipment.filter(e => e.status === 'rented').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    totalValue: equipment.reduce((sum, e) => sum + e.monthlyRate, 0)
  }

  if (loading) {
    return (
      <div className="flex">
        {business && (
          <BusinessNavigation 
            businessName={business.name}
            businessId={businessId}
            primaryColor={business.branding.primaryColor}
          />
        )}
        <div className="flex-1 md:ml-80 min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading equipment...</p>
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
          <AlertTriangle className="h-4 w-4" />
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
      
      <div className="flex-1 md:ml-80 min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Equipment Management</h1>
                <p className="text-gray-600">Manage your rental equipment inventory</p>
              </div>
              <Button className="gap-2" asChild>
                <Link href={`/business/${businessId}/equipment/add`}>
                  <Plus className="h-4 w-4" />
                  Add Equipment
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{equipmentStats.total}</div>
                  <div className="text-sm text-gray-600">Total Equipment</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{equipmentStats.available}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{equipmentStats.rented}</div>
                  <div className="text-sm text-gray-600">Currently Rented</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{equipmentStats.maintenance}</div>
                  <div className="text-sm text-gray-600">In Maintenance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">${(equipmentStats.totalValue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-600">Total Monthly Value</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment Grid */}
          <div className="grid gap-6">
            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No equipment found. Add your first piece of equipment!</p>
              </div>
            ) : (
              filteredEquipment.map((item) => {
                const StatusIcon = getStatusIcon(item.status)
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{item.name}</h3>
                              <Badge className={getStatusColor(item.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {item.status}
                              </Badge>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                              <div>
                                <span className="font-medium">Model:</span> {item.model}
                              </div>
                              <div>
                                <span className="font-medium">Serial:</span> {item.serialNumber}
                              </div>
                              <div>
                                <span className="font-medium">Location:</span> {item.location}
                              </div>
                              <div>
                                <span className="font-medium">Condition:</span> 
                                <span className={`ml-1 font-medium capitalize ${getConditionColor(item.condition)}`}>
                                  {item.condition}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Daily Rate:</span>
                                <div className="font-semibold">${item.dailyRate}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Weekly Rate:</span>
                                <div className="font-semibold">${item.weeklyRate}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Monthly Rate:</span>
                                <div className="font-semibold">${item.monthlyRate}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/business/${businessId}/equipment/${item.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/business/${businessId}/equipment/${item.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => alert('Delete functionality coming soon!')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}