import React from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const Step5Questionnaire = ({ formData, updateFormData, errors }) => {
  const handleQuestionChange = (questionId, value) => {
    updateFormData({
      ...formData,
      questionnaire: {
        ...formData.questionnaire,
        [questionId]: value
      }
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({
      ...formData,
      questionnaire: {
        ...formData.questionnaire,
        [name]: value
      }
    })
  }

  const questions = [
    {
      id: 'firstAidCertificate',
      text: 'Do you have first Aid Certificate?',
      required: true,
      type: 'yesno'
    },
    {
      id: 'tobaccoProduct',
      text: 'Do you use tobacco product?',
      required: true,
      type: 'yesno'
    },
    {
      id: 'specialNeedsVolunteer',
      text: 'Have you volunteer with Special Needs (ASD)?',
      required: true,
      type: 'yesno'
    },
    {
      id: 'disabilitiesVolunteer',
      text: 'Have you volunteered with people with disabilities?',
      required: true,
      type: 'yesno'
    },
    {
      id: 'elderliesVolunteer',
      text: 'Have you volunteered with Elderlies?',
      required: true,
      type: 'yesno'
    },
    {
      id: 'chargedConvicted',
      text: 'Have you been charged or convicted?',
      required: true,
      type: 'yesno',
      followUp: 'If you have been charged or convicted in court of law in any country, please indicate details.'
    }
  ]

  const renderYesNoQuestion = (question) => {
    const currentAnswer = formData.questionnaire?.[question.id]
    const showFollowUp = currentAnswer === 'yes' && question.followUp
    const followUpValue = formData.questionnaire?.[`${question.id}Details`] || ''

    return (
      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-sm font-medium text-gray-900 leading-6">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={currentAnswer === 'yes'}
                onChange={() => handleQuestionChange(question.id, 'yes')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Yes</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={currentAnswer === 'no'}
                onChange={() => handleQuestionChange(question.id, 'no')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-700">No</span>
              </span>
            </label>
          </div>

          {errors[`questionnaire.${question.id}`] && (
            <p className="text-red-600 text-sm">{errors[`questionnaire.${question.id}`]}</p>
          )}

          {showFollowUp && (
            <div className="mt-3 ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question.followUp}
              </label>
              <textarea
                name={`${question.id}Details`}
                rows={3}
                value={followUpValue}
                onChange={handleInputChange}
                className="input-field resize-none w-full"
                placeholder="Please provide details..."
              />
              {errors[`questionnaire.${question.id}Details`] && (
                <p className="text-red-600 text-sm mt-1">{errors[`questionnaire.${question.id}Details`]}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-2">Volunteer Suitability Questionnaire</h3>
            <p className="text-blue-800 text-sm">
              Please answer the following questions honestly. This information helps us ensure a safe and positive experience for all volunteers and participants. 
              All information will be kept confidential and used only for volunteer program assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map(question => renderYesNoQuestion(question))}
      </div>

      {/* Confirmation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            id="questionnaire-accuracy"
            type="checkbox"
            checked={formData.questionnaire?.confirmAccuracy || false}
            onChange={(e) => handleQuestionChange('confirmAccuracy', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="questionnaire-accuracy" className="text-sm text-gray-700">
            I confirm that all information provided in this questionnaire is accurate and complete to the best of my knowledge. 
            I understand that providing false information may result in the rejection of my volunteer application. *
          </label>
        </div>
        {errors['questionnaire.confirmAccuracy'] && (
          <p className="text-red-600 text-sm ml-7 mt-1">{errors['questionnaire.confirmAccuracy']}</p>
        )}
      </div>
    </div>
  )
}

export default Step5Questionnaire