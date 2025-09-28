import React from 'react'
import { User, Mail, Phone, Calendar, Globe, Users } from 'lucide-react'

const ProfileTab = ({ userProfile, editData, isEditing, handleInputChange, errors = {} }) => {
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

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Full Name (as in NRIC) *</label>
          {isEditing ? (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="displayName"
                value={editData.displayName || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter your full name"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-900">
              <User className="h-4 w-4 text-gray-400" />
              <span>{userProfile?.displayName || 'Not provided'}</span>
            </div>
          )}
          {errors.displayName && (
            <p className="text-red-600 text-sm">{errors.displayName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nationality *</label>
          {isEditing ? (
            <select
              name="nationality"
              value={editData.nationality || ''}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select nationality</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.nationality || 'Not provided'}</span>
            </div>
          )}
          {editData.nationality === 'Other' && isEditing && (
            <input
              name="nationalityOther"
              value={editData.nationalityOther || ''}
              onChange={handleInputChange}
              className="input-field mt-2"
              placeholder="Please specify your nationality"
            />
          )}
          {errors.nationality && (
            <p className="text-red-600 text-sm">{errors.nationality}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          {isEditing ? (
            <select
              name="gender"
              value={editData.gender || ''}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select gender</option>
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.gender || 'Not provided'}</span>
            </div>
          )}
          {errors.gender && (
            <p className="text-red-600 text-sm">{errors.gender}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
          {isEditing ? (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="birthdate"
                type="date"
                value={editData.birthdate || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-900">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{userProfile?.birthdate || 'Not provided'}</span>
            </div>
          )}
          {errors.birthdate && (
            <p className="text-red-600 text-sm">{errors.birthdate}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address *</label>
          <div className="flex items-center space-x-2 text-gray-900">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{userProfile?.email || 'Not provided'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
          {isEditing ? (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="phone"
                value={editData.phone || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-900">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{userProfile?.phone || 'Not provided'}</span>
            </div>
          )}
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Area and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Area/District *</label>
          {isEditing ? (
            <input
              name="area"
              value={editData.area || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Toa Payoh, Jurong East"
            />
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.area || 'Not provided'}</span>
            </div>
          )}
          {errors.area && (
            <p className="text-red-600 text-sm">{errors.area}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
          {isEditing ? (
            <input
              name="postalCode"
              value={editData.postalCode || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., 123456"
            />
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.postalCode || 'Not provided'}</span>
            </div>
          )}
          {errors.postalCode && (
            <p className="text-red-600 text-sm">{errors.postalCode}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Primary Language *</label>
          {isEditing ? (
            <select
              name="language"
              value={editData.language || ''}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select primary language</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.language || 'Not provided'}</span>
            </div>
          )}
          {errors.language && (
            <p className="text-red-600 text-sm">{errors.language}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Religion *</label>
          {isEditing ? (
            <select
              name="religion"
              value={editData.religion || ''}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select religion</option>
              {religions.map(religion => (
                <option key={religion} value={religion}>{religion}</option>
              ))}
            </select>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.religion || 'Not provided'}</span>
            </div>
          )}
          {errors.religion && (
            <p className="text-red-600 text-sm">{errors.religion}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Occupation (Optional)</label>
          {isEditing ? (
            <input
              name="occupation"
              value={editData.occupation || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your occupation"
            />
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.occupation || 'Not provided'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cycling Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">How many years have you been cycling? (Optional)</label>
          {isEditing ? (
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="cyclingExperience"
                value={editData.cyclingExperience || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter years of cycling experience"
              />
            </div>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.cyclingExperience || 'Not provided'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cycling Group/Club (Optional)</label>
          {isEditing ? (
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="cyclingGroup"
                value={editData.cyclingGroup || ''}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter cycling group name"
              />
            </div>
          ) : (
            <div className="text-gray-900">
              <span>{userProfile?.cyclingGroup || 'Not provided'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileTab