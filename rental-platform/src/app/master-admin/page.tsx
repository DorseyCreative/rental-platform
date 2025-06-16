'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe, 
  Star,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  Facebook,
  Linkedin,
  MessageSquare
} from 'lucide-react'

interface Business {
  id: string
  name: string
  type: string
  website: string
  phone: string
  email: string
  address: string
  status: 'active' | 'setup' | 'inactive'
  reputationScore: number
  totalEquipment: number
  totalCustomers: number
  monthlyRevenue: number
  lastActivity: string
  createdAt: string
  branding: {
    primaryColor: string
    logoUrl?: string
  }
  webIntelligence: {
    googleReviews: number
    facebookFollowers: number
    linkedinConnections: number
    overallSentiment: 'positive' | 'neutral' | 'negative'
    lastCrawled: string
  }
}

// Mock data - this would come from your database
const mockBusinesses: Business[] = [
  {
    id: 'biz_001',
    name: 'ABC Heavy Equipment Rentals',
    type: 'heavy_equipment',
    website: 'https://abcheavy.com',
    phone: '+1-555-123-4567',
    email: 'info@abcheavy.com',
    address: '123 Industrial Dr, Houston, TX',
    status: 'active',
    reputationScore: 87,
    totalEquipment: 145,
    totalCustomers: 89,
    monthlyRevenue: 125000,
    lastActivity: '2 hours ago',
    createdAt: '2024-01-15',
    branding: {
      primaryColor: '#FF6600',
      logoUrl: undefined
    },
    webIntelligence: {
      googleReviews: 4.2,
      facebookFollowers: 2341,
      linkedinConnections: 567,
      overallSentiment: 'positive',
      lastCrawled: '1 hour ago'
    }
  },
  {
    id: 'biz_002', 
    name: 'Party Perfect Rentals',
    type: 'party_rental',
    website: 'https://partyperfectrentals.com',
    phone: '+1-555-PARTY-01',
    email: 'events@partyrentals.com',
    address: '456 Celebration Ave, Event City, ST',
    status: 'setup',
    reputationScore: 72,
    totalEquipment: 89,
    totalCustomers: 156,
    monthlyRevenue: 45000,
    lastActivity: '1 day ago',
    createdAt: '2024-02-03',
    branding: {
      primaryColor: '#E91E63'
    },
    webIntelligence: {
      googleReviews: 3.8,
      facebookFollowers: 1205,
      linkedinConnections: 89,
      overallSentiment: 'neutral',
      lastCrawled: '3 hours ago'
    }
  },
  {
    id: 'biz_003',
    name: 'Tools & More Rental Co',
    type: 'tool_rental', 
    website: 'https://toolsandmore.net',
    phone: '+1-555-TOOLS-99',
    email: 'rental@toolsandmore.net',
    address: '789 Workshop St, Tool Town, CA',
    status: 'active',
    reputationScore: 94,
    totalEquipment: 267,
    totalCustomers: 445,
    monthlyRevenue: 78000,
    lastActivity: '30 minutes ago',
    createdAt: '2024-01-08',
    branding: {
      primaryColor: '#4CAF50',
      logoUrl: 'https://example.com/logo.png'
    },
    webIntelligence: {
      googleReviews: 4.7,
      facebookFollowers: 3456,
      linkedinConnections: 234,
      overallSentiment: 'positive',
      lastCrawled: '45 minutes ago'
    }
  }
]

export default function MasterAdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRevenue: 0,
    avgReputation: 0
  })

  // Load real data from database
  useEffect(() => {
    async function loadBusinesses() {
      try {
        const response = await fetch('/api/businesses')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Transform data to match Business interface
            const transformedBusinesses = result.data.businesses.map((b: any) => ({
              id: b.id,
              name: b.name,
              type: b.type,
              website: b.website,
              phone: b.phone,
              email: b.email,
              address: b.address,
              status: b.status,
              reputationScore: b.reputationScore,
              totalEquipment: 0, // Will be calculated from actual data later
              totalCustomers: 0, // Will be calculated from actual data later
              monthlyRevenue: Math.floor(Math.random() * 100000) + 20000, // Demo for now
              lastActivity: '2 hours ago', // Demo for now
              createdAt: b.createdAt,
              branding: b.branding,
              webIntelligence: {
                googleReviews: b.webIntelligence?.googleReviews?.rating || 0,
                facebookFollowers: b.webIntelligence?.socialMedia?.facebook?.followers || 0,
                linkedinConnections: b.webIntelligence?.socialMedia?.linkedin?.connections || 0,
                overallSentiment: b.webIntelligence?.overallSentiment || 'neutral',
                lastCrawled: '1 hour ago'
              }
            }))
            setBusinesses(transformedBusinesses)
            setStats(result.data.stats)
          }
        }
      } catch (error) {
        console.error('Failed to load businesses:', error)
        // Fallback to mock data
        setBusinesses(mockBusinesses)
      } finally {
        setLoading(false)
      }
    }

    loadBusinesses()
  }, [])

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || business.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalBusinesses = stats.total || businesses.length
  const activeBusinesses = stats.active || businesses.filter(b => b.status === 'active').length
  const totalRevenue = stats.totalRevenue || businesses.reduce((sum, b) => sum + b.monthlyRevenue, 0)
  const avgReputationScore = stats.avgReputation || (businesses.length > 0 ? businesses.reduce((sum, b) => sum + b.reputationScore, 0) / businesses.length : 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'setup': return 'bg-yellow-100 text-yellow-800'  
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReputationColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'neutral': return 'text-yellow-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Master Admin Dashboard:</strong> Overview of all rental businesses on your platform. 
              Monitor performance, reputation, and manage multi-tenant operations.
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Master Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage all rental businesses • Platform-wide analytics • Reputation monitoring
              </p>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/analyze">
                <Building2 className="h-4 w-4" />
                Add New Business
              </Link>
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold">{totalBusinesses}</p>
                  <p className="text-xs text-green-600">↗ {activeBusinesses} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Revenue</p>
                  <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-green-600">↗ Monthly total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Reputation</p>
                  <p className="text-2xl font-bold">{avgReputationScore.toFixed(0)}</p>
                  <p className="text-xs text-yellow-600">Platform average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Health</p>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-xs text-green-600">↗ All systems</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="setup">Setup</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Business List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading businesses...</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No businesses found. Try analyzing some business websites first!</p>
            </div>
          ) : (
            filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Logo/Avatar */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: business.branding.primaryColor }}
                    >
                      {business.branding.logoUrl ? (
                        <img src={business.branding.logoUrl} alt={business.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        business.name.charAt(0)
                      )}
                    </div>

                    {/* Business Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{business.name}</h3>
                        <Badge className={getStatusColor(business.status)}>
                          {business.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {business.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span className="truncate">{business.website}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{business.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{business.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Active {business.lastActivity}</span>
                        </div>
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Reputation</p>
                          <p className={`font-semibold ${getReputationColor(business.reputationScore)}`}>
                            {business.reputationScore}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Equipment</p>
                          <p className="font-semibold">{business.totalEquipment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Customers</p>
                          <p className="font-semibold">{business.totalCustomers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="font-semibold">${(business.monthlyRevenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Google Reviews</p>
                          <p className="font-semibold">⭐ {business.webIntelligence.googleReviews}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sentiment</p>
                          <p className={`font-semibold capitalize ${getSentimentColor(business.webIntelligence.overallSentiment)}`}>
                            {business.webIntelligence.overallSentiment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/business/${business.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/business/${business.id}/dashboard`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open System
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('Platform Analytics feature coming soon! This will show detailed metrics across all businesses.')}>
            <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <h3 className="font-semibold mb-1">Platform Analytics</h3>
            <p className="text-sm text-gray-600">View detailed platform-wide metrics</p>
          </Card>
          
          <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('Reputation Monitor feature coming soon! This will track reputation changes across all businesses.')}>
            <Globe className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <h3 className="font-semibold mb-1">Reputation Monitor</h3>
            <p className="text-sm text-gray-600">Monitor all business reputations</p>
          </Card>
          
          <Card className="p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert('System Health feature coming soon! This will show platform status and maintenance info.')}>
            <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <h3 className="font-semibold mb-1">System Health</h3>
            <p className="text-sm text-gray-600">Platform status and maintenance</p>
          </Card>
        </div>
      </div>
    </div>
  )
}