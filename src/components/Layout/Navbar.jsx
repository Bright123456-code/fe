import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
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
    <nav className="sticky top-0 z-40" style={{ backgroundColor: '#0A0A0A', borderBottom: '1px solid #1A1A1A' }}>
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#FFCD00' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="SWU" className="h-8 w-auto object-contain brightness-0 invert" />
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={active
                    ? { backgroundColor: '#FFCD00', color: '#0A0A0A' }
                    : { color: '#9CA3AF' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.backgroundColor = 'transparent'; }}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
              <p className="text-xs capitalize" style={{ color: '#FFCD00' }}>{user?.role}</p>
            </div>
            <div className="w-px h-6 hidden sm:block" style={{ backgroundColor: '#2A2A2A' }} />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
