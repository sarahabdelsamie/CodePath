import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Layers, BookOpen, AlertTriangle, Settings, ShieldCheck, 
  Trash2, Edit, Plus, CheckCircle, Search, Filter, RefreshCw, AlertCircle, 
  Save, Eye, ArrowUpRight
} from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, content, reports, settings

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [reports, setReports] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Modal / Form states
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [roadmapForm, setRoadmapForm] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficultyLevel: 'beginner'
  });

  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [selectedRoadmapForStep, setSelectedRoadmapForStep] = useState(null);
  const [stepForm, setStepForm] = useState({
    title: '',
    content: '',
    resources: '',
    exercises: '',
    order: 1
  });

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('codepath_token');
    if (!token) {
      setError('You must be logged in as an Administrator.');
      setLoading(false);
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'overview') {
        const res = await fetch(`${API_BASE}/admin/stats`, { headers });
        const data = await res.json();
        if (data.success) setStats(data.data);
        else setError(data.message);
      } else if (activeTab === 'users') {
        const query = new URLSearchParams();
        if (userRoleFilter !== 'all') query.append('role', userRoleFilter);
        if (userSearch) query.append('search', userSearch);

        const res = await fetch(`${API_BASE}/admin/users?${query.toString()}`, { headers });
        const data = await res.json();
        if (data.success) setUsers(data.data);
        else setError(data.message);
      } else if (activeTab === 'content') {
        const res = await fetch(`${API_BASE}/admin/roadmaps`, { headers });
        const data = await res.json();
        if (data.success) setRoadmaps(data.data);
        else setError(data.message);
      } else if (activeTab === 'reports') {
        const res = await fetch(`${API_BASE}/admin/reports`, { headers });
        const data = await res.json();
        if (data.success) setReports(data.data);
        else setError(data.message);
      } else if (activeTab === 'settings') {
        const res = await fetch(`${API_BASE}/admin/settings`, { headers });
        const data = await res.json();
        if (data.success) setSystemSettings(data.data);
        else setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to communicate with administration service.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(`User role changed to ${newRole}`);
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to update user role');
      }
    } catch (err) {
      setActionError('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('User deleted successfully');
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setActionError('Error deleting user');
    }
  };

  const handleSaveRoadmap = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('codepath_token');
      const url = editingRoadmap
        ? `${API_BASE}/roadmaps/${editingRoadmap._id}`
        : `${API_BASE}/roadmaps`;
      const method = editingRoadmap ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roadmapForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(editingRoadmap ? 'Roadmap updated!' : 'New roadmap published!');
        setIsRoadmapModalOpen(false);
        setEditingRoadmap(null);
        setRoadmapForm({ title: '', description: '', category: 'frontend', difficultyLevel: 'beginner' });
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to save roadmap');
      }
    } catch (err) {
      setActionError('Error saving roadmap');
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entire roadmap?")) return;
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/roadmaps/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('Roadmap deleted successfully');
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to delete roadmap');
      }
    } catch (err) {
      setActionError('Error deleting roadmap');
    }
  };

  const handleSaveStep = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('codepath_token');
      const resourcesArr = stepForm.resources
        ? stepForm.resources.split('\n').map(r => r.trim()).filter(Boolean)
        : [];
      const exercisesArr = stepForm.exercises
        ? stepForm.exercises.split('\n').map(e => e.trim()).filter(Boolean)
        : [];

      const payload = {
        title: stepForm.title,
        content: stepForm.content,
        resources: resourcesArr,
        exercises: exercisesArr,
        order: Number(stepForm.order),
        roadmapId: selectedRoadmapForStep._id
      };

      const res = await fetch(`${API_BASE}/steps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('Learning step created and attached to roadmap!');
        setIsStepModalOpen(false);
        setStepForm({ title: '', content: '', resources: '', exercises: '', order: 1 });
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to create step');
      }
    } catch (err) {
      setActionError('Error creating learning step');
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(`Report status updated to ${newStatus}`);
        fetchInitialData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to update report');
      }
    } catch (err) {
      setActionError('Error updating report status');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('codepath_token');
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(systemSettings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess('System configuration saved successfully!');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError(data.message || 'Failed to save settings');
      }
    } catch (err) {
      setActionError('Error saving platform settings');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow text-left">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>Super Administrator Portal</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-slate-400 text-sm">
              Manage system metrics, learners, mentors, educational roadmaps, and moderation.
            </p>
          </div>

          <button
            onClick={() => fetchInitialData()}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all self-start md:self-auto shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh View</span>
          </button>
        </div>

        {/* Global Action Messages */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs font-bold">
            <AlertCircle size={16} className="text-red-600" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Layers },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'content', label: 'Roadmap Curriculum', icon: BookOpen },
            { id: 'reports', label: 'Reports & Violations', icon: AlertTriangle },
            { id: 'settings', label: 'System Configuration', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-semibold text-xs">Loading administrative records...</p>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {!loading && activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                  <Users size={18} className="text-brand-primary" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 font-display">{stats.totalUsers}</h3>
                <div className="flex gap-2 text-[11px] font-semibold text-slate-400 mt-2">
                  <span>{stats.learnerCount} learners</span>
                  <span>•</span>
                  <span>{stats.mentorCount} mentors</span>
                  <span>•</span>
                  <span>{stats.adminCount} admins</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Roadmaps & Steps</span>
                  <BookOpen size={18} className="text-purple-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 font-display">{stats.totalRoadmaps}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-2">
                  {stats.totalSteps} learning modules published
                </p>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Lesson Completions</span>
                  <CheckCircle size={18} className="text-emerald-500" />
                </div>
                <h3 className="text-3xl font-extrabold text-emerald-600 font-display">{stats.totalCompletedSteps}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-2">
                  Across {stats.totalProgressRecords} active enrollments
                </p>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
                  <AlertTriangle size={18} className="text-amber-500" />
                </div>
                <h3 className="text-3xl font-extrabold text-amber-600 font-display">{stats.pendingReportsCount}</h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-2">
                  Items requiring administrative review
                </p>
              </div>
            </div>

            {/* Category Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-900">Track Engagement & Roadmaps</h3>
                <div className="space-y-4">
                  {stats.categoryStats && stats.categoryStats.map(cat => (
                    <div key={cat.category} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm capitalize">{cat.category} Engineering</h4>
                        <span className="text-xs text-slate-400">{cat.roadmaps} roadmaps published</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-brand-primary">{cat.learners}</span>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Enrolled Learners</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Recent Registrations</h3>
                <div className="divide-y divide-slate-100">
                  {stats.recentUsers && stats.recentUsers.map(u => (
                    <div key={u._id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize bg-slate-50 border-slate-200 text-slate-600">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {!loading && activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Role Filter Bar */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="learner">Learners</option>
                  <option value="mentor">Mentors</option>
                  <option value="admin">Admins</option>
                </select>

                <button
                  onClick={fetchInitialData}
                  className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primaryHover transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200/50 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">User Name</th>
                      <th className="py-3.5 px-6">Email Address</th>
                      <th className="py-3.5 px-6">Current Role</th>
                      <th className="py-3.5 px-6">Focus / Level</th>
                      <th className="py-3.5 px-6">Joined Date</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">
                          No users match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                          <td className="py-4 px-6">{u.email}</td>
                          <td className="py-4 px-6">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold capitalize text-slate-800 focus:outline-none"
                            >
                              <option value="learner">Learner</option>
                              <option value="mentor">Mentor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-6 capitalize">
                            {u.role === 'learner' ? `${u.learningPath || 'general'} (${u.skillLevel || 'beginner'})` : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTENT MANAGEMENT (ROADMAPS & STEPS) */}
        {!loading && activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-xl text-slate-900">Engineering Curriculum Tracks</h2>
              <button
                onClick={() => {
                  setEditingRoadmap(null);
                  setRoadmapForm({ title: '', description: '', category: 'frontend', difficultyLevel: 'beginner' });
                  setIsRoadmapModalOpen(true);
                }}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <Plus size={15} />
                <span>Create New Roadmap</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {roadmaps.map((r) => (
                <div key={r._id} className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider bg-indigo-50 border-indigo-100 text-indigo-600">
                          {r.category}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
                          {r.difficultyLevel}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">{r.title}</h3>
                      <p className="text-slate-400 text-xs mt-1">{r.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedRoadmapForStep(r);
                          setStepForm({
                            title: '',
                            content: '',
                            resources: '',
                            exercises: '',
                            order: (r.steps?.length || 0) + 1
                          });
                          setIsStepModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <Plus size={13} />
                        <span>Add Step</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingRoadmap(r);
                          setRoadmapForm({
                            title: r.title,
                            description: r.description,
                            category: r.category,
                            difficultyLevel: r.difficultyLevel
                          });
                          setIsRoadmapModalOpen(true);
                        }}
                        className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
                        title="Edit Roadmap"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteRoadmap(r._id)}
                        className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl"
                        title="Delete Roadmap"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Steps preview */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Modules & Steps ({r.steps?.length || 0}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {r.steps && r.steps.map((st) => (
                        <div key={st._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                          <span className="text-[10px] font-bold text-brand-primary block">Step {st.order}</span>
                          <h5 className="font-bold text-slate-800 text-xs truncate mt-0.5">{st.title}</h5>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {st.resources?.length || 0} resources • {st.exercises?.length || 0} exercises
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & VIOLATIONS */}
        {!loading && activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-slate-900">Moderation & User Violation Reports</h2>
            <div className="bg-white border border-slate-200/50 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Reporter</th>
                    <th className="py-3.5 px-6">Target Category</th>
                    <th className="py-3.5 px-6">Report Subject & Reason</th>
                    <th className="py-3.5 px-6">Reported At</th>
                    <th className="py-3.5 px-6 text-right">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        No reports logged on platform.
                      </td>
                    </tr>
                  ) : (
                    reports.map(rep => (
                      <tr key={rep._id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{rep.reporterName}</p>
                          <p className="text-[10px] text-slate-400">{rep.reporterEmail}</p>
                        </td>
                        <td className="py-4 px-6 uppercase font-bold text-[10px] text-brand-primary">
                          {rep.targetType}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800">{rep.targetTitle}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{rep.reason}</p>
                          {rep.resolutionNotes && (
                            <p className="text-[10px] text-emerald-600 mt-1 italic">Resolution: {rep.resolutionNotes}</p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(rep.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={rep.status}
                            onChange={(e) => handleUpdateReportStatus(rep._id, e.target.value)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold capitalize text-slate-800 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIGURATION & SETTINGS */}
        {!loading && activeTab === 'settings' && systemSettings && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
            <h2 className="font-display font-bold text-xl text-slate-900">Platform System Configuration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={systemSettings.platformName || ''}
                  onChange={(e) => setSystemSettings({ ...systemSettings, platformName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Support Contact Email
                </label>
                <input
                  type="email"
                  value={systemSettings.supportEmail || ''}
                  onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Default Learning Track
                </label>
                <select
                  value={systemSettings.defaultLearningPath || 'frontend'}
                  onChange={(e) => setSystemSettings({ ...systemSettings, defaultLearningPath: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="ai">AI</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Max Mentees / Mentor
                </label>
                <input
                  type="number"
                  value={systemSettings.maxMenteesPerMentor || 15}
                  onChange={(e) => setSystemSettings({ ...systemSettings, maxMenteesPerMentor: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Announcement Banner Broadcast
              </label>
              <input
                type="text"
                value={systemSettings.announcementBanner || ''}
                onChange={(e) => setSystemSettings({ ...systemSettings, announcementBanner: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemSettings.allowUserRegistration ?? true}
                  onChange={(e) => setSystemSettings({ ...systemSettings, allowUserRegistration: e.target.checked })}
                  className="w-4 h-4 text-brand-primary rounded accent-brand-primary cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">Allow Open User Registration</span>
              </label>

              <button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primaryHover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Save size={14} />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* ROADMAP MODAL */}
        {isRoadmapModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="font-display font-bold text-xl text-slate-900">
                {editingRoadmap ? 'Edit Career Roadmap' : 'Create New Career Roadmap'}
              </h3>
              <form onSubmit={handleSaveRoadmap} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Roadmap Title
                  </label>
                  <input
                    type="text"
                    required
                    value={roadmapForm.title}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, title: e.target.value })}
                    placeholder="e.g. Full-Stack Cloud Architecture"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={roadmapForm.description}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, description: e.target.value })}
                    placeholder="Detailed overview of technical competencies covered..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={roadmapForm.category}
                      onChange={(e) => setRoadmapForm({ ...roadmapForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="ai">AI</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={roadmapForm.difficultyLevel}
                      onChange={(e) => setRoadmapForm({ ...roadmapForm, difficultyLevel: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsRoadmapModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    {editingRoadmap ? 'Save Changes' : 'Create Roadmap'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP MODAL */}
        {isStepModalOpen && selectedRoadmapForStep && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                  Attaching to: {selectedRoadmapForStep.title}
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                  Add Learning Step
                </h3>
              </div>

              <form onSubmit={handleSaveStep} className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Step Title
                    </label>
                    <input
                      type="text"
                      required
                      value={stepForm.title}
                      onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                      placeholder="e.g. Redux Toolkit & Asynchronous State"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Order #
                    </label>
                    <input
                      type="number"
                      required
                      value={stepForm.order}
                      onChange={(e) => setStepForm({ ...stepForm, order: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Step Content & Objectives
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={stepForm.content}
                    onChange={(e) => setStepForm({ ...stepForm, content: e.target.value })}
                    placeholder="Comprehensive explanation and breakdown of the lesson..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-primary"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Reference URLs (One per line)
                  </label>
                  <textarea
                    rows="2"
                    value={stepForm.resources}
                    onChange={(e) => setStepForm({ ...stepForm, resources: e.target.value })}
                    placeholder="https://react.dev&#10;https://redux-toolkit.js.org"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hands-on Exercises (One per line)
                  </label>
                  <textarea
                    rows="2"
                    value={stepForm.exercises}
                    onChange={(e) => setStepForm({ ...stepForm, exercises: e.target.value })}
                    placeholder="Build a shopping cart with Redux&#10;Write unit tests for state slices"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsStepModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Add Learning Step
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
