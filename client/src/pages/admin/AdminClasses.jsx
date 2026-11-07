import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Video,
  Play,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  X
} from 'lucide-react';

export const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceModal, setAttendanceModal] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/classes');
      if (res.data.success) {
        setClasses(res.data.classes);
      }
    } catch (err) {
      console.error('Failed to fetch classes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openAttendance = async (classItem) => {
    setAttendanceModal(classItem);
    try {
      setLogsLoading(true);
      const res = await api.get(`/attendance?class_id=${classItem.id}`);
      if (res.data.success) {
        setAttendanceLogs(res.data.records);
      }
    } catch (err) {
      console.error('Failed to load attendance', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleStartClass = async (classId) => {
    try {
      await api.post(`/classes/${classId}/start`);
      fetchClasses();
    } catch (err) {
      alert('Failed to start class');
    }
  };

  const handleEndClass = async (classId) => {
    try {
      await api.post(`/classes/${classId}/end`);
      fetchClasses();
    } catch (err) {
      alert('Failed to end class');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Virtual Classroom Sessions & Attendance</h1>
        <p className="text-xs text-slate-500 mt-1">Live monitoring of active lecture halls, WebRTC signaling rooms, and participant attendance</p>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Class Title & Course</th>
                <th className="py-3.5 px-6">Assigned Tutor</th>
                <th className="py-3.5 px-6">Scheduled Time</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Class Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading scheduled classes...</td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No scheduled sessions found.</td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-brand-600">{c.course?.title || 'General Curriculum'}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {c.tutor?.full_name || 'Dr. Sarah Jenkins'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {new Date(c.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {c.duration_minutes} mins
                    </td>
                    <td className="py-3.5 px-6">
                      {c.status === 'live' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                          LIVE NOW
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {c.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openAttendance(c)}
                          title="Attendance Records"
                          className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 font-semibold text-xs flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Attendance</span>
                        </button>
                        
                        {c.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartClass(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs"
                          >
                            Start
                          </button>
                        )}

                        {c.status === 'live' && (
                          <button
                            onClick={() => handleEndClass(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs"
                          >
                            End
                          </button>
                        )}

                        <Link
                          to={`/classroom/${c.meeting_room_id}`}
                          className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Join</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Inspector Modal */}
      {attendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Class Attendance Log</h3>
                <p className="text-xs text-slate-500 mt-0.5">{attendanceModal.title}</p>
              </div>
              <button onClick={() => setAttendanceModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {logsLoading ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading attendance...</div>
              ) : attendanceLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No attendance entries recorded for this session yet.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Participant</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Time Joined</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {attendanceLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {log.user?.full_name || 'Participant'}
                        </td>
                        <td className="py-2.5 px-3 capitalize text-slate-500">{log.role}</td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(log.joined_at).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                onClick={() => setAttendanceModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
