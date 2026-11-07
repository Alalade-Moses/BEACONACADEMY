import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await api.get('/parent/children');
        if (res.data.success) {
          setChildren(res.data.children || []);
        }
      } catch (err) {
        console.error('Failed to load linked children', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeChild = children[selectedChildIndex];

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Parent & Guardian Oversight Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, {user.full_name}</h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Monitor your children's live virtual classroom schedules, attendance records, and academic progress with full transparency.
          </p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Student Accounts Linked Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Link your child's student account to monitor upcoming classes, live attendance, and course completions.
          </p>
          <Link
            to="/parent/students"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Link Student Account Now</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Child Selector Tabs */}
          {children.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Select Child:</span>
              {children.map((c, idx) => (
                <button
                  key={c.student.id}
                  onClick={() => setSelectedChildIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 ${
                    selectedChildIndex === idx 
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={c.student.avatar_url} alt={c.student.full_name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{c.student.full_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Child Overview Metrics */}
          {activeChild && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{activeChild.enrollments?.length || 0}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Classes</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{activeChild.upcomingClasses?.length || 0}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Compliance</p>
                      <h3 className="text-2xl font-black text-emerald-600 mt-1">100% Present</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Child Courses & Schedules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Enrolled Courses */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Enrolled Courses & Progress</h3>
                    <Link to="/parent/progress" className="text-xs font-bold text-amber-600">Details</Link>
                  </div>

                  <div className="space-y-4">
                    {activeChild.enrollments?.map((enr) => (
                      <div key={enr.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{enr.course?.title}</h4>
                          <span className="text-xs font-bold text-amber-700">{enr.progress_pct || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full"
                            style={{ width: `${enr.progress_pct || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Upcoming Live Lectures</h3>
                    <Link to="/parent/attendance" className="text-xs font-bold text-amber-600">Attendance Log</Link>
                  </div>

                  <div className="space-y-3">
                    {activeChild.upcomingClasses?.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        No upcoming classes scheduled this week.
                      </div>
                    ) : (
                      activeChild.upcomingClasses?.map((cls) => (
                        <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{cls.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {new Date(cls.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                            {cls.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
