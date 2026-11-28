import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { showConfirm, showSuccess, showError } from '../../utils/swal';
import {
  ClipboardList,
  Video,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Play,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  RefreshCw,
  X,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Send,
  Download,
  UserCheck
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

  if (str.match(/\.(mp4|webm|mov|ogg)($|\?)/i)) {
    return { type: 'video', src: str };
  }

  return { type: 'iframe', src: str };
};

export const AdminTutorWaitlist = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Evaluation Modal State
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [evalNotes, setEvalNotes] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (subjectFilter !== 'all') params.subject = subjectFilter;

      const res = await api.get('/tutor-waitlist', { params });
      if (res.data.success) {
        setEntries(res.data.entries || []);
      }
    } catch (err) {
      console.error('Failed to load tutor waitlist:', err);
      showError('Load Failed', err.response?.data?.message || 'Could not load tutor waitlist entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [statusFilter, subjectFilter]);

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setEvalNotes(entry.admin_notes || '');
    setInviteMessage('');
    setVideoPlayerVisible(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setEvalNotes('');
    setInviteMessage('');
  };

  const handleUpdateStatus = async (newStatus, sendInviteEmail = false) => {
    if (!selectedEntry) return;

    if (newStatus === 'invited' && sendInviteEmail) {
      const confirmed = await showConfirm({
        title: 'Send Onboarding Invitation Email?',
        text: `This will mark ${selectedEntry.full_name} as Invited and send an official onboarding invitation email to ${selectedEntry.email}.`,
        confirmText: 'Yes, Mark Invited & Send Email',
        cancelText: 'Cancel',
        icon: 'question'
      });
      if (!confirmed) return;
    } else if (newStatus === 'declined') {
      const confirmed = await showConfirm({
        title: 'Decline Waitlist Entry?',
        text: `Mark ${selectedEntry.full_name} as declined on the Tutor Waitlist?`,
        confirmText: 'Yes, Mark Declined',
        cancelText: 'Cancel',
        icon: 'warning'
      });
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const res = await api.put(`/tutor-waitlist/${selectedEntry.id}/status`, {
        status: newStatus,
        admin_notes: evalNotes,
        send_invite_email: sendInviteEmail,
        custom_message: inviteMessage
      });

      if (res.data.success) {
        setEntries((prev) => prev.map((e) => (e.id === selectedEntry.id ? res.data.entry : e)));
        setSelectedEntry(res.data.entry);
        await showSuccess('Waitlist Updated', res.data.message || `Status updated to "${newStatus}".`);
      }
    } catch (err) {
      showError('Update Failed', err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = await showConfirm({
      title: 'Delete Waitlist Entry?',
      text: `Permanently delete ${name} from the Tutor Waitlist along with any uploaded documents? This cannot be undone.`,
      confirmText: 'Yes, Delete Permanently',
      cancelText: 'Cancel',
      icon: 'warning'
    });
    if (!confirmed) return;

    try {
      setSubmitting(true);
      const res = await api.delete(`/tutor-waitlist/${id}`);
      if (res.data.success) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEntry?.id === id) setSelectedEntry(null);
        await showSuccess('Entry Deleted', 'Tutor waitlist entry permanently removed.');
      }
    } catch (err) {
      showError('Delete Failed', err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredEntries.length === 0) return;
    const headers = [
      'ID', 'Full Name', 'Email', 'Phone', 'Location', 'Qualification',
      'Experience', 'Current Role', 'Subjects', 'DBS Status', 'DBS Cert',
      'Video URL', 'Status', 'Joined Date'
    ];
    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = filteredEntries.map((e) => [
      e.id,
      e.full_name,
      e.email,
      e.phone,
      e.location,
      e.highest_qualification,
      e.years_experience,
      e.current_role,
      (e.selected_subjects || []).join('; '),
      e.dbs_status,
      e.dbs_certificate_number || '',
      e.video_url,
      e.status,
      new Date(e.created_at).toISOString()
    ].map(escapeCsv).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beacon-bridge-tutor-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter((entry) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      entry.full_name?.toLowerCase().includes(term) ||
      entry.email?.toLowerCase().includes(term) ||
      entry.location?.toLowerCase().includes(term) ||
      entry.highest_qualification?.toLowerCase().includes(term) ||
      entry.selected_subjects?.some((s) => s.toLowerCase().includes(term))
    );
  });

  const totalCount = entries.length;
  const waitlistedCount = entries.filter((e) => e.status === 'waitlisted').length;
  const shortlistedCount = entries.filter((e) => e.status === 'shortlisted').length;
  const invitedCount = entries.filter((e) => e.status === 'invited').length;
  const onboardedCount = entries.filter((e) => e.status === 'onboarded').length;
  const declinedCount = entries.filter((e) => e.status === 'declined').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waitlisted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Waitlisted
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <Star className="w-3 h-3" />
            Shortlisted
          </span>
        );
      case 'invited':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
            <Send className="w-3 h-3" />
            Invited to Onboard
          </span>
        );
      case 'onboarded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Onboarded
          </span>
        );
      case 'declined':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#001f3f] via-[#050167] to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#40ffa7]/15 text-[#40ffa7] text-xs font-bold mb-3 border border-[#40ffa7]/30">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>tutors.beaconbridgeacademics.co.uk &bull; Pre-Launch Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tutor Waitlist
            </h1>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Manage A-Level educators registered on the standalone Tutor Waiting List, watch their 3-minute introductory videos, audit safeguarding acknowledgements, and invite shortlisted tutors when onboarding opens.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredEntries.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Total Waitlist</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm bg-amber-50/20">
          <span className="text-[10px] font-bold uppercase text-amber-600 block tracking-wider">Waitlisted</span>
          <span className="text-2xl font-black text-amber-700 mt-0.5 block">{waitlistedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-indigo-200/80 shadow-sm bg-indigo-50/20">
          <span className="text-[10px] font-bold uppercase text-indigo-600 block tracking-wider">Shortlisted</span>
          <span className="text-2xl font-black text-indigo-700 mt-0.5 block">{shortlistedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-200/80 shadow-sm bg-sky-50/20">
          <span className="text-[10px] font-bold uppercase text-sky-600 block tracking-wider">Invited</span>
          <span className="text-2xl font-black text-sky-700 mt-0.5 block">{invitedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm bg-emerald-50/20">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block tracking-wider">Onboarded</span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{onboardedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm bg-rose-50/20">
          <span className="text-[10px] font-bold uppercase text-rose-600 block tracking-wider">Declined</span>
          <span className="text-2xl font-black text-rose-700 mt-0.5 block">{declinedCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search waitlist by name, Gmail, location, qualification, or subject..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none font-bold text-slate-700"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="waitlisted">Waitlisted ({waitlistedCount})</option>
            <option value="shortlisted">Shortlisted ({shortlistedCount})</option>
            <option value="invited">Invited ({invitedCount})</option>
            <option value="onboarded">Onboarded ({onboardedCount})</option>
            <option value="declined">Declined ({declinedCount})</option>
          </select>

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
            onClick={fetchEntries}
            title="Refresh Waitlist"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waitlist Cards */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[280px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Waitlist Registrations Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all'
              ? 'Try clearing your search or status/subject filters.'
              : 'Educators who submit the form on tutors.beaconbridgeacademics.co.uk will appear here immediately.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">{entry.full_name}</h3>
                  {getStatusBadge(entry.status)}
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(entry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {entry.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {entry.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {entry.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {entry.current_role} ({entry.years_experience})
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  <strong>Qualification:</strong> {entry.highest_qualification}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {entry.selected_subjects?.map((subj) => (
                    <span
                      key={subj}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200"
                    >
                      {subj}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Safeguarding v2.4 Signed: {entry.safeguarding_signature}
                  </span>
                  <span>&bull;</span>
                  <span>{entry.dbs_status}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {entry.video_url && (
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>3-Min Video</span>
                  </span>
                )}

                <button
                  onClick={() => openModal(entry)}
                  className="px-4 py-2 rounded-xl bg-[#001f3f] hover:bg-[#050167] text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Review & Manage</span>
                </button>

                <button
                  onClick={() => handleDelete(entry.id, entry.full_name)}
                  title="Delete Waitlist Entry"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors border border-slate-200 hover:border-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WAITLIST REVIEW MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedEntry.full_name}</h3>
                    {getStatusBadge(selectedEntry.status)}
                  </div>
                  <span className="text-xs text-slate-500">
                    Ref: {selectedEntry.id} &bull; Joined {new Date(selectedEntry.created_at).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* 1. 3-Minute Video Player */}
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-white space-y-3 border border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-purple-300">
                      3-Minute Introductory Video
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    {selectedEntry.video_url && (
                      <button
                        type="button"
                        onClick={() => setVideoPlayerVisible(!videoPlayerVisible)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        {videoPlayerVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{videoPlayerVisible ? 'Hide Video' : 'Watch Video'}</span>
                      </button>
                    )}
                    {selectedEntry.video_url && (
                      <a
                        href={selectedEntry.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="Open Video in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {selectedEntry.video_url ? (
                  videoPlayerVisible ? (
                    (() => {
                      const embedInfo = getEmbedVideoUrl(selectedEntry.video_url);
                      return (
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                            {embedInfo.type === 'video' ? (
                              <video src={embedInfo.src} controls playsInline className="w-full h-full object-contain" />
                            ) : (
                              <iframe
                                src={embedInfo.src}
                                title="Waitlisted Tutor Video"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{selectedEntry.video_url}</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <span>Video player hidden.</span>
                      <button
                        type="button"
                        onClick={() => setVideoPlayerVisible(true)}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                      >
                        Watch Video
                      </button>
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">No video link attached.</div>
                )}
              </div>

              {/* 2. Profile & Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Academic Background & Documents
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Highest Qualification:</span>
                      <span className="font-bold text-slate-900">{selectedEntry.highest_qualification}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Current Role & Experience:</span>
                      <span className="font-semibold text-slate-800">{selectedEntry.current_role} &bull; {selectedEntry.years_experience}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location:</span>
                      <span className="font-semibold text-slate-800">{selectedEntry.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Info:</span>
                      <span className="font-mono text-slate-800 break-all">{selectedEntry.email} | {selectedEntry.phone}</span>
                    </div>

                    {selectedEntry.cv_url && (
                      <div className="pt-1">
                        <a href={selectedEntry.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700">
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Uploaded CV / Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {selectedEntry.degree_certificate_url && (
                      <div className="pt-1">
                        <a href={selectedEntry.degree_certificate_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Degree Certificate</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {selectedEntry.teaching_licence_url && (
                      <div className="pt-1">
                        <a href={selectedEntry.teaching_licence_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Teaching Licence / QTS</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    A-Level Subject Specialisms
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.selected_subjects?.map((subj) => (
                      <span key={subj} className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-brand-600 text-white shadow-sm">
                        {subj}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Pedagogical Statement:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200">
                      &ldquo;{selectedEntry.teaching_approach || 'No pedagogical statement provided.'}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Safeguarding Audit */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    UK Statutory Safeguarding Audit (v2.4 Waitlist Declaration)
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                    {selectedEntry.safeguarding_version || 'v2.4-2026-UK-DFE-WAITLIST'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950 pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">Digital Signature:</span>
                    <span className="font-bold text-slate-900">{selectedEntry.safeguarding_signature}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">Signed Timestamp:</span>
                    <span className="font-mono text-slate-800">{new Date(selectedEntry.safeguarding_signed_at || selectedEntry.created_at).toLocaleString('en-GB')}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold">DBS Declaration:</span>
                    <span className="font-bold text-slate-900">{selectedEntry.dbs_status}</span>
                    {selectedEntry.dbs_certificate_number && (
                      <span className="block text-[10px] font-mono text-slate-500">Cert: {selectedEntry.dbs_certificate_number}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Superadmin Notes & Waitlist Actions */}
              <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Superadmin Waitlist Review & Onboarding Actions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Internal Admin Notes
                    </label>
                    <textarea
                      rows={3}
                      value={evalNotes}
                      onChange={(e) => setEvalNotes(e.target.value)}
                      placeholder="Notes on video clarity, subject strength, DBS readiness, priority tier..."
                      className="w-full p-3 text-xs bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Optional Note for Onboarding Invite Email
                    </label>
                    <textarea
                      rows={3}
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Optional personalised note included if you click 'Invite to Onboard (Email)'..."
                      className="w-full p-3 text-xs bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('shortlisted', false)}
                      disabled={submitting}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Shortlist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('onboarded', false)}
                      disabled={submitting}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Onboarded</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('declined', false)}
                      disabled={submitting}
                      className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedEntry.id, selectedEntry.full_name)}
                      disabled={submitting}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('invited', true)}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#40ffa7] hover:bg-emerald-300 text-[#001f3f] font-black text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invite to Onboard (Send Email)</span>
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
