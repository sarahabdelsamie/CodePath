import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Award, MessageSquare, ChevronRight, Play, ExternalLink } from 'lucide-react';

export default function LearnerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Custom metadata based on user's path selection
  const getPathDetails = (userPath) => {
    const defaultDetails = {
      title: 'Advanced Frontend Engineering',
      module: 'Module 4: State Management & Architecture Patterns',
      lesson: 'Implementing Redux Saga',
      progress: 65,
    };

    switch (userPath) {
      case 'Backend':
        return {
          title: 'Advanced Backend Engineering',
          module: 'Module 5: Distributed Caching & Message Queues',
          lesson: 'Configuring Redis Pub/Sub',
          progress: 42,
        };
      case 'AI':
        return {
          title: 'Advanced AI & Data Engineering',
          module: 'Module 3: Neural Networks & Transformers',
          lesson: 'Fine-tuning GPT-4 with Custom Datasets',
          progress: 28,
        };
      case 'Mobile':
        return {
          title: 'Advanced Mobile Engineering',
          module: 'Module 4: SwiftUI State & Lifecycle Management',
          lesson: 'Integrating Swift Combine with CoreData',
          progress: 50,
        };
      case 'Frontend':
      default:
        return defaultDetails;
    }
  };

  const pathDetails = getPathDetails(currentUser?.path);

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

  const activities = [
    {
      type: 'lesson',
      text: 'Completed lesson Context API Deep Dive',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    },
    {
      type: 'badge',
      text: 'Earned badge React Hooks Master',
      time: 'Yesterday',
      icon: Award,
      iconColor: 'text-brand-primary bg-indigo-50 border-indigo-100',
    },
    {
      type: 'discussion',
      text: 'Replied to discussion in Performance Optimization',
      time: '2 days ago',
      icon: MessageSquare,
      iconColor: 'text-slate-500 bg-slate-50 border-slate-100',
    },
  ];

  // SVG ring math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pathDetails.progress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Greetings */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
            Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex'}
          </h1>
          <p className="text-slate-400 text-sm">Here is your learning progress for today.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Roadmap & Recommendations (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Roadmap Card */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-4 text-left flex-1">
                <div className="flex items-center gap-1.5 text-brand-primary font-bold text-xs uppercase tracking-widest">
                  <span>&lt;&gt;</span>
                  <span>Active Roadmap</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {pathDetails.title}
                </h2>
                
                <p className="text-slate-400 text-sm font-medium">
                  {pathDetails.module}
                </p>

                {/* Lesson Info Pill */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs flex items-center justify-between gap-4">
                  <span className="text-slate-400 font-medium">Current Lesson:</span>
                  <span className="text-slate-800 font-semibold truncate">{pathDetails.lesson}</span>
                </div>

                <button 
                  onClick={() => navigate('/roadmaps/' + (currentUser?.path?.toLowerCase() || 'frontend'))}
                  className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <Play size={14} className="fill-white" />
                  <span>Continue Learning</span>
                </button>
              </div>

              {/* Progress Circle Visual */}
              <div className="relative flex items-center justify-center shrink-0 w-36 h-36">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Outer circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active progress path */}
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
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-display text-slate-800 leading-none">
                    {pathDetails.progress}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    Completed
                  </span>
                </div>
              </div>

            </div>

            {/* Recommended Next Paths Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Recommended Next Paths</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold">
                    &lt;
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold">
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
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
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
          <div className="lg:col-span-4 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-900">Recent Activity</h3>
              <Link to="/roadmaps" className="text-xs font-semibold text-brand-primary hover:text-brand-primaryHover">
                View All
              </Link>
            </div>

            <div className="space-y-5">
              {activities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex gap-3 text-left">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${act.iconColor}`}>
                      <Icon size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-slate-800 leading-normal">{act.text}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{act.time}</p>
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
