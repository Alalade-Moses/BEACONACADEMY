import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  UserCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Search,
  Filter
} from 'lucide-react';

export const TutorAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attRes, clsRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/classes')
      ]);

      if (attRes.data.success) setAttendance(attRes.data.records);
      if (clsRes.data.success) setClasses(clsRes.data.classes);
    } catch (err) {
      console.error('Failed to load attendance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = selectedClass === 'all' 
    ? attendance 
    : attendance.filter(a => a.class_id === selectedClass);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Class Attendance & Participation</h1>
          <p className="text-xs text-slate-500 mt-1">Detailed real-time logs of student attendance, session entry timestamps, and duration</p>
        </div>

        {/* Filter */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">All Lecture Sessions</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student Attendee</th>
                <th className="py-3.5 px-6">Lecture Session</th>
                <th className="py-3.5 px-6">Joined Timestamp</th>
                <th className="py-3.5 px-6">Duration Active</th>
                <th className="py-3.5 px-6 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">Loading attendance sheets...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">No attendance records logged for this session yet.</td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                        {record.user?.full_name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{record.user?.full_name || 'Student Attendee'}</span>
                        <span className="text-[11px] text-slate-400">{record.user?.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {record.class?.title || 'Live Virtual Classroom'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(record.joined_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {record.duration_minutes || 60} mins
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
