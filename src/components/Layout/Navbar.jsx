import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: HomeIcon },
    { to: '/attendance', label: 'Attendance', icon: ClockIcon },
    { to: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin', icon: Cog6ToothIcon });
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FaceSmileIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-slate-900">BioAttend</span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium text-slate-900">{user?.name}</p>
              <p className="text-slate-500 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
