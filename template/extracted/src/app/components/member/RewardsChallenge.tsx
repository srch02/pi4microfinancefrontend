import { Award, Trophy, TrendingUp, Calendar } from 'lucide-react';

export function RewardsChallenge() {
  const badges = [
    { name: '12 Payments', desc: '5% discount earned', icon: '🏅', unlocked: true },
    { name: 'Perfect Year', desc: 'No missed payments', icon: '⭐', unlocked: false },
    { name: 'Health Champion', desc: '10k steps daily', icon: '🏃', unlocked: true },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Rewards & Challenges</h1>
      <p className="text-gray-600 mb-6">Earn discounts by staying healthy and active</p>

      {/* Adherence Streak */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">Payment Streak</h2>
            <p className="text-indigo-100">Consecutive on-time payments</p>
          </div>
        </div>
        <div className="text-5xl font-bold mb-2">12</div>
        <p className="text-indigo-100">months in a row! 🔥</p>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Your Badges
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`text-center p-4 rounded-xl ${
                badge.unlocked ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-50 border-2 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-600">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenge */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Active Challenge
        </h3>
        <div className="bg-white rounded-xl p-4">
          <p className="font-semibold text-gray-900 mb-2">Daily Step Goal</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">7,842 / 10,000 steps</span>
            <span className="text-sm font-semibold text-blue-600">78%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Complete to earn 20 DT for your group pool</p>
        </div>
      </div>
    </div>
  );
}
