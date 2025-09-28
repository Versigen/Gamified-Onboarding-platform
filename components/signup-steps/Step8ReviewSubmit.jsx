import React from 'react'
import { Check, User, Phone, Mail, MapPin, Heart, Award, FileText, Edit } from 'lucide-react'

const Step8ReviewSubmit = ({ formData, onEdit, isSubmitting }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const formatArray = (array) => {
    if (!array || array.length === 0) return 'None selected'
    return array.join(', ')
  }

  const renderSection = (title, icon, step, children, canEdit = true) => (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )

  const renderField = (label, value) => (
    <div className="flex justify-between items-start">
      <span className="text-sm font-medium text-gray-600 w-1/3">{label}:</span>
      <span className="text-sm text-gray-900 w-2/3 text-right">{value || 'Not provided'}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">Review Your Application</h3>
            <p className="text-blue-800 text-sm">
              Please review all the information below carefully. You can edit any section by clicking the "Edit" button. 
              Once you're satisfied with all details, proceed to submit your volunteer application.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Information */}
      {renderSection(
        "Consent & Agreement", 
        <FileText className="h-5 w-5 text-primary-600" />, 
        1,
        <>
          {renderField("PDPA Consent", formData.consent?.pdpaConsent ? "Agreed" : "Not agreed")}
          {renderField("Program Consent", formData.consent?.programConsent ? "Agreed" : "Not agreed")}
          {renderField("Communication Consent", formData.consent?.communicationConsent ? "Agreed" : "Declined")}
        </>
      )}

      {/* Personal Information */}
      {renderSection(
        "Personal Information", 
        <User className="h-5 w-5 text-primary-600" />, 
        2,
        <>
          {renderField("Full Name", formData.personal?.fullName)}
          {renderField("Email", formData.personal?.email)}
          {renderField("Phone", formData.personal?.phone)}
          {renderField("Nationality", formData.personal?.nationality)}
          {renderField("Gender", formData.personal?.gender)}
          {renderField("Date of Birth", formatDate(formData.personal?.birthdate))}
          {renderField("Area", formData.personal?.area)}
          {renderField("Language", formData.personal?.language)}
          {renderField("Religion", formData.personal?.religion)}
          {renderField("Occupation", formData.personal?.occupation)}
          {renderField("Cycling Experience", formData.personal?.cyclingExperience)}
          {renderField("Cycling Group", formData.personal?.cyclingGroup)}
        </>
      )}

      {/* Emergency Contact */}
      {renderSection(
        "Emergency Contact", 
        <Phone className="h-5 w-5 text-primary-600" />, 
        3,
        <>
          {renderField("Contact Name", formData.emergencyContact?.name)}
          {renderField("Relationship", formData.emergencyContact?.relationship)}
          {renderField("Phone Number", formData.emergencyContact?.phone)}
          {renderField("Alternate Phone", formData.emergencyContact?.alternatePhone)}
          {renderField("Address", formData.emergencyContact?.address)}
          {formData.emergencyContact?.secondaryName && (
            <>
              {renderField("Secondary Contact", formData.emergencyContact?.secondaryName)}
              {renderField("Secondary Relationship", formData.emergencyContact?.secondaryRelationship)}
              {renderField("Secondary Phone", formData.emergencyContact?.secondaryPhone)}
            </>
          )}
          {renderField("Medical Conditions", formData.emergencyContact?.medicalConditions)}
          {renderField("Emergency Instructions", formData.emergencyContact?.emergencyInstructions)}
        </>
      )}

      {/* Volunteer Experience */}
      {renderSection(
        "Volunteer Experience & Skills", 
        <Award className="h-5 w-5 text-primary-600" />, 
        4,
        <>
          {renderField("Experience Level", formData.volunteerExperience?.experienceLevel?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}
          {renderField("Previous Experience", formData.volunteerExperience?.previousExperience || "No description provided")}
          {renderField("Areas of Interest", formatArray(formData.volunteerExperience?.interests))}
          {renderField("Skills", formatArray(formData.volunteerExperience?.skills))}
          {renderField("Additional Skills", formData.volunteerExperience?.additionalSkills)}
          {renderField("Motivations", formatArray(formData.volunteerExperience?.motivations))}
          {renderField("Personal Motivation", formData.volunteerExperience?.personalMotivation)}
        </>
      )}

      {/* Questionnaire Summary */}
      {renderSection(
        "Questionnaire Responses", 
        <FileText className="h-5 w-5 text-primary-600" />, 
        5,
        <>
          {renderField("Physically Fit", formData.questionnaire?.physicallyFit ? "Yes" : "No")}
          {renderField("Medical Conditions", formData.questionnaire?.medicalConditions ? "Yes" : "No")}
          {formData.questionnaire?.medicalConditions === 'yes' && formData.questionnaire?.medicalConditionsDetails && 
            renderField("Medical Details", formData.questionnaire.medicalConditionsDetails)}
          {renderField("Taking Medications", formData.questionnaire?.medications ? "Yes" : "No")}
          {formData.questionnaire?.medications === 'yes' && formData.questionnaire?.medicationsDetails && 
            renderField("Medication Details", formData.questionnaire.medicationsDetails)}
          {renderField("Has Allergies", formData.questionnaire?.allergies ? "Yes" : "No")}
          {formData.questionnaire?.allergies === 'yes' && formData.questionnaire?.allergiesDetails && 
            renderField("Allergy Details", formData.questionnaire.allergiesDetails)}
          {renderField("Comfortable with Emergencies", formData.questionnaire?.emergencyResponse ? "Yes" : "No")}
          {renderField("Outdoor Activities", formData.questionnaire?.outdoorActivities ? "Yes" : "No")}
          {renderField("Team Work", formData.questionnaire?.teamWork ? "Yes" : "No")}
          {renderField("Public Interaction", formData.questionnaire?.publicInteraction ? "Yes" : "No")}
          {renderField("Time Commitment", formData.questionnaire?.timeCommitment ? "Yes" : "No")}
          {renderField("Background Check", formData.questionnaire?.backgroundCheck ? "Yes" : "No")}
          {renderField("Criminal Record", formData.questionnaire?.chargedConvicted ? "Yes" : "No")}
          {formData.questionnaire?.chargedConvicted === 'yes' && formData.questionnaire?.chargedConvictedDetails && 
            renderField("Criminal Record Details", formData.questionnaire.chargedConvictedDetails)}
          {renderField("Reliability", formData.questionnaire?.reliability ? "Yes" : "No")}
          {renderField("Additional Info", formData.questionnaire?.additionalInfo)}
          {renderField("Accommodations", formData.questionnaire?.accommodations)}
          {renderField("Accuracy Confirmed", formData.questionnaire?.confirmAccuracy ? "Yes" : "No")}
        </>
      )}

      {/* Discovery & Motivation */}
      {renderSection(
        "Discovery & Motivation", 
        <Heart className="h-5 w-5 text-primary-600" />, 
        6,
        <>
          {renderField("How You Heard About Us", formatArray(formData.discoveryMotivation?.discoveryMethods))}
          {formData.discoveryMotivation?.otherDiscovery && 
            renderField("Other Discovery Method", formData.discoveryMotivation.otherDiscovery)}
          {renderField("Referrer", formData.discoveryMotivation?.referrerDetails)}
          {renderField("Motivations", formatArray(formData.discoveryMotivation?.motivations))}
          {renderField("Personal Motivation", formData.discoveryMotivation?.personalMotivation)}
          {renderField("Expectations", formatArray(formData.discoveryMotivation?.expectations))}
          {renderField("Personal Goals", formData.discoveryMotivation?.personalGoals)}
          {renderField("Time Commitment", formData.discoveryMotivation?.timeCommitment)}
          {renderField("Long-term Commitment", formData.discoveryMotivation?.longTermCommitment)}
          {renderField("Additional Comments", formData.discoveryMotivation?.additionalComments)}
        </>
      )}

      {/* Affirmation & Waiver */}
      {renderSection(
        "Affirmation & Waiver", 
        <Check className="h-5 w-5 text-primary-600" />, 
        7,
        <>
          {renderField("Volunteer Affirmation", formData.affirmationWaiver?.affirmationAgreement ? "Agreed" : "Not agreed")}
          {renderField("Liability Waiver", formData.affirmationWaiver?.waiverAgreement ? "Agreed" : "Not agreed")}
          {renderField("Photo Consent", formData.affirmationWaiver?.photoConsent ? "Agreed" : "Not agreed")}
          {renderField("Digital Signature", formData.affirmationWaiver?.digitalSignature)}
          {renderField("Signature Date", formatDate(formData.affirmationWaiver?.signatureDate))}
          {renderField("Final Confirmation", formData.affirmationWaiver?.finalConfirmation ? "Confirmed" : "Not confirmed")}
        </>
      )}

      {/* Submission Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-green-900 mb-2">Ready to Submit</h3>
            <p className="text-green-800 text-sm">
              By clicking "Submit Application" below, you confirm that all information provided is accurate and complete. 
              Your application will be reviewed by our team and you will receive a response within 7-10 business days.
            </p>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <p className="text-blue-800 text-sm font-medium">
              Submitting your application... Please do not close this page.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step8ReviewSubmit