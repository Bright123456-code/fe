import { formatTime, formatDate } from '../../utils/formatters';

export const AttendanceTable = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">User</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Type</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Time</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-slate-900">{log.user?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{log.user?.employeeId || '-'}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    log.type === 'check-in'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {log.type === 'check-in' ? 'Check In' : 'Check Out'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-slate-600">
                {formatDate(log.timestamp)}
              </td>
              <td className="py-3 px-4 text-sm font-mono text-slate-600">
                {formatTime(log.timestamp)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    log.status === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : log.status === 'manual'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
