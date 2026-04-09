import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { FaceSmileIcon } from '@heroicons/react/24/solid';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/users', label: 'User Management', icon: UserGroupIcon },
    { to: '/admin/attendance', label: 'Attendance Reports', icon: ClipboardDocumentListIcon },
    { to: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/admin/settings', label: 'Settings', icon: CogIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-4 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <FaceSmileIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900">BioAttend</span>
            <p className="text-xs text-slate-500">Staff Attendance System</p>
          </div>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {adminLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
