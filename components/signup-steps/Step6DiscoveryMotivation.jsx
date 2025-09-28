import React from 'react'
import { Lightbulb, Target, Users, Globe } from 'lucide-react'

const Step6DiscoveryMotivation = ({ formData, updateFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({
      ...formData,
      discoveryMotivation: {
        ...formData.discoveryMotivation,
        [name]: value
      }
    })
  }

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData.discoveryMotivation?.[field] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    updateFormData({
      ...formData,
      discoveryMotivation: {
        ...formData.discoveryMotivation,
        [field]: newValues
      }
    })
  }

  const discoveryMethods = [
    { id: 'website', label: 'Ageless Bicyclists website' },
    { id: 'socialMedia', label: 'Social media (Facebook, Instagram, etc.)' },
    { id: 'friend', label: 'Friend or family member' },
    { id: 'colleague', label: 'Colleague or professional network' },
    { id: 'event', label: 'Attended a cycling event' },
    { id: 'newspaper', label: 'Newspaper or magazine article' },
    { id: 'onlineSearch', label: 'Online search engine' },
    { id: 'community', label: 'Community center or notice board' },
    { id: 'cyclingGroup', label: 'Through my cycling group/club' },
    { id: 'volunteer', label: 'Existing volunteer referred me' },
    { id: 'other', label: 'Other' }
  ]

  const motivations = [
    { id: 'giveback', label: 'Give back to the community', icon: '🤝' },
    { id: 'cycling', label: 'Promote cycling culture and safety', icon: '🚴' },
    { id: 'health', label: 'Support health and wellness initiatives', icon: '💪' },
    { id: 'environment', label: 'Contribute to environmental sustainability', icon: '🌱' },
    { id: 'social', label: 'Meet like-minded people and build friendships', icon: '👥' },
    { id: 'skills', label: 'Develop new skills and gain experience', icon: '📚' },
    { id: 'leadership', label: 'Develop leadership and organizational skills', icon: '👑' },
    { id: 'networking', label: 'Professional networking opportunities', icon: '🔗' },
    { id: 'youth', label: 'Inspire and mentor younger cyclists', icon: '🌟' },
    { id: 'personal', label: 'Personal fulfillment and sense of purpose', icon: '❤️' },
    { id: 'family', label: 'Family activity and values sharing', icon: '👨‍👩‍👧‍👦' },
    { id: 'challenge', label: 'Take on new challenges and responsibilities', icon: '🎯' }
  ]

  const expectations = [
    { id: 'impact', label: 'Make a meaningful impact in the community' },
    { id: 'learning', label: 'Learn new skills and gain valuable experience' },
    { id: 'networking', label: 'Build professional and personal networks' },
    { id: 'recognition', label: 'Gain recognition for volunteer contributions' },
    { id: 'events', label: 'Participate in exciting cycling events' },
    { id: 'training', label: 'Receive training and development opportunities' },
    { id: 'flexibility', label: 'Flexible volunteering schedule' },
    { id: 'teamwork', label: 'Work with passionate and dedicated teams' },
    { id: 'leadership', label: 'Leadership and responsibility opportunities' },
    { id: 'community', label: 'Become part of the cycling community' }
  ]

  return (
    <div className="space-y-6">
      {/* How did you hear about us */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">How did you hear about us?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Please select all the ways you learned about the Ageless Bicyclists volunteer program. *
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {discoveryMethods.map(method => (
            <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.discoveryMotivation?.discoveryMethods?.includes(method.id) || false}
                onChange={() => handleCheckboxChange('discoveryMethods', method.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{method.label}</span>
            </label>
          ))}
        </div>
        
        {formData.discoveryMotivation?.discoveryMethods?.includes('other') && (
          <div className="mt-4 space-y-2">
            <label htmlFor="otherDiscovery" className="block text-sm font-medium text-gray-700">
              Please specify:
            </label>
            <input
              id="otherDiscovery"
              name="otherDiscovery"
              type="text"
              value={formData.discoveryMotivation?.otherDiscovery || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="How else did you hear about us?"
            />
          </div>
        )}

        {errors['discoveryMotivation.discoveryMethods'] && (
          <p className="text-red-600 text-sm mt-2">{errors['discoveryMotivation.discoveryMethods']}</p>
        )}

        <div className="mt-4 space-y-2">
          <label htmlFor="referrerDetails" className="block text-sm font-medium text-gray-700">
            If someone referred you, please provide their name (Optional)
          </label>
          <input
            id="referrerDetails"
            name="referrerDetails"
            type="text"
            value={formData.discoveryMotivation?.referrerDetails || ''}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Name of person who referred you"
          />
        </div>
      </div>

      {/* Motivation for Volunteering */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">What motivates you to volunteer?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select all the reasons that motivate you to volunteer with Ageless Bicyclists. *
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {motivations.map(motivation => (
            <label key={motivation.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.discoveryMotivation?.motivations?.includes(motivation.id) || false}
                onChange={() => handleCheckboxChange('motivations', motivation.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-lg">{motivation.icon}</span>
              <span className="text-sm text-gray-700">{motivation.label}</span>
            </label>
          ))}
        </div>

        {errors['discoveryMotivation.motivations'] && (
          <p className="text-red-600 text-sm mt-2">{errors['discoveryMotivation.motivations']}</p>
        )}

        <div className="mt-4 space-y-2">
          <label htmlFor="personalMotivation" className="block text-sm font-medium text-gray-700">
            Tell us more about your personal motivation (Optional)
          </label>
          <textarea
            id="personalMotivation"
            name="personalMotivation"
            rows={4}
            value={formData.discoveryMotivation?.personalMotivation || ''}
            onChange={handleInputChange}
            className="input-field resize-none"
            placeholder="Share what specifically drives your passion for volunteering with cycling initiatives..."
          />
        </div>
      </div>

      {/* What do you hope to gain */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">What do you hope to gain from this experience?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select your expectations and goals for volunteering with us. *
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {expectations.map(expectation => (
            <label key={expectation.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.discoveryMotivation?.expectations?.includes(expectation.id) || false}
                onChange={() => handleCheckboxChange('expectations', expectation.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{expectation.label}</span>
            </label>
          ))}
        </div>

        {errors['discoveryMotivation.expectations'] && (
          <p className="text-red-600 text-sm mt-2">{errors['discoveryMotivation.expectations']}</p>
        )}

        <div className="mt-4 space-y-2">
          <label htmlFor="personalGoals" className="block text-sm font-medium text-gray-700">
            Describe your personal goals for this volunteer experience
          </label>
          <textarea
            id="personalGoals"
            name="personalGoals"
            rows={4}
            value={formData.discoveryMotivation?.personalGoals || ''}
            onChange={handleInputChange}
            className="input-field resize-none"
            placeholder="What do you personally hope to achieve or learn through this volunteer experience?"
          />
          {errors['discoveryMotivation.personalGoals'] && (
            <p className="text-red-600 text-sm">{errors['discoveryMotivation.personalGoals']}</p>
          )}
        </div>
      </div>

      {/* Availability and Commitment */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Availability and Commitment</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="timeCommitment" className="block text-sm font-medium text-gray-700">
              How much time can you typically commit to volunteering per month? *
            </label>
            <select
              id="timeCommitment"
              name="timeCommitment"
              value={formData.discoveryMotivation?.timeCommitment || ''}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select time commitment</option>
              <option value="1-5">1-5 hours per month</option>
              <option value="6-10">6-10 hours per month</option>
              <option value="11-20">11-20 hours per month</option>
              <option value="21-40">21-40 hours per month</option>
              <option value="40+">More than 40 hours per month</option>
              <option value="flexible">Flexible based on events</option>
            </select>
            {errors['discoveryMotivation.timeCommitment'] && (
              <p className="text-red-600 text-sm">{errors['discoveryMotivation.timeCommitment']}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="longTermCommitment" className="block text-sm font-medium text-gray-700">
              How long do you hope to volunteer with us? *
            </label>
            <select
              id="longTermCommitment"
              name="longTermCommitment"
              value={formData.discoveryMotivation?.longTermCommitment || ''}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select duration</option>
              <option value="3-6months">3-6 months</option>
              <option value="6-12months">6-12 months</option>
              <option value="1-2years">1-2 years</option>
              <option value="2+years">2+ years</option>
              <option value="indefinite">As long as possible</option>
            </select>
            {errors['discoveryMotivation.longTermCommitment'] && (
              <p className="text-red-600 text-sm">{errors['discoveryMotivation.longTermCommitment']}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
              Any additional comments or questions? (Optional)
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              rows={3}
              value={formData.discoveryMotivation?.additionalComments || ''}
              onChange={handleInputChange}
              className="input-field resize-none"
              placeholder="Share any thoughts, questions, or additional information..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step6DiscoveryMotivation