import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Video,
  PenTool,
  Users,
  ShieldCheck,
  Globe,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  Award,
  FileText,
  Mail,
  Send,
  Film,
  Building2,
  AlertTriangle,
  Lightbulb,
  Lock,
  Compass,
  Check,
  Calendar,
  Layers,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Play,
  Star,
  ExternalLink,
  Volume2,
  Mic,
  Monitor,
  Activity,
  Zap,
  CheckCheck,
  BadgeCheck,
  Quote
} from 'lucide-react';

export const LandingPage = () => {
  // Hero Background Carousel State
  const [heroSlide, setHeroSlide] = useState(0);

  // Other Interactive Carousels
  const [signsSlide, setSignsSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  // Hero Carousel Slides with high-resolution imagery and contextual highlights
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80",
      tag: "Curriculum-Trained UK Teachers",
      caption: "Targeting the exact exam board specifications your child sits."
    },
    {
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=2000&q=80",
      tag: "Purpose-Built Virtual Classroom",
      caption: "Live synchronized digital whiteboard, slides, and past-paper mark schemes."
    },
    {
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80",
      tag: "Rebuilding Academic Confidence",
      caption: "Finding where the gaps started, closing them kindly, and getting exam-ready."
    },
    {
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80",
      tag: "Complete Parent Visibility",
      caption: "Track attendance, progress, and homework deadlines from your own parent portal."
    }
  ];

  // Auto-advance hero carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const location = useLocation();

  // Smooth scroll listener for anchor links across page transitions
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        if (id === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          const headerOffset = 84;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 84;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  // 1. Signs Carousel Data
  const signs = [
    {
      id: 1,
      badge: "Pattern 1",
      title: "Grades drop in one subject while the others stay steady.",
      description: "When a student does well in English and History but suddenly slips in Maths, it is almost never about work ethic. It is usually a foundational concept that was missed months ago and never re-taught.",
      advice: "Target the specific curriculum bottleneck before it cascades into future exam topics."
    },
    {
      id: 2,
      badge: "Pattern 2",
      title: "Homework takes much longer than it used to, or ends in tears.",
      description: "Hours spent staring at a workbook is not 'practising hard' — it is a symptom of cognitive overload and anxiety. Homework should reinforce what was understood, not become an evening battle.",
      advice: "A calm 1-to-1 session breaks problems into bite-sized steps so homework becomes manageable again."
    },
    {
      id: 3,
      badge: "Pattern 3",
      title: "They say things like 'I'm just bad at maths' or 'I'll never get English'.",
      description: "This is fixed mindset in action. Children internalise difficulty as identity. Once a child believes they lack ability, they stop trying to protect their self-esteem.",
      advice: "We replace 'I cannot do this' with 'I haven't been shown the method that makes sense to me yet'."
    },
    {
      id: 4,
      badge: "Pattern 4",
      title: "They avoid a subject, or feel unwell before it.",
      description: "Sunday evening stomach aches and subject avoidance are physical responses to academic stress and the fear of feeling exposed in class.",
      advice: "Learning in a safe, judgment-free virtual room allows students to make mistakes comfortably."
    },
    {
      id: 5,
      badge: "Pattern 5",
      title: "They understand things in class but struggle in tests and mocks.",
      description: "This is a classic exam technique disconnect. The student understands the topic, but loses marks to timing, command words, mark-scheme phrasing, or exam pressure.",
      advice: "Direct coaching on past-paper mark schemes bridges the gap between knowledge and exam marks."
    }
  ];

  // FAQs Data
  const faqs = [
    {
      q: "What is Beacon Bridge Academics?",
      a: "Beacon Bridge Academics is an online academic support company for students in the UK, the US, Canada and Australia. We provide live online lessons with teachers trained in your child's curriculum, and a parent account so you can follow their progress."
    },
    {
      q: "How does online tutoring work?",
      a: "Lessons take place live in our virtual classroom, with video, audio, a digital whiteboard and real-time annotation of slides and PDFs. Your child joins from a laptop or tablet at a time that suits your family."
    },
    {
      q: "Which curricula and exam boards do you support?",
      a: "We support GCSE and A-Level for UK students, along with the US, Canadian and Australian curricula. Tell us your child's exam board at your consultation (AQA, Edexcel, OCR, WJEC/Eduqas), and we will match the teaching to it."
    },
    {
      q: "Can online tutoring help my child pass their GCSEs?",
      a: "Targeted tutoring helps students fill gaps, practise exam technique and build confidence. We cannot promise a particular grade, but we can promise teaching focused on exactly what your child's exam requires."
    },
    {
      q: "Is online tutoring with Beacon Bridge Academics safe?",
      a: "Safeguarding is built into how we work. Parents register with their child, every family has a consultation first, and every teacher is checked (including DBS and document verification) before working with children. Lessons take place inside our own secure classroom."
    },
    {
      q: "Do you help homeschooled students?",
      a: "Yes. Teachers can provide subject expertise, structure and exam preparation for homeschooled students at GCSE and A-Level."
    },
    {
      q: "How do I follow my child's progress?",
      a: "Your parent account shows progress, attendance and announcements. You also receive an email whenever a teacher sets homework, and again when it has been completed."
    },
    {
      q: "How much does online tutoring cost?",
      a: "Lesson prices depend on the subject, level and plan, and we explain them clearly at your consultation so there are no surprises. Payment is by bank transfer, and you receive an email confirmation once it has been checked."
    },
    {
      q: "What does my child need to join lessons?",
      a: "A laptop or tablet with a camera, a microphone and a reliable internet connection is enough. Your child joins our live classroom from a web browser, and a quiet space helps them concentrate."
    },
    {
      q: "Can you help if my child has moved from another school system?",
      a: "Yes. This is one of the things we do best. Our teachers are trained across UK, US, Canadian and Australian curricula, so they understand what your child has already learned and what they need to catch up on."
    },
    {
      q: "What age groups and year groups do you teach?",
      a: "We teach school-age students from KS3 to A-Level, and we match each child with a teacher who has experience at their level. Tell us your child's year group, subjects and exam board when you book your consultation."
    },
    {
      q: "How do I get started?",
      a: "Register as a family, book a consultation with a teacher, and our team will complete your onboarding. It takes a few minutes to begin."
    }
  ];

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">

      {/* ========================================================= */}
      {/* SECTION 1: HERO WITH DYNAMIC BACKGROUND CAROUSEL          */}
      {/* ========================================================= */}
      <section id="top" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#001f3f] text-white scroll-mt-24 sm:scroll-mt-28">
        
        {/* Background Image Carousel Slides */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                heroSlide === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-[8000ms]`}
            >
              <img
                src={slide.image}
                alt={slide.tag}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Clean Directional Vignette Overlay: Leaves background images clearly visible, sharp & vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/90 via-[#001f3f]/55 to-[#001f3f]/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 via-transparent to-[#001f3f]/25 z-10" />
        </div>

        {/* Floating Slide Context Badge */}
        <div className="absolute top-24 left-4 sm:left-8 z-20 hidden md:flex items-center space-x-2.5 bg-[#001f3f]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#40ffa7]/25 text-xs text-[#f0faff] shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#40ffa7] animate-pulse" />
          <span className="font-bold text-white">{heroSlides[heroSlide].tag}:</span>
          <span className="text-[#f0faff]/80 font-medium">{heroSlides[heroSlide].caption}</span>
        </div>

        {/* Sleek Auto-Cycle Indicators (No Next/Prev Buttons) */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-30 flex items-center space-x-1.5 bg-[#001f3f]/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setHeroSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                heroSlide === idx ? 'w-6 bg-[#40ffa7]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Foreground Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy, Actions & Trust Chips */}
            <div className="lg:col-span-7 space-y-6 text-left bg-[#001f3f]/65 lg:backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/40 text-[#40ffa7] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#40ffa7] animate-pulse" />
                <span>Now welcoming UK families</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Online Tutoring for UK Students,{' '}
                <span className="bg-gradient-to-r from-white via-[#f0faff] to-[#40ffa7] bg-clip-text text-transparent">
                  From Curriculum-Trained Teachers
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
                Is your child falling behind, losing confidence, or heading into their GCSEs feeling unprepared? 
                <strong className="text-[#40ffa7] font-bold"> Beacon Bridge Academics</strong> gives students live online lessons with teachers who know their exact curriculum and exam board, while you follow their progress from your own parent account.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-5 h-5 text-[#001f3f]" />
                </Link>

                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-base border border-white/25 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

              {/* 4 Core Value Props Grid */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200 bg-[#050167]/50 border border-[#40ffa7]/20 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0" />
                  <span className="font-semibold">Teachers trained in your child's curriculum</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200 bg-[#050167]/50 border border-[#40ffa7]/20 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0" />
                  <span className="font-semibold">Live online classroom</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200 bg-[#050167]/50 border border-[#40ffa7]/20 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0" />
                  <span className="font-semibold">Parent progress dashboard</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200 bg-[#050167]/50 border border-[#40ffa7]/20 px-3.5 py-2.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0" />
                  <span className="font-semibold">Safeguarding built in</span>
                </div>
              </div>

              {/* Social Proof Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-white ml-1">4.9 / 5</span>
                  <span className="text-slate-300 font-normal">Family Satisfaction</span>
                </div>
                <span className="hidden sm:inline text-white/30">&bull;</span>
                <span className="text-slate-200 font-medium">100% DBS-Checked UK Teachers</span>
                <span className="hidden sm:inline text-white/30">&bull;</span>
                <span className="text-[#40ffa7] font-semibold">AQA • Edexcel • OCR • WJEC</span>
              </div>

            </div>

            {/* Right Column: High-End Live Interactive Classroom Card & Parent Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-[#001f3f]/80 border border-[#40ffa7]/25 p-6 shadow-2xl backdrop-blur-xl space-y-4">
                
                {/* Header of Preview Card */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-[#40ffa7]" />
                    <span className="text-xs font-mono text-slate-300 ml-1">beacon-bridge://live-room</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] border border-[#40ffa7]/40">
                    Live Session Active
                  </span>
                </div>

                {/* Session Participant Snippet */}
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Teacher</span>
                    <span className="font-bold text-white">Dr. Sarah Jenkins</span>
                    <span className="text-slate-300 text-[10px] block">AQA & Edexcel Specification Lead</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Subject</span>
                    <span className="font-bold text-[#40ffa7]">GCSE Mathematics</span>
                    <span className="text-slate-300 text-[10px] block">Higher Tier Past Paper Prep</span>
                  </div>
                </div>

                {/* Live Whiteboard Canvas Mockup */}
                <div className="relative h-44 rounded-2xl bg-[#050167]/70 border border-[#40ffa7]/20 p-4 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 text-[#40ffa7] font-semibold">
                      <PenTool className="w-3.5 h-3.5 text-[#40ffa7]" />
                      Digital Whiteboard Active
                    </span>
                    <span>Synchronized Pen (0.0ms delay)</span>
                  </div>

                  {/* Visual Drawn Equation Mockup */}
                  <div className="my-auto font-mono text-sm sm:text-base text-center space-y-1">
                    <div className="text-[#40ffa7] font-bold">ax² + bx + c = 0</div>
                    <div className="text-amber-300 text-xs font-semibold">
                      x = (-b ± √(b² - 4ac)) / (2a)
                    </div>
                    <div className="text-[#40ffa7] text-[11px] italic">
                      ✓ Tutor Annotation: "Remember the ± sign gives both roots for full marks!"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>1080p WebRTC High-Fidelity Audio</span>
                    <span>Slide 4 of 12</span>
                  </div>
                </div>

                {/* Real-Time Parent Notification Teaser Card */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Parent Visibility in Action:</span>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      "Homework assigned for Alex: Due Thursday 18:00. Automatic email notification dispatched to parent account."
                    </p>
                  </div>
                </div>

                {/* Direct Link to Classroom */}
                <div className="pt-1">
                  <Link
                    to="/classroom/ROOM-GCSE-MATH-LIVE"
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Experience Live Virtual Classroom</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* SECTION 2: STRUGGLING AT SCHOOL? NOT YOUR CHILD'S FAULT   */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-[#f0faff]/60 to-white border-b border-slate-200/80 relative overflow-hidden">
        {/* Subtle decorative background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#40ffa7]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#050167]/5 border border-[#050167]/15 text-[#050167] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#050167]" />
              <span>Empathetic Academic Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Struggling at School? It Is Not Your Child's Fault
            </h2>
            <div className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed space-y-5">
              <p className="max-w-2xl mx-auto">
                Most children who fall behind are not lazy, and they are not failing because they do not care. 
                They are usually stuck for a reason nobody has had the time to find.
              </p>
              
              {/* Elegant Pull-Quote Card with Glowing Accent */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#050167]/5 via-white to-[#40ffa7]/10 border-l-4 border-l-[#40ffa7] border-y border-r border-slate-200/80 shadow-lg shadow-[#050167]/5 text-slate-800 text-left">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#050167] text-[#40ffa7] shrink-0 shadow-md">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium italic leading-relaxed text-slate-800 text-base sm:text-lg">
                      "When children are told to 'try harder' without anyone finding the real cause, they start to believe they are simply not clever enough. That belief does more damage than any single bad grade. We built Beacon Bridge Academics to find the real reason, fix it, and help your child feel capable again."
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="w-2 h-2 rounded-full bg-[#40ffa7]" />
                      <span className="text-xs font-bold text-[#050167] uppercase tracking-wider">Educational Leadership Insight • UK Curriculum Standard</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            <div className="group relative p-8 rounded-3xl bg-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-black text-lg shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                    01
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                    Root Factor: Curriculum Continuity
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#050167] mb-2.5 group-hover:text-[#001f3f] transition-colors">A gap nobody noticed</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                  One topic missed in Year 8 can quietly undermine maths in Year 10. Without a teacher to spot it, the gap grows into severe exam anxiety.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs text-[#050167] font-semibold">
                <span>Diagnostic Assessment Solves This</span>
                <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-black text-lg shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                    02
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                    Root Factor: Learning Velocity
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#050167] mb-2.5 group-hover:text-[#001f3f] transition-colors">A pace that does not fit</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                  Classrooms move at one speed. Some children need longer, and some need a different explanation altogether before moving on.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs text-[#050167] font-semibold">
                <span>Tailored 1-to-1 Pacing</span>
                <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-black text-lg shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                    03
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                    Root Factor: Exam Technique
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#050167] mb-2.5 group-hover:text-[#001f3f] transition-colors">Exams that test technique as well as knowledge</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                  Your child can follow every lesson and still lose marks to timing, command words and the way a mark scheme works.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs text-[#050167] font-semibold">
                <span>Mark Scheme Mastery Coaching</span>
                <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-black text-lg shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                    04
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                    Root Factor: Family Transparency
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#050167] mb-2.5 group-hover:text-[#001f3f] transition-colors">Not enough visibility for parents</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                  Many parents only hear how their child is doing at parents' evening, when it can be too late to change anything.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs text-[#050167] font-semibold">
                <span>Continuous Parent Portal & Alerts</span>
                <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: SIGNS YOUR CHILD MAY NEED EXTRA SUPPORT (CAROUSEL)*/}
      {/* ========================================================= */}
      <section id="support-needed" className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 bg-gradient-to-b from-[#f0faff] to-white border-b border-[#050167]/10 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Behavioral & Academic Observations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Signs Your Child May Need Extra Support
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Every child has bad weeks. These are the patterns worth paying attention to:
            </p>
          </div>

          {/* Interactive Pattern Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
            {signs.map((sign, idx) => (
              <button
                key={sign.id}
                type="button"
                onClick={() => setSignsSlide(idx)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                  signsSlide === idx
                    ? 'bg-[#050167] border-[#40ffa7] text-white shadow-lg shadow-[#050167]/20 scale-102 ring-2 ring-[#40ffa7]/30'
                    : 'bg-white border-[#050167]/15 text-[#001f3f]/70 hover:bg-[#f0faff] hover:border-[#050167]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${signsSlide === idx ? 'text-[#40ffa7]' : 'text-[#050167]'}`}>
                    {sign.badge}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${signsSlide === idx ? 'bg-[#40ffa7] animate-pulse' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs font-bold line-clamp-1">
                  {sign.title.split('.')[0]}
                </p>
              </button>
            ))}
          </div>

          {/* Interactive Showcase Card */}
          <div className="relative bg-white rounded-3xl border border-[#050167]/15 p-8 sm:p-12 shadow-2xl shadow-[#050167]/8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#40ffa7]/15 via-transparent to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#050167]/10">
              <div className="flex items-center space-x-3">
                <span className="px-4 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold shadow-sm">
                  {signs[signsSlide].badge} of 5
                </span>
                <span className="text-xs text-[#001f3f]/60 font-medium">Click arrows, tabs, or dots to review patterns</span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSignsSlide(prev => (prev === 0 ? signs.length - 1 : prev - 1))}
                  className="p-3 rounded-2xl border border-[#050167]/20 hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] text-[#050167] transition-all active:scale-95 cursor-pointer shadow-sm"
                  aria-label="Previous Sign"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSignsSlide(prev => (prev === signs.length - 1 ? 0 : prev + 1))}
                  className="p-3 rounded-2xl border border-[#050167]/20 hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] text-[#050167] transition-all active:scale-95 cursor-pointer shadow-sm"
                  aria-label="Next Sign"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide Content */}
            <div className="min-h-[160px] flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Observed Pattern</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#050167] leading-snug">
                "{signs[signsSlide].title}"
              </h3>
              <p className="text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
                {signs[signsSlide].description}
              </p>
              
              {/* How We Help Focus Card */}
              <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#f0faff] via-white to-[#40ffa7]/15 border-2 border-[#40ffa7]/40 flex items-start gap-4 text-sm sm:text-base text-[#001f3f] shadow-md">
                <div className="p-2.5 rounded-xl bg-[#050167] text-[#40ffa7] shrink-0 mt-0.5 shadow-sm">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#050167] block text-xs uppercase tracking-wider mb-1">
                    How Beacon Bridge Academics Helps:
                  </span>
                  <span className="font-semibold text-slate-800 leading-relaxed">
                    {signs[signsSlide].advice}
                  </span>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center space-x-2.5 mt-8 pt-6 border-t border-[#050167]/10">
              {signs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSignsSlide(i)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    signsSlide === i ? 'w-10 bg-[#050167]' : 'w-2.5 bg-[#050167]/20 hover:bg-[#050167]/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Reassurance Callout */}
          <div className="mt-8 p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#050167] via-[#001f3f] to-[#050167] border border-[#40ffa7]/30 text-white text-sm sm:text-base leading-relaxed text-center font-medium shadow-xl shadow-[#050167]/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-[#40ffa7]/10 to-transparent pointer-events-none" />
            <strong className="text-[#40ffa7] font-bold block text-base mb-1.5 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#40ffa7]" />
              Our Core Educational Principle:
            </strong>
            None of these means your child is not capable. They usually mean there is a gap to close, and gaps can be fixed. 
            The earlier support starts, the easier it is.
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: ONE PLACE TO HELP YOUR CHILD CATCH UP          */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 bg-white border-b border-[#050167]/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 border border-[#050167]/15 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-[#050167]" />
              <span>The Three Fundamentals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              One Place to Help Your Child Catch Up and Get Exam-Ready
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              Beacon Bridge Academics is an online academic support company for students in the 
              <strong className="text-[#050167]"> UK, the US, Canada, and Australia</strong>. We bring together three things parents tell us they want:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#050167] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl">
                Pillar 01
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-xl shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right teacher</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed mb-6">
                  Every teacher is trained in the curriculum your child is studying, so lessons target what the exam actually asks.
                </p>

                {/* Interactive Micro-Widget */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#050167]/10 shadow-xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#050167]">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
                      Specification Lead
                    </span>
                    <span className="text-[#40ffa7] bg-[#050167] px-2 py-0.5 rounded-md text-[10px]">100% DBS</span>
                  </div>
                  <p className="text-[11px] text-[#001f3f]/70">
                    AQA • Edexcel • OCR • WJEC Curriculum Specialist
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
                <span>Syllabus & Mark Scheme Mastery</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#001f3f] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl">
                Pillar 02
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001f3f] to-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-xl shadow-[#001f3f]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right tools</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed mb-6">
                  Lessons take place in our own live virtual classroom, with a digital whiteboard, screen sharing, and real-time annotation of slides and PDFs.
                </p>

                {/* Interactive Micro-Widget */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#050167]/10 shadow-xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#001f3f]">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#40ffa7] fill-[#001f3f]" />
                      Synchronized Whiteboard
                    </span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-bold">&lt; 20ms Latency</span>
                  </div>
                  <p className="text-[11px] text-[#001f3f]/70">
                    Dual Pen • 1080p WebRTC • Zero Downloads Needed
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f] flex items-center justify-between">
                <span>Synchronized Educational Technology</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#050167] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl">
                Pillar 03
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-xl shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right visibility</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed mb-6">
                  Your parent account shows progress, attendance and announcements, and you receive an email whenever homework is set or completed.
                </p>

                {/* Interactive Micro-Widget */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#050167]/10 shadow-xs space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#050167]">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-500" />
                      Live Family Notification
                    </span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[10px] font-bold">Instant Email</span>
                  </div>
                  <p className="text-[11px] text-[#001f3f]/70">
                    Homework Dispatched • Lesson Recap • Attendance Log
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
                <span>Transparent Family Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* DISCOVERY PORTAL: CURRICULUM, HOW IT WORKS, ABOUT US      */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-[#f0faff] via-white to-[#f0faff] border-b border-[#050167]/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Dedicated Academic Portals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Explore Beacon Bridge Academics
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Dive deeper into our curricula, onboarding workflow, and teaching faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Curriculum & Exam Boards */}
            <div className="group bg-white rounded-3xl p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-lg shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-3">
                  KS3 • GCSE • A-Level
                </span>
                <h3 className="text-2xl font-bold text-[#050167] mb-2.5">Curriculum & Exam Boards</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed mb-6">
                  Targeted specification preparation for AQA, Edexcel, OCR and WJEC. Tailored pathways for school-age students, homeschoolers, and relocating families.
                </p>
              </div>
              <Link
                to="/curriculum"
                className="inline-flex items-center justify-between w-full p-3.5 rounded-xl bg-[#f0faff] hover:bg-[#40ffa7] text-[#050167] font-bold text-xs transition-colors"
              >
                <span>View Full Curriculum & Stages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: How It Works */}
            <div className="group bg-white rounded-3xl p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-lg shadow-[#001f3f]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-3">
                  4 Steps • 30-Day Plan • Live Room
                </span>
                <h3 className="text-2xl font-bold text-[#050167] mb-2.5">How It Works & Virtual Classroom</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed mb-6">
                  Experience our 4-step onboarding, 30-day timeline, and purpose-built virtual classroom with live whiteboard, PDF annotation, and automated attendance tracking.
                </p>
              </div>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-between w-full p-3.5 rounded-xl bg-[#f0faff] hover:bg-[#40ffa7] text-[#050167] font-bold text-xs transition-colors"
              >
                <span>Explore How It Works</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: About Us */}
            <div className="group bg-white rounded-3xl p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-lg shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-3">
                  Licensed Educators • 100% DBS
                </span>
                <h3 className="text-2xl font-bold text-[#050167] mb-2.5">About Us & Safeguarding</h3>
                <p className="text-sm text-[#001f3f]/80 leading-relaxed mb-6">
                  Led by experienced educators with international licences. Read our rigorous safeguarding standards, parent promise, and authentic educational integrity policy.
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center justify-between w-full p-3.5 rounded-xl bg-[#f0faff] hover:bg-[#40ffa7] text-[#050167] font-bold text-xs transition-colors"
              >
                <span>Read About Our Heritage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: WHY PARENTS CHOOSE ONLINE TUTORING            */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 text-sky-600" />
              <span>Family-First Convenience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Why Parents Choose Online Tutoring
            </h2>
          </div>

          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-slate-200 text-slate-700 text-base sm:text-lg leading-relaxed space-y-6 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Visual Value Chips */}
            <div className="flex flex-wrap gap-2.5 pb-4 border-b border-slate-200">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                🚗 Zero Commute Time
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                🏡 Familiar Home Comfort
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                🌍 Postcode Freedom
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                📼 Rewatchable Recordings
              </span>
            </div>

            <p>
              Online tutoring fits around family life. There is no travel, no waiting in the car, and no lesson lost to traffic. Your child learns in a familiar, comfortable place, which many students find less stressful than a stranger's kitchen table or a crowded centre.
            </p>
            <p>
              Teachers are not limited to your postcode either, so you can find specialist knowledge of a particular subject or exam board wherever it is. Recorded sessions mean a student can revisit a difficult explanation as many times as they need.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 16: CLEAR, SIMPLE PRICING                         */}
      {/* ========================================================= */}
      <section id="pricing" className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 bg-white border-b border-[#050167]/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#050167]" />
            <span>Honest & Transparent</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#001f3f] tracking-tight">
            Clear, Simple Pricing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed max-w-2xl mx-auto">
            You should know what you are paying before you begin. We will explain our lesson prices at your consultation, with no hidden fees. 
            Payment is by bank transfer, and you receive an email confirmation once it has been checked.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              to="/payment-proof"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#f0faff] to-[#40ffa7]/20 hover:from-[#40ffa7]/30 hover:to-[#40ffa7]/40 text-[#050167] font-black text-xs sm:text-sm transition-all border border-[#050167]/20 shadow-lg shadow-[#050167]/5 hover:-translate-y-0.5 active:scale-95"
            >
              <Building2 className="w-4 h-4 text-[#050167]" />
              <span>Inspect Institutional Bank & Tuition Details</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 17: FREQUENTLY ASKED QUESTIONS                    */}
      {/* ========================================================= */}
      <section id="faq" className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 bg-gradient-to-b from-[#f0faff] to-white border-b border-[#050167]/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
                    isOpen 
                      ? 'border-[#40ffa7] bg-white ring-2 ring-[#40ffa7]/30 shadow-xl' 
                      : 'border-[#050167]/15 bg-white hover:border-[#40ffa7]/50 hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-5 px-6 sm:px-8 text-left font-bold text-base sm:text-lg text-[#050167] flex items-center justify-between hover:bg-[#f0faff]/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isOpen ? 'bg-[#050167] text-[#40ffa7]' : 'bg-[#f0faff] text-[#050167]'}`}>
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#050167] shrink-0 ml-3" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 pt-2 text-sm sm:text-base text-[#001f3f]/80 leading-relaxed border-t border-[#050167]/10 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 18: READY TO HELP YOUR CHILD FEEL CONFIDENT AGAIN?*/}
      {/* ========================================================= */}
      <section className="py-24 sm:py-36 bg-gradient-to-br from-[#050167] via-[#001f3f] to-[#050167] text-white text-center relative overflow-hidden border-t border-[#40ffa7]/30">
        <div className="absolute inset-0 bg-radial-gradient from-[#40ffa7]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Transform Academic Confidence Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Ready to Help Your Child Feel Confident Again?
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-[#f0faff]/90 max-w-xl mx-auto leading-relaxed">
            Tell us what your child is finding hard. We will listen, explain how we can help, and help you decide the next step.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-2xl shadow-[#40ffa7]/40 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-5 h-5 text-[#001f3f]" />
            </Link>
            <Link
              to="/payment-proof"
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-base border border-white/25 transition-all active:scale-95 flex items-center justify-center"
            >
              Tuition Coordinates
            </Link>
          </div>

          <div className="mt-8 text-xs text-[#40ffa7] font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#40ffa7]" />
            <span>No pressure. No hidden fees. Honest academic guidance for your family.</span>
          </div>

        </div>
      </section>

    </div>
  );
};
