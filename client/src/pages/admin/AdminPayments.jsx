import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { showConfirm, showSuccess, showError } from '../../utils/swal';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  User,
  Users,
  Eye,
  Check,
  X,
  AlertCircle,
  DollarSign,
  Mail,
  Trash2
} from 'lucide-react';

export const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalPayment, setActiveModalPayment] = useState(null);
  const [rejectModalPayment, setRejectModalPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('Proof receipt was illegible or wire reference could not be matched.');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleVerify = async (paymentId) => {
    try {
      setActionLoading(true);
      setActionLoadingId(paymentId);
      const res = await api.put(`/payments/${paymentId}/verify`);
      if (res.data.success) {
        showToast('Payment verified successfully! Both Student and Parent accounts have been activated.');
        await fetchPayments();
      }
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || err.message || 'Verification failed. Please try again.'}`);
    } finally {
      setActionLoading(false);
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalPayment) return;
    try {
      setActionLoading(true);
      const res = await api.put(`/payments/${rejectModalPayment.id}/reject`, {
        admin_notes: rejectReason
      });
      if (res.data.success) {
        showToast('Payment marked as rejected. Parent has been notified to re-upload receipt.');
        setRejectModalPayment(null);
        await fetchPayments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendInvoice = async (paymentId) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/payments/${paymentId}/send-invoice`);
      showToast(res.data.message || 'Invoice and credentials successfully sent to parent email.');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to dispatch invoice email.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId, bankRef) => {
    const confirmed = await showConfirm({
      title: 'Delete Tuition Record?',
      text: `Are you sure you want to permanently delete this tuition verification record (Ref: ${bankRef || paymentId})? This action cannot be undone.`,
      confirmText: 'Yes, Delete Record',
      cancelText: 'Cancel',
      icon: 'warning'
    });
    if (!confirmed) return;

    try {
      setActionLoading(true);
      const res = await api.delete(`/payments/${paymentId}`);
      await showSuccess('Record Deleted', res.data.message || 'Tuition verification record permanently removed.');
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      if (activeModalPayment?.id === paymentId) setActiveModalPayment(null);
    } catch (err) {
      showError('Delete Failed', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const totalCount = payments.length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifiedCount = payments.filter(p => p.status === 'verified').length;
  const totalAmount = payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  // Filtered List
  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const sName = p.student?.full_name?.toLowerCase() || '';
      const pName = p.parent?.full_name?.toLowerCase() || '';
      const ref = p.bank_reference?.toLowerCase() || '';
      return sName.includes(q) || pName.includes(q) || ref.includes(q);
    }
    return true;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-brand-600" />
            Tuition Verification & Account Activation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review submitted bank wire proofs. Confirming payment simultaneously unlocks student and parent portal access.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
        >
          Refresh Payments
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Submissions</span>
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 block uppercase">Pending Verification</span>
            <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 animate-spin" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 block uppercase">Verified & Active</span>
            <span className="text-2xl font-black text-emerald-700">{verifiedCount}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 block uppercase">Verified Tuition Revenue</span>
            <span className="text-2xl font-black text-indigo-700">£{totalAmount.toLocaleString()} GBP</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <span className="text-xl font-black leading-none">£</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['all', 'pending', 'verified', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === st 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, parent, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Reference / Date</th>
                <th className="py-4 px-6">Student Details</th>
                <th className="py-4 px-6">Parent Details</th>
                <th className="py-4 px-6">Course / Amount</th>
                <th className="py-4 px-6">Proof Slip</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading payment records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No payment records found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reference / Date */}
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-slate-900 block">
                        {payment.bank_reference}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Student */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
                          {payment.student?.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {payment.student?.full_name || 'Student Account'}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {payment.student?.email}
                          </span>
                          <span className="text-[10px] text-brand-600 font-semibold">
                            Status: {payment.student?.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Parent */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {payment.parent?.full_name || 'Parent/Guardian'}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {payment.parent?.email}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold">
                          Status: {payment.parent?.status || 'pending'}
                        </span>
                      </div>
                    </td>

                    {/* Course / Amount */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                        {payment.course_display_name || payment.course_name || payment.course?.title || 'Selected Program'}
                      </span>
                      {payment.course_track && (
                        <span className="text-[10px] font-bold text-brand-600 block">
                          Track: {payment.course_track}
                        </span>
                      )}
                      <span className="font-extrabold text-emerald-700 block">
                        £{payment.amount} {payment.currency || 'GBP'} / mo
                      </span>
                    </td>

                    {/* Proof Slip Link */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setActiveModalPayment(payment)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect Receipt</span>
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {payment.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified & Active
                        </span>
                      )}
                      {payment.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                          Pending Review
                        </span>
                      )}
                      {payment.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {payment.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleVerify(payment.id)}
                              disabled={actionLoadingId === payment.id}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                              title="Verify Payment and Activate Accounts"
                            >
                              {actionLoadingId === payment.id ? (
                                <>
                                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Activating...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Verify & Activate</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setRejectModalPayment(payment)}
                              disabled={actionLoading}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold text-[11px] transition-colors cursor-pointer"
                              title="Reject Receipt"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : payment.status === 'verified' ? (
                          <button
                            onClick={() => handleSendInvoice(payment.id)}
                            disabled={actionLoading}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#f0faff] hover:bg-[#050167] text-[#050167] hover:text-[#40ffa7] border border-[#050167]/20 font-bold text-[11px] shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Dispatch Official Invoice and Login Credentials to Parent Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Invoice & Credentials</span>
                          </button>
                        ) : null}

                        {/* Always-accessible Delete Tuition Verification Record button */}
                        <button
                          onClick={() => handleDeletePayment(payment.id, payment.bank_reference)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                          title="Permanently Delete Tuition Verification Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Proof Modal */}
      {activeModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                Proof of Payment Slip Inspection
              </h3>
              <button
                onClick={() => setActiveModalPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Bank Wire Reference:</span>
                  <span className="font-bold text-slate-900">{activeModalPayment.bank_reference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Monthly Tuition Amount:</span>
                  <span className="font-bold text-emerald-700">£{activeModalPayment.amount} {activeModalPayment.currency || 'GBP'} / mo</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Student:</span>
                  <span className="font-semibold text-slate-800">{activeModalPayment.student?.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Parent:</span>
                  <span className="font-semibold text-slate-800">{activeModalPayment.parent?.full_name}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block">Enrolled Program & Track:</span>
                  <span className="font-bold text-brand-700 text-sm">
                    {activeModalPayment.course_display_name || activeModalPayment.course_name || activeModalPayment.course?.title || 'Selected Program'}
                  </span>
                  {activeModalPayment.course_track && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-bold">
                      Specialized Track: {activeModalPayment.course_track}
                    </span>
                  )}
                </div>
              </div>

              {/* Receipt Preview — click to open full size, PDF support */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 text-center">
                {activeModalPayment.proof_url?.toLowerCase().endsWith('.pdf') ? (
                  <div className="p-4 flex flex-col items-center gap-3">
                    <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="text-xl">📄</span> Official PDF Payment Proof
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={activeModalPayment.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#050167] hover:bg-[#001f3f] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open Fullscreen
                        </a>
                        <a
                          href={activeModalPayment.proof_url}
                          download
                          className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                    
                    <object
                      data={activeModalPayment.proof_url}
                      type="application/pdf"
                      className="w-full h-80 rounded-xl border border-slate-200 bg-white"
                    >
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                          activeModalPayment.proof_url.startsWith('http')
                            ? activeModalPayment.proof_url
                            : `https://beaconbridgeacademics.co.uk${activeModalPayment.proof_url}`
                        )}&embedded=true`}
                        title="Payment Proof PDF Preview"
                        className="w-full h-80 rounded-xl border border-slate-200"
                      />
                    </object>
                  </div>
                ) : (
                  <img
                    src={activeModalPayment.proof_url}
                    alt="Payment Receipt Slip"
                    loading="eager"
                    className="w-full max-h-80 object-contain mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(activeModalPayment.proof_url, '_blank')}
                    title="Click to open full size"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600';
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href={activeModalPayment.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    onClick={(e) => { e.preventDefault(); window.open(activeModalPayment.proof_url, '_blank'); }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Size Slip</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeletePayment(activeModalPayment.id, activeModalPayment.bank_reference)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                </div>

                {activeModalPayment.status === 'pending' && (
                  <button
                    onClick={() => {
                      const id = activeModalPayment.id;
                      setActiveModalPayment(null);
                      handleVerify(id);
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md disabled:opacity-60 cursor-pointer"
                  >
                    {actionLoading ? 'Activating…' : 'Confirm & Activate Accounts'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Reject Payment Receipt
              </h3>
              <button
                onClick={() => setRejectModalPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Please provide the reason why this payment receipt cannot be verified. This will be sent as a notification to the parent so they can upload a valid slip.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Administrative Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Reject & Notify Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
