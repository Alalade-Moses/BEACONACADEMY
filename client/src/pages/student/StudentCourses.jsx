import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import {
  BookOpen,
  Clock,
  GraduationCap
} from 'lucide-react';

export const StudentCourses = () => {
  const socket = useSocket();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const enrRes = await api.get('/courses/user/my-enrollments');
      if (enrRes.data.success) {
        setEnrollments(enrRes.data.enrollments || []);
      }
    } catch (err) {
      console.error('Failed to load enrolled courses', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  useEffect(() => {
    if (!socket) return;
    socket.on('tutor_assigned', fetchEnrollments);
    return () => {
      socket.off('tutor_assigned', fetchEnrollments);
    };
  }, [socket, fetchEnrollments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Enrolled Courses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Courses you are enrolled in along with your assigned tutor
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold self-start sm:self-auto">
          <BookOpen className="w-4 h-4" />
          <span>{enrollments.length} Enrolled {enrollments.length === 1 ? 'Course' : 'Courses'}</span>
        </span>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs">Loading your enrolled courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Enrolled Courses Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your enrolled programme will appear here once your registration and tuition verification are completed by admissions.
            </p>
          </div>
        ) : (
          enrollments.map((enr) => (
            <div key={enr.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  {enr.course?.thumbnail_url ? (
                    <img src={enr.course.thumbnail_url} alt={enr.course?.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-400">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {enr.course?.level && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[11px] font-semibold text-white">
                      {enr.course.level}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">
                    {enr.course?.category?.name || 'Enrolled Programme'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {enr.course?.title}
                  </h3>
                  {enr.course_track && (
                    <p className="text-xs font-semibold text-indigo-700 mb-2">Track: {enr.course_track}</p>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {enr.course?.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Progress</span>
                      <span className="font-bold text-brand-700">{enr.progress_pct || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${enr.progress_pct || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Assigned Tutor Footer */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                {enr.assigned_tutor ? (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={
                          enr.assigned_tutor.avatar_url ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(enr.assigned_tutor.full_name)}`
                        }
                        alt={enr.assigned_tutor.full_name}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Assigned Tutor
                        </span>
                        <span className="text-slate-900 font-bold truncate block">
                          {enr.assigned_tutor.full_name}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] shrink-0">
                      Assigned
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">Your tutor will be assigned soon.</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
