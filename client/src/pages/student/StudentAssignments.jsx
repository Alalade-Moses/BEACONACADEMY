import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Award,
  Calendar,
  ExternalLink,
  X
} from 'lucide-react';

export const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments');
      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const openSubmitModal = (assignment) => {
    setActiveAssignment(assignment);
    setSubmissionText(assignment.mySubmission?.submission_text || '');
    setFileUrl(assignment.mySubmission?.file_url || '');
    setSubmitModalOpen(true);
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionText && !fileUrl) {
      alert('Please enter your submission text or provide a file URL.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/assignments/${activeAssignment.id}/submit`, {
        submission_text: submissionText,
        file_url: fileUrl
      });

      if (res.data.success) {
        showToast('Assignment submitted successfully! Tutor has been alerted.');
        setSubmitModalOpen(false);
        await loadAssignments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-brand-600" />
          My Coursework & Assignments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review assignments given by your tutors, track approaching deadlines, and submit your deliverables.
        </p>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Loading your assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Coursework Assigned Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You're all caught up! When tutors assign new coursework, both you and your linked parent will be notified.
            </p>
          </div>
        ) : (
          assignments.map((item) => {
            const hasSubmitted = item.hasSubmitted;
            const isGraded = item.myScore !== null && item.myScore !== undefined;
            const dueTime = new Date(item.due_date).getTime();
            const diffHours = Math.round((dueTime - Date.now()) / (1000 * 3600));
            const isUrgent = diffHours > 0 && diffHours <= 48 && !hasSubmitted;
            const isExpired = diffHours <= 0;

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 truncate max-w-[170px]">
                      {item.course?.title || 'Enrolled Course'}
                    </span>
                    {isGraded ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Score: {item.myScore}/{item.max_score}
                      </span>
                    ) : hasSubmitted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Submitted (Pending Review)
                      </span>
                    ) : isUrgent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        Due in {diffHours}h
                      </span>
                    ) : isExpired ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Past Deadline
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description || 'No prompt instructions provided.'}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Deadline:</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(item.due_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Max Points:</span>
                      <span className="font-bold text-slate-900">{item.max_score} pts</span>
                    </div>
                    {item.file_url && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400">Reference:</span>
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-brand-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Doc</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Feedback preview if graded */}
                  {isGraded && item.myFeedback && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 mb-4">
                      <span className="font-bold block text-emerald-800 text-[11px] uppercase tracking-wider mb-0.5">
                        Tutor Feedback:
                      </span>
                      <p className="italic text-[11px]">"{item.myFeedback}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openSubmitModal(item)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      hasSubmitted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{hasSubmitted ? 'Update Submission' : 'Submit Homework'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Homework Modal */}
      {submitModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block">
                  Submit Deliverable
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Submission Notes / Text Solution
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste your answers, summary, or research findings here..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  File Attachment Link (Google Drive / GitHub / PDF)
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://github.com/... or https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/25"
                >
                  {submitting ? 'Submitting...' : 'Turn In Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
