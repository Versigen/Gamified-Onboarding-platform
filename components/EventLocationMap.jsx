import React, { useState, useCallback } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { MapPin, Plus, Edit, Trash2, Save, X } from 'lucide-react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDrCd_DA3CRYya-Eyq_9lzWkb1L9KWCx9c'

// Map component that handles Google Maps initialization and interaction
const Map = ({ center, zoom, onLocationSelect, location, waypoints, onWaypointsChange }) => {
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
      })

      // Add click listener for location selection
      mapInstance.addListener('click', (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onLocationSelect({ lat, lng })
      })

      setMap(mapInstance)
    }
  }, [center, zoom, onLocationSelect])

  // Update markers when location or waypoints change
  React.useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers = []

    // Add main location marker
    if (location) {
      const locationMarker = new window.google.maps.Marker({
        position: location,
        map,
        title: 'Event Location',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        }
      })
      newMarkers.push(locationMarker)
    }

    // Add waypoint markers
    waypoints.forEach((waypoint, index) => {
      const waypointMarker = new window.google.maps.Marker({
        position: { lat: waypoint.lat, lng: waypoint.lng },
        map,
        title: waypoint.label,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="blue" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${index + 1}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        }
      })

      // Add info window for waypoints
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold;">${waypoint.label}</h4>
            <p style="margin: 0; font-size: 14px; color: #666;">${waypoint.description}</p>
          </div>
        `
      })

      waypointMarker.addListener('click', () => {
        infoWindow.open(map, waypointMarker)
      })

      newMarkers.push(waypointMarker)
    })

    setMarkers(newMarkers)
  }, [map, location, waypoints])

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />
}

const EventLocationMap = ({ 
  location, 
  onLocationChange, 
  waypoints = [], 
  onWaypointsChange,
  className = '' 
}) => {
  const [showWaypointForm, setShowWaypointForm] = useState(false)
  const [editingWaypoint, setEditingWaypoint] = useState(null)
  const [waypointForm, setWaypointForm] = useState({
    label: '',
    description: '',
    lat: null,
    lng: null
  })

  // Default center (Singapore)
  const defaultCenter = { lat: 1.3521, lng: 103.8198 }
  const center = location || defaultCenter

  const handleLocationSelect = (newLocation) => {
    if (showWaypointForm) {
      // If waypoint form is open, set the location for the waypoint
      setWaypointForm(prev => ({
        ...prev,
        lat: newLocation.lat,
        lng: newLocation.lng
      }))
    } else {
      // Otherwise, set the main event location
      onLocationChange(newLocation)
    }
  }

  const handleAddWaypoint = () => {
    setShowWaypointForm(true)
    setEditingWaypoint(null)
    setWaypointForm({
      label: '',
      description: '',
      lat: null,
      lng: null
    })
  }

  const handleEditWaypoint = (index) => {
    const waypoint = waypoints[index]
    setEditingWaypoint(index)
    setShowWaypointForm(true)
    setWaypointForm(waypoint)
  }

  const handleSaveWaypoint = () => {
    if (!waypointForm.label || !waypointForm.lat || !waypointForm.lng) {
      alert('Please fill in all fields and click on the map to set location')
      return
    }

    const newWaypoints = [...waypoints]
    if (editingWaypoint !== null) {
      newWaypoints[editingWaypoint] = waypointForm
    } else {
      newWaypoints.push(waypointForm)
    }

    onWaypointsChange(newWaypoints)
    setShowWaypointForm(false)
    setEditingWaypoint(null)
    setWaypointForm({
      label: '',
      description: '',
      lat: null,
      lng: null
    })
  }

  const handleDeleteWaypoint = (index) => {
    if (confirm('Are you sure you want to delete this waypoint?')) {
      const newWaypoints = waypoints.filter((_, i) => i !== index)
      onWaypointsChange(newWaypoints)
    }
  }

  const handleCancelWaypoint = () => {
    setShowWaypointForm(false)
    setEditingWaypoint(null)
    setWaypointForm({
      label: '',
      description: '',
      lat: null,
      lng: null
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Map Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on the map to set the main event location (red marker)</li>
          <li>• Use "Add Waypoint" to add specific points like Registration Counter, Bicycle Return Point, etc.</li>
          <li>• When adding waypoints, click on the map after entering the label and description</li>
          <li>• Click on waypoint markers to see their details</li>
        </ul>
      </div>

      {/* Map Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            center={center}
            zoom={15}
            onLocationSelect={handleLocationSelect}
            location={location}
            waypoints={waypoints}
            onWaypointsChange={onWaypointsChange}
          />
        </Wrapper>
      </div>

      {/* Location Info */}
      {location && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Event Location Set</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Waypoints Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Waypoints</h4>
          <button
            type="button"
            onClick={handleAddWaypoint}
            disabled={showWaypointForm}
            className="btn-primary text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Add Waypoint</span>
          </button>
        </div>

        {/* Waypoint Form */}
        {showWaypointForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">
              {editingWaypoint !== null ? 'Edit Waypoint' : 'Add New Waypoint'}
            </h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={waypointForm.label}
                  onChange={(e) => setWaypointForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Registration Counter, Bicycle Return Point"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={waypointForm.description}
                  onChange={(e) => setWaypointForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this waypoint"
                  rows="2"
                  className="input-field"
                />
              </div>
              {waypointForm.lat && waypointForm.lng && (
                <div className="text-sm text-green-600">
                  ✓ Location set: {waypointForm.lat.toFixed(6)}, {waypointForm.lng.toFixed(6)}
                </div>
              )}
              {!waypointForm.lat && (
                <div className="text-sm text-gray-500">
                  Click on the map to set the waypoint location
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleSaveWaypoint}
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelWaypoint}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Waypoints List */}
        {waypoints.length > 0 && (
          <div className="space-y-2">
            {waypoints.map((waypoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <h5 className="font-medium text-blue-900">{waypoint.label}</h5>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{waypoint.description}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleEditWaypoint(index)}
                    disabled={showWaypointForm}
                    className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteWaypoint(index)}
                    disabled={showWaypointForm}
                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventLocationMap