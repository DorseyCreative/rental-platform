import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

interface InvoiceRequest {
  businessId: string
  rentalId: string
  customerId: string
  type: 'rental' | 'deposit' | 'final'
}

interface InvoiceData {
  invoiceNumber: string
  business: any
  customer: any
  rental: any
  equipment: any[]
  lineItems: any[]
  totals: {
    subtotal: number
    tax: number
    deposit: number
    total: number
  }
  dueDate: string
  notes?: string
}

export async function POST(request: Request) {
  try {
    const { businessId, rentalId, customerId, type }: InvoiceRequest = await request.json()

    if (!businessId || !rentalId || !customerId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`📄 Generating ${type} invoice for rental ${rentalId}`)

    // Fetch invoice data
    const invoiceData = await generateInvoiceData(businessId, rentalId, customerId, type)
    
    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData)
    
    // Save invoice to database
    const invoice = await saveInvoice(invoiceData, pdfBuffer)

    console.log(`✅ Invoice ${invoiceData.invoiceNumber} generated successfully`)

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        number: invoiceData.invoiceNumber,
        amount: invoiceData.totals.total,
        dueDate: invoiceData.dueDate,
        downloadUrl: `/api/download-invoice/${invoice.id}`
      }
    })

  } catch (error) {
    console.error('❌ Invoice generation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Invoice generation failed' },
      { status: 500 }
    )
  }
}

async function generateInvoiceData(businessId: string, rentalId: string, customerId: string, type: string): Promise<InvoiceData> {
  const supabase = getServiceSupabase()

  // Fetch business data
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  // Fetch customer data
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()

  // Fetch rental data
  const { data: rental } = await supabase
    .from('rentals')
    .select('*')
    .eq('id', rentalId)
    .single()

  // Fetch equipment data
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', rental.equipment_id)
    .single()

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(businessId, type)

  // Calculate line items and totals
  const { lineItems, totals } = calculateInvoiceTotals(rental, equipment, business.settings?.tax_rate || 0.055, type)

  // Calculate due date
  const dueDate = calculateDueDate(customer.payment_terms)

  return {
    invoiceNumber,
    business,
    customer,
    rental,
    equipment: [equipment],
    lineItems,
    totals,
    dueDate,
    notes: getInvoiceNotes(type)
  }
}

async function generateInvoiceNumber(businessId: string, type: string): Promise<string> {
  const supabase = getServiceSupabase()
  
  // Get the latest invoice number for this business
  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let nextNumber = 1
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoice_number.split('-').pop() || '0')
    nextNumber = lastNumber + 1
  }

  const prefix = type === 'deposit' ? 'DEP' : type === 'final' ? 'FIN' : 'INV'
  const year = new Date().getFullYear()
  
  return `${prefix}-${year}-${nextNumber.toString().padStart(4, '0')}`
}

function calculateInvoiceTotals(rental: any, equipment: any, taxRate: number, type: string) {
  const lineItems = []
  let subtotal = 0

  // Calculate rental period
  const startDate = new Date(rental.start_date)
  const endDate = new Date(rental.end_date)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  if (type === 'deposit') {
    // Deposit invoice
    lineItems.push({
      description: `Deposit for ${equipment.name}`,
      quantity: 1,
      rate: rental.deposit_amount,
      amount: rental.deposit_amount
    })
    subtotal = rental.deposit_amount
  } else if (type === 'rental' || type === 'final') {
    // Rental charges
    lineItems.push({
      description: `${equipment.name} Rental`,
      quantity: days,
      rate: rental.daily_rate,
      amount: days * rental.daily_rate
    })
    subtotal = days * rental.daily_rate

    // Delivery charges (if applicable)
    if (rental.delivery_address) {
      lineItems.push({
        description: 'Delivery & Pickup',
        quantity: 1,
        rate: 150, // Standard delivery fee
        amount: 150
      })
      subtotal += 150
    }

    // Subtract deposit if final invoice
    if (type === 'final') {
      lineItems.push({
        description: 'Deposit Applied',
        quantity: 1,
        rate: -rental.deposit_amount,
        amount: -rental.deposit_amount
      })
      subtotal -= rental.deposit_amount
    }
  }

  const tax = subtotal * taxRate
  const total = subtotal + tax

  return {
    lineItems,
    totals: {
      subtotal,
      tax,
      deposit: type === 'deposit' ? rental.deposit_amount : 0,
      total
    }
  }
}

function calculateDueDate(paymentTerms: string): string {
  const today = new Date()
  let daysToAdd = 30 // Default

  switch (paymentTerms) {
    case 'net_15':
      daysToAdd = 15
      break
    case 'net_30':
      daysToAdd = 30
      break
    case 'prepaid':
      daysToAdd = 0
      break
    case 'net_60':
      daysToAdd = 60
      break
  }

  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + daysToAdd)
  
  return dueDate.toISOString().split('T')[0]
}

function getInvoiceNotes(type: string): string {
  switch (type) {
    case 'deposit':
      return 'This deposit is required to confirm your equipment rental. The deposit will be applied to your final invoice.'
    case 'rental':
      return 'Thank you for choosing our equipment rental services. Payment is due according to your payment terms.'
    case 'final':
      return 'Final invoice for your equipment rental. Your deposit has been applied to this invoice.'
    default:
      return 'Thank you for your business!'
  }
}

async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  // Generate HTML for the invoice
  const html = generateInvoiceHTML(invoiceData)
  
  // In a real implementation, you would use a library like puppeteer or a PDF service
  // For now, we'll return a mock PDF buffer
  const mockPdfContent = `
    INVOICE: ${invoiceData.invoiceNumber}
    
    From: ${invoiceData.business.name}
          ${invoiceData.business.address}
          ${invoiceData.business.email}
          ${invoiceData.business.phone}
    
    To: ${invoiceData.customer.company_name || invoiceData.customer.contact_name}
        ${invoiceData.customer.contact_name}
        ${invoiceData.customer.address}
        ${invoiceData.customer.email}
        ${invoiceData.customer.phone}
    
    Due Date: ${invoiceData.dueDate}
    
    Line Items:
    ${invoiceData.lineItems.map(item => 
      `${item.description} - Qty: ${item.quantity} - Rate: $${item.rate} - Amount: $${item.amount}`
    ).join('\n')}
    
    Subtotal: $${invoiceData.totals.subtotal}
    Tax: $${invoiceData.totals.tax}
    Total: $${invoiceData.totals.total}
    
    Notes: ${invoiceData.notes}
  `
  
  return Buffer.from(mockPdfContent, 'utf-8')
}

function generateInvoiceHTML(invoiceData: InvoiceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company-info { text-align: left; }
        .invoice-info { text-align: right; }
        .customer-info { margin-bottom: 40px; }
        .line-items { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .line-items th, .line-items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .line-items th { background-color: #f2f2f2; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 8px; }
        .notes { margin-top: 40px; font-style: italic; }
        .primary-color { color: ${invoiceData.business.branding?.primary_color || '#3B82F6'}; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1 class="primary-color">${invoiceData.business.name}</h1>
          <p>${invoiceData.business.address}</p>
          <p>${invoiceData.business.email}</p>
          <p>${invoiceData.business.phone}</p>
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div class="customer-info">
        <h3>Bill To:</h3>
        <p><strong>${invoiceData.customer.company_name || invoiceData.customer.contact_name}</strong></p>
        ${invoiceData.customer.company_name ? `<p>${invoiceData.customer.contact_name}</p>` : ''}
        <p>${invoiceData.customer.address}</p>
        <p>${invoiceData.customer.email}</p>
        <p>${invoiceData.customer.phone}</p>
      </div>

      <table class="line-items">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.lineItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.rate.toFixed(2)}</td>
              <td>$${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${invoiceData.totals.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$${invoiceData.totals.tax.toFixed(2)}</span>
        </div>
        <div class="total-row total-final">
          <span>Total:</span>
          <span>$${invoiceData.totals.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="notes">
        <p><strong>Notes:</strong></p>
        <p>${invoiceData.notes}</p>
      </div>
    </body>
    </html>
  `
}

async function saveInvoice(invoiceData: InvoiceData, pdfBuffer: Buffer) {
  const supabase = getServiceSupabase()

  // In a real implementation, you would upload the PDF to storage (like Supabase Storage)
  const pdfUrl = `https://storage.example.com/invoices/${invoiceData.invoiceNumber}.pdf`

  const invoice = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    business_id: invoiceData.business.id,
    customer_id: invoiceData.customer.id,
    rental_id: invoiceData.rental.id,
    invoice_number: invoiceData.invoiceNumber,
    amount: invoiceData.totals.total,
    tax_amount: invoiceData.totals.tax,
    due_date: invoiceData.dueDate,
    status: 'sent',
    pdf_url: pdfUrl,
    line_items: invoiceData.lineItems,
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save invoice: ${error.message}`)
  }

  return data
}