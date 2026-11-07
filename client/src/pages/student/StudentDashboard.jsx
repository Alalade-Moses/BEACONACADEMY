import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Video,
  Clock,
  Play,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [enrRes, clsRes, matRes] = await Promise.all([
          api.get('/courses/user/my-enrollments'),
          api.get('/classes'),
          api.get('/materials')
        ]);

        if (enrRes.data.success) setEnrollments(enrRes.data.enrollments);
        if (clsRes.data.success) setClasses(clsRes.data.classes);
        if (matRes.data.success) setMaterials(matRes.data.materials.slice(0, 4));
      } catch (err) {
        console.error('Failed to load student data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchStudentData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingClasses = classes.filter(c => c.status === 'scheduled' || c.status === 'live');
  const liveClass = classes.find(c => c.status === 'live');

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, {user.full_name}</h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Stay on track with your upcoming live classes, lecture presentations, and course modules.
          </p>
        </div>

        {/* Live Class Immediate Entry Card */}
        {liveClass ? (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <div>
                <h4 className="font-bold text-sm text-white">Your Class is LIVE NOW: {liveClass.title}</h4>
                <p className="text-xs text-slate-300">Tutor: {liveClass.tutor?.full_name}</p>
              </div>
            </div>
            <Link
              to={`/classroom/${liveClass.meeting_room_id}`}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Join Live Classroom</span>
            </Link>
          </div>
        ) : upcomingClasses.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-brand-300" />
              <div>
                <h4 className="font-bold text-xs text-white">Next Session: {upcomingClasses[0].title}</h4>
                <p className="text-[11px] text-slate-300">{new Date(upcomingClasses[0].scheduled_at).toLocaleString()}</p>
              </div>
            </div>
            <Link
              to={`/classroom/${upcomingClasses[0].meeting_room_id}`}
              className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs"
            >
              Ready Room
            </Link>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{enrollments.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Sessions</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{upcomingClasses.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Progress</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {enrollments.length > 0 
                  ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_pct || 0), 0) / enrollments.length)
                  : 0}%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Courses & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Course Progress</h3>
              <p className="text-xs text-slate-500">Track your academic completion and syllabus milestones</p>
            </div>
            <Link to="/student/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {enrollments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                You are not enrolled in any courses yet.{' '}
                <Link to="/student/courses" className="font-bold text-brand-600">Browse Course Catalog</Link>
              </div>
            ) : (
              enrollments.map((enr) => (
                <div key={enr.id} className="p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{enr.course?.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tutor: {enr.course?.tutor?.full_name || 'Assigned Instructor'}</p>
                    <div className="mt-3 flex items-center space-x-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${enr.progress_pct || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{enr.progress_pct || 0}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Learning Materials */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Lecture Materials</h3>
            <Link to="/student/materials" className="text-xs font-bold text-brand-600">All</Link>
          </div>

          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="overflow-hidden flex-1">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{m.title}</h5>
                  <p className="text-[11px] text-slate-400 capitalize">{m.file_type} File</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
