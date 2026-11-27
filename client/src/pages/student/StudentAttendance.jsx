import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle2 } from 'lucide-react';

export const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/attendance');
        if (res.data.success) {
          setAttendance(res.data.records || []);
        }
      } catch (err) {
        console.error('Failed to load attendance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const totalMinutes = attendance.reduce((acc, r) => acc + (Number(r.duration_minutes) || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const presentCount = attendance.filter((r) => r.status === 'present').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Attendance & Class History</h1>
        <p className="text-xs text-slate-500 mt-1">Verified record of your live classroom attendance</p>
      </div>

      {/* Real Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attended Sessions</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{attendance.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logged Live Time</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalHours} Hours</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Present</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {attendance.length === 0 ? 'No sessions yet' : `${presentCount} / ${attendance.length}`}
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Class Title</th>
                <th className="py-3.5 px-6">Joined At</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">Loading attendance...</td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">No attendance entries recorded yet.</td>
                </tr>
              ) : (
                attendance.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {r.class?.title || 'Live Class Session'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(r.joined_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {Number(r.duration_minutes) || 0} mins
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{r.status || 'present'}</span>
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
