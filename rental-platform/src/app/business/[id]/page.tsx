'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Users,
  TrendingUp,
  ExternalLink,
  Shield,
  Building2,
  Info
} from 'lucide-react'

interface BusinessDetails {
  id: string
  name: string
  type: string
  industry: string
  website: string
  email: string
  phone: string
  address: string
  description: string
  features: string[]
  branding: {
    primaryColor: string
    secondaryColor: string
    logoUrl?: string
  }
  confidence: number
  businessDetails: any
  reputationScore: number
  webIntelligence: any
  status: 'active' | 'setup' | 'inactive'
  createdAt: string
  updatedAt: string
}

export default function BusinessDetailsPage() {
  const params = useParams()
  const businessId = params.id as string
  
  const [business, setBusiness] = useState<BusinessDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBusiness() {
      try {
        const response = await fetch(`/api/business/${businessId}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setBusiness(result.data)
          } else {
            setError(result.error || 'Failed to load business')
          }
        } else {
          setError('Business not found')
        }
      } catch (err) {
        setError('Failed to load business details')
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      loadBusiness()
    }
  }, [businessId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'setup': return 'bg-yellow-100 text-yellow-800'  
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error || 'Business not found'}
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/master-admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Master Admin
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/master-admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Master Admin
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: business.branding.primaryColor }}
              >
                {business.branding.logoUrl ? (
                  <img src={business.branding.logoUrl} alt={business.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  business.name.charAt(0)
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getStatusColor(business.status)}>
                    {business.status}
                  </Badge>
                  <Badge variant="outline">
                    {business.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary">
                    {business.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-gray-600 max-w-2xl">{business.description}</p>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-4xl font-bold ${getReputationColor(business.reputationScore)}`}>
                {business.reputationScore}
              </div>
              <div className="text-sm text-gray-500">Reputation Score</div>
            </div>
          </div>
        </div>

        {/* Business Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {business.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{business.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{business.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{business.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Added {new Date(business.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Web Intelligence */}
          {business.webIntelligence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Web Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Reviews</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{business.webIntelligence.googleReviews?.rating || 'N/A'}</span>
                    <span className="text-xs text-gray-500">
                      ({business.webIntelligence.googleReviews?.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Facebook Followers</span>
                  <span>{business.webIntelligence.socialMedia?.facebook?.followers?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LinkedIn Connections</span>
                  <span>{business.webIntelligence.socialMedia?.linkedin?.connections?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Sentiment</span>
                  <Badge variant="outline" className="capitalize">
                    {business.webIntelligence.overallSentiment || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {business.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href={`/business/${business.id}/dashboard`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Business System
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Shield className="mr-2 h-4 w-4" />
            Update Settings
          </Button>
          <Button variant="outline" size="lg">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}