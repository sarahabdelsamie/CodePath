import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({ completedSteps: [], progressPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoadmapAndProgress();
  }, [id]);

  const fetchRoadmapAndProgress = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Roadmap Details
      const roadmapResponse = await fetch(`${API_BASE}/roadmaps/${id}`);
      const rData = await roadmapResponse.json();
      
      if (!rData.success || !rData.data) {
        setError(rData.message || 'Roadmap not found.');
        setLoading(false);
        return;
      }

      const roadmapObj = rData.data;
      setRoadmap(roadmapObj);

      // 2. Fetch User Progress (if logged in)
      const token = localStorage.getItem('codepath_token');
      if (token && roadmapObj._id) {
        const progressResponse = await fetch(`${API_BASE}/progress/${roadmapObj._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const pData = await progressResponse.json();
        if (pData.success && pData.data) {
          setProgress(pData.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed.');
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

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return difficulty;
    }
  };

  const isStepCompleted = (stepId) => {
    if (!progress || !progress.completedSteps) return false;
    return progress.completedSteps.some(
      (completedId) => completedId.toString() === stepId.toString()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-20 w-full flex-grow flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold text-sm">Loading roadmap curriculum...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-20 w-full flex-grow text-center">
          <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto space-y-4 text-center">
            <Layers size={36} className="text-red-500" />
            <h3 className="font-bold text-slate-800">Error Loading Roadmap</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{error || "The requested roadmap does not exist."}</p>
            <button 
              onClick={() => navigate('/roadmaps')}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Back to Roadmap Directory
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Back Button */}
        <button
          onClick={() => navigate('/roadmaps')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> 
          <span>Back to Roadmaps</span>
        </button>

        {/* Roadmap Hero Header */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-8 shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3.5 text-left flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-primary/25 bg-brand-primary/5 text-brand-primary uppercase tracking-wider">
                {getCategoryLabel(roadmap.category)} Track
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                {getDifficultyLabel(roadmap.difficultyLevel)}
              </span>
            </div>

            <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
              {roadmap.title}
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-normal">
              {roadmap.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1.5">
              <span className="flex items-center gap-1"><BookOpen size={14} /> {roadmap.steps ? roadmap.steps.length : 0} Steps</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={14} /> Completed {progress.completedSteps.length} of {roadmap.steps ? roadmap.steps.length : 0}</span>
            </div>
          </div>

          {/* Progress Circular visual */}
          <div className="relative shrink-0 w-28 h-28 self-center md:self-auto bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-4">
            <span className="text-2xl font-bold font-display text-brand-primary">
              {progress.progressPercentage}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 text-center">
              Roadmap Completed
            </span>
          </div>
        </div>

        {/* Stepper Timeline Curriculum */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-900 mb-6">Track Steps</h3>

          {roadmap.steps && roadmap.steps.length === 0 ? (
            <div className="bg-white border border-slate-200/50 rounded-2xl p-8 text-center space-y-2">
              <Sparkles size={28} className="text-slate-350 mx-auto animate-pulse" />
              <p className="text-slate-400 text-sm font-semibold">Under Construction</p>
              <p className="text-slate-400 text-xs font-normal">Steps will be published shortly by our engineering coordinators.</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-200/80 ml-5 pl-8 space-y-8 text-left py-2">
              {roadmap.steps.map((step, index) => {
                const completed = isStepCompleted(step._id);
                return (
                  <div key={step._id} className="relative group">
                    {/* Circle Stepper Bullet */}
                    <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-300 text-slate-400 group-hover:border-brand-primary group-hover:text-brand-primary'
                    }`}>
                      {completed ? (
                        <CheckCircle size={14} className="stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-extrabold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Card Content */}
                    <div className="bg-white border border-slate-200/50 rounded-2xl p-5 hover:shadow-md hover:border-slate-300/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-base leading-snug">
                            {step.title}
                          </h4>
                          {completed && (
                            <span className="text-[9px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs font-normal leading-relaxed truncate-3-lines">
                          {step.content}
                        </p>
                      </div>

                      {/* Launch Button */}
                      <button
                        onClick={() => navigate(`/roadmaps/${roadmap._id}/steps/${step._id}`)}
                        className={`flex items-center gap-1.5 font-semibold text-xs px-4.5 py-2.5 rounded-xl border transition-all shrink-0 justify-center ${
                          completed
                            ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            : 'bg-brand-primary border-brand-primary text-white hover:bg-brand-primaryHover shadow-sm shadow-brand-primary/10 hover:shadow-md'
                        }`}
                      >
                        {completed ? (
                          <>
                            <CheckCircle size={12} />
                            <span>Review Step</span>
                          </>
                        ) : (
                          <>
                            <Play size={10} className="fill-white" />
                            <span>Start Lesson</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
