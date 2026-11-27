import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  BookOpen,
  Video,
  Clock,
  Play,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  X,
  AlertCircle,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cameraTestOpen, setCameraTestOpen] = useState(false);

  // Device Test State
  const [testStream, setTestStream] = useState(null);
  const [testVideoActive, setTestVideoActive] = useState(true);
  const [testMicActive, setTestMicActive] = useState(true);
  const [testCameraError, setTestCameraError] = useState(null);
  const testVideoRef = useRef(null);

  const fetchStudentData = useCallback(async () => {
    try {
      const [enrRes, clsRes, matRes] = await Promise.all([
        api.get('/courses/user/my-enrollments'),
        api.get('/classes'),
        api.get('/materials')
      ]);

      if (enrRes.data.success) setEnrollments(enrRes.data.enrollments || []);
      if (clsRes.data.success) setClasses(clsRes.data.classes || []);
      if (matRes.data.success) setMaterials((matRes.data.materials || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to load student data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) fetchStudentData();
  }, [user?.id, fetchStudentData]);

  // Real-time refresh when the student's assigned tutor starts/schedules/ends a class or is assigned
  useEffect(() => {
    if (!socket || !user?.id) return;
    const handleUpdate = () => {
      fetchStudentData();
    };
    socket.on('live_class_started', handleUpdate);
    socket.on('class_scheduled', handleUpdate);
    socket.on('live_class_ended', handleUpdate);
    socket.on('tutor_assigned', handleUpdate);

    return () => {
      socket.off('live_class_started', handleUpdate);
      socket.off('class_scheduled', handleUpdate);
      socket.off('live_class_ended', handleUpdate);
      socket.off('tutor_assigned', handleUpdate);
    };
  }, [socket, user?.id, fetchStudentData]);

  // Start / Stop Hardware Test Media Stream
  useEffect(() => {
    let active = true;
    const startTestMedia = async () => {
      if (!cameraTestOpen) return;
      setTestCameraError(null);
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' }, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        if (active) {
          setTestStream(s);
          if (testVideoRef.current) {
            testVideoRef.current.srcObject = s;
            testVideoRef.current.play().catch(() => {});
          }
        } else {
          s.getTracks().forEach((t) => t.stop());
        }
      } catch (err) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: true });
          if (active) {
            setTestStream(s);
            if (testVideoRef.current) {
              testVideoRef.current.srcObject = s;
              testVideoRef.current.play().catch(() => {});
            }
          }
        } catch {
          setTestCameraError(err.message || 'Camera or microphone unavailable. Please ensure permissions are granted.');
        }
      }
    };

    if (cameraTestOpen) {
      startTestMedia();
    } else if (testStream) {
      testStream.getTracks().forEach((t) => t.stop());
      setTestStream(null);
    }

    return () => {
      active = false;
      if (testStream) {
        testStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraTestOpen]);

  const toggleTestVideo = () => {
    if (testStream) {
      const vTrack = testStream.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !vTrack.enabled;
        setTestVideoActive(vTrack.enabled);
      }
    }
  };

  const toggleTestMic = () => {
    if (testStream) {
      const aTrack = testStream.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !aTrack.enabled;
        setTestMicActive(aTrack.enabled);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingClasses = classes.filter((c) => c.status === 'scheduled' || c.status === 'live');
  const liveClass = classes.find((c) => c.status === 'live');
  const assignedTutors = Array.from(
    new Map(
      enrollments
        .filter((e) => e.assigned_tutor?.id)
        .map((e) => [e.assigned_tutor.id, e.assigned_tutor])
    ).values()
  );

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
            Access your enrolled course, assigned tutor details, live virtual lessons, and study resources.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setCameraTestOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Test Camera & Microphone</span>
            </button>
          </div>
        </div>

        {/* Live Class Immediate Entry Card — ONLY shown when student's assigned tutor starts a live class */}
        {liveClass ? (
          <div className="mt-6 p-4 rounded-2xl bg-rose-600/20 backdrop-blur border border-rose-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Your Tutor Started a Live Class: {liveClass.title}</h4>
                <p className="text-xs text-slate-200">
                  Tutor: {liveClass.tutor?.full_name} {liveClass.course?.title ? `• ${liveClass.course.title}` : ''}
                </p>
              </div>
            </div>
            <Link
              to={`/classroom/${liveClass.meeting_room_id}?as=student`}
              state={{ from: 'student' }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg flex items-center space-x-2 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Join Live Classroom</span>
            </Link>
          </div>
        ) : upcomingClasses.length > 0 ? (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-brand-300 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-white">Next Scheduled Class: {upcomingClasses[0].title}</h4>
                <p className="text-[11px] text-slate-300">
                  Tutor: {upcomingClasses[0].tutor?.full_name} &bull; {new Date(upcomingClasses[0].scheduled_at).toLocaleString()}
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/15 text-slate-200 font-semibold text-xs border border-white/20 self-start sm:self-auto">
              Waiting for Tutor to Start
            </span>
          </div>
        ) : assignedTutors.length === 0 && enrollments.length > 0 ? (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 backdrop-blur border border-amber-400/30 flex items-center space-x-3">
            <GraduationCap className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-amber-100">Your tutor will be assigned soon.</h4>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                Once our academic team assigns your dedicated tutor, their name and your live class timetable will appear here automatically.
              </p>
            </div>
          </div>
        ) : null}
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

        <Link
          to="/student/classes"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-brand-500 hover:shadow-md transition-all cursor-pointer block group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-brand-600 transition-colors">Live & Upcoming Classes</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{upcomingClasses.length}</h3>
              <p className="text-[11px] text-brand-600 font-semibold mt-1 flex items-center gap-1">
                <span>View Timetable</span>
                <ArrowRight className="w-3 h-3" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
              <Video className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Tutor</p>
              {assignedTutors.length > 0 ? (
                <h3 className="text-base font-black text-slate-900 mt-1.5 truncate" title={assignedTutors.map((t) => t.full_name).join(', ')}>
                  {assignedTutors.map((t) => t.full_name).join(', ')}
                </h3>
              ) : (
                <p className="text-xs font-bold text-amber-700 mt-2">
                  Your tutor will be assigned soon.
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              assignedTutors.length > 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Enrolled Courses & Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Enrolled Courses</h3>
              <p className="text-xs text-slate-500">Courses you are enrolled in and your assigned tutor</p>
            </div>
            <Link to="/student/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {enrollments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200/80">
                You are not currently enrolled in any course yet. Please contact admissions if you have already completed registration.
              </div>
            ) : (
              enrollments.map((enr) => (
                <div key={enr.id} className="p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {enr.course?.title}
                      {enr.course_track ? <span className="ml-2 text-xs font-semibold text-brand-600">({enr.course_track})</span> : null}
                    </h4>

                    {enr.assigned_tutor ? (
                      <div className="flex items-center space-x-2 mt-1.5">
                        <UserAvatar
                          name={enr.assigned_tutor.full_name}
                          avatarUrl={enr.assigned_tutor.avatar_url}
                          role="tutor"
                          className="w-6 h-6 rounded-full text-[10px]"
                        />
                        <p className="text-xs text-emerald-700 font-semibold">
                          Assigned Tutor: {enr.assigned_tutor.full_name}
                        </p>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Your tutor will be assigned soon.</span>
                      </div>
                    )}

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
            {materials.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No lecture materials uploaded by your tutor yet.
              </div>
            ) : (
              materials.map((m) => (
                <a
                  key={m.id}
                  href={m.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 flex items-center space-x-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{m.title}</h5>
                    <p className="text-[11px] text-slate-400 uppercase">{m.file_type || 'Document'}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Device Hardware Pre-Flight Check Modal */}
      {cameraTestOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Camera & Microphone Check</h3>
                  <p className="text-[11px] text-slate-500">Live preview for desktop and mobile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCameraTestOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {testCameraError ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Camera Access Denied or Blocked</span>
                </div>
                <p className="leading-relaxed">{testCameraError}</p>
                <p className="text-[11px] text-rose-600">
                  Tip: Look at the top address bar in your browser, tap the lock/camera icon, and select <strong>Allow</strong> for Camera and Microphone.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                  <video
                    ref={testVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover scale-x-[-1] ${testVideoActive ? 'block' : 'hidden'}`}
                  />
                  {!testVideoActive && (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                      <VideoOff className="w-8 h-8 mb-2 text-slate-600" />
                      <span className="text-xs font-semibold">Camera is Turned Off</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[10px] font-bold text-[#40ffa7] flex items-center gap-1.5 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#40ffa7] animate-pulse" />
                      Camera Connected
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={toggleTestVideo}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        testVideoActive
                          ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          : 'bg-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      {testVideoActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                      <span>{testVideoActive ? 'Mute Camera' : 'Turn On'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleTestMic}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        testMicActive
                          ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          : 'bg-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      {testMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      <span>{testMicActive ? 'Mute Mic' : 'Unmute Mic'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCameraTestOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#050167] text-white hover:bg-[#001f3f] text-xs font-bold shadow-md transition-all"
                  >
                    All Looks Good!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
