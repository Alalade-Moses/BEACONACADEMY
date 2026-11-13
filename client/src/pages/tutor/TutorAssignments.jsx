import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  CheckSquare,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Bell,
  X,
  Mail,
  Award
} from 'lucide-react';

export const TutorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New assignment form state
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    max_score: 100,
    file_url: ''
  });

  // Grading form state
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignRes, courseRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/courses')
      ]);

      if (assignRes.data.success) {
        setAssignments(assignRes.data.assignments);
      }
      if (courseRes.data.success) {
        setCourses(courseRes.data.courses);
        if (courseRes.data.courses.length > 0 && !formData.course_id) {
          setFormData(prev => ({ ...prev, course_id: courseRes.data.courses[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.due_date || !formData.course_id) {
      alert('Please fill in required fields: Course, Title, and Due Date.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/assignments', formData);
      if (res.data.success) {
        showToast('Assignment created! Students and linked parents notified via in-app & email.');
        setCreateModalOpen(false);
        setFormData({
          course_id: courses[0]?.id || '',
          title: '',
          description: '',
          due_date: '',
          max_score: 100,
          file_url: ''
        });
        await loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmissions = async (assignmentId) => {
    try {
      const res = await api.get(`/assignments/${assignmentId}`);
      if (res.data.success) {
        setSelectedAssignment(res.data.assignment);
      }
    } catch (err) {
      alert('Failed to load assignment details.');
    }
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score !== null ? submission.score : '',
      feedback: submission.feedback || ''
    });
    setGradingModalOpen(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (gradeData.score === '') {
      alert('Please enter a grade score.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/assignments/submissions/${selectedSubmission.id}/grade`, {
        score: gradeData.score,
        feedback: gradeData.feedback
      });

      if (res.data.success) {
        showToast('Grade saved! Student & parents have been sent grade notifications.');
        setGradingModalOpen(false);
        // refresh current assignment submissions
        await openSubmissions(selectedAssignment.id);
        await loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit grade.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeadlineCheck = async () => {
    try {
      const res = await api.post('/assignments/check-deadlines');
      showToast(res.data.message || 'Deadline notifications dispatched!');
    } catch (err) {
      alert('Failed to check deadlines.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-emerald-600" />
            Course Assignments & Dual-Alert System
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create coursework with automatic dual notification to students and parents, deadline countdowns, and grading.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerDeadlineCheck}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
            title="Scan upcoming deadlines (<=48h) and dispatch reminders to students & parents"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Scan Deadlines & Notify</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Loading course assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Assignments Created Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click "Create New Assignment" to assign coursework. Both enrolled students and their parents will be notified immediately.
            </p>
          </div>
        ) : (
          assignments.map((item) => {
            const isDueSoon = new Date(item.due_date).getTime() - Date.now() < 48 * 3600 * 1000 && new Date(item.due_date).getTime() > Date.now();
            const isPast = new Date(item.due_date).getTime() < Date.now();

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[170px]">
                      {item.course?.title || 'Course'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPast 
                        ? 'bg-slate-100 text-slate-500' 
                        : isDueSoon 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isPast ? 'Closed' : isDueSoon ? 'Due Soon (48h)' : 'Active'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description || 'No description provided.'}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Due Date:</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(item.due_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Max Score:</span>
                      <span className="font-bold text-slate-900">{item.max_score} pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dual Alerts:</span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Student + Parent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    {item.submissionCount || 0} Submissions
                  </span>
                  <button
                    onClick={() => openSubmissions(item.id)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-colors"
                  >
                    <span>View & Grade</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submissions Drawer / Details */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block">
                  {selectedAssignment.course?.title}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Submissions: {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {selectedAssignment.submissions?.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No students have submitted this assignment yet.
                </div>
              ) : (
                selectedAssignment.submissions?.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.student?.full_name}</span>
                        <span className="text-xs text-slate-400">({sub.student?.email})</span>
                        {sub.status === 'graded' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Graded: {sub.score}/{selectedAssignment.max_score}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Needs Grading
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {sub.submission_text || 'Attachment provided.'}
                      </p>
                      {sub.file_url && (
                        <a
                          href={sub.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Submitted Attachment</span>
                        </a>
                      )}
                      {sub.feedback && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Feedback: "{sub.feedback}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => openGradeModal(sub)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
                    >
                      {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Grade Student Submission
              </h3>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block">Student</span>
                <span className="font-bold text-slate-900 text-sm">{selectedSubmission.student?.full_name}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Score (Out of {selectedAssignment?.max_score || 100}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedAssignment?.max_score || 100}
                  value={gradeData.score}
                  onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                  placeholder="e.g. 95"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tutor Feedback / Comments</label>
                <textarea
                  rows={3}
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Provide constructive feedback for student and parents..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                <strong>Dual Notification Trigger:</strong> Submitting this grade automatically sends an in-app alert and simulated grade email to <strong>both the student and their parent(s)</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Submit Grade & Notify All'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                Publish Course Assignment
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Course *</label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, course_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Distributed Database Architecture & Sharding Report"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Instructions</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide instructions, deliverables, and guidelines..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Score (Points)</label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_score: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attachment / Reference URL</label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Automatic Dual Notification Notice:</strong> Publishing this assignment will dispatch in-app notifications and simulated emails to <strong>both the enrolled student and their registered parent(s)</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/25"
                >
                  {submitting ? 'Publishing...' : 'Publish & Notify Both'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
