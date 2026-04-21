import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, MapPin, TrendingUp, QrCode, Mail, ArrowLeft, Scan, AlertCircle } from 'lucide-react';

export function GroupBrowsing() {
  const navigate = useNavigate();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [alreadyInGroup, setAlreadyInGroup] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const suggestedGroups = [
    {
      id: 'G-015',
      name: 'Beta-8 Community Pool',
      type: 'Community',
      members: 38,
      location: 'Dakar, Senegal',
      poolBalance: 14200,
      acceptanceCriteria: 'Age 25-45, Dakar area',
    },
    {
      id: 'G-022',
      name: 'Young Professionals',
      type: 'Professional',
      members: 42,
      location: 'Dakar, Senegal',
      poolBalance: 16800,
      acceptanceCriteria: 'Working professionals, 22-35',
    },
    {
      id: 'G-031',
      name: 'Family Health Circle',
      type: 'Family',
      members: 51,
      location: 'Thiès, Senegal',
      poolBalance: 19500,
      acceptanceCriteria: 'Families with children',
    },
  ];

  const handleJoinRequest = (groupId: string) => {
    // Check if already in a group
    const currentGroup = localStorage.getItem('current_group');
    if (currentGroup) {
      setAlreadyInGroup(true);
    } else {
      // Submit join request
      setPendingApproval(true);
    }
  };

  const handleQRScan = () => {
    // Simulate QR scan - in real app, this would use device camera
    setShowQRScanner(true);
    setTimeout(() => {
      // Simulate scanning a QR code
      const currentGroup = localStorage.getItem('current_group');
      if (currentGroup) {
        setAlreadyInGroup(true);
        setShowQRScanner(false);
      } else {
        setInviteCode('ALPHA12-JOIN-2024');
        setShowQRScanner(false);
        setPendingApproval(true);
      }
    }, 2000);
  };

  const handleAdminApproval = () => {
    // Simulate admin approving the group change request
    localStorage.removeItem('current_group');
    setAlreadyInGroup(false);
    setPendingApproval(false);
    alert('Admin approved your group change request. You can now join a new group!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join a Solidarity Group</h1>
        <p className="text-gray-600">Connect with your community for mutual health support</p>
      </div>

      {/* Join Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleQRScan}
          className="bg-white border-2 border-indigo-200 rounded-xl p-6 hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
              <QrCode className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Scan QR Code</h3>
              <p className="text-sm text-gray-600">Join via group invitation QR</p>
            </div>
          </div>
        </button>

        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Invite Code</h3>
              <p className="text-sm text-gray-600">Enter your code</p>
            </div>
          </div>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="ALPHA12-JOIN-2024"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0 font-mono text-sm"
          />
        </div>
      </div>

      {/* Suggested Groups */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Groups</h2>
        <p className="text-sm text-gray-600 mb-4">Based on your location, age, and plan</p>
      </div>

      <div className="space-y-4 mb-8">
        {suggestedGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.members} members
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {group.location}
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {group.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{group.poolBalance.toLocaleString()} DT</span>
                </div>
                <p className="text-xs text-gray-500">Pool Balance</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Acceptance Criteria:</strong> {group.acceptanceCriteria}
              </p>
            </div>

            <button
              onClick={() => handleJoinRequest(group.id)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Request to Join
            </button>
          </div>
        ))}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-64 h-64 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
              <Scan className="w-32 h-32 text-indigo-500 animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanning QR Code</h3>
            <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
            <button
              onClick={() => setShowQRScanner(false)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Already In Group Modal */}
      {alreadyInGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Already in a Group
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              You are currently a member of <strong>Alpha-12 Solidarity Group</strong>. 
              To join a new group, you must first submit a group change request for admin approval.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleAdminApproval}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Request Group Change
              </button>
              <button
                onClick={() => setAlreadyInGroup(false)}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Approval Modal */}
      {pendingApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Your join request has been sent to the group admin. You'll receive a notification once it's reviewed (usually within 24-48 hours).
            </p>
            <button
              onClick={() => {
                setPendingApproval(false);
                navigate('/app');
              }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(256px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
