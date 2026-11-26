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
  CalendarCheck,
  BookOpen,
  Mail,
  Sparkles
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
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-4 xl:px-6">
        <div className="flex items-center justify-between h-20 gap-1.5 lg:gap-2">
          
          {/* Brand Logo */}
          <Link to="/" onClick={() => scrollToSection('top')} className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0 py-1">
            <img 
              src="/logo.png" 
              alt="Beacon Bridge Academics" 
              className="h-12 sm:h-14 lg:h-15 w-auto max-h-[60px] object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation Links — Streamlined, Balanced & Scalable */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-[#001f3f]/85">
            <Link
              to="/"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              About Us
            </Link>
            <Link
              to="/curriculum"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Curriculum
            </Link>
            <Link
              to="/book-consultation"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="hidden 2xl:inline">Book a </span>Free Consultation
            </Link>
            <Link
              to="/how-it-works"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              How It Works
            </Link>
            <Link
              to="/blog"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Blog
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              FAQ
            </button>
            <Link
              to="/contact"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Contact Us
            </Link>
            <Link
              to="/apply-to-teach"
              className="px-1.5 xl:px-2.5 py-1.5 rounded-lg text-emerald-700 hover:text-[#050167] hover:bg-[#40ffa7]/15 active:text-[#001f3f] active:scale-95 transition-all whitespace-nowrap cursor-pointer font-extrabold"
            >
              Teach With Us
            </Link>
          </nav>

          {/* Desktop Right Actions (Sign In / Register with Us / My Portal) */}
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
                  <span>Register with Us</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#001f3f] shrink-0" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Header Actions (Prominent Log In + Menu Trigger) */}
          <div className="flex items-center space-x-2 lg:hidden">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl bg-[#050167]/5 text-[#050167] font-extrabold text-xs border border-[#050167]/15 hover:bg-[#050167]/10 active:scale-95 transition-all shadow-sm"
              >
                Log In
              </Link>
            ) : (
              <Link
                to={getDashboardPath()}
                className="px-2.5 py-1.5 rounded-xl bg-[#050167] text-white font-bold text-xs shadow-sm"
              >
                Portal
              </Link>
            )}
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
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <Home className="w-4 h-4 text-[#050167]" />
              <span>Home</span>
            </Link>
            <Link
              to="/book-consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Book a Free Consultation</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <GraduationCap className="w-4 h-4 text-[#050167]" />
              <span>About Us</span>
            </Link>
            <Link
              to="/curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <Video className="w-4 h-4 text-[#050167]" />
              <span>Curriculum (KS2, KS3, GCSE &amp; A-Level)</span>
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <HelpCircle className="w-4 h-4 text-[#050167]" />
              <span>How It Works</span>
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Blog & Event Flyers</span>
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] flex items-center gap-2.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#050167]" />
              <span>Frequently Asked Questions</span>
            </button>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] hover:text-[#050167] active:scale-95 flex items-center gap-2.5"
            >
              <Mail className="w-4 h-4 text-[#050167]" />
              <span>Contact Us</span>
            </Link>
            <Link
              to="/apply-to-teach"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#f0faff] text-emerald-800 font-bold flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Teach With Us</span>
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
                  <span>Register with Us</span>
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
