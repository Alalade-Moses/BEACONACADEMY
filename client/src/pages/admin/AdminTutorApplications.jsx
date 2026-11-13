import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  GraduationCap,
  Video,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Play,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertTriangle,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  X,
  Trash2
} from 'lucide-react';

const ALL_ALEVEL_SUBJECTS = [
  'A-Level Mathematics',
  'A-Level English',
  'A-Level English Literature',
  'A-Level Physics',
  'A-Level Chemistry',
  'A-Level Biology',
  'A-Level Environmental Science',
  'A-Level Psychology',
  'A-Level Sociology',
  'A-Level Economics',
  'A-Level Business study',
  'A-Level Philosophy'
];

export const AdminTutorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Application for Modal Evaluation
  const [selectedApp, setSelectedApp] = useState(null);
  const [evalNotes, setEvalNotes] = useState('');
  const [evalSubmitting, setEvalSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (subjectFilter !== 'all') params.subject = subjectFilter;

      const res = await api.get('/tutor-applications', { params });
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load tutor applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, subjectFilter]);

  // Open Evaluation Modal
  const openEvaluationModal = (app) => {
    setSelectedApp(app);
    setEvalNotes(app.admin_notes || '');
    setActionSuccessMsg('');
  };

  // Close Modal
  const closeEvaluationModal = () => {
    setSelectedApp(null);
    setEvalNotes('');
    setActionSuccessMsg('');
  };

  // Update Status Handler
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp) return;

    setEvalSubmitting(true);
    setActionSuccessMsg('');
    try {
      const res = await api.put(`/tutor-applications/${selectedApp.id}/status`, {
        status: newStatus,
        admin_notes: evalNotes
      });

      if (res.data.success) {
        setActionSuccessMsg(`Application status updated to "${newStatus}". ${newStatus === 'approved' ? 'Tutor account provisioned.' : ''}`);
        // Update local list
        setApplications(prev => prev.map(a => a.id === selectedApp.id ? res.data.application : a));
        setSelectedApp(res.data.application);
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setEvalSubmitting(false);
    }
  };

  // Permanently Delete Application and Video Handler
  const handleDeleteApplication = async (id, applicantName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the application for "${applicantName}"? This will permanently delete their 3-minute video and uploaded CV from storage to free up disk space.`)) {
      return;
    }
    try {
      setEvalSubmitting(true);
      const res = await api.delete(`/tutor-applications/${id}`);
      if (res.data.success) {
        setApplications(prev => prev.filter(a => a.id !== id));
        if (selectedApp?.id === id) {
          setSelectedApp(null);
        }
        alert('Application and uploaded video permanently removed from storage.');
      }
    } catch (err) {
      alert('Failed to delete application: ' + (err.response?.data?.message || err.message));
    } finally {
      setEvalSubmitting(false);
    }
  };

  // Filtered List
  const filteredApps = applications.filter(app => {
    const term = searchTerm.toLowerCase();
    const matchesName = app.full_name?.toLowerCase().includes(term);
    const matchesEmail = app.email?.toLowerCase().includes(term);
    const matchesQual = app.highest_qualification?.toLowerCase().includes(term);
    const matchesSubj = app.selected_subjects?.some(s => s.toLowerCase().includes(term));
    return matchesName || matchesEmail || matchesQual || matchesSubj;
  });

  // Summary Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const underReviewCount = applications.filter(a => a.status === 'under_review').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Video Review
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Under Evaluation
          </span>
        );
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved Faculty
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold mb-3 border border-white/10">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Superadmin Faculty Portal &bull; A-Level Tutor Recruitment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teacher Applications & 3-Minute Video Evaluations
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Review incoming educator submissions, evaluate introductory 3-minute pedagogical videos, audit UK safeguarding acknowledgements, and approve verified A-Level tutors.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Total Applications</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm bg-amber-50/20">
          <span className="text-[10px] font-bold uppercase text-amber-600 block tracking-wider">Pending Review</span>
          <span className="text-2xl font-black text-amber-700 mt-0.5 block">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm bg-blue-50/20">
          <span className="text-[10px] font-bold uppercase text-blue-600 block tracking-wider">Under Evaluation</span>
          <span className="text-2xl font-black text-blue-700 mt-0.5 block">{underReviewCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm bg-emerald-50/20">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block tracking-wider">Approved Tutors</span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{approvedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm bg-rose-50/20 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-rose-600 block tracking-wider">Rejected</span>
          <span className="text-2xl font-black text-rose-700 mt-0.5 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by teacher name, email, qualification, or subject..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none font-bold text-slate-700"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="pending">Pending Review ({pendingCount})</option>
            <option value="under_review">Under Evaluation ({underReviewCount})</option>
            <option value="approved">Approved Faculty ({approvedCount})</option>
            <option value="rejected">Rejected ({rejectedCount})</option>
          </select>

          {/* A-Level Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none font-bold text-slate-700 max-w-[200px]"
          >
            <option value="all">All 12 A-Level Subjects</option>
            {ALL_ALEVEL_SUBJECTS.map((subj) => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>

          <button
            onClick={fetchApplications}
            title="Refresh List"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Teacher Applications Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'New teacher applications submitted on the website will appear here for Superadmin review.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              {/* Applicant Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{app.full_name}</h3>
                  {getStatusBadge(app.status)}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ref: {app.id.slice(0, 16)}...
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {app.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {app.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {app.current_role} ({app.years_experience})
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  <strong>Academic Credential:</strong> {app.highest_qualification}
                </div>

                {/* Selected A-Level Subjects Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {app.selected_subjects?.map((subj) => (
                    <span
                      key={subj}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200"
                    >
                      {subj}
                    </span>
                  ))}
                </div>

                {/* Safeguarding & DBS Badge */}
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Safeguarding Policy v2.4 Signed: {app.safeguarding_signature} ({new Date(app.safeguarding_signed_at || app.created_at).toLocaleDateString('en-GB')})
                  </span>
                  <span>&bull;</span>
                  <span>{app.dbs_status}</span>
                </div>
              </div>

              {/* Action Buttons & Video Tag */}
              <div className="flex items-center space-x-2 shrink-0 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {app.video_url && (
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>3-Min Video Attached</span>
                  </span>
                )}

                <button
                  onClick={() => openEvaluationModal(app)}
                  className="px-4 py-2 rounded-xl bg-[#001f3f] hover:bg-[#050167] text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Evaluate Application</span>
                </button>

                <button
                  onClick={() => handleDeleteApplication(app.id, app.full_name)}
                  title="Permanently Delete Application and Video"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors border border-slate-200 hover:border-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVALUATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedApp.full_name}</h3>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <span className="text-xs text-slate-500">
                    Application ID: {selectedApp.id} &bull; Submitted {new Date(selectedApp.created_at).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <button
                onClick={closeEvaluationModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">

              {actionSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* 1. THE 3-MINUTE INTRODUCTORY VIDEO PLAYER */}
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-extrabold flex items-center gap-2 text-purple-300">
                    <Video className="w-4 h-4 text-purple-400" />
                    Applicant 3-Minute Introductory Video
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedApp.video_duration || 'Approx. 3 minutes'}
                  </span>
                </div>

                {selectedApp.video_url ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800 flex items-center justify-center">
                    {selectedApp.video_url.includes('youtube.com') || selectedApp.video_url.includes('youtu.be') ? (
                      <iframe
                        src={selectedApp.video_url.replace('watch?v=', 'embed/')}
                        title="Applicant Video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : selectedApp.video_url.includes('loom.com') ? (
                      <iframe
                        src={selectedApp.video_url.replace('/share/', '/embed/')}
                        title="Applicant Video"
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={selectedApp.video_url}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No video file URL attached.
                  </div>
                )}

                {/* Superadmin Evaluation Rubric Guide */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-1.5 bg-black/40 rounded-lg">
                    <strong className="block text-purple-400 mb-0.5">&bull; 1. Clarity & Tone</strong>
                    Articulate English, confident and welcoming.
                  </div>
                  <div className="p-1.5 bg-black/40 rounded-lg">
                    <strong className="block text-purple-400 mb-0.5">&bull; 2. Experience</strong>
                    Evidence of UK GCSE/A-Level exam mastery.
                  </div>
                  <div className="p-1.5 bg-black/40 rounded-lg">
                    <strong className="block text-purple-400 mb-0.5">&bull; 3. Pedagogy</strong>
                    Sound methods for unpacking hard concepts.
                  </div>
                  <div className="p-1.5 bg-black/40 rounded-lg">
                    <strong className="block text-purple-400 mb-0.5">&bull; 4. Safeguarding</strong>
                    Professional demeanor & neutral space.
                  </div>
                </div>
              </div>

              {/* 2. Applicant Profile & A-Level Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Academic & Background */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Academic Background & Credentials
                  </h4>
                  
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Highest Qualification:</span>
                      <span className="font-bold text-slate-900">{selectedApp.highest_qualification}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Current Role & Experience:</span>
                      <span className="font-semibold text-slate-800">{selectedApp.current_role} &bull; {selectedApp.years_experience}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Location:</span>
                      <span className="font-semibold text-slate-800">{selectedApp.location}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Info:</span>
                      <span className="font-mono text-slate-800">{selectedApp.email} | {selectedApp.phone}</span>
                    </div>

                    {selectedApp.cv_url && (
                      <div className="pt-1">
                        <a
                          href={selectedApp.cv_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Uploaded CV / Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* A-Level Subjects Applied For */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    A-Level Subject Specialisms
                  </h4>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.selected_subjects?.map((subj) => (
                      <span
                        key={subj}
                        className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-brand-600 text-white shadow-sm"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Teaching Philosophy & Approach:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200">
                      &ldquo;{selectedApp.teaching_approach || 'No teaching approach statement provided.'}&rdquo;
                    </p>
                  </div>
                </div>

              </div>

              {/* 3. Safeguarding Audit & Legal Verification */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    UK Statutory Safeguarding Audit & Acknowledgement
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                    {selectedApp.safeguarding_version || 'v2.4-2026-UK-DFE-COMPLIANT'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950 pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">Digital Signature:</span>
                    <span className="font-bold text-slate-900">{selectedApp.safeguarding_signature}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">Signed Timestamp:</span>
                    <span className="font-mono text-slate-800">{new Date(selectedApp.safeguarding_signed_at || selectedApp.created_at).toLocaleString('en-GB')}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">DBS Clearance Status:</span>
                    <span className="font-bold text-slate-900">{selectedApp.dbs_status}</span>
                    {selectedApp.dbs_certificate_number && (
                      <span className="block text-[10px] font-mono text-slate-500">Cert: {selectedApp.dbs_certificate_number}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Superadmin Evaluation Notes & Decision Buttons */}
              <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Superadmin Evaluation & Faculty Decision
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Evaluation Notes / Interview Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                    placeholder="Document your evaluation of their 3-minute video, pedagogical clarity, DBS checks, and subject assignment recommendations..."
                    className="w-full p-3 text-xs bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('under_review')}
                      disabled={evalSubmitting}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      Mark Under Review
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={evalSubmitting}
                      className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteApplication(selectedApp.id, selectedApp.full_name)}
                      disabled={evalSubmitting}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Video & App</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={evalSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Approve Tutor & Provision Account</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
