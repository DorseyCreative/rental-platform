'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  Users,
  Package,
  FileText,
  Settings,
  DollarSign,
  Calendar,
  Truck
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  category: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
  status: 'available' | 'rented' | 'maintenance'
  serialNumber: string
}

interface Customer {
  id: string
  companyName?: string
  contactName: string
  email: string
  phone: string
  address: string
  creditLimit: number
  paymentTerms: string
}

interface Order {
  id: string
  customerName: string
  equipment: string[]
  startDate: string
  endDate: string
  totalAmount: number
  status: 'draft' | 'confirmed' | 'active' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'overdue'
}

const mockEquipment: Equipment[] = [
  {
    id: 'eq_001',
    name: 'CAT 320 Excavator',
    category: 'Excavators',
    dailyRate: 850,
    weeklyRate: 4250,
    monthlyRate: 15300,
    status: 'available',
    serialNumber: 'CAT320-2023-001'
  },
  {
    id: 'eq_002',
    name: 'Bobcat S650 Skid Steer',
    category: 'Skid Steers',
    dailyRate: 285,
    weeklyRate: 1425,
    monthlyRate: 5130,
    status: 'rented',
    serialNumber: 'BOB650-2023-002'
  }
]

const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    companyName: 'ABC Construction LLC',
    contactName: 'Mike Johnson',
    email: 'mike@abcconstruction.com',
    phone: '920-555-0101',
    address: '1245 Construction Way, Appleton, WI 54915',
    creditLimit: 25000,
    paymentTerms: 'net_30'
  },
  {
    id: 'cust_002',
    contactName: 'Sarah Smith',
    email: 'sarah@email.com',
    phone: '920-555-0202',
    address: '567 Builder St, Green Bay, WI 54301',
    creditLimit: 5000,
    paymentTerms: 'prepaid'
  }
]

const mockOrders: Order[] = [
  {
    id: 'ord_001',
    customerName: 'ABC Construction LLC',
    equipment: ['CAT 320 Excavator', 'Safety Equipment'],
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    totalAmount: 5950,
    status: 'active',
    paymentStatus: 'paid'
  },
  {
    id: 'ord_002',
    customerName: 'Sarah Smith',
    equipment: ['Bobcat S650 Skid Steer'],
    startDate: '2024-06-18',
    endDate: '2024-06-25',
    totalAmount: 1995,
    status: 'confirmed',
    paymentStatus: 'pending'
  }
]

export default function AdminPortalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showImportDialog, setShowImportDialog] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Business Admin Portal</h1>
              <p className="text-gray-600">Grand Rental Station</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={() => setShowImportDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Equipment</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">$48,520</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="equipment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Equipment Management</CardTitle>
                    <CardDescription>Manage your rental equipment inventory</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Equipment
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search equipment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Equipment</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Daily Rate</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Serial Number</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEquipment.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4">${item.dailyRate}/day</td>
                          <td className="py-3 px-4">
                            <Badge variant={item.status === 'available' ? 'default' : 
                                          item.status === 'rented' ? 'secondary' : 'destructive'}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.serialNumber}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>Manage your customer database</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Contact</th>
                        <th className="text-left py-3 px-4">Credit Limit</th>
                        <th className="text-left py-3 px-4">Payment Terms</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{customer.companyName || customer.contactName}</p>
                              {customer.companyName && (
                                <p className="text-sm text-gray-600">{customer.contactName}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm">{customer.email}</p>
                              <p className="text-sm text-gray-600">{customer.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">${customer.creditLimit.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{customer.paymentTerms}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Manage rental orders and invoices</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Order ID</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Dates</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Payment</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.equipment.join(', ')}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p>{order.startDate}</p>
                              <p className="text-gray-600">to {order.endDate}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">${order.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={order.status === 'active' ? 'default' : 
                                          order.status === 'completed' ? 'secondary' : 'outline'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 
                                          order.paymentStatus === 'overdue' ? 'destructive' : 'outline'}>
                              {order.paymentStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>Configure your business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue="Grand Rental Station" />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input id="businessEmail" defaultValue="grs@new.rr.com" />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input id="businessPhone" defaultValue="920-968-1360" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Integration</CardTitle>
                  <CardDescription>Configure payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                    <Input id="stripeKey" placeholder="pk_test_..." />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="5.5" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="depositPercent">Default Deposit (%)</Label>
                    <Input id="depositPercent" type="number" defaultValue="20" />
                  </div>
                  <Button>Update Payment Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Import equipment, customers, or inventory from CSV, Excel, or Google Sheets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="importType">Data Type</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="equipment">Equipment</option>
                <option value="customers">Customers</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
            <div>
              <Label htmlFor="importSource">Source</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="csv">CSV File</option>
                <option value="excel">Excel File</option>
                <option value="google_sheets">Google Sheets</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fileUpload">File Upload</Label>
              <Input id="fileUpload" type="file" accept=".csv,.xlsx,.xls" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Import Data</Button>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}