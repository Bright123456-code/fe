import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/common/Toast';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';

import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Dashboard } from './pages/user/Dashboard';
import { Attendance } from './pages/user/Attendance';
import { Profile } from './pages/user/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AttendanceReports } from './pages/admin/AttendanceReports';
import { Settings } from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AttendanceProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/attendance"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AttendanceReports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            <Toast />
          </ToastProvider>
        </AttendanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
