import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Calculator } from 'lucide-react';

export function PriceCalculation() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate price calculation
    const timer = setTimeout(() => {
      navigate('/select-plan');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75" />
          <div className="relative w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
            <Calculator className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Calculating Your Fair Price
        </h1>

        {/* Progress Indicator */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
            <span className="text-gray-700">Analyzing your health profile...</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            <span className="text-gray-400">Comparing with solidarity groups...</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            <span className="text-gray-400">Personalizing your plan options...</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-sm text-indigo-900">
            <strong>Did you know?</strong> Our AI-powered pricing ensures you pay a fair rate based on your actual health profile, not broad demographics.
          </p>
        </div>

        {/* Loading Bar */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full animate-[loading_2s_ease-in-out]" 
                 style={{ 
                   animation: 'loading 2s ease-in-out',
                   animationFillMode: 'forwards'
                 }} 
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
