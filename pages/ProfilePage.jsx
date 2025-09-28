import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { User, Mail, Phone, Calendar, Award, Edit3, Save, X } from 'lucide-react'
import { getVolunteerEventSignups } from '../utils/firestore'
import ProfileTab from '../components/profile-tabs/ProfileTab'
import EmergencyTab from '../components/profile-tabs/EmergencyTab'
import BadgesTab from '../components/profile-tabs/BadgesTab'
import VolunteerHistoryTab from '../components/profile-tabs/VolunteerHistoryTab'

const ProfilePage = () => {
  const { currentUser, userProfile, updatePersonalInformation } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    displayName: '',
    phone: '',
    emergencyContact: {},
    // Include all personal information fields for editing
    area: '',
    birthdate: '',
    gender: '',
    nationality: '',
    postalCode: '',
    language: '',
    religion: '',
    occupation: '',
    cyclingExperience: '',
    cyclingGroup: ''
  })
  const [loading, setLoading] = useState(false)
  const [volunteerHistory, setVolunteerHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Update editData when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        emergencyContact: userProfile.emergencyContact || {},
        // Include all personal information fields
        area: userProfile.area || '',
        birthdate: userProfile.birthdate || '',
        gender: userProfile.gender || '',
        nationality: userProfile.nationality || '',
        postalCode: userProfile.postalCode || '',
        language: userProfile.language || '',
        religion: userProfile.religion || '',
        occupation: userProfile.occupation || '',
        cyclingExperience: userProfile.cyclingExperience || '',
        cyclingGroup: userProfile.cyclingGroup || ''
      })
    }
  }, [userProfile])

  // Load volunteer history from Firestore
  useEffect(() => {
    const loadVolunteerHistory = async () => {
      if (!currentUser) return
      
      setLoadingHistory(true)
      try {
        const signups = await getVolunteerEventSignups(currentUser.uid)
        
        // Transform the data to match the expected format
        const history = signups.map(signup => ({
          id: signup.eventId,
          event: signup.eventData.name || signup.eventData.title || 'Event',
          date: signup.eventData.date ? (
            signup.eventData.date.toDate ? 
            signup.eventData.date.toDate().toISOString().split('T')[0] : 
            signup.eventData.date
          ) : 'TBD',
          role: signup.signupData.selectedRole || 'Volunteer',
          hours: signup.eventData.estimatedHours || 4, // Default to 4 hours if not specified
          status: signup.signupData.status || 'Confirmed'
        }))
        
        setVolunteerHistory(history)
      } catch (error) {
        console.error('Error loading volunteer history:', error)
        setVolunteerHistory([]) // Set empty array on error
      } finally {
        setLoadingHistory(false)
      }
    }

    loadVolunteerHistory()
  }, [currentUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested emergency contact fields
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1]
      setEditData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }))
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTabChange = (tab) => {
    setIsEditing(false)
    setActiveTab(tab)
    // Reset editData to current userProfile values when switching tabs
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        emergencyContact: userProfile.emergencyContact || {},
        // Include all personal information fields
        area: userProfile.area || '',
        birthdate: userProfile.birthdate || '',
        gender: userProfile.gender || '',
        nationality: userProfile.nationality || '',
        postalCode: userProfile.postalCode || '',
        language: userProfile.language || '',
        religion: userProfile.religion || '',
        occupation: userProfile.occupation || '',
        cyclingExperience: userProfile.cyclingExperience || '',
        cyclingGroup: userProfile.cyclingGroup || ''
      })
    }
  }



  const badges = [
    { name: 'First Event', icon: '🎯', earned: true, date: '2023-12-20' },
    { name: 'Early Bird', icon: '🐦', earned: true, date: '2024-01-01' },
    { name: 'Route Master', icon: '🗺️', earned: true, date: '2024-01-15' },
    { name: 'Team Player', icon: '🤝', earned: true, date: '2024-01-15' },
    { name: 'Safety First', icon: '🛡️', earned: true, date: '2023-12-20' },
    { name: '10+ Hours', icon: '⏰', earned: false, date: null },
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      await updatePersonalInformation(editData)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        emergencyContact: userProfile.emergencyContact || {},
        // Include all personal information fields
        area: userProfile.area || '',
        birthdate: userProfile.birthdate || '',
        gender: userProfile.gender || '',
        nationality: userProfile.nationality || '',
        postalCode: userProfile.postalCode || '',
        language: userProfile.language || '',
        religion: userProfile.religion || '',
        occupation: userProfile.occupation || '',
        cyclingExperience: userProfile.cyclingExperience || '',
        cyclingGroup: userProfile.cyclingGroup || ''
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-700">
                  {(userProfile?.displayName || currentUser?.email)?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {userProfile?.displayName || 'Volunteer'}
              </h2>
              <p className="text-gray-600 mb-4">{userProfile?.email || currentUser?.email}</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">24</div>
                  <div>Hours</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">8</div>
                  <div>Events</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">5</div>
                  <div>Badges</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Volunteer Rank</span>
                  <span className="font-semibold text-primary-600">#12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">Dec 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'profile'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleTabChange('emergency')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'emergency'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Emergency
                  </button>
                  <button
                    onClick={() => handleTabChange('badges')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'badges'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Badges
                  </button>
                  <button
                    onClick={() => handleTabChange('history')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'history'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Volunteer History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Edit Controls */}
                {(activeTab === 'profile' || activeTab === 'emergency') && (
                  <div className="flex items-center justify-between mb-6">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                          disabled={loading}
                        >
                          <Save className="h-4 w-4" />
                          <span>{loading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <ProfileTab
                    userProfile={userProfile}
                    editData={editData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    errors={{}}
                  />
                )}

                {activeTab === 'emergency' && (
                  <EmergencyTab
                    userProfile={userProfile}
                    editData={editData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    errors={{}}
                  />
                )}

                {activeTab === 'badges' && (
                  <BadgesTab badges={badges} />
                )}

                {activeTab === 'history' && (
                  <VolunteerHistoryTab
                    volunteerHistory={volunteerHistory}
                    loadingHistory={loadingHistory}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage