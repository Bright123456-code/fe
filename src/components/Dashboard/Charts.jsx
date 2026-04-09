import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export const AttendanceChart = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="checkIns" fill="#10b981" name="Check Ins" radius={[4, 4, 0, 0]} />
          <Bar dataKey="checkOuts" fill="#ef4444" name="Check Outs" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
};
