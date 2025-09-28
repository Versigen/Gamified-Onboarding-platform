import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'
import { 
  getUsers, 
  getUserStats, 
  searchUsers, 
  updateUserStatus, 
  bulkUpdateUserStatus,
  getCombinedUserData
} from '../utils/firestore'
import { exportToCSV, exportToJSON } from '../utils/export'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState(null)

  // Load initial data
  useEffect(() => {
    loadUsers()
    loadStats()
  }, [statusFilter, sortBy, sortOrder])

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch()
    } else if (!searchTerm) {
      loadUsers()
    }
  }, [searchTerm])

  const loadUsers = async (loadMore = false) => {
    try {
      setLoading(!loadMore)
      
      const options = {
        pageSize,
        statusFilter,
        sortBy,
        sortOrder,
        startAfterDoc: loadMore ? lastDoc : null
      }
      
      const result = await getUsers(options)
      
      if (loadMore) {
        setUsers(prev => [...prev, ...result.users])
      } else {
        setUsers(result.users)
        setCurrentPage(1)
      }
      
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading users:', error)
      setUsers([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle viewing user details - fetch combined data from both collections
  const handleViewUserDetails = async (user) => {
    try {
      const combinedData = await getCombinedUserData(user.uid)
      setSelectedUserDetails(combinedData)
    } catch (error) {
      console.error('Error fetching user details:', error)
      // Fall back to basic user data
      setSelectedUserDetails(user)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getUserStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
      setStats({
        totalVolunteers: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        submitted: 0
      })
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const results = await searchUsers(searchTerm, { statusFilter })
      setUsers(results)
      setHasMore(false)
    } catch (error) {
      console.error('Error searching users:', error)
      alert('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus)
      // Reload data
      await loadUsers()
      await loadStats()
      alert(`User status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first')
      return
    }

    try {
      await bulkUpdateUserStatus(selectedUsers, newStatus)
      setSelectedUsers([])
      setShowBulkActions(false)
      await loadUsers()
      await loadStats()
      alert(`${selectedUsers.length} users updated to ${newStatus}`)
    } catch (error) {
      console.error('Error bulk updating:', error)
      alert('Failed to bulk update')
    }
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u.uid))
    }
  }

  const handleExport = (format) => {
    const dataToExport = selectedUsers.length > 0 
      ? users.filter(u => selectedUsers.includes(u.uid))
      : users

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `users_${timestamp}`

    if (format === 'csv') {
      exportToCSV(dataToExport, `${filename}.csv`)
    } else if (format === 'json') {
      exportToJSON(dataToExport, `${filename}.json`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'submitted': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    
    // Handle both Firestore timestamps and regular Date objects
    let date
    if (timestamp.toDate) {
      date = timestamp.toDate()
    } else if (timestamp instanceof Date) {
      date = timestamp
    } else {
      date = new Date(timestamp)
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
              <p className="text-gray-600">Manage volunteer applications and profiles</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
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
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.pending}</h3>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.approved}</h3>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.rejected}</h3>
                <p className="text-sm text-gray-600">Rejected</p>
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
                placeholder="Search by name, email, or UID..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="submitted">Submitted</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="input-field"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="displayName-asc">Name A-Z</option>
                <option value="displayName-desc">Name Z-A</option>
              </select>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                {showBulkActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export as JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('approved')}
                    className="btn-primary text-sm"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('rejected')}
                    className="btn-secondary text-sm"
                  >
                    Reject Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.uid)}
                            onChange={() => handleSelectUser(user.uid)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-700 font-medium text-sm">
                                {(user.displayName || user.email)?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName || (user.formData?.personal?.fullName) || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400">UID: {user.uid}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewUserDetails(user)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {user.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusUpdate(user.uid, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {user.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusUpdate(user.uid, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => loadUsers(true)}
                    className="btn-secondary"
                  >
                    Load More
                  </button>
                </div>
              )}

              {users.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No users match the current filters.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Application Details</h2>
                <button
                  onClick={() => setSelectedUserDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUserDetails.displayName || 
                         selectedUserDetails.formData?.personal?.fullName ||
                         'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUserDetails.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUserDetails.status)}`}>
                        {selectedUserDetails.status || 'pending'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">UID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedUserDetails.uid}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUserDetails.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                {selectedUserDetails.formData?.personal && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.nationality || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.gender || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.birthdate || selectedUserDetails.formData.personal.dateOfBirth || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Area</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.area || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Language</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.language || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Religion</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.religion || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Occupation</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.occupation || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cycling Experience</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.cyclingExperience || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cycling Group</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.personal.cyclingGroup || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {selectedUserDetails.emergencyContact && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Contact Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.relationship || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Alternate Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.alternatePhone || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.address || 'Not provided'}</p>
                      </div>
                      {selectedUserDetails.emergencyContact.secondaryName && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Secondary Contact</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.secondaryName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Secondary Relationship</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.secondaryRelationship || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Secondary Phone</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.secondaryPhone || 'Not provided'}</p>
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.medicalConditions || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Emergency Instructions</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.emergencyContact.emergencyInstructions || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Volunteer Experience */}
                {selectedUserDetails.formData?.volunteerExperience && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Volunteer Experience & Skills</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedUserDetails.formData.volunteerExperience.experienceLevel || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Previous Experience</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedUserDetails.formData.volunteerExperience.previousExperience || 'Not provided'}
                        </p>
                      </div>
                      {selectedUserDetails.formData.volunteerExperience.interests && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Areas of Interest</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {Array.isArray(selectedUserDetails.formData.volunteerExperience.interests) 
                              ? selectedUserDetails.formData.volunteerExperience.interests.join(', ') 
                              : selectedUserDetails.formData.volunteerExperience.interests || 'Not provided'}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.volunteerExperience.skills && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Skills</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {Array.isArray(selectedUserDetails.formData.volunteerExperience.skills) 
                              ? selectedUserDetails.formData.volunteerExperience.skills.join(', ') 
                              : selectedUserDetails.formData.volunteerExperience.skills || 'Not provided'}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.volunteerExperience.additionalSkills && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Additional Skills</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedUserDetails.formData.volunteerExperience.additionalSkills}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.volunteerExperience.motivations && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Motivations</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {Array.isArray(selectedUserDetails.formData.volunteerExperience.motivations) 
                              ? selectedUserDetails.formData.volunteerExperience.motivations.join(', ') 
                              : selectedUserDetails.formData.volunteerExperience.motivations || 'Not provided'}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.volunteerExperience.personalMotivation && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Personal Motivation</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedUserDetails.formData.volunteerExperience.personalMotivation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Questionnaire Responses */}
                {selectedUserDetails.formData?.questionnaire && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Questionnaire Responses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Aid Certificate</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.firstAidCertificate ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Uses Tobacco Products</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.tobaccoProduct ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Special Needs Experience</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.specialNeedsVolunteer ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Disabilities Experience</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.disabilitiesVolunteer ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Physically Fit</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.physicallyFit ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.medicalConditions ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedUserDetails.formData.questionnaire.medicalConditionsDetails && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Medical Conditions Details</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.medicalConditionsDetails}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Taking Medications</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.medications ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedUserDetails.formData.questionnaire.medicationsDetails && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Medication Details</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.medicationsDetails}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Has Allergies</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.allergies ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedUserDetails.formData.questionnaire.allergiesDetails && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Allergy Details</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.allergiesDetails}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Criminal Record</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.chargedConvicted ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedUserDetails.formData.questionnaire.chargedConvictedDetails && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Criminal Record Details</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.chargedConvictedDetails}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.questionnaire.additionalInfo && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.additionalInfo}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.questionnaire.accommodations && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Special Accommodations</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.questionnaire.accommodations}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Discovery & Motivation */}
                {selectedUserDetails.formData?.discoveryMotivation && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Discovery & Motivation</h3>
                    <div className="space-y-3">
                      {selectedUserDetails.formData.discoveryMotivation.discoveryMethods && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">How They Heard About Us</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {Array.isArray(selectedUserDetails.formData.discoveryMotivation.discoveryMethods) 
                              ? selectedUserDetails.formData.discoveryMotivation.discoveryMethods.join(', ') 
                              : selectedUserDetails.formData.discoveryMotivation.discoveryMethods}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.otherDiscovery && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Other Discovery Method</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.discoveryMotivation.otherDiscovery}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.referrerDetails && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Referrer Details</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.discoveryMotivation.referrerDetails}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.motivations && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Motivations</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {Array.isArray(selectedUserDetails.formData.discoveryMotivation.motivations) 
                              ? selectedUserDetails.formData.discoveryMotivation.motivations.join(', ') 
                              : selectedUserDetails.formData.discoveryMotivation.motivations}
                          </p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.personalMotivation && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Personal Motivation</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.discoveryMotivation.personalMotivation}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.timeCommitment && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Time Commitment</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.discoveryMotivation.timeCommitment}</p>
                        </div>
                      )}
                      {selectedUserDetails.formData.discoveryMotivation.additionalComments && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.discoveryMotivation.additionalComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Consent & Agreements */}
                {selectedUserDetails.formData?.consent && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Consent & Agreements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PDPA Consent</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.consent.pdpaConsent ? 'Agreed' : 'Not Agreed'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Program Consent</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.consent.programConsent ? 'Agreed' : 'Not Agreed'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Communication Consent</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.consent.communicationConsent ? 'Agreed' : 'Declined'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Affirmation & Waiver */}
                {selectedUserDetails.formData?.affirmationWaiver && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Affirmation & Waiver</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Volunteer Affirmation</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.affirmationAgreement ? 'Agreed' : 'Not Agreed'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Liability Waiver</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.waiverAgreement ? 'Agreed' : 'Not Agreed'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Photo Consent</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.photoConsent ? 'Agreed' : 'Not Agreed'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Digital Signature</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.digitalSignature || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Signature Date</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.signatureDate ? formatDate(selectedUserDetails.formData.affirmationWaiver.signatureDate) : 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Final Confirmation</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUserDetails.formData.affirmationWaiver.finalConfirmation ? 'Confirmed' : 'Not Confirmed'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Notes</h3>
                  <textarea
                    value={selectedUserDetails.adminNotes || ''}
                    onChange={(e) => setSelectedVolunteerDetails(prev => ({
                      ...prev,
                      adminNotes: e.target.value
                    }))}
                    className="input-field h-24"
                    placeholder="Add admin notes..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedVolunteerDetails(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedUserDetails.uid, 'approved')
                      setSelectedVolunteerDetails(null)
                    }}
                    className="btn-primary"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedUserDetails.uid, 'rejected')
                      setSelectedVolunteerDetails(null)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard