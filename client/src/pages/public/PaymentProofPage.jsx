import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { SEO } from '../../components/common/SEO';
import { showError, showSuccess, showWarning, showNetworkError } from '../../utils/swal';
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

const FALLBACK_COURSES = [
  { id: '20000000-0000-0000-0000-000000000009', title: 'Key Stage 2 Foundation & SATs (Year 3–6)', slug: 'ks2-foundation-sats', price: 149.00 },
  { id: '20000000-0000-0000-0000-000000000005', title: 'Key Stage 3 Foundation Bridge (Year 7–9)', slug: 'ks3-foundation-bridge', price: 249.00 },
  { id: '20000000-0000-0000-0000-000000000001', title: 'GCSE 5-Subject Core Bundle (Year 10–11)', slug: 'gcse-5-subject-bundle', price: 299.00 },
  { id: '20000000-0000-0000-0000-000000000002', title: 'UK A-Level 3-Subject Specialist Program (Year 12–13)', slug: 'uk-a-level-3-subject-program', price: 320.00 },
  { id: '20000000-0000-0000-0000-000000000003', title: 'Canada Senior Secondary & AP Program (Grade 11–12)', slug: 'canada-senior-secondary-program', price: 320.00 },
  { id: '20000000-0000-0000-0000-000000000004', title: 'US High School Advanced & AP Mastery Program', slug: 'us-high-school-ap-mastery', price: 320.00 },
  { id: '20000000-0000-0000-0000-000000000006', title: 'Coding (Software Development)', slug: 'software-development', price: 340.00 },
  { id: '20000000-0000-0000-0000-000000000007', title: 'Graphics Design', slug: 'graphics-design', price: 200.00 },
  { id: '20000000-0000-0000-0000-000000000008', title: 'IELTS Academic & UKVI Exam Preparation', slug: 'ielts-academic-exam-preparation', price: 100.00 }
];

export const PaymentProofPage = () => {
  const [bankDetails, setBankDetails] = useState({
    bank_name: 'Barclays Bank UK PLC',
    account_name: 'Beacon Bridge Academics Ltd.',
    tuition_fee: '£299.00 GBP / month',
    instructions: 'Please include your student or parent name and reference code in the bank transfer description. Upload your transaction receipt/wire slip below to expedite verification.'
  });

  const proofFileInputRef = useRef(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState(FALLBACK_COURSES[2].id);
  const [selectedTrack, setSelectedTrack] = useState('Frontend Coding');

  const [formData, setFormData] = useState({
    parent_email: '',
    student_email: '',
    bank_reference: '',
    proof_url: '',
    amount: '299.00',
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
      const isNetErr = err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response;
      if (isNetErr) {
        showNetworkError({
          title: 'Proof Upload Failed',
          text: 'Network connection was interrupted while uploading your proof slip. Tap retry to try again.',
          onRetry: () => proofFileInputRef.current?.click()
        });
      } else {
        showError('Upload Failed', err.response?.data?.message || err.message || 'Failed to upload proof slip.');
      }
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
      const [bankResult, courseResult] = await Promise.allSettled([
        api.get('/payments/bank-details'),
        api.get('/courses')
      ]);

      if (bankResult.status === 'fulfilled' && bankResult.value.data?.success && bankResult.value.data.bankDetails) {
        setBankDetails(prev => ({ ...prev, ...bankResult.value.data.bankDetails }));
      }
      if (courseResult.status === 'fulfilled' && courseResult.value.data?.success && Array.isArray(courseResult.value.data.courses) && courseResult.value.data.courses.length > 0) {
        const fetched = courseResult.value.data.courses;
        setCourses(fetched);
        const defaultCourse = fetched.find(c => c.slug === 'gcse-5-subject-bundle') || fetched[0];
        setSelectedCourseId(defaultCourse.id);
        setFormData(prev => ({ ...prev, amount: Number(defaultCourse.price || 299).toFixed(2) }));
      }
    };
    fetchBankDetails();
  }, []);

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const slug = (course.slug || '').toLowerCase();
    const titleLower = (course.title || '').toLowerCase();

    if (slug.includes('software') || titleLower.includes('software') || titleLower.includes('coding')) {
      setFormData(prev => ({ ...prev, amount: '340.00' }));
    } else if (slug.includes('graphics') || titleLower.includes('graphics')) {
      setFormData(prev => ({ ...prev, amount: '200.00' }));
    } else if (slug.includes('ielts') || titleLower.includes('ielts')) {
      setFormData(prev => ({ ...prev, amount: '100.00' }));
    } else if (slug.includes('ks2') || titleLower.includes('ks2')) {
      setFormData(prev => ({ ...prev, amount: '149.00' }));
    } else {
      setFormData(prev => ({ ...prev, amount: Number(course.price || 299).toFixed(2) }));
    }
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setFormData(prev => ({ ...prev, amount: '340.00' }));
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
      <SEO
        title="Payment Proof Submission | Beacon Bridge Academics"
        description="Submit or update your monthly tuition bank transfer reference and receipt slip for Beacon Bridge Academics verification."
        canonicalPath="/payment-proof"
      />
      {/* Master Container Logo Header */}
      <div className="bg-white rounded-3xl border border-[#050167]/15 shadow-xl shadow-[#050167]/5 overflow-hidden mb-10">
        <div className="w-full bg-gradient-to-b from-[#f0faff] to-slate-50 border-b border-[#050167]/10 px-6 py-6 sm:py-7 flex items-center justify-center rounded-t-3xl">
          <Link to="/" className="inline-block group">
            <img 
              src="/logo.png" 
              alt="Beacon Bridge Academics" 
              className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold mb-4 border border-[#050167]/20">
          <CreditCard className="w-4 h-4 text-[#050167]" />
          <span>Institutional Tuition Payment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001f3f] tracking-tight">
          Tuition Payment Proof Submission
        </h1>
        <p className="mt-3 text-[#001f3f]/75 text-sm sm:text-base">
          Submit or update your tuition transfer reference and payment receipt slip for administrator verification.
        </p>
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
              <Link
                to="/"
                style={{ backgroundColor: '#001f3f', color: '#ffffff' }}
                className="px-5 py-2.5 rounded-xl bg-[#001f3f] hover:bg-[#050167] text-white font-bold text-xs transition-all shadow-md"
              >
                Home Page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Beneficiary & Dynamic Monthly Tuition Summary Banner */}
            <div className="bg-[#001f3f] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#40ffa7]/30">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#40ffa7] block">
                  Beneficiary Bank Name
                </span>
                <div className="font-bold text-sm sm:text-base text-white">
                  {bankDetails.bank_name || 'Barclays Bank UK PLC'} &mdash; {bankDetails.account_name || 'Beacon Bridge Academics Ltd.'}
                </div>
              </div>
              <div className="sm:text-right bg-white/10 px-4 py-2 rounded-xl border border-white/15 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">Monthly Tuition Due</span>
                <span className="text-lg font-black text-[#40ffa7]">£{formData.amount} GBP / month</span>
              </div>
            </div>

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
                      {c.title} — £{c.price || '299.00'} GBP/month
                    </option>
                  ))}
                </select>
              </div>

              {/* If Coding (Software Development), show Frontend vs Backend Coding track picker (£340/mo · £35/hr) */}
              {courses.find(c => c.id === selectedCourseId)?.slug?.includes('software') && (
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-[#050167]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#001f3f] block">Select Coding Track:</span>
                    <span className="text-[11px] text-[#001f3f]/60">Both Frontend &amp; Backend Coding: £340/month (£35/hour)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleTrackSelect('Frontend Coding')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedTrack.toLowerCase().includes('frontend')
                          ? 'bg-[#050167] text-[#40ffa7] ring-1 ring-[#40ffa7]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Frontend Coding (£340/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackSelect('Backend Coding')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedTrack.toLowerCase().includes('backend')
                          ? 'bg-[#050167] text-[#40ffa7] ring-1 ring-[#40ffa7]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Backend Coding (£340/mo)
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
