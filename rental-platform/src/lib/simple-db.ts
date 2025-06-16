// Simple in-memory database for now (will upgrade to persistent later)
interface StoredBusiness {
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

// In-memory storage (will be replaced with real database)
let businesses: StoredBusiness[] = []

export async function storeBusiness(businessData: any): Promise<string> {
  const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const storedBusiness: StoredBusiness = {
    id: businessId,
    name: businessData.name,
    type: businessData.type,
    industry: businessData.industry,
    website: businessData.website || '',
    email: businessData.email,
    phone: businessData.phone,
    address: businessData.address,
    description: businessData.description,
    features: businessData.features || [],
    branding: businessData.branding || {},
    confidence: businessData.confidence || 50,
    businessDetails: businessData.businessDetails || {},
    reputationScore: businessData.webIntelligence?.reputationScore || 0,
    webIntelligence: businessData.webIntelligence || {},
    status: 'setup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  businesses.push(storedBusiness)
  console.log(`✅ Stored business: ${businessData.name} with ID: ${businessId}`)
  return businessId
}

export async function getAllBusinesses(): Promise<StoredBusiness[]> {
  // Add some default demo data if empty
  if (businesses.length === 0) {
    businesses = [
      {
        id: 'demo_biz_001',
        name: 'Demo Heavy Equipment',
        type: 'heavy_equipment',
        industry: 'Construction Equipment Rental',
        website: 'https://example.com',
        email: 'demo@example.com',
        phone: '+1-555-DEMO-01',
        address: '123 Demo St, Demo City',
        description: 'Demo heavy equipment rental business',
        features: ['GPS Tracking', 'Delivery Services'],
        branding: { primaryColor: '#FF6600', secondaryColor: '#003366' },
        confidence: 85,
        businessDetails: { specialties: ['Excavators', 'Bulldozers'] },
        reputationScore: 78,
        webIntelligence: {
          googleReviews: { rating: 4.2, reviewCount: 89 },
          socialMedia: { facebook: { followers: 1234 } },
          overallSentiment: 'positive'
        },
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ]
  }

  return businesses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getBusinessById(id: string): Promise<StoredBusiness | null> {
  return businesses.find(b => b.id === id) || null
}

export async function updateBusinessStatus(id: string, status: 'active' | 'setup' | 'inactive'): Promise<void> {
  const business = businesses.find(b => b.id === id)
  if (business) {
    business.status = status
    business.updatedAt = new Date().toISOString()
  }
}

export async function getBusinessStats() {
  const allBusinesses = await getAllBusinesses()
  return {
    total: allBusinesses.length,
    active: allBusinesses.filter(b => b.status === 'active').length,
    totalRevenue: allBusinesses.length * 45000, // Demo calculation
    avgReputation: allBusinesses.reduce((sum, b) => sum + b.reputationScore, 0) / allBusinesses.length
  }
}