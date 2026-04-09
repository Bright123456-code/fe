import { useState, useCallback } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useToast } from '../../context/ToastContext';
import { Navbar } from '../../components/Layout/Navbar';
import { WebcamCapture } from '../../components/FaceCapture/WebcamCapture';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatTime } from '../../utils/formatters';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

export const Attendance = () => {
  const { today, fetchToday, checkIn, checkOut, loading } = useAttendance();
  const { success, error: showError } = useToast();
  const [mode, setMode] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleCapture = useCallback(
    async (embedding) => {
      setProcessing(true);
      setResult(null);

      try {
        let response;
        if (mode === 'checkin') {
          response = await checkIn(embedding);
          success(`Welcome, ${response.data.user.name}! Check-in successful.`);
        } else {
          response = await checkOut(embedding);
          success(`Goodbye, ${response.data.user.name}! Check-out successful.`);
        }
        setResult({ type: 'success', data: response.data });
      } catch (err) {
        const message = err.message || 'Recognition failed. Please try again.';
        setResult({ type: 'error', message });
        showError(message);
      } finally {
        setProcessing(false);
      }
    },
    [mode, checkIn, checkOut, success, showError]
  );

  const handleReset = () => {
    setMode(null);
    setResult(null);
    fetchToday();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {result?.type === 'success' && (
          <Card className="mb-8 bg-emerald-50 border-emerald-200 text-center">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-emerald-900">
              {mode === 'checkin' ? 'Check-in' : 'Check-out'} Successful!
            </h2>
            <p className="text-emerald-700 mt-2">
              {result.data.user.name} - {formatTime(result.data.attendance.timestamp)}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              Confidence: {(result.data.attendance.confidence * 100).toFixed(1)}%
            </p>
            <Button variant="secondary" onClick={handleReset} className="mt-6">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              New Attendance
            </Button>
          </Card>
        )}

        {result?.type === 'error' && (
          <Card className="mb-8 bg-red-50 border-red-200 text-center">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900">Recognition Failed</h2>
            <p className="text-red-700 mt-2">{result.message}</p>
            <Button variant="secondary" onClick={handleReset} className="mt-6">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Card>
        )}

        {!mode && !result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Check In</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">
                {today?.hasCheckedIn
                  ? `Already checked in at ${formatTime(today.checkIn.timestamp)}`
                  : 'Record your arrival for today'}
              </p>
              <Button
                variant="success"
                onClick={() => setMode('checkin')}
                disabled={today?.hasCheckedIn || loading}
                className="w-full"
              >
                {today?.hasCheckedIn ? 'Already Checked In' : 'Start Check In'}
              </Button>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Check Out</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">
                {today?.hasCheckedOut
                  ? `Already checked out at ${formatTime(today.checkOut.timestamp)}`
                  : today?.hasCheckedIn
                  ? 'Record your departure for today'
                  : 'Check in first to check out'}
              </p>
              <Button
                variant="danger"
                onClick={() => setMode('checkout')}
                disabled={!today?.hasCheckedIn || today?.hasCheckedOut || loading}
                className="w-full"
              >
                {today?.hasCheckedOut ? 'Already Checked Out' : 'Start Check Out'}
              </Button>
            </Card>
          </div>
        )}

        {(mode === 'checkin' || mode === 'checkout') && !result && (
          <Card>
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === 'checkin' ? 'Check In' : 'Check Out'} with Face Recognition
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Position your face in the camera and look directly at it
              </p>
            </div>

            {processing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="xl" />
                <p className="mt-4 text-slate-600">Processing...</p>
              </div>
            ) : (
              <WebcamCapture
                onCapture={handleCapture}
                captureText={mode === 'checkin' ? 'Check In' : 'Check Out'}
                continuous={false}
                showLandmarks={true}
              />
            )}

            <div className="mt-6 flex justify-center">
              <Button variant="ghost" onClick={() => setMode(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <Card className="mt-6">
          <h3 className="font-semibold text-slate-900 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Check In</p>
              <p className="text-xl font-bold text-slate-900">
                {today?.checkIn ? formatTime(today.checkIn.timestamp) : 'Not recorded'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500">Check Out</p>
              <p className="text-xl font-bold text-slate-900">
                {today?.checkOut ? formatTime(today.checkOut.timestamp) : 'Not recorded'}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};
