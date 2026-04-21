import { useNavigate } from 'react-router';
import { Users, TrendingUp, Calendar, DollarSign, Award, ArrowRight, Activity } from 'lucide-react';

export function GroupsDashboard() {
  const navigate = useNavigate();

  const groupData = {
    name: 'Alpha-12 Solidarity Group',
    type: 'Family',
    memberCount: 45,
    poolBalance: 18500,
    monthlyContribution: 23,
    adherenceScore: 92,
    nextPaymentDue: '2024-03-01',
    nextPaymentAmount: 23,
  };

  const recentActivity = [
    { id: 1, type: 'payment', user: 'You', desc: 'Contribution received', amount: 23, date: '2024-02-01' },
    { id: 2, type: 'claim', user: 'Marie D.', desc: 'Claim approved', amount: -85, date: '2024-01-28' },
    { id: 3, type: 'payment', user: 'Group', desc: 'Pool contribution', amount: 1035, date: '2024-02-01' },
  ];

  const poolThreshold = 20000;
  const poolPercentage = (groupData.poolBalance / poolThreshold) * 100;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Group Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Your Solidarity Group</p>
            <h2 className="text-2xl font-bold mb-1">{groupData.name}</h2>
            <p className="text-indigo-100">{groupData.type} • {groupData.memberCount} members</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Adherence Score */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
          <Award className="w-5 h-5" />
          <span className="font-semibold">Score: {groupData.adherenceScore}</span>
          <span className="text-indigo-100">• Good Standing</span>
        </div>
      </div>

      {/* Pool Balance Card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Solidarity Pool Balance</p>
            <p className="text-3xl font-bold text-gray-900">{groupData.poolBalance.toLocaleString()} DT</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Safety Threshold</span>
            <span>{Math.round(poolPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(poolPercentage, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          70% of your premium goes to this shared pool
        </p>
      </div>

      {/* Next Payment Card */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Next Payment Due</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {groupData.nextPaymentAmount} DT
            </p>
            <p className="text-sm text-gray-600">Due on {groupData.nextPaymentDue}</p>
          </div>
          <button
            onClick={() => navigate('/app/payment-history')}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/app/monthly-payment')}
          className="bg-white border-2 border-amber-200 rounded-xl p-4 hover:border-amber-400 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Pay Premium</p>
          <p className="text-sm text-gray-600">Monthly payment</p>
        </button>

        <button
          onClick={() => navigate('/app/submit-claim')}
          className="bg-white border-2 border-indigo-200 rounded-xl p-4 hover:border-indigo-400 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Submit Claim</p>
          <p className="text-sm text-gray-600">File a new claim</p>
        </button>

        <button
          onClick={() => navigate('/app/browse-groups')}
          className="bg-white border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Browse Groups</p>
          <p className="text-sm text-gray-600">Join or switch</p>
        </button>

        <button
          onClick={() => navigate('/app/health-tools')}
          className="bg-white border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-semibold text-gray-900 mb-1">Health Tools</p>
          <p className="text-sm text-gray-600">AI chat & scanner</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <button
            onClick={() => navigate('/app/payment-history')}
            className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'payment' ? 'bg-emerald-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'payment' ? (
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Activity className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${activity.amount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {activity.amount > 0 ? '+' : ''}{activity.amount} DT
                </p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}