import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, BookOpen, CheckCircle, Clock, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function StepDetailPage() {
  const { id: roadmapUrlId, stepId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Local checklist for exercises
  const [checkedExercises, setCheckedExercises] = useState({});

  useEffect(() => {
    fetchStepAndProgress();
  }, [stepId]);

  const fetchStepAndProgress = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Step Details
      const response = await fetch(`${API_BASE}/steps/${stepId}`);
      const sData = await response.json();

      if (!sData.success || !sData.data) {
        setError(sData.message || 'Learning step not found.');
        setLoading(false);
        return;
      }

      const stepObj = sData.data;
      setStep(stepObj);

      // 2. Fetch User Progress to see if this step is already completed
      const token = localStorage.getItem('codepath_token');
      if (token && stepObj.roadmapId) {
        const progressResponse = await fetch(`${API_BASE}/progress/${stepObj.roadmapId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const pData = await progressResponse.json();
        if (pData.success && pData.data) {
          const completedList = pData.data.completedSteps || [];
          const stepCompleted = completedList.some(
            (id) => id.toString() === stepId.toString()
          );
          setCompleted(stepCompleted);
          setProgressPercentage(pData.data.progressPercentage || 0);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('codepath_token');
      if (!token) {
        setError('You must be logged in to mark steps as complete.');
        setSubmitting(false);
        return;
      }

      const response = await fetch(`${API_BASE}/progress/${step.roadmapId}/complete/${stepId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setCompleted(true);
        if (resData.data) {
          setProgressPercentage(resData.data.progressPercentage || 0);
        }
        // After successful completion, go back to the roadmap detail page
        setTimeout(() => {
          navigate(`/roadmaps/${step.roadmapId || roadmapUrlId}`);
        }, 1200);
      } else {
        setError(resData.message || 'Failed to update progress.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to communicate completion status.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExercise = (idx) => {
    setCheckedExercises(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-20 w-full flex-grow flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-semibold text-sm">Loading lesson content...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !step) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-20 w-full flex-grow text-center">
          <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto space-y-4 text-center">
            <AlertCircle size={36} className="text-red-500" />
            <h3 className="font-bold text-slate-800">Error Loading Lesson</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Back to Roadmap
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

      <main className="max-w-3xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Back link */}
        <button
          onClick={() => navigate(`/roadmaps/${step?.roadmapId || roadmapUrlId}`)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Roadmap Details</span>
        </button>

        {/* Step Core Module */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-3.5 py-1.5 rounded-full border border-brand-primary/15 shrink-0">
              Lesson {step.order}
            </span>

            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-medium">Roadmap Progress:</span>
                <span className="text-brand-primary text-xs font-extrabold">{progressPercentage}%</span>
              </div>

              {completed ? (
                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <CheckCircle size={14} className="stroke-[2.5]" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/50">
                  <Clock size={14} />
                  <span>In Progress</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-primary h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight leading-tight">
            {step.title}
          </h1>

          {/* Content Body */}
          <div className="prose prose-slate max-w-none text-slate-500 text-sm sm:text-base leading-relaxed space-y-4 pt-3.5 border-t border-slate-100">
            <p className="whitespace-pre-line text-slate-600 leading-relaxed font-medium">
              {step.content}
            </p>
          </div>

          {/* Resources links list */}
          {step.resources && step.resources.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3.5 text-left">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-brand-primary" />
                <span>Reference Resources</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {step.resources.map((link, idx) => {
                  let href = link;
                  if (!link.startsWith('http://') && !link.startsWith('https://')) {
                    href = `https://${link}`;
                  }

                  // Clean label
                  let label = link.replace('https://', '').replace('http://', '').replace('www.', '');
                  if (label.length > 30) label = label.slice(0, 27) + '...';

                  return (
                    <li key={idx}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 hover:bg-brand-primary/[0.02] hover:border-brand-primary/30 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-primary transition-all group"
                      >
                        <span className="truncate">{label}</span>
                        <ExternalLink size={13} className="text-slate-400 group-hover:text-brand-primary transition-colors shrink-0" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Exercises Checklist */}
          {step.exercises && step.exercises.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-3.5 text-left">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-brand-primary" />
                <span>Prerequisites / Exercises</span>
              </h3>
              <div className="space-y-2.5">
                {step.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleExercise(idx)}
                    className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer select-none transition-all ${checkedExercises[idx]
                        ? 'bg-slate-50/50 border-slate-200 opacity-70'
                        : 'bg-white border-slate-150 hover:border-slate-200'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedExercises[idx]}
                      onChange={() => { }} // toggling handled by div click
                      className="w-4.5 h-4.5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary/20 accent-brand-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <span className={`text-xs text-left leading-normal font-semibold ${checkedExercises[idx] ? 'line-through text-slate-400' : 'text-slate-650'}`}>
                      {ex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Submit Bar */}
          <div className="border-t border-slate-100 pt-6 mt-8 flex justify-between gap-4 items-center">
            <button
              onClick={() => navigate(`/roadmaps/${step?.roadmapId || roadmapUrlId}`)}
              className="border border-slate-200 hover:border-slate-300 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors"
            >
              Back to Stepper
            </button>

            <button
              onClick={handleMarkCompleted}
              disabled={completed || submitting}
              className={`font-bold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 ${completed
                  ? 'bg-emerald-500 text-white cursor-not-allowed shadow-none'
                  : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-md shadow-brand-primary/15 hover:shadow-lg'
                }`}
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Progress...</span>
                </>
              ) : completed ? (
                <>
                  <CheckCircle size={14} className="stroke-[2.5]" />
                  <span>Completed ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  <span>Mark Completed</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
