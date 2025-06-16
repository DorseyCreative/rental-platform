import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')
    const customerId = searchParams.get('customer_id')
    const equipmentId = searchParams.get('equipment_id')
    const status = searchParams.get('status')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
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
      .from('rentals')
      .select(`
        *,
        customer:customers(id, name, email, company),
        equipment:equipment(id, name, category, daily_rate)
      `, { count: 'exact' })
      .eq('business_id', businessId)

    // Apply filters
    if (customerId) {
      query = query.eq('customer_id', customerId)
    }
    if (equipmentId) {
      query = query.eq('equipment_id', equipmentId)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (startDate) {
      query = query.gte('start_date', startDate)
    }
    if (endDate) {
      query = query.lte('end_date', endDate)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Rentals fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch rentals' },
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
    console.error('Rentals API error:', error)
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
      customer_id,
      equipment_id,
      start_date,
      end_date,
      daily_rate,
      deposit,
      delivery_required = false,
      delivery_address,
      delivery_fee = 0,
      pickup_required = false,
      pickup_fee = 0,
      notes,
      terms_accepted = false
    } = body

    if (!business_id || !customer_id || !equipment_id || !start_date || !end_date || !daily_rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate equipment availability
    const { data: conflictingRentals } = await supabase
      .from('rentals')
      .select('id')
      .eq('equipment_id', equipment_id)
      .in('status', ['active', 'reserved'])
      .or(`and(start_date.lte.${end_date},end_date.gte.${start_date})`)

    if (conflictingRentals && conflictingRentals.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Equipment is not available for the selected dates' },
        { status: 400 }
      )
    }

    // Calculate rental details
    const startDateTime = new Date(start_date)
    const endDateTime = new Date(end_date)
    const totalDays = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = totalDays * parseFloat(daily_rate)
    const taxAmount = subtotal * 0.08 // 8% tax
    const totalAmount = subtotal + taxAmount + parseFloat(delivery_fee) + parseFloat(pickup_fee)

    const rentalId = `rent_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    const rentalNumber = `R${Date.now().toString().slice(-6)}`

    const { data, error } = await supabase
      .from('rentals')
      .insert([{
        id: rentalId,
        business_id,
        customer_id,
        equipment_id,
        rental_number,
        start_date,
        end_date,
        daily_rate: parseFloat(daily_rate),
        total_days: totalDays,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        deposit: parseFloat(deposit),
        status: 'reserved',
        delivery_required,
        delivery_address,
        delivery_fee: parseFloat(delivery_fee),
        pickup_required,
        pickup_fee: parseFloat(pickup_fee),
        notes,
        terms_accepted
      }])
      .select(`
        *,
        customer:customers(id, name, email),
        equipment:equipment(id, name, category)
      `)
      .single()

    if (error) {
      console.error('Rental creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create rental' },
        { status: 500 }
      )
    }

    // Update equipment status
    await supabase
      .from('equipment')
      .update({ status: 'rented' })
      .eq('id', equipment_id)

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 })
  } catch (error) {
    console.error('Rental creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}