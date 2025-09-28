import React, { useState } from 'react'
import EventMapModal from './EventMapModal'
import { createMockEvents } from '../utils/testData'
import { Map, Calendar, MapPin, Users } from 'lucide-react'

/**
 * EventMapDemo - Demo component to showcase the new map functionality
 * This component demonstrates the View Map feature without requiring authentication
 */
const EventMapDemo = () => {
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const mockEvents = createMockEvents()

  const openMapModal = (event) => {
    setSelectedEvent(event)
    setShowMapModal(true)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced Events Page Demo
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Showcasing the new "View Map" functionality for volunteer events
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">✨ New Features</h2>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• "View Map" button next to "Join Event" for events with location data</li>
              <li>• Full-screen map modal showing event location and waypoints</li>
              <li>• Enhanced signup modal with integrated map context</li>
              <li>• Mobile-friendly responsive design</li>
              <li>• Smart display - only shows when location data is available</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              {/* Event Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>

              {/* Event Details */}
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
                  <span>
                    {event.totalVolunteers}/{event.roles.reduce((sum, role) => sum + role.requiredCount, 0)} volunteers
                  </span>
                </div>
              </div>

              {/* Roles Display */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Available Roles:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.roles.map((role, index) => (
                    <span 
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800"
                    >
                      {role.name} (0/{role.requiredCount})
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary hover:bg-primary-700 transition-colors">
                  Join Event
                </button>
                
                {/* View Map button - only show if event has location data */}
                {(event.locationCoords || (event.waypoints && event.waypoints.length > 0)) ? (
                  <button 
                    className="btn-secondary flex items-center justify-center space-x-1 px-3 hover:bg-gray-100 transition-colors"
                    onClick={() => openMapModal(event)}
                    title="View event location on map"
                  >
                    <Map className="h-4 w-4" />
                    <span className="hidden sm:inline">View Map</span>
                  </button>
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded border">
                    <Map className="h-4 w-4 opacity-50" />
                  </div>
                )}
              </div>

              {/* Location Status Indicator */}
              <div className="mt-3 text-xs text-center">
                {event.locationCoords ? (
                  <span className="text-green-600 font-medium">
                    ✓ Map data available ({event.waypoints?.length || 0} waypoints)
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Map data not available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Demo Instructions */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            🎯 Demo Instructions
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            Click on the "View Map" button for events with location data to see the new map modal functionality:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Marina Bay Park Event - Has main location + 3 waypoints</li>
            <li>• East Coast Park Event - Has main location + 2 waypoints</li>
            <li>• Sentosa Island Event - Has main location + 3 waypoints</li>
            <li>• City Center Night Ride - No map data (button disabled)</li>
          </ul>
        </div>
      </div>

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

export default EventMapDemo