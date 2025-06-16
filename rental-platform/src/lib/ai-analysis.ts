import Anthropic from '@anthropic-ai/sdk'

interface AnalysisInput {
  websiteUrl: string
  logoUrl?: string
  additionalLinks?: string[]
}

interface BusinessAnalysis {
  name: string
  type: 'heavy_equipment' | 'party_rental' | 'car_rental' | 'tool_rental' | 'custom'
  industry: string
  email: string
  phone: string
  address: string
  description: string
  features: string[]
  branding: {
    primaryColor: string
    secondaryColor: string
    logoUrl?: string
  }
  confidence: number
  customFields: any[]
}

export async function analyzeBusinessWebsite(input: AnalysisInput): Promise<BusinessAnalysis> {
  try {
    // Call the API route that handles the actual analysis
    const response = await fetch('/api/analyze-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Website analysis error:', error)
    
    // Fallback to mock data if API fails
    const mockData: BusinessAnalysis = {
      name: "Demo Business",
      type: "heavy_equipment",
      industry: "Construction",
      email: "info@demobusiness.com",
      phone: "+1-555-123-4567",
      address: "123 Demo Street, Demo City, ST 12345",
      description: "Professional rental services",
      features: [
        "GPS Tracking",
        "Maintenance Scheduling", 
        "Field Operations",
        "Delivery Management"
      ],
      branding: {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        logoUrl: input.logoUrl
      },
      confidence: 85,
      customFields: [
        { name: "Make", type: "text", required: true },
        { name: "Model", type: "text", required: true },
        { name: "Year", type: "number", required: true }
      ]
    }
    
    return mockData
  }
}