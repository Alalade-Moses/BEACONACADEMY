import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Users,
  Video,
  Clock,
  Calendar,
  Play,
  Plus,
  FileText,
  UserCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TutorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const [coursesRes, classesRes, attendanceRes] = await Promise.all([
          api.get(`/courses?tutor_id=${user.id}`),
          api.get('/classes'),
          api.get('/attendance')
        ]);

        if (coursesRes.data.success) setCourses(coursesRes.data.courses);
        if (classesRes.data.success) setClasses(classesRes.data.classes);
        if (attendanceRes.data.success) setAttendance(attendanceRes.data.records);
      } catch (err) {
        console.error('Failed to load tutor data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchTutorData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingClasses = classes.filter(c => c.status === 'scheduled' || c.status === 'live');
  const liveClass = classes.find(c => c.status === 'live');

  return (
    <div className="space-y-8">
      
      {/* Welcome & Live Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Educator & Faculty Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, {user.full_name}</h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Manage your academic courses, launch real-time interactive lectures with slide annotations, and track student attendance.
          </p>
        </div>

        {liveClass && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />
              <div>
                <h4 className="font-bold text-sm text-white">Live Session Active Now: {liveClass.title}</h4>
                <p className="text-xs text-slate-300">Room: {liveClass.meeting_room_id}</p>
              </div>
            </div>
            <Link
              to={`/classroom/${liveClass.meeting_room_id}`}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Enter Classroom Now</span>
            </Link>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Courses</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{courses.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Classes</p>
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
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Logs</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{attendance.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {classes.filter(c => c.status === 'completed').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Classes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Classes List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Live Class Schedule</h3>
              <p className="text-xs text-slate-500">Live lessons with synchronized presentations and whiteboard</p>
            </div>
            <Link to="/tutor/classes" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <span>Schedule New</span>
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingClasses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No upcoming classes scheduled. Click Schedule New to set up your next live lesson.
              </div>
            ) : (
              upcomingClasses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 font-bold">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.course?.title || 'General Curriculum'}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(c.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(c.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({c.duration_minutes} min)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/classroom/${c.meeting_room_id}`}
                    className="self-end sm:self-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Room</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Teaching Toolkit</h3>
            <div className="space-y-3">
              <Link
                to="/tutor/courses"
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Manage Courses</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/tutor/materials"
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Upload Presentation Slides</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/tutor/attendance"
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">View Attendance Records</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
