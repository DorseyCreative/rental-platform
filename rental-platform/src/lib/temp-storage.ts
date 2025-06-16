import { promises as fs } from 'fs'
import path from 'path'
import { Business } from './supabase'

// Temporary file-based storage for immediate demo functionality
// This will be replaced with cloud database once set up

const DATA_DIR = path.join(process.cwd(), 'temp-data')
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

export async function storeBusiness(businessData: any): Promise<string> {
  await ensureDataDir()
  
  const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const business: Business = {
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
    business_details: businessData.businessDetails || {},
    reputation_score: businessData.webIntelligence?.reputationScore || 0,
    web_intelligence: businessData.webIntelligence || {},
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  try {
    // Read existing businesses
    let businesses: Business[] = []
    try {
      const data = await fs.readFile(BUSINESSES_FILE, 'utf-8')
      businesses = JSON.parse(data)
    } catch (error) {
      // File doesn't exist or is empty
    }

    // Add new business
    businesses.push(business)

    // Write back to file
    await fs.writeFile(BUSINESSES_FILE, JSON.stringify(businesses, null, 2))
    
    console.log(`💾 Business stored in temp storage: ${business.name} with ID: ${businessId}`)
    return businessId
  } catch (error) {
    console.error('Failed to store business:', error)
    throw error
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  await ensureDataDir()
  
  try {
    const data = await fs.readFile(BUSINESSES_FILE, 'utf-8')
    const businesses: Business[] = JSON.parse(data)
    return businesses.find(b => b.id === id) || null
  } catch (error) {
    console.error('Failed to read businesses:', error)
    return null
  }
}

export async function getBusinessStats(businessId: string) {
  // Return realistic stats based on business type
  const business = await getBusinessById(businessId)
  
  if (!business) {
    return {
      totalEquipment: 0,
      totalCustomers: 0,
      activeRentals: 0,
      totalRevenue: 0,
      availableEquipment: 0,
      maintenanceEquipment: 0
    }
  }

  // Generate realistic stats based on business type and reputation
  const baseMultiplier = Math.max(business.reputation_score / 100, 0.5)
  
  const typeStats = {
    heavy_equipment: { 
      equipment: Math.round(25 * baseMultiplier), 
      customers: Math.round(45 * baseMultiplier), 
      rentals: Math.round(12 * baseMultiplier), 
      revenue: Math.round(67500 * baseMultiplier) 
    },
    party_rental: { 
      equipment: Math.round(180 * baseMultiplier), 
      customers: Math.round(89 * baseMultiplier), 
      rentals: Math.round(23 * baseMultiplier), 
      revenue: Math.round(45200 * baseMultiplier) 
    },
    car_rental: { 
      equipment: Math.round(35 * baseMultiplier), 
      customers: Math.round(156 * baseMultiplier), 
      rentals: Math.round(28 * baseMultiplier), 
      revenue: Math.round(89300 * baseMultiplier) 
    },
    tool_rental: { 
      equipment: Math.round(95 * baseMultiplier), 
      customers: Math.round(67 * baseMultiplier), 
      rentals: Math.round(18 * baseMultiplier), 
      revenue: Math.round(23400 * baseMultiplier) 
    },
    custom: { 
      equipment: Math.round(42 * baseMultiplier), 
      customers: Math.round(78 * baseMultiplier), 
      rentals: Math.round(15 * baseMultiplier), 
      revenue: Math.round(34500 * baseMultiplier) 
    }
  }

  const stats = typeStats[business.type as keyof typeof typeStats] || typeStats.custom

  return {
    totalEquipment: stats.equipment,
    totalCustomers: stats.customers,
    activeRentals: stats.rentals,
    totalRevenue: stats.revenue,
    availableEquipment: Math.floor(stats.equipment * 0.7),
    maintenanceEquipment: Math.floor(stats.equipment * 0.1)
  }
}