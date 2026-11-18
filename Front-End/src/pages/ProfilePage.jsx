import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import { 
  User, Mail, Compass, Award, CheckCircle2, Clock, Edit2, 
  Save, X, Shield, ArrowRight, BookOpen, AlertCircle, Check
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [learningHistory, setLearningHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [learningPath, setLearningPath] = useState('frontend');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('codepath_token');
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProfileData(data.data.user);
        setLearningHistory(data.data.learningHistory || []);
        setName(data.data.user.name || '');
        setLearningPath(data.data.user.learningPath || 'frontend');
        setSkillLevel(data.data.user.skillLevel || 'beginner');
      } else {
        setError(data.message || 'Failed to load profile.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          learningPath,
          skillLevel
        })
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setProfileData(resData.data);
        setIsEditing(false);
        setSaveSuccess('Profile updated successfully!');
        
        // Update user in localStorage
        const stored = localStorage.getItem('codepath_user');
        if (stored) {
          const userObj = JSON.parse(stored);
          userObj.name = resData.data.name;
          userObj.learningPath = resData.data.learningPath;
          userObj.skillLevel = resData.data.skillLevel;
          userObj.path = resData.data.learningPath ? resData.data.learningPath.charAt(0).toUpperCase() + resData.data.learningPath.slice(1) : userObj.path;
          userObj.level = resData.data.skillLevel ? resData.data.skillLevel.charAt(0).toUpperCase() + resData.data.skillLevel.slice(1) : userObj.level;
          localStorage.setItem('codepath_user', JSON.stringify(userObj));
        }

        setTimeout(() => setSaveSuccess(''), 4000);
      } else {
        setSaveError(resData.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setSaveError('Network error while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (userName) => {
    if (!userName) return 'U';
    return userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'frontend': return 'Frontend';
      case 'backend': return 'Backend';
      case 'ai': return 'AI & Data';
      case 'mobile': return 'Mobile';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-20 w-full flex-grow flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold text-sm">Loading profile data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const user = profileData || currentUser;
  const isLearner = user?.role === 'learner' || user?.role === 'Learner';

  // Calculate total completed steps
  const totalCompleted = learningHistory.reduce(
    (acc, p) => acc + (p.completedSteps ? p.completedSteps.length : 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Alerts */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
            <Check size={18} className="text-emerald-600" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle size={18} className="text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-primary to-indigo-600 text-white flex items-center justify-center font-display text-3xl font-bold shadow-md shadow-brand-primary/20 shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
                    {user?.name || 'Member'}
                  </h1>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider bg-indigo-50 border-indigo-100 text-indigo-600">
                    {user?.role}
                  </span>
                </div>
                <p className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Mail size={13} />
                  <span>{user?.email}</span>
                  <span className="mx-1">•</span>
                  <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'recently'}</span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  <Edit2 size={13} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  <X size={13} />
                  <span>Cancel</span>
                </button>
              )}
              <Link
                to="/settings"
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span>Settings</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Quick Metrics (Learner specific) */}
          {isLearner && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Track</span>
                <p className="text-base font-bold text-slate-800 capitalize mt-1">
                  {getCategoryLabel(user?.learningPath || 'Frontend')}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skill Level</span>
                <p className="text-base font-bold text-slate-800 capitalize mt-1">
                  {user?.skillLevel || 'Beginner'}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracks In Progress</span>
                <p className="text-base font-bold text-slate-800 mt-1">
                  {learningHistory.length}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Steps</span>
                <p className="text-base font-bold text-emerald-600 mt-1">
                  {totalCompleted}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Form Modal/Drawer Area if active */}
        {isEditing && (
          <div className="bg-white border border-brand-primary/20 ring-4 ring-brand-primary/5 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">Edit Profile Information</h3>
              <span className="text-xs text-slate-400">Changes are applied immediately</span>
            </div>

            {saveError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                />
              </div>

              {isLearner && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Target Learning Track
                    </label>
                    <select
                      value={learningPath}
                      onChange={(e) => setLearningPath(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    >
                      <option value="frontend">Frontend Engineering</option>
                      <option value="backend">Backend Architecture</option>
                      <option value="ai">AI & Machine Learning</option>
                      <option value="mobile">Mobile Application Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Experience Level
                    </label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Learning History Section */}
        {isLearner && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-slate-900">Enrolled Learning Tracks & Progress</h2>
              <Link to="/roadmaps" className="text-xs font-bold text-brand-primary hover:underline">
                Explore More Tracks &rarr;
              </Link>
            </div>

            {learningHistory.length === 0 ? (
              <div className="bg-white border border-slate-200/50 rounded-2xl p-10 text-center space-y-4">
                <BookOpen size={36} className="text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Enrolled Tracks Yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Enroll in a verified engineering roadmap to start tracking your competencies and milestone achievements.
                </p>
                <Link
                  to="/roadmaps"
                  className="inline-block bg-brand-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-brand-primaryHover transition-all"
                >
                  Browse Roadmaps
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {learningHistory.map((item) => {
                  const roadmap = item.roadmapId;
                  if (!roadmap) return null;
                  const completedCount = item.completedSteps ? item.completedSteps.length : 0;
                  const totalSteps = roadmap.steps ? roadmap.steps.length : 0;

                  return (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider bg-indigo-50 border-indigo-100 text-indigo-600">
                            {getCategoryLabel(roadmap.category)}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                            {roadmap.difficultyLevel}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg leading-snug">
                          {roadmap.title}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2">
                          {roadmap.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            {completedCount} of {totalSteps} lessons completed
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar & Continue button */}
                      <div className="w-full md:w-64 space-y-3 shrink-0">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">Track Mastery</span>
                          <span className="font-extrabold text-brand-primary">{item.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.progressPercentage}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
                          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Continue Track</span>
                          <span>&rarr;</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
