import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  TrendingUp,
  BookOpen,
  Award,
  CheckCircle2,
  Video,
  PlayCircle,
  Clock,
  Sparkles,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const ParentProgress = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await api.get('/parent/children');
        if (res.data.success) {
          const list = res.data.children || [];
          setChildren(list);
          if (list.length > 0 && !selectedChildId) {
            setSelectedChildId(list[0].student.id);
          }
        }
      } catch (err) {
        console.error('Failed to load parent progress', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Progress & Watched Classes</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed syllabus tracking, live attendance records, and lecture recordings watched by your linked children
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">Loading progress data...</div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">No student accounts linked yet.</div>
        ) : (
          children.map((child) => (
            <div key={child.student.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
              
              {/* Student Header & Quick Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={child.student.avatar_url}
                    alt={child.student.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#050167] shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{child.student.full_name}</h3>
                    <span className="text-xs text-slate-500">{child.relationship} &bull; {child.student.email}</span>
                  </div>
                </div>

                {/* Overall Attendance Metric Pill */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Live Attendance Rate</span>
                    <span className="text-lg font-black text-emerald-800">
                      {(child.watch_stats?.total_held || 0) > 0
                        ? `${child.watch_stats.overall_rate}% Attended`
                        : 'No sessions yet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Course Syllabus Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#050167]" />
                    <span>Enrolled Course Syllabus Progress</span>
                  </h4>
                  <span className="text-xs text-slate-400">{child.enrollments?.length || 0} active courses</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {child.enrollments?.map((enr) => (
                    <div key={enr.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#050167] uppercase tracking-wider">
                            {enr.course?.level || 'Intermediate'}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 mt-0.5">{enr.course?.title}</h5>
                        </div>
                        <span className="text-xs font-black text-[#050167] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {enr.progress_pct || 0}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${enr.progress_pct || 0}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                        <span>
                          {enr.assigned_tutor ? (
                            <strong className="text-emerald-700">Tutor: {enr.assigned_tutor.full_name}</strong>
                          ) : (
                            <strong className="text-amber-700">Tutor will be assigned soon.</strong>
                          )}
                        </span>
                        <span>Enrolled: {new Date(enr.enrolled_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Watched Classes & Lesson Recordings Progress Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span>Class Session Watch & Attendance Tracking</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Live attendance verified via classroom sockets; recordings marked as watched upon review
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {child.watch_stats?.total_watched || 0} / {child.watch_stats?.total_held || 0} Done
                    </span>
                  </div>
                </div>

                {(!child.watchedClasses || child.watchedClasses.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No completed class sessions recorded yet for this student. As live lectures take place, attendance and recording watch metrics will appear here.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Class Lecture & Subject</th>
                          <th className="py-3 px-4">Tutor</th>
                          <th className="py-3 px-4">Date & Duration</th>
                          <th className="py-3 px-4">Watch / Attendance Status</th>
                          <th className="py-3 px-4 text-right">Completion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                        {child.watchedClasses.map((cls) => (
                          <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                  <span>{cls.title}</span>
                                  <span className="block text-[10px] font-medium text-slate-400">{cls.course_title}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {cls.tutor_name}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                              <div>{new Date(cls.scheduled_at).toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-400">{cls.duration_minutes} mins</div>
                            </td>
                            <td className="py-3.5 px-4">
                              {cls.watch_status === 'live_attended' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Attended Live Class</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{cls.status_label || 'Did Not Attend'}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="font-extrabold text-slate-900">
                                {cls.watch_percentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
