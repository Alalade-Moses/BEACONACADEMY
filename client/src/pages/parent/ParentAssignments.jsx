import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Calendar,
  Users,
  Bell,
  Check
} from 'lucide-react';

export const ParentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remindedId, setRemindedId] = useState(null);

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

  const handleSendReminder = (assignmentId) => {
    setRemindedId(assignmentId);
    setTimeout(() => setRemindedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-amber-600" />
          Child Coursework & Deadline Monitor
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stay informed about homework given to your children, submission statuses, impending deadlines, and tutor grades.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dual Notification Guarantee:</span> Whenever a tutor publishes an assignment or an assignment deadline is within 48 hours, the system automatically sends alert emails to you and your child.
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            Loading assignments and grades...
          </div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Coursework on File</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your child currently has no active assignments pending submission.
            </p>
          </div>
        ) : (
          assignments.map((item) => {
            const childSub = item.childSubmissions && item.childSubmissions[0];
            const hasSubmitted = !!childSub;
            const isGraded = childSub && childSub.score !== null;

            const dueTime = new Date(item.due_date).getTime();
            const diffHours = Math.round((dueTime - Date.now()) / (1000 * 3600));
            const isUrgent = diffHours > 0 && diffHours <= 48 && !hasSubmitted;

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 truncate max-w-[170px]">
                      {item.course?.title || 'Course'}
                    </span>
                    {isGraded ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Score: {childSub.score}/{item.max_score}
                      </span>
                    ) : hasSubmitted ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Submitted by Child
                      </span>
                    ) : isUrgent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        Due in {diffHours}h
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Pending Submission
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description || 'No description.'}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Due Date:</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(item.due_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Points:</span>
                      <span className="font-bold text-slate-900">{item.max_score} pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Submission Status:</span>
                      <span className={`font-semibold ${hasSubmitted ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {hasSubmitted ? 'Turned In' : 'Not Turned In Yet'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback preview if graded */}
                  {isGraded && childSub.feedback && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 mb-4">
                      <span className="font-bold block text-emerald-800 text-[11px] uppercase tracking-wider mb-0.5">
                        Tutor Feedback:
                      </span>
                      <p className="italic text-[11px]">"{childSub.feedback}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleSendReminder(item.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {remindedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Reminder Dispatched</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>Send Child Study Reminder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
