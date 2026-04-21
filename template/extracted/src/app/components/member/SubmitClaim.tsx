import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Camera, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export function SubmitClaim() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    expenseType: '',
    amount: '',
    description: '',
  });
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);

  const expenseTypes = [
    'Consultation',
    'Medication',
    'Lab Test',
    'Minor Procedure',
    'Emergency Care',
  ];

  const calculateScore = () => {
    // Simulate real-time scoring
    let newScore = 0;
    if (formData.expenseType) newScore += 25;
    if (formData.amount && Number(formData.amount) > 0) newScore += 25;
    if (formData.description) newScore += 25;
    // Add 25 for "document uploaded" (simulated)
    newScore += 25;
    setScore(newScore);
    return newScore;
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const finalScore = calculateScore();

    setTimeout(() => {
      setSubmitting(false);
      if (finalScore >= 75) {
        setApproved(true);
        setTimeout(() => {
          navigate('/app/claims-history');
        }, 2500);
      } else if (finalScore >= 60) {
        // Manual review
        alert('Your claim has been sent for manual review (score: ' + finalScore + ')');
        navigate('/app/claims-history');
      } else {
        alert('Your claim was rejected (score too low: ' + finalScore + ')');
        navigate('/app/claims-history');
      }
    }, 2000);
  };

  if (approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative animate-[confetti_0.6s_ease-out]">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl animate-[float_1s_ease-in-out_infinite]">🎉</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Claim Approved Instantly!
          </h1>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
            <p className="text-emerald-900 mb-2">Trust Score: {score}/100</p>
            <p className="text-sm text-emerald-700">Your claim will be processed within 24-48 hours</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Claim...</h2>
          <p className="text-gray-600">Calculating trust score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-2 rounded-full flex-1 ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">Step {step} of 3</p>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Expense Type *
            </label>
            <select
              value={formData.expenseType}
              onChange={(e) => {
                setFormData({ ...formData, expenseType: e.target.value });
                calculateScore();
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            >
              <option value="">Select expense type</option>
              {expenseTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Amount (DT) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                calculateScore();
              }}
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                calculateScore();
              }}
              placeholder="Describe the medical expense..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.expenseType || !formData.amount || !formData.description}
            className={`w-full py-4 rounded-xl font-semibold transition-colors ${
              formData.expenseType && formData.amount && formData.description
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Documents
          </button>
        </div>
      )}

      {/* Step 2: Documents */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Upload Invoice/Receipt *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-medium text-gray-900 mb-2">Take Photo of Invoice</p>
              <p className="text-sm text-gray-600 mb-4">or drag and drop a file</p>
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera
                </button>
                <button className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Browse
                </button>
              </div>
            </div>
          </div>

          {/* OCR Status (Simulated) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Document analyzed successfully</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation & Scoring */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Real-time Score */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Trust Score</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl font-bold">{score}</div>
              <div className="text-right">
                <p className="text-indigo-100">out of 100</p>
                <p className="text-lg font-semibold">
                  {score >= 75 ? '✅ Auto-Approved' : score >= 60 ? '⏳ Manual Review' : '❌ Rejected'}
                </p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Scoring Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Member Reliability</span>
                <span className="font-semibold text-gray-900">30/30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Documentary Validation</span>
                <span className="font-semibold text-gray-900">25/25</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Medical Coherence</span>
                <span className="font-semibold text-gray-900">23/25</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Plan Compliance</span>
                <span className="font-semibold text-gray-900">20/20</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Submit Claim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
