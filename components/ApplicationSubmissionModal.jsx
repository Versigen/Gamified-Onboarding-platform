import React from 'react'
import Modal from './Modal'
import { CheckCircle, User, BookOpen } from 'lucide-react'

const ApplicationSubmissionModal = ({ isOpen, onConfirm }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onConfirm}
      showCloseButton={false}
      closeOnBackdropClick={false}
      className="max-w-lg"
    >
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h3>

        {/* Message */}
        <div className="text-gray-600 mb-8 space-y-4">
          <p className="text-lg leading-relaxed">
            Your application is pending approval. You currently have access to the tutorial and your profile. 
            You will be notified when your account is approved.
          </p>
          
          {/* Access Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Current Access
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tutorial section
                  </li>
                  <li className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Your profile page
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="btn-primary w-full flex items-center justify-center space-x-2 py-3 text-lg"
        >
          <span>Okay</span>
        </button>
      </div>
    </Modal>
  )
}

export default ApplicationSubmissionModal