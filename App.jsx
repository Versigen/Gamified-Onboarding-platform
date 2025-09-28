import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import TutorialPage from './pages/TutorialPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminEventsPage from './pages/AdminEventsPage'
import EventMapDemo from './components/EventMapDemo'
import AdminEventsDemo from './components/AdminEventsDemo'
import ProtectedRoute from './components/ProtectedRoute'
import ApprovedRoute from './components/ApprovedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen gradient-bg">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/demo" element={<EventMapDemo />} />
            <Route path="/admin-demo" element={<AdminEventsDemo />} />
            <Route 
              path="/home" 
              element={
                <ApprovedRoute>
                  <HomePage />
                </ApprovedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ApprovedRoute>
                  <EventsPage />
                </ApprovedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutorial" 
              element={
                <ProtectedRoute>
                  <TutorialPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <AdminRoute>
                  <AdminEventsPage />
                </AdminRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App