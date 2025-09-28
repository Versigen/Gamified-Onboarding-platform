import React from 'react'
import { Shield, FileText, Pen } from 'lucide-react'

const Step7AffirmationWaiver = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    updateFormData({
      ...formData,
      affirmationWaiver: {
        ...formData.affirmationWaiver,
        [name]: type === 'checkbox' ? checked : value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Volunteer Affirmation */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Volunteer Affirmation</h3>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-700 space-y-3">
            <p className="font-medium">As a volunteer with Ageless Bicyclists, I affirm that:</p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>I will conduct myself in a professional and respectful manner at all times</li>
              <li>I will follow all safety guidelines and instructions provided by event organizers</li>
              <li>I will respect the confidentiality of any personal information I may encounter</li>
              <li>I will not discriminate against any individual based on race, religion, gender, age, or other protected characteristics</li>
              <li>I will report any safety concerns or incidents to the appropriate organizers immediately</li>
              <li>I will arrive punctually and fulfill my volunteer commitments to the best of my ability</li>
              <li>I will not consume alcohol or illegal substances before or during volunteer activities</li>
              <li>I will wear appropriate clothing and safety equipment as required for my volunteer role</li>
              <li>I understand that my volunteer role may involve physical activity and outdoor work</li>
              <li>I will treat all participants, fellow volunteers, and staff with courtesy and respect</li>
            </ul>
            
            <p className="font-medium mt-4">I also understand that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ageless Bicyclists reserves the right to terminate my volunteer service at any time if these standards are not met</li>
              <li>I may be required to undergo training before participating in certain volunteer activities</li>
              <li>Photography and videography may take place during events, and my image may be used for promotional purposes</li>
              <li>I should inform organizers of any changes to my contact information or availability</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <input
            id="affirmationAgreement"
            name="affirmationAgreement"
            type="checkbox"
            checked={formData.affirmationWaiver?.affirmationAgreement || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="affirmationAgreement" className="text-sm text-gray-700">
            I have read and understood the volunteer affirmation above, and I agree to abide by these standards and expectations. *
          </label>
        </div>
        {errors['affirmationWaiver.affirmationAgreement'] && (
          <p className="text-red-600 text-sm ml-7 mt-1">{errors['affirmationWaiver.affirmationAgreement']}</p>
        )}
      </div>

      {/* Liability Waiver */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Liability Waiver and Release</h3>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-amber-800 space-y-3">
            <p className="font-semibold">PLEASE READ CAREFULLY - THIS IS A LEGAL DOCUMENT</p>
            
            <div className="space-y-3">
              <p>
                <strong>ASSUMPTION OF RISK:</strong> I understand that volunteering with Ageless Bicyclists involves activities that may include physical exertion, outdoor activities, interaction with cycling equipment, and potential exposure to various weather conditions. I acknowledge that these activities carry inherent risks including, but not limited to, personal injury, property damage, or other losses.
              </p>
              
              <p>
                <strong>RELEASE OF LIABILITY:</strong> In consideration of being permitted to volunteer with Ageless Bicyclists, I hereby release, waive, discharge, and covenant not to sue Ageless Bicyclists, its officers, directors, employees, volunteers, agents, and representatives (collectively "Released Parties") from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury that may be sustained by me while volunteering or participating in any related activities.
              </p>
              
              <p>
                <strong>INDEMNIFICATION:</strong> I agree to indemnify and hold harmless the Released Parties from any loss or liability incurred as a result of my actions or omissions while volunteering.
              </p>
              
              <p>
                <strong>MEDICAL TREATMENT:</strong> I authorize the Released Parties to seek emergency medical treatment on my behalf if necessary, and I agree to be responsible for any costs associated with such treatment.
              </p>
              
              <p>
                <strong>PHOTOGRAPHIC RELEASE:</strong> I grant permission for Ageless Bicyclists to use photographs, videos, or other recordings of me taken during volunteer activities for promotional, educational, or other organizational purposes.
              </p>
              
              <p>
                <strong>GOVERNING LAW:</strong> This agreement shall be governed by the laws of Singapore, and any disputes shall be resolved in the appropriate courts of Singapore.
              </p>
              
              <p className="font-semibold">
                I acknowledge that I have read this waiver and release, fully understand its terms, and am signing it freely and voluntarily without any inducement.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              id="waiverAgreement"
              name="waiverAgreement"
              type="checkbox"
              checked={formData.affirmationWaiver?.waiverAgreement || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="waiverAgreement" className="text-sm text-gray-700">
              I have read and understood the liability waiver and release above, and I agree to its terms and conditions. *
            </label>
          </div>
          {errors['affirmationWaiver.waiverAgreement'] && (
            <p className="text-red-600 text-sm ml-7">{errors['affirmationWaiver.waiverAgreement']}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              id="photoConsent"
              name="photoConsent"
              type="checkbox"
              checked={formData.affirmationWaiver?.photoConsent || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="photoConsent" className="text-sm text-gray-700">
              I consent to being photographed/recorded during volunteer activities and the use of such media for promotional purposes. *
            </label>
          </div>
          {errors['affirmationWaiver.photoConsent'] && (
            <p className="text-red-600 text-sm ml-7">{errors['affirmationWaiver.photoConsent']}</p>
          )}
        </div>
      </div>

      {/* Digital Signature */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Pen className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Digital Signature</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="digitalSignature" className="block text-sm font-medium text-gray-700">
              Digital Signature (Type your full legal name) *
            </label>
            <input
              id="digitalSignature"
              name="digitalSignature"
              type="text"
              value={formData.affirmationWaiver?.digitalSignature || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Type your full legal name as your digital signature"
            />
            <p className="text-xs text-gray-600">
              By typing your name above, you are providing your digital signature and agreeing to all terms and conditions.
            </p>
            {errors['affirmationWaiver.digitalSignature'] && (
              <p className="text-red-600 text-sm">{errors['affirmationWaiver.digitalSignature']}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="signatureDate" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              id="signatureDate"
              name="signatureDate"
              type="date"
              value={formData.affirmationWaiver?.signatureDate || new Date().toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors['affirmationWaiver.signatureDate'] && (
              <p className="text-red-600 text-sm">{errors['affirmationWaiver.signatureDate']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Final Confirmation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            id="finalConfirmation"
            name="finalConfirmation"
            type="checkbox"
            checked={formData.affirmationWaiver?.finalConfirmation || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="finalConfirmation" className="text-sm text-blue-800">
            <strong>Final Confirmation:</strong> I confirm that I am at least 18 years of age (or have parental/guardian consent), have the legal capacity to enter into this agreement, and that all information provided in this application is accurate and complete. I understand that this constitutes a legally binding agreement. *
          </label>
        </div>
        {errors['affirmationWaiver.finalConfirmation'] && (
          <p className="text-red-600 text-sm ml-7 mt-1">{errors['affirmationWaiver.finalConfirmation']}</p>
        )}
      </div>
    </div>
  )
}

export default Step7AffirmationWaiver