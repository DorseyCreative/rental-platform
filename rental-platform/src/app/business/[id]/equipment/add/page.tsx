'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import BusinessNavigation from '@/components/BusinessNavigation'
import { 
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  MapPin,
  Info,
  Plus,
  X
} from 'lucide-react'

interface Business {
  id: string
  name: string
  branding: {
    primaryColor: string
  }
}

interface EquipmentFormData {
  name: string
  category: string
  model: string
  serialNumber: string
  dailyRate: string
  weeklyRate: string
  monthlyRate: string
  status: 'available' | 'rented' | 'maintenance' | 'inactive'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  location: string
  description: string
  specifications: { key: string; value: string }[]
}

export default function AddEquipmentPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    category: '',
    model: '',
    serialNumber: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    status: 'available',
    condition: 'excellent',
    location: '',
    description: '',
    specifications: [{ key: '', value: '' }]
  })

  const categories = [
    'Heavy Machinery',
    'Material Handling',
    'Power Equipment',
    'Construction Tools',
    'Vehicles',
    'Safety Equipment',
    'Other'
  ]

  useEffect(() => {
    async function loadBusiness() {
      try {
        const response = await fetch(`/api/business/${businessId}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setBusiness(result.data)
          }
        }
      } catch (error) {
        console.error('Failed to load business:', error)
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      loadBusiness()
    }
  }, [businessId])

  const handleInputChange = (field: keyof EquipmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }))
  }

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }))
  }

  const removeSpecification = (index: number) => {
    if (formData.specifications.length > 1) {
      setFormData(prev => ({
        ...prev,
        specifications: prev.specifications.filter((_, i) => i !== index)
      }))
    }
  }

  const calculateRates = (dailyRate: string) => {
    const daily = parseFloat(dailyRate) || 0
    const weekly = Math.round(daily * 5.5) // 10% discount for weekly
    const monthly = Math.round(daily * 20) // 30% discount for monthly
    
    setFormData(prev => ({
      ...prev,
      dailyRate,
      weeklyRate: weekly.toString(),
      monthlyRate: monthly.toString()
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.model || !formData.dailyRate) {
        alert('Please fill in all required fields')
        return
      }

      // Simulate API call to save equipment
      const equipmentData = {
        ...formData,
        dailyRate: parseFloat(formData.dailyRate),
        weeklyRate: parseFloat(formData.weeklyRate),
        monthlyRate: parseFloat(formData.monthlyRate),
        specifications: Object.fromEntries(
          formData.specifications
            .filter(spec => spec.key && spec.value)
            .map(spec => [spec.key, spec.value])
        ),
        businessId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: `eq_${Date.now()}` // Generate temporary ID
      }

      console.log('Saving equipment:', equipmentData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Equipment added successfully!')
      router.push(`/business/${businessId}/equipment`)
    } catch (error) {
      console.error('Failed to save equipment:', error)
      alert('Failed to save equipment. Please try again.')
    } finally {
      setSaving(false)
    }
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
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
      
      <div className="flex-1 md:ml-80 min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-4">
              <Link href={`/business/${businessId}/equipment`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Equipment
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Add New Equipment</h1>
            <p className="text-gray-600">Add a new piece of equipment to your rental inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Excavator CAT 320"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select 
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g., CAT 320D2L"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="e.g., CAT320-2023-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select 
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <select 
                      id="condition"
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Yard A - Bay 3"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the equipment..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Rental Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      step="0.01"
                      value={formData.dailyRate}
                      onChange={(e) => calculateRates(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                    <Input
                      id="weeklyRate"
                      type="number"
                      step="0.01"
                      value={formData.weeklyRate}
                      onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyRate">Monthly Rate ($)</Label>
                    <Input
                      id="monthlyRate"
                      type="number"
                      step="0.01"
                      value={formData.monthlyRate}
                      onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Weekly and monthly rates are automatically calculated with discounts when you enter the daily rate.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Specification Name</Label>
                      <Input
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        placeholder="e.g., Operating Weight"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Value</Label>
                      <Input
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="e.g., 20,500 kg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                      disabled={formData.specifications.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Specification
                </Button>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href={`/business/${businessId}/equipment`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Equipment
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}