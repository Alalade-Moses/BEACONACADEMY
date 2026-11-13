import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../api/axios';
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
  UserCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  CreditCard,
  CheckSquare,
  Globe,
  Eye,
  ShieldCheck,
  User,
  Edit2,
  Trash2
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout, login, updateUser } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [portalSwitcherOpen, setPortalSwitcherOpen] = useState(false);

  // Profile Edit Modal State
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.put('/auth/profile', profileFormData);
      if (res.data.success && res.data.user && updateUser) {
        updateUser(res.data.user);
        setEditProfileModalOpen(false);
      }
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setProfileSaving(false);
    }
  };

  // Determine active portal view
  const getPortalInfo = () => {
    if (location.pathname.startsWith('/tutor')) {
      return { role: 'tutor', title: 'Educator & Faculty Portal', badge: 'Tutor / Educator View' };
    }
    if (location.pathname.startsWith('/student')) {
      return { role: 'student', title: 'Student Learning Portal', badge: 'Student View' };
    }
    if (location.pathname.startsWith('/parent')) {
      return { role: 'parent', title: 'Parent & Guardian Portal', badge: 'Parent View' };
    }
    return { role: 'superadmin', title: 'Super Administrator Hub', badge: 'Super Admin' };
  };

  const portalInfo = getPortalInfo();

  // Nav items per active view
  const getNavItems = () => {
    const roleToUse = user?.role === 'superadmin' ? portalInfo.role : user?.role;
    switch (roleToUse) {
      case 'superadmin':
        return [
          { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Tuition & Verification', path: '/admin/payments', icon: CreditCard },
          { name: 'Tutor Applications', path: '/admin/tutor-applications', icon: GraduationCap },
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
          { name: 'Assignments & Grading', path: '/tutor/assignments', icon: CheckSquare },
          { name: 'Assigned Courses', path: '/tutor/courses', icon: BookOpen },
          { name: 'Schedule Live Classes', path: '/tutor/classes', icon: Calendar },
          { name: 'Learning Materials', path: '/tutor/materials', icon: FileText },
          { name: 'Class Attendance', path: '/tutor/attendance', icon: UserCheck },
          { name: 'Session Recordings', path: '/tutor/recordings', icon: Film },
        ];
      case 'student':
        return [
          { name: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Coursework & Deadlines', path: '/student/assignments', icon: CheckSquare },
          { name: 'My Enrolled Courses', path: '/student/courses', icon: BookOpen },
          { name: 'Live Classes & Schedule', path: '/student/classes', icon: Video },
          { name: 'Course Materials', path: '/student/materials', icon: FileText },
          { name: 'Recorded Lessons', path: '/student/recordings', icon: Film },
          { name: 'My Attendance History', path: '/student/attendance', icon: CheckCircle2 },
        ];
      case 'parent':
        return [
          { name: 'Parent Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Child Assignments & Alerts', path: '/parent/assignments', icon: CheckSquare },
          { name: 'Tuition & Payment Proof', path: '/parent/payments', icon: CreditCard },
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
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-72 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">Beacon Bridge</span>
              <span className="text-[10px] font-bold uppercase tracking-wider block text-sky-600">
                Academics Portal
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
        <div className="px-5 py-2 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Current Role</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${roleBadge.bg}`}>
              {roleBadge.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
        </div>

        {/* Administrator Delegated Portal Mode Banner */}
        {user?.role === 'superadmin' && portalInfo.role !== 'superadmin' && (
          <div className="p-2.5 mx-3 mt-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Admin Delegated Mode
              </span>
              <span className="text-[9px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded-full uppercase">
                {portalInfo.role}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 mb-2">
              Inspecting {portalInfo.title} as Super Administrator.
            </p>
            <Link
              to="/admin/dashboard"
              className="w-full py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>&larr; Return to Admin Hub</span>
            </Link>
          </div>
        )}

        {/* Nav Links (Sleek, No-Scroll Proportions) */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto no-scrollbar scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== `/${user?.role}/dashboard` && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Signout footer */}
        <div className="p-3 px-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'U')}`}
              alt={user?.full_name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.full_name}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 z-30">
          
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {portalInfo.title}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Welcome back, <span className="font-semibold text-slate-700">{user?.full_name}</span>
              </p>
            </div>
          </div>

          {/* Right: Portal Switcher, Main Website, Notifications, Profile */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            
            {/* Portal Switcher for Super Administrator Only */}
            {user?.role === 'superadmin' && (
              <div className="relative">
                <button
                  onClick={() => setPortalSwitcherOpen(!portalSwitcherOpen)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition-colors shadow-sm active:scale-95"
                  title="Switch Portal Views"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Switch Portal View</span>
                  <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                {portalSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Institutional Portals:
                    </div>
                    {[
                      { path: '/admin/dashboard', label: 'Super Administrator Hub', desc: 'Tuition verification & system settings', icon: ShieldCheck },
                      { path: '/tutor/dashboard', label: 'Educator & Faculty Portal', desc: 'Classes, slides, attendance grading', icon: GraduationCap },
                      { path: '/student/dashboard', label: 'Student Learning Portal', desc: 'Course progress, materials & timetable', icon: BookOpen },
                      { path: '/parent/dashboard', label: 'Parent & Guardian Portal', desc: 'Child monitoring, tuition proof & logs', icon: Users }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isCurrent = (portalInfo.role === 'superadmin' && item.path.startsWith('/admin')) ||
                                        (portalInfo.role !== 'superadmin' && location.pathname.startsWith(item.path.replace('/dashboard', '')));
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            setPortalSwitcherOpen(false);
                            navigate(item.path);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs hover:bg-indigo-50/70 flex items-start space-x-2.5 transition-colors ${
                            isCurrent ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-[10px] text-slate-400">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Direct Link to Main Public Website */}
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
              title="Return to Main Website"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Main Website</span>
            </Link>

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
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          Mark read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-slate-400 hover:text-rose-600 font-medium"
                          title="Clear all notifications"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
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
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start space-x-3 group relative ${!n.is_read ? 'bg-brand-50/40' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-brand-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0 pr-6">
                            <h5 className="text-xs font-bold text-slate-800 truncate">{n.title}</h5>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="absolute right-3 top-3 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete this notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setEditProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Profile Details</span>
                  </button>
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
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 border-t border-slate-100 mt-1 pt-1.5"
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

      {/* Edit Profile Modal */}
      {editProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                Edit Profile Details
              </h3>
              <button 
                onClick={() => setEditProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Administrator Title *
                </label>
                <input
                  type="text"
                  required
                  value={profileFormData.full_name}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g. Elena Rostova or Platform Administrator"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={profileFormData.phone}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+44 20 7946 0912"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institutional Bio / Title Notes
                </label>
                <textarea
                  rows={3}
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Lead System Director for Beacon Bridge Academics..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
