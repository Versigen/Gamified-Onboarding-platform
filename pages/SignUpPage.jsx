import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bike, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

// Import step components
import ProgressIndicator from '../components/ProgressIndicator'
import ApplicationSubmissionModal from '../components/ApplicationSubmissionModal'
import Step1IntroductionConsent from '../components/signup-steps/Step1IntroductionConsent'
import Step2GettingToKnowYou from '../components/signup-steps/Step2GettingToKnowYou'
import Step3EmergencyContact from '../components/signup-steps/Step3EmergencyContact'
import Step4VolunteerExperience from '../components/signup-steps/Step4VolunteerExperience'
import Step5Questionnaire from '../components/signup-steps/Step5Questionnaire'
import Step6DiscoveryMotivation from '../components/signup-steps/Step6DiscoveryMotivation'
import Step7AffirmationWaiver from '../components/signup-steps/Step7AffirmationWaiver'
import Step8ReviewSubmit from '../components/signup-steps/Step8ReviewSubmit'

const STORAGE_KEY = 'ageless-bicyclists-signup-progress'

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    consent: {},
    personal: {},
    emergencyContact: {},
    volunteerExperience: {},
    questionnaire: {},
    discoveryMotivation: {},
    affirmationWaiver: {}
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const steps = [
    {
      title: "Introduction & Consent",
      shortTitle: "Intro",
      description: "Welcome! Please read and agree to our terms to proceed.",
      component: Step1IntroductionConsent
    },
    {
      title: "Getting to Know You",
      shortTitle: "Personal",
      description: "Tell us about yourself and your background.",
      component: Step2GettingToKnowYou
    },
    {
      title: "Emergency Contact",
      shortTitle: "Contact",
      description: "Provide emergency contact information for safety purposes.",
      component: Step3EmergencyContact
    },
    {
      title: "Volunteer Experience & Skills",
      shortTitle: "Experience",
      description: "Share your volunteer experience and relevant skills.",
      component: Step4VolunteerExperience
    },
    {
      title: "Questionnaire",
      shortTitle: "Questions",
      description: "Answer important questions about your suitability.",
      component: Step5Questionnaire
    },
    {
      title: "Discovery & Motivation",
      shortTitle: "Motivation",
      description: "Tell us how you found us and what motivates you.",
      component: Step6DiscoveryMotivation
    },
    {
      title: "Affirmation & Waiver",
      shortTitle: "Waiver",
      description: "Review and sign our volunteer agreement.",
      component: Step7AffirmationWaiver
    },
    {
      title: "Review & Submit",
      shortTitle: "Submit",
      description: "Review your application and submit.",
      component: Step8ReviewSubmit
    }
  ]

  // Load saved progress on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
        setCurrentStep(parsed.currentStep || 1)
      } catch (error) {
        console.error('Error loading saved progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever formData or currentStep changes
  useEffect(() => {
    const dataToSave = {
      formData,
      currentStep,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [formData, currentStep])

  // Password validation functions
  const validatePassword = (password) => {
    if (!password) return { isValid: false, message: 'Password is required' }
    if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' }
    if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter' }
    if (!/(?=.*[A-Z])/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter' }
    if (!/(?=.*\d)/.test(password)) return { isValid: false, message: 'Password must contain at least one number' }
    if (!/(?=.*[!@#$%^&*])/.test(password)) return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' }
    return { isValid: true, message: '' }
  }

  const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) return { isValid: false, message: 'Please confirm your password' }
    if (password !== confirmPassword) return { isValid: false, message: 'Passwords do not match' }
    return { isValid: true, message: '' }
  }

  const updateFormData = (newData) => {
    setFormData(newData)
    // Clear errors when data is updated
    setErrors({})
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.consent?.pdpaConsent) {
          newErrors.pdpaConsent = 'You must consent to the PDPA notice to proceed'
        }
        if (!formData.consent?.programConsent) {
          newErrors.programConsent = 'You must consent to the program requirements to proceed'
        }
        break
        
      case 2:
        const requiredPersonalFields = [
          'fullName', 'nationality', 'gender', 'birthdate', 
          'email', 'password', 'confirmPassword', 'phone', 'area', 'postalCode', 'language', 'religion'
        ]
        requiredPersonalFields.forEach(field => {
          if (!formData.personal?.[field]) {
            newErrors[`personal.${field}`] = 'This field is required'
          }
        })
        
        // Email validation
        if (formData.personal?.email && !formData.personal.email.includes('@')) {
          newErrors['personal.email'] = 'Please enter a valid email address'
        }
        
        // Password validation
        if (formData.personal?.password) {
          const passwordValidation = validatePassword(formData.personal.password)
          if (!passwordValidation.isValid) {
            newErrors['personal.password'] = passwordValidation.message
          }
        }
        
        // Password confirmation validation
        if (formData.personal?.password && formData.personal?.confirmPassword) {
          const passwordMatchValidation = validatePasswordMatch(formData.personal.password, formData.personal.confirmPassword)
          if (!passwordMatchValidation.isValid) {
            newErrors['personal.confirmPassword'] = passwordMatchValidation.message
          }
        }
        break
        
      case 3:
        const requiredEmergencyFields = ['name', 'relationship', 'phone', 'email']
        requiredEmergencyFields.forEach(field => {
          if (!formData.emergencyContact?.[field]) {
            newErrors[`emergencyContact.${field}`] = 'This field is required'
          }
        })
        break
        
      case 4:
        if (!formData.volunteerExperience?.experienceLevel) {
          newErrors['volunteerExperience.experienceLevel'] = 'Please select your volunteer experience level'
        }
        if (!formData.volunteerExperience?.relevantSkill) {
          newErrors['volunteerExperience.relevantSkill'] = 'Please select a relevant skill or interest'
        }
        break
        
      case 5:
        const requiredQuestions = [
          'firstAidCertificate', 'tobaccoProduct', 'specialNeedsVolunteer', 
          'disabilitiesVolunteer', 'elderliesVolunteer', 'chargedConvicted'
        ]
        requiredQuestions.forEach(question => {
          if (!formData.questionnaire?.[question]) {
            newErrors[`questionnaire.${question}`] = 'This question is required'
          }
        })
        
        // Validate follow-up question
        if (formData.questionnaire?.chargedConvicted === 'yes' && !formData.questionnaire?.chargedConvictedDetails) {
          newErrors['questionnaire.chargedConvictedDetails'] = 'Please provide details about any criminal charges or convictions'
        }
        
        if (!formData.questionnaire?.confirmAccuracy) {
          newErrors['questionnaire.confirmAccuracy'] = 'You must confirm the accuracy of your responses'
        }
        break
        
      case 6:
        if (!formData.discoveryMotivation?.discoveryMethods || formData.discoveryMotivation.discoveryMethods.length === 0) {
          newErrors['discoveryMotivation.discoveryMethods'] = 'Please select how you heard about us'
        }
        if (!formData.discoveryMotivation?.motivations || formData.discoveryMotivation.motivations.length === 0) {
          newErrors['discoveryMotivation.motivations'] = 'Please select your motivations'
        }
        if (!formData.discoveryMotivation?.expectations || formData.discoveryMotivation.expectations.length === 0) {
          newErrors['discoveryMotivation.expectations'] = 'Please select your expectations'
        }
        if (!formData.discoveryMotivation?.personalGoals) {
          newErrors['discoveryMotivation.personalGoals'] = 'Please describe your personal goals'
        }
        if (!formData.discoveryMotivation?.timeCommitment) {
          newErrors['discoveryMotivation.timeCommitment'] = 'Please select your time commitment'
        }
        if (!formData.discoveryMotivation?.longTermCommitment) {
          newErrors['discoveryMotivation.longTermCommitment'] = 'Please select your long-term commitment'
        }
        break
        
      case 7:
        const requiredWaiverFields = [
          'affirmationAgreement', 'waiverAgreement', 'photoConsent',
          'digitalSignature', 'signatureDate', 'finalConfirmation'
        ]
        requiredWaiverFields.forEach(field => {
          if (!formData.affirmationWaiver?.[field]) {
            newErrors[`affirmationWaiver.${field}`] = 'This field is required'
          }
        })
        break
        
      default:
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setErrors({}) // Clear errors when successfully moving to next step
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setErrors({}) // Clear errors when navigating
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleEditStep = (step) => {
    setErrors({}) // Clear errors when navigating to edit a step
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    // Validate all steps before submission
    let allValid = true
    for (let i = 1; i <= steps.length - 1; i++) {
      if (!validateStep(i)) {
        allValid = false
        break
      }
    }

    if (!allValid) {
      alert('Please complete all required fields before submitting.')
      return
    }

    setSubmitting(true)
    setLoading(true)

    try {
      // Create user account with email and user-provided password
      // This uses dual-collection approach:
      // - Personal info (name, email, phone, emergency contact) → 'users' collection
      // - Complete form data (questionnaire, experience, etc.) → 'volunteers' collection
      const user = await signUp(
        formData.personal.email, 
        formData.personal.password, 
        {
          displayName: formData.personal.fullName,
          phone: formData.personal.phone
        },
        formData // Pass complete form data as the fourth parameter
      )

      // Clear saved progress
      localStorage.removeItem(STORAGE_KEY)
      
      // Show success modal instead of alert
      setShowSuccessModal(true)
      
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false)
    navigate('/tutorial')
  }

  const generateTemporaryPassword = () => {
    // Generate a temporary password - in a real app, this would be sent via email
    return Math.random().toString(36).slice(-8) + 'A1!'
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <Bike className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Volunteer Community
          </h1>
          <p className="text-gray-600">
            Complete your volunteer application to start making a difference
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          steps={steps} 
        />

        {/* Form Content */}
        <div className="card animate-fade-in">
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-semibold">Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Step Content */}
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onEdit={currentStep === 8 ? handleEditStep : undefined}
            isSubmitting={submitting}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`btn-secondary flex items-center space-x-2 ${
                currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || submitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            )}
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ApplicationSubmissionModal 
        isOpen={showSuccessModal}
        onConfirm={handleSuccessModalConfirm}
      />
    </div>
  )
}

export default SignUpPage