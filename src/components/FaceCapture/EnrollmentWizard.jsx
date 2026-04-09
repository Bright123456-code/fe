import { useState, useCallback } from 'react';
import { WebcamCapture } from './WebcamCapture';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const EnrollmentWizard = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [embedding, setEmbedding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

  const handleCapture = useCallback((emb) => {
    setEmbedding(emb);
    setStep(2);
  }, []);

  const handleRetry = () => { setEmbedding(null); setStep(1); setError(null); };

  const handleEnroll = async () => {
    if (!embedding) return;
    setLoading(true);
    setError(null);
    try {
      await authService.enrollFace(embedding);
      success('Face enrolled successfully!');
      onSuccess?.();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to enroll face';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={step >= s
                ? { backgroundColor: '#FFCD00', color: '#0A0A0A' }
                : { backgroundColor: '#F5F5F0', color: '#9CA3AF' }}
            >
              {s}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: step >= s ? '#0A0A0A' : '#9CA3AF' }}>
                {s === 1 ? 'Capture Face' : 'Confirm'}
              </p>
            </div>
            {s < 2 && (
              <div className="w-8 h-0.5 flex-shrink-0" style={{ backgroundColor: step > s ? '#FFCD00' : '#E8E8E3' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — capture */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFDF0', border: '1px solid #FFCD00' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#0A0A0A' }}>Tips for best results:</p>
            <ul className="space-y-1">
              {[
                'Ensure good lighting on your face',
                'Look directly at the camera',
                'Keep a neutral expression',
                'Center your face in the frame',
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#FFCD00' }}>·</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <WebcamCapture onCapture={handleCapture} onError={setError} captureText="Capture Face" />

          {error && (
            <p className="text-xs text-center" style={{ color: '#E11D48' }}>{error}</p>
          )}

          <button
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl text-sm transition-all"
            style={{ color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F5F0'; e.currentTarget.style.color = '#0A0A0A'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step 2 — confirm */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16A34A' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#15803D' }}>Face captured successfully!</p>
              <p className="text-xs mt-0.5" style={{ color: '#16A34A' }}>
                Your face template has been generated. Click Enroll to save it.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F5F0' }}>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>What happens next</p>
            <ul className="space-y-1">
              {[
                'Your face template (not image) is securely stored',
                'Used to verify identity during attendance',
                'You can re-enroll at any time',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#FFCD00' }}>·</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FFF1F2', border: '1px solid #FECDD3' }}>
              <p className="text-xs" style={{ color: '#E11D48' }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleRetry}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: '#F5F5F0', color: '#0A0A0A', border: '1px solid #E8E8E3' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E8E8E3'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F5F5F0'}
            >
              <ArrowPathIcon className="w-4 h-4" /> Retake
            </button>

            <button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFCD00', color: '#0A0A0A' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#E6B800'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#FFCD00'; }}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              Enroll Face
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
