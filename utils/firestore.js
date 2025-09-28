import { doc, setDoc, updateDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, startAfter, writeBatch, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  VOLUNTEERS: 'volunteers',
  EVENTS: 'events'
}

// ========================================
// USER PROFILE FUNCTIONS (USERS COLLECTION)
// ========================================

// Save user profile data to the 'users' collection (personal info only)
export const saveUserProfile = async (userId, userData) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId)
    
    // Extract only personal info that belongs in users collection
    const personalInfo = {
      uid: userId,
      email: userData.email,
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      role: userData.role || 'volunteer',
      status: userData.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    // Add emergency contact info if provided (from direct property or nested in formData)
    if (userData.emergencyContact) {
      personalInfo.emergencyContact = userData.emergencyContact
    } else if (userData.formData?.emergencyContact) {
      personalInfo.emergencyContact = userData.formData.emergencyContact
    }
    
    // Add all personal details from formData.personal if available
    if (userData.formData?.personal) {
      const personal = userData.formData.personal
      // Extract personal details that should be stored in users collection
      if (personal.area) personalInfo.area = personal.area
      if (personal.birthdate) personalInfo.birthdate = personal.birthdate
      if (personal.gender) personalInfo.gender = personal.gender
      if (personal.nationality) personalInfo.nationality = personal.nationality
      if (personal.postalCode) personalInfo.postalCode = personal.postalCode
      if (personal.language) personalInfo.language = personal.language
      if (personal.religion) personalInfo.religion = personal.religion
      if (personal.occupation) personalInfo.occupation = personal.occupation
      if (personal.cyclingExperience) personalInfo.cyclingExperience = personal.cyclingExperience
      if (personal.cyclingGroup) personalInfo.cyclingGroup = personal.cyclingGroup
    }
    
    await setDoc(docRef, personalInfo)
    return { success: true, docId: userId }
  } catch (error) {
    console.error('Error saving user profile:', error)
    throw new Error('Failed to save user profile')
  }
}

// Get user profile data from the 'users' collection
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw new Error('Failed to get user profile')
  }
}

// Get combined user data (personal info from users + form data from volunteers)
export const getCombinedUserData = async (userId) => {
  try {
    // Get personal info from users collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId))
    const userData = userDoc.exists() ? userDoc.data() : {}
    
    // Get form data from volunteers collection
    const volunteerDoc = await getDoc(doc(db, COLLECTIONS.VOLUNTEERS, userId))
    const volunteerData = volunteerDoc.exists() ? volunteerDoc.data() : {}
    
    // Combine the data, with personal info taking precedence
    return {
      ...userData,
      // Include form data if available
      ...(volunteerData.formData && { formData: volunteerData.formData })
    }
  } catch (error) {
    console.error('Error getting combined user data:', error)
    throw new Error('Failed to get combined user data')
  }
}

// Update user profile data in the 'users' collection
export const updateUserProfile = async (userId, updateData) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId)
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}

// Update personal info in the 'users' collection (name, email, phone, emergency contact, and all personal details)
export const updatePersonalInfo = async (userId, personalData) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId)
    const allowedFields = {
      displayName: personalData.displayName,
      phone: personalData.phone,
      emergencyContact: personalData.emergencyContact,
      // Allow updating all personal details
      area: personalData.area,
      birthdate: personalData.birthdate,
      gender: personalData.gender,
      nationality: personalData.nationality,
      postalCode: personalData.postalCode,
      language: personalData.language,
      religion: personalData.religion,
      occupation: personalData.occupation,
      cyclingExperience: personalData.cyclingExperience,
      cyclingGroup: personalData.cyclingGroup
    }
    
    // Remove undefined fields
    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    )
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating personal info:', error)
    throw new Error('Failed to update personal info')
  }
}

// Update volunteer form data in the 'volunteers' collection
export const updateVolunteerFormData = async (userId, formData) => {
  try {
    const docRef = doc(db, COLLECTIONS.VOLUNTEERS, userId)
    await updateDoc(docRef, {
      formData: {
        ...formData
      },
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating volunteer form data:', error)
    throw new Error('Failed to update volunteer form data')
  }
}

// ========================================
// LEGACY VOLUNTEER FUNCTIONS (VOLUNTEERS COLLECTION)
// These are kept for backward compatibility with existing volunteer-specific data
// ========================================

// Save volunteer form data to Firestore (only application/questionnaire data, no personal info)
export const saveVolunteerProfile = async (userId, formData) => {
  try {
    const docRef = doc(db, COLLECTIONS.VOLUNTEERS, userId)
    
    // Store only volunteer application data (no personal details or emergency contact)
    const volunteerData = {
      userId,
      // Store only volunteer-specific form sections (exclude personal details and emergency contact)
      formData: {
        consent: formData.consent || {},
        volunteerExperience: formData.volunteerExperience || {},
        questionnaire: formData.questionnaire || {},
        discoveryMotivation: formData.discoveryMotivation || {},
        affirmationWaiver: formData.affirmationWaiver || {}
        // NOTE: Personal details (nationality, gender, birthdate, area, etc.) now stored in users collection
        // NOTE: Emergency contact is stored ONLY in users collection, not duplicated here
      },
      status: 'pending', // Volunteer application status
      submittedAt: serverTimestamp(), // Track when application was submitted
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(docRef, volunteerData)
    return { success: true, docId: userId }
  } catch (error) {
    console.error('Error saving volunteer profile:', error)
    throw new Error('Failed to save profile')
  }
}

// Get volunteer profile data
export const getVolunteerProfile = async (userId) => {
  try {
    const docRef = doc(db, COLLECTIONS.VOLUNTEERS, userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting volunteer profile:', error)
    throw new Error('Failed to get profile')
  }
}

// ========================================
// ADMIN FUNCTIONS FOR MANAGING USERS
// ========================================

// Get all users with pagination and filtering
export const getUsers = async (options = {}) => {
  try {
    const {
      pageSize = 10,
      startAfterDoc = null,
      statusFilter = null,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options

    let q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy(sortBy, sortOrder),
      limit(pageSize)
    )

    // Add status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, COLLECTIONS.USERS),
        where('status', '==', statusFilter),
        orderBy(sortBy, sortOrder),
        limit(pageSize)
      )
    }

    // Add pagination if startAfterDoc is provided
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const users = []
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return {
      users,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === pageSize
    }
  } catch (error) {
    console.error('Error getting users:', error)
    throw new Error('Failed to get users')
  }
}

// Update user status (approve/reject)
export const updateUserStatus = async (userId, status, adminNotes = '') => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    await updateDoc(userRef, {
      status,
      adminNotes,
      statusUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating user status:', error)
    throw new Error('Failed to update status')
  }
}

// Bulk update user statuses
export const bulkUpdateUserStatus = async (userIds, status, adminNotes = '') => {
  try {
    const batch = writeBatch(db)
    
    userIds.forEach(userId => {
      const userRef = doc(db, COLLECTIONS.USERS, userId)
      batch.update(userRef, {
        status,
        adminNotes,
        statusUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    })

    await batch.commit()
    return { success: true, updatedCount: userIds.length }
  } catch (error) {
    console.error('Error bulk updating user status:', error)
    throw new Error('Failed to bulk update status')
  }
}

// Get user statistics
export const getUserStats = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS))
    
    const stats = {
      totalVolunteers: usersSnapshot.size,
      pending: 0,
      approved: 0,
      rejected: 0,
      submitted: 0
    }

    // Count by status in users collection
    usersSnapshot.forEach((doc) => {
      const data = doc.data()
      const status = data.status || 'pending'
      if (stats.hasOwnProperty(status)) {
        stats[status]++
      }
    })

    return stats
  } catch (error) {
    console.error('Error getting user stats:', error)
    throw new Error('Failed to get stats')
  }
}

// Search users by name, email, or UID
export const searchUsers = async (searchTerm, options = {}) => {
  try {
    const { statusFilter = null, maxResults = 50 } = options
    
    // Get all users (in a real app, you'd want to use Algolia or similar for better search)
    let q = query(
      collection(db, COLLECTIONS.USERS),
      limit(maxResults)
    )

    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, COLLECTIONS.USERS),
        where('status', '==', statusFilter),
        limit(maxResults)
      )
    }

    const querySnapshot = await getDocs(q)
    const users = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const searchLower = searchTerm.toLowerCase()
      
      // Check if search term matches name, email, or UID
      const matchesName = data.displayName?.toLowerCase().includes(searchLower) ||
                          data.formData?.personal?.firstName?.toLowerCase().includes(searchLower) ||
                          data.formData?.personal?.lastName?.toLowerCase().includes(searchLower)
      const matchesEmail = data.email?.toLowerCase().includes(searchLower)
      const matchesUID = data.uid?.toLowerCase().includes(searchLower)
      
      if (matchesName || matchesEmail || matchesUID) {
        users.push({
          id: doc.id,
          ...data
        })
      }
    })

    return users
  } catch (error) {
    console.error('Error searching users:', error)
    throw new Error('Failed to search users')
  }
}

// Admin functions for managing volunteers

// Get all volunteers (profiles) with pagination and filtering
export const getVolunteers = async (options = {}) => {
  try {
    const {
      pageSize = 10,
      startAfterDoc = null,
      statusFilter = null,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options

    let q = query(
      collection(db, COLLECTIONS.VOLUNTEERS),
      orderBy(sortBy, sortOrder),
      limit(pageSize)
    )

    // Add status filter if provided
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, COLLECTIONS.VOLUNTEERS),
        where('status', '==', statusFilter),
        orderBy(sortBy, sortOrder),
        limit(pageSize)
      )
    }

    // Add pagination if startAfterDoc is provided
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const volunteers = []
    
    querySnapshot.forEach((doc) => {
      volunteers.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return {
      volunteers,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === pageSize
    }
  } catch (error) {
    console.error('Error getting volunteers:', error)
    throw new Error('Failed to get volunteers')
  }
}

// Update volunteer status (approve/reject)
export const updateVolunteerStatus = async (userId, status, adminNotes = '') => {
  try {
    // Update only the volunteer profile status in the volunteers collection
    const volunteerRef = doc(db, COLLECTIONS.VOLUNTEERS, userId)
    await updateDoc(volunteerRef, {
      status,
      adminNotes,
      statusUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating volunteer status:', error)
    throw new Error('Failed to update status')
  }
}

// Bulk update volunteer statuses
export const bulkUpdateVolunteerStatus = async (userIds, status, adminNotes = '') => {
  try {
    const batch = writeBatch(db)
    
    userIds.forEach(userId => {
      // Update only volunteer profile in the volunteers collection
      const volunteerRef = doc(db, COLLECTIONS.VOLUNTEERS, userId)
      batch.update(volunteerRef, {
        status,
        adminNotes,
        statusUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    })

    await batch.commit()
    return { success: true, updatedCount: userIds.length }
  } catch (error) {
    console.error('Error bulk updating volunteer status:', error)
    throw new Error('Failed to bulk update status')
  }
}

// Get volunteer statistics
export const getVolunteerStats = async () => {
  try {
    // Get all volunteers from the volunteers collection only
    const volunteersSnapshot = await getDocs(collection(db, COLLECTIONS.VOLUNTEERS))
    
    const stats = {
      totalVolunteers: volunteersSnapshot.size,
      pending: 0,
      approved: 0,
      rejected: 0,
      submitted: 0
    }

    // Count by status in volunteers collection
    volunteersSnapshot.forEach((doc) => {
      const data = doc.data()
      const status = data.status || 'pending'
      if (stats.hasOwnProperty(status)) {
        stats[status]++
      }
    })

    return stats
  } catch (error) {
    console.error('Error getting volunteer stats:', error)
    throw new Error('Failed to get stats')
  }
}

// Search volunteers by name, email, or UID
export const searchVolunteers = async (searchTerm, options = {}) => {
  try {
    const { statusFilter = null, maxResults = 50 } = options
    
    // Get all volunteers (in a real app, you'd want to use Algolia or similar for better search)
    let q = query(
      collection(db, COLLECTIONS.VOLUNTEERS),
      limit(maxResults)
    )

    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, COLLECTIONS.VOLUNTEERS),
        where('status', '==', statusFilter),
        limit(maxResults)
      )
    }

    const querySnapshot = await getDocs(q)
    const volunteers = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const searchLower = searchTerm.toLowerCase()
      
      // Check if search term matches name, email, or UID
      const matchesName = data.displayName?.toLowerCase().includes(searchLower) ||
                          data.formData?.personal?.firstName?.toLowerCase().includes(searchLower) ||
                          data.formData?.personal?.lastName?.toLowerCase().includes(searchLower)
      const matchesEmail = data.email?.toLowerCase().includes(searchLower)
      const matchesUID = data.uid?.toLowerCase().includes(searchLower)
      
      if (matchesName || matchesEmail || matchesUID) {
        volunteers.push({
          id: doc.id,
          ...data
        })
      }
    })

    return volunteers
  } catch (error) {
    console.error('Error searching volunteers:', error)
    throw new Error('Failed to search volunteers')
  }
}

// ========================================
// EVENT MANAGEMENT FUNCTIONS
// ========================================

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const eventRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'open', // open, closed, confirmed
      totalVolunteers: 0,
      confirmedVolunteers: 0
    })
    return { success: true, eventId: eventRef.id }
  } catch (error) {
    console.error('Error creating event:', error)
    throw new Error('Failed to create event')
  }
}

// Update an existing event
export const updateEvent = async (eventId, updateData) => {
  try {
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId)
    await updateDoc(eventRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating event:', error)
    throw new Error('Failed to update event')
  }
}

// Get all events with filtering and pagination
export const getEvents = async (options = {}) => {
  try {
    const { 
      pageSize = 10, 
      statusFilter = 'all',
      sortBy = 'date',
      sortOrder = 'asc',
      startAfterDoc = null,
      includeVolunteers = false
    } = options

    let q = query(
      collection(db, COLLECTIONS.EVENTS),
      orderBy(sortBy, sortOrder),
      limit(pageSize)
    )

    // Add status filter
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, COLLECTIONS.EVENTS),
        where('status', '==', statusFilter),
        orderBy(sortBy, sortOrder),
        limit(pageSize)
      )
    }

    // Add pagination if startAfterDoc is provided
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc))
    }

    const querySnapshot = await getDocs(q)
    const events = []
    
    for (const docSnapshot of querySnapshot.docs) {
      const eventData = {
        id: docSnapshot.id,
        ...docSnapshot.data()
      }

      // Include volunteer data if requested
      if (includeVolunteers) {
        const volunteersSnapshot = await getDocs(
          collection(db, COLLECTIONS.EVENTS, docSnapshot.id, 'volunteers')
        )
        eventData.volunteers = volunteersSnapshot.docs.map(volDoc => ({
          id: volDoc.id,
          ...volDoc.data()
        }))
      }

      events.push(eventData)
    }

    return {
      events,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === pageSize
    }
  } catch (error) {
    console.error('Error getting events:', error)
    throw new Error('Failed to get events')
  }
}

// Get a specific event by ID
export const getEvent = async (eventId, includeVolunteers = false) => {
  try {
    const eventDoc = await getDoc(doc(db, COLLECTIONS.EVENTS, eventId))
    
    if (!eventDoc.exists()) {
      throw new Error('Event not found')
    }

    const eventData = {
      id: eventDoc.id,
      ...eventDoc.data()
    }

    // Include volunteer data if requested
    if (includeVolunteers) {
      const volunteersSnapshot = await getDocs(
        collection(db, COLLECTIONS.EVENTS, eventId, 'volunteers')
      )
      eventData.volunteers = volunteersSnapshot.docs.map(volDoc => ({
        id: volDoc.id,
        ...volDoc.data()
      }))
    }

    return eventData
  } catch (error) {
    console.error('Error getting event:', error)
    throw new Error('Failed to get event')
  }
}

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const batch = writeBatch(db)
    
    // Delete all volunteers in the event
    const volunteersSnapshot = await getDocs(
      collection(db, COLLECTIONS.EVENTS, eventId, 'volunteers')
    )
    
    volunteersSnapshot.forEach((volDoc) => {
      batch.delete(volDoc.ref)
    })
    
    // Delete the event itself
    batch.delete(doc(db, COLLECTIONS.EVENTS, eventId))
    
    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error('Error deleting event:', error)
    throw new Error('Failed to delete event')
  }
}

// Get event statistics
export const getEventStats = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(db, COLLECTIONS.EVENTS))
    
    const stats = {
      totalEvents: eventsSnapshot.size,
      openEvents: 0,
      closedEvents: 0,
      confirmedEvents: 0,
      totalVolunteers: 0,
      avgVolunteersPerEvent: 0
    }

    let totalVolunteerCount = 0

    for (const eventDoc of eventsSnapshot.docs) {
      const eventData = eventDoc.data()
      const status = eventData.status || 'open'
      
      if (stats.hasOwnProperty(status + 'Events')) {
        stats[status + 'Events']++
      }

      // Count volunteers for this event
      const volunteersSnapshot = await getDocs(
        collection(db, COLLECTIONS.EVENTS, eventDoc.id, 'volunteers')
      )
      const volunteerCount = volunteersSnapshot.size
      totalVolunteerCount += volunteerCount
    }

    stats.totalVolunteers = totalVolunteerCount
    stats.avgVolunteersPerEvent = stats.totalEvents > 0 ? 
      Math.round(totalVolunteerCount / stats.totalEvents * 10) / 10 : 0

    return stats
  } catch (error) {
    console.error('Error getting event stats:', error)
    throw new Error('Failed to get event stats')
  }
}

// Volunteer signup for an event
export const signUpForEvent = async (eventId, userId, signupData) => {
  try {
    // Check if user is already signed up
    const existingSignup = await getDoc(
      doc(db, COLLECTIONS.EVENTS, eventId, 'volunteers', userId)
    )

    if (existingSignup.exists()) {
      throw new Error('You are already signed up for this event')
    }

    // Check if event is still open
    const eventDoc = await getDoc(doc(db, COLLECTIONS.EVENTS, eventId))
    const eventData = eventDoc.data()
    
    if (!eventData) {
      throw new Error('Event not found')
    }

    if (eventData.status === 'closed' || eventData.status === 'confirmed') {
      throw new Error('Event registration is closed')
    }

    // Check if closing date has passed
    if (eventData.closingDate) {
      const closingDate = eventData.closingDate.toDate ? eventData.closingDate.toDate() : new Date(eventData.closingDate)
      if (new Date() > closingDate) {
        throw new Error('Event registration deadline has passed')
      }
    }

    // Add volunteer signup
    await setDoc(doc(db, COLLECTIONS.EVENTS, eventId, 'volunteers', userId), {
      ...signupData,
      userId,
      signedUpAt: serverTimestamp(),
      status: 'confirmed'
    })

    // Update event volunteer count
    const volunteersSnapshot = await getDocs(
      collection(db, COLLECTIONS.EVENTS, eventId, 'volunteers')
    )
    await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
      totalVolunteers: volunteersSnapshot.size,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error signing up for event:', error)
    throw new Error(error.message || 'Failed to sign up for event')
  }
}

// Update volunteer signup
export const updateVolunteerSignup = async (eventId, userId, updateData) => {
  try {
    // Check if event is still open
    const eventDoc = await getDoc(doc(db, COLLECTIONS.EVENTS, eventId))
    const eventData = eventDoc.data()
    
    if (eventData.status === 'closed' || eventData.status === 'confirmed') {
      throw new Error('Cannot edit signup - event registration is closed')
    }

    // Check if closing date has passed
    if (eventData.closingDate) {
      const closingDate = eventData.closingDate.toDate ? eventData.closingDate.toDate() : new Date(eventData.closingDate)
      if (new Date() > closingDate) {
        throw new Error('Cannot edit signup - registration deadline has passed')
      }
    }

    await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId, 'volunteers', userId), {
      ...updateData,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating volunteer signup:', error)
    throw new Error(error.message || 'Failed to update signup')
  }
}

// Get volunteer's event signups
export const getVolunteerEventSignups = async (userId) => {
  try {
    const eventsSnapshot = await getDocs(collection(db, COLLECTIONS.EVENTS))
    const signups = []

    for (const eventDoc of eventsSnapshot.docs) {
      const volunteerDoc = await getDoc(
        doc(db, COLLECTIONS.EVENTS, eventDoc.id, 'volunteers', userId)
      )

      if (volunteerDoc.exists()) {
        signups.push({
          eventId: eventDoc.id,
          eventData: eventDoc.data(),
          signupData: volunteerDoc.data()
        })
      }
    }

    return signups
  } catch (error) {
    console.error('Error getting volunteer signups:', error)
    throw new Error('Failed to get volunteer signups')
  }
}

// Remove volunteer from event
export const removeVolunteerFromEvent = async (eventId, userId) => {
  try {
    // Check if event allows removal
    const eventDoc = await getDoc(doc(db, COLLECTIONS.EVENTS, eventId))
    const eventData = eventDoc.data()
    
    if (eventData.status === 'confirmed') {
      throw new Error('Cannot leave event - event is already confirmed')
    }

    await deleteDoc(doc(db, COLLECTIONS.EVENTS, eventId, 'volunteers', userId))

    // Update event volunteer count
    const volunteersSnapshot = await getDocs(
      collection(db, COLLECTIONS.EVENTS, eventId, 'volunteers')
    )
    await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
      totalVolunteers: volunteersSnapshot.size,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error removing volunteer from event:', error)
    throw new Error(error.message || 'Failed to leave event')
  }
}

// Admin function to assign/update volunteer role
export const updateVolunteerRole = async (eventId, userId, roleData) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId, 'volunteers', userId), {
      ...roleData,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating volunteer role:', error)
    throw new Error('Failed to update volunteer role')
  }
}

// Check and update event status based on closing date
export const checkAndUpdateEventStatus = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, COLLECTIONS.EVENTS, eventId))
    const eventData = eventDoc.data()
    
    if (!eventData || !eventData.closingDate) {
      return eventData
    }

    const closingDate = eventData.closingDate.toDate ? eventData.closingDate.toDate() : new Date(eventData.closingDate)
    const now = new Date()

    if (now > closingDate && eventData.status === 'open') {
      await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
        status: 'closed',
        updatedAt: serverTimestamp()
      })
      
      return { ...eventData, status: 'closed' }
    }

    return eventData
  } catch (error) {
    console.error('Error checking event status:', error)
    throw new Error('Failed to check event status')
  }
}