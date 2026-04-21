import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, MapPin, TrendingUp, CheckCircle, Shield, ArrowLeft, Sparkles, QrCode, Scan, Lock } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  type: string;
  members: number;
  location: string;
  poolBalance: number;
  acceptanceCriteria: string;
  trustScore: number;
  monthlyContributions: number;
  claimApprovalRate: number;
  matchScore: number;
}

export function GroupSelection() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanningQR, setScanningQR] = useState(false);
  const [scannedPrivateGroup, setScannedPrivateGroup] = useState<Group | null>(null);

  // Get member profile data for matching
  const memberProfile = JSON.parse(localStorage.getItem('member_profile') || '{}');
  const selectedPlan = localStorage.getItem('selected_plan') || 'COMFORT';

  const suggestedGroups: Group[] = [
    {
      id: 'G-015',
      name: 'Dakar Young Professionals',
      type: 'Professional',
      members: 42,
      location: 'Dakar, Senegal',
      poolBalance: 16800,
      acceptanceCriteria: 'Working professionals, Age 22-40, Dakar area',
      trustScore: 92,
      monthlyContributions: 23,
      claimApprovalRate: 94,
      matchScore: 95,
    },
    {
      id: 'G-022',
      name: 'Family Health Circle - Plateau',
      type: 'Family',
      members: 51,
      location: 'Plateau, Dakar',
      poolBalance: 19500,
      acceptanceCriteria: 'Families with children, Plateau district',
      trustScore: 88,
      monthlyContributions: 23,
      claimApprovalRate: 91,
      matchScore: 87,
    },
    {
      id: 'G-031',
      name: 'Beta-8 Community Pool',
      type: 'Community',
      members: 38,
      location: 'Dakar Region',
      poolBalance: 14200,
      acceptanceCriteria: 'Open community, Age 25-50, Dakar region',
      trustScore: 85,
      monthlyContributions: 23,
      claimApprovalRate: 89,
      matchScore: 82,
    },
    {
      id: 'G-045',
      name: 'Tech Innovators Health Group',
      type: 'Professional',
      members: 29,
      location: 'Dakar, Senegal',
      poolBalance: 11600,
      acceptanceCriteria: 'Tech industry professionals, Remote workers welcome',
      trustScore: 90,
      monthlyContributions: 23,
      claimApprovalRate: 93,
      matchScore: 78,
    },
  ];

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleContinue = () => {
    if (!selectedGroup) return;
    
    const group = suggestedGroups.find(g => g.id === selectedGroup);
    if (group) {
      localStorage.setItem('selected_group', JSON.stringify(group));
      setShowConfirmation(true);
      
      // Auto-proceed to first payment after showing confirmation
      setTimeout(() => {
        navigate('/first-payment');
      }, 2000);
    }
  };

  const handleSkip = () => {
    // Allow user to skip and join a group later
    localStorage.setItem('group_selection_skipped', 'true');
    navigate('/first-payment');
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
    setScanningQR(true);

    // Simulate QR code scanning
    setTimeout(() => {
      // Simulate finding a private group
      const privateGroup: Group = {
        id: 'G-PRIVATE-087',
        name: 'Executive Health Alliance',
        type: 'Private',
        members: 24,
        location: 'Dakar, Senegal',
        poolBalance: 28500,
        acceptanceCriteria: 'Invite-only • Senior executives and business owners',
        trustScore: 96,
        monthlyContributions: 35,
        claimApprovalRate: 98,
        matchScore: 88,
      };
      
      setScannedPrivateGroup(privateGroup);
      setScanningQR(false);
    }, 2500);
  };

  const handleJoinPrivateGroup = () => {
    if (scannedPrivateGroup) {
      setSelectedGroup(scannedPrivateGroup.id);
      setShowQRScanner(false);
      // Automatically continue to confirmation
      setTimeout(() => {
        localStorage.setItem('selected_group', JSON.stringify(scannedPrivateGroup));
        setShowConfirmation(true);
        setTimeout(() => {
          navigate('/first-payment');
        }, 2000);
      }, 500);
    }
  };

  if (showConfirmation) {
    const group = suggestedGroups.find(g => g.id === selectedGroup);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Group Selected!
          </h1>
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{group?.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You'll be joining {group?.members} members in this solidarity group
            </p>
            <div className="text-xs text-emerald-700">
              ✓ Proceeding to first payment...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <div className="mb-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/select-plan')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step 4 of 5</span>
            <span>80%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '80%' }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Solidarity Group</h1>
        <p className="text-gray-600 mb-6">
          Join a group that matches your profile. Your contributions will support each other's health needs.
        </p>

        {/* Action Buttons Row */}
        <div className="flex gap-3 mb-6">
          {/* AI Matching Badge */}
          <div className="flex-1 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              AI-Suggested Groups
            </span>
          </div>

          {/* QR Scanner Button */}
          <button
            onClick={handleScanQR}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <QrCode className="w-4 h-4" />
            Scan Private Group QR
          </button>
        </div>
      </div>

      {/* Suggested Groups */}
      <div className="max-w-5xl mx-auto space-y-4 mb-8">
        {suggestedGroups.map((group) => {
          const isSelected = selectedGroup === group.id;
          
          return (
            <button
              key={group.id}
              onClick={() => handleGroupSelect(group.id)}
              className={`w-full bg-white rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600' : 'bg-indigo-100'
                  }`}>
                    <Users className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                      {group.matchScore >= 90 && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                          Best Match
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members} members
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {group.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {group.poolBalance.toLocaleString()} DT Pool
                      </span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {group.type}
                    </span>
                  </div>
                </div>

                {/* Match Score */}
                <div className="text-right ml-4">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-600 flex items-center justify-center bg-indigo-50">
                    <div className="text-center">
                      <p className="text-xl font-bold text-indigo-600">{group.matchScore}</p>
                      <p className="text-xs text-indigo-600">Match</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Trust Score</p>
                  <p className="text-lg font-bold text-gray-900">{group.trustScore}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Avg. Premium</p>
                  <p className="text-lg font-bold text-gray-900">{group.monthlyContributions} DT</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600 mb-1">Approval Rate</p>
                  <p className="text-lg font-bold text-gray-900">{group.claimApprovalRate}%</p>
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-900">Criteria:</strong> {group.acceptanceCriteria}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-indigo-200">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-600">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto space-y-3">
        <button
          onClick={handleContinue}
          disabled={!selectedGroup}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            selectedGroup
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedGroup ? 'Continue to Payment' : 'Select a Group to Continue'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Skip for Now (Join Group Later)
        </button>
      </div>

      {/* Info Box */}
      <div className="max-w-5xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Why Join a Group?
            </p>
            <p className="text-sm text-blue-700">
              Solidarity groups pool resources together (70% of your premium). This creates a safety net where members support each other's health needs. Groups with higher trust scores get faster claim approvals and better benefits.
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            {scanningQR ? (
              // Scanning State
              <div className="text-center">
                <div className="w-72 h-72 bg-gray-900 rounded-xl mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
                  <Scan className="w-32 h-32 text-indigo-500 animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 animate-[scan_2s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scanning Private Group QR</h3>
                <p className="text-gray-600 mb-6">Position the QR code within the frame</p>
                <button
                  onClick={() => {
                    setShowQRScanner(false);
                    setScanningQR(false);
                    setScannedPrivateGroup(null);
                  }}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : scannedPrivateGroup ? (
              // Scanned Group Display
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Private Group Found!</h3>
                    <p className="text-sm text-gray-600">Invite-only solidarity group</p>
                  </div>
                </div>

                {/* Private Group Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{scannedPrivateGroup.name}</h4>
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                          PRIVATE
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {scannedPrivateGroup.members} members
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {scannedPrivateGroup.location}
                        </span>
                      </div>
                      <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                        {scannedPrivateGroup.type}
                      </span>
                    </div>
                    <div className="text-center ml-4">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-600 flex items-center justify-center bg-white">
                        <div>
                          <p className="text-xl font-bold text-purple-600">{scannedPrivateGroup.matchScore}</p>
                          <p className="text-xs text-purple-600">Match</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Trust Score</p>
                      <p className="text-lg font-bold text-gray-900">{scannedPrivateGroup.trustScore}%</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Premium</p>
                      <p className="text-lg font-bold text-gray-900">{scannedPrivateGroup.monthlyContributions} DT</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Approval</p>
                      <p className="text-lg font-bold text-gray-900">{scannedPrivateGroup.claimApprovalRate}%</p>
                    </div>
                  </div>

                  {/* Pool Balance */}
                  <div className="bg-white/70 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Group Pool Balance</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {scannedPrivateGroup.poolBalance.toLocaleString()} DT
                      </span>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-xs text-purple-900">
                      <strong>Criteria:</strong> {scannedPrivateGroup.acceptanceCriteria}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleJoinPrivateGroup}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Join This Private Group
                  </button>
                  <button
                    onClick={() => {
                      setShowQRScanner(false);
                      setScanningQR(false);
                      setScannedPrivateGroup(null);
                    }}
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Private groups require an invitation QR code
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(288px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}