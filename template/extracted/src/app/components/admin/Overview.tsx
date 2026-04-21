import { Users, UserCheck, FileText, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Overview() {
  const kpiData = [
    { label: 'Total Members', value: '12,847', change: '+12.5%', icon: Users, trend: 'up', color: 'indigo' },
    { label: 'Active Groups', value: '342', change: '+8.2%', icon: UserCheck, trend: 'up', color: 'blue' },
    { label: 'Claims Pending', value: '47', change: '-5.3%', icon: FileText, trend: 'down', color: 'amber' },
    { label: 'Pool Health', value: '94.2%', change: '+2.1%', icon: TrendingUp, trend: 'up', color: 'emerald' },
  ];

  const recentActivity = [
    { id: 1, type: 'claim', user: 'Marie Dupont', action: 'Submitted claim #C-2847', time: '5 min ago', status: 'pending' },
    { id: 2, type: 'registration', user: 'Jean Baptiste', action: 'Pre-registration approved', time: '12 min ago', status: 'success' },
    { id: 3, type: 'payment', user: 'Group Alpha-12', action: 'Monthly contribution received', time: '25 min ago', status: 'success' },
    { id: 4, type: 'claim', user: 'Sophie Martin', action: 'Claim #C-2845 reviewed', time: '1 hour ago', status: 'success' },
    { id: 5, type: 'alert', user: 'System', action: 'High fraud score detected for claim #C-2846', time: '2 hours ago', status: 'alert' },
    { id: 6, type: 'registration', user: 'Paul Kamara', action: 'CIN verification pending', time: '3 hours ago', status: 'pending' },
  ];

  const claimsPerMonth = [
    { month: 'Jan', claims: 145, approved: 132 },
    { month: 'Feb', claims: 168, approved: 155 },
    { month: 'Mar', claims: 182, approved: 170 },
    { month: 'Apr', claims: 195, approved: 183 },
    { month: 'May', claims: 203, approved: 191 },
    { month: 'Jun', claims: 218, approved: 205 },
  ];

  const groupPoolTrends = [
    { month: 'Jan', balance: 425000 },
    { month: 'Feb', balance: 448000 },
    { month: 'Mar', balance: 465000 },
    { month: 'Apr', balance: 482000 },
    { month: 'May', balance: 503000 },
    { month: 'Jun', balance: 528000 },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      indigo: 'bg-indigo-50 text-indigo-600',
      blue: 'bg-blue-50 text-blue-600',
      amber: 'bg-amber-50 text-amber-600',
      emerald: 'bg-emerald-50 text-emerald-600',
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your micro-insurance platform today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${getColorClasses(kpi.color)} flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-600">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-emerald-100' :
                    activity.status === 'alert' ? 'bg-red-100' :
                    'bg-amber-100'
                  }`}>
                    {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {activity.status === 'alert' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    {activity.status === 'pending' && <Clock className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claims Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Claims Per Month</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={claimsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="claims" fill="#6366f1" name="Total Claims" radius={[8, 8, 0, 0]} animationDuration={800} />
                <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pool Trends Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Pool Balance Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={groupPoolTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#6366f1" 
                  fill="#818cf8" 
                  fillOpacity={0.3} 
                  name="Pool Balance" 
                  strokeWidth={2}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}