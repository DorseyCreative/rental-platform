'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GoogleMapsRoute from '@/components/GoogleMapsRoute'
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Camera,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Package,
  FileSignature,
  Upload,
  Route
} from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'

interface Delivery {
  id: string
  customer: string
  address: string
  phone: string
  items: string[]
  timeWindow: string
  status: 'pending' | 'in_transit' | 'completed'
  type: 'delivery' | 'pickup'
  notes?: string
}

const mockDeliveries: Delivery[] = [
  {
    id: 'D001',
    customer: 'ABC Construction',
    address: '123 Industrial Way, Construction City, ST 12345',
    phone: '+1-555-123-4567',
    items: ['CAT 320 Excavator', 'Safety Equipment'],
    timeWindow: '9:00 AM - 11:00 AM',
    status: 'pending',
    type: 'delivery'
  },
  {
    id: 'P001',
    customer: 'Smith Builders',
    address: '456 Building Ave, Builder Town, ST 67890',
    phone: '+1-555-987-6543',
    items: ['JCB Loader'],
    timeWindow: '2:00 PM - 4:00 PM',
    status: 'pending',
    type: 'pickup',
    notes: 'Check fuel level and inspect for damage'
  }
]

export default function DriverPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showSignature, setShowSignature] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'schedule' | 'route'>('schedule')
  const signatureRef = useRef<SignatureCanvas>(null)

  // Convert deliveries to route stops for Google Maps
  const routeStops = mockDeliveries.map(delivery => ({
    id: delivery.id,
    address: delivery.address,
    customerName: delivery.customer,
    equipment: delivery.items.join(', '),
    type: delivery.type,
    timeWindow: delivery.timeWindow,
  }))

  const handleStartDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    // Update status to in_transit
  }

  const handleCompleteDelivery = () => {
    setShowSignature(true)
  }

  const handleSignatureComplete = () => {
    // Save signature and complete delivery
    setShowSignature(false)
    setSelectedDelivery(null)
  }

  const handlePhotoCapture = () => {
    // In a real app, this would use the camera API
    const mockPhotoUrl = `/api/placeholder/400/300`
    setPhotos([...photos, mockPhotoUrl])
  }

  if (showSignature) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Customer Signature
            </CardTitle>
            <CardDescription>
              Please have the customer sign below to confirm {selectedDelivery?.type}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 300,
                  height: 200,
                  className: 'signature-canvas border rounded'
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => signatureRef.current?.clear()}
                className="flex-1"
              >
                Clear
              </Button>
              <Button 
                onClick={handleSignatureComplete}
                className="flex-1"
              >
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedDelivery) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Current Delivery Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedDelivery.customer}</CardTitle>
                <Badge variant={selectedDelivery.type === 'delivery' ? 'default' : 'secondary'}>
                  {selectedDelivery.type}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedDelivery.timeWindow}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Address & Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedDelivery.address}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {selectedDelivery.phone}
                    </p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <Navigation className="mr-2 h-4 w-4" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedDelivery.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              {selectedDelivery.notes && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {selectedDelivery.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handlePhotoCapture}
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDelivery(null)}
              className="flex-1"
            >
              Back to Schedule
            </Button>
            <Button 
              onClick={handleCompleteDelivery}
              className="flex-1"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Driver Dashboard</h1>
            <p className="text-sm text-gray-600">2 deliveries scheduled</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">John Driver</p>
            <p className="text-xs text-gray-500">Truck #4</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t mt-3">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4 inline mr-1" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'route'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Route className="h-4 w-4 inline mr-1" />
            Route
          </button>
        </div>
      </header>

      {/* Tab Content */}
      <main className="p-4 space-y-3">
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            {mockDeliveries.map((delivery) => (
          <Card key={delivery.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{delivery.customer}</h3>
                    <Badge variant={delivery.type === 'delivery' ? 'default' : 'secondary'}>
                      {delivery.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {delivery.timeWindow}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {delivery.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {delivery.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleStartDelivery(delivery)}
                    >
                      <Truck className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  )}
                  {delivery.status === 'completed' && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {delivery.items.join(' • ')}
              </div>
              
              {delivery.notes && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {delivery.notes}
                </div>
              )}
            </CardContent>
          </Card>
            ))}
          </div>
        )}

        {activeTab === 'route' && (
          <GoogleMapsRoute 
            stops={routeStops}
            onRouteOptimized={(optimizedStops) => {
              console.log('Route optimized:', optimizedStops)
              // In a real app, update the delivery order based on optimization
            }}
          />
        )}
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <Button variant="outline" className="flex-1">
            Emergency Contact
          </Button>
          <Button variant="outline" className="flex-1">
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  )
}