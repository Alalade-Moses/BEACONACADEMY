import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Video,
  PenTool,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Film,
  Calendar,
  Layers,
  MessageSquare,
  TrendingUp,
  Mail,
  Volume2,
  Mic,
  Monitor,
  Zap
} from 'lucide-react';

export const HowItWorksPage = () => {
  const [monthSlide, setMonthSlide] = useState(0);
  const [classroomSlide, setClassroomSlide] = useState(0);

  // 1. First Month Timeline Data
  const monthPhases = [
    {
      phase: 'Step 1: Before Lessons',
      title: 'Detailed Consultation & Curriculum Alignment',
      description: 'You speak with a teacher about your child’s goals, their difficulties and their exam board. We agree on the priorities before a single lesson takes place.'
    },
    {
      phase: 'Step 2: First Lessons',
      title: 'Diagnostic Gap Analysis',
      description: 'The teacher finds out where the gaps are, usually by working through topics together in the live classroom, and agrees on an encouraging tailored plan with your child.'
    },
    {
      phase: 'Step 3: Weeks Two to Four',
      title: 'Targeted Teaching & Dual Visibility',
      description: 'Lessons build directly on the plan. You receive homework emails, and you can see real-time attendance, lesson notes, and progress in your parent account.'
    },
    {
      phase: 'Step 4: End of Month',
      title: 'Parent Review & Milestone Assessment',
      description: 'You have a clear picture of how your child is getting on and what comes next, and you can tell us if anything needs to change. No guesswork, no waiting until parents’ evening.'
    }
  ];

  // 2. Classroom Features Data
  const classroomFeatures = [
    {
      title: 'Live Video & Audio Communication',
      description: 'Natural, face-to-face dialogue between tutor and student. Responsive camera and microphone controls designed for active learning.',
      icon: Video
    },
    {
      title: 'Digital Whiteboard with Drawing Tools',
      description: 'Freehand sketching, diagrams, geometric shapes, highlighters, and multi-color pens that make complex math and science visible.',
      icon: PenTool
    },
    {
      title: 'Real-Time Slide & PDF Annotation',
      description: 'Upload past papers, mark schemes, and slides. Tutor and student annotate simultaneously with synchronized cursor coordinates.',
      icon: Layers
    },
    {
      title: 'Screen Sharing for Worked Examples',
      description: 'Share coding environments, graphing calculators (Desmos), or simulation software in crisp high definition.',
      icon: Monitor
    },
    {
      title: 'Automated Attendance Tracking',
      description: 'Every lesson arrival, duration, and session log is recorded automatically and published to the parent portal.',
      icon: Clock
    },
    {
      title: 'Full Session Recordings',
      description: 'Lessons are recorded so students can rewatch difficult derivations, grammar points, or explanations whenever they revise.',
      icon: Film
    },
    {
      title: 'Direct Teacher-Student Chat',
      description: 'In-lesson messaging for sharing links, equations, and vocabulary without interrupting the vocal flow of the lesson.',
      icon: MessageSquare
    }
  ];

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">

      {/* ========================================================= */}
      {/* HERO BANNER                                               */}
      {/* ========================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#001f3f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#050167]/80 to-[#001f3f] z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Onboarding Architecture</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            How Beacon Bridge{' '}
            <span className="bg-gradient-to-r from-white via-[#f0faff] to-[#40ffa7] bg-clip-text text-transparent">
              Academics Works
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#f0faff]/85 max-w-2xl mx-auto leading-relaxed font-normal">
            A transparent, safe, and family-first journey from start to finish.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4 CORE ONBOARDING STEPS                                   */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
              Four Easy Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001f3f] tracking-tight">
              From Registration to First Class
            </h2>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-[#050167]/20 via-[#40ffa7]/50 to-[#050167]/20 -translate-y-12 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              <div className="group bg-[#f0faff] rounded-3xl p-7 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#050167] text-[#40ffa7] font-black flex items-center justify-center mb-5 text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-[#050167] mb-2.5">Register as a family</h3>
                  <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                    A parent completes one registration form for themselves and their child, together. This keeps every account accurate and linked correctly from day one.
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
                  <span>Unified Family Account</span>
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
                </div>
              </div>

              <div className="group bg-[#f0faff] rounded-3xl p-7 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#001f3f] text-[#40ffa7] font-black flex items-center justify-center mb-5 text-lg shadow-md shadow-[#001f3f]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-[#050167] mb-2.5">Speak to a teacher first</h3>
                  <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                    Before lessons begin, you have a consultation with a teacher. You discuss your child's goals, their difficulties, and the exam board they follow.
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f] flex items-center justify-between">
                  <span>1-on-1 Consultation</span>
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#001f3f]" />
                </div>
              </div>

              <div className="group bg-[#f0faff] rounded-3xl p-7 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#050167] text-[#40ffa7] font-black flex items-center justify-center mb-5 text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-[#050167] mb-2.5">Get set up</h3>
                  <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                    Our team completes your onboarding and confirms your plan, and your child is matched with a teacher who knows their syllabus.
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
                  <span>Custom Teacher Matching</span>
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
                </div>
              </div>

              <div className="group bg-[#f0faff] rounded-3xl p-7 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#001f3f] text-[#40ffa7] font-black flex items-center justify-center mb-5 text-lg shadow-md shadow-[#001f3f]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-[#050167] mb-2.5">Learn live & track progress</h3>
                  <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                    Lessons take place in our live classroom. You follow progress, attendance and homework directly from your parent account.
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f] flex items-center justify-between">
                  <span>Live Class + Parent Portal</span>
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#001f3f]" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* WHAT HAPPENS IN THE FIRST MONTH                           */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 border border-[#050167]/15 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#050167]" />
              <span>Structured 30-Day Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              What Happens in the First Month
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Step-by-step clarity on your family's initial four weeks.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#050167]/15 p-8 sm:p-12 shadow-xl shadow-[#050167]/8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#050167]/10">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider shadow-sm">
                  {monthPhases[monthSlide].phase}
                </span>
                <span className="text-xs text-[#001f3f]/60 font-medium">30-Day Milestone Tracker</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setMonthSlide(prev => (prev === 0 ? monthPhases.length - 1 : prev - 1))}
                  className="p-2.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] active:scale-95 cursor-pointer shadow-sm transition-all"
                  aria-label="Previous Month Phase"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMonthSlide(prev => (prev === monthPhases.length - 1 ? 0 : prev + 1))}
                  className="p-2.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] active:scale-95 cursor-pointer shadow-sm transition-all"
                  aria-label="Next Month Phase"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="min-h-[140px] flex flex-col justify-center space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-[#050167] leading-snug">
                {monthPhases[monthSlide].title}
              </h3>
              <p className="text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
                {monthPhases[monthSlide].description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#050167]/10">
              {monthPhases.map((phase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMonthSlide(idx)}
                  className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer flex flex-col justify-between ${
                    monthSlide === idx
                      ? 'bg-[#050167] text-[#40ffa7] shadow-xl shadow-[#050167]/25 ring-2 ring-[#40ffa7]/40 scale-102'
                      : 'bg-[#f0faff] text-[#001f3f]/80 hover:bg-[#050167]/10 border border-[#050167]/15'
                  }`}
                >
                  <span className={`block font-bold text-[10px] uppercase tracking-wider mb-1 ${monthSlide === idx ? 'text-[#40ffa7]' : 'text-[#050167]'}`}>
                    Step {idx + 1}
                  </span>
                  <span className="font-bold truncate">{phase.phase.split(':')[1] || phase.phase}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* A LIVE ONLINE CLASSROOM BUILT FOR TEACHING                */}
      {/* ========================================================= */}
      <section id="virtual-classroom" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#001f3f] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Engineered for Education</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              A Live Online Classroom Built for Teaching
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#f0faff]/80 leading-relaxed">
              A video call is not a classroom. Ours was designed for teaching from the start, so lessons feel like working at a board with a teacher beside you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Feature List */}
            <div className="lg:col-span-5 space-y-2.5">
              {classroomFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                const isCurrent = classroomSlide === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setClassroomSlide(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all border flex items-start gap-3.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#050167] to-[#0a2e5c] border-[#40ffa7] text-white shadow-xl shadow-[#050167]/50 ring-1 ring-[#40ffa7]/30 scale-102'
                        : 'bg-[#001f3f]/70 border-white/10 text-[#f0faff]/70 hover:bg-[#050167]/40 hover:text-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isCurrent ? 'bg-[#40ffa7] text-[#001f3f] font-bold shadow-md shadow-[#40ffa7]/30' : 'bg-white/10 text-[#40ffa7]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-[#f0faff]/90'}`}>
                          {feat.title}
                        </h3>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#40ffa7] animate-pulse shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-[#f0faff]/60 mt-1 line-clamp-2 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage Preview Box */}
            <div className="lg:col-span-7 bg-[#050167]/90 border border-[#40ffa7]/30 rounded-3xl p-6 sm:p-8 relative shadow-2xl backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-[#40ffa7]" />
                  <span className="text-xs font-mono text-[#f0faff]/70 ml-2">beacon-bridge-classroom://room-101</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] border border-[#40ffa7]/40 font-semibold">
                  Live WebRTC Synced
                </span>
              </div>

              <div className="space-y-5">
                <div className="aspect-video bg-[#001f3f] rounded-2xl border border-white/15 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs text-[#40ffa7] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#001f3f]/80 px-2.5 py-1 rounded-lg border border-[#40ffa7]/20">
                      <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
                      Active: {classroomFeatures[classroomSlide].title}
                    </span>
                    <span className="text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                      Dr. Sarah Jenkins & Alex Morgan
                    </span>
                  </div>

                  <div className="my-auto z-10 w-full">
                    {classroomSlide === 0 && (
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/15 flex flex-col items-center justify-center text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shadow-md">SJ</div>
                          <div>
                            <span className="text-xs font-bold text-white block">Dr. Sarah Jenkins</span>
                            <span className="text-[10px] text-[#40ffa7] flex items-center justify-center gap-1">
                              <Volume2 className="w-3 h-3" /> Speaking (48kHz HD)
                            </span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-white/15 flex flex-col items-center justify-center text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md">AM</div>
                          <div>
                            <span className="text-xs font-bold text-white block">Alex Morgan</span>
                            <span className="text-[10px] text-slate-300 flex items-center justify-center gap-1">
                              <Mic className="w-3 h-3 text-slate-400" /> Student Video Active
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {classroomSlide === 1 && (
                      <div className="font-mono text-center space-y-2 max-w-sm mx-auto">
                        <div className="text-base sm:text-lg text-[#40ffa7] font-bold">ax² + bx + c = 0</div>
                        <div className="text-xs sm:text-sm text-amber-300 font-semibold bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                          x = (-b ± √(b² - 4ac)) / (2a)
                        </div>
                        <div className="text-[11px] text-emerald-300 italic">
                          ✓ Tutor Note: "Discriminant &gt; 0 gives two real distinct roots!"
                        </div>
                      </div>
                    )}

                    {classroomSlide === 2 && (
                      <div className="max-w-sm mx-auto bg-white/10 p-3 rounded-xl border border-white/15 text-left space-y-1.5 font-sans">
                        <div className="flex items-center justify-between text-[10px] text-slate-300">
                          <span className="font-bold text-[#40ffa7]">AQA GCSE Higher Tier (Paper 1H)</span>
                          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">[4 Marks]</span>
                        </div>
                        <p className="text-xs text-white font-medium">
                          "Q7: Prove algebraically that the difference between squares of any two consecutive even numbers is always divisible by 4."
                        </p>
                      </div>
                    )}

                    {classroomSlide === 3 && (
                      <div className="max-w-sm mx-auto bg-slate-900/90 p-3 rounded-xl border border-white/15 text-left font-mono text-xs text-slate-200 space-y-1">
                        <div className="text-[#40ffa7] text-[10px] flex items-center gap-1.5">
                          <Monitor className="w-3 h-3" /> Live Graphing & IDE Share
                        </div>
                        <div className="text-sky-300">import matplotlib.pyplot as plt</div>
                        <div className="text-slate-300">y = [x**2 - 4*x + 3 for x in range(-5, 5)]</div>
                      </div>
                    )}

                    {classroomSlide === 4 && (
                      <div className="max-w-sm mx-auto bg-white/10 p-3 rounded-xl border border-white/15 text-left space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[#40ffa7] font-bold text-[11px]">
                          <span>Automated Attendance Ledger</span>
                          <span>Verified 100%</span>
                        </div>
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span>Dr. Sarah Jenkins (Tutor)</span>
                          <span className="text-emerald-400">Arrived 16:00:00</span>
                        </div>
                        <div className="flex justify-between text-slate-300 text-[11px]">
                          <span>Alex Morgan (Student)</span>
                          <span className="text-emerald-400">Arrived 16:00:45</span>
                        </div>
                      </div>
                    )}

                    {classroomSlide === 5 && (
                      <div className="max-w-sm mx-auto bg-white/10 p-3 rounded-xl border border-white/15 text-center space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="text-[#40ffa7] font-bold flex items-center gap-1">
                            <Film className="w-3.5 h-3.5" /> 1080p Recorded Session
                          </span>
                          <span>58:24 / 60:00</span>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#40ffa7] h-full w-3/4 rounded-full" />
                        </div>
                      </div>
                    )}

                    {classroomSlide === 6 && (
                      <div className="max-w-sm mx-auto bg-white/10 p-3 rounded-xl border border-white/15 text-left space-y-1.5 text-xs">
                        <div className="p-1.5 rounded bg-white/10 text-[11px]">
                          <strong className="text-[#40ffa7]">Dr. Sarah:</strong> Take a look at step 3 in the mark scheme for full method marks.
                        </div>
                        <div className="p-1.5 rounded bg-[#40ffa7]/20 text-[11px] text-white">
                          <strong className="text-amber-300">Alex:</strong> Got it! Expanding the brackets makes it much clearer now.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-[#f0faff]/60 z-10">
                    <span>Drawing Sync: &lt; 20ms latency</span>
                    <span>1080p High-Fidelity Session</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[#f0faff]/70 text-center sm:text-left">
                    Experience our real-time interactive virtual room firsthand:
                  </span>
                  <Link
                    to="/classroom/ROOM-GCSE-MATH-LIVE"
                    className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs shadow-xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <span>Experience Live Virtual Classroom</span>
                    <ArrowRight className="w-4 h-4 text-[#001f3f]" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* STAY IN THE LOOP WITH YOUR PARENT ACCOUNT                 */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 border border-[#050167]/15 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
              <Mail className="w-3.5 h-3.5 text-[#050167]" />
              <span>Continuous Family Visibility</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Stay in the Loop With Your Parent Account
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              You should never have to guess how your child is getting on. 
              Each family has a parent account linked to their child's, where you can see their progress, attendance, and announcements from their teacher.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#f0faff] to-white border border-[#050167]/15 shadow-xl shadow-[#050167]/5 flex flex-col justify-between h-full">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 shadow-lg border border-[#40ffa7]/30 mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">Direct In-App & Email Notifications</h3>
                <p className="text-[#001f3f]/80 text-base leading-relaxed">
                  When a teacher sets homework, you and your child receive an email with the deadline. 
                  When it is handed in, you are told. If it is not completed in time, you will know that too, so you can step in early and kindly.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#050167]/10 flex items-center gap-3 text-xs font-bold text-[#050167]">
                <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
                <span>Zero guesswork, no waiting until parents' evening.</span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3.5">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Homework Assigned (Alex Morgan)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Due Thu 18:00</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    GCSE Maths Higher Tier: Quadratic Formula Past Paper Pack (Questions 1 to 8).
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                    ✓ Email dispatched to parent & student accounts
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Attendance Log Recorded</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Alex completed 60 minutes with Dr. Sarah Jenkins. 100% attendance logged in parent portal.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#050167]/10 text-[#050167] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Milestone Diagnostic Assessment</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">Progress +18%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mark scheme accuracy rose from Grade 4 boundary to Grade 6 boundary over the last 3 weeks.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CALL TO ACTION                                      */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#050167] via-[#001f3f] to-[#050167] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Help Your Child Feel Confident Again?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#f0faff]/90 max-w-xl mx-auto leading-relaxed">
            Tell us what your child is finding hard. We will listen, explain how we can help, and help you decide the next step.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm shadow-xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#001f3f]" />
            </Link>
            <Link
              to="/curriculum"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-sm border border-white/25 transition-all active:scale-95"
            >
              Explore Curriculum & Exam Boards
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
