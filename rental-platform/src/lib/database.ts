import { supabase, type Business, type Equipment, type Customer, type Rental } from './supabase'

// Cloud Database Service - replaces simple-db with real persistence

export async function storeBusiness(businessData: any): Promise<string> {
  try {
    const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const business: Omit<Business, 'created_at' | 'updated_at'> = {
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
      status: 'setup'
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert([business])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      console.log('📦 Falling back to temporary file storage')
      // Fallback to temporary file storage
      const { storeBusiness: storeTemp } = await import('./temp-storage')
      return await storeTemp(businessData)
    }

    console.log(`✅ Business stored in cloud database: ${business.name} with ID: ${businessId}`)
    
    // Create some sample data for the new business
    await createSampleData(businessId, businessData.type)
    
    return businessId
  } catch (error) {
    console.error('Database error:', error)
    console.log('📦 Falling back to temporary file storage')
    // Fallback to temporary file storage
    const { storeBusiness: storeTemp } = await import('./temp-storage')
    return await storeTemp(businessData)
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching business:', error)
      // Fallback to temporary file storage
      const { getBusinessById: getTemp } = await import('./temp-storage')
      return await getTemp(id)
    }

    return data
  } catch (error) {
    console.error('Database connection error:', error)
    // Fallback to temporary file storage
    const { getBusinessById: getTemp } = await import('./temp-storage')
    return await getTemp(id)
  }
}

export async function getBusinessStats(businessId: string) {
  try {
    // Get real counts from database
    const [equipmentResult, customerResult, rentalResult] = await Promise.all([
      supabase.from('equipment').select('*', { count: 'exact' }).eq('business_id', businessId),
      supabase.from('customers').select('*', { count: 'exact' }).eq('business_id', businessId),
      supabase.from('rentals').select('*', { count: 'exact' }).eq('business_id', businessId)
    ])

    // Calculate revenue from active rentals
    const { data: activeRentals } = await supabase
      .from('rentals')
      .select('total_amount')
      .eq('business_id', businessId)
      .in('status', ['active', 'reserved'])

    const totalRevenue = activeRentals?.reduce((sum, rental) => sum + (rental.total_amount || 0), 0) || 0

    return {
      totalEquipment: equipmentResult.count || 0,
      totalCustomers: customerResult.count || 0,
      activeRentals: rentalResult.count || 0,
      totalRevenue,
      availableEquipment: equipmentResult.data?.filter(e => e.status === 'available').length || 0,
      maintenanceEquipment: equipmentResult.data?.filter(e => e.status === 'maintenance').length || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Fallback to temporary file storage
    const { getBusinessStats: getStatsTemp } = await import('./temp-storage')
    return await getStatsTemp(businessId)
  }
}

export async function getAllBusinesses(): Promise<Business[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function updateBusinessStatus(id: string, status: 'active' | 'setup' | 'inactive'): Promise<void> {
  try {
    const { error } = await supabase
      .from('businesses')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating business status:', error)
  }
}

// Sample data creation for new businesses
async function createSampleData(businessId: string, businessType: string) {
  try {
    // Create sample equipment based on business type
    const sampleEquipment = getSampleEquipment(businessId, businessType)
    const sampleCustomers = getSampleCustomers(businessId)
    
    await Promise.all([
      supabase.from('equipment').insert(sampleEquipment),
      supabase.from('customers').insert(sampleCustomers)
    ])

    // Create some sample rentals
    const sampleRentals = getSampleRentals(businessId, sampleEquipment.slice(0, 3))
    await supabase.from('rentals').insert(sampleRentals)

    console.log(`✅ Created sample data for business ${businessId}`)
  } catch (error) {
    console.error('Error creating sample data:', error)
  }
}

function getSampleEquipment(businessId: string, businessType: string): Omit<Equipment, 'created_at' | 'updated_at'>[] {
  const baseEquipment = {
    business_id: businessId,
    condition: 'good' as const,
    status: 'available' as const
  }

  switch (businessType) {
    case 'heavy_equipment':
      return [
        { ...baseEquipment, id: `eq_${Date.now()}_1`, name: 'CAT 320 Excavator', category: 'Excavators', model: '320GC', daily_rate: 450, weekly_rate: 2700, monthly_rate: 10800 },
        { ...baseEquipment, id: `eq_${Date.now()}_2`, name: 'John Deere Skid Steer', category: 'Skid Steers', model: '332G', daily_rate: 280, weekly_rate: 1680, monthly_rate: 6720 },
        { ...baseEquipment, id: `eq_${Date.now()}_3`, name: 'Bobcat Mini Excavator', category: 'Mini Excavators', model: 'E35', daily_rate: 320, weekly_rate: 1920, monthly_rate: 7680 },
        { ...baseEquipment, id: `eq_${Date.now()}_4`, name: 'CAT Bulldozer', category: 'Bulldozers', model: 'D6T', daily_rate: 850, weekly_rate: 5100, monthly_rate: 20400, status: 'rented' as const },
        { ...baseEquipment, id: `eq_${Date.now()}_5`, name: 'Liebherr Crane', category: 'Cranes', model: 'LTM 1090', daily_rate: 1200, weekly_rate: 7200, monthly_rate: 28800 }
      ]
    case 'party_rental':
      return [
        { ...baseEquipment, id: `eq_${Date.now()}_1`, name: '20x30 White Tent', category: 'Tents', model: 'Premium', daily_rate: 150, weekly_rate: 900, monthly_rate: 3600 },
        { ...baseEquipment, id: `eq_${Date.now()}_2`, name: 'Round Tables (10)', category: 'Tables', model: '60 inch', daily_rate: 80, weekly_rate: 480, monthly_rate: 1920 },
        { ...baseEquipment, id: `eq_${Date.now()}_3`, name: 'Chiavari Chairs (100)', category: 'Chairs', model: 'Gold', daily_rate: 200, weekly_rate: 1200, monthly_rate: 4800 },
        { ...baseEquipment, id: `eq_${Date.now()}_4`, name: 'Dance Floor 20x20', category: 'Flooring', model: 'Black/White', daily_rate: 300, weekly_rate: 1800, monthly_rate: 7200, status: 'rented' as const }
      ]
    default:
      return [
        { ...baseEquipment, id: `eq_${Date.now()}_1`, name: 'Power Drill Set', category: 'Tools', model: 'Professional', daily_rate: 25, weekly_rate: 150, monthly_rate: 600 },
        { ...baseEquipment, id: `eq_${Date.now()}_2`, name: 'Generator 5000W', category: 'Generators', model: 'Portable', daily_rate: 75, weekly_rate: 450, monthly_rate: 1800 },
        { ...baseEquipment, id: `eq_${Date.now()}_3`, name: 'Pressure Washer', category: 'Cleaning', model: 'Commercial', daily_rate: 60, weekly_rate: 360, monthly_rate: 1440 }
      ]
  }
}

function getSampleCustomers(businessId: string): Omit<Customer, 'created_at' | 'updated_at'>[] {
  return [
    {
      id: `cust_${Date.now()}_1`,
      business_id: businessId,
      name: 'ABC Construction Co.',
      email: 'contact@abcconstruction.com',
      phone: '(555) 123-4567',
      address: '123 Builder St, Construction City, ST 12345',
      company: 'ABC Construction Co.',
      status: 'active'
    },
    {
      id: `cust_${Date.now()}_2`,
      business_id: businessId,
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '(555) 987-6543',
      address: '456 Home Ave, Suburb, ST 12346',
      status: 'active'
    },
    {
      id: `cust_${Date.now()}_3`,
      business_id: businessId,
      name: 'XYZ Landscaping',
      email: 'info@xyzlandscape.com',
      phone: '(555) 456-7890',
      address: '789 Garden Rd, Green City, ST 12347',
      company: 'XYZ Landscaping',
      status: 'active'
    }
  ]
}

function getSampleRentals(businessId: string, equipment: any[]): Omit<Rental, 'created_at' | 'updated_at'>[] {
  const now = new Date()
  return [
    {
      id: `rent_${Date.now()}_1`,
      business_id: businessId,
      customer_id: `cust_${Date.now()}_1`,
      equipment_id: equipment[0]?.id || 'eq_1',
      start_date: now.toISOString(),
      end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      daily_rate: equipment[0]?.daily_rate || 100,
      total_amount: (equipment[0]?.daily_rate || 100) * 7,
      deposit: (equipment[0]?.daily_rate || 100) * 2,
      status: 'active'
    },
    {
      id: `rent_${Date.now()}_2`,
      business_id: businessId,
      customer_id: `cust_${Date.now()}_2`,
      equipment_id: equipment[1]?.id || 'eq_2',
      start_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      daily_rate: equipment[1]?.daily_rate || 80,
      total_amount: (equipment[1]?.daily_rate || 80) * 3,
      deposit: (equipment[1]?.daily_rate || 80) * 1.5,
      status: 'reserved'
    }
  ]
}

function createDemoBusinessData(id: string): Business {
  return {
    id,
    name: 'Demo Business',
    type: 'heavy_equipment',
    industry: 'Construction Equipment Rental',
    website: 'https://demo.com',
    email: 'demo@business.com',
    phone: '+1-555-DEMO',
    address: 'Demo Address',
    description: 'Demo business for testing',
    features: ['GPS Tracking', 'Maintenance'],
    branding: { primaryColor: '#FF6600', secondaryColor: '#003366' },
    confidence: 75,
    business_details: {},
    reputation_score: 82,
    web_intelligence: {},
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

function createDemoStats(businessType: string) {
  const baseStats = {
    heavy_equipment: { equipment: 25, customers: 45, rentals: 12, revenue: 67500 },
    party_rental: { equipment: 180, customers: 89, rentals: 23, revenue: 45200 },
    car_rental: { equipment: 35, customers: 156, rentals: 28, revenue: 89300 },
    tool_rental: { equipment: 95, customers: 67, rentals: 18, revenue: 23400 },
    custom: { equipment: 42, customers: 78, rentals: 15, revenue: 34500 }
  }

  const stats = baseStats[businessType as keyof typeof baseStats] || baseStats.custom
  return {
    totalEquipment: stats.equipment,
    totalCustomers: stats.customers,
    activeRentals: stats.rentals,
    totalRevenue: stats.revenue,
    availableEquipment: Math.floor(stats.equipment * 0.7),
    maintenanceEquipment: Math.floor(stats.equipment * 0.1)
  }
}