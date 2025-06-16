import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

interface PaymentRequest {
  businessId: string
  customerId: string
  rentalId?: string
  invoiceId?: string
  amount: number
  paymentMethodId: string
  savePaymentMethod?: boolean
  type: 'deposit' | 'rental' | 'invoice'
  metadata?: Record<string, string>
}

export async function POST(request: Request) {
  try {
    const {
      businessId,
      customerId,
      rentalId,
      invoiceId,
      amount,
      paymentMethodId,
      savePaymentMethod = false,
      type,
      metadata = {}
    }: PaymentRequest = await request.json()

    if (!businessId || !customerId || !amount || !paymentMethodId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`💳 Processing ${type} payment of $${amount} for customer ${customerId}`)

    const supabase = getServiceSupabase()

    // Fetch business and customer data
    const [businessResult, customerResult] = await Promise.all([
      supabase.from('businesses').select('*').eq('id', businessId).single(),
      supabase.from('customers').select('*').eq('id', customerId).single()
    ])

    if (businessResult.error || customerResult.error) {
      throw new Error('Failed to fetch business or customer data')
    }

    const business = businessResult.data
    const customer = customerResult.data

    // Get or create Stripe customer
    let stripeCustomerId = customer.stripe_customer_id
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: customer.contact_name,
        phone: customer.phone,
        address: {
          line1: customer.address.split(',')[0] || '',
          city: customer.address.split(',')[1]?.trim() || '',
          state: customer.address.split(',')[2]?.trim() || '',
          postal_code: customer.address.split(',')[3]?.trim() || '',
          country: 'US'
        },
        metadata: {
          business_id: businessId,
          customer_id: customerId
        }
      })
      stripeCustomerId = stripeCustomer.id

      // Update customer with Stripe ID
      await supabase
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', customerId)
    }

    // Save payment method if requested
    if (savePaymentMethod) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      })
    }

    // Calculate application fee (platform takes 2.5% + $0.30)
    const applicationFeeAmount = Math.round(amount * 0.025 * 100) + 30 // Convert to cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: business.stripe_account_id || 'acct_default' // Business's connected account
      },
      metadata: {
        business_id: businessId,
        customer_id: customerId,
        rental_id: rentalId || '',
        invoice_id: invoiceId || '',
        payment_type: type,
        ...metadata
      },
      description: `${type} payment for ${business.name} - ${customer.contact_name}`
    })

    // Save payment record
    const payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      business_id: businessId,
      customer_id: customerId,
      rental_id: rentalId,
      invoice_id: invoiceId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: amount,
      application_fee: applicationFeeAmount / 100,
      status: paymentIntent.status,
      payment_method_id: paymentMethodId,
      type: type,
      metadata: metadata,
      created_at: new Date().toISOString()
    }

    const { error: paymentError } = await supabase
      .from('payments')
      .insert(payment)

    if (paymentError) {
      console.error('Failed to save payment record:', paymentError)
    }

    // Update rental/invoice status if payment succeeded
    if (paymentIntent.status === 'succeeded') {
      if (rentalId && type === 'deposit') {
        await supabase
          .from('rentals')
          .update({ 
            deposit_paid: true,
            status: 'confirmed',
            payment_status: 'deposit_paid'
          })
          .eq('id', rentalId)
      }

      if (invoiceId) {
        await supabase
          .from('invoices')
          .update({ 
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('id', invoiceId)
      }

      // Send SMS notification if configured
      await sendPaymentNotification(business, customer, payment)
    }

    console.log(`✅ Payment ${paymentIntent.id} processed successfully`)

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: paymentIntent.status,
        amount: amount,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      }
    })

  } catch (error) {
    console.error('❌ Payment processing failed:', error)
    
    // Handle specific Stripe errors
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as any
      if (stripeError.type === 'StripeCardError') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment failed',
            message: stripeError.message,
            code: stripeError.code
          },
          { status: 402 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

async function sendPaymentNotification(business: any, customer: any, payment: any) {
  try {
    const message = `✅ ${business.name}: Payment of $${payment.amount} received. Thank you!`
    
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customer.phone,
        message: message,
        type: 'payment_confirmation',
        businessId: business.id,
        rentalId: payment.rental_id
      })
    })
  } catch (error) {
    console.error('Failed to send payment notification:', error)
  }
}

// Webhook endpoint for Stripe events
export async function PUT(request: Request) {
  try {
    const sig = request.headers.get('stripe-signature')!
    const body = await request.text()

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    console.log(`🔔 Webhook received: ${event.type}`)

    const supabase = getServiceSupabase()

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment status
        await supabase
          .from('payments')
          .update({ 
            status: 'succeeded'
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        await supabase
          .from('payments')
          .update({ 
            status: 'failed',
            failure_reason: failedPayment.last_payment_error?.message || 'Payment failed'
          })
          .eq('stripe_payment_intent_id', failedPayment.id)

        break

      case 'invoice.payment_succeeded':
        // Handle subscription/recurring payment success
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}