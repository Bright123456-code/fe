import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Layout/Navbar';
import { Modal } from '../../components/common/Modal';
import { EnrollmentWizard } from '../../components/FaceCapture/EnrollmentWizard';
import { useToast } from '../../context/ToastContext';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export const Profile = () => {
  const { user, checkAuth } = useAuth();
  const { success } = useToast();
  const [showEnrollment, setShowEnrollment] = useState(false);

  const handleEnrollmentSuccess = async () => {
    setShowEnrollment(false);
    await checkAuth();
    success('Face enrollment completed successfully!');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const fields = [
    { label: 'Employee ID', value: user?.employeeId || 'N/A' },
    { label: 'Role', value: user?.role, capitalize: true },
    { label: 'Department', value: user?.department || 'N/A' },
    { label: 'Email', value: user?.email },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#0A0A0A' }}>Profile</h1>

        <div className="space-y-4">

          {/* ── Identity card ── */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E8E3' }}>
            <div className="flex items-center gap-5 mb-6">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ backgroundColor: '#0A0A0A', color: '#FFCD00' }}
              >
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>{user?.name}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{user?.email}</p>
                <span
                  className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ backgroundColor: '#FFFDF0', color: '#CC9900', border: '1px solid #FFCD00' }}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-4">
              {fields.map(({ label, value, capitalize }) => (
                <div key={label} className="rounded-xl p-4" style={{ backgroundColor: '#F5F5F0' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
                  <p className={`text-sm font-semibold ${capitalize ? 'capitalize' : ''}`} style={{ color: '#0A0A0A' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Face enrollment card ── */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E8E8E3' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={user?.isFaceEnrolled
                    ? { backgroundColor: '#F0FDF4' }
                    : { backgroundColor: '#FFFBEB' }}
                >
                  {user?.isFaceEnrolled
                    ? <CheckCircleIcon className="w-6 h-6" style={{ color: '#16A34A' }} />
                    : <ExclamationCircleIcon className="w-6 h-6" style={{ color: '#D97706' }} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: '#0A0A0A' }}>Face Recognition</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                    {user?.isFaceEnrolled
                      ? 'Your face is enrolled for biometric attendance'
                      : 'Enroll your face to enable quick check-in/out'}
                  </p>
                  <span
                    className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={user?.isFaceEnrolled
                      ? { backgroundColor: '#F0FDF4', color: '#16A34A' }
                      : { backgroundColor: '#FFFBEB', color: '#D97706' }}
                  >
                    {user?.isFaceEnrolled ? 'Enrolled' : 'Not enrolled'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEnrollment(true)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
                style={user?.isFaceEnrolled
                  ? { backgroundColor: '#F5F5F0', color: '#0A0A0A', border: '1px solid #E8E8E3' }
                  : { backgroundColor: '#FFCD00', color: '#0A0A0A' }}
                onMouseEnter={e => {
                  if (user?.isFaceEnrolled) e.currentTarget.style.backgroundColor = '#E8E8E3';
                  else e.currentTarget.style.backgroundColor = '#E6B800';
                }}
                onMouseLeave={e => {
                  if (user?.isFaceEnrolled) e.currentTarget.style.backgroundColor = '#F5F5F0';
                  else e.currentTarget.style.backgroundColor = '#FFCD00';
                }}
              >
                {user?.isFaceEnrolled ? 'Re-enroll' : 'Enroll Now'}
              </button>
            </div>
          </div>

          {/* ── Account note ── */}
          <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={{ backgroundColor: '#FFFDF0', border: '1px solid #FFCD00' }}>
            <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: '#FFCD00' }} />
            <p className="text-xs" style={{ color: '#6B7280' }}>
              To update your name, email, or department, please contact your administrator.
            </p>
          </div>

        </div>
      </main>

      <Modal isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} title="Face Enrollment">
        <EnrollmentWizard onSuccess={handleEnrollmentSuccess} onCancel={() => setShowEnrollment(false)} />
      </Modal>
    </div>
  );
};
