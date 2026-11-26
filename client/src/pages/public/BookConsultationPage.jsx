import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import api from '../../api/axios';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Video,
  Sparkles,
  ChevronRight,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

const ADVISOR = {
  name: 'Mr. Gideon Babs',
  title: 'Head of Academic Advisory & Admissions Director',
  qualifications: 'Lead Academic Strategist & Senior Curriculum Specialist, 12+ Yrs UK Curriculum Lead',
  avatar: '/advisor.jpg',
  bio: 'Specialist in diagnosing learning bottlenecks, exam board timing techniques (AQA, Edexcel, OCR), and structuring high-yield revision roadmaps for GCSE and A-Level students.'
};

// 20-Minute Consultation Schedule: Tuesday to Saturday
// Tuesday – Friday: 5:00 PM to 7:00 PM (6 slots of 20 mins)
// Saturday: 10:00 AM to 3:00 PM (15 slots of 20 mins)
const WEEKDAY_SLOTS = [
  { id: 'wd-1', time: '05:00 PM – 05:20 PM (UK GMT)', label: 'Evening Slot 1' },
  { id: 'wd-2', time: '05:20 PM – 05:40 PM (UK GMT)', label: 'Evening Slot 2' },
  { id: 'wd-3', time: '05:40 PM – 06:00 PM (UK GMT)', label: 'Evening Slot 3' },
  { id: 'wd-4', time: '06:00 PM – 06:20 PM (UK GMT)', label: 'Evening Slot 4' },
  { id: 'wd-5', time: '06:20 PM – 06:40 PM (UK GMT)', label: 'Evening Slot 5' },
  { id: 'wd-6', time: '06:40 PM – 07:00 PM (UK GMT)', label: 'Evening Slot 6' }
];

const SATURDAY_SLOTS = [
  { id: 'sat-1', time: '10:00 AM – 10:20 AM (UK GMT)', label: 'Morning Slot 1' },
  { id: 'sat-2', time: '10:20 AM – 10:40 AM (UK GMT)', label: 'Morning Slot 2' },
  { id: 'sat-3', time: '10:40 AM – 11:00 AM (UK GMT)', label: 'Morning Slot 3' },
  { id: 'sat-4', time: '11:00 AM – 11:20 AM (UK GMT)', label: 'Late Morning Slot 4' },
  { id: 'sat-5', time: '11:20 AM – 11:40 AM (UK GMT)', label: 'Late Morning Slot 5' },
  { id: 'sat-6', time: '11:40 AM – 12:00 PM (UK GMT)', label: 'Midday Slot 6' },
  { id: 'sat-7', time: '12:00 PM – 12:20 PM (UK GMT)', label: 'Midday Slot 7' },
  { id: 'sat-8', time: '12:20 PM – 12:40 PM (UK GMT)', label: 'Afternoon Slot 8' },
  { id: 'sat-9', time: '12:40 PM – 01:00 PM (UK GMT)', label: 'Afternoon Slot 9' },
  { id: 'sat-10', time: '01:00 PM – 01:20 PM (UK GMT)', label: 'Afternoon Slot 10' },
  { id: 'sat-11', time: '01:20 PM – 01:40 PM (UK GMT)', label: 'Afternoon Slot 11' },
  { id: 'sat-12', time: '01:40 PM – 02:00 PM (UK GMT)', label: 'Afternoon Slot 12' },
  { id: 'sat-13', time: '02:00 PM – 02:20 PM (UK GMT)', label: 'Late Afternoon Slot 13' },
  { id: 'sat-14', time: '02:20 PM – 02:40 PM (UK GMT)', label: 'Late Afternoon Slot 14' },
  { id: 'sat-15', time: '02:40 PM – 03:00 PM (UK GMT)', label: 'Late Afternoon Slot 15' }
];

const CONSULTATION_SCHEDULE = [
  { day: 'Tuesday', dateLabel: 'Every Tuesday (5:00 PM – 7:00 PM)', slots: WEEKDAY_SLOTS },
  { day: 'Wednesday', dateLabel: 'Every Wednesday (5:00 PM – 7:00 PM)', slots: WEEKDAY_SLOTS },
  { day: 'Thursday', dateLabel: 'Every Thursday (5:00 PM – 7:00 PM)', slots: WEEKDAY_SLOTS },
  { day: 'Friday', dateLabel: 'Every Friday (5:00 PM – 7:00 PM)', slots: WEEKDAY_SLOTS },
  { day: 'Saturday', dateLabel: 'Every Saturday (10:00 AM – 3:00 PM)', slots: SATURDAY_SLOTS }
];

const CURRICULUM_OPTIONS = [
  'Key Stage 2 / KS2 (Year 3–6 / Primary)',
  '11+ / 13+ Grammar & Independent School Entrance',
  'Key Stage 3 (Year 7–9)',
  'GCSE / IGCSE (Year 10–11)',
  'A-Levels / Sixth Form (Year 12–13)',
  'IELTS Academic & General Training',
  'Canadian High School (OSSD Grade 12)',
  'US High School & AP Courses',
  'Coding (Software Development) & Tech Track',
  'Other / Custom Curriculum'
];

const EXAM_BOARDS = [
  'A-Level (AQA / Edexcel / OCR / Cambridge CIE)',
  'AQA',
  'Edexcel (Pearson)',
  'OCR',
  'Cambridge International (CIE)',
  'Eduqas / WJEC',
  'Scottish Highers',
  'Primary SATs (KS2)',
  'Not Applicable / International'
];

export const BookConsultationPage = () => {
  const [selectedDay, setSelectedDay] = useState(CONSULTATION_SCHEDULE[0].day);
  const [selectedSlot, setSelectedSlot] = useState(CONSULTATION_SCHEDULE[0].slots[0]);
  const [consultationMode, setConsultationMode] = useState('WhatsApp Phone Call (+44)');

  const [formData, setFormData] = useState({
    parent_name: '',
    student_name: '',
    email: '',
    phone: '',
    curriculum: 'Key Stage 2 / KS2 (Year 3–6 / Primary)',
    subjects: 'Mathematics & English',
    exam_board: 'A-Level (AQA / Edexcel / OCR / Cambridge CIE)',
    current_grade: 'Working at Expected Standard',
    target_grade: 'Greater Depth / Grade 8-9 (A*)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedData, setBookedData] = useState(null);

  const activeDaySchedule = CONSULTATION_SCHEDULE.find(s => s.day === selectedDay) || CONSULTATION_SCHEDULE[0];

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const daySchedule = CONSULTATION_SCHEDULE.find(s => s.day === day);
    if (daySchedule && daySchedule.slots.length > 0) {
      setSelectedSlot(daySchedule.slots[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.parent_name || !formData.student_name || !formData.email || !formData.phone) {
      setError('Please fill in parent name, student name, email, and UK contact number.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        parent_name: formData.parent_name,
        student_name: formData.student_name,
        email: formData.email,
        phone: formData.phone,
        curriculum: formData.curriculum,
        subjects: formData.subjects,
        exam_board: formData.exam_board,
        current_grade: formData.current_grade,
        target_grade: formData.target_grade,
        consultation_day: selectedDay,
        consultation_time: selectedSlot?.time || activeDaySchedule.slots[0]?.time || '05:00 PM – 05:20 PM (UK GMT)',
        consultation_date: activeDaySchedule.dateLabel,
        consultant_name: ADVISOR.name,
        mode: consultationMode,
        notes: formData.notes
      };

      const res = await api.post('/consultations', payload);
      if (res.data.success) {
        setBookedData(res.data.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(res.data.message || 'Unable to confirm appointment. Please try again.');
      }
    } catch (err) {
      console.error('Consultation booking error:', err);
      setError(err.response?.data?.message || err.message || 'Unable to book consultation. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation View
  if (bookedData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 text-center relative overflow-hidden">
          
          {/* Top Rectangular Logo Header Banner matching container curves */}
          <div className="w-full bg-gradient-to-b from-[#f0faff] to-slate-50 border-b border-[#050167]/10 px-6 py-6 flex items-center justify-center rounded-t-3xl">
            <Link to="/" className="inline-block group">
              <img 
                src="/logo.png" 
                alt="Beacon Bridge Academics" 
                className="h-14 sm:h-16 w-auto max-w-[260px] object-contain transition-transform group-hover:scale-105" 
              />
            </Link>
          </div>

          <div className="p-8 sm:p-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              Consultation Confirmed &bull; Reference BBA-CNS-{bookedData.id?.slice(0, 8)?.toUpperCase()}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#001f3f] tracking-tight">
              We Look Forward to Meeting You!
            </h1>
            <p className="mt-2 text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              Your 1-on-1 academic consultation for <strong className="text-slate-900">{bookedData.student_name}</strong> has been scheduled with <strong className="text-slate-900">{bookedData.consultant_name}</strong>.
            </p>

          {/* Appointment Card */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-xl mx-auto space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Time</span>
              <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {bookedData.consultation_day} &bull; {bookedData.consultation_time}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Student Name:</span>
                <span className="font-bold text-slate-800 text-sm">{bookedData.student_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Parent / Guardian:</span>
                <span className="font-bold text-slate-800 text-sm">{bookedData.parent_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Curriculum / Level:</span>
                <span className="font-bold text-slate-800">{bookedData.curriculum}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Exam Board:</span>
                <span className="font-bold text-slate-800">{bookedData.exam_board || 'AQA / Edexcel'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Confirmed Email:</span>
                <span className="font-bold text-slate-800">{bookedData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Format:</span>
                <span className="font-bold text-slate-800">{bookedData.mode}</span>
              </div>
            </div>
          </div>

          {/* Email dispatch notice */}
          <div className="mt-6 p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs sm:text-sm text-left max-w-xl mx-auto flex items-start gap-3">
            <Mail className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <strong>Email Confirmation Dispatched:</strong> A formal calendar invitation and meeting link have been emailed to <span className="font-bold">{bookedData.email}</span> and our academic operations inbox (<span className="font-bold">info@beaconbridgeacademics.co.uk</span>).
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm shadow-md hover:shadow-lg transition-all"
            >
              Register with Us (Student & Parent Admission)
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO 
        title="Book a Free 20-Min Consultation | Beacon Bridge Academics"
        description="Book a complimentary 20-minute diagnostic consultation with Mr. Gideon Babs or our senior academic advisors to identify syllabus gaps and build an individualized tuition plan."
        canonicalPath="/book-consultation"
      />
      
      {/* Master Consultation Container Header — Animated Motion Image Background */}
      <style>{`
        @keyframes consultationKenBurns {
          0% { transform: scale(1.0) translate(0%, 0%); }
          50% { transform: scale(1.12) translate(-2%, -1.5%); }
          100% { transform: scale(1.04) translate(1.5%, 1%); }
        }
        .consultation-motion-bg {
          animation: consultationKenBurns 18s ease-in-out infinite alternate;
        }
      `}</style>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10">
        <div className="relative w-full overflow-hidden rounded-t-3xl">
          {/* Animated Motion Background Image */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Beacon Bridge 1-on-1 Academic Consultation"
            className="consultation-motion-bg absolute inset-0 w-full h-full object-cover object-center opacity-35"
          />
          {/* Deep Navy & Emerald Translucent Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f]/90 via-[#050167]/85 to-[#001f3f]/95" />
          {/* Animated orbs */}
          <div className="absolute top-[-30%] left-[-10%] w-80 h-80 bg-[#40ffa7]/25 rounded-full blur-[90px] animate-pulse" />
          <div className="absolute bottom-[-30%] right-[-10%] w-96 h-96 bg-[#2563eb]/30 rounded-full blur-[110px] animate-pulse" style={{animationDelay:'1s'}} />
          <div className="absolute top-[10%] right-[20%] w-48 h-48 bg-[#40ffa7]/15 rounded-full blur-[60px] animate-pulse" style={{animationDelay:'2s'}} />
          <div className="absolute bottom-[5%] left-[25%] w-56 h-56 bg-[#050167]/40 rounded-full blur-[80px] animate-pulse" style={{animationDelay:'0.5s'}} />
          {/* Mesh grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'linear-gradient(rgba(64,255,167,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(64,255,167,0.3) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
          {/* Logo */}
          <div className="relative z-10 px-6 py-6 sm:py-7 flex items-center justify-center border-b border-white/10">
            <Link to="/" className="inline-block group bg-white/95 px-4 py-2 rounded-2xl shadow-lg">
              <img
                src="/logo.png"
                alt="Beacon Bridge Academics"
                className="h-14 sm:h-16 w-auto max-w-[260px] object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
          {/* Hero text */}
          <div className="relative z-10 p-6 sm:p-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] text-xs font-black uppercase tracking-wider mb-3 border border-[#40ffa7]/40 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Complimentary 1-on-1 Academic Consultation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Book a 1-on-1 Consultation
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#f0faff]/80 max-w-2xl mx-auto leading-relaxed">
              Discuss your child&apos;s academic targets, diagnostic exam assessments, and bespoke study plans with our Senior Faculty Advisor before enrolment.
            </p>
            {/* Trust Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#40ffa7]" />
                20-Minute Bespoke Assessment
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Award className="w-3.5 h-3.5 text-[#40ffa7]" />
                Oxbridge &amp; Imperial Mentorship
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#40ffa7]" />
                Enhanced DBS Safeguarded
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 max-w-3xl mx-auto text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Booking Notice:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Advisor Profile & Time Slot Selector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Advisor Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Your Academic Advisor
            </span>
            <div className="mt-4 flex items-center space-x-4">
              <img 
                src={ADVISOR.avatar} 
                alt={ADVISOR.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-[#40ffa7] shadow-md shrink-0" 
              />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{ADVISOR.name}</h3>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">{ADVISOR.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{ADVISOR.qualifications}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {ADVISOR.bio}
            </p>
          </div>

          {/* Available Days Selector (Tuesday to Saturday) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-[#001f3f] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Select Consultation Day (Tue – Sat)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Tue–Fri: 5:00 PM – 7:00 PM &bull; Sat: 10:00 AM – 3:00 PM (20-min slots):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-5">
              {CONSULTATION_SCHEDULE.map((item) => {
                const isSelected = selectedDay === item.day;
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => handleDaySelect(item.day)}
                    className={`py-2.5 px-1.5 rounded-xl text-center transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-md ring-2 ring-[#40ffa7]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="block text-xs font-black">{item.day.slice(0, 3)}</span>
                    <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-[#40ffa7]' : 'text-slate-400'}`}>
                      {item.slots.length} slots
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time Slots for the Selected Day */}
            <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Available 20-Min Slots for {selectedDay}:
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">{activeDaySchedule.slots.length} Available</span>
            </h4>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
              {activeDaySchedule.slots.map((slot) => {
                const isSlotSelected = (selectedSlot?.id || activeDaySchedule.slots[0]?.id) === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSlotSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold block text-slate-900">{slot.time}</span>
                      <span className="text-[10px] text-slate-500">{slot.label}</span>
                    </div>
                    {isSlotSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mode selection */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Preferred Consultation Meeting Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setConsultationMode('WhatsApp Phone Call (+44)')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                    consultationMode.includes('WhatsApp')
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp Phone Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationMode('Live Interactive Video (Classroom / Google Meet)')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer ${
                    consultationMode.includes('Video')
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Video Conference</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: UK Student & Parent Academic Intake Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200">
            <h2 className="text-xl font-black text-[#001f3f] tracking-tight mb-1">
              Academic Consultation Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Please provide key UK curriculum and contact information so our advisor can prepare targeted diagnostic materials.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="parent_name"
                      required
                      placeholder="e.g. Richard Thornton"
                      value={formData.parent_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="student_name"
                      required
                      placeholder="e.g. James Thornton"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="parent@example.co.uk"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Confirmation will be sent here & to info@</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UK Phone / WhatsApp (+44) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+44 7911 123456"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">For consultation SMS/WhatsApp reminder</span>
                </div>
              </div>

              {/* Curriculum Level & Exam Board */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Curriculum Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium bg-white"
                  >
                    {CURRICULUM_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UK Exam Board
                  </label>
                  <select
                    name="exam_board"
                    value={formData.exam_board}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium bg-white"
                  >
                    {EXAM_BOARDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subjects & Grades */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Subject(s) of Interest
                </label>
                <input
                  type="text"
                  name="subjects"
                  placeholder="e.g. Higher Maths, Physics, Chemistry, English Literature"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Working Grade
                  </label>
                  <input
                    type="text"
                    name="current_grade"
                    placeholder="e.g. Grade 5 / Grade C / 65%"
                    value={formData.current_grade}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Exam Grade
                  </label>
                  <input
                    type="text"
                    name="target_grade"
                    placeholder="e.g. Grade 8-9 / Grade A* / 90%"
                    value={formData.target_grade}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Notes / Special Requests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Learning Notes, Weak Areas, or Specific Goals (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Tell us about upcoming mocks, exam anxiety, specific topics (e.g. calculus, trigonometry, organic chemistry), or SEN requirements..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Selection Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
                    Selected Appointment Slot (20 Mins)
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#001f3f]">
                    {selectedDay} &bull; {selectedSlot?.time || activeDaySchedule.slots[0]?.time}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  FREE / 20 Mins
                </span>
              </div>

              {/* Inline Form Error Notification */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm sm:text-base shadow-lg shadow-[#40ffa7]/30 hover:shadow-xl transition-all transform active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Securing Your 20-Min Consultation...</span>
                ) : (
                  <>
                    <span>Confirm Free 20-Min Academic Consultation</span>
                    <ArrowRight className="w-5 h-5 text-[#001f3f]" />
                  </>
                )}
              </button>

              {/* Tutorial & Consultation Cancellation Policy */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">📅 Cancellation & Rescheduling Policy:</span>
                <p>
                  All 1-on-1 consultations and tutorial lessons can be rescheduled free of charge up to 24 hours prior to your scheduled time. In cases of urgent illness or emergency, please WhatsApp or email <a href="mailto:info@beaconbridgeacademics.co.uk" className="text-emerald-700 font-semibold underline">info@beaconbridgeacademics.co.uk</a> to adjust your slot without penalty.
                </p>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookConsultationPage;
