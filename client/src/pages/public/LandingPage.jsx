import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  GraduationCap,
  Video,
  PenTool,
  Users,
  ShieldCheck,
  Globe,
  Play,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Layers,
  MessageSquare,
  FileText,
  Mail,
  Send
} from 'lucide-react';

export const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data.success) {
          setCourses(res.data.courses.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch courses for landing', err);
      }
    };
    fetchCourses();
  }, []);

  const faqs = [
    {
      q: "How does the real-time Virtual Classroom work?",
      a: "Our virtual classroom runs directly in any modern web browser without downloading software. Tutors can stream high-definition WebRTC video and audio, share their screen, display PowerPoint/PDF slides, and annotate slides or draw diagrams on the digital whiteboard in real time. Student screens synchronize instantaneously."
    },
    {
      q: "Can parents monitor their children's learning and attendance?",
      a: "Yes. EduLearn has a dedicated Parent Portal. Once linked by email or verification code, parents can view their child's enrolled courses, upcoming class schedules, real-time attendance records, and academic progress reports."
    },
    {
      q: "Can students rewatch recorded classes?",
      a: "Absolutely. When tutors record live virtual classes, the video sessions and presentation records are securely saved and made available in the student dashboard for asynchronous review."
    },
    {
      q: "Is EduLearn accessible internationally?",
      a: "Yes. The platform is deployed on globally distributed infrastructure with automated latency optimization, enabling tutors and students across different countries and time zones to collaborate smoothly."
    },
    {
      q: "How does the slide annotation and drawing tool work?",
      a: "During a live class, the tutor can upload PDF or PowerPoint slides. A transparent, high-performance vector canvas overlays each slide, enabling tutors to write, highlight, draw arrows, rectangles, and shapes with sub-pixel normalized synchronization across all connected devices."
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-brand-600 animate-spin-slow" />
                <span>Next-Gen Web-Based LMS & Virtual Classroom</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Empower Global Education with <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Live Interactive</span> Classrooms
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                A centralized, multi-role Learning Management System engineered for institutions, tutors, students, and parents. Experience real-time slide presentations, digital whiteboard annotations, WebRTC video, and automated attendance tracking.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/classroom/ROOM-CS101-LIVE"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-base shadow-sm hover:shadow transition-all text-center flex items-center justify-center space-x-2.5 group"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span>Preview Virtual Classroom</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">4 Distinct</div>
                  <div className="text-xs text-slate-500 font-medium">Portals (Admin, Tutor, Student, Parent)</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">&lt;50ms</div>
                  <div className="text-xs text-slate-500 font-medium">Real-Time Whiteboard Sync</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">100% Web</div>
                  <div className="text-xs text-slate-500 font-medium">Zero Client Software Installs</div>
                </div>
              </div>
            </div>

            {/* Right Visual Interactive Classroom Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl bg-slate-900 p-3 shadow-2xl shadow-indigo-950/30 border border-slate-800">
                {/* Mock Virtual Classroom Window */}
                <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80">
                  {/* Window Bar */}
                  <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-xs font-semibold text-slate-300 ml-2">EduLearn Live Classroom</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                      LIVE
                    </span>
                  </div>

                  {/* Canvas Stage Preview */}
                  <div className="relative aspect-[16/10] bg-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                    {/* Simulated whiteboard graphic with drawing path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 400 250">
                      {/* Grid background */}
                      <defs>
                        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#smallGrid)" />
                      {/* Drawing annotations */}
                      <path d="M 50 160 Q 150 40 250 110 T 360 80" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="250" cy="110" r="8" fill="#10b981" />
                      <rect x="60" y="50" width="110" height="40" rx="8" fill="rgba(99, 102, 241, 0.15)" stroke="#818cf8" strokeWidth="2" />
                      <text x="75" y="75" fill="#e0e7ff" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Active Node</text>
                    </svg>

                    {/* Spotlight floating instructor video tile */}
                    <div className="absolute top-4 right-4 w-28 h-20 rounded-xl overflow-hidden border-2 border-brand-500 shadow-xl bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" 
                        alt="Dr. Sarah Jenkins" 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-bold bg-slate-900/80 px-1.5 rounded text-white">Dr. Sarah</span>
                    </div>

                    <div className="relative z-10 max-w-xs space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-brand-600/30 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto shadow-lg">
                        <PenTool className="w-6 h-6 text-brand-400" />
                      </div>
                      <h4 className="text-white font-bold text-sm">Interactive Slide & Whiteboard</h4>
                      <p className="text-slate-400 text-xs">Synchronized real-time drawing, slide navigation, and voice interaction.</p>
                    </div>

                    {/* Bottom control bar preview */}
                    <div className="absolute bottom-3 left-4 right-4 bg-slate-800/90 backdrop-blur rounded-xl p-2 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 rounded bg-brand-600 text-white font-semibold text-[10px]">Slide 3/8</span>
                        <span className="text-[11px] text-slate-400">Math & Systems</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400 text-xs font-bold">Mic</span>
                        <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-blue-400 text-xs font-bold">Cam</span>
                        <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-brand-400 text-xs font-bold">Draw</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center space-x-3 text-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Instant Web Attendance</div>
                    <div className="text-[11px] text-slate-500">Auto-logged for Parent & Admin</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3">About EduLearn Global</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Unified Ecosystem Connecting Every Educational Stakeholder
            </p>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Traditional online education often suffers from fragmented tools — one app for video calls, another for files, and separate spreadsheets for attendance. EduLearn consolidates the entire educational lifecycle into one high-performance web platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                role: "Super Administrator",
                icon: ShieldCheck,
                color: "text-purple-600 bg-purple-50 border-purple-100",
                desc: "Complete oversight across all courses, students, tutors, parents, ongoing classes, payment settings, and system security audit logs."
              },
              {
                role: "Tutor & Educator",
                icon: Award,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                desc: "Create and publish courses, schedule live classes, present slide decks, annotate drawings in real-time, and log attendance."
              },
              {
                role: "Student",
                icon: BookOpen,
                color: "text-brand-600 bg-brand-50 border-brand-100",
                desc: "Access structured course syllabi, join live virtual classes with 1 click, follow tutor annotations live, and review recordings."
              },
              {
                role: "Parent / Guardian",
                icon: Users,
                color: "text-amber-600 bg-amber-50 border-amber-100",
                desc: "Real-time visibility into your children's live schedules, tutor assignments, attendance history, and course progress reports."
              }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${p.color} mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{p.role}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VIRTUAL CLASSROOM & FEATURES SECTION */}
      <section id="virtual-classroom" className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3 block">Real-Time Virtual Classroom</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for High-Fidelity Remote Instruction
            </h2>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Every tool a tutor needs to conduct an engaging, immersive class is built directly into the live classroom stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Live Video, Audio & Screen Share",
                desc: "High-definition WebRTC video and low-latency audio. Share full screens or application windows with crystal-clear frame rates.",
                icon: Video
              },
              {
                title: "Slide Presentation Deck",
                desc: "Seamlessly navigate multi-page PowerPoint and PDF slides. Slide changes synchronize instantly to every student screen.",
                icon: Layers
              },
              {
                title: "Synchronized Slide Annotations",
                desc: "Write equations, circle diagrams, or draw arrows directly over presentation slides with sub-pixel normalized precision.",
                icon: PenTool
              },
              {
                title: "Digital Whiteboard & Shapes",
                desc: "Full vector drawing canvas with Pen, Marker, Eraser, Lines, Rectangles, Circles, and Color Palettes for comprehensive derivations.",
                icon: Sparkles
              },
              {
                title: "Student Interaction & Chat",
                desc: "Built-in classroom chat stream, question queuing, hand-raise status notifications, and tutor-side mute management.",
                icon: MessageSquare
              },
              {
                title: "Recording & On-Demand Playback",
                desc: "Record live sessions with client-side composition and store them in the cloud for asynchronous student re-watching.",
                icon: Film
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-brand-500/50 transition-all hover:bg-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Classroom CTA */}
          <div className="mt-16 text-center">
            <Link
              to="/classroom/ROOM-CS101-LIVE"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base transition-all shadow-xl shadow-brand-500/20 hover:scale-105"
            >
              <Video className="w-5 h-5" />
              <span>Launch Live Virtual Classroom Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. COURSES & PROGRAMMES SECTION */}
      <section id="courses" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">Featured Curricula</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore Expert-Led Learning Programmes
              </h2>
            </div>
            <Link to="/login" className="mt-4 md:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5">
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-400">Loading courses...</div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-slate-800 shadow-sm">
                      ${course.price}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-[11px] font-semibold text-white">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
                        {course.category?.name || 'Academic Course'}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={course.tutor?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                          alt={course.tutor?.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                          {course.tutor?.full_name}
                        </span>
                      </div>
                      <Link
                        to="/login"
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">Simple Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How the EduLearn Platform Operates
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Designed from the ground up for simplicity, clarity, and instant cross-device access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register & Pick Role",
                desc: "Sign up securely as a Student, Tutor, or Parent. Admins retain full control over authorizations and user roles."
              },
              {
                step: "02",
                title: "Schedule or Enroll",
                desc: "Tutors schedule upcoming live lessons with slide decks attached. Students enroll and receive automated calendar notifications."
              },
              {
                step: "03",
                title: "Join Virtual Class",
                desc: "Enter the real-time classroom with one click. Participate in live discussions, view slides, and follow whiteboard annotations."
              },
              {
                step: "04",
                title: "Track Progress & Rewatch",
                desc: "Attendance is automatically logged. Parents monitor learning progress, and students rewatch recorded lessons at their own pace."
              }
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-3xl font-extrabold text-brand-600/30 block mb-3 font-mono">{step.step}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TUTOR / FACULTY SPOTLIGHT */}
      <section id="tutors" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">World-Class Educators</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Learn Directly from Distinguished Faculty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Dr. Sarah Jenkins",
                role: "Senior AI & Web Systems Professor",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
                bio: "PhD in Computer Science. Over 12 years designing scalable distributed platforms and interactive learning systems."
              },
              {
                name: "Prof. Michael Chen",
                role: "Chair of Mathematics & Data Algorithms",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
                bio: "Specialist in linear algebra, matrix decomposition, and quantum computing foundations. 10+ teaching excellence awards."
              },
              {
                name: "Elena Rostova",
                role: "Global Languages & Linguistics Chair",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
                bio: "Polyglot educator with over a decade of immersion coaching and interactive multilingual seminar experience."
              }
            ].map((tutor, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm hover:shadow-md transition-all">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-brand-500"
                />
                <h3 className="text-lg font-bold text-slate-900">{tutor.name}</h3>
                <p className="text-xs font-semibold text-brand-600 mb-3">{tutor.role}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{tutor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">Student & Parent Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Thousands Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The live slide annotations made learning algorithms feel like sitting right in the front row of a world-class lecture hall.",
                author: "Alex Morgan",
                role: "Computer Science Student",
                rating: 5
              },
              {
                quote: "As a parent, having a separate portal to see my daughter's exact class attendance and upcoming live tests gives me total peace of mind.",
                author: "David Morgan",
                role: "Parent of Alex Morgan",
                rating: 5
              },
              {
                quote: "Conducting live classes while annotating my presentation slides in real-time has completely transformed my remote tutoring productivity.",
                author: "Dr. Sarah Jenkins",
                role: "Computer Science Tutor",
                rating: 5
              }
            ].map((test, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                    "{test.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{test.author}</h4>
                  <p className="text-xs text-slate-500">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">Frequently Asked Questions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 font-bold text-slate-900 flex items-center justify-between hover:text-brand-600 transition-colors"
                  >
                    <span className="text-base sm:text-lg pr-4">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 block">Get in Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Have Questions or Need an Institutional Solution?
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Our educational advisory team is available globally to assist training providers, schools, and independent tutors in deploying customized virtual classroom solutions.
              </p>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-600" />
                  <span>support@edulearn.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-brand-600" />
                  <span>Available globally across all time zones</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              {contactSubmitted ? (
                <div className="p-6 text-center bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-base mb-1">Message Received!</h4>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. Our academic team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="eleanor@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we assist your organization?"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Send Inquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
