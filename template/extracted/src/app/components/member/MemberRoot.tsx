import { Outlet } from 'react-router';

export function MemberRoot() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Outlet />
    </div>
  );
}
