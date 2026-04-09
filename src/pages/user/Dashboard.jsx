import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { Navbar } from '../../components/Layout/Navbar';
import { Card } from '../../components/common/Card';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { AttendanceTable } from '../../components/Dashboard/AttendanceTable';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { formatTime } from '../../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const { today, fetchToday, logs, fetchLogs, loading } = useAttendance();

  useEffect(() => {
    fetchToday();
    fetchLogs({ limit: 5 });
  }, [fetchToday, fetchLogs]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Today's Status"
            value={today?.hasCheckedIn ? 'Checked In' : 'Not Checked In'}
            subtitle={today?.hasCheckedIn ? `At ${formatTime(today?.checkIn?.timestamp)}` : 'Missing'}
            icon={today?.hasCheckedIn ? CheckCircleIcon : ClockIcon}
            color={today?.hasCheckedIn ? 'emerald' : 'amber'}
          />

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Check-in Time</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {today?.checkIn ? formatTime(today.checkIn.timestamp) : '--:--'}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Check-out Time</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {today?.checkOut ? formatTime(today.checkOut.timestamp) : '--:--'}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-red-600" />
            </div>
          </Card>
        </div>

        {!user?.isFaceEnrolled && (
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center">
                  <FaceSmileIcon className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">Complete Your Enrollment</h3>
                  <p className="text-sm text-primary-700 mt-1">
                    Enroll your face to start using biometric attendance
                  </p>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="primary">Enroll Now</Button>
              </Link>
            </div>
          </Card>
        )}

        {user?.isFaceEnrolled && !today?.hasCheckedIn && (
          <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">Ready to Check In</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    You're all set up. Use facial recognition to check in.
                  </p>
                </div>
              </div>
              <Link to="/attendance">
                <Button variant="success">Check In Now</Button>
              </Link>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Attendance</h2>
            <Link to="/attendance" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <AttendanceTable logs={logs} loading={loading} />
        </Card>
      </main>
    </div>
  );
};
