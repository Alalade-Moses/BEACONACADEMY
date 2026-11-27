import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { UserAvatar } from '../../components/common/UserAvatar';
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
  Sparkles,
  Zap,
  AlertCircle
} from 'lucide-react';

export const TutorDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedInstantCourseId, setSelectedInstantCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [launchingInstant, setLaunchingInstant] = useState(false);

  const isActualTutor = user?.role === 'tutor';

  const fetchTutorData = useCallback(async () => {
    try {
      const [coursesRes, assignRes, classesRes, attendanceRes] = await Promise.all([
        api.get(`/courses?tutor_id=${user.id}`).catch(() => ({ data: { success: true, courses: [] } })),
        api.get('/users/tutor-assignments').catch(() => ({ data: { success: true, assignments: [] } })),
        api.get('/classes'),
        api.get('/attendance')
      ]);

      const courseList = (coursesRes.data.success && coursesRes.data.courses) || [];
      setCourses(courseList);
      if (courseList.length > 0 && !selectedInstantCourseId) {
        setSelectedInstantCourseId(courseList[0].id);
      }
      if (assignRes.data.success) setAssignments(assignRes.data.assignments || []);
      if (classesRes.data.success) setClasses(classesRes.data.classes || []);
      if (attendanceRes.data.success) setAttendance(attendanceRes.data.records || []);
    } catch (err) {
      console.error('Failed to load tutor data', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedInstantCourseId]);

  useEffect(() => {
    if (user?.id) fetchTutorData();
  }, [user?.id, fetchTutorData]);

  useEffect(() => {
    if (!socket || !user?.id) return;
    socket.on('student_assigned', fetchTutorData);
    return () => {
      socket.off('student_assigned', fetchTutorData);
    };
  }, [socket, user?.id, fetchTutorData]);

  // Deduplicate assigned students
  const uniqueStudents = Array.from(
    new Map(
      assignments
        .filter((a) => a.student?.id)
        .map((a) => [
          a.student.id,
          {
            student: a.student,
            courses: assignments
              .filter((x) => x.student_id === a.student.id && x.course?.title)
              .map((x) => x.course.title)
          }
        ])
    ).values()
  );

  const handleStartInstantClass = async () => {
    if (!isActualTutor) {
      alert('Only assigned Tutor accounts can launch live classes.');
      return;
    }
    if (uniqueStudents.length === 0) {
      alert('No students have been assigned to you yet. Ask the Superadmin to assign students to you before starting a live class.');
      return;
    }

    try {
      setLaunchingInstant(true);
      const chosenCourse = courses.find((c) => c.id === selectedInstantCourseId) || courses[0] || null;
      const res = await api.post('/classes', {
        title: chosenCourse
          ? `Live Lesson: ${chosenCourse.title}`
          : `Live Lesson with ${user.full_name}`,
        description: 'Interactive live academic lecture session with synchronized whiteboard and voice.',
        course_id: chosenCourse?.id || null,
        isInstant: true,
        status: 'live',
        scheduled_at: new Date().toISOString(),
        duration_minutes: 60
      });
      if (res.data.success && res.data.class) {
        navigate(`/classroom/${res.data.class.meeting_room_id}?as=tutor`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start live class.');
    } finally {
      setLaunchingInstant(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingClasses = classes.filter((c) => c.status === 'scheduled' || c.status === 'live');
  const liveClass = classes.find((c) => c.status === 'live');

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
            View your assigned students, launch live interactive classes for them, upload materials, and track real attendance.
          </p>

          {!isActualTutor ? (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Preview Mode: Sign in with a real Tutor account to create and launch live classes for assigned students.</span>
            </div>
          ) : uniqueStudents.length === 0 ? (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-100 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                No students have been assigned to you yet. Once the Superadmin assigns students to your teaching roster, you will be able to launch live classes and notify them immediately.
              </span>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              {courses.length > 1 && (
                <select
                  value={selectedInstantCourseId}
                  onChange={(e) => setSelectedInstantCourseId(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-semibold outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="text-slate-900">
                      {c.title} ({c.assigned_students_count || 0} student{c.assigned_students_count === 1 ? '' : 's'})
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={handleStartInstantClass}
                disabled={launchingInstant}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>{launchingInstant ? 'Launching Live Class...' : 'Start Instant Live Class'}</span>
              </button>
              <Link
                to="/tutor/classes"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Class Schedule</span>
              </Link>
            </div>
          )}
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
              to={`/classroom/${liveClass.meeting_room_id}?as=tutor`}
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
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Students</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{uniqueStudents.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Courses</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{courses.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live / Upcoming Classes</p>
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
      </div>

      {/* Main Grid: Upcoming Classes & Assigned Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Classes List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Live & Scheduled Classes</h3>
              <p className="text-xs text-slate-500">Only students assigned to you receive alerts and join links</p>
            </div>
            {isActualTutor && uniqueStudents.length > 0 && (
              <Link to="/tutor/classes" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <span>Schedule New</span>
                <Plus className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {upcomingClasses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No upcoming classes scheduled yet.
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
                      <p className="text-xs text-slate-500 mt-0.5">{c.course?.title || 'Assigned Course'}</p>
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
                    to={`/classroom/${c.meeting_room_id}?as=tutor`}
                    className="self-end sm:self-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Enter Room</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Assigned Students + Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">My Assigned Students ({uniqueStudents.length})</h3>
            {uniqueStudents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                No students assigned yet. Students linked to you by the Superadmin will appear here.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {uniqueStudents.map(({ student, courses: stuCourses }) => (
                  <div key={student.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                    <UserAvatar
                      name={student.full_name}
                      avatarUrl={student.avatar_url}
                      role="student"
                      className="w-8 h-8 rounded-full text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{student.full_name}</p>
                      <p className="text-[11px] text-emerald-700 font-medium truncate">
                        {stuCourses.length > 0 ? stuCourses.join(', ') : student.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Teaching Toolkit</h3>
            <div className="space-y-3">
              <Link
                to="/tutor/courses"
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Assigned Courses</span>
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
