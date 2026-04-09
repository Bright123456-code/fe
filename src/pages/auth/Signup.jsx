import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';

export const Signup = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 8) return setError('Password must be at least 8 characters');
    setIsLoading(true);
    try {
      await authService.signup({ name: formData.name, email: formData.email, password: formData.password });
      window.location.href = '/login?registered=true';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel (desktop) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,205,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,205,0,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#FFCD00' }} />

        <div className="relative z-10 text-center">
          <img src="/logo.png" alt="SWU" className="h-20 w-auto object-contain mx-auto mb-6 brightness-0 invert" />
          <div className="w-12 h-0.5 mx-auto mb-6" style={{ backgroundColor: '#FFCD00' }} />
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Join the<br />Smart Campus
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#9CA3AF' }}>
            Create your account and enroll your face to access biometric attendance in seconds.
          </p>

          <div className="mt-12 space-y-4">
            {[['01', 'Create your account'], ['02', 'Enroll your face'], ['03', 'Check in instantly']].map(([n, label]) => (
              <div key={n} className="flex items-center gap-3 text-left">
                <span
                  className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FFCD00', color: '#0A0A0A' }}
                >{n}</span>
                <span className="text-sm" style={{ color: '#D1D5DB' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="w-full max-w-sm">

          {/* Logo + name — always visible */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="South Western University" className="h-14 w-auto object-contain mx-auto mb-3" />
            <h1 className="text-lg font-bold tracking-tight" style={{ color: '#0A0A0A' }}>
              South Western University
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Attendance System</p>
            <div className="w-8 h-0.5 mx-auto mt-3" style={{ backgroundColor: '#FFCD00' }} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border" style={{ borderColor: '#E8E8E3' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0A0A0A' }}>Create account</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Register to get started</p>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                <span className="text-red-500 mt-0.5 flex-shrink-0 text-sm">⚠</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@southwestern.edu" required />
              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 characters" required />
              <Input label="Confirm password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: '#FFCD00', color: '#0A0A0A' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E6B800'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFCD00'}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Create account
              </button>
            </form>

            <p className="mt-5 text-center text-sm" style={{ color: '#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#0A0A0A' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
