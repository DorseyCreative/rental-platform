import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')
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
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('business_id', businessId)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%, email.ilike.%${search}%, company.ilike.%${search}%`)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Customers fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch customers' },
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
    console.error('Customers API error:', error)
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
      email,
      phone,
      address,
      company,
      tax_id,
      driver_license,
      emergency_contact = {},
      billing_address,
      payment_methods = [],
      credit_limit = 0,
      status = 'active',
      notes,
      custom_fields = {}
    } = body

    if (!business_id || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: business_id, name, email' },
        { status: 400 }
      )
    }

    // Check for duplicate email within the business
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('business_id', business_id)
      .eq('email', email)
      .single()

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email already exists' },
        { status: 400 }
      )
    }

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`

    const { data, error } = await supabase
      .from('customers')
      .insert([{
        id: customerId,
        business_id,
        name,
        email,
        phone,
        address,
        company,
        tax_id,
        driver_license,
        emergency_contact,
        billing_address,
        payment_methods,
        credit_limit: parseFloat(credit_limit),
        status,
        notes,
        custom_fields
      }])
      .select()
      .single()

    if (error) {
      console.error('Customer creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    }, { status: 201 })
  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}