import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ParentAttendance = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/parent/children');
        if (res.data.success) {
          setChildren(res.data.children || []);
        }
      } catch (err) {
        console.error('Failed to load parent attendance', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Child Attendance History</h1>
        <p className="text-xs text-slate-500 mt-1">Official verified attendance records of your linked children during live virtual classroom lectures</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">Loading attendance records...</div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">No linked children found.</div>
        ) : (
          children.map((child) => (
            <div key={child.student.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <img
                  src={child.student.avatar_url}
                  alt={child.student.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{child.student.full_name}</h3>
                  <span className="text-xs text-slate-400">{child.student.email} &bull; {child.relationship}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4">Lecture / Class Session</th>
                      <th className="py-2.5 px-4">Session Date</th>
                      <th className="py-2.5 px-4">Time Joined</th>
                      <th className="py-2.5 px-4">Duration Active</th>
                      <th className="py-2.5 px-4 text-right">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {child.attendance?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-slate-400">No attendance entries recorded yet.</td>
                      </tr>
                    ) : (
                      child.attendance?.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {att.class?.title || 'Foundations of Modern Node.js Architecture'}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(att.joined_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(att.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {att.duration_minutes || 60} mins
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Present</span>
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
