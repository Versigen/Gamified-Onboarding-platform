import React from 'react'
import { Users, Award } from 'lucide-react'

const Step4VolunteerExperience = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({
      ...formData,
      volunteerExperience: {
        ...formData.volunteerExperience,
        [name]: value
      }
    })
  }

  const experienceLevels = [
    { value: 'none', label: 'No prior volunteering experience' },
    { value: 'minimal', label: 'Some casual volunteering (less than 1 year)' },
    { value: 'moderate', label: 'Regular volunteering (1-3 years)' },
    { value: 'extensive', label: 'Extensive volunteering (3+ years)' },
    { value: 'leadership', label: 'Volunteer leadership roles' }
  ]

  const relevantSkills = [
    { value: 'admin', label: 'Admin' },
    { value: 'finance', label: 'Finance' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'marketing', label: 'Marketing / PR' },
    { value: 'it', label: 'IT / Social Media' },
    { value: 'organizing', label: 'Organizing / Training' },
    { value: 'cycling', label: 'Cycling Buddies' },
    { value: 'mechanic', label: 'Bike Mechanic' },
    { value: 'artist', label: 'Artist' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Previous Volunteer Experience */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Previous Volunteer Experience</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Volunteer Experience Level *
            </label>
            <div className="space-y-2">
              {experienceLevels.map(level => (
                <label key={level.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level.value}
                    checked={formData.volunteerExperience?.experienceLevel === level.value}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
            {errors['volunteerExperience.experienceLevel'] && (
              <p className="text-red-600 text-sm">{errors['volunteerExperience.experienceLevel']}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700">
              Describe Previous Volunteer Experience (Optional)
            </label>
            <textarea
              id="previousExperience"
              name="previousExperience"
              rows={4}
              value={formData.volunteerExperience?.previousExperience || ''}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Tell us about your previous volunteer experiences, organizations you've worked with, or roles you've held..."
            />
          </div>
        </div>
      </div>

      {/* Relevant Skills/Interests */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Relevant Skills & Interests</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          What hobbies, skills, special interests or qualities do you have that may be relevant to the volunteer role? *
        </p>
        
        <div className="space-y-2">
          {relevantSkills.map(skill => (
            <label key={skill.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="relevantSkill"
                value={skill.value}
                checked={formData.volunteerExperience?.relevantSkill === skill.value}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{skill.label}</span>
            </label>
          ))}
        </div>
        
        {formData.volunteerExperience?.relevantSkill === 'other' && (
          <div className="mt-4 space-y-2">
            <label htmlFor="otherSkill" className="block text-sm font-medium text-gray-700">
              Please specify:
            </label>
            <input
              id="otherSkill"
              name="otherSkill"
              type="text"
              value={formData.volunteerExperience?.otherSkill || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Please describe your relevant skills or interests"
            />
          </div>
        )}
        
        {errors['volunteerExperience.relevantSkill'] && (
          <p className="text-red-600 text-sm mt-2">{errors['volunteerExperience.relevantSkill']}</p>
        )}
      </div>
    </div>
  )
}

export default Step4VolunteerExperience