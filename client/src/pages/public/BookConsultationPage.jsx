import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  name: 'Dr. Sarah Jenkins',
  title: 'Head of Academic Advisory & Oxbridge Admissions Mentor',
  qualifications: 'PhD Pure Mathematics (Oxford), BSc Physics (Imperial), 12+ Yrs UK Curriculum Lead',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  bio: 'Specialist in diagnosing learning bottlenecks, exam board timing techniques (AQA, Edexcel, OCR), and structuring high-yield revision roadmaps for GCSE and A-Level students.'
};

// 3 Days per week with sample time slots for each day (UK London GMT)
const CONSULTATION_SCHEDULE = [
  {
    day: 'Tuesday',
    dateLabel: 'Every Tuesday',
    slots: [
      { id: 'tue-1', time: '10:00 AM – 10:45 AM (UK GMT)', label: 'Morning Session' },
      { id: 'tue-2', time: '02:00 PM – 02:45 PM (UK GMT)', label: 'Afternoon Session' },
      { id: 'tue-3', time: '05:00 PM – 05:45 PM (UK GMT)', label: 'Evening After-School' }
    ]
  },
  {
    day: 'Thursday',
    dateLabel: 'Every Thursday',
    slots: [
      { id: 'thu-1', time: '10:00 AM – 10:45 AM (UK GMT)', label: 'Morning Session' },
      { id: 'thu-2', time: '02:00 PM – 02:45 PM (UK GMT)', label: 'Afternoon Session' },
      { id: 'thu-3', time: '05:00 PM – 05:45 PM (UK GMT)', label: 'Evening After-School' }
    ]
  },
  {
    day: 'Saturday',
    dateLabel: 'Every Saturday (Weekend)',
    slots: [
      { id: 'sat-1', time: '10:00 AM – 10:45 AM (UK GMT)', label: 'Weekend Morning' },
      { id: 'sat-2', time: '12:00 PM – 12:45 PM (UK GMT)', label: 'Weekend Midday' },
      { id: 'sat-3', time: '03:00 PM – 03:45 PM (UK GMT)', label: 'Weekend Afternoon' }
    ]
  }
];

const CURRICULUM_OPTIONS = [
  'GCSE / IGCSE (Years 10–11)',
  'A-Levels / Sixth Form (Years 12–13)',
  'Key Stage 3 (Years 7–9)',
  '11+ / 13+ Grammar & Independent School Entrance',
  'Canadian High School (OSSD Grade 12)',
  'US High School & AP Courses',
  'Software Development & Tech Coding Track',
  'Other / Custom Curriculum'
];

const EXAM_BOARDS = [
  'AQA',
  'Edexcel (Pearson)',
  'OCR',
  'Cambridge International (CIE)',
  'Eduqas / WJEC',
  'Scottish Highers',
  'Not Applicable / International'
];

export const BookConsultationPage = () => {
  const [selectedDay, setSelectedDay] = useState(CONSULTATION_SCHEDULE[0].day);
  const [selectedSlot, setSelectedSlot] = useState(CONSULTATION_SCHEDULE[0].slots[2]); // default Tue evening
  const [consultationMode, setConsultationMode] = useState('Live Interactive Video (Classroom / Google Meet)');

  const [formData, setFormData] = useState({
    parent_name: '',
    student_name: '',
    email: '',
    phone: '',
    curriculum: 'GCSE / IGCSE (Years 10–11)',
    subjects: 'Mathematics & Sciences',
    exam_board: 'Edexcel (Pearson)',
    current_grade: 'Grade 5 / Grade 6',
    target_grade: 'Grade 8 / Grade 9 (A*)',
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
        consultation_time: selectedSlot.time,
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
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-[#40ffa7] to-cyan-500" />
          
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Link to="/" className="inline-block group mb-4">
          <img 
            src="/logo.png" 
            alt="Beacon Bridge Academics" 
            className="h-14 sm:h-16 w-auto object-contain mx-auto group-hover:scale-105 transition-transform" 
          />
        </Link>
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#40ffa7]/20 text-[#001f3f] text-xs font-black uppercase tracking-wider mb-3 border border-[#40ffa7]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#050167]" />
          <span>Complimentary 1-on-1 Academic Consultation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight leading-tight">
          Book a 1-on-1 Consultation
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Discuss your child&apos;s academic targets, diagnostic exam assessments, and bespoke study plans with our Senior Faculty Advisor before enrolment.
        </p>

        {/* Trust Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            45-Minute Bespoke Assessment
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Oxbridge & Imperial Mentorship
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Enhanced DBS Safeguarded
          </span>
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
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#40ffa7] shadow-md shrink-0" 
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

          {/* Available 3 Days a Week Selector */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-[#001f3f] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Select Consultation Day (3 Days / Week)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Consultations take place 3 days per week. Choose a day to view available 45-minute slots:
            </p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {CONSULTATION_SCHEDULE.map((item) => {
                const isSelected = selectedDay === item.day;
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => handleDaySelect(item.day)}
                    className={`py-3 px-2 rounded-2xl text-center transition-all border ${
                      isSelected
                        ? 'bg-[#001f3f] text-white border-[#001f3f] shadow-md ring-2 ring-[#40ffa7]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="block text-xs font-black">{item.day}</span>
                    <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-[#40ffa7]' : 'text-slate-400'}`}>
                      3 Slots
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time Slots for the Selected Day */}
            <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Available Time Slots for {selectedDay}:
            </h4>
            <div className="space-y-2">
              {activeDaySchedule.slots.map((slot) => {
                const isSlotSelected = selectedSlot.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSlotSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold block text-slate-900">{slot.time}</span>
                      <span className="text-[11px] text-slate-500">{slot.label}</span>
                    </div>
                    {isSlotSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
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
                  onClick={() => setConsultationMode('Live Interactive Video (Classroom / Google Meet)')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    consultationMode.includes('Video')
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Video Conference</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationMode('Direct UK Phone Call (+44)')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                    consultationMode.includes('Phone')
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>UK Phone Call</span>
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
                    Selected Appointment Slot
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#001f3f]">
                    {selectedDay} &bull; {selectedSlot.time}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  FREE / No Fee
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm sm:text-base shadow-lg shadow-[#40ffa7]/30 hover:shadow-xl transition-all transform active:scale-98 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Securing Your Consultation...</span>
                ) : (
                  <>
                    <span>Confirm 1-on-1 Academic Consultation</span>
                    <ArrowRight className="w-5 h-5 text-[#001f3f]" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                By booking, you agree to our Educational Safeguarding & Parent Code of Conduct. Your details are securely encrypted and never shared with third parties.
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookConsultationPage;
