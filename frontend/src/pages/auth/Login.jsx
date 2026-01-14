import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';
import { CalendarDaysIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Check for pending booking on mount
  useEffect(() => {
    const pendingBooking = sessionStorage.getItem('pendingBookingResource');
    if (pendingBooking) {
      toast('Please login to complete your booking', { icon: '🔐' });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Check if there's a pending booking
      const pendingBooking = sessionStorage.getItem('pendingBookingResource');

      if (user.role === 'ADMIN') {
        sessionStorage.removeItem('pendingBookingResource');
        navigate('/admin', { replace: true });
      } else if (pendingBooking) {
        // Redirect to calendar with pending resource
        navigate('/calendar', { replace: true });
        toast.success('Now select your booking time on the calendar');
      } else {
        navigate(from === '/' ? '/dashboard' : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl">
              <CalendarDaysIcon className="h-10 w-10" />
            </div>
            <span className="text-3xl font-bold">BookingPMS</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">
            Manage Your Resources<br />
            <span className="text-accent-300">Efficiently</span>
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Streamline your workspace scheduling with our powerful booking management system.
            Join thousands of satisfied users.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '10K+', label: 'Bookings' },
              { value: '500+', label: 'Resources' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="bg-primary-500 p-2 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BookingPMS</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-base font-semibold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-600">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-primary-50 border border-primary-100 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-primary-800 mb-2 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Demo Credentials
            </h4>
            <div className="text-xs text-primary-700 space-y-1">
              <p><span className="font-medium">Admin:</span> admin@bookingpms.com / Admin@123</p>
              <p><span className="font-medium">User:</span> user@bookingpms.com / User@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
