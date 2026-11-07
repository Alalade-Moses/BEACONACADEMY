import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

export const TutorClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: '60',
    presentation_url: '/slides/sample-presentation.pdf',
    presentation_pages: '6'
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsRes, crsRes] = await Promise.all([
        api.get('/classes'),
        api.get(`/courses?tutor_id=${user.id}`)
      ]);

      if (clsRes.data.success) setClasses(clsRes.data.classes);
      if (crsRes.data.success) {
        setCourses(crsRes.data.courses);
        if (crsRes.data.courses.length > 0) {
          setFormData(prev => ({ ...prev, course_id: crsRes.data.courses[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load classes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      await api.post('/classes', formData);
      setModalOpen(false);
      setFormData({
        course_id: courses[0]?.id || '',
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: '60',
        presentation_url: '/slides/sample-presentation.pdf',
        presentation_pages: '6'
      });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to schedule class.');
    } finally {
      setSaving(false);
    }
  };

  const handleStartClass = async (classId) => {
    try {
      await api.post(`/classes/${classId}/start`);
      fetchData();
    } catch (err) {
      alert('Failed to start class');
    }
  };

  const handleEndClass = async (classId) => {
    try {
      await api.post(`/classes/${classId}/end`);
      fetchData();
    } catch (err) {
      alert('Failed to end class');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Classes & Lecture Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">Schedule live virtual classrooms, attach slide decks, and launch real-time teaching sessions</p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Lecture Topic</th>
                <th className="py-3.5 px-6">Associated Course</th>
                <th className="py-3.5 px-6">Scheduled Date & Time</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Classroom Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading schedule...</td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No classes scheduled yet. Click Schedule Live Class to set one up!</td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] text-slate-400">Room: {c.meeting_room_id}</span>
                    </td>
                    <td className="py-3.5 px-6 text-emerald-700 font-semibold">
                      {c.course?.title || 'General Curriculum'}
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
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                          {c.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {c.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartClass(c.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                          >
                            Start Session
                          </button>
                        )}
                        {c.status === 'live' && (
                          <button
                            onClick={() => handleEndClass(c.id)}
                            className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
                          >
                            End Class
                          </button>
                        )}
                        <Link
                          to={`/classroom/${c.meeting_room_id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Enter Classroom</span>
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

      {/* Modal Schedule Class */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Live Class</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Course</label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.id}>{crs.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class / Lecture Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Asynchronous I/O and Socket Architecture"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date & Starting Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Presentation Slides URL</label>
                <input
                  type="text"
                  value={formData.presentation_url}
                  onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                  placeholder="/slides/sample-presentation.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default synchronized presentation slide deck is pre-filled.</span>
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
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {saving ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
