import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Clock, FileSearch, CheckCircle, Loader2, Sparkles } from 'lucide-react';

export function MedicalReviewWaiting() {
  const navigate = useNavigate();
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState<'scanning' | 'analyzing' | 'complete'>('scanning');

  useEffect(() => {
    // Simulate AI medical form scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Update scan stages
    setTimeout(() => setScanStage('analyzing'), 1500);
    setTimeout(() => {
      setScanStage('complete');
      // Redirect to member profile form after approval
      setTimeout(() => navigate('/member-profile'), 2000);
    }, 3500);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {scanStage === 'complete' ? (
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
                <FileSearch className="w-12 h-12 text-white" />
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {scanStage === 'complete' ? 'Medical History Approved!' : 'AI Medical Review in Progress'}
        </h1>

        {/* Description */}
        {scanStage === 'complete' ? (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
            <p className="text-emerald-900 mb-2">
              ✓ Your medical information has been verified
            </p>
            <p className="text-sm text-emerald-700">
              Redirecting to complete your member profile...
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8">
              Our AI system is analyzing your medical history form to ensure accuracy and completeness.
            </p>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {scanStage === 'scanning' ? 'Scanning Documents' : 
                   scanStage === 'analyzing' ? 'Analyzing Data' : 'Complete'}
                </span>
                <span className="text-sm font-bold text-indigo-600">{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            {/* AI Scan Status */}
            <div className="space-y-3 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  scanProgress >= 20 ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {scanProgress >= 20 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  )}
                </div>
                <span className="text-sm text-gray-700">OCR Document Scan</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  scanProgress >= 50 ? 'bg-emerald-500' : scanProgress >= 20 ? 'bg-indigo-500' : 'bg-gray-300'
                }`}>
                  {scanProgress >= 50 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : scanProgress >= 20 ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-700">Medical Data Validation</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  scanProgress >= 80 ? 'bg-emerald-500' : scanProgress >= 50 ? 'bg-indigo-500' : 'bg-gray-300'
                }`}>
                  {scanProgress >= 80 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : scanProgress >= 50 ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-700">Risk Assessment</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  scanProgress >= 100 ? 'bg-emerald-500' : scanProgress >= 80 ? 'bg-indigo-500' : 'bg-gray-300'
                }`}>
                  {scanProgress >= 100 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : scanProgress >= 80 ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-700">Admin Approval</span>
              </div>
            </div>
          </>
        )}

        {/* AI Badge */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">Powered by AI Medical Scan</span>
        </div>
      </div>
    </div>
  );
}
