import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'Business ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('equipment')
      .select('*', { count: 'exact' })
      .eq('business_id', businessId)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.textSearch('fts', search)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Equipment fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch equipment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      business_id,
      name,
      category,
      model,
      make,
      year,
      description,
      condition = 'good',
      status = 'available',
      location,
      daily_rate,
      weekly_rate,
      monthly_rate,
      deposit_amount,
      images = [],
      specifications = {},
      custom_fields = {}
    } = body

    if (!business_id || !name || !category || !daily_rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: business_id, name, category, daily_rate' },
        { status: 400 }
      )
    }

    const equipmentId = `eq_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`

    const { data, error } = await supabase
      .from('equipment')
      .insert([{
        id: equipmentId,
        business_id,
        name,
        category,
        model,
        make,
        year,
        description,
        condition,
        status,
        location,
        daily_rate: parseFloat(daily_rate),
        weekly_rate: weekly_rate ? parseFloat(weekly_rate) : null,
        monthly_rate: monthly_rate ? parseFloat(monthly_rate) : null,
        deposit_amount: deposit_amount ? parseFloat(deposit_amount) : null,
        images,
        specifications,
        custom_fields
      }])
      .select()
      .single()

    if (error) {
      console.error('Equipment creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create equipment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 })
  } catch (error) {
    console.error('Equipment creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}