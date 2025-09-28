import React, { useState } from 'react'
import { User, Mail, Phone, Calendar, Globe, Users, Lock, Eye, EyeOff } from 'lucide-react'

const Step2GettingToKnowYou = ({ formData, updateFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    let { name, value } = e.target
    
    // Handle nested objects for personal details
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      updateFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      })
    } else {
      updateFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const nationalities = [
    'Singaporean', 'Malaysian', 'Other'
  ]

  const genders = ['Male', 'Female']
  
  const languages = [
    'English', 'Mandarin', 'Malay', 'Tamil', 'Hokkien', 'Teochew', 'Cantonese', 'Hindi', 'Bengali', 'Other'
  ]

  const religions = [
    'Buddhism', 'Christianity', 'Islam', 'Hinduism', 'Other', 'No religion'
  ]

  // Password strength validation
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

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="personal.fullName" className="block text-sm font-medium text-gray-700">
            Full Name (as in NRIC) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.fullName"
              name="personal.fullName"
              type="text"
              required
              value={formData.personal?.fullName || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter your full name"
            />
          </div>
          {errors['personal.fullName'] && (
            <p className="text-red-600 text-sm">{errors['personal.fullName']}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="personal.Nickname" className="block text-sm font-medium text-gray-700">
            Nickname (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.Nickname"
              name="personal.Nickname"
              type="text"
              required
              value={formData.personal?.Nickname || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter your nickname"
            />
          </div>
        </div>


        <div className="space-y-2">
          <label htmlFor="personal.nationality" className="block text-sm font-medium text-gray-700">
            Nationality *
          </label>
          <select
            id="personal.nationality"
            name="personal.nationality"
            value={formData.personal?.nationality || ''}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select nationality</option>
            {nationalities.map(nationality => (
              <option key={nationality} value={nationality}>{nationality}</option>
            ))}
          </select>
          {formData.personal?.nationality === 'Other' && (
            <input
              id="personal.nationalityOther"
              name="personal.nationalityOther"
              type="text"
              value={formData.personal?.nationalityOther || ''}
              onChange={handleInputChange}
              className="input-field mt-2"
              placeholder="Please specify your nationality"
              required
            />
          )}
          {errors['personal.nationality'] && (
            <p className="text-red-600 text-sm">{errors['personal.nationality']}</p>
          )}
          {errors['personal.nationalityOther'] && (
            <p className="text-red-600 text-sm">{errors['personal.nationalityOther']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.gender" className="block text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            id="personal.gender"
            name="personal.gender"
            value={formData.personal?.gender || ''}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select gender</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          {errors['personal.gender'] && (
            <p className="text-red-600 text-sm">{errors['personal.gender']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.birthdate" className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.birthdate"
              name="personal.birthdate"
              type="date"
              required
              value={formData.personal?.birthdate || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors['personal.birthdate'] && (
            <p className="text-red-600 text-sm">{errors['personal.birthdate']}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="personal.email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.email"
              name="personal.email"
              type="email"
              required
              value={formData.personal?.email || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter your email address"
            />
          </div>
          {errors['personal.email'] && (
            <p className="text-red-600 text-sm">{errors['personal.email']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.password"
              name="personal.password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.personal?.password || ''}
              onChange={handleInputChange}
              className="input-field pl-10 pr-10"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors['personal.password'] && (
            <p className="text-red-600 text-sm">{errors['personal.password']}</p>
          )}
        </div>
      </div>

      {/* Password Confirmation Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="personal.confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.confirmPassword"
              name="personal.confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.personal?.confirmPassword || ''}
              onChange={handleInputChange}
              className="input-field pl-10 pr-10"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors['personal.confirmPassword'] && (
            <p className="text-red-600 text-sm">{errors['personal.confirmPassword']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.phone"
              name="personal.phone"
              type="tel"
              required
              value={formData.personal?.phone || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter your phone number"
            />
          </div>
          {errors['personal.phone'] && (
            <p className="text-red-600 text-sm">{errors['personal.phone']}</p>
          )}
        </div>
      </div>

      {/* Area and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="personal.area" className="block text-sm font-medium text-gray-700">
            Area/District *
          </label>
          <input
            id="personal.area"
            name="personal.area"
            type="text"
            required
            value={formData.personal?.area || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., Toa Payoh, Jurong East"
          />
          {errors['personal.area'] && (
            <p className="text-red-600 text-sm">{errors['personal.area']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code *
          </label>
          <input
            id="personal.postalCode"
            name="personal.postalCode"
            type="text"
            required
            value={formData.personal?.postalCode || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., 123456"
          />
          {errors['personal.postalCode'] && (
            <p className="text-red-600 text-sm">{errors['personal.postalCode']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.language" className="block text-sm font-medium text-gray-700">
            Primary Language *
          </label>
          <select
            id="personal.language"
            name="personal.language"
            value={formData.personal?.language || ''}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select primary language</option>
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
          {errors['personal.language'] && (
            <p className="text-red-600 text-sm">{errors['personal.language']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.religion" className="block text-sm font-medium text-gray-700">
            Religion *
          </label>
          <select
            id="personal.religion"
            name="personal.religion"
            value={formData.personal?.religion || ''}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select religion</option>
            {religions.map(religion => (
              <option key={religion} value={religion}>{religion}</option>
            ))}
          </select>
          {errors['personal.religion'] && (
            <p className="text-red-600 text-sm">{errors['personal.religion']}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="personal.occupation" className="block text-sm font-medium text-gray-700">
            Occupation (Optional)
          </label>
          <input
            id="personal.occupation"
            name="personal.occupation"
            type="text"
            value={formData.personal?.occupation || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter your occupation"
          />
        </div>
      </div>

      {/* Cycling Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-2">
          <label htmlFor="personal.cyclingExperience" className="block text-sm font-medium text-gray-700">
            How many years have you been cycling? (Optional)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.cyclingExperience"
              name="personal.cyclingExperience"
              type="text"
              value={formData.personal?.cyclingExperience || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter years of cycling experience"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="personal.cyclingGroup" className="block text-sm font-medium text-gray-700">
            Cycling Group/Club (Optional)
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="personal.cyclingGroup"
              name="personal.cyclingGroup"
              type="text"
              value={formData.personal?.cyclingGroup || ''}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Enter cycling group name"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2GettingToKnowYou