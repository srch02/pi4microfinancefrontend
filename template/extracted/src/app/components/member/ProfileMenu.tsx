import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, LogOut, Settings, Shield, ChevronDown, Heart } from 'lucide-react';

export function ProfileMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userName = userData.name || 'John Doe';
  const userEmail = userData.email || 'member@solidari-health.com';
  const memberId = userData.id || 'M-12847';
  const plan = userData.plan || 'COMFORT';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('selected_group');
    localStorage.removeItem('member_profile');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(userName)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{plan} Plan</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userName)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Member ID</span>
              <span className="text-xs font-mono font-semibold text-indigo-600">{memberId}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-600">Plan</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                {plan}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/profile');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">My Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/settings');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/security');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Privacy & Security</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/app/plan');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <Heart className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">My Plan & Coverage</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600 font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
