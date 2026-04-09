import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Layout/Navbar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EnrollmentWizard } from '../../components/FaceCapture/EnrollmentWizard';
import { useToast } from '../../context/ToastContext';
import { FaceSmileIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export const Profile = () => {
  const { user, checkAuth } = useAuth();
  const { success, error: showError } = useToast();
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnrollmentSuccess = async () => {
    setShowEnrollment(false);
    await checkAuth();
    success('Face enrollment completed successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Profile</h1>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary-700">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Employee ID</p>
                <p className="font-medium text-slate-900">{user?.employeeId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-medium text-slate-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Department</p>
                <p className="font-medium text-slate-900">{user?.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Face Enrollment</p>
                <div className="flex items-center gap-2">
                  {user?.isFaceEnrolled ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-emerald-700">Enrolled</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-amber-700">Not Enrolled</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    user?.isFaceEnrolled ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}
                >
                  <FaceSmileIcon
                    className={`w-6 h-6 ${user?.isFaceEnrolled ? 'text-emerald-600' : 'text-amber-600'}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Face Recognition</h3>
                  <p className="text-sm text-slate-500">
                    {user?.isFaceEnrolled
                      ? 'Your face is enrolled for biometric attendance'
                      : 'Enroll your face for quick check-in/check-out'}
                  </p>
                </div>
              </div>
              <Button
                variant={user?.isFaceEnrolled ? 'secondary' : 'primary'}
                onClick={() => setShowEnrollment(true)}
              >
                {user?.isFaceEnrolled ? 'Re-enroll' : 'Enroll Now'}
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <Input label="Name" value={user?.name || ''} disabled />
              <Input label="Email" value={user?.email || ''} disabled />
              <p className="text-xs text-slate-500">
                Contact your administrator to update account information
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={showEnrollment}
        onClose={() => setShowEnrollment(false)}
        title="Face Enrollment"
      >
        <EnrollmentWizard
          onSuccess={handleEnrollmentSuccess}
          onCancel={() => setShowEnrollment(false)}
        />
      </Modal>
    </div>
  );
};
