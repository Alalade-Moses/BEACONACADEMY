import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  LayoutDashboard, 
  Video, 
  CreditCard,
  HelpCircle,
  Home,
  CalendarCheck
} from 'lucide-react';

export const PublicNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'superadmin' || user.role === 'admin') return '/admin/dashboard';
    return `/${user.role}/dashboard`;
  };

  // Senior Full-Stack Smooth Navigation with Exact Sticky Navbar Offset (84px)
  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        return;
      }

      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 84;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#050167]/15' 
        : 'bg-white/95 backdrop-blur-md border-b border-[#050167]/10'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between h-20 gap-1.5 lg:gap-2">
          
          {/* Brand Logo */}
          <Link to="/" onClick={() => scrollToSection('top')} className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#050167] to-[#001f3f] flex items-center justify-center text-[#40ffa7] shadow-md shadow-[#050167]/20 group-hover:scale-105 transition-transform duration-200 shrink-0 border border-[#40ffa7]/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base xl:text-lg font-black tracking-tight text-[#001f3f] leading-none group-hover:text-[#050167] transition-colors whitespace-nowrap">
                Beacon Bridge
              </span>
              <span className="text-[9px] sm:text-[10px] xl:text-xs font-extrabold uppercase tracking-widest text-[#050167] mt-0.5">
                Academics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Streamlined & Essential */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs xl:text-sm font-semibold text-[#001f3f]/85">
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('stages')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('exam-boards')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Exam Boards
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="px-2 xl:px-3 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              FAQ
            </button>
            <Link
              to="/apply-to-teach"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-emerald-700 hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer font-extrabold flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Teach With Us</span>
            </Link>
          </nav>

          {/* Desktop Right Actions (Sign In / Book a Consultation / My Portal) */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1.5 xl:space-x-2 shrink-0">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#f0faff] text-[#050167] hover:bg-[#40ffa7]/20 border border-[#050167]/15 font-bold text-xs xl:text-sm transition-all shadow-sm whitespace-nowrap shrink-0 active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span>Portal ({user.role})</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2 py-1.5 text-xs xl:text-sm text-slate-500 hover:text-rose-600 active:scale-95 transition-colors font-medium whitespace-nowrap shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 xl:space-x-2 shrink-0">
                <Link
                  to="/login"
                  className="px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[#001f3f] hover:text-[#050167] hover:bg-[#f0faff] active:scale-95 font-bold text-xs xl:text-sm transition-colors whitespace-nowrap shrink-0"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs xl:text-sm transition-all shadow-md shadow-[#40ffa7]/25 hover:shadow-lg hover:shadow-[#40ffa7]/35 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-[#001f3f] shrink-0" />
                  <span>Book a Consultation</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#001f3f] hover:text-[#050167] hover:bg-[#f0faff] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#050167]/15 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1 font-semibold text-sm text-[#001f3f]">
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-[#050167]" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95"
            >
              About Beacon Bridge Academics
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('stages')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95"
            >
              Curriculum (KS3, GCSE & A-Level)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('exam-boards')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95"
            >
              UK Exam Boards (AQA, Edexcel, OCR, WJEC)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[#050167]" />
              <span>Frequently Asked Questions</span>
            </button>
            <Link
              to="/apply-to-teach"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] text-emerald-800 font-bold flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Teach With Us (Teacher Application)</span>
            </Link>
          </nav>

          <div className="pt-4 mt-3 border-t border-[#050167]/10 flex flex-col space-y-2.5">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-[#050167] text-white font-bold text-sm shadow-md"
              >
                Go to {user.role} Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border-2 border-[#050167]/20 text-[#001f3f] font-bold text-sm hover:border-[#050167] transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm shadow-lg shadow-[#40ffa7]/30 whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
