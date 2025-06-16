import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { getTemplateMessage, type SMSTemplateType } from '@/lib/sms-templates'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_PHONE_NUMBER

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

interface SMSRequest {
  to: string
  message: string
  type: SMSTemplateType | 'custom'
  businessId: string
  rentalId?: string
}


export async function POST(request: Request) {
  try {
    const { to, message, type, businessId, rentalId }: SMSRequest = await request.json()

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'SMS service not configured' },
        { status: 500 }
      )
    }

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      )
    }

    // Clean phone number
    const cleanedPhone = to.replace(/\D/g, '')
    const formattedPhone = cleanedPhone.startsWith('1') ? `+${cleanedPhone}` : `+1${cleanedPhone}`

    // Send SMS
    const smsResult = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: formattedPhone,
    })

    console.log(`✅ SMS sent to ${formattedPhone}: ${smsResult.sid}`)

    // Log the notification (in production, save to database)
    const notificationLog = {
      id: smsResult.sid,
      businessId,
      rentalId,
      type,
      to: formattedPhone,
      message: message.substring(0, 100),
      status: smsResult.status,
      sentAt: new Date().toISOString(),
    }

    console.log('Notification logged:', notificationLog)

    return NextResponse.json({
      success: true,
      messageId: smsResult.sid,
      status: smsResult.status,
    })

  } catch (error) {
    console.error('SMS sending failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}

// Bulk SMS endpoint
export async function PUT(request: Request) {
  try {
    const { recipients, message, businessId }: { 
      recipients: string[], 
      message: string, 
      businessId: string 
    } = await request.json()

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'SMS service not configured' },
        { status: 500 }
      )
    }

    const results = []

    for (const phoneNumber of recipients) {
      try {
        const cleanedPhone = phoneNumber.replace(/\D/g, '')
        const formattedPhone = cleanedPhone.startsWith('1') ? `+${cleanedPhone}` : `+1${cleanedPhone}`

        const smsResult = await client.messages.create({
          body: message,
          from: twilioNumber,
          to: formattedPhone,
        })

        results.push({
          phone: formattedPhone,
          success: true,
          messageId: smsResult.sid,
        })

        // Small delay between messages to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        results.push({
          phone: phoneNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      total: recipients.length,
      successful: successCount,
      failed: recipients.length - successCount,
      results,
    })

  } catch (error) {
    console.error('Bulk SMS failed:', error)
    return NextResponse.json(
      { success: false, error: 'Bulk SMS failed' },
      { status: 500 }
    )
  }
}

