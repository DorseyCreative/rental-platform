import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// For static export compatibility
export async function generateStaticParams() {
  // Return empty array for static build - these API routes won't work in static context anyway
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        rentals:rentals(
          id,
          start_date,
          end_date,
          status,
          total_amount,
          equipment:equipment(name, category)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Customer fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Customer fetch error:', error)
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
      email,
      phone,
      address,
      company,
      tax_id,
      driver_license,
      emergency_contact,
      billing_address,
      payment_methods,
      credit_limit,
      status,
      notes,
      custom_fields
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (company !== undefined) updateData.company = company
    if (tax_id !== undefined) updateData.tax_id = tax_id
    if (driver_license !== undefined) updateData.driver_license = driver_license
    if (emergency_contact !== undefined) updateData.emergency_contact = emergency_contact
    if (billing_address !== undefined) updateData.billing_address = billing_address
    if (payment_methods !== undefined) updateData.payment_methods = payment_methods
    if (credit_limit !== undefined) updateData.credit_limit = parseFloat(credit_limit)
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (custom_fields !== undefined) updateData.custom_fields = custom_fields

    // Check for duplicate email if email is being updated
    if (email) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, business_id')
        .eq('email', email)
        .neq('id', params.id)
        .single()

      if (existingCustomer) {
        // Get the business_id of the current customer to check if it's the same business
        const { data: currentCustomer } = await supabase
          .from('customers')
          .select('business_id')
          .eq('id', params.id)
          .single()

        if (currentCustomer && existingCustomer.business_id === currentCustomer.business_id) {
          return NextResponse.json(
            { success: false, error: 'Customer with this email already exists in this business' },
            { status: 400 }
          )
        }
      }
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Customer update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update customer' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Customer update error:', error)
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
    // Check if customer has active rentals
    const { data: activeRentals, error: rentalError } = await supabase
      .from('rentals')
      .select('id')
      .eq('customer_id', params.id)
      .in('status', ['active', 'reserved'])

    if (rentalError) {
      console.error('Rental check error:', rentalError)
    } else if (activeRentals && activeRentals.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete customer with active rentals' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Customer deletion error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete customer' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    console.error('Customer deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}