import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10" style={{ border: '1px solid #E8E8E3' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold" style={{ color: '#0A0A0A' }}>{title}</h3>
              <div className="w-6 h-0.5 mt-1" style={{ backgroundColor: '#FFCD00' }} />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F5F0'; e.currentTarget.style.color = '#0A0A0A'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
