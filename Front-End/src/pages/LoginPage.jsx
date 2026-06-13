import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;

    const result = login(email, password);
    if (result.success) {
      if (result.user.role === 'Mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setGeneralError(result.message);
    }
  };

  // Handle Mock Login Helper
  const fillMockCredentials = (type) => {
    if (type === 'learner') {
      setEmail('learner@codepath.com');
      setPassword('password123');
    } else {
      setEmail('mentor@codepath.com');
      setPassword('password123');
    }
  };

  // Handle Forgot Password
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setResetSuccess('');
    setResetError('');

    if (!resetEmail) {
      setResetError('Email address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    // Simulate sending reset link
    setResetSuccess(`A password reset link has been sent to ${resetEmail}.`);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-50/50 via-slate-50 to-indigo-100/30 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>

      {/* CodePath Logo & Tagline */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center shadow-md shadow-brand-primary/10">
            <span className="font-display font-black text-xl text-white">C</span>
          </div>
          <span className="font-display font-bold text-3xl text-slate-900 tracking-tight">
            Code<span className="text-brand-primary">Path</span>
          </span>
        </div>
        <p className="text-slate-400 text-sm font-medium">Empowering high-performance learning.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[460px] bg-white border border-slate-200/50 rounded-2xl shadow-xl p-8 sm:p-10 relative">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1.5">Welcome back</h2>
          <p className="text-slate-400 text-sm">Please enter your details to sign in.</p>
        </div>

        {generalError && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-sm text-red-600 text-left">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border ${
                  errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-brand-primary/10 focus:border-brand-primary'
                } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs font-semibold text-brand-primary hover:text-brand-primaryHover transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border ${
                  errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-brand-primary/10 focus:border-brand-primary'
                } rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-4 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4.5 h-4.5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary/20 accent-brand-primary cursor-pointer"
            />
            <label htmlFor="remember_me" className="ml-2 text-sm font-medium text-slate-500 cursor-pointer select-none hover:text-slate-800 transition-colors">
              Remember for 30 days
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-brand-accent hover:bg-brand-accentHover text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-brand-accent/10 hover:shadow-lg hover:shadow-brand-accent/20 hover:-translate-y-0.5 active:translate-y-0 text-center text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fillMockCredentials('learner')}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 py-2.5 rounded-xl text-xs transition-colors"
            title="Auto-fill Learner Demo Account"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Google (Learner)</span>
          </button>
          <button
            onClick={() => fillMockCredentials('mentor')}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 py-2.5 rounded-xl text-xs transition-colors"
            title="Auto-fill Mentor Demo Account"
          >
            <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub (Mentor)</span>
          </button>
        </div>

        {/* Register link */}
        <div className="text-center mt-8 text-sm">
          <span className="text-slate-400">Don't have an account? </span>
          <Link
            to="/register"
            className="font-bold text-brand-primary hover:text-brand-primaryHover transition-colors"
          >
            Sign up to CodePath
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-left relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
              <button
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetEmail('');
                  setResetSuccess('');
                  setResetError('');
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Enter the email address associated with your account, and we will send you a link to reset your password.
            </p>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm mb-4">
                {resetSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                    />
                  </div>
                  {resetError && <p className="text-xs text-red-500 mt-1 font-medium">{resetError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetEmail('');
                  setResetSuccess('');
                  setResetError('');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
