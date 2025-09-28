import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { 
  saveUserProfile, 
  saveVolunteerProfile, 
  getUserProfile,
  updatePersonalInfo
} from '../utils/firestore'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Firebase authentication functions
  const signUp = async (email, password, userData, completeFormData = null) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update the user's display name
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        })
      }

      // Prepare personal info for users collection (all personal details + emergency contact)
      const personalInfo = {
        email: user.email,
        displayName: userData.displayName || '',
        phone: userData.phone || '',
        uid: user.uid,
        role: userData.role || 'volunteer',
        status: 'pending',
        // Add emergency contact from form data if provided (stored only in users collection)
        ...(completeFormData?.emergencyContact && { 
          emergencyContact: completeFormData.emergencyContact 
        }),
        // Pass complete form data to extract personal details in saveUserProfile
        ...(completeFormData && { formData: completeFormData })
      }
      
      // Save personal info to 'users' collection
      await saveUserProfile(user.uid, personalInfo)
      
      // Save complete form data to 'volunteers' collection if provided
      // (excludes personal identifying info which is stored in users collection)
      if (completeFormData) {
        await saveVolunteerProfile(user.uid, completeFormData)
      }
      
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Special function to save complete volunteer application
  const submitVolunteerApplication = async (applicationData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to submit application')
    }
    
    try {
      // This function is deprecated - form data is now saved during signup
      // Keeping for backward compatibility but it doesn't do anything
      console.warn('submitVolunteerApplication is deprecated - data is saved during signup')
      return { success: true }
    } catch (error) {
      console.error('Error submitting volunteer application:', error)
      throw error
    }
  }

  // Update personal information (name, phone, emergency contact)
  const updatePersonalInformation = async (personalData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to update profile')
    }
    
    try {
      await updatePersonalInfo(currentUser.uid, personalData)
      
      // Update local userProfile state
      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...personalData,
        updatedAt: new Date()
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Error updating personal information:', error)
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error sending password reset email:', error)
      throw error
    }
  }

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Fetch user profile data from Firestore 'users' collection
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe // Cleanup subscription on unmount
  }, [])

  const value = {
    currentUser,
    userProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    submitVolunteerApplication,
    updatePersonalInformation,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}