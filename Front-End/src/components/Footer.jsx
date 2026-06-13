import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight block mb-3">
              Code<span className="text-brand-primary">Path</span>
            </span>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Empowering ambitious professionals with intelligent, navigational learning roadmaps for modern technology stacks.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/roadmaps" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">Roadmaps</Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">Mentorship</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-brand-primary transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; 2024 CodePath Platform. Empowering high-performance learning.
          </p>
          <div className="flex gap-4">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Privacy</Link>
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Terms</Link>
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
