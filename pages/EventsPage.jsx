import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import EventMapModal from '../components/EventMapModal'
import { Wrapper } from '@googlemaps/react-wrapper'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  UserCheck,
  Map
} from 'lucide-react'
import { 
  getEvents, 
  signUpForEvent, 
  updateVolunteerSignup, 
  getVolunteerEventSignups,
  removeVolunteerFromEvent 
} from '../utils/firestore'

const GOOGLE_MAPS_API_KEY = 'AIzaSyDrCd_DA3CRYya-Eyq_9lzWkb1L9KWCx9c'

/**
 * ReadOnlyMap component - Compact map display for signup modals
 * Shows event location and waypoints in a smaller, inline format
 */
const ReadOnlyMap = ({ center, zoom, location, waypoints, eventName }) => {
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 24)
        }
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#2563eb"/>
              <text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${index + 1}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12)
        }
      })

      newMarkers.push(waypointMarker)
    })

    setMarkers(newMarkers)

    // Fit bounds to show all markers
    if (newMarkers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)
    }

  }, [map, location, waypoints, eventName, markers])

  return <div ref={ref} style={{ width: '100%', height: '250px' }} />
}

/**
 * EventsPage - Enhanced volunteer events management interface
 * 
 * Key Features:
 * - Tabbed interface separating "Available Events" and "My Events"
 * - Enhanced event cards with clear status indicators and role availability
 * - Improved signup/edit modals with better UX and validation
 * - Smart role selection showing available spots per role
 * - Comprehensive feedback system with success/error messages
 * - Loading states and disabled states for better user experience
 * - Accessibility improvements with ARIA labels and keyboard navigation
 * - Prevents duplicate signups and handles full events gracefully
 * 
 * User Experience Improvements:
 * - Clear visual indicators for events user is already signed up for
 * - Enhanced role display showing current capacity vs requirements
 * - Better error handling and user feedback throughout the flow
 * - Streamlined event browsing with search and filtering
 * - Mobile-responsive design with improved touch interactions
 */

const EventsPage = () => {
  const { currentUser, userProfile } = useAuth()
  const [events, setEvents] = useState([])
  const [userSignups, setUserSignups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('open')
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [volunteerName, setVolunteerName] = useState('')
  const [viewMode, setViewMode] = useState('available') // 'available' or 'my-events'
  const [signupLoading, setSignupLoading] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', message: '' })

  // Clear feedback messages when user dismisses them
  const dismissFeedback = () => {
    setFeedbackMessage({ type: '', message: '' })
  }

  useEffect(() => {
    loadEvents()
    loadUserSignups()
  }, [statusFilter, currentUser])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const result = await getEvents({
        statusFilter: statusFilter === 'all' ? 'all' : statusFilter,
        sortBy: 'date',
        sortOrder: 'asc',
        pageSize: 50
      })
      setEvents(result.events)
    } catch (error) {
      console.error('Error loading events:', error)
      alert('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const loadUserSignups = async () => {
    if (!currentUser) return
    
    try {
      const signups = await getVolunteerEventSignups(currentUser.uid)
      setUserSignups(signups)
    } catch (error) {
      console.error('Error loading user signups:', error)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!selectedEvent || !selectedRole || !volunteerName.trim()) {
      setFeedbackMessage({ type: 'error', message: 'Please fill in all required fields' })
      return
    }

    setSignupLoading(true)
    setFeedbackMessage({ type: '', message: '' })

    try {
      await signUpForEvent(selectedEvent.id, currentUser.uid, {
        volunteerName: volunteerName.trim(),
        selectedRole,
        volunteerEmail: currentUser.email
      })
      
      setShowSignupModal(false)
      setSelectedEvent(null)
      setSelectedRole('')
      setVolunteerName('')
      
      await loadEvents()
      await loadUserSignups()
      
      // Show success message
      setFeedbackMessage({ 
        type: 'success', 
        message: `Successfully signed up for "${selectedEvent.name}" as ${selectedRole}!` 
      })
      
      // Clear message after 5 seconds
      setTimeout(() => setFeedbackMessage({ type: '', message: '' }), 5000)
    } catch (error) {
      console.error('Error signing up:', error)
      setFeedbackMessage({ 
        type: 'error', 
        message: error.message || 'Failed to sign up for event. Please try again.' 
      })
    } finally {
      setSignupLoading(false)
    }
  }

  const handleEditSignup = async (e) => {
    e.preventDefault()
    if (!selectedRole || !volunteerName.trim()) {
      setFeedbackMessage({ type: 'error', message: 'Please fill in all required fields' })
      return
    }

    setSignupLoading(true)
    setFeedbackMessage({ type: '', message: '' })

    try {
      await updateVolunteerSignup(selectedEvent.id, currentUser.uid, {
        volunteerName: volunteerName.trim(),
        selectedRole
      })
      
      setShowEditModal(false)
      setSelectedEvent(null)
      setSelectedRole('')
      setVolunteerName('')
      
      await loadEvents()
      await loadUserSignups()
      
      setFeedbackMessage({ 
        type: 'success', 
        message: `Successfully updated your signup for "${selectedEvent.name}"!` 
      })
      
      setTimeout(() => setFeedbackMessage({ type: '', message: '' }), 5000)
    } catch (error) {
      console.error('Error updating signup:', error)
      setFeedbackMessage({ 
        type: 'error', 
        message: error.message || 'Failed to update signup. Please try again.' 
      })
    } finally {
      setSignupLoading(false)
    }
  }

  const handleLeaveEvent = async (eventId) => {
    const event = events.find(e => e.id === eventId)
    const eventName = event ? event.name : 'this event'
    
    if (!confirm(`Are you sure you want to leave "${eventName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await removeVolunteerFromEvent(eventId, currentUser.uid)
      await loadEvents()
      await loadUserSignups()
      
      setFeedbackMessage({ 
        type: 'success', 
        message: `Successfully left "${eventName}". We hope to see you at future events!` 
      })
      
      setTimeout(() => setFeedbackMessage({ type: '', message: '' }), 5000)
    } catch (error) {
      console.error('Error leaving event:', error)
      setFeedbackMessage({ 
        type: 'error', 
        message: error.message || 'Failed to leave event. Please try again.' 
      })
    }
  }

  const openSignupModal = (event) => {
    setSelectedEvent(event)
    setVolunteerName(userProfile?.displayName || currentUser?.displayName || '')
    setSelectedRole(event.roles?.[0]?.name || '')
    setShowSignupModal(true)
  }

  const openEditModal = (event, signup) => {
    setSelectedEvent(event)
    setVolunteerName(signup.signupData.volunteerName || '')
    setSelectedRole(signup.signupData.selectedRole || '')
    setShowEditModal(true)
  }

  /**
   * Opens the map modal to display event location and waypoints
   * Only shows the modal if the event has location data
   */
  const openMapModal = (event) => {
    setSelectedEvent(event)
    setShowMapModal(true)
  }

  const isUserSignedUp = (eventId) => {
    return userSignups.find(signup => signup.eventId === eventId)
  }

  const isEventOpen = (event) => {
    if (event.status !== 'open') return false
    
    if (event.closingDate) {
      const closingDate = event.closingDate.toDate ? event.closingDate.toDate() : new Date(event.closingDate)
      return new Date() <= closingDate
    }
    
    return true
  }

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

  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return event.name?.toLowerCase().includes(searchLower) ||
           event.location?.toLowerCase().includes(searchLower) ||
           event.description?.toLowerCase().includes(searchLower)
  })

  // Separate events into user's events and available events
  const myEvents = filteredEvents.filter(event => isUserSignedUp(event.id))
  const availableEvents = filteredEvents.filter(event => !isUserSignedUp(event.id))

  // Helper function to render event cards
  const renderEventCard = (event, isMyEvent = false) => {
    const userSignup = isUserSignedUp(event.id)
    const eventOpen = isEventOpen(event)
    const totalRequired = event.roles?.reduce((sum, role) => sum + (role.requiredCount || 0), 0) || 0
    const totalSignedUp = event.totalVolunteers || 0
    const isFullyBooked = totalSignedUp >= totalRequired && totalRequired > 0

    return (
      <div 
        key={event.id} 
        className="card hover:shadow-lg transition-shadow duration-200"
        role="listitem"
        aria-label={`${event.name} - ${isMyEvent ? 'Already registered' : 'Available to join'}`}
      >
        {/* Event header with improved status indicators */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              {event.name}
              {isMyEvent && (
                <UserCheck className="h-5 w-5 text-green-600 ml-2" aria-label="You're signed up" />
              )}
            </h3>
            <div className="flex flex-col items-end space-y-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                event.status === 'open' ? 'bg-green-100 text-green-800' :
                event.status === 'closed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status || 'open'}
              </span>
              {isFullyBooked && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  Full
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-sm">{event.description}</p>
        </div>

        {/* Event details with enhanced visibility */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-primary-600" />
            <span className="font-medium">{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-primary-600" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-primary-600" />
            <span className={`${isFullyBooked ? 'text-orange-600 font-medium' : ''}`}>
              {totalSignedUp}/{totalRequired} volunteers
              {isFullyBooked && ' (Full)'}
            </span>
          </div>
          {event.closingDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-primary-600" />
              <span>Registration closes: {formatDate(event.closingDate)}</span>
            </div>
          )}
        </div>

        {/* Enhanced roles display */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            Available Roles:
          </h4>
          <div className="flex flex-wrap gap-2">
            {(event.roles || []).map((role, index) => {
              const roleSignups = event.volunteers?.filter(v => v.selectedRole === role.name)?.length || 0
              const isFull = roleSignups >= (role.requiredCount || 1)
              
              return (
                <span
                  key={index}
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    isFull 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'bg-primary-100 text-primary-800'
                  }`}
                  title={`${roleSignups}/${role.requiredCount || 1} filled`}
                >
                  {role.name} ({roleSignups}/{role.requiredCount || 1})
                  {isFull && ' ✓'}
                </span>
              )
            })}
          </div>
        </div>

        {/* Action area with enhanced UI */}
        {userSignup ? (
          <div className="space-y-2">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">You're registered!</p>
                  </div>
                  <p className="text-xs text-green-600">
                    Role: <span className="font-medium">{userSignup.signupData.selectedRole}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Status: <span className="font-medium capitalize">{userSignup.signupData.status || 'Confirmed'}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {eventOpen && (
                    <button
                      onClick={() => openEditModal(event, userSignup)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="Edit signup"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleLeaveEvent(event.id)}
                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                    disabled={event.status === 'confirmed'}
                    title={event.status === 'confirmed' ? 'Cannot leave confirmed event' : 'Leave event'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* View Map button for registered events */}
            {(event.locationCoords || (event.waypoints && event.waypoints.length > 0)) && (
              <button 
                className="w-full btn-secondary flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={() => openMapModal(event)}
                aria-label={`View map for ${event.name}`}
              >
                <Map className="h-4 w-4" />
                <span>View Map</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {!eventOpen && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    {event.status === 'closed' ? 'Registration is closed' : 
                     event.closingDate ? 'Registration deadline has passed' : 'Event is not open for registration'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Action buttons container */}
            <div className="flex space-x-2">
              {/* Join Event button */}
              <button 
                className={`flex-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  eventOpen && !isFullyBooked
                    ? 'btn-primary hover:bg-primary-700' 
                    : 'btn-secondary cursor-not-allowed opacity-75'
                }`}
                onClick={() => eventOpen && !isFullyBooked && openSignupModal(event)}
                disabled={!eventOpen || isFullyBooked}
                aria-label={`${!eventOpen ? 'Registration closed for' : isFullyBooked ? 'Event full for' : 'Join'} ${event.name}`}
              >
                {!eventOpen ? 'Registration Closed' : 
                 isFullyBooked ? 'Event Full' : 
                 'Join Event'}
              </button>
              
              {/* View Map button - only show if event has location data */}
              {(event.locationCoords || (event.waypoints && event.waypoints.length > 0)) && (
                <button 
                  className="btn-secondary flex items-center justify-center space-x-1 px-3 hover:bg-gray-100 transition-colors"
                  onClick={() => openMapModal(event)}
                  aria-label={`View map for ${event.name}`}
                  title="View event location on map"
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">View Map</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header with improved messaging */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Events</h1>
          <p className="text-gray-600">
            Join cycling events and make a difference in our community. 
            {userSignups.length > 0 && ` You're currently signed up for ${userSignups.length} event${userSignups.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Enhanced Feedback Messages */}
        {feedbackMessage.message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            feedbackMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : feedbackMessage.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : feedbackMessage.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{feedbackMessage.message}</p>
              </div>
              <button
                onClick={dismissFeedback}
                className="ml-4 text-current hover:opacity-70 transition-opacity"
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced View Toggle Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Event views" role="tablist">
              <button
                role="tab"
                aria-selected={viewMode === 'available'}
                aria-controls="available-events-panel"
                onClick={() => setViewMode('available')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  viewMode === 'available'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Events ({availableEvents.length})
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'my-events'}
                aria-controls="my-events-panel"
                onClick={() => setViewMode('my-events')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  viewMode === 'my-events'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Events ({myEvents.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filter - Only show for available events */}
        {viewMode === 'available' && (
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Filter className="h-4 w-4" />
                  <span>Filter:</span>
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="open">Open Events</option>
                  <option value="all">All Events</option>
                  <option value="closed">Closed Events</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Events Display with proper ARIA */}
        {loading ? (
          <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        ) : (
          <div>
            {viewMode === 'my-events' ? (
              /* My Events Panel */
              <div id="my-events-panel" role="tabpanel" aria-labelledby="my-events-tab">
                {myEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events registered</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't signed up for any events yet. Check out the available events to get started!
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setViewMode('available')}
                        className="btn-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Browse Available Events
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-primary-600" />
                      <h2 className="text-lg font-medium text-gray-900">
                        Your Registered Events ({myEvents.length})
                      </h2>
                    </div>
                    <div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      role="list"
                      aria-label="Your registered events"
                    >
                      {myEvents.map(event => renderEventCard(event, true))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Available Events Panel */
              <div id="available-events-panel" role="tabpanel" aria-labelledby="available-events-tab">
                {availableEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new events.'}
                    </p>
                    {searchTerm && (
                      <div className="mt-6">
                        <button
                          onClick={() => setSearchTerm('')}
                          className="btn-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <h2 className="text-lg font-medium text-gray-900">
                          Available Events ({availableEvents.length})
                        </h2>
                      </div>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                    <div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      role="list"
                      aria-label="Available events"
                    >
                      {availableEvents.map(event => renderEventCard(event, false))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Signup Modal */}
      {showSignupModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSignUp} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Join Event</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSignupModal(false)
                    setFeedbackMessage({ type: '', message: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={signupLoading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-6">
                  {/* Event Details Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedEvent.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary-600" />
                        <span>{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary-600" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                        className="input-field"
                        placeholder="Enter your full name"
                        disabled={signupLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Role *
                      </label>
                      <select
                        required
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="input-field"
                        disabled={signupLoading}
                      >
                        <option value="">Choose a role...</option>
                        {(selectedEvent.roles || []).map((role, index) => {
                          const roleSignups = selectedEvent.volunteers?.filter(v => v.selectedRole === role.name)?.length || 0
                          const available = (role.requiredCount || 1) - roleSignups
                          
                          return (
                            <option 
                              key={index} 
                              value={role.name}
                              disabled={available <= 0}
                            >
                              {role.name} ({available > 0 ? `${available} spot${available !== 1 ? 's' : ''} available` : 'Full'})
                            </option>
                          )
                        })}
                      </select>
                      {selectedRole && (
                        <p className="mt-2 text-xs text-gray-600">
                          <Info className="h-3 w-3 inline mr-1" />
                          You'll be registered for the "{selectedRole}" role for this event.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Error Messages */}
                  {feedbackMessage.type === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-800">{feedbackMessage.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Map */}
                <div className="space-y-4">
                  {(selectedEvent.locationCoords || (selectedEvent.waypoints && selectedEvent.waypoints.length > 0)) ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Map className="h-5 w-5 text-primary-600 mr-2" />
                        Event Location
                      </h4>
                      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                        <Wrapper apiKey={GOOGLE_MAPS_API_KEY}>
                          <ReadOnlyMap
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
                          <h5 className="text-sm font-medium text-blue-900 mb-2">Important Points:</h5>
                          <div className="space-y-1">
                            {selectedEvent.waypoints.slice(0, 3).map((waypoint, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs text-blue-700">
                                <span className="flex items-center justify-center w-4 h-4 bg-blue-600 text-white text-xs font-bold rounded-full">
                                  {index + 1}
                                </span>
                                <span>{waypoint.label}</span>
                              </div>
                            ))}
                            {selectedEvent.waypoints.length > 3 && (
                              <p className="text-xs text-blue-600 mt-1">
                                +{selectedEvent.waypoints.length - 3} more points
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        Map information will be available closer to the event date.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Full Width */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignupModal(false)
                    setFeedbackMessage({ type: '', message: '' })
                  }}
                  className="btn-secondary"
                  disabled={signupLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={signupLoading || !selectedRole || !volunteerName.trim()}
                >
                  {signupLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing Up...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Join Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Edit Signup Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditSignup} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Edit className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Edit Signup</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setFeedbackMessage({ type: '', message: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={signupLoading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Event Details Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedEvent.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary-600" />
                    <span>{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                    disabled={signupLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role *
                  </label>
                  <select
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="input-field"
                    disabled={signupLoading}
                  >
                    <option value="">Choose a role...</option>
                    {(selectedEvent.roles || []).map((role, index) => {
                      const roleSignups = selectedEvent.volunteers?.filter(v => v.selectedRole === role.name)?.length || 0
                      const available = (role.requiredCount || 1) - roleSignups
                      
                      return (
                        <option 
                          key={index} 
                          value={role.name}
                          disabled={available <= 0 && selectedRole !== role.name}
                        >
                          {role.name} ({available > 0 || selectedRole === role.name ? `${available + (selectedRole === role.name ? 1 : 0)} spot${available !== 0 ? 's' : ''} available` : 'Full'})
                        </option>
                      )
                    })}
                  </select>
                  {selectedRole && (
                    <p className="mt-2 text-xs text-gray-600">
                      <Info className="h-3 w-3 inline mr-1" />
                      Updating your role to "{selectedRole}" for this event.
                    </p>
                  )}
                </div>
              </div>

              {/* Error Messages */}
              {feedbackMessage.type === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-800">{feedbackMessage.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setFeedbackMessage({ type: '', message: '' })
                  }}
                  className="btn-secondary"
                  disabled={signupLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={signupLoading || !selectedRole || !volunteerName.trim()}
                >
                  {signupLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Signup</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Map Modal */}
      <EventMapModal 
        isOpen={showMapModal}
        onClose={() => {
          setShowMapModal(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
      />
    </div>
  )
}

export default EventsPage