import { Outlet, NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  Stethoscope, 
  BarChart3,
  Heart
} from 'lucide-react';

export function AdminRoot() {
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
    { path: '/admin/pre-registration', icon: UserCheck, label: 'Module 5 – Pre-Registration' },
    { path: '/admin/groups-payments', icon: Users, label: 'Module 1 – Groups & Payments' },
    { path: '/admin/claims-scoring', icon: FileText, label: 'Module 2 – Claims & Scoring' },
    { path: '/admin/health-services', icon: Stethoscope, label: 'Module 3 – Health Services' },
    { path: '/admin/analytics-admin', icon: BarChart3, label: 'Module 4 – Analytics & Admin' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
          <Heart className="w-8 h-8 text-indigo-600" fill="currentColor" />
          <div>
            <h1 className="font-semibold text-gray-900">Solidari-Health</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-600">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@solidari.health</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
