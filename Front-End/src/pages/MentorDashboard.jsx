import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Calendar, MessageSquare, ShieldCheck, ChevronRight, User } from 'lucide-react';

export default function MentorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Active Mentees',
      value: '8',
      trend: '+2 this week',
      icon: Users,
      iconColor: 'text-brand-primary bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Roadmaps Followed',
      value: '12',
      trend: 'Across 4 paths',
      icon: BookOpen,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Mentor Rating',
      value: '4.9',
      trend: 'Top 5% on platform',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  const mentees = [
    {
      name: 'Alex Johnson',
      path: 'Frontend Engineering',
      progress: 46,
      avatarInitials: 'AJ',
    },
    {
      name: 'Emily Chen',
      path: 'Backend Architecture',
      progress: 72,
      avatarInitials: 'EC',
    },
    {
      name: 'Michael Jordan',
      path: 'Artificial Intelligence',
      progress: 15,
      avatarInitials: 'MJ',
    },
  ];

  const tools = [
    {
      title: 'Messaging',
      desc: 'Secure communication with your mentees directly within the platform.',
      icon: MessageSquare,
      status: 'Coming Soon',
    },
    {
      title: 'Session Scheduling',
      desc: 'Coordinate and manage 1-on-1 mentorship sessions effortlessly.',
      icon: Calendar,
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1 font-display">
            Welcome back, {currentUser?.name || 'Mentor Sarah'}
          </h1>
          <p className="text-slate-400 text-sm">Here's an overview of your mentorship activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
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
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block mt-2">
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
            <h3 className="font-display font-bold text-lg text-slate-900">Your Mentees</h3>

            <div className="space-y-4">
              {mentees.map((mentee, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  {/* Mentee Profile */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-200/50">
                      {mentee.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{mentee.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{mentee.path}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-semibold">Progress</span>
                      <span className="text-slate-800 font-bold">{mentee.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                        style={{ width: `${mentee.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={() => navigate('/roadmaps/frontend')}
                    className="border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all shrink-0"
                  >
                    View Roadmap
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mentor Tools (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-900">Mentor Tools</h3>

            <div className="space-y-4">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 border border-slate-200/50 flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200/30">
                        {tool.status}
                      </span>
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs">{tool.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{tool.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
