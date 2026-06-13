import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, BookOpen, Layers, User, Award, CheckCircle, Clock } from 'lucide-react';

// 1. Roadmap Listing Page
export function RoadmapListingPage() {
  const navigate = useNavigate();
  const roadmaps = [
    { id: 'frontend', title: 'Frontend Engineering', count: '18 Steps', level: 'Beginner to Advanced' },
    { id: 'backend', title: 'Backend Engineering', count: '22 Steps', level: 'Intermediate to Advanced' },
    { id: 'ai', title: 'Artificial Intelligence & Data', count: '15 Steps', level: 'Intermediate to Expert' },
    { id: 'mobile', title: 'Mobile Engineering', count: '14 Steps', level: 'Beginner to Advanced' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Available Roadmaps</h1>
        <p className="text-slate-500 mb-8 max-w-xl">
          Structured learning tracks designed to take you from core concepts to production-ready architectural patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((r) => (
            <div 
              key={r.id}
              onClick={() => navigate(`/roadmaps/${r.id}`)}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-350 cursor-pointer transition-all flex justify-between items-center group"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-primary transition-colors">{r.title}</h3>
                <div className="flex gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {r.count}</span>
                  <span>•</span>
                  <span>{r.level}</span>
                </div>
              </div>
              <span className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-brand-primary/10 flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                &rarr;
              </span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 2. Roadmap Detail Page
export function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const modules = [
    { num: 1, title: 'Foundational Principles', duration: '2 weeks', lessons: ['Introduction & Environment Setup', 'Basic Paradigms & Configurations'] },
    { num: 2, title: 'Core Architectural Concepts', duration: '3 weeks', lessons: ['Data Flow & State Lifecycle', 'Component Design Patterns'] },
    { num: 3, title: 'Advanced Production Scaling', duration: '4 weeks', lessons: ['Performance Tuning & Memory Caching', 'Integration Testing & Code Quality Tools'] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-grow text-left">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-6"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Layers size={14} />
            <span>Learning Track</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize mb-3">
            {id ? `${id} Engineering` : 'Technology Roadmap'}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            This roadmap outlines all competencies, practices, and technologies required to become a professional, high-performance engineer in this discipline.
          </p>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-4">Roadmap Curriculum</h3>
        <div className="space-y-4">
          {modules.map((m) => (
            <div key={m.num} className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">Module {m.num}: {m.title}</h4>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock size={12} /> {m.duration}</span>
              </div>
              <ul className="space-y-3">
                {m.lessons.map((lesson, idx) => (
                  <li 
                    key={idx}
                    onClick={() => navigate(`/roadmaps/${id || 'track'}/steps/${m.num}-${idx + 1}`)}
                    className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                  >
                    <span className="text-xs font-medium text-slate-700">{lesson}</span>
                    <span className="text-xs font-semibold text-brand-primary hover:underline">Start &rarr;</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 3. Step Detail Page
export function StepDetailPage() {
  const { id, stepId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12 w-full flex-grow text-left">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-6"
        >
          <ArrowLeft size={14} /> Back to Roadmap
        </button>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/20">
              Step {stepId || '1-1'}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" /> Complete
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Implementing Scalable Modules & Clean Architecture
          </h1>

          <div className="prose prose-slate max-w-none text-slate-500 text-sm leading-relaxed space-y-4">
            <p>
              In this module step, we review standard modularization practices, separation of concerns, and clean abstraction layers.
            </p>
            <h3 className="font-bold text-slate-800 text-base mt-6">Core Objectives</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Understand strict data-layer vs display-layer abstraction boundaries.</li>
              <li>Learn to minimize component coupling using container-presenter models.</li>
              <li>Configure robust performance caching thresholds.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6 flex justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="border border-slate-200 text-slate-600 font-semibold px-5 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-md transition-all"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 4. Profile Page
export function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="max-w-xl mx-auto px-6 py-12 w-full flex-grow text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Your Profile</h1>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center font-display text-2xl font-bold shadow-md">
              {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{currentUser?.name || 'Guest User'}</h2>
              <p className="text-xs font-semibold text-slate-400 capitalize">{currentUser?.role || 'Visitor'}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Email Address:</span>
              <span className="text-slate-800 font-semibold">{currentUser?.email || 'N/A'}</span>
            </div>
            {currentUser?.role === 'Learner' && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Learning Focus:</span>
                  <span className="text-slate-800 font-semibold">{currentUser?.path || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Skill Level:</span>
                  <span className="text-slate-800 font-semibold">{currentUser?.level || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
