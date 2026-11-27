import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { SEO } from '../../components/common/SEO';
import {
  Globe2,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Upload,
  FileUp,
  Award,
  Sparkles,
  BookOpen,
  Video,
  Mic,
  ArrowRight,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { showSuccess, showError, showWarning, showNetworkError } from '../../utils/swal';

const IELTS_TRACKS = [
  { id: 'IELTS Academic', name: 'IELTS Academic (University & Professional Entry)', desc: 'Targeted preparation for UK, US, Canadian, and Australian university admissions.' },
  { id: 'IELTS UKVI', name: 'IELTS for UKVI (UK Visa & Immigration)', desc: 'Approved exam rubric coaching tailored to UK Home Office visa requirements.' },
  { id: 'IELTS General Training', name: 'IELTS General Training (Migration & Work)', desc: 'Focused training for workplace fluency, letter writing, and PR migration targets.' }
];

const IELTS_MODULES = [
  'IELTS Speaking (1-on-1 Mock Interviews & Fluency)',
  'IELTS Academic Writing Task 1 (Charts, Graphs & Processes)',
  'IELTS Academic Writing Task 2 (Discursive & Argument Essays)',
  'IELTS Reading (Speed Skimming, True/False/Not Given)',
  'IELTS Listening (Distractor Elimination & Dictation)'
];

export const IeltsRegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    ielts_track: 'IELTS Academic',
    target_band: '7.5',
    exam_date: '',
    bank_reference: '',
    payment_proof_url: ''
  });

  const [focusModules, setFocusModules] = useState(IELTS_MODULES);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const proofFileInputRef = useRef(null);

  const toggleModule = (mod) => {
    if (focusModules.includes(mod)) {
      if (focusModules.length <= 1) {
        showWarning('Module Required', 'Please keep at least 1 IELTS study module selected.');
        return;
      }
      setFocusModules(focusModules.filter(m => m !== mod));
    } else {
      setFocusModules([...focusModules, mod]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        setFormData(prev => ({ ...prev, payment_proof_url: res.data.url }));
      }
    } catch (err) {
      const isNetErr = err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response;
      if (isNetErr) {
        showNetworkError({
          title: 'Receipt Upload Failed',
          text: 'Network interruption while uploading payment slip. Please tap retry.',
          onRetry: () => proofFileInputRef.current?.click()
        });
      } else {
        showError('Upload Failed', err.response?.data?.message || 'Could not upload payment proof slip.');
      }
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      showWarning('Missing Information', 'Please complete your full name, email address, and password.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showWarning('Password Mismatch', 'Your passwords do not match. Please verify both fields.');
      return;
    }

    if (formData.password.length < 6) {
      showWarning('Password Too Short', 'Password must be at least 6 characters long.');
      return;
    }

    if (uploadingProof) {
      showWarning('Upload in Progress', 'Please wait for your payment receipt slip to finish uploading.');
      return;
    }

    if (!formData.payment_proof_url) {
      showWarning('Payment Proof Required', 'Please upload your bank transfer receipt or payment confirmation slip before submitting.');
      return;
    }

    if (!formData.bank_reference.trim()) {
      showWarning('Reference Required', 'Please enter your Bank Transfer Reference ID or Transaction Number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        candidate: {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        },
        ielts_track: formData.ielts_track,
        target_band: formData.target_band,
        exam_date: formData.exam_date,
        focus_modules: focusModules,
        bank_reference: formData.bank_reference,
        payment_proof_url: formData.payment_proof_url,
        amount: 100.00
      };

      const res = await api.post('/auth/register-ielts', payload);

      await showSuccess(
        'IELTS Registration Submitted!',
        'Your IELTS account and £100/month tuition proof have been received. Once verified by our administration team, you can log in to attend live classes in your Virtual Classroom Dashboard.'
      );
      setSuccessData(res.data.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'IELTS registration failed. Please try again.';
      setError(msg);
      showError('Registration Error', msg);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-[#f0faff] py-20 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#050167]/15 shadow-2xl p-8 sm:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#40ffa7]/20 text-[#050167] font-bold text-xs uppercase tracking-wider mb-3">
            IELTS Portal Application Received
          </span>
          <h1 className="text-3xl font-black text-[#001f3f] mb-3">
            Welcome to Beacon Bridge IELTS Mastery!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Your candidate account and payment receipt (Ref: <strong className="text-[#050167]">{successData.bank_reference}</strong>) for <strong className="text-[#050167]">£100.00 / month</strong> have been submitted for verification.
          </p>

          <div className="bg-[#f0faff] rounded-2xl p-5 border border-[#050167]/15 text-left space-y-2.5 text-xs sm:text-sm text-[#001f3f] mb-8">
            <h3 className="font-bold text-[#050167] flex items-center gap-2">
              <Video className="w-4 h-4" /> Your Live IELTS Virtual Classroom Access
            </h3>
            <p className="text-slate-600 leading-relaxed">
              As soon as our bursar confirms your payment proof, your dedicated <strong>Student Dashboard</strong> will be unlocked. Inside your dashboard you will have direct access to:
            </p>
            <ul className="space-y-1.5 font-medium text-slate-700 pt-1">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Live 1-to-1 Video Classroom with your Specialist IELTS Tutor</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Speaking Mock Interviews &amp; Academic Writing Essay Grading</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Official Past Paper Mock Decks &amp; Session Recordings</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Go to Student Dashboard Login</span>
              <ArrowRight className="w-4 h-4 text-[#40ffa7]" />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0faff] pb-20">
      <SEO 
        title="IELTS Academic & UKVI Registration (£100/month) | Beacon Bridge Academics"
        description="Register for Beacon Bridge Academics specialist IELTS Academic & UKVI Exam Preparation (£100/month). Includes dedicated Student Dashboard and live tutor classrooms."
        canonicalPath="/ielts-registration"
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <Globe2 className="w-4 h-4" />
            <span>Dedicated IELTS Candidate Onboarding</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            IELTS Academic &amp; UKVI Exam Preparation
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Intensive 1-on-1 Band 7.5+ &amp; Band 8.0 coaching across Speaking, Writing Task 1 &amp; 2, Reading, and Listening — with your own dedicated Student Classroom Dashboard.
          </p>

          {/* Price & Discount Pill */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs line-through text-slate-300 font-semibold">Was £150 / month</span>
                <span className="px-2 py-0.5 rounded-full bg-[#40ffa7] text-[#050167] text-[10px] font-black uppercase">Save £50</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                £100 <span className="text-sm font-semibold text-[#40ffa7]">/ month</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block" />
            <div className="text-xs text-left text-slate-200 space-y-1">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#40ffa7]" /> Dedicated Virtual Classroom Dashboard</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#40ffa7]" /> Examiner-Led Speaking &amp; Essay Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registration Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Candidate Account Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-lg">
            <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#001f3f]">Candidate Portal Account</h2>
                <p className="text-xs text-slate-500">These credentials unlock your IELTS Student Dashboard &amp; Live Video Classroom.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Candidate Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Samuel Adebayo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Email Address (Login ID) *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="candidate@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">WhatsApp / Mobile Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 7700 900000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Preferred Exam Date (Optional)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    name="exam_date"
                    value={formData.exam_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Dashboard Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: IELTS Track & Band Goals */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-lg">
            <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#001f3f]">IELTS Examination Track &amp; Modules</h2>
                <p className="text-xs text-slate-500">Select your exact test type and target band score so we assign the matching specialist.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {IELTS_TRACKS.map((track) => {
                  const selected = formData.ielts_track === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => setFormData(prev => ({ ...prev, ielts_track: track.id }))}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selected ? 'border-[#050167] bg-[#f0faff] shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-[#050167]">{track.id}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{track.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-2">Target Overall IELTS Band Score *</label>
                <div className="flex flex-wrap gap-2.5">
                  {['6.5', '7.0', '7.5', '8.0', '8.5+'].map((band) => (
                    <button
                      key={band}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, target_band: band }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.target_band === band
                          ? 'bg-[#050167] text-[#40ffa7] border-[#050167] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Band {band}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-2">Priority Coaching Modules</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {IELTS_MODULES.map((mod) => {
                    const active = focusModules.includes(mod);
                    return (
                      <div
                        key={mod}
                        onClick={() => toggleModule(mod)}
                        className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2.5 transition-all ${
                          active ? 'bg-emerald-50/70 border-emerald-400 text-[#050167]' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${active ? 'bg-[#050167] text-[#40ffa7]' : 'border border-slate-300 bg-white'}`}>
                          {active && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span>{mod}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Proof Upload & IELTS Monthly Tuition Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#050167]/20 shadow-lg">
            <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#001f3f]">Tuition Summary &amp; Payment Proof Upload</h2>
                <p className="text-xs text-slate-500">Confirm your monthly IELTS fee below, then submit your transfer proof.</p>
              </div>
            </div>

            {/* Clean IELTS Tuition Summary Banner */}
            <div className="bg-[#f0faff] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#050167]/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#050167] font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Selected IELTS Track</span>
                </div>
                <div className="font-bold text-base sm:text-lg text-[#001f3f]">
                  {formData.ielts_track} &mdash; Band {formData.target_band} Target
                </div>
                <p className="text-xs text-[#001f3f]/70">
                  Need transfer instructions? Email <a href="mailto:info@beaconbridgeacademics.co.uk" className="font-semibold text-[#050167] underline">info@beaconbridgeacademics.co.uk</a> or WhatsApp +44 7414 663735.
                </p>
              </div>

              <div className="sm:text-right bg-white rounded-xl px-5 py-3 border border-[#050167]/15 shrink-0">
                <span className="text-[11px] uppercase tracking-wider text-[#001f3f]/65 block font-bold">Monthly Tuition Due</span>
                <div className="text-2xl font-black text-[#050167]">
                  £100.00 <span className="text-xs font-bold text-[#001f3f]">GBP / month</span>
                </div>
                <span className="text-[10px] line-through text-slate-400">Standard £150.00/mo</span>
              </div>
            </div>

            {/* Receipt Input & Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-[#f0faff] p-5 rounded-2xl border border-[#050167]/15">
              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Bank Reference Number / Transaction ID *
                </label>
                <input
                  type="text"
                  name="bank_reference"
                  required
                  value={formData.bank_reference}
                  onChange={handleChange}
                  placeholder="e.g. IELTS-WIRE-49201"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Enter the reference shown on your transfer receipt.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#001f3f] mb-1.5">
                  Payment Receipt Slip (PDF or Image) *
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
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.payment_proof_url ? 'border-[#050167] bg-[#40ffa7]/15' : 'border-[#050167]/30 hover:border-[#050167] bg-white'
                  }`}
                >
                  {uploadingProof ? (
                    <Upload className="w-5 h-5 animate-spin text-[#050167]" />
                  ) : formData.payment_proof_url ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <FileUp className="w-5 h-5 text-[#050167]" />
                  )}
                  <span className="text-xs font-bold text-[#050167]">
                    {uploadingProof ? 'Uploading receipt...' : formData.payment_proof_url ? `Attached: ${proofFileName || 'Receipt Ready'}` : 'Click to Upload Transfer Receipt'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct access to your Student Virtual Classroom upon verification.</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{loading ? 'Submitting Application...' : 'Complete IELTS Registration'}</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
