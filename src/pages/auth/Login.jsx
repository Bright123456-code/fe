import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { FaceSmileIcon } from '@heroicons/react/24/solid';

export const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <FaceSmileIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">BioAttend</h1>
          <p className="text-slate-500 mt-1">Biometric Staff Attendance System</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
