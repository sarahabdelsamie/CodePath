import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Layout, Database, Cpu, Smartphone, BookOpen, Users, Trophy, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const pathways = [
    {
      id: 'frontend',
      title: 'Frontend',
      description: 'Master React, Vue, and modern CSS architecture.',
      icon: Layout,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      id: 'backend',
      title: 'Backend',
      description: 'Scale systems with Node, Python, and microservices.',
      icon: Database,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      id: 'ai',
      title: 'Artificial Intelligence',
      description: 'Build LLMs, RAG applications, and predictive models.',
      icon: Cpu,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
    },
    {
      id: 'mobile',
      title: 'Mobile',
      description: 'Create native experiences with Swift and Kotlin.',
      icon: Smartphone,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
  ];

  const features = [
    {
      title: 'Interactive Roadmaps',
      description: 'Follow visual, step-by-step pathways curated by senior engineers from leading companies.',
      icon: BookOpen,
      iconColor: 'text-brand-primary',
      iconBg: 'bg-brand-primary/10',
    },
    {
      title: 'Expert Mentorship',
      description: 'Connect with experienced industry professionals for 1-on-1 calls, reviews, and guidance.',
      icon: Users,
      iconColor: 'text-brand-accent',
      iconBg: 'bg-brand-accent/10',
    },
    {
      title: 'Verified Milestones',
      description: 'Earn shares, badges, and professional certificates as you complete modules and capstone projects.',
      icon: Trophy,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 text-left space-y-6">
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
            Structured Learning for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-violet-600">
              High-Performance
            </span>{' '}
            Teams
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-xl">
            Master modern technology stacks with curated roadmaps, interactive learning, and expert mentorship. Elevate your engineering skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:-translate-y-0.5 text-center"
            >
              Start Your Path
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('curriculum');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 transition-all hover:-translate-y-0.5 text-center"
            >
              Explore Roadmaps
            </button>
          </div>
        </div>

        {/* Hero Workstation Mockup */}
        <div className="lg:col-span-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-violet-500/10 rounded-2xl blur-3xl -z-10"></div>
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xl bg-white p-2.5">
            <img
              src="/hero_mockup.png"
              alt="CodePath Premium Workspace Setup"
              className="w-full h-auto rounded-xl object-cover aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Curriculum (Explore Core Pathways) Section */}
      <section id="curriculum" className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-display font-bold text-xs uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            Curriculum
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Explore Core Pathways
          </h2>
          <p className="text-slate-500">
            Select a pathway to begin your journey. Each route is tailored to guide you from foundational concepts to advanced production techniques.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.id}
                onClick={() => navigate('/register')}
                className="group cursor-pointer bg-white border border-slate-200/60 rounded-2xl p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${path.bgColor} flex items-center justify-center mb-5 border ${path.borderColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${path.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {path.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {path.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-primary mt-6 group-hover:gap-2 transition-all">
                  <span>Start Learning</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-brand-accent bg-brand-accent/15 px-3 py-1 rounded-full">
              Features
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white">
              Why Engineers Choose CodePath
            </h2>
            <p className="text-slate-400">
              An ecosystem designed around practical challenges, industry feedback, and structured career progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-8 text-left hover:border-slate-700/80 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
