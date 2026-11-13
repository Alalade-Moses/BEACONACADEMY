import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Building2,
  Copy,
  Check,
  CreditCard,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Upload,
  FileUp
} from 'lucide-react';

export const PaymentProofPage = () => {
  const [bankDetails, setBankDetails] = useState({
    bank_name: 'Barclays Bank UK PLC',
    account_name: 'Beacon Bridge Academics Ltd.',
    account_number: '83920147',
    swift_code: 'BARCGB22',
    routing_code: '20-45-77',
    iban: 'GB29BARC20457783920147',
    tuition_fee: '£300.00 GBP / month',
    instructions: 'Please include your student or parent name and reference code in the bank transfer description. Upload your transaction receipt/wire slip below to expedite verification.'
  });

  const proofFileInputRef = useRef(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('Frontend Development');

  const [formData, setFormData] = useState({
    parent_email: '',
    student_email: '',
    bank_reference: '',
    proof_url: '',
    amount: '300.00',
    currency: 'GBP',
    notes: ''
  });

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

  const [copiedField, setCopiedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const [bankRes, courseRes] = await Promise.all([
          api.get('/payments/bank-details'),
          api.get('/courses')
        ]);
        if (bankRes.data.success && bankRes.data.bankDetails) {
          setBankDetails(bankRes.data.bankDetails);
        }
        if (courseRes.data.success && courseRes.data.courses.length > 0) {
          setCourses(courseRes.data.courses);
          const first = courseRes.data.courses[0];
          setSelectedCourseId(first.id);
          setFormData(prev => ({ ...prev, amount: String(first.price || '300.00') }));
        }
      } catch (err) {
        console.error('Failed to load bank details', err);
      }
    };
    fetchBankDetails();
  }, []);

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.slug?.includes('software') || course.title?.toLowerCase().includes('software')) {
      const isBackend = selectedTrack === 'Backend Development';
      setFormData(prev => ({ ...prev, amount: isBackend ? '420.00' : '300.00' }));
    } else if (course.slug?.includes('graphics') || course.title?.toLowerCase().includes('graphics')) {
      setFormData(prev => ({ ...prev, amount: '300.00' }));
    } else {
      setFormData(prev => ({ ...prev, amount: String(course.price || '299.00') }));
    }
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    const isBackend = track === 'Backend Development';
    setFormData(prev => ({ ...prev, amount: isBackend ? '420.00' : '300.00' }));
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.bank_reference || !formData.proof_url) {
      setError('Please provide your bank transfer reference and proof receipt link.');
      return;
    }

    setLoading(true);

    try {
      const chosenCourse = courses.find(c => c.id === selectedCourseId);
      const isSoftware = chosenCourse?.slug?.includes('software') || chosenCourse?.title?.toLowerCase().includes('software');

      await api.post('/payments/proof', {
        course_id: selectedCourseId,
        course_track: isSoftware ? selectedTrack : (chosenCourse?.slug?.includes('graphics') ? 'Graphics Design' : null),
        bank_reference: formData.bank_reference,
        proof_url: formData.proof_url,
        amount: formData.amount,
        notes: formData.notes
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit proof.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold mb-4 border border-[#050167]/20">
          <CreditCard className="w-4 h-4 text-[#050167]" />
          <span>Institutional Tuition Payment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f3f] tracking-tight">
          Tuition Payment & Proof Submission
        </h1>
        <p className="mt-3 text-[#001f3f]/75 text-sm sm:text-base">
          View official bank wire coordinates to process tuition, or submit your transfer receipt for administrator verification.
        </p>
      </div>

      {/* Bank Account Coordinates */}
      <div className="bg-[#001f3f] text-[#f0faff] rounded-3xl p-6 sm:p-8 mb-10 relative overflow-hidden shadow-xl border border-[#40ffa7]/20">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-[#40ffa7]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center space-x-2 text-[#40ffa7] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Official Receiving Bank Account</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] border border-[#40ffa7]/30 font-bold">
            Status: Active & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">Bank Institution</span>
            <div className="font-bold text-white text-base">
              {bankDetails.bank_name}
            </div>
          </div>

          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">Beneficiary Account Name</span>
            <div className="font-bold text-white text-base">
              {bankDetails.account_name}
            </div>
          </div>

          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">Account Number</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-[#40ffa7] text-lg tracking-wider">
                {bankDetails.account_number}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.account_number, 'acc')}
                className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
              >
                {copiedField === 'acc' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">SWIFT / BIC Code</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-white text-base">
                {bankDetails.swift_code}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.swift_code, 'swift')}
                className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
              >
                {copiedField === 'swift' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">Routing / Sort Code</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-white text-base">
                {bankDetails.routing_code}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.routing_code, 'rout')}
                className="p-1 rounded hover:bg-[#050167] text-[#f0faff]/80 transition-colors"
              >
                {copiedField === 'rout' ? <Check className="w-4 h-4 text-[#40ffa7]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#f0faff]/60 block mb-1">Monthly Tuition Due</span>
            <div className="font-black text-[#40ffa7] text-xl">
              {bankDetails.tuition_fee}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#f0faff]/80 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#40ffa7] shrink-0" />
          <span>{bankDetails.instructions}</span>
        </div>
      </div>

      {/* Proof Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm">
        <h3 className="text-lg font-bold text-[#001f3f] mb-1 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#050167]" />
          Submit or Update Proof of Payment
        </h3>
        <p className="text-xs text-[#001f3f]/60 mb-6">
          Submit your wire reference or transaction receipt slip to expedite account verification.
        </p>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-[#f0faff] border border-[#050167]/20 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#050167] mx-auto mb-3" />
            <h4 className="text-lg font-bold text-[#001f3f]">Proof Submitted Successfully!</h4>
            <p className="text-xs text-[#001f3f]/80 mt-1 max-w-md mx-auto">
              Our administrative bursar office will review your transaction reference ({formData.bank_reference}). 
              Both student and parent accounts will be activated immediately once confirmed.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/login" className="px-5 py-2.5 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-bold text-xs transition-all shadow-md shadow-[#40ffa7]/30">
                Back to Login
              </Link>
              <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-[#f0faff] font-bold text-xs transition-all">
                Home Page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Select Enrolled Course / Program *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-xs font-bold text-[#050167] bg-[#f0faff]/30 focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} — £{c.price || '300.00'} GBP/mo
                    </option>
                  ))}
                </select>
              </div>

              {/* If Software Development, show Frontend (£300) vs Backend (£420) sub-track picker */}
              {courses.find(c => c.id === selectedCourseId)?.slug?.includes('software') && (
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-[#050167]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#001f3f] block">Select Software Track:</span>
                    <span className="text-[11px] text-[#001f3f]/60">Frontend: £300/mo | Backend: £420/mo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleTrackSelect('Frontend Development')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedTrack === 'Frontend Development'
                          ? 'bg-[#050167] text-[#40ffa7] ring-1 ring-[#40ffa7]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Frontend (£300/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackSelect('Backend Development')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedTrack === 'Backend Development'
                          ? 'bg-[#050167] text-[#40ffa7] ring-1 ring-[#40ffa7]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Backend (£420/mo)
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Bank Reference Number / Wire Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bank_reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_reference: e.target.value }))}
                  placeholder="e.g. WIRE-892301"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
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
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.proof_url
                      ? 'border-[#050167] bg-[#40ffa7]/15'
                      : 'border-[#050167]/30 hover:border-[#050167] bg-[#f0faff]/30 hover:bg-[#f0faff]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#050167]/10 text-[#050167] flex items-center justify-center">
                    {uploadingProof ? (
                      <Upload className="w-4 h-4 animate-spin" />
                    ) : formData.proof_url ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <FileUp className="w-4 h-4 text-[#050167]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#001f3f] block">
                      {uploadingProof
                        ? 'Uploading receipt slip...'
                        : (proofFileName ? `Attached: ${proofFileName}` : (formData.proof_url ? 'Receipt Slip Attached' : 'Click to select slip from your system'))}
                    </span>
                    <span className="text-[10px] text-[#001f3f]/60 block mt-0.5">
                      Screenshot, bank confirmation receipt, or PDF slip (Max 30MB)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Amount Transferred (£ GBP) *
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Notes / Remitter Name
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Paid via HSBC Wire by David Morgan"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#050167]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] focus:border-[#050167] bg-[#f0faff]/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm transition-all shadow-md shadow-[#40ffa7]/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? <span>Submitting Proof...</span> : <span>Submit Proof for Admin Verification</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
