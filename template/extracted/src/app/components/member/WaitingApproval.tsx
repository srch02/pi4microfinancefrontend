import { useNavigate } from 'react-router';
import { Clock, Mail, MessageSquare } from 'lucide-react';

export function WaitingApproval() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Clock className="w-16 h-16 text-indigo-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-lg">⏰</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Application Under Review
        </h1>

        {/* Message */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Thank you for submitting your application! Our team is currently reviewing your information.
          </p>
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-1">
              Expected Review Time
            </p>
            <p className="text-2xl font-bold text-indigo-600">2-48 hours</p>
          </div>
        </div>

        {/* Notification Info */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-900">SMS Notification</p>
              <p className="text-xs text-gray-500">We'll send you an update via SMS</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
              <p className="text-xs text-gray-500">Check your inbox for details</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </button>
          
          {/* Demo: Skip to approval */}
          <button
            onClick={() => navigate('/first-payment')}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            [Demo] Skip to Approved State
          </button>
        </div>

        {/* Support */}
        <p className="text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
