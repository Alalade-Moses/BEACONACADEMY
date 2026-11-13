import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { SafeguardingPolicyDocument } from '../../components/safeguarding/SafeguardingPolicyDocument';
import {
  GraduationCap,
  ShieldCheck,
  Video,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Play,
  X,
  FileCheck,
  Film
} from 'lucide-react';

export const ALEVEL_SUBJECTS = [
  { id: 'math', name: 'A-Level Mathematics', category: 'STEM', desc: 'Pure Math, Mechanics, Statistics' },
  { id: 'eng', name: 'A-Level English', category: 'Humanities', desc: 'Language, Linguistics, Composition' },
  { id: 'eng-lit', name: 'A-Level English Literature', category: 'Humanities', desc: 'Poetry, Prose, Drama, Critical Theory' },
  { id: 'physics', name: 'A-Level Physics', category: 'STEM', desc: 'Mechanics, Quantum, Electricity, Fields' },
  { id: 'chemistry', name: 'A-Level Chemistry', category: 'STEM', desc: 'Organic, Inorganic, Physical Chemistry' },
  { id: 'biology', name: 'A-Level Biology', category: 'STEM', desc: 'Cellular, Genetics, Physiology, Ecology' },
  { id: 'env-sci', name: 'A-Level Environmental Science', category: 'STEM', desc: 'Ecosystems, Sustainability, Climate' },
  { id: 'psychology', name: 'A-Level Psychology', category: 'Social Sciences', desc: 'Cognitive, Developmental, Psychopathology' },
  { id: 'sociology', name: 'A-Level Sociology', category: 'Social Sciences', desc: 'Education, Crime, Stratification, Media' },
  { id: 'economics', name: 'A-Level Economics', category: 'Business & Finance', desc: 'Microeconomics, Macroeconomics, Trade' },
  { id: 'business', name: 'A-Level Business study', category: 'Business & Finance', desc: 'Marketing, Finance, Operations, Strategy' },
  { id: 'philosophy', name: 'A-Level Philosophy', category: 'Humanities', desc: 'Epistemology, Moral Philosophy, Metaphysics' }
];

export const TeacherApplicationPage = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    highest_qualification: '',
    years_experience: '3-5 years',
    current_role: '',
    selected_subjects: [],
    bio: '',
    teaching_approach: '',
    video_url: '',
    video_duration: '',
    video_filename: '',
    cv_url: '',
    safeguarding_acknowledged: false,
    safeguarding_signature: '',
    dbs_consent: false,
    dbs_status: 'Enhanced DBS on Update Service',
    dbs_certificate_number: ''
  });

  // Video Upload / Link Mode
  const [videoInputMode, setVideoInputMode] = useState('upload'); // 'upload' | 'link'
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoError, setVideoError] = useState('');

  // CV Upload
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvFileName, setCvFileName] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Toggle A-Level Subjects
  const handleSubjectToggle = (subjectName) => {
    setFormData(prev => {
      const exists = prev.selected_subjects.includes(subjectName);
      if (exists) {
        return {
          ...prev,
          selected_subjects: prev.selected_subjects.filter(s => s !== subjectName)
        };
      } else {
        return {
          ...prev,
          selected_subjects: [...prev.selected_subjects, subjectName]
        };
      }
    });
  };

  // Video File Upload Handler
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError('');
    // Size check (max 150MB)
    if (file.size > 150 * 1024 * 1024) {
      setVideoError('Video file exceeds 150MB limit. Please compress or provide a link.');
      return;
    }

    const uploadPayload = new FormData();
    uploadPayload.append('file', file);

    setUploadingVideo(true);
    setVideoUploadProgress(15);

    try {
      const timer = setInterval(() => {
        setVideoUploadProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 300);

      const res = await api.post('/upload', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(timer);
      setVideoUploadProgress(100);

      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          video_url: res.data.url,
          video_filename: res.data.filename || file.name,
          video_duration: 'Approx. 3 minutes'
        }));
      } else {
        setVideoError(res.data.message || 'Failed to process video file.');
      }
    } catch (err) {
      setVideoError(err.response?.data?.message || err.message || 'Failed to upload video.');
    } finally {
      setUploadingVideo(false);
    }
  };

  // CV Document Upload Handler
  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadPayload = new FormData();
    uploadPayload.append('file', file);

    setUploadingCv(true);
    try {
      const res = await api.post('/upload', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, cv_url: res.data.url }));
        setCvFileName(file.name);
      }
    } catch (err) {
      alert('Failed to upload CV: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingCv(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-flight validation
    if (formData.selected_subjects.length === 0) {
      setErrorMsg('Please select at least one A-Level subject you are qualified to teach.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    if (!formData.video_url) {
      setErrorMsg('A 3-minute introductory video is required for all teacher applications.');
      window.scrollTo({ top: 700, behavior: 'smooth' });
      return;
    }

    if (!formData.safeguarding_acknowledged || !formData.dbs_consent) {
      setErrorMsg('You must read and acknowledge the Safeguarding & Child Protection Policy and consent to DBS verification.');
      return;
    }

    if (!formData.safeguarding_signature.trim()) {
      setErrorMsg('Please enter your full legal name as a digital signature for safeguarding verification.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/tutor-applications', formData);
      if (res.data.success) {
        setSubmittedApp(res.data.application);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      
      {/* Top Banner / Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-700 text-xs font-bold border border-brand-500/20 mb-3 shadow-sm">
          <GraduationCap className="w-4 h-4 text-brand-600" />
          <span>Beacon Bridge Academics &bull; Faculty Recruitment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
          Join Our Elite A-Level Faculty
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Educate motivated students across the UK, US, Canada, and Australia. Enjoy flexible online scheduling, competitive compensation in £ GBP, interactive virtual classroom tools, and complete administrative support.
        </p>

        {/* 3 Pillars Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Safeguarding First</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Rigorous UK DfE KCSIE standards and Enhanced DBS vetting.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">3-Min Video Intro</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Showcase your teaching approach and subject passion to Superadmin.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">12 A-Level Subjects</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Specialised tutoring across Sciences, Math, Humanities & Economics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Modal / Screen */}
        {submittedApp ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border-2 border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block">
                Application Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Thank You, {submittedApp.full_name}!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your application for <strong>{submittedApp.selected_subjects.join(', ')}</strong> has been registered under Application Reference:
              </p>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-800 border border-slate-200">
                {submittedApp.id}
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-600 space-y-3 max-w-lg mx-auto">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Clock className="w-4 h-4 text-brand-600" />
                What Happens Next (Evaluation Process):
              </h4>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><strong>Video & Pedagogy Review</strong>: Our Superadmin panel evaluates your 3-minute video introduction, assessing communication clarity, subject depth, and student engagement style.</li>
                <li><strong>Safeguarding & DBS Audit</strong>: Your safeguarding sign-off and DBS status are verified against UK DfE statutory guidelines.</li>
                <li><strong>Notification within 48 Hours</strong>: Upon approval, your official Beacon Bridge Educator faculty credentials will be dispatched to <strong>{submittedApp.email}</strong>.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#001f3f] text-white hover:bg-[#050167] text-xs font-bold transition-all shadow-md"
              >
                Return to Homepage
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
              >
                Access Tutor Portal Login
              </Link>
            </div>
          </div>
        ) : (
          /* Teacher Application Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* CARD 1: Personal & Contact Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Personal & Contact Information</h3>
                  <p className="text-xs text-slate-500">Provide your official legal contact details for faculty onboarding.</p>
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
                      placeholder="e.g. eleanor.vance@university.ac.uk"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
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
                    Current Location / City & Country <span className="text-rose-500">*</span>
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

            {/* CARD 2: Qualifications & Experience */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Academic Qualifications & Background</h3>
                  <p className="text-xs text-slate-500">Provide details on your university degrees, teaching credentials, and experience.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Highest Academic Qualification & University <span className="text-rose-500">*</span>
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
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 border border-slate-300/80 transition-colors">
                      <UploadCloud className="w-4 h-4 text-slate-500" />
                      <span>{uploadingCv ? 'Uploading...' : 'Choose CV Document'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvUpload}
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
              </div>
            </div>

            {/* CARD 3: A-Level Subject Specialisms (The 12 Subjects) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    A-Level Subject Specialisms <span className="text-rose-500">*</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select all A-Level subjects you are certified and qualified to teach. You can choose multiple subjects.
                  </p>
                </div>
              </div>

              {/* Subject Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALEVEL_SUBJECTS.map((subj) => {
                  const isSelected = formData.selected_subjects.includes(subj.name);
                  return (
                    <div
                      key={subj.id}
                      onClick={() => handleSubjectToggle(subj.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                          : 'bg-slate-50 hover:bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {subj.category}
                        </span>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="mt-2.5">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-800'}`}>
                          {subj.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {subj.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.selected_subjects.length > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span><strong>{formData.selected_subjects.length}</strong> subject{formData.selected_subjects.length > 1 ? 's' : ''} selected: {formData.selected_subjects.join(', ')}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, selected_subjects: [] }))}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* CARD 4: Pedagogy & Teaching Philosophy */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Teaching Philosophy & Approach</h3>
                  <p className="text-xs text-slate-500">How do you break down difficult concepts and adapt to student learning paces?</p>
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

            {/* CARD 5: 3-Minute Video Introduction (Mandatory) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>Mandatory Evaluation Requirement</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    3-Minute Introductory Video
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every educator must submit a 3-minute video introduction evaluated by our Superadmin panel.
                  </p>
                </div>
              </div>

              {/* Instructions Callout Box */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 text-xs text-purple-950 space-y-2.5">
                <h4 className="font-extrabold text-sm text-purple-900 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-purple-600 shrink-0" />
                  What to include in your 3-minute video:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>1. Professional Introduction:</strong> State your full name, academic background, and passion for education.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>2. Teaching Experience:</strong> Summarize your history preparing secondary / A-Level students for UK exam boards.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>3. Specific Qualifications:</strong> Detail your degrees and subject mastery in your chosen A-Levels.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-200/60">
                    <strong>4. Teaching Approach:</strong> Explain how you make challenging concepts intuitive and maintain student focus.
                  </div>
                </div>
              </div>

              {/* Toggle Video Upload vs URL Link */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setVideoInputMode('upload')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    videoInputMode === 'upload' ? 'bg-[#001f3f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Upload Video File (MP4, WebM, MOV)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoInputMode('link')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    videoInputMode === 'link' ? 'bg-[#001f3f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Paste Video URL (Loom, YouTube, Drive)
                </button>
              </div>

              {/* Upload Mode */}
              {videoInputMode === 'upload' ? (
                <div className="space-y-3">
                  <label className="block border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-purple-50/30">
                    <Video className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">
                      {uploadingVideo ? 'Uploading your 3-minute video...' : 'Click to select or drag & drop your 3-minute video'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Supports MP4, WebM, MOV up to 150MB
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/mov"
                      onChange={handleVideoFileUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </label>

                  {uploadingVideo && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-purple-700">
                        <span>Uploading introductory video...</span>
                        <span>{videoUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${videoUploadProgress}%` }}
                          className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}

                  {videoError && (
                    <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {videoError}
                    </p>
                  )}
                </div>
              ) : (
                /* Link Mode */
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Unlisted Video URL (YouTube, Loom, Vimeo, Google Drive)
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://www.loom.com/share/... or https://youtu.be/..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Please ensure the video permission is set to <strong>"Anyone with the link can view"</strong>.
                  </p>
                </div>
              )}

              {/* Video Active Confirmation Preview */}
              {formData.video_url && (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shrink-0 text-purple-400">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold block truncate">
                        {formData.video_filename || '3-Minute Teacher Introductory Video'}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready for Superadmin Evaluation
                      </span>
                    </div>
                  </div>

                  <a
                    href={formData.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-center shrink-0"
                  >
                    Preview Video
                  </a>
                </div>
              )}
            </div>

            {/* CARD 6: Safeguarding Policy Document & Acknowledgment */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>UK DfE Statutory Compliance</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Safeguarding & Child Protection Policy
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every teacher must thoroughly read and formally acknowledge this policy prior to employment.
                  </p>
                </div>
              </div>

              {/* Embedded Official Policy Document Component */}
              <div className="max-h-96 overflow-y-auto rounded-2xl border border-slate-300/80 shadow-inner p-1">
                <SafeguardingPolicyDocument />
              </div>

              {/* DBS Disclosure Declaration */}
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

              {/* Legal Acknowledgment Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="safeguarding_acknowledged"
                    checked={formData.safeguarding_acknowledged}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                    I have thoroughly read, understood, and solemnly agree to uphold the Beacon Bridge Academics Safeguarding & Child Protection Policy (v2.4) and the Safe Online Tutoring Code of Conduct. <span className="text-rose-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dbs_consent"
                    checked={formData.dbs_consent}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed font-semibold">
                    I consent to pre-employment background and Enhanced DBS checks, and understand that all live lessons are recorded for child protection and quality oversight. <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Digital Signature */}
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

            {/* Submission Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#001f3f] hover:bg-[#050167] text-white font-black text-sm tracking-wide shadow-xl shadow-[#001f3f]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application to Superadmin...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Teacher Application for Superadmin Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                By submitting, you declare that all qualifications, video materials, and safeguarding representations are genuine.
              </p>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
