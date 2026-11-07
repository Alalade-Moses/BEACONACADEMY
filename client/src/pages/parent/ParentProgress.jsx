import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  TrendingUp,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

export const ParentProgress = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await api.get('/parent/children');
        if (res.data.success) {
          setChildren(res.data.children || []);
        }
      } catch (err) {
        console.error('Failed to load parent progress', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Learning Progress</h1>
        <p className="text-xs text-slate-500 mt-1">Holistic academic tracking and syllabus completion reports for your linked children</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">Loading progress data...</div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs">No student accounts linked yet.</div>
        ) : (
          children.map((child) => (
            <div key={child.student.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <img
                  src={child.student.avatar_url}
                  alt={child.student.full_name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{child.student.full_name}</h3>
                  <span className="text-xs text-slate-400">{child.relationship} &bull; {child.student.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {child.enrollments?.map((enr) => (
                  <div key={enr.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          {enr.course?.level || 'Intermediate'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{enr.course?.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-amber-700">{enr.progress_pct || 0}%</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${enr.progress_pct || 0}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Status: In Progress</span>
                      <span>Enrolled: {new Date(enr.enrolled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
