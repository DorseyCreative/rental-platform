import { NextResponse } from 'next/server'
import { getAllBusinesses, getBusinessStats } from '@/lib/simple-db'

export async function GET() {
  try {
    const businesses = await getAllBusinesses()
    const stats = await getBusinessStats()
    
    return NextResponse.json({
      success: true,
      data: {
        businesses,
        stats
      }
    })
  } catch (error) {
    console.error('Failed to fetch businesses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}