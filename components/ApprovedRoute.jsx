import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ApprovedRoute = ({ children }) => {
  const { currentUser, userProfile, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  
  // If user profile is not approved, redirect to tutorial
  if (userProfile?.status !== 'approved') {
    return <Navigate to="/tutorial" />
  }
  
  return children
}

export default ApprovedRoute