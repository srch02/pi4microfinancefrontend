import { Outlet, NavLink, useLocation } from 'react-router';
import { Home, FileText, Award, Stethoscope, Heart, MessageSquare } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

export function MemberApp() {
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: Home, label: 'Home', exact: true },
    { path: '/app/submit-claim', icon: FileText, label: 'Claims' },
    { path: '/app/health-tools', icon: Stethoscope, label: 'Health' },
    { path: '/app/group-chat', icon: MessageSquare, label: 'Chat' },
    { path: '/app/rewards', icon: Award, label: 'Rewards' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Solidari-Health</h1>
              <p className="text-xs text-gray-500">Member Portal</p>
            </div>
          </div>
          
          {/* Profile Menu */}
          <ProfileMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-indigo-600' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}