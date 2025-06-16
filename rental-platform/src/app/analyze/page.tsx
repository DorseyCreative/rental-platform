'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Star,
  Facebook,
  Linkedin,
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
  Eye
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface BusinessAnalysis {
  name: string
  type: string
  industry: string
  email: string
  phone: string
  address: string
  description: string
  confidence: number
  webIntelligence?: {
    reputationScore: number
    googleReviews: {
      rating: number
      reviewCount: number
      recentReviews: Array<{
        rating: number
        text: string
        date: string
        author: string
      }>
    }
    socialMedia: {
      facebook: {
        followers: number
        engagement: number
        lastPost: string
        verified: boolean
      }
      linkedin: {
        connections: number
        employees: number
        verified: boolean
      }
    }
    onlinePresence: {
      industryListings: string[]
      newsArticles: Array<{
        title: string
        source: string
        date: string
        sentiment: 'positive' | 'neutral' | 'negative'
      }>
    }
    recommendations: Array<{
      category: string
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      estimatedImpact: string
      timeframe: string
    }>
    overallSentiment: 'positive' | 'neutral' | 'negative'
    lastUpdated: string
  }
}

export default function BusinessAnalyzePage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null)
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input')

  const handleAnalyze = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid business website URL",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setStep('analyzing')
    
    try {
      const response = await fetch('/api/analyze-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl: websiteUrl.trim()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze business')
      }

      const result = await response.json()
      if (result.success) {
        setAnalysis(result.data)
        setStep('results')
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${result.data.name} with ${result.data.webIntelligence ? 'web intelligence' : 'basic analysis'}`,
        })
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      })
      setStep('input')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getReputationLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <MessageSquare className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Business Intelligence Analyzer:</strong> Analyze any business website to extract comprehensive information and reputation data. 
              Perfect for onboarding new businesses to your platform.
              {' '}
              <Link href="/" className="underline font-medium">Back to Home</Link>
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Business Intelligence Analyzer</h1>
            <p className="text-lg text-gray-600">
              AI-powered analysis of business websites with comprehensive reputation scoring
            </p>
          </div>
        </div>

        {/* Input Form */}
        {step === 'input' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Analyze Business Website
              </CardTitle>
              <CardDescription>
                Enter a business website URL to get comprehensive analysis including reputation scoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-blue-900">AI-Powered Analysis</p>
                </div>
                <p className="text-sm text-blue-700">
                  Our system will analyze the website, crawl social media, extract reviews, and provide reputation scoring with actionable recommendations.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Business Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://example-business.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  Enter the main website URL of the business you want to analyze
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={!websiteUrl.trim() || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Business...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Analyze Business
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Analyzing Progress */}
        {step === 'analyzing' && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-8">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto text-blue-600 animate-pulse mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analyzing Business</h3>
                <p className="text-gray-600 mb-6">Please wait while we gather comprehensive intelligence...</p>
                
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Scraping website content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Extracting business information</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 animate-spin" />
                    <span>Running web intelligence analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span>Crawling social media profiles</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span>Collecting reviews and ratings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span>Calculating reputation score</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {step === 'results' && analysis && (
          <div className="space-y-6">
            {/* Business Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{analysis.name}</CardTitle>
                    <CardDescription>{analysis.industry}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {analysis.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Type</p>
                    <p className="text-lg">{analysis.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="text-sm">{analysis.email}</p>
                    <p className="text-sm">{analysis.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm">{analysis.address}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm">{analysis.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Web Intelligence Results */}
            {analysis.webIntelligence && (
              <>
                {/* Reputation Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Reputation Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getReputationColor(analysis.webIntelligence.reputationScore)}`}>
                          {analysis.webIntelligence.reputationScore}
                        </div>
                        <div className="text-lg font-medium text-gray-600">
                          {getReputationLabel(analysis.webIntelligence.reputationScore)}
                        </div>
                        <div className="text-sm text-gray-500">out of 100</div>
                      </div>
                      <div className="flex-1">
                        <Progress value={analysis.webIntelligence.reputationScore} className="h-3 mb-4" />
                        <div className="flex items-center gap-2 mb-2">
                          {getSentimentIcon(analysis.webIntelligence.overallSentiment)}
                          <span className="text-sm font-medium">
                            Overall Sentiment: {analysis.webIntelligence.overallSentiment}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(analysis.webIntelligence.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews & Social Media */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Google Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Google Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-bold">{analysis.webIntelligence.googleReviews.rating}</div>
                        <div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(analysis.webIntelligence!.googleReviews.rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {analysis.webIntelligence.googleReviews.reviewCount} reviews
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Recent Reviews:</p>
                        {analysis.webIntelligence.googleReviews.recentReviews.slice(0, 2).map((review, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`h-3 w-3 ${
                                      j < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-sm text-gray-700">{review.text}</p>
                            <p className="text-xs text-gray-500 mt-1">- {review.author}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Media */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Social Media Presence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Facebook</span>
                          {analysis.webIntelligence.socialMedia.facebook.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {analysis.webIntelligence.socialMedia.facebook.followers 
                              ? `${analysis.webIntelligence.socialMedia.facebook.followers.toLocaleString()} followers`
                              : 'Data unavailable'
                            }
                          </div>
                          <div className="text-xs text-gray-500">
                            {analysis.webIntelligence.socialMedia.facebook.engagement 
                              ? `${analysis.webIntelligence.socialMedia.facebook.engagement}% engagement`
                              : analysis.webIntelligence.socialMedia.facebook.note || 'API not integrated'
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          <span className="text-sm font-medium">LinkedIn</span>
                          {analysis.webIntelligence.socialMedia.linkedin.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {analysis.webIntelligence.socialMedia.linkedin.connections 
                              ? `${analysis.webIntelligence.socialMedia.linkedin.connections.toLocaleString()} connections`
                              : 'Data unavailable'
                            }
                          </div>
                          <div className="text-xs text-gray-500">
                            {analysis.webIntelligence.socialMedia.linkedin.employees 
                              ? `${analysis.webIntelligence.socialMedia.linkedin.employees} employees`
                              : analysis.webIntelligence.socialMedia.linkedin.note || 'API not integrated'
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>
                      Actionable insights to improve reputation and online presence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.webIntelligence.recommendations.map((rec, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{rec.title}</h4>
                            <Badge 
                              variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Impact: {rec.estimatedImpact}</span>
                            <span>Timeframe: {rec.timeframe}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => { setStep('input'); setAnalysis(null); }}>
                    <Globe className="mr-2 h-4 w-4" />
                    Analyze Another Business
                  </Button>
                  <Button asChild>
                    <Link href="/master-admin">
                      <Shield className="mr-2 h-4 w-4" />
                      View All Businesses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}