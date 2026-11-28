import React, { useState, useMemo } from 'react';
import { SEO } from '../../components/common/SEO';
import api from '../../api/axios';
import { SafeguardingPolicyDocument } from '../../components/safeguarding/SafeguardingPolicyDocument';
import { ALEVEL_SUBJECTS } from './TeacherApplicationPage';
import { showWarning, showSuccess, showError } from '../../utils/swal';
import {
  GraduationCap,
  ShieldCheck,
  Video,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Play,
  Film,
  Clock,
  Globe,
  Facebook,
  Youtube
} from 'lucide-react';

const ALLOWED_VIDEO_HOSTS = [
  'drive.google.com',
  'docs.google.com',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'loom.com',
  'www.loom.com',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com'
];

const isAllowedVideoLink = (url) => {
  try {
    const parsed = new URL(String(url).trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
};

const getEmbedVideoUrl = (url) => {
  if (!url) return null;
  const str = String(url).trim();

  const gDriveMatch = str.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return { type: 'iframe', src: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview` };
  }

  const ytMatch = str.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` };
  }

  const loomMatch = str.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
  if (loomMatch && loomMatch[1]) {
    return { type: 'iframe', src: `https://www.loom.com/embed/${loomMatch[1]}` };
  }

  const vimeoMatch = str.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return null;
};

export const TutorWaitlistPage = ({ isSubdomain = false }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    highest_qualification: '',
    years_experience: '3-5 years',
    current_role: '',
    selected_subjects: [],
    teaching_approach: '',
    video_url: '',
    cv_url: '',
    degree_certificate_url: '',
    teaching_licence_url: '',
    dbs_status: 'Enhanced DBS on Update Service',
    dbs_certificate_number: '',
    safeguarding_acknowledged: false,
    dbs_consent: false,
    safeguarding_signature: ''
  });

  // File uploads
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [uploadingDegree, setUploadingDegree] = useState(false);
  const [degreeFileName, setDegreeFileName] = useState('');
  const [uploadingLicence, setUploadingLicence] = useState(false);
  const [licenceFileName, setLicenceFileName] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubjectToggle = (subjectName) => {
    setFormData((prev) => {
      const exists = prev.selected_subjects.includes(subjectName);
      return {
        ...prev,
        selected_subjects: exists
          ? prev.selected_subjects.filter((s) => s !== subjectName)
          : [...prev.selected_subjects, subjectName]
      };
    });
  };

  const uploadSingleDocument = async (file, fieldName, setUploading, setFileName, errorTitle) => {
    if (!file) return;
    const uploadPayload = new FormData();
    uploadPayload.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, [fieldName]: res.data.url }));
        setFileName(file.name);
      }
    } catch (err) {
      showError(errorTitle, err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  // Live 6-step completion tracker
  const sectionCompletion = useMemo(() => {
    const step1 = Boolean(
      formData.full_name.trim() &&
      formData.email.trim().toLowerCase().endsWith('@gmail.com') &&
      formData.phone.trim() &&
      formData.location.trim()
    );
    const step2 = Boolean(formData.highest_qualification.trim() && formData.current_role.trim());
    const step3 = formData.selected_subjects.length > 0;
    const step4 = Boolean(formData.teaching_approach.trim());
    const step5 = Boolean(formData.video_url.trim() && isAllowedVideoLink(formData.video_url));
    const step6 = Boolean(
      formData.safeguarding_acknowledged &&
      formData.dbs_consent &&
      formData.safeguarding_signature.trim()
    );
    return [
      { num: 1, label: 'Contact', done: step1 },
      { num: 2, label: 'Qualifications', done: step2 },
      { num: 3, label: 'Subjects', done: step3 },
      { num: 4, label: 'Approach', done: step4 },
      { num: 5, label: '3-Min Video', done: step5 },
      { num: 6, label: 'Safeguarding', done: step6 }
    ];
  }, [formData]);

  const completedStepsCount = sectionCompletion.filter((s) => s.done).length;

  const scrollToForm = () => {
    const el = document.getElementById('waitlist-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.location.trim()) {
      const msg = 'Please complete your full legal name, Gmail address, phone number, and current location.';
      setErrorMsg(msg);
      showWarning('Contact Details Incomplete', msg);
      return;
    }

    if (!formData.email.trim().toLowerCase().endsWith('@gmail.com')) {
      const msg = 'Only valid @gmail.com email addresses are allowed (e.g. yourname@gmail.com).';
      setErrorMsg(msg);
      showWarning('Gmail Address Required', msg);
      return;
    }

    if (!formData.highest_qualification.trim() || !formData.current_role.trim()) {
      const msg = 'Please enter your highest academic qualification and current professional role.';
      setErrorMsg(msg);
      showWarning('Qualifications Incomplete', msg);
      return;
    }

    if (formData.selected_subjects.length === 0) {
      const msg = 'Please select at least one A-Level subject you are certified and qualified to teach.';
      setErrorMsg(msg);
      showWarning('Subject Selection Required', msg);
      return;
    }

    if (!formData.teaching_approach.trim()) {
      const msg = 'Please share your pedagogical statement and teaching approach.';
      setErrorMsg(msg);
      showWarning('Teaching Philosophy Required', msg);
      return;
    }

    if (!formData.video_url.trim() || !isAllowedVideoLink(formData.video_url)) {
      const msg = 'Please paste a valid shareable 3-minute video link from Google Drive, YouTube, Loom, or Vimeo.';
      setErrorMsg(msg);
      showWarning('Valid Video Link Required', msg);
      return;
    }

    if (!formData.safeguarding_acknowledged || !formData.dbs_consent) {
      const msg = 'Please tick both statutory safeguarding and pre-onboarding vetting checkboxes before submitting.';
      setErrorMsg(msg);
      showWarning('Safeguarding Confirmation Required', msg);
      return;
    }

    if (!formData.safeguarding_signature.trim()) {
      const msg = 'Please type your full legal name as your digital legal signature.';
      setErrorMsg(msg);
      showWarning('Digital Signature Required', msg);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/tutor-waitlist', formData);
      if (res.data.success) {
        await showSuccess(
          "You're on the waiting list",
          "Thank you for registering your interest. We've received your details and will contact you as soon as we begin onboarding tutors."
        );
        setSubmittedEntry(res.data.entry);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to submit your waiting list registration. Please check all required fields.';
      setErrorMsg(msg);
      showError('Submission Notice', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO
        title="Tutor Waiting List | Beacon Bridge Academics"
        description="Beacon Bridge Academics is launching soon. Join our A-Level tutor waiting list to be contacted first when onboarding opens across the UK, US, Canada, and Australia."
        canonicalPath="/tutor-waitlist"
        canonicalUrlOverride={isSubdomain ? 'https://tutors.beaconbridgeacademics.co.uk' : null}
      />

      {/* Slim Standalone Header (Zero Main-Site Distractions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src="/logo.png"
              alt="Beacon Bridge Academics"
              className="h-9 sm:h-10 w-auto object-contain shrink-0"
            />
            <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-slate-200">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Tutor Waiting List
              </span>
            </div>
          </div>

          {!submittedEntry && (
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001f3f] hover:bg-[#050167] text-white text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <span>Join the Waiting List</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#40ffa7]" />
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-14 sm:py-20 bg-[#001f3f] text-white overflow-hidden">
        <img
          src="/pages/teach-hero.jpg"
          alt="A-Level tutor teaching live online with Beacon Bridge Academics"
          className="absolute inset-0 w-full h-full object-cover object-[70%_25%] z-0"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/95 via-[#050167]/85 to-[#001f3f]/45 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 via-transparent to-[#001f3f]/30 z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] text-xs font-bold border border-[#40ffa7]/35 mb-4 backdrop-blur-sm">
              <GraduationCap className="w-4 h-4 text-[#40ffa7]" />
              <span>Beacon Bridge Academics &bull; Tutor Waiting List</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Teach with us from day one. Join the tutor waiting list.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Beacon Bridge Academics is launching soon, and we&apos;ll need expert A-Level tutors for motivated students across the UK, US, Canada and Australia. We&apos;re not hiring just yet. Complete the form below to join our waiting list and we&apos;ll contact you first when onboarding opens. Joining the list does not guarantee a position.
            </p>
            {!submittedEntry && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#40ffa7] hover:bg-emerald-300 text-[#001f3f] text-xs sm:text-sm font-black shadow-lg shadow-[#40ffa7]/20 transition-all active:scale-95"
                >
                  <span>Join the Tutor Waiting List</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-200/90 font-medium px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-[#40ffa7]" />
                  Takes ~5 minutes &bull; Priority contact at launch
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Pillars Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Safeguarding First</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Rigorous UK DfE KCSIE standards and Enhanced DBS vetting.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">3-Min Video Intro</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Showcase your teaching approach and subject passion to Superadmin.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">12 A-Level Subjects</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Specialised tutoring across Sciences, Math, Humanities &amp; Economics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Waitlist Form / Confirmation Area */}
      <main id="waitlist-form" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pb-20 w-full scroll-mt-20">
        {submittedEntry ? (
          /* Confirmation Screen (Exact Client Copy) */
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-lg mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block">
                Beacon Bridge Academics &bull; Tutor Waiting List
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                You&apos;re on the waiting list
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you for registering your interest. We&apos;ve received your details and will contact you as soon as we begin onboarding tutors. We&apos;re excited to have you with us.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium">Reference ID:</span>
                <span className="font-mono font-bold text-slate-900">{submittedEntry.id}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium">Confirmation Email:</span>
                <span className="font-bold text-emerald-700 truncate">{submittedEntry.email}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium block mb-1.5">Registered A-Level Subjects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(submittedEntry.selected_subjects || []).map((subj) => (
                    <span
                      key={subj}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              We&apos;ve sent a confirmation email to <strong>{submittedEntry.email}</strong>. Please check your inbox (and spam folder just in case).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Compact 6-Section Progress Strip */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-slate-800">Waiting List Registration Progress</span>
                <span className="font-extrabold text-emerald-700">
                  {completedStepsCount} of 6 sections complete
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sectionCompletion.map((s) => (
                  <div
                    key={s.num}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-colors ${
                      s.done
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 ${
                        s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.done ? '✓' : s.num}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Personal & Contact Information */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal &amp; Contact Information</h2>
                  <p className="text-xs text-slate-500">
                    Provide your contact details so we can reach you for tutor onboarding when we launch.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Eleanor Vance"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. eleanor.vance@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Please use a valid <strong>@gmail.com</strong> email address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number (WhatsApp Capable) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +44 7911 234567"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Location / City &amp; Country <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. London, United Kingdom"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Academic Qualifications & Background */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Academic Qualifications &amp; Background</h2>
                  <p className="text-xs text-slate-500">
                    Provide details on your university degrees, teaching credentials, and experience.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Highest Academic Qualification &amp; University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="highest_qualification"
                    required
                    value={formData.highest_qualification}
                    onChange={handleChange}
                    placeholder="e.g. DPhil (PhD) in Pure Mathematics, University of Oxford; PGCE Secondary"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Years of A-Level / Secondary Tutoring Experience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    <option value="1-2 years">1 - 2 years experience</option>
                    <option value="3-5 years">3 - 5 years experience</option>
                    <option value="6-10 years">6 - 10 years experience</option>
                    <option value="10+ years">10+ years expert educator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Current Professional Role / Institution <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="current_role"
                    required
                    value={formData.current_role}
                    onChange={handleChange}
                    placeholder="e.g. Sixth Form College Lecturer / Independent AQA Examiner"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Upload Academic CV / Resume (Optional, PDF or DOCX)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 border border-slate-300/80 transition-colors">
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>{uploadingCv ? 'Uploading...' : 'Choose CV Document'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          uploadSingleDocument(e.target.files?.[0], 'cv_url', setUploadingCv, setCvFileName, 'CV Upload Failed')
                        }
                        className="hidden"
                      />
                    </label>
                    {cvFileName && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {cvFileName}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Upload Degree Certificate (PDF or Image)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 border border-slate-300/80 transition-colors">
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>{uploadingDegree ? 'Uploading...' : 'Choose Degree Certificate'}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          uploadSingleDocument(
                            e.target.files?.[0],
                            'degree_certificate_url',
                            setUploadingDegree,
                            setDegreeFileName,
                            'Degree Certificate Upload Failed'
                          )
                        }
                        className="hidden"
                      />
                    </label>
                    {degreeFileName && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {degreeFileName}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Teaching Licence / QTS / PGCE (Optional, PDF or Image)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 border border-slate-300/80 transition-colors">
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>{uploadingLicence ? 'Uploading...' : 'Choose Licence (Optional)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          uploadSingleDocument(
                            e.target.files?.[0],
                            'teaching_licence_url',
                            setUploadingLicence,
                            setLicenceFileName,
                            'Teaching Licence Upload Failed'
                          )
                        }
                        className="hidden"
                      />
                    </label>
                    {licenceFileName && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {licenceFileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. A-Level Subject Specialisms (12 Cards) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    A-Level Subject Specialisms <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select all A-Level subjects you are certified and qualified to teach. You can choose multiple subjects.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALEVEL_SUBJECTS.map((subj) => {
                  const isSelected = formData.selected_subjects.includes(subj.name);
                  return (
                    <button
                      type="button"
                      key={subj.id}
                      onClick={() => handleSubjectToggle(subj.name)}
                      className={`text-left p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                          : 'bg-slate-50 hover:bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {subj.category}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-800'}`}>
                          {subj.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{subj.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {formData.selected_subjects.length > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
                  <span>
                    <strong>{formData.selected_subjects.length}</strong> subject
                    {formData.selected_subjects.length > 1 ? 's' : ''} selected: {formData.selected_subjects.join(', ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, selected_subjects: [] }))}
                    className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* 4. Teaching Philosophy & Approach */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Teaching Philosophy &amp; Approach</h2>
                  <p className="text-xs text-slate-500">
                    How do you break down difficult concepts and adapt to student learning paces?
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pedagogical Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="teaching_approach"
                  required
                  rows={4}
                  value={formData.teaching_approach}
                  onChange={handleChange}
                  placeholder="Explain how you diagnose student learning gaps, adapt to diverse learning styles, utilize past-paper exam technique (AQA/Edexcel/OCR), and foster student confidence..."
                  className="w-full p-3.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* 5. Mandatory Evaluation Requirement — 3-Minute Introductory Video */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                  5
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>Mandatory Evaluation Requirement</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">3-Minute Introductory Video</h2>
                  <p className="text-xs text-slate-500">
                    Every tutor on our waiting list must submit a 3-minute video introduction. Our Superadmin panel will review it when onboarding opens.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 text-xs text-purple-950 space-y-2.5">
                <h4 className="font-extrabold text-sm text-purple-900 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-purple-600 shrink-0" />
                  What to include in your 3-minute video:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>Professional Introduction:</strong> State your full name, academic background, and passion for education.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>Teaching Experience:</strong> Summarize your history preparing secondary / A-Level students for UK exam boards.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>Specific Qualifications:</strong> Detail your degrees and subject mastery in your chosen A-Levels.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>Teaching Approach:</strong> Explain how you make challenging concepts intuitive and maintain student focus.
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Shareable Video Link (Google Drive, YouTube, Loom, or Vimeo) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="video_url"
                    required
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/file/d/... or https://youtu.be/... or https://loom.com/share/..."
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900"
                  />
                </div>
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Upload your 3-minute video to <strong>Google Drive</strong>, <strong>YouTube (unlisted)</strong>, <strong>Loom</strong>, or <strong>Vimeo</strong>, and paste the shareable link here. Please ensure access permissions are set to <strong>&quot;Anyone with the link can view&quot;</strong> so our evaluation panel can watch it.
                  </span>
                </div>
              </div>

              {/* Embedded Test Player Preview */}
              {formData.video_url && (() => {
                const embedInfo = getEmbedVideoUrl(formData.video_url);
                if (!embedInfo) return null;
                return (
                  <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-3 shadow-md border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-purple-400 fill-current" />
                        <span className="text-xs font-bold text-purple-300">Test Video Link Preview</span>
                      </div>
                      <a
                        href={formData.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-300 hover:text-white underline flex items-center gap-1"
                      >
                        <span>Open in New Tab</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                      <iframe
                        src={embedInfo.src}
                        title="Tutor Video Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 6. UK DfE Statutory Compliance — Safeguarding & Child Protection Policy */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                  6
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>UK DfE Statutory Compliance</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Safeguarding &amp; Child Protection Policy
                  </h2>
                  <p className="text-xs text-slate-500">
                    Every tutor must thoroughly read and formally acknowledge this policy before being onboarded.
                  </p>
                </div>
              </div>

              {/* Embedded Official Policy Document (Waitlist Variant) */}
              <div className="max-h-96 overflow-y-auto rounded-2xl border border-slate-300/80 shadow-inner p-1">
                <SafeguardingPolicyDocument variant="waitlist" />
              </div>

              {/* Enhanced DBS Status Declaration */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  Enhanced DBS Status Declaration <span className="text-rose-500">*</span>
                </label>
                <select
                  name="dbs_status"
                  value={formData.dbs_status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="Enhanced DBS on Update Service">I hold an Enhanced DBS registered on the UK Update Service</option>
                  <option value="Enhanced DBS Certificate Available">I hold a valid Enhanced DBS Certificate (within past 12 months)</option>
                  <option value="Willing to undergo Enhanced DBS check">I do not have a DBS and am willing to undergo an Enhanced DBS check via Beacon Bridge Academics</option>
                  <option value="International Police Clearance">I am located outside the UK and hold valid International Police Clearance</option>
                </select>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    DBS Certificate Number (If applicable)
                  </label>
                  <input
                    type="text"
                    name="dbs_certificate_number"
                    value={formData.dbs_certificate_number}
                    onChange={handleChange}
                    placeholder="e.g. 001594837201"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Statutory Checkboxes (Exact Client Copy) */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="safeguarding_acknowledged"
                    checked={formData.safeguarding_acknowledged}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                    I have thoroughly read, understood, and solemnly agree to uphold the Beacon Bridge Academics Safeguarding &amp; Child Protection Policy (v2.4) and the Safe Online Tutoring Code of Conduct. <span className="text-rose-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dbs_consent"
                    checked={formData.dbs_consent}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                    I understand that if invited to onboard, I will be subject to pre-employment background and Enhanced DBS checks, and that all live lessons are recorded for child protection and quality oversight. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Digital Legal Signature */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Digital Legal Signature (Type your Full Legal Name) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    name="safeguarding_signature"
                    required
                    value={formData.safeguarding_signature}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Jonathan Richard Hayes"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"
                  />
                  <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200 text-center shrink-0">
                    Timestamp: {new Date().toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button & Small Print (Exact Client Copy) */}
            <div className="pt-2 text-center space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#001f3f] hover:bg-[#050167] text-white font-black text-sm tracking-wide shadow-xl shadow-[#001f3f]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Joining the Tutor Waiting List...</span>
                  </>
                ) : (
                  <>
                    <span>Join the Tutor Waiting List</span>
                    <ArrowRight className="w-4 h-4 text-[#40ffa7]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
                By submitting, you declare that all qualifications, video materials, and safeguarding representations are genuine. Joining the waiting list is not an offer of employment.
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Clean Minimal Standalone Footer */}
      <footer className="bg-[#001f3f] text-[#f0faff]/75 text-xs border-t border-[#050167]/60 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-md">
              <div className="inline-block bg-white px-3 py-1.5 rounded-xl shadow-sm">
                <img src="/logo.png" alt="Beacon Bridge Academics" className="h-8 w-auto object-contain" />
              </div>
              <p className="text-[#f0faff]/80 leading-relaxed">
                Beacon Bridge Academics &bull; 41 Great Oaks Avenue, Warren Wood, Gainsborough, DN21 1AE, UK
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#f0faff]/85">
                <a href="mailto:info@beaconbridgeacademics.co.uk" className="inline-flex items-center gap-1.5 hover:text-[#40ffa7] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#40ffa7]" />
                  <span>info@beaconbridgeacademics.co.uk</span>
                </a>
                <a href="https://wa.me/447414663735" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#40ffa7] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#40ffa7]" />
                  <span>+44 7414 663735</span>
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#40ffa7]" />
                  <span>UK, US, Canada &amp; Australia</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/BeaconAcademics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@BeaconBridgeAcademics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@beacon.academics.uk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://x.com/BBacademicsuk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#40ffa7] text-white hover:text-[#001f3f] flex items-center justify-center transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#f0faff]/60">
            <p>&copy; {new Date().getFullYear()} Beacon Bridge Academics. All rights reserved.</p>
            <div className="flex items-center space-x-5">
              <a
                href="https://beaconbridgeacademics.co.uk/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#40ffa7] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://beaconbridgeacademics.co.uk/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#40ffa7] transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="mailto:safeguarding@beaconbridgeacademics.co.uk"
                className="hover:text-[#40ffa7] transition-colors"
              >
                Safeguarding Team
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
