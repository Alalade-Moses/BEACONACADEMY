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

  const [faqActive, setFaqActive] = useState(false);

  // Scroll header state + scroll-spy for the on-page FAQ anchor
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (location.pathname === '/') {
        const faq = document.getElementById('faq');
        if (faq) {
          const rect = faq.getBoundingClientRect();
          setFaqActive(rect.top <= 140 && rect.bottom > 140);
          return;
        }
      }
      setFaqActive(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Which top-level tab is currently active
  const isActive = (key) => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    if (key === 'faq') return path === '/' && faqActive;
    if (key === '/') return path === '/' && !faqActive;
    if (key === '/book-consultation' && (path === '/consultation' || path.startsWith('/consultation/'))) return true;
    if (key === '/apply-to-teach' && (path === '/tutor/apply' || path.startsWith('/tutor/apply/'))) return true;
    if (key === '/register' && (path === '/ielts-registration' || path.startsWith('/register/'))) return true;
    return path === key || path.startsWith(key + '/');
  };

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

  const navItems = [
    { key: '/', to: '/', label: <>Home</>, icon: Home, iconClass: 'text-[#050167]' },
    { key: '/about', to: '/about', label: <>About Us</>, icon: GraduationCap, iconClass: 'text-[#050167]' },
    { key: '/curriculum', to: '/curriculum', label: <>Curriculum</>, mobileLabel: 'Curriculum (KS2, KS3, GCSE & A-Level)', icon: Video, iconClass: 'text-[#050167]' },
    { key: '/book-consultation', to: '/book-consultation', label: <><span className="hidden 2xl:inline">Book a </span>Free Consultation</>, mobileLabel: 'Book a Free Consultation', icon: CalendarCheck, iconClass: 'text-emerald-600' },
    { key: '/how-it-works', to: '/how-it-works', label: <>How It Works</>, icon: HelpCircle, iconClass: 'text-[#050167]' },
    { key: '/blog', to: '/blog', label: <>Blog</>, mobileLabel: 'Blog & Event Flyers', icon: BookOpen, iconClass: 'text-purple-600' },
    { key: 'faq', anchor: 'faq', label: <>FAQ</>, mobileLabel: 'Frequently Asked Questions', icon: HelpCircle, iconClass: 'text-[#050167]' },
    { key: '/contact', to: '/contact', label: <>Contact Us</>, icon: Mail, iconClass: 'text-[#050167]' },
    { key: '/apply-to-teach', to: '/apply-to-teach', label: <>Teach With Us</>, icon: Sparkles, iconClass: 'text-emerald-600', accent: true }
  ];

  const desktopItemClass = (item) => {
    const active = isActive(item.key);
    const base = 'relative px-1.5 xl:px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer active:scale-95';
    const underline = "after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[#050167]";
    if (active) return `${base} ${underline} text-[#050167] bg-[#40ffa7]/25 font-extrabold`;
    return `${base} ${item.accent ? 'text-emerald-700 font-extrabold' : ''} hover:text-[#050167] hover:bg-[#40ffa7]/15`;
  };

  const mobileItemClass = (item) => {
    const active = isActive(item.key);
    const base = 'w-full text-left py-2.5 px-3 rounded-xl flex items-center gap-2.5 cursor-pointer active:scale-95 transition-colors border-l-4';
    if (active) return `${base} bg-[#40ffa7]/20 border-[#050167] text-[#050167] font-extrabold`;
    return `${base} border-transparent hover:bg-[#f0faff] hover:text-[#050167] ${item.accent ? 'text-emerald-800 font-bold' : ''}`;
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
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-[#001f3f]/85" aria-label="Primary">
            {navItems.map((item) =>
              item.anchor ? (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToSection(item.anchor)}
                  aria-current={isActive(item.key) ? 'page' : undefined}
                  className={desktopItemClass(item)}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={(e) => {
                    if (item.key === '/' && location.pathname === '/') {
                      e.preventDefault();
                      scrollToSection('top');
                    }
                  }}
                  aria-current={isActive(item.key) ? 'page' : undefined}
                  className={desktopItemClass(item)}
                >
                  {item.label}
                </Link>
              )
            )}
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
                  aria-current={isActive('/login') ? 'page' : undefined}
                  className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl active:scale-95 font-bold text-xs xl:text-sm transition-colors whitespace-nowrap shrink-0 ${
                    isActive('/login')
                      ? 'bg-[#40ffa7]/25 text-[#050167] ring-1 ring-[#050167]/25 font-extrabold'
                      : 'text-[#001f3f] hover:text-[#050167] hover:bg-[#f0faff]'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  aria-current={isActive('/register') ? 'page' : undefined}
                  className={`inline-flex items-center space-x-1.5 px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs xl:text-sm transition-all shadow-md shadow-[#40ffa7]/25 hover:shadow-lg hover:shadow-[#40ffa7]/35 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive('/register') ? 'ring-2 ring-[#050167] ring-offset-1' : ''
                  }`}
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
                aria-current={isActive('/login') ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border active:scale-95 transition-all shadow-sm ${
                  isActive('/login')
                    ? 'bg-[#40ffa7]/30 text-[#050167] border-[#050167]'
                    : 'bg-[#050167]/5 text-[#050167] border-[#050167]/15 hover:bg-[#050167]/10'
                }`}
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
          <nav className="flex flex-col space-y-1 font-semibold text-sm text-[#001f3f]" aria-label="Mobile primary">
            {[navItems[0], navItems[3], navItems[1], navItems[2], navItems[4], navItems[5], navItems[6], navItems[7], navItems[8]].map((item) => {
              const Icon = item.icon;
              const text = item.mobileLabel || item.label;
              return item.anchor ? (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToSection(item.anchor)}
                  aria-current={isActive(item.key) ? 'page' : undefined}
                  className={mobileItemClass(item)}
                >
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                  <span>{text}</span>
                </button>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (item.key === '/' && location.pathname === '/') {
                      e.preventDefault();
                      scrollToSection('top');
                    }
                  }}
                  aria-current={isActive(item.key) ? 'page' : undefined}
                  className={mobileItemClass(item)}
                >
                  <Icon className={`w-4 h-4 ${item.iconClass}`} />
                  <span>{text}</span>
                </Link>
              );
            })}
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
                  aria-current={isActive('/login') ? 'page' : undefined}
                  className={`w-full text-center py-2.5 rounded-xl border-2 font-bold text-sm transition-colors whitespace-nowrap ${
                    isActive('/login')
                      ? 'border-[#050167] bg-[#40ffa7]/20 text-[#050167] font-extrabold'
                      : 'border-[#050167]/20 text-[#001f3f] hover:border-[#050167]'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive('/register') ? 'page' : undefined}
                  className={`w-full text-center py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm shadow-lg shadow-[#40ffa7]/30 whitespace-nowrap flex items-center justify-center space-x-2 ${
                    isActive('/register') ? 'ring-2 ring-[#050167] ring-offset-1' : ''
                  }`}
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
