import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Video,
  Play,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/classes');
        if (res.data.success) {
          setClasses(res.data.classes);
        }
      } catch (err) {
        console.error('Failed to load classes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Classes & Timetable</h1>
        <p className="text-xs text-slate-500 mt-1">Scheduled interactive sessions with synchronized presentation decks, whiteboard, and live voice</p>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">Loading timetable...</div>
        ) : classes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">No live classes scheduled for your enrolled courses right now.</div>
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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                    {c.status === 'live' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">{c.course?.title || 'Lecture Session'}</p>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {c.tutor?.full_name || 'Dr. Sarah Jenkins'}</p>
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
                <Link
                  to={`/classroom/${c.meeting_room_id}`}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md transition-all ${
                    c.status === 'live'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25 scale-105'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{c.status === 'live' ? 'Join Live Now' : 'Enter Classroom Room'}</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
