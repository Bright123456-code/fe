import { Card } from '../common/Card';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
};
