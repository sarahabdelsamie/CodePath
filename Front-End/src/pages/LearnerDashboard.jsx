import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Award, ChevronRight, Play, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function LearnerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('codepath_token');
      if (!token) {
        setError('No active session. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message || 'Failed to fetch dashboard data.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
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
        <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded-lg w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 h-64 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/6 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 h-48 animate-pulse"></div>
            </div>
            <div className="lg:col-span-4 bg-white border border-slate-200/50 rounded-2xl p-8 h-96 animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-20 w-full flex-grow text-center">
          <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
            <AlertCircle size={36} className="text-red-500" />
            <h3 className="font-bold text-slate-800">Error Loading Dashboard</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { activeRoadmap, recentlyCompletedSteps, recommendedNextStep, totalCompletedStepsCount } = dashboardData || {};

  // SVG ring math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const activeProgressPercentage = activeRoadmap ? activeRoadmap.progressPercentage : 0;
  const strokeDashoffset = circumference - (activeProgressPercentage / 100) * circumference;

  const recommendedPaths = [
    {
      title: 'Full-Stack Next.js',
      level: 'Intermediate',
      desc: 'Master server-side rendering, API routes, and database integration with the leading React framework.',
      duration: '12 weeks',
      badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Cloud Architecture on AWS',
      level: 'Advanced',
      desc: 'Design highly scalable and fault-tolerant systems using modern cloud infrastructure components.',
      duration: '8 weeks',
      badgeColor: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'UI/UX for Developers',
      level: 'Beginner',
      desc: 'Learn the fundamental design principles that will make your frontend applications look professional.',
      duration: '4 weeks',
      badgeColor: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Greetings */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
            Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Learner'}
          </h1>
          <p className="text-slate-450 text-sm">Here is your learning progress for today.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Active Roadmap & Stats & Recommendations (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Active Roadmap Card */}
            {activeRoadmap ? (
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-4 text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-brand-primary font-bold text-xs uppercase tracking-widest">
                    <span>&lt;&gt;</span>
                    <span>Active Roadmap</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight truncate">
                      {activeRoadmap.title}
                    </h2>

                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      {getCategoryLabel(activeRoadmap.category)} Track • {activeRoadmap.difficultyLevel}
                    </p>
                  </div>

                  {/* Recommended Next Lesson Pill */}
                  {recommendedNextStep ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs flex items-center justify-between gap-4">
                      <span className="text-slate-400 font-medium shrink-0">Next Lesson:</span>
                      <span className="text-slate-800 font-semibold truncate">
                        Lesson {recommendedNextStep.order}: {recommendedNextStep.title}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl px-4 py-3 text-xs flex items-center justify-between gap-4">
                      <span className="text-emerald-700 font-semibold">🎉 Roadmap Completed!</span>
                      <span className="text-slate-500 font-medium">Excellent work!</span>
                    </div>
                  )}

                  {recommendedNextStep ? (
                    <button
                      onClick={() => navigate(`/roadmaps/${activeRoadmap._id}/steps/${recommendedNextStep._id}`)}
                      className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                    >
                      <Play size={14} className="fill-white" />
                      <span>Continue Learning</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/roadmaps/${activeRoadmap._id}`)}
                      className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
                    >
                      <BookOpen size={14} />
                      <span>Review Roadmap</span>
                    </button>
                  )}
                </div>

                {/* Progress Circle Visual */}
                <div className="relative flex items-center justify-center shrink-0 w-36 h-36">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      className="stroke-slate-100"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      className="stroke-brand-primary"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-display text-slate-800 leading-none">
                      {activeProgressPercentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center border border-brand-primary/10">
                  <Sparkles size={28} className="text-brand-primary" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Start Your Learning Journey</h3>
                  <p className="text-slate-455 text-sm leading-relaxed">
                    You haven't started any roadmap curriculum yet. Explore our directory of tracks, enroll in one, and watch your progress accumulate here!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/roadmaps')}
                  className="bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  Explore Roadmaps
                </button>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-tight">
                    {totalCompletedStepsCount}
                  </p>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                    Completed Lessons
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-tight">
                    {activeRoadmap ? activeRoadmap.progressPercentage : 0}%
                  </p>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                    Roadmap Progress
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Next Paths Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Recommended Next Paths</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-450 hover:text-slate-650 transition-colors text-sm font-bold">
                    &lt;
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-450 hover:text-slate-650 transition-colors text-sm font-bold">
                    &gt;
                  </button>
                </div>
              </div>

              {/* Recommendations grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recommendedPaths.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/50 rounded-2xl p-5 text-left flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.level}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[10px] font-semibold">
                      <span className="text-slate-400">{item.duration}</span>
                      <Link to="/roadmaps" className="text-brand-primary flex items-center gap-0.5 hover:gap-1 transition-all">
                        <span>Explore Path</span>
                        <ChevronRight size={10} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Recent Activity (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-900">Recent Activity</h3>
              <Link to="/roadmaps" className="text-xs font-semibold text-brand-primary hover:text-brand-primaryHover">
                View All
              </Link>
            </div>

            <div className="space-y-5 flex-grow">
              {recentlyCompletedSteps && recentlyCompletedSteps.length > 0 ? (
                recentlyCompletedSteps.map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border text-emerald-500 bg-emerald-50 border-emerald-100">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-normal truncate">
                        Completed: {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        in {act.roadmapTitle}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold">
                        {new Date(act.completedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-2 text-slate-400">
                  <CheckCircle2 size={24} className="stroke-slate-300" />
                  <p className="text-xs font-semibold">No activity recorded</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px]">
                    Your completed lessons will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
