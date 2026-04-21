import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export function CINVerification() {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = () => {
    setVerifying(true);
    setError('');
    
    // Simulate CIN extraction and verification
    setTimeout(() => {
      const randomCin = '12345678901234';
      setCinNumber(randomCin);
      
      // Simulate duplicate check (10% chance of duplicate)
      if (Math.random() < 0.1) {
        setError('You are already registered with this national ID.');
        setVerifying(false);
      } else {
        setVerifying(false);
        // Wait a moment then proceed
        setTimeout(() => {
          navigate('/medical-history');
        }, 1500);
      }
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload();
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
        <p className="text-gray-600">Upload your national ID card (CIN) to continue</p>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Upload Box */}
        {!cinNumber && !error && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors ${
              dragActive
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
            }`}
          >
            {verifying ? (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Verifying...</h3>
                <p className="text-sm text-gray-600">Extracting information from your ID</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload your CIN</h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Drag and drop your ID card here, or click to browse
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Browse Files
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Success State */}
        {cinNumber && !error && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-[scale-in_0.3s_ease-out]">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ID Verified!</h3>
            <p className="text-gray-600 mb-4">CIN: {cinNumber}</p>
            <div className="flex items-center gap-2 text-emerald-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecting to next step...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Already Registered</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => navigate('/app')}
                className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!cinNumber && !error && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Your ID information is encrypted and used only for identity verification. We comply with data protection regulations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
