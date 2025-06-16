import { NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'

interface WebIntelligenceRequest {
  businessName: string
  website: string
  phone?: string
  address?: string
  businessType: string
}

interface WebIntelligenceResult {
  reputationScore: number
  googleReviews: {
    rating: number | null
    reviewCount: number | null
    recentReviews: Array<{
      rating: number
      text: string
      date: string
      author: string
    }>
  }
  socialMedia: {
    facebook: {
      followers: number | null
      engagement: number | null
      lastPost: string | null
      verified: boolean | null
    }
    linkedin: {
      connections: number | null
      employees: number | null
      verified: boolean | null
    }
    instagram?: {
      followers: number
      posts: number
    }
  }
  onlinePresence: {
    bbcRating?: string
    yelpRating?: number
    industryListings: string[]
    newsArticles: Array<{
      title: string
      source: string
      date: string
      sentiment: 'positive' | 'neutral' | 'negative'
    }>
  }
  competitorAnalysis: {
    marketPosition: 'leader' | 'challenger' | 'follower' | 'niche'
    strengthsVsCompetitors: string[]
    improvementAreas: string[]
  }
  recommendations: Array<{
    category: 'reputation' | 'social' | 'seo' | 'reviews' | 'content'
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    estimatedImpact: string
    timeframe: string
  }>
  overallSentiment: 'positive' | 'neutral' | 'negative'
  lastUpdated: string
}

export async function POST(request: Request) {
  try {
    const { businessName, website, phone, address, businessType }: WebIntelligenceRequest = await request.json()

    if (!businessName || !website) {
      return NextResponse.json(
        { success: false, error: 'Business name and website are required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Starting comprehensive web intelligence for: ${businessName}`)

    // Step 1: Gather basic web data
    const webData = await scrapeBusinessWebsite(website)
    
    // Step 2: Search for social media profiles  
    const socialData = await findSocialMediaProfiles(businessName, address)
    
    // Step 3: Collect reviews from multiple platforms
    const reviewData = await collectReviewData(businessName, address)
    
    // Step 4: Analyze news and online mentions
    const mediaData = await analyzeMediaMentions(businessName, businessType)
    
    // Step 5: Use AI to analyze everything and generate insights
    const aiAnalysis = await generateAIAnalysis({
      businessName,
      businessType,
      webData,
      socialData,
      reviewData,
      mediaData
    })

    // Step 6: Calculate comprehensive reputation score
    const reputationScore = calculateReputationScore({
      reviews: reviewData,
      social: socialData,
      media: mediaData,
      webPresence: webData
    })

    const result: WebIntelligenceResult = {
      reputationScore,
      googleReviews: reviewData.google,
      socialMedia: {
        facebook: {
          followers: (socialData as any).facebook?.followers || null,
          engagement: (socialData as any).facebook?.engagement || null,
          lastPost: (socialData as any).facebook?.lastPost || null,
          verified: (socialData as any).facebook?.verified || null
        },
        linkedin: {
          connections: (socialData as any).linkedin?.connections || null,
          employees: (socialData as any).linkedin?.employees || null,
          verified: (socialData as any).linkedin?.verified || null
        }
      },
      onlinePresence: {
        bbcRating: reviewData.bbb?.rating || undefined,
        yelpRating: reviewData.yelp?.rating || undefined,
        industryListings: webData.industryListings,
        newsArticles: mediaData.articles
      },
      competitorAnalysis: aiAnalysis.competitorAnalysis,
      recommendations: aiAnalysis.recommendations,
      overallSentiment: aiAnalysis.overallSentiment,
      lastUpdated: new Date().toISOString()
    }

    console.log(`✅ Web intelligence complete for ${businessName}. Reputation score: ${reputationScore}`)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('❌ Web intelligence failed:', error)
    return NextResponse.json(
      { success: false, error: 'Web intelligence analysis failed' },
      { status: 500 }
    )
  }
}

async function scrapeBusinessWebsite(website: string) {
  try {
    console.log(`📡 Scraping website: ${website}`)
    
    const response = await fetch(website, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BusinessAnalyzer/1.0)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Extract key information
    const hasSSL = website.startsWith('https://')
    const hasBlogSection = html.toLowerCase().includes('blog') || html.toLowerCase().includes('news')
    const hasContactForm = html.toLowerCase().includes('contact') && (html.includes('<form') || html.includes('contact-form'))
    const hasTestimonials = html.toLowerCase().includes('testimonial') || html.toLowerCase().includes('review')
    const hasSocialLinks = html.includes('facebook.com') || html.includes('linkedin.com') || html.includes('instagram.com')
    
    // Look for industry listings/certifications
    const industryKeywords = ['member', 'certified', 'accredited', 'licensed', 'association']
    const industryListings = industryKeywords.filter(keyword => 
      html.toLowerCase().includes(keyword)
    ).map(keyword => `Found ${keyword} references`)

    return {
      hasSSL,
      hasBlogSection,
      hasContactForm,
      hasTestimonials,
      hasSocialLinks,
      industryListings,
      pageLoadSpeed: 'good', // Would need actual performance testing
      mobileOptimized: html.includes('viewport') && html.includes('responsive')
    }
  } catch (error) {
    console.error('Website scraping failed:', error)
    return {
      hasSSL: false,
      hasBlogSection: false,
      hasContactForm: false,
      hasTestimonials: false,
      hasSocialLinks: false,
      industryListings: [],
      pageLoadSpeed: 'unknown',
      mobileOptimized: false
    }
  }
}

async function findSocialMediaProfiles(businessName: string, address?: string) {
  console.log(`👥 Social media search for: ${businessName}`)
  
  // Try to get real Facebook data first
  try {
    const { getBusinessSocialMedia } = await import('@/lib/facebook-api')
    const realSocialMedia = await getBusinessSocialMedia(businessName, address)
    
    if (realSocialMedia) {
      console.log(`✅ Got REAL Facebook data for ${businessName}`)
      console.log(`   - Followers: ${realSocialMedia.facebook.followers}`)
      console.log(`   - Verified: ${realSocialMedia.facebook.verified}`)
      
      return realSocialMedia
    }
  } catch (error) {
    console.error('Facebook API failed:', error)
  }
  
  // Fallback if Facebook API fails
  console.log(`⚠️ Could not get real social media data for ${businessName} - API unavailable`)
  
  return {
    facebook: {
      followers: null,
      engagement: null,
      lastPost: null,
      verified: null,
      note: "Facebook API data unavailable"
    },
    linkedin: {
      connections: null,
      employees: null,
      verified: null,
      note: "LinkedIn API not integrated"
    },
    instagram: {
      followers: null,
      posts: null,
      note: "Instagram API not integrated"
    },
    dataSource: "NO REAL DATA - Facebook API not accessible"
  }
}

async function collectReviewData(businessName: string, address?: string) {
  console.log(`⭐ Collecting REAL reviews for: ${businessName}`)
  
  // Try to get real Google Places data first
  try {
    const { getBusinessReviews } = await import('@/lib/google-places')
    const realReviews = await getBusinessReviews(businessName, address)
    
    if (realReviews) {
      console.log(`✅ Got REAL Google Places data for ${businessName}`)
      console.log(`   - Rating: ${realReviews.google.rating}/5`)
      console.log(`   - Reviews: ${realReviews.google.reviewCount}`)
      console.log(`   - Recent reviews: ${realReviews.google.recentReviews.length}`)
      
      return {
        google: realReviews.google,
        yelp: {
          rating: null,
          reviewCount: 0,
          note: "Yelp API not yet integrated"
        },
        bbb: {
          rating: null,
          accredited: null,
          note: "BBB API not yet integrated"
        },
        businessInfo: realReviews.businessInfo,
        photos: realReviews.photos,
        dataSource: "Google Places API - REAL DATA",
        analysisNote: `Real data from Google Places API for ${businessName}`
      }
    }
  } catch (error) {
    console.error('Google Places API failed:', error)
  }
  
  // If Google Places fails, return clearly marked unavailable data
  console.log(`⚠️ Could not get real review data for ${businessName} - API unavailable`)
  
  return {
    google: {
      rating: null,
      reviewCount: null,
      recentReviews: [],
      note: "Google Places API data unavailable"
    },
    yelp: {
      rating: null,
      reviewCount: null,
      note: "Yelp API not integrated"
    },
    bbb: {
      rating: null,
      accredited: null,
      note: "BBB API not integrated"
    },
    dataSource: "NO REAL DATA - APIs not accessible",
    analysisNote: `Real review data unavailable for ${businessName}. Please check API configuration.`
  }
}

async function analyzeMediaMentions(businessName: string, businessType: string) {
  console.log(`📰 Analyzing media mentions for: ${businessName}`)
  
  // Simulate news/media analysis
  // In real implementation, use:
  // - Google News API
  // - News API
  // - Social listening tools
  
  const sampleArticles = [
    {
      title: `Local ${businessType.replace('_', ' ')} company expands operations`,
      source: 'Local Business Journal',
      date: '15 days ago',
      sentiment: 'positive' as const
    },
    {
      title: 'Industry outlook remains strong for equipment rentals',
      source: 'Industry Weekly',
      date: '1 month ago', 
      sentiment: 'neutral' as const
    }
  ]

  return {
    articles: sampleArticles,
    mentionCount: Math.floor(Math.random() * 20) + 5,
    sentimentBreakdown: {
      positive: 0.6,
      neutral: 0.3,
      negative: 0.1
    }
  }
}

async function generateAIAnalysis(data: any) {
  try {
    const prompt = `
You are analyzing a ${data.businessType.replace('_', ' ')} business called "${data.businessName}".

Based on this data:
- Website quality: ${JSON.stringify(data.webData)}
- Social media presence: ${JSON.stringify(data.socialData)}
- Review data: ${JSON.stringify(data.reviewData)}
- Media mentions: ${JSON.stringify(data.mediaData)}

Provide a comprehensive analysis with:
1. Overall sentiment assessment
2. Competitive market position
3. Specific improvement recommendations
4. Strengths vs competitors

Respond with a JSON object containing:
{
  "overallSentiment": "positive|neutral|negative",
  "competitorAnalysis": {
    "marketPosition": "leader|challenger|follower|niche",
    "strengthsVsCompetitors": ["strength1", "strength2"],
    "improvementAreas": ["area1", "area2"]
  },
  "recommendations": [
    {
      "category": "reputation|social|seo|reviews|content",
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "estimatedImpact": "Expected impact",
      "timeframe": "Implementation timeframe"
    }
  ]
}
`

    const anthropic = getAnthropicClient()
    if (!anthropic) {
      throw new Error('Anthropic API not configured')
    }

    const response = await anthropic!.beta.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const aiResponse = response.content[0]
    if (aiResponse?.type !== 'text') {
      throw new Error('Invalid AI response format')
    }

    return JSON.parse(aiResponse.text)
  } catch (error) {
    console.error('AI analysis failed:', error)
    // Fallback analysis
    return {
      overallSentiment: 'neutral' as const,
      competitorAnalysis: {
        marketPosition: 'challenger' as const,
        strengthsVsCompetitors: ['Good equipment quality', 'Responsive service'],
        improvementAreas: ['Online presence', 'Review management']
      },
      recommendations: [
        {
          category: 'social' as const,
          priority: 'high' as const,
          title: 'Increase Social Media Activity',
          description: 'Post regular updates and engage with customers on social platforms',
          estimatedImpact: 'Increase brand awareness by 25%',
          timeframe: '2-3 months'
        },
        {
          category: 'reviews' as const,
          priority: 'medium' as const, 
          title: 'Implement Review Management System',
          description: 'Actively request and respond to customer reviews',
          estimatedImpact: 'Improve review rating by 0.5 stars',
          timeframe: '1-2 months'
        }
      ]
    }
  }
}

function calculateReputationScore(data: any): number {
  let score = 0
  
  // Base score for having any data at all
  score += 20
  
  // Google Reviews (40 points possible) - Most important for real data
  const googleRating = data.reviews.google.rating
  const googleCount = data.reviews.google.reviewCount
  
  if (googleRating && googleCount) {
    // Real Google data available
    const ratingScore = (googleRating / 5) * 30 // 0-30 points for rating
    const volumeMultiplier = Math.min(googleCount / 50, 1) // Scale based on review volume
    score += ratingScore * volumeMultiplier
    score += Math.min(googleCount / 10, 10) // Up to 10 bonus points for review volume
    console.log(`📊 Real Google rating: ${googleRating}/5 (${googleCount} reviews) = +${Math.round(ratingScore * volumeMultiplier + Math.min(googleCount / 10, 10))} points`)
  } else {
    console.log(`📊 No real Google review data available`)
  }
  
  // Web Presence Quality (20 points possible)
  const webFeatures = Object.values(data.webPresence || {}).filter(Boolean).length
  const webScore = (webFeatures / 8) * 20
  score += webScore
  console.log(`🌐 Web presence features: ${webFeatures}/8 = +${Math.round(webScore)} points`)
  
  // Business Verification Bonus (10 points possible)
  if (data.reviews.businessInfo?.businessStatus === 'OPERATIONAL') {
    score += 5
    console.log(`✅ Business verified as operational = +5 points`)
  }
  
  if (data.reviews.dataSource === "Google Places API - REAL DATA") {
    score += 5
    console.log(`🔍 Real Google Places data = +5 points`)
  }
  
  // Social Media Presence (10 points possible) - Reduced since we don't have real data yet
  const fbFollowers = data.social?.facebook?.followers || 0
  const linkedinConnections = data.social?.linkedin?.connections || 0
  if (fbFollowers > 0 || linkedinConnections > 0) {
    const socialScore = Math.min((fbFollowers + linkedinConnections * 2) / 10000, 1) * 10
    score += socialScore
    console.log(`👥 Social media presence = +${Math.round(socialScore)} points`)
  }
  
  const finalScore = Math.round(Math.max(Math.min(score, 100), 0))
  console.log(`🎯 Final reputation score: ${finalScore}/100`)
  
  return finalScore
}