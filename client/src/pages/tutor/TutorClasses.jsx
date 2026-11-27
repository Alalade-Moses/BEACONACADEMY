import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Play,
  X,
  AlertCircle,
  FileUp,
  Zap,
  Users
} from 'lucide-react';

export const TutorClasses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launchingInstant, setLaunchingInstant] = useState(false);

  const isActualTutor = user?.role === 'tutor';

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: '60',
    presentation_url: '',
    presentation_pages: '1'
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clsRes, crsRes, assignRes] = await Promise.all([
        api.get('/classes'),
        api.get(`/courses?tutor_id=${user.id}`).catch(() => ({ data: { success: true, courses: [] } })),
        api.get('/users/tutor-assignments').catch(() => ({ data: { success: true, assignments: [] } }))
      ]);

      if (clsRes.data.success) setClasses(clsRes.data.classes || []);
      const courseList = (crsRes.data.success && crsRes.data.courses) || [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setFormData((prev) => ({ ...prev, course_id: prev.course_id || courseList[0].id }));
      }
      if (assignRes.data.success) setAssignments(assignRes.data.assignments || []);
    } catch (err) {
      console.error('Failed to load classes', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id, fetchData]);

  const uniqueStudentCount = new Set(assignments.map((a) => a.student_id)).size;

  const handleStartInstantClass = async () => {
    if (!isActualTutor) {
      alert('Only assigned Tutor accounts can launch live classes.');
      return;
    }
    if (uniqueStudentCount === 0) {
      alert('You have no students assigned yet. Once the Superadmin assigns students to you, you can start a live class.');
      return;
    }

    try {
      setLaunchingInstant(true);
      const defaultCourse = courses[0] || null;
      const res = await api.post('/classes', {
        title: defaultCourse ? `Live Session: ${defaultCourse.title}` : `Live Session with ${user.full_name}`,
        description: 'Interactive live academic lecture session.',
        course_id: defaultCourse?.id || null,
        isInstant: true,
        status: 'live',
        scheduled_at: new Date().toISOString(),
        duration_minutes: 60
      });
      if (res.data.success && res.data.class) {
        navigate(`/classroom/${res.data.class.meeting_room_id}?as=tutor`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start instant class.');
    } finally {
      setLaunchingInstant(false);
    }
  };

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
        presentation_url: '',
        presentation_pages: '1'
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
      const res = await api.post(`/classes/${classId}/start`);
      await fetchData();
      if (res.data?.class?.meeting_room_id) {
        navigate(`/classroom/${res.data.class.meeting_room_id}?as=tutor`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start class');
    }
  };

  const handleEndClass = async (classId) => {
    try {
      await api.post(`/classes/${classId}/end`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to end class');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Classes & Lecture Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">
            When you schedule or start a class, only students assigned to you are notified and able to join
          </p>
        </div>

        {isActualTutor && uniqueStudentCount > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleStartInstantClass}
              disabled={launchingInstant}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>{launchingInstant ? 'Launching...' : 'Start Instant Live Class'}</span>
            </button>
            <button
              onClick={() => {
                setFormError('');
                const defaultTime = new Date(Date.now() + 1800000).toISOString().slice(0, 16);
                setFormData((prev) => ({
                  ...prev,
                  scheduled_at: defaultTime,
                  course_id: courses[0]?.id || ''
                }));
                setModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Class</span>
            </button>
          </div>
        )}
      </div>

      {/* Assignment status notice */}
      {!isActualTutor ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Superadmin preview mode: Only assigned Tutor accounts can create or start live classes.</span>
        </div>
      ) : uniqueStudentCount === 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <Users className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            No students are assigned to you yet. Ask the Superadmin to assign students to you from User Management before scheduling or launching live classes.
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>{uniqueStudentCount} assigned student{uniqueStudentCount === 1 ? '' : 's'}</strong> linked to your account will be notified immediately when you start a live class.
          </span>
        </div>
      )}

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
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No classes scheduled yet.
                  </td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 block">{c.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">{c.meeting_room_id}</span>
                    </td>
                    <td className="py-3.5 px-6 text-emerald-700 font-semibold">
                      {c.course?.title || 'Assigned Students'}
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
                        {isActualTutor && c.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartClass(c.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Start & Notify Students
                          </button>
                        )}
                        {c.status === 'live' && (
                          <>
                            <button
                              onClick={() => handleEndClass(c.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
                            >
                              End Class
                            </button>
                            <Link
                              to={`/classroom/${c.meeting_room_id}?as=tutor`}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Enter Room</span>
                            </Link>
                          </>
                        )}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Assigned Course *</label>
                <select
                  required={courses.length > 0}
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {courses.length === 0 ? (
                    <option value="">All Assigned Students</option>
                  ) : (
                    courses.map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.title} ({crs.assigned_students_count || 0} assigned student{crs.assigned_students_count === 1 ? '' : 's'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class / Lecture Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. GCSE Mathematics — Quadratic Equations Workshop"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date & Starting Time *</label>
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
                    min="15"
                    max="360"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Presentation Slides (Optional)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.presentation_url}
                    onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
                    placeholder="Upload a slide deck or leave blank"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors shrink-0">
                    <FileUp className="w-4 h-4 text-emerald-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept=".pptx,.ppt,.pdf,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const fd = new FormData();
                          fd.append('file', file);
                          const res = await api.post('/upload', fd);
                          if (res.data.success) {
                            setFormData((prev) => ({ ...prev, presentation_url: res.data.url }));
                          }
                        } catch (err) {
                          alert('Upload failed: ' + (err.response?.data?.message || err.message));
                        }
                      }}
                    />
                  </label>
                </div>
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
