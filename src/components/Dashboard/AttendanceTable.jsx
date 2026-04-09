import { formatTime, formatDate } from '../../utils/formatters';

export const AttendanceTable = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: '#F5F5F0' }} />
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: '#9CA3AF' }}>No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid #F5F5F0' }}>
            {['User', 'Type', 'Date', 'Time', 'Status'].map(h => (
              <th key={h} className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log._id}
              className="transition-colors"
              style={{ borderBottom: '1px solid #F5F5F0' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAF8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td className="py-3 px-3">
                <p className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>{log.user?.name || 'Unknown'}</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{log.user?.employeeId || '-'}</p>
              </td>
              <td className="py-3 px-3">
                <span
                  className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full"
                  style={log.type === 'check-in'
                    ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
                    : { backgroundColor: '#FFF1F2', color: '#E11D48' }}
                >
                  {log.type === 'check-in' ? 'Check In' : 'Check Out'}
                </span>
              </td>
              <td className="py-3 px-3 text-sm" style={{ color: '#6B7280' }}>{formatDate(log.timestamp)}</td>
              <td className="py-3 px-3 text-sm font-mono" style={{ color: '#6B7280' }}>{formatTime(log.timestamp)}</td>
              <td className="py-3 px-3">
                <span
                  className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize"
                  style={log.status === 'success'
                    ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
                    : log.status === 'manual'
                    ? { backgroundColor: '#FFFBEB', color: '#D97706' }
                    : { backgroundColor: '#FFF1F2', color: '#E11D48' }}
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
