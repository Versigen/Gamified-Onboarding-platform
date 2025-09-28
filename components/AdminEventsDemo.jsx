import React, { useState } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { createMockEvents } from '../utils/testData'
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Map
} from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDrCd_DA3CRYya-Eyq_9lzWkb1L9KWCx9c'

/**
 * AdminReadOnlyMap - A compact Google Maps component for displaying event locations 
 * and waypoints in the admin event viewing modal (DEMO VERSION)
 */
const AdminReadOnlyMap = ({ center, zoom, location, waypoints, eventName }) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  const ref = React.useCallback((node) => {
    if (node) {
      const mapInstance = new window.google.maps.Map(node, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        disableDefaultUI: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT
        }
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

  return <div ref={ref} style={{ width: '100%', height: '350px' }} />
}

/**
 * AdminEventsDemo - Demo component to showcase the new admin event viewing map functionality
 * This component demonstrates the admin view map feature without requiring authentication
 */
const AdminEventsDemo = () => {
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const mockEvents = createMockEvents()

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setShowViewModal(true)
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A'
    return dateValue.toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Admin Events Demo</h1>
          <p className="text-primary-100 mt-1">Testing the new map functionality in admin event viewing</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Demo Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">🎯 Admin Map Demo</h2>
          <p className="text-blue-800 mb-2">
            This demo showcases the new Google Maps integration in the admin event viewing modal.
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click the <Eye className="inline h-4 w-4 mx-1" /> "View" button to see event details with embedded map</li>
            <li>• Map appears only for events with location coordinates or waypoints</li>
            <li>• Red markers show main event locations, blue numbered markers show waypoints</li>
            <li>• Mobile-friendly responsive design with zoom controls</li>
          </ul>
        </div>

        {/* Events List */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEvents.map((event) => {
                  const totalRequired = event.roles?.reduce((sum, role) => sum + (role.requiredCount || 0), 0) || 0
                  const totalSignedUp = event.volunteers?.length || 0

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {event.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)} {event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{totalSignedUp}/{totalRequired}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.roles?.length || 0} roles
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                          {event.status || 'open'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewEvent(event)}
                            className="text-primary-600 hover:text-primary-900"
                            title="View event details with map"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900" title="Edit event">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Delete event">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Event Modal with Map */}
      {showViewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedEvent(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedEvent.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Registration closes: {formatDate(selectedEvent.closingDate)}</span>
                        </div>
                      </div>
                      {selectedEvent.description && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Status & Stats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvent.status)}`}>
                          {selectedEvent.status || 'open'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Volunteers:</span>
                        <span className="text-sm font-medium">{selectedEvent.volunteers?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Roles:</span>
                        <span className="text-sm font-medium">{selectedEvent.roles?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Location Map */}
                {(selectedEvent.locationCoords || (selectedEvent.waypoints && selectedEvent.waypoints.length > 0)) && (
                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <Map className="h-5 w-5 text-primary-600 mr-2" />
                      Event Location
                    </h4>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                      <Wrapper apiKey={GOOGLE_MAPS_API_KEY}>
                        <AdminReadOnlyMap
                          center={selectedEvent.locationCoords || 
                            (selectedEvent.waypoints && selectedEvent.waypoints.length > 0 ? 
                              { lat: selectedEvent.waypoints[0].lat, lng: selectedEvent.waypoints[0].lng } : 
                              { lat: 1.3521, lng: 103.8198 })}
                          zoom={15}
                          location={selectedEvent.locationCoords}
                          waypoints={selectedEvent.waypoints || []}
                          eventName={selectedEvent.name}
                        />
                      </Wrapper>
                    </div>
                    
                    {/* Waypoints list for context */}
                    {selectedEvent.waypoints && selectedEvent.waypoints.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                          <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full mr-2">
                            {selectedEvent.waypoints.length}
                          </span>
                          Important Waypoints
                        </h5>
                        <div className="space-y-2">
                          {selectedEvent.waypoints.map((waypoint, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <h6 className="font-medium text-blue-900">{waypoint.label}</h6>
                                <p className="text-sm text-blue-700">{waypoint.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Show message when no map data available */}
                {!selectedEvent.locationCoords && (!selectedEvent.waypoints || selectedEvent.waypoints.length === 0) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Map className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">No location data available for this event</span>
                    </div>
                  </div>
                )}

                {/* Roles Section */}
                {selectedEvent.roles && selectedEvent.roles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Roles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedEvent.roles.map((role, index) => {
                        const volunteersInRole = selectedEvent.volunteers?.filter(v => v.selectedRole === role.name) || []
                        
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{role.name}</h4>
                              <span className="text-sm text-gray-600">
                                {volunteersInRole.length}/{role.requiredCount}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {volunteersInRole.length === 0 && (
                                <div className="text-sm text-gray-400 italic">No volunteers assigned</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedEvent(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEventsDemo