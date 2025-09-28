import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import EventLocationMap from '../components/EventLocationMap'
import { Wrapper } from '@googlemaps/react-wrapper'
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ChevronDown,
  X,
  Save,
  UserPlus,
  UserMinus,
  Map
} from 'lucide-react'
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getEventStats,
  getEvent
} from '../utils/firestore'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDrCd_DA3CRYya-Eyq_9lzWkb1L9KWCx9c'

/**
 * AdminReadOnlyMap - A compact Google Maps component for displaying event locations 
 * and waypoints in the admin event viewing modal
 * 
 * Features:
 * - Read-only map display optimized for admin viewing
 * - Clear markers for main location (red) and waypoints (blue with numbers)
 * - Info windows with event details on marker click
 * - Mobile-friendly responsive design
 * - Automatic bounds adjustment for optimal viewing
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

const AdminEventsPage = () => {
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    openEvents: 0,
    closedEvents: 0,
    confirmedEvents: 0,
    totalVolunteers: 0,
    avgVolunteersPerEvent: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    locationCoords: null, // { lat, lng }
    waypoints: [], // [{ label, description, lat, lng }]
    description: '',
    closingDate: '',
    roles: [{ name: 'General Volunteer', requiredCount: 1 }]
  })

  useEffect(() => {
    loadEvents()
    loadStats()
  }, [statusFilter])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const result = await getEvents({
        statusFilter,
        sortBy: 'date',
        sortOrder: 'asc',
        pageSize: 50,
        includeVolunteers: true
      })
      setEvents(result.events)
    } catch (error) {
      console.error('Error loading events:', error)
      alert('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getEventStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    
    // Validate that location coordinates are set
    if (!formData.locationCoords) {
      alert('Please set the event location by clicking on the map')
      return
    }
    
    try {
      await createEvent(formData)
      setShowCreateModal(false)
      resetForm()
      await loadEvents()
      await loadStats()
      alert('Event created successfully!')
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    }
  }

  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    
    // Validate that location coordinates are set
    if (!formData.locationCoords) {
      alert('Please set the event location by clicking on the map')
      return
    }
    
    try {
      await updateEvent(selectedEvent.id, formData)
      setShowEditModal(false)
      setSelectedEvent(null)
      resetForm()
      await loadEvents()
      await loadStats()
      alert('Event updated successfully!')
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This will also remove all volunteer signups.')) {
      return
    }

    try {
      await deleteEvent(eventId)
      await loadEvents()
      await loadStats()
      alert('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  const handleViewEvent = async (event) => {
    try {
      const eventData = await getEvent(event.id, true)
      setSelectedEvent(eventData)
      setShowViewModal(true)
    } catch (error) {
      console.error('Error loading event details:', error)
      alert('Failed to load event details')
    }
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setFormData({
      name: event.name || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      locationCoords: event.locationCoords || null,
      waypoints: event.waypoints || [],
      description: event.description || '',
      closingDate: event.closingDate || '',
      roles: event.roles || [{ name: 'General Volunteer', requiredCount: 1 }]
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      location: '',
      locationCoords: null,
      waypoints: [],
      description: '',
      closingDate: '',
      roles: [{ name: 'General Volunteer', requiredCount: 1 }]
    })
  }

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, { name: '', requiredCount: 1 }]
    }))
  }

  const removeRole = (index) => {
    if (formData.roles.length > 1) {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter((_, i) => i !== index)
      }))
    }
  }

  const updateRole = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return event.name?.toLowerCase().includes(searchLower) ||
           event.location?.toLowerCase().includes(searchLower) ||
           event.description?.toLowerCase().includes(searchLower)
  })

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A'
    
    let date
    if (dateValue.toDate) {
      date = dateValue.toDate()
    } else if (dateValue instanceof Date) {
      date = dateValue
    } else {
      date = new Date(dateValue)
    }
    
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
              <p className="text-gray-600">Create and manage cycling events</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.totalEvents}</h3>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.openEvents}</h3>
                <p className="text-sm text-gray-600">Open Events</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.totalVolunteers}</h3>
                <p className="text-sm text-gray-600">Total Volunteers</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.avgVolunteersPerEvent}</h3>
                <p className="text-sm text-gray-600">Avg per Event</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first event.'}
              </p>
            </div>
          ) : (
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
                  {filteredEvents.map((event) => {
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
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
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
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateEvent} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="Enter event name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="input-field"
                      placeholder="Enter location name (e.g., East Coast Park)"
                    />
                  </div>
                </div>

                {/* Location Section with Google Maps */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Location & Waypoints *
                    </label>
                    <EventLocationMap
                      location={formData.locationCoords}
                      onLocationChange={(coords) => setFormData(prev => ({ ...prev, locationCoords: coords }))}
                      waypoints={formData.waypoints}
                      onWaypointsChange={(waypoints) => setFormData(prev => ({ ...prev, waypoints }))}
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Closing Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.closingDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, closingDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field h-24"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>

                {/* Roles Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Volunteer Roles</h3>
                    <button
                      type="button"
                      onClick={addRole}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Role</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.roles.map((role, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Role name (e.g., Route Marshal, Registration)"
                            value={role.name}
                            onChange={(e) => updateRole(index, 'name', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            placeholder="Count"
                            value={role.requiredCount}
                            onChange={(e) => updateRole(index, 'requiredCount', parseInt(e.target.value) || 1)}
                            className="input-field"
                            required
                          />
                        </div>
                        {formData.roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRole(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdateEvent} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedEvent(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="Enter event name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="input-field"
                      placeholder="Enter location name (e.g., East Coast Park)"
                    />
                  </div>
                </div>

                {/* Location Section with Google Maps */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Location & Waypoints *
                    </label>
                    <EventLocationMap
                      location={formData.locationCoords}
                      onLocationChange={(coords) => setFormData(prev => ({ ...prev, locationCoords: coords }))}
                      waypoints={formData.waypoints}
                      onWaypointsChange={(waypoints) => setFormData(prev => ({ ...prev, waypoints }))}
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Closing Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.closingDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, closingDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field h-24"
                      placeholder="Enter event description"
                    />
                  </div>
                </div>

                {/* Roles Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Volunteer Roles</h3>
                    <button
                      type="button"
                      onClick={addRole}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Role</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.roles.map((role, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Role name (e.g., Route Marshal, Registration)"
                            value={role.name}
                            onChange={(e) => updateRole(index, 'name', e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            placeholder="Count"
                            value={role.requiredCount}
                            onChange={(e) => updateRole(index, 'requiredCount', parseInt(e.target.value) || 1)}
                            className="input-field"
                            required
                          />
                        </div>
                        {formData.roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRole(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedEvent(null)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Event Modal */}
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
                              {volunteersInRole.map((volunteer, volIndex) => (
                                <div key={volIndex} className="text-sm text-gray-600">
                                  {volunteer.volunteerName || volunteer.userId}
                                </div>
                              ))}
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

                {/* Volunteers List */}
                {selectedEvent.volunteers && selectedEvent.volunteers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Volunteers</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Volunteer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Signed Up
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedEvent.volunteers.map((volunteer, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {volunteer.volunteerName || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {volunteer.selectedRole || 'General Volunteer'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {volunteer.signedUpAt ? formatDate(volunteer.signedUpAt) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {volunteer.status || 'confirmed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditEvent(selectedEvent)
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
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

export default AdminEventsPage