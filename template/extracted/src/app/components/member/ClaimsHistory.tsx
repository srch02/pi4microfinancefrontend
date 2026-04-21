import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';

export function ClaimsHistory() {
  const navigate = useNavigate();

  const claims = [
    { id: 'C-001', type: 'Consultation', amount: 45, status: 'approved', score: 92, date: '2024-02-01' },
    { id: 'C-002', type: 'Medication', amount: 65, status: 'pending', score: 78, date: '2024-02-10' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/app')}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Claims History</h1>
      
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{claim.type}</p>
                <p className="text-sm text-gray-500">{claim.id} • {claim.date}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                claim.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {claim.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                {claim.status === 'pending' && <Clock className="w-3 h-3" />}
                {claim.status === 'rejected' && <XCircle className="w-3 h-3" />}
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">{claim.amount} DT</span>
              <span className="text-sm text-gray-600">Score: {claim.score}/100</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
