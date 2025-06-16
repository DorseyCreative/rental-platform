interface FacebookPageInfo {
  id: string
  name: string
  followers_count?: number
  fan_count?: number
  engagement?: {
    count: number
    rate: number
  }
  verification_status?: string
  is_verified?: boolean
  category?: string
  website?: string
  about?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
}

interface FacebookSearchResult {
  data: Array<{
    id: string
    name: string
  }>
}

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

export async function getAccessToken(): Promise<string> {
  if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
    throw new Error('Facebook API credentials not configured')
  }

  const tokenUrl = `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`

  try {
    const response = await fetch(tokenUrl)
    if (!response.ok) {
      throw new Error(`Facebook token request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Facebook access token obtained')
    return data.access_token

  } catch (error) {
    console.error('Facebook access token failed:', error)
    throw error
  }
}

export async function searchFacebookPages(businessName: string, location?: string): Promise<FacebookSearchResult> {
  try {
    const accessToken = await getAccessToken()
    const query = location ? `${businessName} ${location}` : businessName
    
    const searchUrl = `https://graph.facebook.com/v18.0/search?q=${encodeURIComponent(query)}&type=page&fields=id,name&access_token=${accessToken}&limit=5`

    console.log(`🔍 Searching Facebook pages for: "${query}"`)

    const response = await fetch(searchUrl)
    if (!response.ok) {
      throw new Error(`Facebook search failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Found ${data.data?.length || 0} Facebook pages for "${businessName}"`)
    
    return data

  } catch (error) {
    console.error('Facebook page search failed:', error)
    throw error
  }
}

export async function getFacebookPageDetails(pageId: string): Promise<FacebookPageInfo | null> {
  try {
    const accessToken = await getAccessToken()
    
    // Get page details with all available public fields
    const fields = [
      'id',
      'name', 
      'fan_count',
      'followers_count',
      'is_verified',
      'verification_status',
      'category',
      'website',
      'about',
      'location'
    ].join(',')

    const pageUrl = `https://graph.facebook.com/v18.0/${pageId}?fields=${fields}&access_token=${accessToken}`

    console.log(`📊 Getting Facebook page details for ID: ${pageId}`)

    const response = await fetch(pageUrl)
    if (!response.ok) {
      throw new Error(`Facebook page details failed: ${response.status} ${response.statusText}`)
    }

    const pageData = await response.json()
    
    if (pageData.error) {
      throw new Error(`Facebook API error: ${pageData.error.message}`)
    }

    console.log(`✅ Retrieved Facebook page details for: ${pageData.name}`)
    
    return pageData

  } catch (error) {
    console.error('Facebook page details failed:', error)
    return null
  }
}

export async function getBusinessSocialMedia(businessName: string, address?: string) {
  try {
    console.log(`👥 Searching Facebook for business: ${businessName}`)
    
    // Step 1: Search for Facebook pages
    const searchResults = await searchFacebookPages(businessName, address)
    
    if (!searchResults.data || searchResults.data.length === 0) {
      console.log(`⚠️ No Facebook pages found for: ${businessName}`)
      return null
    }

    // Step 2: Get the best match (first result is usually best)
    const bestMatch = searchResults.data[0]
    console.log(`🎯 Best Facebook match: ${bestMatch.name} (ID: ${bestMatch.id})`)

    // Step 3: Get detailed page information
    const pageDetails = await getFacebookPageDetails(bestMatch.id)
    
    if (!pageDetails) {
      console.log(`⚠️ Could not get details for Facebook page: ${bestMatch.id}`)
      return null
    }

    // Step 4: Format the social media data
    const socialMediaData = {
      facebook: {
        pageId: pageDetails.id,
        name: pageDetails.name,
        followers: pageDetails.fan_count || pageDetails.followers_count || 0,
        verified: pageDetails.is_verified || false,
        category: pageDetails.category,
        website: pageDetails.website,
        about: pageDetails.about,
        location: pageDetails.location,
        dataSource: "Facebook Graph API - REAL DATA"
      },
      linkedin: {
        // Will be implemented when LinkedIn API is added
        connections: null,
        employees: null,
        verified: null,
        note: "LinkedIn API not yet integrated"
      },
      instagram: {
        // Could be implemented with Instagram Basic Display API
        followers: null,
        posts: null,
        note: "Instagram API not yet integrated"
      },
      dataSource: "Facebook Graph API - REAL DATA"
    }

    console.log(`✅ Retrieved real Facebook data for ${businessName}:`)
    console.log(`   - Page: ${pageDetails.name}`)
    console.log(`   - Followers: ${socialMediaData.facebook.followers}`)
    console.log(`   - Verified: ${socialMediaData.facebook.verified}`)
    
    return socialMediaData

  } catch (error) {
    console.error('Failed to get Facebook business data:', error)
    return null
  }
}