import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import {
  Video,
  Play,
  Calendar,
  Clock,
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export const StudentClasses = () => {
  const socket = useSocket();
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clsRes, enrRes] = await Promise.all([
        api.get('/classes'),
        api.get('/courses/user/my-enrollments')
      ]);
      if (clsRes.data.success) setClasses(clsRes.data.classes || []);
      if (enrRes.data.success) setEnrollments(enrRes.data.enrollments || []);
    } catch (err) {
      console.error('Failed to load classes', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;
    socket.on('live_class_started', fetchData);
    socket.on('class_scheduled', fetchData);
    socket.on('live_class_ended', fetchData);
    socket.on('tutor_assigned', fetchData);

    return () => {
      socket.off('live_class_started', fetchData);
      socket.off('class_scheduled', fetchData);
      socket.off('live_class_ended', fetchData);
      socket.off('tutor_assigned', fetchData);
    };
  }, [socket, fetchData]);

  const assignedTutors = Array.from(
    new Map(
      enrollments
        .filter((e) => e.assigned_tutor?.id)
        .map((e) => [e.assigned_tutor.id, e.assigned_tutor])
    ).values()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Classes & Timetable</h1>
          <p className="text-xs text-slate-500 mt-1">
            Live and scheduled sessions hosted exclusively by your assigned tutor
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Schedule</span>
        </button>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">Loading timetable...</div>
        ) : classes.length === 0 ? (
          assignedTutors.length === 0 ? (
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-10 text-center space-y-2">
              <GraduationCap className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-amber-950">Your tutor will be assigned soon.</h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                Once our academic administration assigns your tutor, any live or scheduled classes they start for you will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
              <Video className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Live Classes Scheduled Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your assigned tutor ({assignedTutors.map((t) => t.full_name).join(', ')}) has not scheduled or started a live class yet. You will be notified immediately when they launch a session.
              </p>
            </div>
          )
        ) : (
          classes.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                  c.status === 'live' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-brand-50 text-brand-600 border border-brand-100'
                }`}>
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                    {c.status === 'live' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                        LIVE NOW
                      </span>
                    )}
                    {c.status === 'completed' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">{c.course?.title || 'Enrolled Course'}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Tutor: <span className="font-semibold text-slate-800">{c.tutor?.full_name || 'Assigned Tutor'}</span>
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(c.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(c.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({c.duration_minutes} mins)
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center">
                {c.status === 'live' ? (
                  <Link
                    to={`/classroom/${c.meeting_room_id}?as=student`}
                    state={{ from: 'student' }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/30 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Join Live Class Now</span>
                  </Link>
                ) : c.status === 'completed' ? (
                  <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs border border-slate-200">
                    Session Concluded
                  </span>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 select-none">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Scheduled — Waiting for Tutor to Start</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Unlocks automatically when {c.tutor?.full_name || 'your tutor'} starts the session
                    </span>
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
