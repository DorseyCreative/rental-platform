'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  DollarSign, 
  FileSignature, 
  Check, 
  AlertCircle,
  Smartphone,
  Wallet
} from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'

interface MobilePaymentProps {
  rental: {
    id: string
    customer: string
    equipment: string[]
    amount: number
    depositAmount: number
    type: 'deposit' | 'final'
  }
  business: {
    id: string
    name: string
    branding?: {
      primary_color?: string
    }
  }
  onPaymentComplete: (paymentData: any) => void
  onCancel: () => void
}

export default function MobilePayment({ rental, business, onPaymentComplete, onCancel }: MobilePaymentProps) {
  const [step, setStep] = useState<'amount' | 'method' | 'signature' | 'processing' | 'complete'>('amount')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'check'>('card')
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [cashAmount, setCashAmount] = useState('')
  const [checkNumber, setCheckNumber] = useState('')
  const [signature, setSignature] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  
  const signatureRef = useRef<SignatureCanvas>(null)

  const paymentAmount = rental.type === 'deposit' ? rental.depositAmount : rental.amount

  const handleAmountConfirm = () => {
    setStep('method')
  }

  const handlePaymentMethodSelect = (method: 'card' | 'cash' | 'check') => {
    setPaymentMethod(method)
    setError('')
  }

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'card') {
      await processCardPayment()
    } else {
      setStep('signature')
    }
  }

  const processCardPayment = async () => {
    setIsProcessing(true)
    setError('')

    try {
      // Validate card data
      if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
        throw new Error('Please fill in all card details')
      }

      // In a real implementation, you would use Stripe Elements or similar
      // For demo purposes, we'll simulate a payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate payment processing
      const paymentResult = {
        id: `pay_${Date.now()}`,
        amount: paymentAmount,
        method: 'card',
        status: 'succeeded',
        last4: cardData.number.slice(-4),
        timestamp: new Date().toISOString()
      }

      setStep('signature')
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignatureComplete = () => {
    if (!signatureRef.current?.isEmpty()) {
      const signatureData = signatureRef.current?.toDataURL()
      setSignature(signatureData || '')
      completePayment(signatureData)
    } else {
      setError('Please provide your signature')
    }
  }

  const completePayment = async (signatureData?: string) => {
    setIsProcessing(true)

    try {
      const paymentData = {
        rentalId: rental.id,
        businessId: business.id,
        amount: paymentAmount,
        method: paymentMethod,
        signature: signatureData || signature,
        timestamp: new Date().toISOString(),
        ...(paymentMethod === 'card' && { last4: cardData.number.slice(-4) }),
        ...(paymentMethod === 'cash' && { cashAmount }),
        ...(paymentMethod === 'check' && { checkNumber })
      }

      // Save payment data
      await savePaymentRecord(paymentData)
      
      setStep('complete')
      
      // Call parent callback after a short delay
      setTimeout(() => {
        onPaymentComplete(paymentData)
      }, 2000)

    } catch (error) {
      setError('Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const savePaymentRecord = async (paymentData: any) => {
    // In a real implementation, this would save to your backend
    console.log('Saving payment:', paymentData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const clearSignature = () => {
    signatureRef.current?.clear()
    setError('')
  }

  if (step === 'amount') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: business.branding?.primary_color }} />
              Payment Required
            </CardTitle>
            <CardDescription>
              {rental.type === 'deposit' ? 'Deposit' : 'Final Payment'} for rental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold">{rental.customer}</p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Equipment</p>
                <p className="font-medium">{rental.equipment.join(', ')}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: business.branding?.primary_color }}>
                ${paymentAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {rental.type === 'deposit' ? 'Deposit Amount' : 'Total Amount Due'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAmountConfirm} className="flex-1">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'method') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose how you'd like to pay ${paymentAmount.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'card' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Card</p>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('cash')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'cash' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Cash</p>
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('check')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  paymentMethod === 'check' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileSignature className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Check</p>
              </button>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value.replace(/\D/g, '').substring(0, 16) }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div>
                <Label htmlFor="cashAmount">Cash Amount Received</Label>
                <Input
                  id="cashAmount"
                  type="number"
                  placeholder={paymentAmount.toString()}
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === 'check' && (
              <div>
                <Label htmlFor="checkNumber">Check Number</Label>
                <Input
                  id="checkNumber"
                  placeholder="1234"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePaymentSubmit} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'signature') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Customer Signature
            </CardTitle>
            <CardDescription>
              Please have the customer sign below to confirm payment of ${paymentAmount.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-300 rounded-lg">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 350,
                  height: 200,
                  className: 'signature-canvas w-full h-48 touch-manipulation'
                }}
                backgroundColor="rgb(255, 255, 255)"
                penColor="rgb(0, 0, 0)"
              />
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Customer signature confirms:</p>
              <p>• Payment of ${paymentAmount.toLocaleString()} via {paymentMethod}</p>
              <p>• Receipt of equipment/services</p>
              <p>• Agreement to rental terms</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={clearSignature}>
                Clear
              </Button>
              <Button 
                onClick={handleSignatureComplete}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
            <p className="text-gray-600 mb-4">
              ${paymentAmount.toLocaleString()} payment received via {paymentMethod}
            </p>
            <Badge className="mb-4">Receipt sent to customer</Badge>
            <p className="text-sm text-gray-500">
              Returning to delivery screen...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}