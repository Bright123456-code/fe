import { useState, useCallback } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useToast } from '../../context/ToastContext';
import { Navbar } from '../../components/Layout/Navbar';
import { WebcamCapture } from '../../components/FaceCapture/WebcamCapture';
import { formatTime } from '../../utils/formatters';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const toLocalDateValue = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const Attendance = () => {
  const { today, fetchToday, checkIn, checkOut, loading } = useAttendance();
  const { success, error: showError } = useToast();
  const [mode, setMode] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toLocalDateValue(new Date()));

  const isToday = selectedDate === toLocalDateValue(new Date());

  const handleCapture = useCallback(async (embedding) => {
    setProcessing(true);
    setResult(null);
    try {
      let response;
      if (mode === 'checkin') {
        response = await checkIn(embedding, null, selectedDate);
        success(`Welcome, ${response.data.user.name}! Check-in successful.`);
      } else {
        response = await checkOut(embedding, null, selectedDate);
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
  }, [mode, selectedDate, checkIn, checkOut, success, showError]);

  const handleReset = () => { setMode(null); setResult(null); fetchToday(); };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#0A0A0A' }}>Attendance</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>

          {/* Date picker */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Test date:</span>
            <input
              type="date"
              value={selectedDate}
              max={toLocalDateValue(new Date())}
              onChange={(e) => { setSelectedDate(e.target.value); setResult(null); setMode(null); }}
              className="text-sm px-3 py-1.5 rounded-lg border outline-none"
              style={{ borderColor: '#E8E8E3', backgroundColor: '#fff', color: '#0A0A0A' }}
            />
            {!isToday && (
              <button
                onClick={() => { setSelectedDate(toLocalDateValue(new Date())); setResult(null); setMode(null); }}
                className="text-xs font-semibold hover:underline"
                style={{ color: '#CC9900' }}
              >
                Reset to today
              </button>
            )}
          </div>
        </div>

        {/* ── Success result ── */}
        {result?.type === 'success' && (
          <div className="mb-6 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E8E3' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircleIcon className="w-9 h-9" style={{ color: '#16A34A' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
              {mode === 'checkin' ? 'Check-in' : 'Check-out'} Successful!
            </h2>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
              {result.data.user.name} · {formatTime(result.data.attendance.timestamp)}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              Confidence: {(result.data.attendance.confidence * 100).toFixed(1)}%
            </p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: '#0A0A0A', color: '#FFCD00' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1A1A1A'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0A0A0A'}
            >
              <ArrowPathIcon className="w-4 h-4" /> New Attendance
            </button>
          </div>
        )}

        {/* ── Error result ── */}
        {result?.type === 'error' && (
          <div className="mb-6 bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid #E8E8E3' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF1F2' }}>
              <XCircleIcon className="w-9 h-9" style={{ color: '#E11D48' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>Recognition Failed</h2>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>{result.message}</p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: '#0A0A0A', color: '#FFCD00' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1A1A1A'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0A0A0A'}
            >
              <ArrowPathIcon className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* ── Mode selector ── */}
        {!mode && !result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Check In card */}
            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #E8E8E3' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F0FDF4' }}>
                <CheckCircleIcon className="w-7 h-7" style={{ color: '#16A34A' }} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: '#0A0A0A' }}>Check In</h3>
              <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
                {today?.hasCheckedIn
                  ? `Checked in at ${formatTime(today.checkIn.timestamp)}`
                  : 'Record your arrival'}
              </p>
              <button
                onClick={() => setMode('checkin')}
                disabled={today?.hasCheckedIn || loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: today?.hasCheckedIn ? '#F5F5F0' : '#0A0A0A', color: today?.hasCheckedIn ? '#9CA3AF' : '#FFCD00' }}
                onMouseEnter={e => { if (!today?.hasCheckedIn && !loading) e.currentTarget.style.backgroundColor = '#1A1A1A'; }}
                onMouseLeave={e => { if (!today?.hasCheckedIn && !loading) e.currentTarget.style.backgroundColor = '#0A0A0A'; }}
              >
                {today?.hasCheckedIn ? 'Already Checked In' : 'Start Check In'}
              </button>
            </div>

            {/* Check Out card */}
            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #E8E8E3' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF1F2' }}>
                <XCircleIcon className="w-7 h-7" style={{ color: '#E11D48' }} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: '#0A0A0A' }}>Check Out</h3>
              <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
                {today?.hasCheckedOut
                  ? `Checked out at ${formatTime(today.checkOut.timestamp)}`
                  : today?.hasCheckedIn
                  ? 'Record your departure'
                  : 'Check in first'}
              </p>
              <button
                onClick={() => setMode('checkout')}
                disabled={!today?.hasCheckedIn || today?.hasCheckedOut || loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: (!today?.hasCheckedIn || today?.hasCheckedOut) ? '#F5F5F0' : '#E11D48', color: (!today?.hasCheckedIn || today?.hasCheckedOut) ? '#9CA3AF' : '#fff' }}
                onMouseEnter={e => { if (today?.hasCheckedIn && !today?.hasCheckedOut) e.currentTarget.style.backgroundColor = '#BE123C'; }}
                onMouseLeave={e => { if (today?.hasCheckedIn && !today?.hasCheckedOut) e.currentTarget.style.backgroundColor = '#E11D48'; }}
              >
                {today?.hasCheckedOut ? 'Already Checked Out' : 'Start Check Out'}
              </button>
            </div>
          </div>
        )}

        {/* ── Camera view ── */}
        {(mode === 'checkin' || mode === 'checkout') && !result && (
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E8E3' }}>
            <div className="text-center mb-5">
              <h2 className="text-lg font-bold" style={{ color: '#0A0A0A' }}>
                {mode === 'checkin' ? 'Check In' : 'Check Out'} — Face Recognition
              </h2>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                Look directly at the camera and hold still
              </p>
            </div>

            {processing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="animate-spin h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" style={{ color: '#FFCD00' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Processing face...</p>
              </div>
            ) : (
              <WebcamCapture onCapture={handleCapture} continuous={false} showLandmarks={true} />
            )}

            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ color: '#6B7280' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F5F0'; e.currentTarget.style.color = '#0A0A0A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Today's summary ── */}
        <div className="mt-5 bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E8E3' }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#9CA3AF' }}>Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F5F0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Check In</p>
              <p className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
                {today?.checkIn ? formatTime(today.checkIn.timestamp) : '--:--'}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#F5F5F0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Check Out</p>
              <p className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
                {today?.checkOut ? formatTime(today.checkOut.timestamp) : '--:--'}
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
