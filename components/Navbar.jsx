import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Calendar, User, LogOut, Menu, X, Bike, BookOpen, Shield } from 'lucide-react'

const Navbar = () => {
  const { currentUser, userProfile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isApproved = userProfile?.status === 'approved'

  const handleSignOut = async () => {
    try {  
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const navItems = [
    // Tutorial is always available for authenticated users
    { path: '/tutorial', label: 'Tutorial', icon: BookOpen, requiresApproval: false },
    { path: '/profile', label: 'Profile', icon: User, requiresApproval: false },
    // Dashboard and Events require approval
    { path: '/home', label: 'Dashboard', icon: Home, requiresApproval: true },
    { path: '/events', label: 'Events', icon: Calendar, requiresApproval: true },
    // Admin dashboard is only for admin users
    { path: '/admin', label: 'Applications', icon: Shield, requiresApproval: false, adminOnly: true },
    { path: '/admin/events', label: 'Event Management', icon: Calendar, requiresApproval: false, adminOnly: true },
  ]

  // Filter nav items based on user approval status and admin role
  const availableNavItems = navItems.filter(item => {
    // Only show adminOnly items if userProfile.role === 'admin'
    if (item.adminOnly) {
      return userProfile?.role === 'admin'
    }
    // Approval-based nav items logic remains unchanged
    if (item.requiresApproval) {
      return isApproved
    }
    return true
  })

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bike className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Ageless Bicyclists
            </span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {availableNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden lg:block">
                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:block">Sign Out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {availableNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isActive(path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-2 text-gray-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span>{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar