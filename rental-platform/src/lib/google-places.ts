interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
    relative_time_description: string
  }>
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  business_status?: string
  types: string[]
}

interface PlacesSearchResult {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  types: string[]
  business_status?: string
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function searchBusinessByName(businessName: string, address?: string): Promise<PlacesSearchResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured')
  }

  const query = address ? `${businessName} ${address}` : businessName
  
  // Use the NEW Places API (Text Search)
  const searchUrl = `https://places.googleapis.com/v1/places:searchText`

  console.log(`🔍 Searching Google Places (NEW API) for: "${query}"`)

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.businessStatus'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 5
      })
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log(`✅ Found ${data.places?.length || 0} places for "${businessName}"`)
    
    // Transform new API response to match our interface
    return (data.places || []).map((place: any) => ({
      place_id: place.id,
      name: place.displayName?.text || '',
      formatted_address: place.formattedAddress || '',
      rating: place.rating,
      user_ratings_total: place.userRatingCount,
      types: place.types || [],
      business_status: place.businessStatus
    }))

  } catch (error) {
    console.error('Google Places search failed:', error)
    throw error
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured')
  }

  // Use the NEW Places API (Get Place)
  const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}`

  console.log(`📍 Getting details for place ID: ${placeId}`)

  try {
    const response = await fetch(detailsUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,rating,userRatingCount,reviews,photos,businessStatus,types'
      }
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
    }

    const place = await response.json()
    
    console.log(`✅ Retrieved details for: ${place.displayName?.text}`)
    
    // Transform new API response to match our interface
    return {
      place_id: place.id,
      name: place.displayName?.text || '',
      formatted_address: place.formattedAddress || '',
      formatted_phone_number: place.nationalPhoneNumber || '',
      website: place.websiteUri || '',
      rating: place.rating,
      user_ratings_total: place.userRatingCount,
      reviews: (place.reviews || []).map((review: any) => ({
        author_name: review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating || 0,
        text: review.text?.text || '',
        time: Date.parse(review.publishTime) / 1000,
        relative_time_description: review.relativePublishTimeDescription || 'Unknown'
      })),
      photos: (place.photos || []).map((photo: any) => ({
        photo_reference: photo.name,
        height: photo.heightPx || 400,
        width: photo.widthPx || 400
      })),
      business_status: place.businessStatus,
      types: place.types || []
    }

  } catch (error) {
    console.error('Google Places details failed:', error)
    return null
  }
}

export async function getBusinessReviews(businessName: string, address?: string) {
  try {
    // Step 1: Search for the business
    const searchResults = await searchBusinessByName(businessName, address)
    
    if (searchResults.length === 0) {
      console.log(`⚠️ No Google Places results found for: ${businessName}`)
      return null
    }

    // Step 2: Get the most relevant result (first one is usually best match)
    const bestMatch = searchResults[0]
    console.log(`🎯 Best match: ${bestMatch.name} at ${bestMatch.formatted_address}`)

    // Step 3: Get detailed information including reviews
    const placeDetails = await getPlaceDetails(bestMatch.place_id)
    
    if (!placeDetails) {
      console.log(`⚠️ Could not get details for place: ${bestMatch.place_id}`)
      return null
    }

    // Step 4: Format the review data
    const reviews = {
      google: {
        rating: placeDetails.rating || 0,
        reviewCount: placeDetails.user_ratings_total || 0,
        recentReviews: (placeDetails.reviews || []).slice(0, 5).map(review => ({
          rating: review.rating,
          text: review.text,
          date: review.relative_time_description,
          author: review.author_name
        })),
        verified: true,
        placeId: placeDetails.place_id
      },
      businessInfo: {
        name: placeDetails.name,
        address: placeDetails.formatted_address,
        phone: placeDetails.formatted_phone_number,
        website: placeDetails.website,
        businessStatus: placeDetails.business_status,
        types: placeDetails.types
      },
      photos: placeDetails.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) || []
    }

    console.log(`✅ Retrieved ${reviews.google.recentReviews.length} real reviews for ${businessName}`)
    return reviews

  } catch (error) {
    console.error('Failed to get real business reviews:', error)
    return null
  }
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key not configured')
  }
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}