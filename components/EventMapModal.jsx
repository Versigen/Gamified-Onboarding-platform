import React, { useState, useCallback } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { MapPin, X, ZoomIn, ZoomOut } from 'lucide-react'
import Modal from './Modal'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDrCd_DA3CRYya-Eyq_9lzWkb1L9KWCx9c'

/**
 * ReadOnlyMap - A Google Maps component for displaying event locations and waypoints
 * in read-only mode for volunteers to view event details
 */
const ReadOnlyMap = ({ center, zoom, location, waypoints, eventName }) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  const ref = useCallback((node) => {
    if (node) {
      const mapInstance = new window.google.maps.Map(node, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        disableDefaultUI: false,
      })

      setMap(mapInstance)
    }
  }, [center, zoom])

  // Update markers when location or waypoints change
  React.useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers = []

    // Add main location marker (red)
    if (location) {
      const locationMarker = new window.google.maps.Marker({
        position: location,
        map,
        title: `${eventName} - Main Location`,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      })

      // Add info window for main location
      const locationInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #dc2626;">${eventName}</h4>
            <p style="margin: 0; font-size: 12px; color: #374151;">Main Event Location</p>
          </div>
        `
      })

      locationMarker.addListener('click', () => {
        locationInfoWindow.open(map, locationMarker)
      })

      newMarkers.push(locationMarker)
    }

    // Add waypoint markers (blue with numbers)
    waypoints.forEach((waypoint, index) => {
      const waypointMarker = new window.google.maps.Marker({
        position: { lat: waypoint.lat, lng: waypoint.lng },
        map,
        title: waypoint.label,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10" fill="#2563eb"/>
              <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="white">${index + 1}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      })

      // Add info window for waypoints
      const waypointInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #2563eb;">${waypoint.label}</h4>
            <p style="margin: 0; font-size: 12px; color: #374151;">${waypoint.description}</p>
          </div>
        `
      })

      waypointMarker.addListener('click', () => {
        waypointInfoWindow.open(map, waypointMarker)
      })

      newMarkers.push(waypointMarker)
    })

    setMarkers(newMarkers)

    // Adjust map bounds to fit all markers if we have multiple points
    if (newMarkers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
      
      // Add some padding
      const padding = { top: 20, right: 20, bottom: 20, left: 20 }
      map.fitBounds(bounds, padding)
    }

  }, [map, location, waypoints, eventName, markers])

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />
}

/**
 * EventMapModal - Modal component for displaying event location and waypoints
 * to volunteers in a user-friendly, mobile-responsive interface
 * 
 * Features:
 * - Read-only map display with event location and waypoints
 * - Mobile-friendly responsive design
 * - Marker info windows with event details
 * - Easy close functionality (ESC key, backdrop click, close button)
 * - Automatic map bounds adjustment for optimal viewing
 */
const EventMapModal = ({ isOpen, onClose, event }) => {
  if (!event || (!event.locationCoords && (!event.waypoints || event.waypoints.length === 0))) {
    return null
  }

  // Determine map center - use main location if available, otherwise center on first waypoint
  const center = event.locationCoords || 
    (event.waypoints && event.waypoints.length > 0 ? 
      { lat: event.waypoints[0].lat, lng: event.waypoints[0].lng } : 
      { lat: 1.3521, lng: 103.8198 }) // Default to Singapore

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`${event.name} - Event Map`}
      className="max-w-4xl"
      showCloseButton={true}
      closeOnBackdropClick={true}
    >
      <div className="space-y-4">
        {/* Map Display */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          <Wrapper apiKey={GOOGLE_MAPS_API_KEY}>
            <ReadOnlyMap
              center={center}
              zoom={15}
              location={event.locationCoords}
              waypoints={event.waypoints || []}
              eventName={event.name}
            />
          </Wrapper>
        </div>

        {/* Event Location Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Event Location</h3>
              <p className="text-sm text-gray-700">{event.location}</p>
              {event.locationCoords && (
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates: {event.locationCoords.lat.toFixed(6)}, {event.locationCoords.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Waypoints Information */}
        {event.waypoints && event.waypoints.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full mr-2">
                {event.waypoints.length}
              </span>
              Important Waypoints
            </h3>
            <div className="space-y-2">
              {event.waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">{waypoint.label}</h4>
                    <p className="text-sm text-blue-700">{waypoint.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile-friendly instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800">How to use this map:</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Click on markers to see location details</li>
                <li>• Use zoom controls to get a better view</li>
                <li>• Red marker shows the main event location</li>
                <li>• Blue numbered markers show important waypoints</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EventMapModal