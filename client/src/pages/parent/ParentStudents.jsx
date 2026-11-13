import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Users,
  UserPlus,
  Mail,
  CheckCircle2,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';

export const ParentStudents = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_email: 'alex.morgan@beaconbridgeacademics.co.uk',
    relationship: 'Father'
  });
  const [formError, setFormError] = useState('');
  const [linking, setLinking] = useState(false);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await api.get('/parent/children');
      if (res.data.success) {
        setChildren(res.data.children || []);
      }
    } catch (err) {
      console.error('Failed to load children', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    setFormError('');
    setLinking(true);

    try {
      await api.post('/parent/link-child', formData);
      setModalOpen(false);
      fetchChildren();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to link student account.');
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Linked Student Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage linked child profiles, relationships, and educational permissions</p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Link Student Account</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-400 text-xs">Loading linked accounts...</div>
        ) : children.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400 text-xs">No student accounts linked yet. Click above to link your child.</div>
        ) : (
          children.map((c) => (
            <div key={c.link_id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="flex items-start space-x-4">
                <img
                  src={c.student.avatar_url}
                  alt={c.student.full_name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{c.student.full_name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {c.relationship}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{c.student.email}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Status: Active Student</p>
                </div>
              </div>

              {/* Courses Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Enrolled Subjects ({c.enrollments?.length || 0})
                </h4>
                <div className="space-y-1.5">
                  {c.enrollments?.map((e) => (
                    <div key={e.id} className="text-xs text-slate-600 flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="font-medium truncate max-w-[240px]">{e.course?.title}</span>
                      <span className="font-bold text-amber-700">{e.progress_pct || 0}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized Guardian Access</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Link Child */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Link Student Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleLink} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.student_email}
                    onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                    placeholder="student@beaconbridgeacademics.co.uk"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enter your child's registered student email address to link profiles.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Sponsor">Educational Sponsor</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  {linking ? 'Linking...' : 'Confirm Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
