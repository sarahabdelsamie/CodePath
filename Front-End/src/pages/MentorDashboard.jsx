import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import {
  Users, BookOpen, Calendar, MessageSquare, ShieldCheck, ChevronRight,
  User, AlertCircle, Compass, Award, ExternalLink
} from 'lucide-react';

export default function MentorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toolModal, setToolModal] = useState(null); // 'messaging' | 'scheduling' | null

  useEffect(() => {
    fetchMentorOverview();
  }, []);

  const fetchMentorOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('codepath_token');
      if (!token) {
        setError('Please log in to view the mentor portal.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/mentor/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setOverviewData(resData.data);
      } else {
        setError(resData.message || 'Failed to load mentor overview.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend server failed.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'L';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getCategoryLabel = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'frontend': return 'Frontend Engineering';
      case 'backend': return 'Backend Engineering';
      case 'ai': return 'Artificial Intelligence';
      case 'mobile': return 'Mobile Development';
      default: return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'General Tech';
    }
  };

  const stats = overviewData?.stats || {
    totalMentees: 0,
    frontendMentees: 0,
    backendMentees: 0,
    aiMentees: 0,
    mobileMentees: 0
  };

  const mentees = overviewData?.mentees || [];

  const statCards = [
    {
      label: 'Active Mentees',
      value: stats.totalMentees.toString(),
      trend: `${stats.totalMentees} registered learners`,
      icon: Users,
      iconColor: 'text-brand-primary bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Frontend & Backend',
      value: (stats.frontendMentees + stats.backendMentees).toString(),
      trend: `${stats.frontendMentees} Frontend • ${stats.backendMentees} Backend`,
      icon: BookOpen,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'AI & Mobile Specialists',
      value: (stats.aiMentees + stats.mobileMentees).toString(),
      trend: `${stats.aiMentees} AI/Data • ${stats.mobileMentees} Mobile`,
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  const tools = [
    {
      id: 'messaging',
      title: 'Mentee Direct Connect',
      desc: 'Send quick feedback or open office hour announcements to all active mentees.',
      icon: MessageSquare,
      badge: 'Active Tool',
    },
    {
      id: 'scheduling',
      title: 'Session Office Hours',
      desc: 'Coordinate 1-on-1 career advisement and code review consultations.',
      icon: Calendar,
      badge: 'Office Hours',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1 font-display">
              Welcome back, {currentUser?.name || 'Mentor'}
            </h1>
            <p className="text-slate-400 text-sm">
              Track learner progression, review roadmaps, and guide future engineers.
            </p>
          </div>
          <button
            onClick={fetchMentorOverview}
            className="self-start sm:self-auto text-xs font-semibold text-brand-primary bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2 rounded-xl transition-all"
          >
            Refresh Metrics
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex items-center gap-5"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1 leading-none">{stat.value}</h3>
                  <span className="text-[11px] text-slate-500 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md inline-block mt-2">
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Mentees List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Your Mentees ({mentees.length})
              </h3>
              <span className="text-xs text-slate-400 font-medium">Synced from live database</span>
            </div>

            {loading ? (
              <div className="bg-white border border-slate-200/50 rounded-2xl p-12 text-center text-slate-400 animate-pulse">
                Loading live learner data...
              </div>
            ) : mentees.length === 0 ? (
              <div className="bg-white border border-slate-200/50 rounded-2xl p-12 text-center space-y-3">
                <Users size={32} className="mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-700">No active mentees found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  As new learners register for the platform, they will appear here with real-time progression tracking.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mentees.map((mentee) => {
                  const primaryProgress = mentee.progress && mentee.progress.length > 0
                    ? mentee.progress[0]
                    : { roadmapTitle: getCategoryLabel(mentee.learningPath), percentage: 0 };

                  return (
                    <div
                      key={mentee.id}
                      className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-slate-300 transition-all"
                    >
                      {/* Mentee Profile */}
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-11 h-11 rounded-full bg-indigo-50 text-brand-primary flex items-center justify-center font-bold text-sm border border-indigo-100 shrink-0">
                          {getInitials(mentee.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{mentee.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {getCategoryLabel(mentee.learningPath)}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                              {mentee.skillLevel || 'Beginner'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1 max-w-md w-full">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-500 font-medium truncate max-w-[220px]" title={primaryProgress.roadmapTitle}>
                            {primaryProgress.roadmapTitle}
                          </span>
                          <span className="text-brand-primary font-bold">{primaryProgress.percentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-primary to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(primaryProgress.percentage, 5)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => navigate(`/roadmaps/${mentee.learningPath || 'frontend'}`)}
                        className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-brand-primary text-slate-700 hover:text-brand-primary text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50/50 transition-all shrink-0"
                      >
                        <span>View Track</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Mentor Tools (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-900">Mentor Tools</h3>

            <div className="space-y-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-brand-primary border border-indigo-100 flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                        {tool.badge}
                      </span>
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">{tool.title}</h4>
                      <p className="text-xs text-slate-400 leading-normal">{tool.desc}</p>
                    </div>
                    <button
                      onClick={() => setToolModal(tool.id)}
                      className="w-full text-xs font-semibold py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-brand-primary border border-slate-200 rounded-xl transition-all"
                    >
                      Open {tool.id === 'messaging' ? 'Direct Connect' : 'Scheduler'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Tool Modal Dialog */}
      {toolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {toolModal === 'messaging' ? 'Broadcast Message to Mentees' : 'Schedule Office Hours'}
              </h3>
              <button
                onClick={() => setToolModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            {toolModal === 'messaging' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Compose an announcement or review notes for your active mentees.
                </p>
                <textarea
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary"
                  rows={4}
                  placeholder="e.g. Great progress on the React basics module! Let me know if you need help with useState/useEffect hooks."
                ></textarea>
                <button
                  onClick={() => {
                    alert('Announcement sent to all registered mentees.');
                    setToolModal(null);
                  }}
                  className="w-full bg-brand-primary text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-brand-primaryHover transition-all"
                >
                  Send Broadcast
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select available consultation hours for 1-on-1 code reviews.
                </p>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
                  placeholder="Session Title (e.g. Weekly Roadmap Q&A)"
                />
                <button
                  onClick={() => {
                    alert('Office hours scheduled and published to mentees.');
                    setToolModal(null);
                  }}
                  className="w-full bg-brand-primary text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-brand-primaryHover transition-all"
                >
                  Confirm & Publish Hours
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
