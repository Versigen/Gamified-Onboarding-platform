// Test data and utilities for development/demo purposes

export const createMockVolunteers = () => {
  const mockVolunteers = [
    {
      uid: 'test-volunteer-1',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      status: 'pending',
      createdAt: new Date('2024-01-15'),
      formData: {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1-555-0123',
          dateOfBirth: '1985-03-15'
        },
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1-555-0124'
        },
        volunteerExperience: {
          experienceLevel: 'intermediate',
          previousExperience: 'Volunteered at local food bank for 2 years'
        }
      }
    },
    {
      uid: 'test-volunteer-2',
      email: 'mary.smith@example.com',
      displayName: 'Mary Smith',
      status: 'approved',
      createdAt: new Date('2024-01-10'),
      formData: {
        personal: {
          firstName: 'Mary',
          lastName: 'Smith',
          phone: '+1-555-0125',
          dateOfBirth: '1992-07-22'
        },
        emergencyContact: {
          name: 'Robert Smith',
          phone: '+1-555-0126'
        },
        volunteerExperience: {
          experienceLevel: 'advanced',
          previousExperience: 'Experienced cyclist and event organizer'
        }
      }
    },
    {
      uid: 'test-volunteer-3',
      email: 'bob.wilson@example.com',
      displayName: 'Bob Wilson',
      status: 'rejected',
      createdAt: new Date('2024-01-05'),
      adminNotes: 'Did not meet cycling experience requirements',
      formData: {
        personal: {
          firstName: 'Bob',
          lastName: 'Wilson',
          phone: '+1-555-0127',
          dateOfBirth: '1978-11-30'
        },
        emergencyContact: {
          name: 'Susan Wilson',
          phone: '+1-555-0128'
        },
        volunteerExperience: {
          experienceLevel: 'beginner',
          previousExperience: 'No prior volunteer experience'
        }
      }
    },
    {
      uid: 'test-volunteer-4',
      email: 'alice.brown@example.com',
      displayName: 'Alice Brown',
      status: 'pending',
      createdAt: new Date('2024-01-20'),
      formData: {
        personal: {
          firstName: 'Alice',
          lastName: 'Brown',
          phone: '+1-555-0129',
          dateOfBirth: '1988-05-08'
        },
        emergencyContact: {
          name: 'David Brown',
          phone: '+1-555-0130'
        },
        volunteerExperience: {
          experienceLevel: 'intermediate',
          previousExperience: 'Active in community sports events'
        }
      }
    },
    {
      uid: 'test-volunteer-5',
      email: 'charlie.davis@example.com',
      displayName: 'Charlie Davis',
      status: 'approved',
      createdAt: new Date('2024-01-25'),
      formData: {
        personal: {
          firstName: 'Charlie',
          lastName: 'Davis',
          phone: '+1-555-0131',
          dateOfBirth: '1995-09-12'
        },
        emergencyContact: {
          name: 'Emma Davis',
          phone: '+1-555-0132'
        },
        volunteerExperience: {
          experienceLevel: 'advanced',
          previousExperience: 'Professional cyclist, volunteer coach'
        }
      }
    }
  ]
  
  return mockVolunteers
}

export const createTestAdminUser = () => {
  return {
    uid: 'admin-test-user',
    email: 'admin@agelessbicyclists.com',
    displayName: 'Admin User',
    role: 'admin',
    status: 'approved',
    createdAt: new Date('2024-01-01')
  }
}

// Test volunteer user for demo purposes
export const createTestVolunteerUser = () => {
  return {
    uid: 'test-volunteer-user',
    email: 'volunteer@example.com',
    displayName: 'Test Volunteer',
    role: 'volunteer',
    status: 'approved',
    createdAt: new Date('2024-01-01')
  }
}

// Mock events with location data for testing the map functionality
export const createMockEvents = () => {
  return [
    {
      id: 'event-1',
      name: 'Marina Bay Park Cycling Event',
      description: 'Join us for a scenic cycling tour around Marina Bay with volunteer support stations.',
      date: new Date('2024-02-15'),
      time: '08:00',
      location: 'Marina Bay Sands, Singapore',
      locationCoords: {
        lat: 1.2836,
        lng: 103.8606
      },
      waypoints: [
        {
          label: 'Registration Counter',
          description: 'Check-in point for all participants',
          lat: 1.2830,
          lng: 103.8610
        },
        {
          label: 'First Aid Station',
          description: 'Medical assistance and emergency support',
          lat: 1.2840,
          lng: 103.8595
        },
        {
          label: 'Water Station',
          description: 'Hydration stop for cyclists',
          lat: 1.2825,
          lng: 103.8620
        }
      ],
      status: 'open',
      closingDate: new Date('2024-02-10'),
      totalVolunteers: 5,
      roles: [
        { name: 'Registration Assistant', requiredCount: 2 },
        { name: 'Route Marshal', requiredCount: 3 },
        { name: 'First Aid Support', requiredCount: 1 }
      ],
      volunteers: []
    },
    {
      id: 'event-2', 
      name: 'East Coast Park Family Ride',
      description: 'Family-friendly cycling event along East Coast Park with safety marshals.',
      date: new Date('2024-02-22'),
      time: '09:00',
      location: 'East Coast Park, Area C',
      locationCoords: {
        lat: 1.3010,
        lng: 103.9065
      },
      waypoints: [
        {
          label: 'Starting Point',
          description: 'Main assembly area for participants',
          lat: 1.3005,
          lng: 103.9070
        },
        {
          label: 'Safety Checkpoint',
          description: 'Bicycle safety inspection point',
          lat: 1.3015,
          lng: 103.9060
        }
      ],
      status: 'open',
      closingDate: new Date('2024-02-18'),
      totalVolunteers: 2,
      roles: [
        { name: 'Safety Marshal', requiredCount: 4 },
        { name: 'Registration Helper', requiredCount: 2 }
      ],
      volunteers: []
    },
    {
      id: 'event-3',
      name: 'Sentosa Island Adventure',
      description: 'Guided cycling tour around Sentosa Island with volunteer support.',
      date: new Date('2024-03-01'),
      time: '10:00',
      location: 'Sentosa Gateway, Singapore',
      locationCoords: {
        lat: 1.2494,
        lng: 103.8303
      },
      waypoints: [
        {
          label: 'Visitor Centre',
          description: 'Information and registration desk',
          lat: 1.2500,
          lng: 103.8300
        },
        {
          label: 'Beach Station',
          description: 'Rest stop near Siloso Beach',
          lat: 1.2480,
          lng: 103.8280
        },
        {
          label: 'Cable Car Station',
          description: 'Photo opportunity and refreshment point',
          lat: 1.2510,
          lng: 103.8320
        }
      ],
      status: 'open',
      closingDate: new Date('2024-02-25'),
      totalVolunteers: 0,
      roles: [
        { name: 'Tour Guide Assistant', requiredCount: 3 },
        { name: 'Photography Helper', requiredCount: 1 },
        { name: 'Logistics Support', requiredCount: 2 }
      ],
      volunteers: []
    },
    {
      id: 'event-4',
      name: 'City Center Night Ride',
      description: 'Evening cycling event through Singapore\'s city center with illuminated routes.',
      date: new Date('2024-03-08'),
      time: '19:00',
      location: 'Raffles Place, Singapore',
      // No location coordinates - to test events without map data
      status: 'open',
      closingDate: new Date('2024-03-05'),
      totalVolunteers: 1,
      roles: [
        { name: 'Night Safety Marshal', requiredCount: 5 },
        { name: 'Equipment Manager', requiredCount: 2 }
      ],
      volunteers: []
    }
  ]
}