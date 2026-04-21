import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Scan, CheckCircle, AlertCircle, Loader2, User } from 'lucide-react';

export function FacialRecognition() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    if (scanning) {
      // Simulate face detection progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Update status stages
      setTimeout(() => setStatus('scanning'), 500);
      setTimeout(() => setStatus('analyzing'), 1500);
      setTimeout(() => {
        setStatus('success');
        // Auto-login after successful recognition
        setTimeout(() => {
          localStorage.setItem('auth_token', 'demo_jwt_token_facial_' + Date.now());
          localStorage.setItem('user_data', JSON.stringify({
            id: 'M-12847',
            name: 'John Doe',
            email: 'john.doe@example.com',
            plan: 'COMFORT',
            group: 'Alpha-12',
          }));
          navigate('/app');
        }, 2000);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [scanning, navigate]);

  const handleStartScan = () => {
    setScanning(true);
    setProgress(0);
    setStatus('idle');
  };

  const handleRetry = () => {
    setScanning(false);
    setProgress(0);
    setStatus('idle');
    setTimeout(() => handleStartScan(), 500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Face Recognized!
          </h1>
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
            <p className="text-emerald-900 mb-2">
              Welcome back, <strong>John Doe</strong>
            </p>
            <p className="text-sm text-gray-600">
              Signing you in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Face Not Recognized
          </h1>
          <div className="bg-white rounded-2xl border-2 border-red-200 p-6 mb-6">
            <p className="text-red-900 mb-4">
              We couldn't verify your identity. Please try again or use another login method.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Use Email & Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 max-w-md mx-auto w-full"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Login
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Scan className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Facial Recognition Login</h1>
            <p className="text-gray-600">
              Position your face within the frame for secure biometric authentication
            </p>
          </div>

          {/* Camera Preview / Scanning Interface */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
            <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden mb-6">
              {!scanning ? (
                // Idle State
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 border-4 border-indigo-500 border-dashed rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <User className="w-16 h-16 text-indigo-500" />
                    </div>
                    <p className="text-white text-sm">Position your face here</p>
                  </div>
                </div>
              ) : (
                // Scanning State
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 border-4 border-indigo-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scan className="w-24 h-24 text-indigo-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute inset-0">
                    <div 
                      className="h-1 bg-indigo-500 shadow-lg shadow-indigo-500/50"
                      style={{
                        animation: 'scan-vertical 2s ease-in-out infinite',
                        width: '100%',
                      }}
                    />
                  </div>

                  {/* Corner Markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-indigo-500" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-indigo-500" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-indigo-500" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-indigo-500" />
                </>
              )}
            </div>

            {/* Status & Progress */}
            {scanning && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'scanning' && 'Detecting face...'}
                      {status === 'analyzing' && 'Analyzing features...'}
                      {status === 'idle' && 'Preparing...'}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Recognition Steps */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      progress >= 30 ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      {progress >= 30 ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      )}
                    </div>
                    <span className="text-gray-700">Face detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      progress >= 60 ? 'bg-emerald-500' : progress >= 30 ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}>
                      {progress >= 60 ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : progress >= 30 ? (
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700">Facial features analyzed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      progress >= 100 ? 'bg-emerald-500' : progress >= 60 ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}>
                      {progress >= 100 ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : progress >= 60 ? (
                        <Loader2 className="w-3 h-3 text-white animate-spin" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700">Identity verified</span>
                  </div>
                </div>
              </div>
            )}

            {!scanning && (
              <button
                onClick={handleStartScan}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Scan className="w-5 h-5" />
                Start Face Scan
              </button>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Secure Biometric Authentication:</strong> Your facial data is encrypted and never stored on our servers. It's only used for real-time verification.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-vertical {
          0% { transform: translateY(0); }
          50% { transform: translateY(400px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
