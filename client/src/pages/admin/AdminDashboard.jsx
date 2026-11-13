import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Users,
  GraduationCap,
  BookOpen,
  Video,
  CreditCard,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pendingAppsCount, setPendingAppsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, classesRes, logsRes, appsRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/classes'),
          api.get('/audit-logs'),
          api.get('/tutor-applications').catch(() => ({ data: { applications: [] } }))
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (classesRes.data.success) setClasses(classesRes.data.classes || []);
        if (logsRes.data.success) setLogs(logsRes.data.logs.slice(0, 5));
        if (appsRes.data?.success) {
          const pending = (appsRes.data.applications || []).filter(a => a.status === 'pending' || a.status === 'under_review').length;
          setPendingAppsCount(pending);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: 'Active Tutors', value: stats?.totalTutors || 0, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'Parent Accounts', value: stats?.totalParents || 0, icon: ShieldCheck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Total Courses', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: 'Live / Scheduled Classes', value: `${stats?.activeClasses || 0} / ${stats?.scheduledClasses || 0}`, icon: Video, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Gross Platform Revenue', value: `£${(stats?.revenue || 0).toLocaleString()} GBP`, icon: CreditCard, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Institutional System Overview</h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Monitor real-time active classes, audit logs, enrolled students, tutor activities, and platform health globally.
          </p>
        </div>
      </div>

      {/* Pending Teacher Applications Notice */}
      {pendingAppsCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {pendingAppsCount} Teacher Application{pendingAppsCount > 1 ? 's' : ''} Awaiting Superadmin Video Evaluation
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                New educators have submitted 3-minute video introductions and signed UK safeguarding agreements.
              </p>
            </div>
          </div>
          <Link
            to="/admin/tutor-applications"
            className="px-4 py-2 bg-[#001f3f] hover:bg-[#050167] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center shrink-0"
          >
            Review & Evaluate Applications &rarr;
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ongoing & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Classes Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Virtual Classes Live & Scheduled</h3>
              <p className="text-xs text-slate-500">Monitor active rooms, tutors, and start times</p>
            </div>
            <Link to="/admin/classes" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Class Title</th>
                  <th className="py-3 px-4">Assigned Tutor</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {classes.slice(0, 4).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.tutor?.full_name || 'Dr. Sarah Jenkins'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(c.scheduled_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.status === 'live' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {c.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/classroom/${c.meeting_room_id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold text-xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Trail Snippet */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Security Audit Trail</h3>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3.5">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px]">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] truncate">By: {log.user_email || 'System'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/admin/audit-logs"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <span>View Full Audit Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
