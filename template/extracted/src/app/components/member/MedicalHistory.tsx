import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

export function MedicalHistory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentConditions: [] as string[],
    familyHistory: [] as string[],
    ongoingTreatments: '',
    consultationFrequency: 'never',
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  const currentConditions = [
    'Recurrent flu',
    'Seasonal allergies',
    'Mild asthma',
    'Hypertension',
    'Diabetes',
    'Heart disease',
    'None of the above',
  ];

  const familyConditions = [
    'Diabetes (parents/siblings)',
    'Heart disease (parents/siblings)',
    'Cancer (parents/siblings)',
    'Hypertension (parents/siblings)',
    'None',
  ];

  const toggleCondition = (condition: string, field: 'currentConditions' | 'familyHistory') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(condition)
        ? prev[field].filter(c => c !== condition)
        : [...prev[field], condition],
    }));
  };

  const handleSubmit = () => {
    // Check reCAPTCHA verification
    if (!recaptchaVerified) {
      alert('Please verify that you are not a robot');
      return;
    }

    // Check for excluded conditions
    const excludedConditions = ['Heart disease', 'Diabetes (current)', 'Cancer'];
    const hasExcluded = formData.currentConditions.some(c => 
      c === 'Heart disease' || c === 'Diabetes'
    );

    if (hasExcluded) {
      navigate('/excluded');
    } else {
      // Go to AI medical review/scanning
      navigate('/medical-review');
    }
  };

  const handleRecaptchaClick = () => {
    // Simulate reCAPTCHA verification after 1 second
    setTimeout(() => {
      setRecaptchaVerified(true);
    }, 1000);
  };

  const progress = 50; // Step 2 of 4

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/verify-cin')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step 2 of 4</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical History Declaration</h1>
        <p className="text-gray-600">Help us calculate your personalized price</p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="space-y-8 flex-1">
          {/* Current Conditions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Current Health Conditions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition, 'currentConditions')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.currentConditions.includes(condition)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.currentConditions.includes(condition)
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.currentConditions.includes(condition) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{condition}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Family History */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Family Medical History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition, 'familyHistory')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.familyHistory.includes(condition)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.familyHistory.includes(condition)
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {formData.familyHistory.includes(condition) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{condition}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ongoing Treatments */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Ongoing Treatments (if any)
            </label>
            <textarea
              value={formData.ongoingTreatments}
              onChange={(e) => setFormData({ ...formData, ongoingTreatments: e.target.value })}
              placeholder="List any medications or treatments you're currently receiving..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0 resize-none"
              rows={3}
            />
          </div>

          {/* Consultation Frequency */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Past Consultation Frequency
            </label>
            <select
              value={formData.consultationFrequency}
              onChange={(e) => setFormData({ ...formData, consultationFrequency: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            >
              <option value="never">Never or rarely</option>
              <option value="1-2">1-2 times per year</option>
              <option value="3-5">3-5 times per year</option>
              <option value="monthly">Monthly or more</option>
            </select>
          </div>

          {/* reCAPTCHA Placeholder */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Security Verification
            </h3>
            
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={handleRecaptchaClick}
                  disabled={recaptchaVerified}
                  className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                    recaptchaVerified
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-white border-gray-400 hover:border-indigo-600 cursor-pointer'
                  }`}
                >
                  {recaptchaVerified && <CheckCircle className="w-6 h-6 text-white" />}
                </button>

                {/* reCAPTCHA Text */}
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">I'm not a robot</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"
                      alt="reCAPTCHA"
                      className="w-4 h-4"
                    />
                    <span>reCAPTCHA</span>
                    <a href="#" className="text-blue-600 hover:underline">Privacy</a>
                    <span>-</span>
                    <a href="#" className="text-blue-600 hover:underline">Terms</a>
                  </div>
                </div>

                {/* reCAPTCHA Logo */}
                <div className="text-right">
                  <div className="bg-white rounded px-2 py-1 border border-gray-300">
                    <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">re</span>
                      </div>
                      <span>CAPTCHA</span>
                    </div>
                  </div>
                </div>
              </div>

              {recaptchaVerified && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified successfully</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              This site is protected by reCAPTCHA to prevent automated submissions
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={!recaptchaVerified}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              recaptchaVerified
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
          {!recaptchaVerified && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please complete the security verification above
            </p>
          )}
        </div>
      </div>
    </div>
  );
}