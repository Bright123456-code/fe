import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Layout/Sidebar';
import { Card } from '../../components/common/Card';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { AttendanceChart } from '../../components/Dashboard/Charts';
import api from '../../services/api';
import { UserGroupIcon, BuildingOfficeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export const Settings = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/admin/departments');
      setDepartments(data.data.stats || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const chartData = departments.map((d) => ({
    name: d.department || 'Unassigned',
    checkIns: d.checkIns,
    checkOuts: d.checkOuts,
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Settings</h1>
          <p className="text-slate-500 mt-1">Department analytics and system settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Attendance by Department</h3>
            <AttendanceChart data={chartData} type="bar" />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Distribution</h3>
            <AttendanceChart
              data={departments.map((d, i) => ({
                name: d.department || `Dept ${i + 1}`,
                value: d.checkIns,
              }))}
              type="pie"
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Check-ins</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Check-outs</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Active Users</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">{dept.department || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-emerald-600">{dept.checkIns}</td>
                    <td className="py-3 px-4 text-red-600">{dept.checkOuts}</td>
                    <td className="py-3 px-4">{dept.userCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};
