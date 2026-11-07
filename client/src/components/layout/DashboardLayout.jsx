import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  FileText,
  Calendar,
  CheckCircle2,
  Film,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  UserCheck,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout, login } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Switch role test helper
  const handleQuickRoleSwitch = async (targetRole) => {
    setRoleSwitcherOpen(false);
    const testAccounts = {
      superadmin: { email: 'admin@edulearn.com', password: 'Password123!' },
      tutor: { email: 'dr.sarah@edulearn.com', password: 'Password123!' },
      student: { email: 'alex.morgan@edulearn.com', password: 'Password123!' },
      parent: { email: 'david.morgan@edulearn.com', password: 'Password123!' }
    };

    const creds = testAccounts[targetRole];
    if (creds) {
      try {
        await login(creds.email, creds.password);
        navigate(`/${targetRole}/dashboard`);
      } catch (err) {
        console.error('Role switch failed', err);
      }
    }
  };

  // Nav items per role
  const getNavItems = () => {
    switch (user?.role) {
      case 'superadmin':
        return [
          { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Courses & Programs', path: '/admin/courses', icon: BookOpen },
          { name: 'Classes & Monitoring', path: '/admin/classes', icon: Video },
          { name: 'Announcements', path: '/admin/announcements', icon: Bell },
          { name: 'Audit & Security Logs', path: '/admin/audit-logs', icon: Activity },
          { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'tutor':
        return [
          { name: 'Tutor Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Courses', path: '/tutor/courses', icon: BookOpen },
          { name: 'Schedule Live Classes', path: '/tutor/classes', icon: Calendar },
          { name: 'Learning Materials', path: '/tutor/materials', icon: FileText },
          { name: 'Class Attendance', path: '/tutor/attendance', icon: UserCheck },
          { name: 'Session Recordings', path: '/tutor/recordings', icon: Film },
        ];
      case 'student':
        return [
          { name: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'My Enrolled Courses', path: '/student/courses', icon: BookOpen },
          { name: 'Live Classes & Schedule', path: '/student/classes', icon: Video },
          { name: 'Course Materials', path: '/student/materials', icon: FileText },
          { name: 'Recorded Lessons', path: '/student/recordings', icon: Film },
          { name: 'My Attendance History', path: '/student/attendance', icon: CheckCircle2 },
        ];
      case 'parent':
        return [
          { name: 'Parent Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Linked Children', path: '/parent/students', icon: Users },
          { name: 'Attendance Records', path: '/parent/attendance', icon: CheckCircle2 },
          { name: 'Academic Progress', path: '/parent/progress', icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return { label: 'Super Admin', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'tutor':
        return { label: 'Tutor / Educator', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'student':
        return { label: 'Student', bg: 'bg-brand-100 text-brand-800 border-brand-200' };
      case 'parent':
        return { label: 'Parent / Guardian', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">EduLearn</span>
              <span className="text-xs font-semibold uppercase tracking-wider block text-brand-600">
                Portal
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Current Role</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${roleBadge.bg}`}>
              {roleBadge.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate">{user?.email}</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== `/${user?.role}/dashboard` && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Classroom Quick Launch Tile */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-brand-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center space-x-2 text-brand-300 text-xs font-semibold mb-2 uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Classroom</span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Live Interactive Session</h4>
          <p className="text-xs text-slate-300 mb-3">Join or test the synchronized classroom with live whiteboard & slides.</p>
          <Link
            to="/classroom/ROOM-CS101-LIVE"
            className="w-full inline-flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all shadow-md"
          >
            <span>Launch Live Class</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* User Signout footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'U')}`}
              alt={user?.full_name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
              <p className="text-[11px] text-slate-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-800 capitalize">
                {user?.role} Portal
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Welcome back, {user?.full_name}
              </p>
            </div>
          </div>

          {/* Right: Role Switcher, Notifications, Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Quick Role Switcher for Test & Evaluation */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Switch Portal View</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Active Persona:
                  </div>
                  {[
                    { role: 'superadmin', name: 'Marcus Sterling', label: 'Super Administrator' },
                    { role: 'tutor', name: 'Dr. Sarah Jenkins', label: 'Tutor / Educator' },
                    { role: 'student', name: 'Alex Morgan', label: 'Student' },
                    { role: 'parent', name: 'David Morgan', label: 'Parent' },
                  ].map((p) => (
                    <button
                      key={p.role}
                      onClick={() => handleQuickRoleSwitch(p.role)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-brand-50 flex items-center justify-between ${user?.role === p.role ? 'bg-brand-50/70 font-semibold text-brand-700' : 'text-slate-700'}`}
                    >
                      <div>
                        <div className="font-medium">{p.label}</div>
                        <div className="text-[10px] text-slate-400">{p.name}</div>
                      </div>
                      {user?.role === p.role && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} unread)</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications to display.
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) markAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3 ${!n.is_read ? 'bg-brand-50/40' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-brand-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 truncate">{n.title}</h5>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <img
                  src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'U')}`}
                  alt={user?.full_name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Public Website
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
