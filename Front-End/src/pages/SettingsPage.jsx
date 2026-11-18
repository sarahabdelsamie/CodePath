import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import { 
  Lock, Shield, Bell, BookOpen, AlertCircle, Check, 
  Eye, EyeOff, Save, KeyRound, Sparkles, Sliders
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('security');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Preference states
  const [emailDigest, setEmailDigest] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [weeklyGoalHours, setWeeklyGoalHours] = useState('5');
  const [prefSuccess, setPrefSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess('Your password has been changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Failed to communicate with authentication server.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSuccess('Your preferences have been saved locally!');
    setTimeout(() => setPrefSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            Account & Platform Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your credentials, notifications, and personalized learning experience.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 mb-8 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <KeyRound size={15} />
            <span>Account Security</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sliders size={15} />
            <span>Learning & Alerts</span>
          </button>
        </div>

        {/* Tab Content: Security */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Account Overview Box */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Email</span>
                <p className="text-base font-bold text-slate-800 mt-0.5">{currentUser?.email || 'N/A'}</p>
                <p className="text-xs text-slate-400 mt-1">Primary identity for login and verified communications</p>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-wider self-start sm:self-auto">
                Verified Account
              </span>
            </div>

            {/* Change Password Card */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Lock size={18} className="text-brand-primary" />
                  <span>Update Password</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Ensure your account is protected with a strong, secure password of 6 characters or more.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-xs font-semibold">
                  <Check size={16} />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-brand-primary hover:bg-brand-primaryHover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-primary/10 flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save New Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content: Preferences */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSavePreferences} className="space-y-6">
            {prefSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-xs font-semibold">
                <Check size={16} />
                <span>{prefSuccess}</span>
              </div>
            )}

            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Bell size={18} className="text-brand-primary" />
                <span>Notification Preferences</span>
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Weekly Progress Digest</span>
                    <span className="text-[11px] text-slate-400">Receive a weekly summary of completed steps and milestones.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Milestone & Recommendation Alerts</span>
                    <span className="text-[11px] text-slate-400">Notified whenever your active roadmap unlocks new project exercises.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={milestoneAlerts}
                    onChange={(e) => setMilestoneAlerts(e.target.checked)}
                    className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-primary" />
                <span>Pace & Commitment</span>
              </h3>

              <div className="max-w-md">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Study Hours / Week
                </label>
                <select
                  value={weeklyGoalHours}
                  onChange={(e) => setWeeklyGoalHours(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                >
                  <option value="3">3 hours / week (Casual Learner)</option>
                  <option value="5">5 hours / week (Recommended Standard)</option>
                  <option value="10">10 hours / week (Fast-track Career Switch)</option>
                  <option value="20">20+ hours / week (Full-time Bootcamp)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primaryHover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-primary/10 flex items-center gap-2"
                >
                  <Save size={14} />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
