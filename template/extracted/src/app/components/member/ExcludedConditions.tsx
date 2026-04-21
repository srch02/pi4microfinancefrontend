import { useNavigate } from 'react-router';
import { XCircle } from 'lucide-react';

export function ExcludedConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          We Cannot Offer You Coverage
        </h1>

        {/* Explanation */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-left">
          <p className="text-gray-700 mb-4">
            Based on the health conditions you've declared, your medical needs require premium insurance coverage that exceeds our micro-insurance model.
          </p>
          <p className="text-gray-700">
            We recommend contacting a traditional health insurance provider who can offer you comprehensive coverage tailored to your needs.
          </p>
        </div>

        {/* Recommendations */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Recommended Providers:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Senegal National Health Insurance</li>
            <li>• IPRES Medical Coverage</li>
            <li>• IPRESS Partner Clinics</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Close
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Have questions?{' '}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}
