import React from 'react'
import { Award } from 'lucide-react'

const VolunteerHistoryTab = ({ volunteerHistory, loadingHistory }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Volunteer History</h3>
      {loadingHistory ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">Loading volunteer history...</p>
        </div>
      ) : volunteerHistory.length > 0 ? (
        <div className="space-y-4">
          {volunteerHistory.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{event.event}</h4>
                  <p className="text-sm text-gray-600">{event.role}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} • {event.hours} hours
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : event.status === 'Confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No volunteer history found</p>
          <p className="text-sm text-gray-500 mt-1">Sign up for events to start building your volunteer history!</p>
        </div>
      )}
    </div>
  )
}

export default VolunteerHistoryTab