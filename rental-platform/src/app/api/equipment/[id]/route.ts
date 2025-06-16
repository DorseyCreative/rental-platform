import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Equipment fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Equipment fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      model,
      make,
      year,
      description,
      condition,
      status,
      location,
      daily_rate,
      weekly_rate,
      monthly_rate,
      deposit_amount,
      images,
      specifications,
      custom_fields
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (model !== undefined) updateData.model = model
    if (make !== undefined) updateData.make = make
    if (year !== undefined) updateData.year = year
    if (description !== undefined) updateData.description = description
    if (condition !== undefined) updateData.condition = condition
    if (status !== undefined) updateData.status = status
    if (location !== undefined) updateData.location = location
    if (daily_rate !== undefined) updateData.daily_rate = parseFloat(daily_rate)
    if (weekly_rate !== undefined) updateData.weekly_rate = weekly_rate ? parseFloat(weekly_rate) : null
    if (monthly_rate !== undefined) updateData.monthly_rate = monthly_rate ? parseFloat(monthly_rate) : null
    if (deposit_amount !== undefined) updateData.deposit_amount = deposit_amount ? parseFloat(deposit_amount) : null
    if (images !== undefined) updateData.images = images
    if (specifications !== undefined) updateData.specifications = specifications
    if (custom_fields !== undefined) updateData.custom_fields = custom_fields

    const { data, error } = await supabase
      .from('equipment')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Equipment update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update equipment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Equipment update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if equipment is currently rented
    const { data: activeRentals, error: rentalError } = await supabase
      .from('rentals')
      .select('id')
      .eq('equipment_id', params.id)
      .in('status', ['active', 'reserved'])

    if (rentalError) {
      console.error('Rental check error:', rentalError)
    } else if (activeRentals && activeRentals.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete equipment with active rentals' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Equipment deletion error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete equipment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully'
    })
  } catch (error) {
    console.error('Equipment deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}