import { NextResponse } from 'next/server'
import { getBusinessById, getBusinessStats } from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      )
    }

    console.log(`📊 Fetching business data for ID: ${id}`)

    // Get business data and stats
    const [business, stats] = await Promise.all([
      getBusinessById(id),
      getBusinessStats(id)
    ])

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      )
    }

    const responseData = {
      business,
      stats,
      lastUpdated: new Date().toISOString()
    }

    console.log(`✅ Business data retrieved for ${business.name}`)
    console.log(`📈 Stats: ${stats.totalEquipment} equipment, ${stats.totalCustomers} customers, ${stats.activeRentals} rentals`)

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Error fetching business data:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business data' },
      { status: 500 }
    )
  }
}