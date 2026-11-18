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

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'Admin') return '/admin';
    if (currentUser.role === 'Mentor') return '/mentor-dashboard';
    return '/dashboard';
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
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Explore
            </Link>
            <Link
              to="/roadmaps"
              className={`text-sm font-medium transition-colors ${isActive('/roadmaps') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Roadmaps
            </Link>
            {currentUser && (
              <Link
                to={getDashboardPath()}
                className={`text-sm font-medium transition-colors ${isActive(getDashboardPath())
                    ? 'text-brand-primary font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {currentUser.role === 'Admin' ? 'Admin Portal' : 'Dashboard'}
              </Link>
            )}
            {currentUser && (
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors ${isActive('/profile') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Profile
              </Link>
            )}
            {currentUser && (
              <Link
                to="/settings"
                className={`text-sm font-medium transition-colors ${isActive('/settings') ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Settings
              </Link>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div
                className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-2 pr-3 py-1 rounded-full cursor-pointer hover:bg-slate-100 transition-all"
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold font-display shadow-sm ${currentUser.role === 'Admin' ? 'bg-red-500' : currentUser.role === 'Mentor' ? 'bg-purple-600' : 'bg-brand-primary'
                  }`}>
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
