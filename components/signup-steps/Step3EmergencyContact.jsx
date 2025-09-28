import React from 'react'
import { User, Phone, MapPin, Users } from 'lucide-react'

const Step3EmergencyContact = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [name]: value
      }
    })
  }

  const relationships = [
    'Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Colleague', 'Other'
  ]

  return (
    <div className="space-y-6">
      {/* Information Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-amber-800 text-sm">
              Please provide emergency contact details for someone we can reach in case of any incident during volunteer activities. 
              This information will be kept confidential and used only for emergency purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Emergency Contact */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Emergency Contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name (as in NRIC) *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.emergencyContact?.name || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter contact's full name"
              />
            </div>
            {errors['emergencyContact.name'] && (
              <p className="text-red-600 text-sm">{errors['emergencyContact.name']}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="nickname"
                name="nickname"
                type="tel"
                value={formData.emergencyContact?.nickname || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter nickname (if any)"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.emergencyContact?.email || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter contact's email address"
              />
            </div>
            {errors['emergencyContact.email'] && (
              <p className="text-red-600 text-sm">{errors['emergencyContact.email']}</p>
            )}
          </div>

            
          <div className="space-y-2">
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
              Relationship *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="relationship"
                name="relationship"
                value={formData.emergencyContact?.relationship || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                required
              >
                <option value="">Select relationship</option>
                {relationships.map(relationship => (
                  <option key={relationship} value={relationship}>{relationship}</option>
                ))}
              </select>
            </div>
            {errors['emergencyContact.relationship'] && (
              <p className="text-red-600 text-sm">{errors['emergencyContact.relationship']}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.emergencyContact?.phone || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter contact's phone number"
              />
            </div>
            {errors['emergencyContact.phone'] && (
              <p className="text-red-600 text-sm">{errors['emergencyContact.phone']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Emergency Contact (Optional) */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Secondary Emergency Contact (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Providing a secondary contact ensures we can reach someone if the primary contact is unavailable.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="secondaryName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="secondaryName"
                name="secondaryName"
                type="text"
                value={formData.emergencyContact?.secondaryName || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter secondary contact's name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="secondaryRelationship" className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="secondaryRelationship"
                name="secondaryRelationship"
                value={formData.emergencyContact?.secondaryRelationship || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
              >
                <option value="">Select relationship</option>
                {relationships.map(relationship => (
                  <option key={relationship} value={relationship}>{relationship}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="secondaryPhone"
                name="secondaryPhone"
                type="tel"
                value={formData.emergencyContact?.secondaryPhone || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter secondary contact's phone"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information (Optional)</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
              Medical Conditions or Allergies
            </label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              rows={3}
              value={formData.emergencyContact?.medicalConditions || ''}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Please list any medical conditions, allergies, or medications that emergency responders should be aware of"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="emergencyInstructions" className="block text-sm font-medium text-gray-700">
              Emergency Instructions
            </label>
            <textarea
              id="emergencyInstructions"
              name="emergencyInstructions"
              rows={2}
              value={formData.emergencyContact?.emergencyInstructions || ''}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Any specific instructions for emergency situations (e.g., preferred hospital, insurance details)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step3EmergencyContact