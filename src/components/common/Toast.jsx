import { useToast } from '../../context/ToastContext';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export const Toast = () => {
  const { toasts, removeToast } = useToast();

  const config = {
    success: {
      icon: <CheckCircleIcon className="h-4 w-4 flex-shrink-0" style={{ color: '#16A34A' }} />,
      style: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D' },
    },
    error: {
      icon: <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" style={{ color: '#E11D48' }} />,
      style: { backgroundColor: '#FFF1F2', borderColor: '#FECDD3', color: '#BE123C' },
    },
    warning: {
      icon: <InformationCircleIcon className="h-4 w-4 flex-shrink-0" style={{ color: '#D97706' }} />,
      style: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' },
    },
    info: {
      icon: <InformationCircleIcon className="h-4 w-4 flex-shrink-0" style={{ color: '#FFCD00' }} />,
      style: { backgroundColor: '#FFFDF0', borderColor: '#FFCD00', color: '#0A0A0A' },
    },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const { icon, style } = config[toast.type] || config.info;
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl border shadow-md text-sm font-medium"
            style={style}
          >
            {icon}
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
