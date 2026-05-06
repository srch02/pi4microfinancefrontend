import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Camera,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { claimService, ClaimResponse, ClaimStatus } from '../services/claimService';

type FormDataState = {
  memberId: string;
  groupId: string;
  claimNumber: string;
  expenseType: string;
  amount: string;
  description: string;
  documentUploadIdsText: string;
};

const expenseTypes = [
  'Consultation',
  'Medication',
  'Lab Test',
  'Minor Procedure',
  'Emergency Care',
];

function generateClaimNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CLM-${yyyy}${mm}${dd}-${random}`;
}

function parseDocumentIds(value: string): number[] {
  if (!value.trim()) return [];
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item) && item > 0);
}

function getStatusLabel(status?: ClaimStatus | null) {
  switch (status) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'SCORED':
      return 'Scored';
    case 'APPROVED_AUTO':
      return 'Approved Automatically';
    case 'MANUAL_REVIEW':
      return 'Manual Review';
    case 'APPROVED_MANUAL':
      return 'Approved Manually';
    case 'REJECTED_LOW_SCORE':
      return 'Rejected - Low Score';
    case 'REJECTED_EXCLUSION':
      return 'Rejected - Exclusion';
    case 'REJECTED_FRAUD':
      return 'Rejected - Fraud';
    case 'PAID':
      return 'Paid';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status || 'Unknown';
  }
}

export function SubmitClaim() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>({
    memberId: '',
    groupId: '',
    claimNumber: '',
    expenseType: '',
    amount: '',
    description: '',
    documentUploadIdsText: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [createdClaim, setCreatedClaim] = useState<ClaimResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const documentIds = useMemo(
    () => parseDocumentIds(formData.documentUploadIdsText),
    [formData.documentUploadIdsText]
  );

  const score = useMemo(() => {
    let newScore = 0;
    if (formData.expenseType) newScore += 25;
    if (formData.amount && Number(formData.amount) > 0) newScore += 25;
    if (formData.description.trim()) newScore += 25;
    if (documentIds.length > 0) newScore += 25;
    return newScore;
  }, [formData.expenseType, formData.amount, formData.description, documentIds]);

  const canContinueStep1 =
    !!formData.memberId &&
    !!formData.groupId &&
    !!formData.expenseType &&
    !!formData.amount &&
    Number(formData.amount) > 0 &&
    !!formData.description.trim();

  const canContinueStep2 = documentIds.length > 0;

  const handleChange =
    (field: keyof FormDataState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const goToStep2 = () => {
    if (!canContinueStep1) {
      setErrorMessage('Please complete all required fields in step 1.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const goToStep3 = () => {
    if (!canContinueStep2) {
      setErrorMessage('Please provide at least one documentUploadId.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleSubmit = async () => {
    try {
      console.log("nzelna")
      setSubmitting(true);
      setErrorMessage('');

      const payload = {
        memberId: Number(formData.memberId),
        groupId: Number(formData.groupId),
        claimNumber: formData.claimNumber.trim() || generateClaimNumber(),
        amountRequested: Number(formData.amount),
        documentUploadIds: documentIds,
      };

      const response = await claimService.create(payload);
      setCreatedClaim(response);

      setTimeout(() => {
        navigate('/app/claims-history');
      }, 2500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to submit claim.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdClaim) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Claim Submitted Successfully
          </h1>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-left">
            <p className="text-emerald-900 mb-2">
              <span className="font-semibold">Claim Number:</span> {createdClaim.claimNumber}
            </p>
            <p className="text-emerald-900 mb-2">
              <span className="font-semibold">Status:</span> {getStatusLabel(createdClaim.status)}
            </p>
            <p className="text-emerald-900 mb-2">
              <span className="font-semibold">Requested Amount:</span> {createdClaim.amountRequested} DT
            </p>
            <p className="text-sm text-emerald-700 mt-3">
              You will be redirected to claims history...
            </p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Submitting Your Claim...
          </h2>
          <p className="text-gray-600">Please wait while we send your data to the API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Claim</h1>

        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`h-2 rounded-full flex-1 ${
                  s <= step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600">Step {step} of 3</p>
      </div>

      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Member ID *
            </label>
            <input
              type="number"
              value={formData.memberId}
              onChange={handleChange('memberId')}
              placeholder="Ex: 1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Group ID *
            </label>
            <input
              type="number"
              value={formData.groupId}
              onChange={handleChange('groupId')}
              placeholder="Ex: 1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Claim Number
            </label>
            <input
              type="text"
              value={formData.claimNumber}
              onChange={handleChange('claimNumber')}
              placeholder="Leave empty to auto-generate"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Expense Type *
            </label>
            <select
              value={formData.expenseType}
              onChange={handleChange('expenseType')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            >
              <option value="">Select expense type</option>
              {expenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
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
              onChange={handleChange('amount')}
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
              onChange={handleChange('description')}
              placeholder="Describe the medical expense..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={goToStep2}
            disabled={!canContinueStep1}
            className={`w-full py-4 rounded-xl font-semibold transition-colors ${
              canContinueStep1
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Documents
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Document Upload IDs *
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-indigo-600" />
              </div>

              <p className="font-medium text-gray-900 mb-2">
                For now, backend expects existing document IDs
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Example: 12, 18, 25
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg flex items-center gap-2 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <Camera className="w-4 h-4" />
                  Camera
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg flex items-center gap-2 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <Upload className="w-4 h-4" />
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={formData.documentUploadIdsText}
              onChange={handleChange('documentUploadIdsText')}
              placeholder="Ex: 12,15,20"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter existing document upload IDs separated by commas.
            </p>
          </div>

          {documentIds.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Documents ready: {documentIds.join(', ')}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={goToStep3}
              disabled={!canContinueStep2}
              className={`flex-1 py-4 font-semibold rounded-xl transition-colors ${
                canContinueStep2
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Front Validation Score</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl font-bold">{score}</div>
              <div className="text-right">
                <p className="text-indigo-100">out of 100</p>
                <p className="text-lg font-semibold">
                  {score >= 75
                    ? 'Ready to submit'
                    : score >= 50
                    ? 'Needs attention'
                    : 'Incomplete'}
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

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Review</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Member ID</span>
                <span className="font-semibold text-gray-900">{formData.memberId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Group ID</span>
                <span className="font-semibold text-gray-900">{formData.groupId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Claim Number</span>
                <span className="font-semibold text-gray-900">
                  {formData.claimNumber || '(auto-generated)'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Expense Type</span>
                <span className="font-semibold text-gray-900">{formData.expenseType}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">{formData.amount} DT</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Documents</span>
                <span className="font-semibold text-gray-900">{documentIds.join(', ')}</span>
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