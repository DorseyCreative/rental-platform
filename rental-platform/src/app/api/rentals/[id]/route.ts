import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        customer:customers(*),
        equipment:equipment(*),
        invoices:invoices(*),
        payments:payments(*),
        delivery_schedules:delivery_schedules(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Rental fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Rental fetch error:', error)
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
      start_date,
      end_date,
      actual_return_date,
      status,
      delivery_required,
      delivery_address,
      delivery_fee,
      pickup_required,
      pickup_fee,
      notes,
      signature_data
    } = body

    // Get current rental data
    const { data: currentRental, error: fetchError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentRental) {
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    // Handle date changes
    if (start_date !== undefined || end_date !== undefined) {
      const newStartDate = start_date || currentRental.start_date
      const newEndDate = end_date || currentRental.end_date
      
      // Recalculate if dates changed
      if (start_date !== currentRental.start_date || end_date !== currentRental.end_date) {
        const startDateTime = new Date(newStartDate)
        const endDateTime = new Date(newEndDate)
        const totalDays = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24))
        const subtotal = totalDays * currentRental.daily_rate
        const taxAmount = subtotal * 0.08
        const totalAmount = subtotal + taxAmount + (delivery_fee || currentRental.delivery_fee) + (pickup_fee || currentRental.pickup_fee)
        
        updateData.start_date = newStartDate
        updateData.end_date = newEndDate
        updateData.total_days = totalDays
        updateData.subtotal = subtotal
        updateData.tax_amount = taxAmount
        updateData.total_amount = totalAmount
      }
    }

    // Handle status changes
    if (status !== undefined && status !== currentRental.status) {
      updateData.status = status
      
      // Update equipment status based on rental status
      let equipmentStatus = 'available'
      if (status === 'active' || status === 'reserved') {
        equipmentStatus = 'rented'
      }
      
      await supabase
        .from('equipment')
        .update({ status: equipmentStatus })
        .eq('id', currentRental.equipment_id)
    }

    // Handle return
    if (actual_return_date !== undefined) {
      updateData.actual_return_date = actual_return_date
      if (status === 'completed') {
        // Mark equipment as available
        await supabase
          .from('equipment')
          .update({ status: 'available' })
          .eq('id', currentRental.equipment_id)
      }
    }

    // Other updates
    if (delivery_required !== undefined) updateData.delivery_required = delivery_required
    if (delivery_address !== undefined) updateData.delivery_address = delivery_address
    if (delivery_fee !== undefined) updateData.delivery_fee = parseFloat(delivery_fee)
    if (pickup_required !== undefined) updateData.pickup_required = pickup_required
    if (pickup_fee !== undefined) updateData.pickup_fee = parseFloat(pickup_fee)
    if (notes !== undefined) updateData.notes = notes
    if (signature_data !== undefined) updateData.signature_data = signature_data

    const { data, error } = await supabase
      .from('rentals')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        customer:customers(id, name, email),
        equipment:equipment(id, name, category)
      `)
      .single()

    if (error) {
      console.error('Rental update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update rental' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Rental update error:', error)
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
    // Get rental data first
    const { data: rental, error: fetchError } = await supabase
      .from('rentals')
      .select('equipment_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !rental) {
      return NextResponse.json(
        { success: false, error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Check if rental can be deleted (only reserved or cancelled rentals)
    if (rental.status === 'active') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete active rental' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('rentals')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Rental deletion error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete rental' },
        { status: 500 }
      )
    }

    // Update equipment status to available if it was rented
    if (rental.status === 'reserved') {
      await supabase
        .from('equipment')
        .update({ status: 'available' })
        .eq('id', rental.equipment_id)
    }

    return NextResponse.json({
      success: true,
      message: 'Rental deleted successfully'
    })
  } catch (error) {
    console.error('Rental deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}