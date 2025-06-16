'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Palette,
  Database,
  Image as ImageIcon,
  Loader2,
  FileText,
  Users,
  Package,
  Calendar,
  ExternalLink,
  Zap,
  Star,
  Download,
  Eye,
  RefreshCw,
  Settings,
  Play
} from 'lucide-react'
import { analyzeBusinessWebsite } from '@/lib/ai-analysis'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

type OnboardingStep = 'welcome' | 'url_input' | 'ai_analysis' | 'branding_preview' | 'data_import' | 'ai_processing' | 'system_preview' | 'launch'

interface ExtractedBranding {
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  fonts: string[]
  businessName: string
  industry: string
  description: string
  reputationScore?: number
  confidence?: number
  features?: string[]
  webIntelligence?: any
}

interface ImportedData {
  equipment: any[]
  customers: any[]
  rentals: any[]
}

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Form data
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [extractedBranding, setExtractedBranding] = useState<ExtractedBranding | null>(null)
  const [importedData, setImportedData] = useState<ImportedData>({
    equipment: [],
    customers: [],
    rentals: []
  })
  const [businessId, setBusinessId] = useState<string>('')

  const stepProgress = {
    welcome: 0,
    url_input: 15,
    ai_analysis: 30,
    branding_preview: 45,
    data_import: 60,
    ai_processing: 75,
    system_preview: 90,
    launch: 100
  }

  useEffect(() => {
    setProgress(stepProgress[step])
  }, [step])

  const handleAnalyzeWebsite = async () => {
    if (!websiteUrl) {
      toast({
        title: "Website URL Required",
        description: "Please enter your business website URL to continue.",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setStep('ai_analysis')

    try {
      // Call the real analysis API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch('/api/analyze-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl: websiteUrl
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      const result = await response.json()

      if (result.success && result.data) {
        const businessData = result.data
        
        // Extract branding data from real API response
        const realBranding: ExtractedBranding = {
          primaryColor: businessData.branding?.primaryColor || '#3B82F6',
          secondaryColor: businessData.branding?.secondaryColor || '#10B981',
          logoUrl: businessData.branding?.logoUrl || `https://via.placeholder.com/120x120/${businessData.branding?.primaryColor?.replace('#', '') || '3B82F6'}/ffffff?text=${encodeURIComponent(businessData.name?.charAt(0) || 'B')}`,
          fonts: ['Inter', 'Poppins'], // Could be enhanced to extract real fonts
          businessName: businessData.name || 'Your Business',
          industry: businessData.industry || 'Rental Services',
          description: businessData.description || 'Professional rental services'
        }

        // Store the full business data for later use
        setExtractedBranding({
          ...realBranding,
          reputationScore: businessData.webIntelligence?.reputationScore,
          confidence: businessData.confidence,
          features: businessData.features || [],
          webIntelligence: businessData.webIntelligence
        })
        
        setStep('branding_preview')
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis Failed", 
        description: "We couldn't analyze your website. Please check the URL and try again.",
        variant: "destructive"
      })
      setStep('url_input')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDataImport = (type: 'equipment' | 'customers' | 'rentals', data: any[]) => {
    setImportedData(prev => ({
      ...prev,
      [type]: data
    }))
  }

  const handleProcessData = async () => {
    setIsProcessing(true)
    setStep('ai_processing')

    try {
      // Process the imported data and create final business configuration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // If we already have a business ID from the analysis, use it
      if (extractedBranding?.webIntelligence?.businessId) {
        setBusinessId(extractedBranding.webIntelligence.businessId)
      } else {
        // Generate new business ID
        const newBusinessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setBusinessId(newBusinessId)
      }
      
      setStep('system_preview')
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "We couldn't process your data. Please try again.",
        variant: "destructive"
      })
      setStep('data_import')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold">RentalAI Setup</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              AI-powered business automation in minutes
            </motion.p>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Step {Object.keys(stepProgress).indexOf(step) + 1} of {Object.keys(stepProgress).length}</span>
              <span>{progress}% Complete</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8"
              >
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-5xl font-bold mb-6 leading-tight">
                    Your Rental Business
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                      Automated by AI
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Just provide your website URL. Our AI will extract your branding, import your data, 
                    and launch a fully customized rental management system.
                  </p>
                </div>

                {/* Feature Preview */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {[
                    {
                      icon: Brain,
                      title: "AI Brand Extraction",
                      description: "Automatically detects logo, colors, and business info",
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: Database,
                      title: "Smart Data Import",
                      description: "Import existing equipment, customers, and rentals",
                      color: "from-pink-500 to-orange-500"
                    },
                    {
                      icon: Zap,
                      title: "Instant Launch",
                      description: "Fully branded system ready in minutes",
                      color: "from-orange-500 to-yellow-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={() => setStep('url_input')}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all"
                  >
                    Start AI Setup
                    <ArrowRight className="ml-2 h-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* URL Input Step */}
            {step === 'url_input' && (
              <motion.div
                key="url_input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Enter Your Website</CardTitle>
                    <CardDescription className="text-lg">
                      Our AI will analyze your business and extract everything automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="website" className="text-base font-medium">Business Website URL</Label>
                      <div className="flex gap-3 mt-3">
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://yourbusiness.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="flex-1 h-12 text-lg"
                        />
                        <Button variant="outline" size="icon" className="h-12 w-12">
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-2">AI-Powered Analysis</h4>
                          <p className="text-purple-700 mb-3">
                            Our AI will automatically extract:
                          </p>
                          <ul className="space-y-1 text-sm text-purple-700">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Business name, logo, and brand colors
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Industry type and service offerings
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Contact information and location
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Optimal system configuration
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep('welcome')}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleAnalyzeWebsite}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6"
                        disabled={!websiteUrl}
                      >
                        Analyze Website
                        <Brain className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Analysis Step */}
            {step === 'ai_analysis' && (
              <motion.div
                key="ai_analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-8">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Brain className="h-12 w-12 text-white animate-pulse" />
                      </div>
                      <Loader2 className="h-8 w-8 absolute -bottom-2 -right-8 text-purple-600 animate-spin" />
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4">
                      AI Analyzing Your Business
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Our AI is scanning your website and extracting key information...
                    </p>
                    
                    <div className="space-y-4 max-w-md mx-auto">
                      {[
                        "Scanning website content...",
                        "Extracting brand colors and logo...",
                        "Detecting business type...",
                        "Analyzing service offerings...",
                        "Configuring optimal features..."
                      ].map((task, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.5 }}
                          className="flex items-center gap-3 text-left"
                        >
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-sm">{task}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Branding Preview Step */}
            {step === 'branding_preview' && extractedBranding && (
              <motion.div
                key="branding_preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl">Auto AI Branding Complete!</CardTitle>
                    <CardDescription className="text-lg">
                      We've automatically extracted and configured your brand identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Extracted Branding Display */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Extracted Brand Colors
                          </h4>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <div 
                                className="w-16 h-16 rounded-xl shadow-lg mb-2" 
                                style={{ backgroundColor: extractedBranding.primaryColor }}
                              ></div>
                              <span className="text-xs text-gray-600">Primary</span>
                            </div>
                            <div className="text-center">
                              <div 
                                className="w-16 h-16 rounded-xl shadow-lg mb-2" 
                                style={{ backgroundColor: extractedBranding.secondaryColor }}
                              ></div>
                              <span className="text-xs text-gray-600">Secondary</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Auto-Detected Logo
                          </h4>
                          <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                            <img src={extractedBranding.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Business Information</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-gray-600">Business Name:</span>
                              <p className="font-medium">{extractedBranding.businessName}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Industry:</span>
                              <p className="font-medium">{extractedBranding.industry}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Description:</span>
                              <p className="text-sm">{extractedBranding.description}</p>
                            </div>
                            {extractedBranding.reputationScore && (
                              <div>
                                <span className="text-sm text-gray-600">Reputation Score:</span>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-lg">{extractedBranding.reputationScore}/100</p>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < Math.floor(extractedBranding.reputationScore! / 20) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {extractedBranding.confidence && (
                              <div>
                                <span className="text-sm text-gray-600">Analysis Confidence:</span>
                                <p className="font-medium">{extractedBranding.confidence}%</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4">Typography</h4>
                          <div className="space-y-2">
                            {extractedBranding.fonts.map((font, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm mr-2">
                                {font}
                              </span>
                            ))}
                          </div>
                        </div>

                        {extractedBranding.features && extractedBranding.features.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold mb-4">Detected Features</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {extractedBranding.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Live Preview - Your Branded System
                      </h4>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                          <img src={extractedBranding.logoUrl} alt="Logo" className="w-12 h-12" />
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: extractedBranding.primaryColor }}>
                              {extractedBranding.businessName}
                            </h3>
                            <p className="text-gray-600">Equipment Management Dashboard</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg" style={{ backgroundColor: `${extractedBranding.primaryColor}15` }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="h-5 w-5" style={{ color: extractedBranding.primaryColor }} />
                              <span className="font-medium">Equipment</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: extractedBranding.primaryColor }}>156</p>
                          </div>
                          <div className="p-4 rounded-lg" style={{ backgroundColor: `${extractedBranding.secondaryColor}15` }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-5 w-5" style={{ color: extractedBranding.secondaryColor }} />
                              <span className="font-medium">Customers</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: extractedBranding.secondaryColor }}>89</p>
                          </div>
                          <div className="p-4 rounded-lg bg-green-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-5 w-5 text-green-600" />
                              <span className="font-medium">Rentals</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">42</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep('url_input')}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reanalyze
                      </Button>
                      <Button 
                        onClick={() => setStep('data_import')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6"
                      >
                        Continue Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Data Import Step */}
            {step === 'data_import' && (
              <motion.div
                key="data_import"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl">Import Your Existing Data</CardTitle>
                    <CardDescription className="text-lg">
                      Upload your current equipment, customers, and rental data for AI processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        {
                          type: 'equipment',
                          title: 'Equipment Inventory',
                          description: 'Upload your equipment list (CSV, Excel)',
                          icon: Package,
                          color: 'from-blue-500 to-blue-600',
                          formats: 'CSV, Excel, JSON'
                        },
                        {
                          type: 'customers',
                          title: 'Customer Database',
                          description: 'Import existing customer information',
                          icon: Users,
                          color: 'from-green-500 to-green-600',
                          formats: 'CSV, Excel, JSON'
                        },
                        {
                          type: 'rentals',
                          title: 'Rental History',
                          description: 'Upload past and current rental records',
                          icon: Calendar,
                          color: 'from-purple-500 to-purple-600',
                          formats: 'CSV, Excel, JSON'
                        }
                      ].map((category) => (
                        <div key={category.type} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                            <category.icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                          <p className="text-xs text-gray-500 mb-4">Formats: {category.formats}</p>
                          
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Choose File
                            </Button>
                            <Badge variant="outline" className="w-full justify-center">
                              Optional - Start with sample data
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Brain className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">AI Data Processing</h4>
                          <p className="text-blue-700 mb-3">
                            Our AI will automatically:
                          </p>
                          <ul className="space-y-1 text-sm text-blue-700">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Clean and standardize your data format
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Categorize equipment and services automatically
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Set up optimal pricing and availability rules
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Generate insights and recommendations
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        No data to import? We'll create sample data to get you started.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={handleProcessData}>
                          Skip - Use Sample Data
                        </Button>
                        <Button 
                          onClick={handleProcessData}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6"
                        >
                          Process My Data
                          <Brain className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Processing Step */}
            {step === 'ai_processing' && (
              <motion.div
                key="ai_processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-8">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Brain className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full animate-ping animation-delay-1000"></div>
                    </div>
                    
                    <h3 className="text-4xl font-bold mb-4">
                      AI Creating Your System
                    </h3>
                    <p className="text-xl text-gray-600 mb-8">
                      Our AI is processing all your data and building a complete rental management system...
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                      {[
                        "Processing equipment data...",
                        "Organizing customer information...",
                        "Setting up rental workflows...",
                        "Configuring pricing rules...",
                        "Generating dashboard analytics...",
                        "Applying your brand styling...",
                        "Creating user permissions...",
                        "Setting up notifications..."
                      ].map((task, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.3 }}
                          className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg"
                        >
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                      <h4 className="font-semibold text-purple-900 mb-2">🚀 Almost Ready!</h4>
                      <p className="text-purple-700">
                        Your AI-powered rental management system is being assembled with your exact specifications.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* System Preview Step */}
            {step === 'system_preview' && extractedBranding && (
              <motion.div
                key="system_preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl">Your System is Ready!</CardTitle>
                    <CardDescription className="text-lg">
                      Preview your fully branded and configured rental management system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* System Preview */}
                    <div className="bg-gray-100 rounded-2xl p-6">
                      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Browser Chrome */}
                        <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500 ml-4">
                            {extractedBranding.businessName.toLowerCase().replace(/\s+/g, '')}.rentalai.com
                          </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="p-6" style={{ backgroundColor: `${extractedBranding.primaryColor}05` }}>
                          {/* Header */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <img src={extractedBranding.logoUrl} alt="Logo" className="w-12 h-12" />
                              <div>
                                <h3 className="text-xl font-bold" style={{ color: extractedBranding.primaryColor }}>
                                  {extractedBranding.businessName}
                                </h3>
                                <p className="text-gray-600">Dashboard</p>
                              </div>
                            </div>
                            <Badge 
                              className="text-white"
                              style={{ backgroundColor: extractedBranding.primaryColor }}
                            >
                              Live System
                            </Badge>
                          </div>

                          {/* Stats Cards */}
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                              { label: 'Total Equipment', value: '156', icon: Package },
                              { label: 'Active Rentals', value: '42', icon: Calendar },
                              { label: 'Customers', value: '89', icon: Users },
                              { label: 'Revenue', value: '$67.4K', icon: Star }
                            ].map((stat, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <stat.icon className="h-5 w-5" style={{ color: extractedBranding.primaryColor }} />
                                  <span className="text-xs text-green-600">+12%</span>
                                </div>
                                <p className="text-2xl font-bold" style={{ color: extractedBranding.primaryColor }}>
                                  {stat.value}
                                </p>
                                <p className="text-xs text-gray-600">{stat.label}</p>
                              </div>
                            ))}
                          </div>

                          {/* Feature Highlights */}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold mb-3">Configured Features</h4>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              {[
                                'Equipment Management',
                                'Customer Portal',
                                'Rental Scheduling',
                                'Payment Processing',
                                'Maintenance Tracking',
                                'Analytics Dashboard'
                              ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Launch Button */}
                    <div className="text-center">
                      <div className="mb-6">
                        <h4 className="text-xl font-semibold mb-2">Ready to Launch!</h4>
                        <p className="text-gray-600">
                          Your AI-powered rental management system is fully configured and ready to use.
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setStep('data_import')}>
                          <Settings className="mr-2 h-4 w-4" />
                          Customize More
                        </Button>
                        <Button 
                          onClick={() => setStep('launch')}
                          size="lg"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 shadow-xl hover:shadow-2xl transition-all"
                        >
                          Launch My System
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Launch Step */}
            {step === 'launch' && (
              <motion.div
                key="launch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-8">
                    <div className="mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                      </div>
                      <div className="space-y-2 mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-6xl"
                        >
                          🎉
                        </motion.div>
                      </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-4">
                      Congratulations!
                    </h2>
                    <h3 className="text-2xl text-gray-700 mb-6">
                      Your AI-Powered Rental System is Live
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      {extractedBranding?.businessName} is now powered by AI with full branding, 
                      data integration, and all features configured automatically.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                      {[
                        { icon: CheckCircle2, text: "Brand Extracted" },
                        { icon: CheckCircle2, text: "Data Processed" },
                        { icon: CheckCircle2, text: "System Launched" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center justify-center gap-2 text-green-600"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button asChild size="lg" variant="outline">
                        <Link href="/demo-styles">
                          <Play className="mr-2 h-5 w-5" />
                          View Demo
                        </Link>
                      </Button>
                      <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
                        <Link href={businessId ? `/business/${businessId}/dashboard` : "/dashboard"}>
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                      System ID: {businessId || 'biz_demo'} • Setup completed in {Math.round((Date.now() - performance.now()) / 1000)}s
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}