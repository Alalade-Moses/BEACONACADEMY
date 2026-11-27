import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserPlus,
  PlayCircle
} from 'lucide-react';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [children, setChildren] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  useEffect(() => {
    if (!socket) return;
    socket.on('live_class_started', fetchChildren);
    socket.on('class_scheduled', fetchChildren);
    socket.on('tutor_assigned', fetchChildren);
    return () => {
      socket.off('live_class_started', fetchChildren);
      socket.off('class_scheduled', fetchChildren);
      socket.off('tutor_assigned', fetchChildren);
    };
  }, [socket, fetchChildren]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeChild = children[selectedChildIndex];
  const hasHeldClasses = (activeChild?.watch_stats?.total_held || 0) > 0;

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
            Monitor your child&apos;s enrolled courses, assigned tutor, live classroom schedule, and verified attendance.
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
            Link your child&apos;s student account to monitor their assigned tutor, live classes, and attendance records.
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
                  <img
                    src={c.student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.student.full_name)}`}
                    alt={c.student.full_name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{c.student.full_name}</span>
                </button>
              ))}
            </div>
          )}

          {activeChild && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live / Upcoming Classes</p>
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
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classes Attended</p>
                      <h3 className="text-2xl font-black text-[#050167] mt-1">
                        {activeChild.attendance?.length || 0}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f0faff] border border-[#050167]/20 text-[#050167] flex items-center justify-center">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</p>
                      <h3 className="text-xl font-black text-emerald-600 mt-1">
                        {hasHeldClasses ? `${activeChild.watch_stats.overall_rate}%` : 'No sessions yet'}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrolled Courses & Assigned Tutor */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Enrolled Courses & Assigned Tutor</h3>
                    <Link to="/parent/progress" className="text-xs font-bold text-amber-600">Details</Link>
                  </div>

                  <div className="space-y-4">
                    {(!activeChild.enrollments || activeChild.enrollments.length === 0) ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        No enrolled courses found for {activeChild.student.full_name} yet.
                      </div>
                    ) : (
                      activeChild.enrollments.map((enr) => (
                        <div key={enr.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{enr.course?.title}</h4>
                            <span className="text-xs font-bold text-amber-700">{enr.progress_pct || 0}%</span>
                          </div>
                          {enr.assigned_tutor ? (
                            <p className="text-[11px] font-semibold text-emerald-700">
                              Assigned Tutor: {enr.assigned_tutor.full_name}
                            </p>
                          ) : (
                            <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Tutor will be assigned soon.</span>
                            </p>
                          )}
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-600 h-full rounded-full"
                              style={{ width: `${enr.progress_pct || 0}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Live & Upcoming Lectures</h3>
                    <Link to="/parent/attendance" className="text-xs font-bold text-amber-600">Attendance Log</Link>
                  </div>

                  <div className="space-y-3">
                    {(!activeChild.upcomingClasses || activeChild.upcomingClasses.length === 0) ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        No live or upcoming classes scheduled right now.
                      </div>
                    ) : (
                      activeChild.upcomingClasses.map((cls) => (
                        <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{cls.title}</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              Tutor: {cls.tutor?.full_name} &bull; {new Date(cls.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                            cls.status === 'live' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-800'
                          }`}>
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
