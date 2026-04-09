import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Layout/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AttendanceTable } from '../../components/Dashboard/AttendanceTable';
import { AttendanceChart } from '../../components/Dashboard/Charts';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const AttendanceReports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    search: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 20,
        ...filters,
      };
      if (params.search === '') delete params.search;
      if (params.startDate === '') delete params.startDate;
      if (params.endDate === '') delete params.endDate;

      const { data } = await api.get('/attendance/logs', { params });
      setLogs(data.data.logs);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/admin/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Attendance Reports</h1>
            <p className="text-slate-500 mt-1">View and export attendance records</p>
          </div>
          <Button variant="secondary" onClick={handleExport}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
            />
            <Input
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="md:col-span-2"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFilters({ startDate: '', endDate: '', search: '' });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        <Card>
          <AttendanceTable logs={logs} loading={loading} />

          {!loading && logs.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {logs.length} of {pagination.total} records
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
