'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation, MapPin, Clock, Fuel, Route } from 'lucide-react'

interface RouteStop {
  id: string
  address: string
  customerName: string
  equipment: string
  type: 'pickup' | 'delivery'
  timeWindow: string
  lat?: number
  lng?: number
}

interface GoogleMapsRouteProps {
  stops: RouteStop[]
  onRouteOptimized?: (optimizedStops: RouteStop[]) => void
}

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

export default function GoogleMapsRoute({ stops, onRouteOptimized }: GoogleMapsRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [directionsService, setDirectionsService] = useState<any>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null)
  const [routeInfo, setRouteInfo] = useState<{
    distance: string
    duration: string
    fuel: string
  }>()
  const [isLoading, setIsLoading] = useState(false)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      setMapsLoaded(true)
      return
    }

    window.initGoogleMaps = () => {
      setMapsLoaded(true)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry&callback=initGoogleMaps`
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (mapsLoaded && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 44.2619, lng: -88.4154 }, // Appleton, WI default
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const directionsService = new window.google.maps.DirectionsService()
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4,
        },
      })

      directionsRenderer.setMap(googleMap)

      setMap(googleMap)
      setDirectionsService(directionsService)
      setDirectionsRenderer(directionsRenderer)
    }
  }, [mapsLoaded, map])

  // Calculate optimized route
  const calculateRoute = async () => {
    if (!directionsService || !directionsRenderer || stops.length < 2) return

    setIsLoading(true)

    try {
      // Geocode addresses first
      const geocoder = new window.google.maps.Geocoder()
      const geocodedStops = await Promise.all(
        stops.map(async (stop) => {
          try {
            const result = await new Promise((resolve, reject) => {
              geocoder.geocode({ address: stop.address }, (results: any, status: any) => {
                if (status === 'OK') {
                  resolve(results[0])
                } else {
                  reject(new Error(`Geocoding failed: ${status}`))
                }
              })
            })
            
            const location = (result as any).geometry.location
            return {
              ...stop,
              lat: location.lat(),
              lng: location.lng(),
            }
          } catch (error) {
            console.error(`Failed to geocode ${stop.address}:`, error)
            return stop
          }
        })
      )

      // Calculate route with waypoints
      const origin = geocodedStops[0]
      const destination = geocodedStops[geocodedStops.length - 1]
      const waypoints = geocodedStops.slice(1, -1).map(stop => ({
        location: { lat: stop.lat, lng: stop.lng },
        stopover: true,
      }))

      const request = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      }

      const result = await new Promise((resolve, reject) => {
        directionsService.route(request, (response: any, status: any) => {
          if (status === 'OK') {
            resolve(response)
          } else {
            reject(new Error(`Directions request failed: ${status}`))
          }
        })
      })

      const response = result as any
      directionsRenderer.setDirections(response)

      // Calculate total distance and time
      const route = response.routes[0]
      let totalDistance = 0
      let totalDuration = 0

      route.legs.forEach((leg: any) => {
        totalDistance += leg.distance.value
        totalDuration += leg.duration.value
      })

      const distanceMiles = (totalDistance * 0.000621371).toFixed(1)
      const durationHours = Math.floor(totalDuration / 3600)
      const durationMinutes = Math.floor((totalDuration % 3600) / 60)
      const estimatedFuel = (parseFloat(distanceMiles) / 8).toFixed(1) // Assume 8 MPG for truck

      setRouteInfo({
        distance: `${distanceMiles} mi`,
        duration: durationHours > 0 
          ? `${durationHours}h ${durationMinutes}m`
          : `${durationMinutes}m`,
        fuel: `${estimatedFuel} gal`,
      })

      // Return optimized waypoint order
      if (response.routes[0].waypoint_order && onRouteOptimized) {
        const optimizedOrder = response.routes[0].waypoint_order
        const optimizedStops = [
          geocodedStops[0],
          ...optimizedOrder.map(index => geocodedStops[index + 1]),
          geocodedStops[geocodedStops.length - 1],
        ]
        onRouteOptimized(optimizedStops)
      }

    } catch (error) {
      console.error('Route calculation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-calculate route when stops change
  useEffect(() => {
    if (stops.length >= 2 && mapsLoaded && directionsService) {
      calculateRoute()
    }
  }, [stops, mapsLoaded, directionsService])

  const openInGoogleMaps = () => {
    const waypoints = stops.slice(1, -1)
      .map(stop => encodeURIComponent(stop.address))
      .join('|')
    
    const url = `https://www.google.com/maps/dir/${encodeURIComponent(stops[0].address)}/${waypoints}/${encodeURIComponent(stops[stops.length - 1].address)}`
    window.open(url, '_blank')
  }

  if (!mapsLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading Maps...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Route Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Optimized Route
            </CardTitle>
            <Button 
              onClick={openInGoogleMaps}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Open in Maps
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-64 rounded-lg border"
            style={{ minHeight: '300px' }}
          />
        </CardContent>
      </Card>

      {/* Route Information */}
      {routeInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold">{routeInfo.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Drive Time</p>
                  <p className="font-semibold">{routeInfo.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Est. Fuel</p>
                  <p className="font-semibold">{routeInfo.fuel}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stop List */}
      <Card>
        <CardHeader>
          <CardTitle>Route Stops ({stops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{stop.customerName}</p>
                    <Badge variant={stop.type === 'delivery' ? 'default' : 'secondary'}>
                      {stop.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stop.address}</p>
                  <p className="text-sm text-gray-500">{stop.equipment} • {stop.timeWindow}</p>
                </div>
              </div>
            ))}
          </div>
          
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Optimizing route...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}