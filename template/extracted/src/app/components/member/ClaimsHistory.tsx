import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  claimService,
  ClaimResponse,
  ClaimStatus,
} from '../../../../../../src/app/services/claimService';

type FormState = {
  memberId: string;
  groupId: string;
  claimNumber: string;
  amountRequested: string;
  amountApproved: string;
  finalScoreSnapshot: string;
  status: string;
  decisionReason: string;
  decisionComment: string;
  excludedConditionDetected: boolean;
};

const emptyForm: FormState = {
  memberId: '',
  groupId: '',
  claimNumber: '',
  amountRequested: '',
  amountApproved: '',
  finalScoreSnapshot: '',
  status: 'SUBMITTED',
  decisionReason: '',
  decisionComment: '',
  excludedConditionDetected: false,
};

const statusOptions = [
  'SUBMITTED',
  'APPROVED_AUTO',
  'APPROVED_MANUAL',
  'REJECTED',
];

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function toStatusLabel(status?: string | null) {
  if (!status) return 'Unknown';
  switch (status) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'APPROVED_AUTO':
      return 'Approved Auto';
    case 'APPROVED_MANUAL':
      return 'Approved Manual';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status.replaceAll('_', ' ');
  }
}

function getStatusStyle(status?: string | null) {
  if (status === 'APPROVED_AUTO' || status === 'APPROVED_MANUAL') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'SUBMITTED' || status === 'PENDING' || status === 'UNDER_REVIEW') {
    return 'bg-amber-100 text-amber-800';
  }
  if (status === 'REJECTED') {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
}

function StatusIcon({ status }: { status?: string | null }) {
  if (status === 'APPROVED_AUTO' || status === 'APPROVED_MANUAL') {
    return <CheckCircle className="w-3 h-3" />;
  }
  if (status === 'REJECTED') {
    return <XCircle className="w-3 h-3" />;
  }
  return <Clock className="w-3 h-3" />;
}

export function ClaimsHistory() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [mode, setMode] = useState<'create' | 'edit' | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  const pageTitle = useMemo(() => {
    if (isCreateMode) return 'Create Claim';
    if (isEditMode) return 'Edit Claim';
    return 'Claims History';
  }, [isCreateMode, isEditMode]);

  async function loadClaims() {
    try {
      setLoading(true);
      setError(null);

      const data = await claimService.getAll({
        page,
        size,
        status: statusFilter,
      });

      setClaims(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load claims.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClaims();
  }, [page, size, statusFilter]);

  function resetForm() {
    setForm(emptyForm);
    setSelectedClaim(null);
    setMode(null);
  }

  function openCreate() {
    setForm(emptyForm);
    setSelectedClaim(null);
    setMode('create');
    setError(null);
  }

  function openEdit(claim: ClaimResponse) {
    setSelectedClaim(claim);
    setForm({
      memberId: claim.memberId ? String(claim.memberId) : '',
      groupId: claim.groupId ? String(claim.groupId) : '',
      claimNumber: claim.claimNumber || '',
      amountRequested:
        claim.amountRequested !== null && claim.amountRequested !== undefined
          ? String(claim.amountRequested)
          : '',
      amountApproved:
        claim.amountApproved !== null && claim.amountApproved !== undefined
          ? String(claim.amountApproved)
          : '',
      finalScoreSnapshot:
        claim.finalScoreSnapshot !== null && claim.finalScoreSnapshot !== undefined
          ? String(claim.finalScoreSnapshot)
          : '',
      status: claim.status || 'SUBMITTED',
      decisionReason: claim.decisionReason || '',
      decisionComment: claim.decisionComment || '',
      excludedConditionDetected: !!claim.excludedConditionDetected,
    });
    setMode('edit');
    setError(null);
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);

      if (isCreateMode) {
        if (!form.memberId || !form.groupId || !form.claimNumber || !form.amountRequested) {
          throw new Error('Member ID, Group ID, Claim Number and Amount Requested are required.');
        }

        await claimService.create({
          memberId: Number(form.memberId),
          groupId: Number(form.groupId),
          claimNumber: form.claimNumber.trim(),
          amountRequested: Number(form.amountRequested),
        });
      }

      if (isEditMode && selectedClaim) {
        await claimService.update(selectedClaim.id, {
          amountRequested: Number(form.amountRequested),
          amountApproved: form.amountApproved === '' ? null : Number(form.amountApproved),
          finalScoreSnapshot:
            form.finalScoreSnapshot === '' ? null : Number(form.finalScoreSnapshot),
          status: form.status as ClaimStatus,
          decisionReason: form.decisionReason ? form.decisionReason : null,
          excludedConditionDetected: form.excludedConditionDetected,
          decisionComment: form.decisionComment ? form.decisionComment.trim() : null,
          decisionAt: null,
        });
      }

      resetForm();
      await loadClaims();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete this claim?');
    if (!confirmed) return;

    try {
      setError(null);
      await claimService.remove(id);

      if (claims.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        await loadClaims();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/app')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500">
            Display, create, update and delete claims
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(0);
              setStatusFilter(e.target.value);
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
          >
            <option value="ALL">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {toStatusLabel(status)}
              </option>
            ))}
          </select>

          <button
            onClick={loadClaims}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={openCreate}
            className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-medium"
          >
            New Claim
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {(isCreateMode || isEditMode) && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isCreateMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Member ID *
                  </label>
                  <input
                    type="number"
                    value={form.memberId}
                    onChange={(e) => updateForm('memberId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Ex: 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Group ID *
                  </label>
                  <input
                    type="number"
                    value={form.groupId}
                    onChange={(e) => updateForm('groupId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Ex: 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Claim Number *
                  </label>
                  <input
                    type="text"
                    value={form.claimNumber}
                    onChange={(e) => updateForm('claimNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Ex: CLM-20260422-0001"
                  />
                </div>
              </>
            )}

            {isEditMode && selectedClaim && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Claim Number
                  </label>
                  <input
                    type="text"
                    value={form.claimNumber}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {toStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Amount Requested *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.amountRequested}
                onChange={(e) => updateForm('amountRequested', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                placeholder="0.00"
              />
            </div>

            {isEditMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Amount Approved
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amountApproved}
                    onChange={(e) => updateForm('amountApproved', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Score
                  </label>
                  <input
                    type="number"
                    value={form.finalScoreSnapshot}
                    onChange={(e) => updateForm('finalScoreSnapshot', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Ex: 85"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Decision Reason
                  </label>
                  <input
                    type="text"
                    value={form.decisionReason}
                    onChange={(e) => updateForm('decisionReason', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Decision Comment
                  </label>
                  <textarea
                    value={form.decisionComment}
                    onChange={(e) => updateForm('decisionComment', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                    rows={4}
                    placeholder="Optional comment"
                  />
                </div>

                <label className="inline-flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.excludedConditionDetected}
                    onChange={(e) =>
                      updateForm('excludedConditionDetected', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Excluded condition detected
                  </span>
                </label>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : isCreateMode
                ? 'Create Claim'
                : 'Update Claim'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          Loading claims...
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          No claims found.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {claim.claimNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(claim.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member ID: {claim.memberId ?? '-'} • Group ID: {claim.groupId ?? '-'}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    claim.status
                  )}`}
                >
                  <StatusIcon status={claim.status} />
                  {toStatusLabel(claim.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Requested</p>
                  <p className="font-bold text-gray-900">
                    {claim.amountRequested ?? 0} DT
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="font-bold text-gray-900">
                    {claim.amountApproved ?? 0} DT
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Score</p>
                  <p className="font-bold text-gray-900">
                    {claim.finalScoreSnapshot ?? '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="font-bold text-gray-900">
                    {claim.decisionReason || '-'}
                  </p>
                </div>
              </div>

              {claim.decisionComment && (
                <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  {claim.decisionComment}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => openEdit(claim)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(claim.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}