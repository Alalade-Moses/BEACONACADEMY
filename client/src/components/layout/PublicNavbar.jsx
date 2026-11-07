import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Sparkles,
  Users
} from 'lucide-react';

export const PublicNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 via-indigo-600 to-brand-500 bg-clip-text text-transparent">
                EduLearn
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider block text-slate-400">
                Global Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="/#courses" className="hover:text-brand-600 transition-colors">Courses</a>
            <a href="/#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="/#virtual-classroom" className="hover:text-brand-600 transition-colors flex items-center gap-1.5">
              <Video className="w-4 h-4 text-brand-600" />
              <span>Virtual Classroom</span>
            </a>
            <a href="/#tutors" className="hover:text-brand-600 transition-colors">Tutors</a>
            <a href="/#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="/#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold text-sm transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Portal ({user.role})</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-rose-600 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-brand-600 font-semibold text-sm transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium text-slate-600">
            <a href="/#courses" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Courses</a>
            <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Features</a>
            <a href="/#virtual-classroom" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Virtual Classroom</a>
            <a href="/#tutors" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">Tutors</a>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">How It Works</a>
            <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-600">FAQ</a>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-brand-600 text-white font-semibold"
              >
                Go to {user.role} Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
