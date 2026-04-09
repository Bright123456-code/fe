import { useState, useCallback } from 'react';
import { WebcamCapture } from './WebcamCapture';
import { Button } from '../common/Button';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

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

  const handleRetry = () => {
    setEmbedding(null);
    setStep(1);
    setError(null);
  };

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
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Face Enrollment</h2>
        <p className="text-sm text-slate-600 mt-1">
          Step {step} of 2: {step === 1 ? 'Capture Face' : 'Confirm Enrollment'}
        </p>

        <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${step * 50}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">Tips for best results:</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>Ensure good lighting on your face</li>
              <li>Look directly at the camera</li>
              <li>Remove glasses or hat if possible</li>
              <li>Keep a neutral expression</li>
              <li>Position face centered in the frame</li>
            </ul>
          </div>

          <WebcamCapture
            onCapture={handleCapture}
            onError={setError}
            captureText="Capture Face"
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-emerald-900">Face captured successfully!</span>
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              Your face template has been generated. Click "Enroll" to save it to your account.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900">What happens next?</h4>
            <ul className="mt-2 text-sm text-slate-700 space-y-1">
              <li>Your face template (not image) is securely stored</li>
              <li>During attendance, your face will be matched against this template</li>
              <li>You can re-enroll at any time if recognition fails</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleRetry} disabled={loading}>
              Retake
            </Button>
            <Button variant="success" onClick={handleEnroll} loading={loading} className="flex-1">
              Enroll Face
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
