import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAuthInfo from '../Hook/useAuthInfo';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { user, setUser } = useAuthInfo();
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target path (Default: /profile)
  const from = location.state?.from?.pathname || "/profile";

  // Check persistent login status
  useEffect(() => {
    if (user?.email) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle Login Submission
  const onSubmit = async (data) => {
    setAuthError('');
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/users');
      const users = response.data;

      // Filter user by Email or Phone + Password
      const loggedUser = users.find(
        (u) =>
          (u.email === data.identifier || u.phone === data.identifier) &&
          u.password === data.password
      );

      if (loggedUser) {
        if (loggedUser.status !== 'approved') {
          setAuthError('Your account is pending admin approval.');
          setLoading(false);
          return;
        }

        // Set state & LocalStorage
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));

        // Navigate to Profile page
        navigate(from, { replace: true });
      } else {
        setAuthError('Invalid email or password!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setAuthError('Server connection failed. Is json-server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      
      {/* Left Banner */}
      <div className="w-full md:w-1/2 bg-[#1e232a] text-white p-8 md:p-16 flex flex-col justify-between min-h-[400px] md:min-h-screen">
        <div>
          <span onClick={() => navigate('/')} className="text-xl font-bold tracking-tight text-white cursor-pointer">
            Surplus Exchange
          </span>
        </div>

        <div className="max-w-md my-auto py-12">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Sell what is left.<br />
            Buy what you need.
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            A marketplace where construction projects sell unused materials to other projects.
          </p>
        </div>

        <div className="hidden md:block text-xs text-gray-500">
          © Surplus Exchange Platform
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 bg-[#f7f6f2] flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="bg-white p-8 sm:p-10 rounded-lg shadow-sm border border-gray-200/80 w-full max-w-md">
          
          <div className="flex items-center space-x-3 mb-8">
            <button type="button" className="px-6 py-2 bg-[#c24e00] text-white text-sm font-medium rounded transition-colors">
              Login
            </button>
            <button type="button" onClick={() => navigate('/register')} className="px-6 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors">
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h2>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email or phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. info@rahimconst.com"
                {...register('identifier', { required: 'Email or phone number is required' })}
                className={`w-full px-3.5 py-2.5 bg-white border ${errors.identifier ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900`}
              />
              {errors.identifier && (
                <span className="text-red-500 text-xs mt-1 block">{errors.identifier.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`w-full px-3.5 py-2.5 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('keepLoggedIn')} className="w-4 h-4 text-[#c24e00] border-gray-300 rounded focus:ring-[#c24e00] cursor-pointer" />
                <span className="text-xs text-gray-600 font-medium">Keep me logged in</span>
              </label>

              <a href="#forgot-password" className="text-xs font-medium text-[#c24e00] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-[#c24e00] hover:bg-[#a84300] text-white text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-xs text-gray-500 text-left">
            New here? Register as a{' '}
            <span onClick={() => navigate('/register')} className="text-gray-700 underline font-medium cursor-pointer">
              Company
            </span>{' '}
            or as an{' '}
            <span onClick={() => navigate('/register')} className="text-gray-700 underline font-medium cursor-pointer">
              Individual
            </span>
            .
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;