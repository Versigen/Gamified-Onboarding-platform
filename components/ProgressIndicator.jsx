import React from 'react'
import { Check } from 'lucide-react'

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Step {currentStep} of {totalSteps}
        </h3>
        <span className="text-sm text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Step Indicators - Mobile Hidden, Desktop Visible */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center max-w-20 ${
                  isCurrent
                    ? 'text-primary-600 font-medium'
                    : isCompleted
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.shortTitle}
              </span>
            </div>
          )
        })}
      </div>

      {/* Current Step Title */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {steps[currentStep - 1]?.title}
        </h2>
        {steps[currentStep - 1]?.description && (
          <p className="text-gray-600">
            {steps[currentStep - 1].description}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProgressIndicator