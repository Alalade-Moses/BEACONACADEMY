import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Upload,
  FileUp
} from 'lucide-react';

export const ParentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bank_name: 'Barclays Bank UK PLC',
    account_name: 'Beacon Bridge Academics Ltd.',
    account_number: '83920147',
    sort_code: '20-45-77',
    iban: 'GB29BARC20457783920147',
    swift_bic: 'BARCGB22',
    tuition_fee: '£299.00 GBP',
    instructions: 'Include student reference in bank transfer details.'
  });

  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [newProofModal, setNewProofModal] = useState(false);
  const proofFileInputRef = useRef(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');
  const [formData, setFormData] = useState({
    bank_reference: '',
    proof_url: '',
    amount: '299.00'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleProofFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofFileName(file.name);
    try {
      setUploadingProof(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          proof_url: res.data.url
        }));
      }
    } catch (err) {
      alert('Failed to upload proof slip: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingProof(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [payRes, bankRes] = await Promise.all([
        api.get('/payments'),
        api.get('/payments/bank-details')
      ]);
      if (payRes.data.success) {
        setPayments(payRes.data.payments);
      }
      if (bankRes.data.success && bankRes.data.bankDetails) {
        setBankDetails(bankRes.data.bankDetails);
      }
    } catch (err) {
      console.error('Failed to load parent payment info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!formData.bank_reference || !formData.proof_url) {
      alert('Please provide reference number and proof receipt link.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/payments/proof', formData);
      if (res.data.success) {
        alert('Proof submitted! Administration has been alerted for verification.');
        setNewProofModal(false);
        setFormData({ bank_reference: '', proof_url: '', amount: '299.00' });
        await loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit proof.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-brand-600" />
            Tuition Fee Payments & Verification Proof
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Check payment verification records, view institutional bank details, and submit wire transfer slips.
          </p>
        </div>

        <button
          onClick={() => setNewProofModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 self-start sm:self-auto"
        >
          Submit New Payment Slip
        </button>
      </div>

      {/* Official Bank Account Details */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Official Receiving Bank Account</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
            Institutional Account
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Bank Name</span>
            <div className="font-bold text-white text-base">{bankDetails.bank_name}</div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Account Beneficiary</span>
            <div className="font-bold text-white text-base">{bankDetails.account_name}</div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Account Number</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-brand-300 text-lg tracking-wider">
                {bankDetails.account_number}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.account_number, 'acc')}
                className="p-1 rounded hover:bg-slate-800 text-slate-300"
              >
                {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">SWIFT / BIC</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-white text-base">{bankDetails.swift_code}</span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.swift_code, 'swift')}
                className="p-1 rounded hover:bg-slate-800 text-slate-300"
              >
                {copiedField === 'swift' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Routing Code</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-white text-base">{bankDetails.routing_code}</span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.routing_code, 'rout')}
                className="p-1 rounded hover:bg-slate-800 text-slate-300"
              >
                {copiedField === 'rout' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Standard Tuition Fee</span>
            <div className="font-black text-emerald-400 text-xl">{bankDetails.tuition_fee}</div>
          </div>
        </div>
      </div>

      {/* Submitted Payments History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-brand-600" />
          Submitted Payment History & Verification Records
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No payment records found on file.
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">Ref: {p.bank_reference}</span>
                    {p.status === 'verified' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified & Confirmed
                      </span>
                    )}
                    {p.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        Awaiting Admin Verification
                      </span>
                    )}
                    {p.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Rejected / Resubmit Needed
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4">
                    <span>Amount: <strong>£{p.amount} {p.currency || 'GBP'}</strong></span>
                    <span>Date: {new Date(p.created_at).toLocaleDateString()}</span>
                    {p.student && <span>Student: <strong>{p.student.full_name}</strong></span>}
                  </div>
                  {p.admin_notes && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      Admin Notes: "{p.admin_notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {p.proof_url && (
                    <a
                      href={p.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Proof Modal */}
      {newProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Upload New Payment Proof</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your wire reference number and image receipt URL for admin verification.
            </p>

            <form onSubmit={handleUploadProof} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bank Reference Number / Wire ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bank_reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_reference: e.target.value }))}
                  placeholder="e.g. WIRE-894721"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Receipt Slip from Your Computer *
                </label>
                <input
                  type="file"
                  ref={proofFileInputRef}
                  onChange={handleProofFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />
                <div
                  onClick={() => proofFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    formData.proof_url
                      ? 'border-emerald-500 bg-emerald-50/70'
                      : 'border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    {uploadingProof ? (
                      <Upload className="w-4 h-4 animate-spin" />
                    ) : formData.proof_url ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileUp className="w-4 h-4 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {uploadingProof
                        ? 'Uploading receipt slip...'
                        : (proofFileName ? `Attached: ${proofFileName}` : (formData.proof_url ? 'Receipt Slip Attached' : 'Click to select slip from your system'))}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Upload bank slip screenshot, receipt, or PDF (Max 30MB)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewProofModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Submit Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
