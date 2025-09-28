import React, { useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { Calendar, MapPin, Users, Trophy, Clock, Star, ArrowRight, Bell } from 'lucide-react'

// Duck image (adjust path as needed)
const COMPANION_IMAGE = "/companion-icon.png";
const COMPANION_BG = "/Background.jpeg"; // Add your desired background image here

const HomePage = () => {
  const { currentUser } = useAuth()

  // Mock data for demonstration
  const upcomingEvents = [
    {
      id: 1,
      title: 'Spring Charity Ride',
      date: '2024-03-15',
      time: '09:00',
      location: 'Marina Bay',
      role: 'Route Marshal',
      participants: 45
    },
    {
      id: 2,
      title: 'Family Fun Cycle',
      date: '2024-03-22',
      time: '10:00',
      location: 'East Coast Park',
      role: 'Registration',
      participants: 32
    }
  ]

  const stats = {
    hoursVolunteered: 24,
    eventsJoined: 8,
    badgesEarned: 5,
    rank: 12
  }

  const badges = [
    { name: 'First Event', icon: '🎯', earned: true },
    { name: 'Early Bird', icon: '🐦', earned: true },
    { name: 'Route Master', icon: '🗺️', earned: true },
    { name: 'Team Player', icon: '🤝', earned: true },
    { name: 'Safety First', icon: '🛡️', earned: true },
    { name: '10+ Hours', icon: '⏰', earned: false },
  ]

  const notifications = [
    {
      id: 1,
      message: 'New event "Summer Beach Ride" is now open for registration',
      time: '2 hours ago',
      type: 'event'
    },
    {
      id: 2,
      message: 'Reminder: Spring Charity Ride is tomorrow at 9:00 AM',
      time: '1 day ago',
      type: 'reminder'
    }
  ]

  // Duck jump animation
  const duckRef = useRef(null);
  useEffect(() => {
    // Duck jumps up every 2 seconds
    const interval = setInterval(() => {
      if (duckRef.current) {
        import('gsap').then(({ gsap }) => {
          gsap.to(duckRef.current, {
            y: -40, // Jump up
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(duckRef.current, {
                y: 0, // Return to original position
                duration: 0.4,
                ease: "bounce.out",
              });
            },
          });
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to make a difference in the cycling community today?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats (with companion background) */}
            <div className="relative flex flex-col items-center justify-center mb-8">
              {/* Companion Section with background */}
              <div className="relative w-full flex justify-center mb-2" style={{ height: '110px' }}>
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: '120px',
                    height: '110px',
                  }}
                >
                  {/* Companion background */}
                  <img
                    src={COMPANION_BG}
                    alt="Companion Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  />
                  {/* Duck Companion - Jump animation */}
                  <img
                    ref={duckRef}
                    src={COMPANION_IMAGE}
                    alt="Companion Duck"
                    className="w-24 h-24 z-10"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>
              {/* Stats Card */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="card text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.hoursVolunteered}</div>
                  <div className="text-sm text-gray-600">Hours Volunteered</div>
                </div>

                <div className="card text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.eventsJoined}</div>
                  <div className="text-sm text-gray-600">Events Joined</div>
                </div>

                <div className="card text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.badgesEarned}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>

                <div className="card text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">#{stats.rank}</div>
                  <div className="text-sm text-gray-600">Community Rank</div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{event.participants} participants</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                            {event.role}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievement Badges</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg transition-all duration-200 ${badge.earned
                        ? 'bg-yellow-50 border-2 border-yellow-200 hover:bg-yellow-100'
                        : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                      }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{badge.name}</div>
                    {badge.earned && (
                      <div className="mt-1">
                        <span className="text-xs text-yellow-600">Earned!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Volunteers</h3>
              <div className="space-y-3">
                {[
                  { name: 'Alex Chen', badges: 12, hours: 48 },
                  { name: 'Sarah Kim', badges: 10, hours: 42 },
                  { name: 'Mike Johnson', badges: 8, hours: 36 }
                ].map((volunteer, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                      <div className="text-xs text-gray-500">{volunteer.badges} badges • {volunteer.hours}h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage