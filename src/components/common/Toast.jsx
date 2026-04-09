import { useToast } from '../../context/ToastContext';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-emerald-500" />,
    error: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
    warning: <InformationCircleIcon className="h-5 w-5 text-amber-500" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bgColors[toast.type]} animate-slide-in`}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm text-slate-700">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
