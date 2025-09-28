import React from 'react'
import { Shield, Info } from 'lucide-react'

const Step1IntroductionConsent = ({ formData, updateFormData, errors }) => {
  const handleConsentChange = (field, value) => {
    updateFormData({
      ...formData,
      consent: {
        ...formData.consent,
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Program Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Thank you for your interest in volunteering with Ageless Bicyclists!
            </h3>
            <div className="text-blue-800 space-y-2">
              <p>
                Ageless Bicyclists creates active healthy lifestyle programs, workshops (recreational inclusive cycling & arts, exercises, and family bonding retreats) for silver communities,youths, different abilities/ASD; stroke persons and families. Ageless also organizes community events with partners catering to different abilities group enhancing intercultural experiences, friendships, family/community bonding and quality of life locally and overseas.
              </p>
              <p>
                Ageless Bicyclists welcomes volunteerism as it is part of its community service mission. Being a volunteer with Ageless Bicyclists, you have an opportunity to contribute and make a difference in the lives of others and the society, enhance go-green practices, gain inter-cultural experiences and foster new friendships.
              </p>
              <p>
                Ageless Bicyclists Ltd relies on a pool of willing, dedicated and passionate volunteers to continue to operate successfully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDPA Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Personal Data Protection Notice
            </h3>
            <div className="text-gray-700 space-y-2 text-sm">
              <p>
                In accordance with the Personal Data Protection Act (PDPA), we collect and process your personal information solely for the purpose of:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Processing your volunteer application</li>
                <li>Coordinating volunteer activities and events</li>
                <li>Emergency contact purposes during events</li>
                <li>Communication regarding volunteer opportunities</li>
                <li>Program improvement and analytics</li>
              </ul>
              <p>
                Your data will be kept secure and will not be shared with third parties without your explicit consent, except as required by law.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            id="pdpaConsent"
            type="checkbox"
            checked={formData.consent?.pdpaConsent || false}
            onChange={(e) => handleConsentChange('pdpaConsent', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="pdpaConsent" className="text-sm text-gray-700">
            I acknowledge that I have read and understood the Personal Data Protection Notice, 
            and I consent to the collection, use, and disclosure of my personal data as described above. *
          </label>
        </div>
        {errors.pdpaConsent && (
          <p className="text-red-600 text-sm ml-7">{errors.pdpaConsent}</p>
        )}

        <div className="flex items-start space-x-3">
          <input
            id="programConsent"
            type="checkbox"
            checked={formData.consent?.programConsent || false}
            onChange={(e) => handleConsentChange('programConsent', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="programConsent" className="text-sm text-gray-700">
            I understand the volunteer program requirements and commit to participating responsibly in Ageless Bicyclists events. *
          </label>
        </div>
        {errors.programConsent && (
          <p className="text-red-600 text-sm ml-7">{errors.programConsent}</p>
        )}

        <div className="flex items-start space-x-3">
          <input
            id="communicationConsent"
            type="checkbox"
            checked={formData.consent?.communicationConsent || false}
            onChange={(e) => handleConsentChange('communicationConsent', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="communicationConsent" className="text-sm text-gray-700">
            I consent to receive communications about volunteer opportunities, events, and program updates via email and/or SMS. (Optional)
          </label>
        </div>
      </div>
    </div>
  )
}

export default Step1IntroductionConsent