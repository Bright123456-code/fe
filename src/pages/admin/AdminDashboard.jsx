import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Layout/Sidebar';
import { Card } from '../../components/common/Card';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { AttendanceTable } from '../../components/Dashboard/AttendanceTable';
import { AttendanceChart } from '../../components/Dashboard/Charts';
import api from '../../services/api';
import {
  UserGroupIcon,
  UserPlusIcon,
  ClipboardIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = (stats?.daily || []).map((d) => ({
    name: d._id?.slice(5) || '',
    checkIns: d.checkIns || 0,
    checkOuts: d.checkOuts || 0,
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of attendance and user metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Staff"
            value={stats?.totalActive || 0}
            icon={UserGroupIcon}
            color="primary"
          />
          <StatsCard
            title="Checked In Today"
            value={stats?.today?.checkIns || 0}
            subtitle={`${stats?.today?.notCheckedIn || 0} not checked in`}
            icon={ClipboardIcon}
            color="emerald"
          />
          <StatsCard
            title="This Week"
            value={stats?.week?.totalCheckIns || 0}
            subtitle="Total check-ins"
            icon={UserPlusIcon}
            color="amber"
          />
          <StatsCard
            title="This Month"
            value={stats?.month?.totalCheckIns || 0}
            subtitle="Total check-ins"
            icon={ClockIcon}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Check-ins/Check-outs</h3>
            <AttendanceChart data={chartData} type="bar" />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Attendance Distribution</h3>
            <AttendanceChart
              data={[
                { name: 'Checked In', value: stats?.today?.checkIns || 0 },
                { name: 'Not Checked In', value: stats?.today?.notCheckedIn || 0 },
              ]}
              type="pie"
            />
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Attendance</h3>
            <a href="/admin/attendance" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </a>
          </div>
          <AttendanceTable logs={stats?.recentLogs || []} loading={false} />
        </Card>
      </main>
    </div>
  );
};
