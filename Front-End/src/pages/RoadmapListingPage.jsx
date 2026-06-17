import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Search, Filter, AlertCircle, Layers } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

export default function RoadmapListingPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchRoadmaps();
  }, [selectedCategory, selectedDifficulty]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'all') {
        queryParams.append('category', selectedCategory);
      }
      if (selectedDifficulty !== 'all') {
        queryParams.append('difficultyLevel', selectedDifficulty);
      }

      const response = await fetch(`${API_BASE}/roadmaps?${queryParams.toString()}`);
      const resData = await response.json();
      
      if (resData.success) {
        setRoadmaps(resData.data);
      } else {
        setError(resData.message || 'Failed to fetch roadmaps');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Local filtering for search text
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const matchesSearch = 
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'frontend': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'backend': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ai': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'mobile': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow text-left">
        {/* Header Section */}
        <div className="mb-10 text-left max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight mb-3">
            Available Learning Tracks
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Follow structured, verified roadmaps designed to take you from foundational concepts to production-level systems and architectures.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks by keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="ai">AI & Data</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            {/* Difficulty Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-semibold"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-semibold text-sm">Loading learning tracks...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center text-center max-w-md mx-auto my-10 space-y-3">
            <AlertCircle size={36} className="text-red-500" />
            <h3 className="font-bold text-slate-800">Connection Error</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
            <button 
              onClick={fetchRoadmaps}
              className="bg-brand-primary hover:bg-brand-primaryHover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all mt-2"
            >
              Retry
            </button>
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200/50 rounded-2xl p-12 text-center max-w-md mx-auto my-10 space-y-3">
            <Layers size={36} className="text-slate-350 mx-auto" />
            <h3 className="font-bold text-slate-800">No Roadmaps Found</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              No learning tracks match your criteria. Try adjusting your query keywords or category filters.
            </p>
          </div>
        ) : (
          /* Roadmap Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                onClick={() => navigate(`/roadmaps/${roadmap._id}`)}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-slate-300/80 cursor-pointer transition-all duration-300 flex flex-col justify-between text-left group hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Category and Difficulty badges */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeColor(roadmap.category)}`}>
                      {getCategoryLabel(roadmap.category)}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 uppercase tracking-wider">
                      {getDifficultyLabel(roadmap.difficultyLevel)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-slate-800 leading-snug group-hover:text-brand-primary transition-colors">
                    {roadmap.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    {roadmap.description}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <BookOpen size={15} />
                    <span>{roadmap.steps ? roadmap.steps.length : 0} steps</span>
                  </span>
                  
                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    <span>Start Track</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
