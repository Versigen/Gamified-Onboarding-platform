import React from 'react'

const BadgesTab = ({ badges }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Achievement Badges</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`text-center p-4 rounded-lg transition-all duration-200 ${
              badge.earned
                ? 'bg-yellow-50 border-2 border-yellow-200'
                : 'bg-gray-50 border-2 border-gray-200 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-xs font-medium text-gray-700 mb-1">{badge.name}</div>
            {badge.earned && badge.date && (
              <div className="text-xs text-gray-500">
                {new Date(badge.date).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BadgesTab