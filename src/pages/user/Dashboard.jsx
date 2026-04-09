import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { Navbar } from '../../components/Layout/Navbar';
import { AttendanceTable } from '../../components/Dashboard/AttendanceTable';
import { Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, FaceSmileIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatTime } from '../../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const { today, fetchToday, logs, fetchLogs, loading } = useAttendance();

  useEffect(() => {
    fetchToday();
    fetchLogs({ limit: 5 });
  }, [fetchToday, fetchLogs]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold" style={{ color: '#0A0A0A' }}>
              {greeting},{' '}
              <span style={{ color: '#CC9900' }}>{user?.name?.split(' ')[0]}</span>
            </h1>
          </div>
          <Link
            to="/attendance"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{ backgroundColor: '#FFCD00', color: '#0A0A0A' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E6B800'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFCD00'}
          >
            Mark Attendance
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

          {/* Status */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={today?.hasCheckedIn
              ? { backgroundColor: '#0A0A0A' }
              : { backgroundColor: '#fff', border: '1px solid #E8E8E3' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={today?.hasCheckedIn ? { backgroundColor: '#FFCD00' } : { backgroundColor: '#F5F5F0' }}
            >
              {today?.hasCheckedIn
                ? <CheckCircleIcon className="w-6 h-6" style={{ color: '#0A0A0A' }} />
                : <ClockIcon className="w-6 h-6" style={{ color: '#9CA3AF' }} />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: today?.hasCheckedIn ? '#9CA3AF' : '#6B7280' }}>Status</p>
              <p className="font-bold mt-0.5" style={{ color: today?.hasCheckedIn ? '#fff' : '#0A0A0A' }}>
                {today?.hasCheckedIn ? 'Present' : 'Not Checked In'}
              </p>
            </div>
          </div>

          {/* Check-in time */}
          <div className="rounded-2xl p-5 flex items-center gap-4 bg-white" style={{ border: '1px solid #E8E8E3' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircleIcon className="w-6 h-6" style={{ color: '#16A34A' }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Check In</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: '#0A0A0A' }}>
                {today?.checkIn ? formatTime(today.checkIn.timestamp) : '--:--'}
              </p>
            </div>
          </div>

          {/* Check-out time */}
          <div className="rounded-2xl p-5 flex items-center gap-4 bg-white" style={{ border: '1px solid #E8E8E3' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFF1F2' }}>
              <ClockIcon className="w-6 h-6" style={{ color: '#E11D48' }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Check Out</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: '#0A0A0A' }}>
                {today?.checkOut ? formatTime(today.checkOut.timestamp) : '--:--'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Action banners ── */}
        {!user?.isFaceEnrolled && (
          <div className="mb-5 rounded-2xl p-5 flex items-center justify-between gap-4" style={{ backgroundColor: '#0A0A0A' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFCD00' }}>
                <FaceSmileIcon className="w-5 h-5" style={{ color: '#0A0A0A' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Complete Face Enrollment</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Required to use biometric attendance</p>
              </div>
            </div>
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
              style={{ backgroundColor: '#FFCD00', color: '#0A0A0A' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E6B800'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFCD00'}
            >
              Enroll Now
            </Link>
          </div>
        )}

        {user?.isFaceEnrolled && !today?.hasCheckedIn && (
          <div className="mb-5 rounded-2xl p-5 flex items-center justify-between gap-4" style={{ backgroundColor: '#FFFDF0', border: '2px dashed #FFCD00' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFCD00' }}>
                <CheckCircleIcon className="w-5 h-5" style={{ color: '#0A0A0A' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Ready to Check In</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Scan your face to mark attendance</p>
              </div>
            </div>
            <Link
              to="/attendance"
              className="px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
              style={{ backgroundColor: '#0A0A0A', color: '#FFCD00' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1A1A1A'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0A0A0A'}
            >
              Check In Now
            </Link>
          </div>
        )}

        {/* ── Recent attendance table ── */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E8E3' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E8E8E3' }}>
            <h2 className="font-semibold" style={{ color: '#0A0A0A' }}>Recent Attendance</h2>
            <Link
              to="/attendance"
              className="text-xs font-semibold flex items-center gap-1 transition-colors hover:underline"
              style={{ color: '#0A0A0A' }}
            >
              View all <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-6 py-4">
            <AttendanceTable logs={logs} loading={loading} />
          </div>
        </div>

      </main>
    </div>
  );
};
