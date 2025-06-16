'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Package, 
  CreditCard, 
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ShoppingCart
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  category: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  available: boolean
  image: string
  description: string
  specifications: Record<string, string>
}

const mockEquipment: Equipment[] = [
  {
    id: 'eq_001',
    name: 'CAT 320 Excavator',
    category: 'Excavators',
    dailyRate: 850,
    weeklyRate: 4250,
    monthlyRate: 15300,
    available: true,
    image: '/api/placeholder/300/200',
    description: '20-ton excavator perfect for medium construction projects',
    specifications: {
      'Operating Weight': '20,000 lbs',
      'Engine Power': '153 HP',
      'Dig Depth': '21.3 ft',
      'Bucket Capacity': '1.2 cu yd'
    }
  },
  {
    id: 'eq_002', 
    name: 'JCB 3CX Backhoe',
    category: 'Backhoes',
    dailyRate: 450,
    weeklyRate: 2250,
    monthlyRate: 8100,
    available: true,
    image: '/api/placeholder/300/200',
    description: 'Versatile backhoe loader for digging and material handling',
    specifications: {
      'Operating Weight': '18,500 lbs',
      'Engine Power': '109 HP',
      'Dig Depth': '18.4 ft',
      'Loader Capacity': '1.2 cu yd'
    }
  }
]

export default function CustomerPortalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<string[]>([])
  const [rentalPeriod, setRentalPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (equipmentId: string) => {
    setCart([...cart, equipmentId])
  }

  const removeFromCart = (equipmentId: string) => {
    setCart(cart.filter(id => id !== equipmentId))
  }

  const getPrice = (item: Equipment) => {
    switch (rentalPeriod) {
      case 'daily': return item.dailyRate
      case 'weekly': return item.weeklyRate
      case 'monthly': return item.monthlyRate
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, cartItemId) => {
      const item = mockEquipment.find(eq => eq.id === cartItemId)
      return total + (item ? getPrice(item) : 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Equipment Rental Portal</h1>
              <p className="text-gray-600">ABC Equipment Rentals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                )}
              </div>
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Equipment</TabsTrigger>
            <TabsTrigger value="quote">Get Quote</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Equipment</CardTitle>
                <CardDescription>Search our inventory and add items to your quote</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Equipment</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, model, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="period">Rental Period</Label>
                    <select 
                      id="period"
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value as any)}
                      className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20" />
                    <div className="absolute bottom-2 left-2">
                      {item.available ? (
                        <Badge className="bg-green-500">Available</Badge>
                      ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">
                            ${getPrice(item).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            per {rentalPeriod === 'daily' ? 'day' : rentalPeriod === 'weekly' ? 'week' : 'month'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {cart.includes(item.id) ? (
                          <Button 
                            variant="outline" 
                            onClick={() => removeFromCart(item.id)}
                            className="w-full"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Added to Quote
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => addToCart(item.id)}
                            disabled={!item.available}
                            className="w-full"
                          >
                            Add to Quote
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quote Summary */}
            {cart.length > 0 && (
              <Card className="sticky bottom-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cart.length} items in quote</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${getTotalPrice().toLocaleString()} per {rentalPeriod === 'daily' ? 'day' : rentalPeriod === 'weekly' ? 'week' : 'month'}
                      </p>
                    </div>
                    <Button size="lg">
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quote">
            <Card>
              <CardHeader>
                <CardTitle>Request Quote</CardTitle>
                <CardDescription>Get pricing for your selected equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input type="date" id="startDate" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input type="date" id="endDate" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input placeholder="Enter delivery address" id="deliveryAddress" />
                  </div>
                  <div>
                    <Label htmlFor="notes">Special Requirements</Label>
                    <textarea 
                      className="w-full p-3 border rounded-md"
                      rows={3}
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                  <Button className="w-full" size="lg">
                    Submit Quote Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your current rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  No bookings found. Start browsing equipment to create your first rental.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="john@company.com" />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Company Name" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}