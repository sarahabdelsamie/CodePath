import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      logout();
    }, 0);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Code<span className="text-brand-primary">Path</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Explore
            </Link>
            <Link
              to={currentUser ? (currentUser.role === 'Mentor' ? '/mentor-dashboard' : '/dashboard') : '/login'}
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard') || isActive('/mentor-dashboard')
                  ? 'text-brand-primary'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="#"
              className="text-sm font-medium text-slate-400 cursor-not-allowed hover:text-slate-400"
              onClick={(e) => e.preventDefault()}
            >
              My Paths
            </Link>
            <Link
              to="#"
              className="text-sm font-medium text-slate-400 cursor-not-allowed hover:text-slate-400"
              onClick={(e) => e.preventDefault()}
            >
              Community
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-accent rounded-full"></span>
              </button>

              {/* User Avatar */}
              <div 
                className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-2 pr-3 py-1 rounded-full cursor-pointer hover:bg-slate-100 transition-all"
                onClick={() => navigate(currentUser.role === 'Mentor' ? '/mentor-dashboard' : '/dashboard')}
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-semibold font-display shadow-sm">
                  {getInitials(currentUser.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none capitalize">{currentUser.role}</p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-brand-primary hover:bg-brand-primaryHover text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm shadow-brand-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
