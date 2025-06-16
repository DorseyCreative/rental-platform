import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
})

interface PaymentRequest {
  amount: number
  currency: string
  customerId: string
  rentalId: string
  businessId: string
}

export async function POST(request: Request) {
  try {
    const { amount, currency, customerId, rentalId, businessId }: PaymentRequest = await request.json()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        customerId,
        rentalId,
        businessId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Payment setup failed' },
      { status: 500 }
    )
  }
}

// Webhook handler for payment confirmations
export async function PUT(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...'
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`💰 Payment succeeded: ${paymentIntent.id}`)
        
        // Update rental status in database
        // await updateRentalPaymentStatus(paymentIntent.metadata.rentalId, 'paid')
        break

      case 'payment_intent.payment_failed':
        console.log(`❌ Payment failed: ${event.data.object.id}`)
        break
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}