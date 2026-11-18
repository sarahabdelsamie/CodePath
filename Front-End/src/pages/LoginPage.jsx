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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;

    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'Admin') {
        navigate('/admin');
      } else if (result.user.role === 'Mentor') {
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
    } else if (type === 'mentor') {
      setEmail('mentor@codepath.com');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@codepath.com');
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
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">Quick Demo Login</span>
          </div>
        </div>

        {/* Demo login buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillMockCredentials('learner')}
            className="flex flex-col items-center justify-center border border-slate-200 hover:border-brand-primary/40 hover:bg-slate-50 font-semibold text-slate-700 py-2 px-1 rounded-xl text-[11px] transition-all"
            title="Auto-fill Learner Demo Account"
          >
            <span className="font-bold text-indigo-600">Learner</span>
            <span className="text-[9px] text-slate-400">Alex J.</span>
          </button>

          <button
            type="button"
            onClick={() => fillMockCredentials('mentor')}
            className="flex flex-col items-center justify-center border border-slate-200 hover:border-purple-300 hover:bg-slate-50 font-semibold text-slate-700 py-2 px-1 rounded-xl text-[11px] transition-all"
            title="Auto-fill Mentor Demo Account"
          >
            <span className="font-bold text-purple-600">Mentor</span>
            <span className="text-[9px] text-slate-400">Sarah J.</span>
          </button>

          <button
            type="button"
            onClick={() => fillMockCredentials('admin')}
            className="flex flex-col items-center justify-center border border-slate-200 hover:border-red-300 hover:bg-slate-50 font-semibold text-slate-700 py-2 px-1 rounded-xl text-[11px] transition-all"
            title="Auto-fill Admin Demo Account"
          >
            <span className="font-bold text-red-600">Admin</span>
            <span className="text-[9px] text-slate-400">Portal</span>
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
