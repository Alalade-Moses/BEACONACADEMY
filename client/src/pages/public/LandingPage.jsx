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
  ExternalLink
} from 'lucide-react';

export const LandingPage = () => {
  // Hero Background Carousel State
  const [heroSlide, setHeroSlide] = useState(0);

  // Other Interactive Carousels
  const [signsSlide, setSignsSlide] = useState(0);
  const [stagesSlide, setStagesSlide] = useState(0);
  const [monthSlide, setMonthSlide] = useState(0);
  const [classroomSlide, setClassroomSlide] = useState(0);
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

  // 2. Stages Data
  const stages = [
    {
      id: 'gcse',
      badge: 'Years 10 & 11',
      title: 'GCSE Tutoring Online',
      subtitle: 'Targeted specification revision & exam technique',
      description: 'Whether your child is aiming to secure a grade 4, push for a 7, or retake an exam, our teachers work through the specification with them, topic by topic, using past-paper practice and clear feedback.',
      features: ['AQA, Edexcel, OCR, and WJEC focus', 'Command-word dissection & timing strategies', 'Step-by-step past paper walkthroughs']
    },
    {
      id: 'alevel',
      badge: 'Years 12 & 13',
      title: 'A-Level Tutoring Online',
      subtitle: 'Deep content mastery & independent critical thinking',
      description: 'A-Level means deeper content, longer papers and far more independent study. We help students build the habits and the understanding to cope with the step up.',
      features: ['Advanced essay structuring & analytical frameworks', 'Complex synoptic paper navigation', 'University & UCAS grade requirement prep']
    },
    {
      id: 'ks3',
      badge: 'Years 7 to 9',
      title: 'KS3 Academic Support',
      subtitle: 'Early foundational strength before GCSEs',
      description: 'Strong foundations in Years 7 to 9 make GCSEs far easier. We help children close gaps early, before they grow into serious secondary school roadblocks.',
      features: ['Core numeracy & algebraic fluency', 'Reading comprehension & structured writing', 'Rebuilding confidence before mock exams']
    },
    {
      id: 'homeschool',
      badge: 'Home Education',
      title: 'Homeschooled Students',
      subtitle: 'Structured curricula & specialist subject knowledge',
      description: 'If you teach at home, our teachers can provide structure, specialist subject knowledge and an exam-board focus for GCSEs and A-Levels.',
      features: ['Structured lesson plans aligned to exam boards', 'Regular formal assessments & mock grading', 'Independent parent reports & attendance tracking']
    },
    {
      id: 'international',
      badge: 'International Moves',
      title: 'Families Moving Between School Systems',
      subtitle: 'Smooth transition across UK, US, Canada & Australia',
      description: 'Moving to or from the UK? Year groups, subjects and exam styles differ between the UK, US, Canada and Australia. Our teachers help your child bridge the gap without losing confidence.',
      features: ['Cross-curriculum alignment & mapping', 'Terminology and exam format translation', 'Pacing matched to the new country’s academic calendar']
    }
  ];

  // 3. Exam Boards Data
  const examBoards = [
    {
      badge: 'AQA',
      name: 'AQA',
      fullName: 'Assessment and Qualifications Alliance',
      subjects: 'GCSE & A-Level Maths, English Language/Literature, Sciences, Humanities',
      focus: 'High focus on direct assessment objectives (AO1, AO2, AO3) and specific question stem phrasing.'
    },
    {
      badge: 'Edexcel',
      name: 'Pearson Edexcel',
      fullName: 'Edexcel GCSE & International GCSE (iGCSE)',
      subjects: 'Edexcel Maths (Higher/Foundation), English, History, Sciences',
      focus: 'Emphasises multi-step problem solving, problem context interpretation, and precise mark allocation.'
    },
    {
      badge: 'OCR',
      name: 'OCR',
      fullName: 'Oxford Cambridge and RSA',
      subjects: 'OCR GCSE & A-Level Sciences, Computer Science, Classical Civilisation',
      focus: 'Rigorous data analysis, synoptic connections across modules, and mathematical physics/chemistry skills.'
    },
    {
      badge: 'WJEC',
      name: 'WJEC / Eduqas',
      fullName: 'Welsh Joint Education Committee & Eduqas',
      subjects: 'GCSE English Language, Media Studies, Drama, Religious Studies',
      focus: 'Distinctive textual analysis approaches, timing constraints, and comparative literature matrices.'
    }
  ];

  // 4. First Month Timeline Data
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

  // 5. Classroom Features Data
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
      icon: FileText
    },
    {
      title: 'Screen Sharing for Worked Examples',
      description: 'Share coding environments, graphing calculators (Desmos), or simulation software in crisp high definition.',
      icon: Layers
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

  // 6. FAQs
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
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2.5">
              Empathetic Academic Support
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Struggling at School? It Is Not Your Child's Fault
            </h2>
            <div className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed space-y-4">
              <p>
                Most children who fall behind are not lazy, and they are not failing because they do not care. 
                They are usually stuck for a reason nobody has had the time to find.
              </p>
              <p className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-slate-800 font-medium italic">
                "When children are told to 'try harder' without anyone finding the real cause, they start to believe they are simply not clever enough. That belief does more damage than any single bad grade. We built Beacon Bridge Academics to find the real reason, fix it, and help your child feel capable again."
              </p>
            </div>
          </div>

          {/* 4 Core Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-black text-base mb-5 shadow-sm">
                01
              </div>
              <h3 className="text-xl font-bold text-[#050167] mb-2">A gap nobody noticed</h3>
              <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                One topic missed in Year 8 can quietly undermine maths in Year 10. Without a teacher to spot it, the gap grows into severe exam anxiety.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-black text-base mb-5 shadow-sm">
                02
              </div>
              <h3 className="text-xl font-bold text-[#050167] mb-2">A pace that does not fit</h3>
              <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                Classrooms move at one speed. Some children need longer, and some need a different explanation altogether before moving on.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-black text-base mb-5 shadow-sm">
                03
              </div>
              <h3 className="text-xl font-bold text-[#050167] mb-2">Exams that test technique as well as knowledge</h3>
              <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                Your child can follow every lesson and still lose marks to timing, command words and the way a mark scheme works.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-black text-base mb-5 shadow-sm">
                04
              </div>
              <h3 className="text-xl font-bold text-[#050167] mb-2">Not enough visibility for parents</h3>
              <p className="text-sm text-[#001f3f]/80 leading-relaxed">
                Many parents only hear how their child is doing at parents' evening, when it can be too late to change anything.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: SIGNS YOUR CHILD MAY NEED EXTRA SUPPORT (CAROUSEL)*/}
      {/* ========================================================= */}
      <section id="support-needed" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
              Behavioral & Academic Observations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001f3f] tracking-tight">
              Signs Your Child May Need Extra Support
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Every child has bad weeks. These are the patterns worth paying attention to:
            </p>
          </div>

          {/* Interactive Carousel */}
          <div className="relative bg-white rounded-3xl border border-[#050167]/15 p-8 sm:p-12 shadow-xl shadow-[#050167]/5">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#050167]/10">
              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold">
                  {signs[signsSlide].badge} of 5
                </span>
                <span className="text-xs text-[#001f3f]/60 font-medium">Click arrows or dots to review patterns</span>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSignsSlide(prev => (prev === 0 ? signs.length - 1 : prev - 1))}
                  className="p-2.5 rounded-xl border border-[#050167]/20 hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] text-[#050167] transition-colors active:scale-95 cursor-pointer"
                  aria-label="Previous Sign"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSignsSlide(prev => (prev === signs.length - 1 ? 0 : prev + 1))}
                  className="p-2.5 rounded-xl border border-[#050167]/20 hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] text-[#050167] transition-colors active:scale-95 cursor-pointer"
                  aria-label="Next Sign"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide Content */}
            <div className="min-h-[160px] flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#050167] leading-snug mb-3">
                "{signs[signsSlide].title}"
              </h3>
              <p className="text-base text-[#001f3f]/80 leading-relaxed mb-6">
                {signs[signsSlide].description}
              </p>
              <div className="p-4 rounded-2xl bg-[#f0faff] border border-[#050167]/15 flex items-start gap-3 text-sm text-[#001f3f] font-medium">
                <Lightbulb className="w-5 h-5 text-[#050167] shrink-0 mt-0.5" />
                <span><strong className="text-[#050167]">How Beacon Bridge Academics Helps:</strong> {signs[signsSlide].advice}</span>
              </div>
            </div>

            {/* Dots */}
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
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#050167] border border-[#40ffa7]/30 text-white text-sm sm:text-base leading-relaxed text-center font-medium shadow-md">
            <strong className="text-[#40ffa7] font-bold block text-base mb-1">Our Core Educational Principle:</strong>
            None of these means your child is not capable. They usually mean there is a gap to close, and gaps can be fixed. 
            The earlier support starts, the easier it is.
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: ONE PLACE TO HELP YOUR CHILD CATCH UP          */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              The Three Fundamentals
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              One Place to Help Your Child Catch Up and Get Exam-Ready
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              Beacon Bridge Academics is an online academic support company for students in the 
              <strong className="text-[#050167]"> UK, the US, Canada, and Australia</strong>. We bring together three things parents tell us they want:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1 */}
            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right teacher</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed">
                  Every teacher is trained in the curriculum your child is studying, so lessons target what the exam actually asks.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167]">
                Syllabus & Mark Scheme Mastery
              </div>
            </div>

            {/* 2 */}
            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-md shadow-[#001f3f]/20 border border-[#40ffa7]/30">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right tools</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed">
                  Lessons take place in our own live virtual classroom, with a digital whiteboard, screen sharing, and real-time annotation of slides and PDFs.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f]">
                Synchronized Educational Technology
              </div>
            </div>

            {/* 3 */}
            <div className="p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-6 shadow-md shadow-[#050167]/20 border border-[#40ffa7]/30">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right visibility</h3>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed">
                  Your parent account shows progress, attendance and announcements, and you receive an email whenever homework is set or completed.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167]">
                Transparent Family Dashboard
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: ONLINE TUTORING FOR EVERY STAGE (TABS)         */}
      {/* ========================================================= */}
      <section id="stages" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Targeted Curriculum Pathways
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Online Tutoring for Every Stage: KS3, GCSE and A-Level
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Explore how we tailor lessons to each academic milestone.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#050167]/15 p-6 sm:p-12 shadow-xl shadow-[#050167]/5">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2.5 mb-8 pb-6 border-b border-[#050167]/10 justify-center">
              {stages.map((stg, idx) => (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setStagesSlide(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    stagesSlide === idx
                      ? 'bg-[#050167] text-[#40ffa7] shadow-md border-b-2 border-[#40ffa7]'
                      : 'bg-[#f0faff] text-[#001f3f]/80 hover:bg-[#050167]/10 hover:text-[#050167]'
                  }`}
                >
                  {stg.badge}: {stg.title}
                </button>
              ))}
            </div>

            {/* Stage Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block">
                  {stages[stagesSlide].badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#050167]">
                  {stages[stagesSlide].title}
                </h3>
                <p className="text-sm font-bold text-[#001f3f]/70">
                  {stages[stagesSlide].subtitle}
                </p>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed">
                  {stages[stagesSlide].description}
                </p>

                <div className="pt-2 space-y-2.5">
                  {stages[stagesSlide].features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-xs sm:text-sm text-[#001f3f] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0 fill-[#050167]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs shadow-md shadow-[#40ffa7]/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Enrol for {stages[stagesSlide].title}</span>
                    <ArrowRight className="w-4 h-4 text-[#001f3f]" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#050167] to-[#001f3f] p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4 border border-[#40ffa7]/20">
                <span className="text-xs text-[#40ffa7] font-bold uppercase tracking-wider block">
                  Why Our Approach Works
                </span>
                <h4 className="text-lg font-bold text-white">
                  Exam Technique + Subject Fluency
                </h4>
                <p className="text-xs text-[#f0faff]/80 leading-relaxed">
                  "Our teachers work through the specification with students, topic by topic, using past-paper practice, examiner mark schemes and clear, supportive feedback."
                </p>
                <div className="p-3 bg-white/10 rounded-2xl text-xs text-[#f0faff] space-y-1.5">
                  <div>✓ Exact Exam-Board Specification Match</div>
                  <div>✓ Real-Time Homework & Attendance Alerts</div>
                  <div>✓ Recorded Sessions for Easy Revision</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: SUPPORT FOR EVERY MAJOR UK EXAM BOARD          */}
      {/* ========================================================= */}
      <section id="exam-boards" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Specification Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Support for Every Major UK Exam Board
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              Two students can study the same subject and sit very different exams. 
              <strong className="text-[#050167]"> AQA, Edexcel, OCR and WJEC (including Eduqas)</strong> each set their own papers, question styles and mark schemes. 
              That is why we ask for your child's exam board at the start. Our teachers prepare lessons around the specification your child will actually sit, so practice questions, revision plans and feedback match the real exam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examBoards.map((board) => (
              <div
                key={board.name}
                className="bg-[#f0faff] rounded-3xl p-6 sm:p-7 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/8 transition-all flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] font-black text-xs uppercase tracking-wider mb-4 shadow-xs group-hover:border-[#40ffa7] group-hover:text-[#001f3f] transition-colors">
                    {board.badge}
                  </div>
                  <h3 className="text-lg font-bold text-[#050167] mb-1">{board.name}</h3>
                  <p className="text-xs text-[#001f3f]/80 font-bold mb-3">{board.fullName}</p>
                  <p className="text-xs text-[#001f3f]/75 leading-relaxed mb-4">
                    {board.focus}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#050167]/10 text-[11px] text-[#001f3f]/70 font-semibold">
                  {board.subjects}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: HOW BEACON BRIDGE ACADEMICS WORKS (4 STEPS)    */}
      {/* ========================================================= */}
      <section id="how-it-works" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Onboarding Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              How Beacon Bridge Academics Works
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              A transparent, safe, and family-first journey from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#050167] text-[#40ffa7] font-black flex items-center justify-center mb-4 text-base shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#050167] mb-2">Register as a family</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  A parent completes one registration form for themselves and their child, together. This keeps every account accurate and linked correctly from day one.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#050167]/10 text-xs font-bold text-[#050167]">
                Unified Family Account
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#001f3f] text-[#40ffa7] font-black flex items-center justify-center mb-4 text-base shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#050167] mb-2">Speak to a teacher first</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Before lessons begin, you have a consultation with a teacher. You discuss your child's goals, their difficulties, and the exam board they follow.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f]">
                1-on-1 Consultation
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#050167] text-[#40ffa7] font-black flex items-center justify-center mb-4 text-base shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#050167] mb-2">Get set up</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Our team completes your onboarding and confirms your plan, and your child is matched with a teacher who knows their syllabus.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#050167]/10 text-xs font-bold text-[#050167]">
                Custom Teacher Matching
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#001f3f] text-[#40ffa7] font-black flex items-center justify-center mb-4 text-base shadow-sm">
                  4
                </div>
                <h3 className="text-lg font-bold text-[#050167] mb-2">Learn live & track progress</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Lessons take place in our live classroom. You follow progress, attendance and homework directly from your parent account.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f]">
                Live Class + Parent Portal
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: WHAT HAPPENS IN THE FIRST MONTH                */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Structured 30-Day Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001f3f] tracking-tight">
              What Happens in the First Month
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Step-by-step clarity on your family's initial four weeks.
            </p>
          </div>

          <div className="bg-[#f0faff] rounded-3xl border border-[#050167]/15 p-8 sm:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#050167]/10">
              <span className="text-xs font-bold text-[#050167] uppercase tracking-wider">
                {monthPhases[monthSlide].phase}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setMonthSlide(prev => (prev === 0 ? monthPhases.length - 1 : prev - 1))}
                  className="p-2.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] active:scale-95 cursor-pointer"
                  aria-label="Previous Month Phase"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMonthSlide(prev => (prev === monthPhases.length - 1 ? 0 : prev + 1))}
                  className="p-2.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] hover:bg-[#40ffa7]/20 hover:border-[#40ffa7] active:scale-95 cursor-pointer"
                  aria-label="Next Month Phase"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="min-h-[140px] flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-black text-[#050167] mb-3">
                {monthPhases[monthSlide].title}
              </h3>
              <p className="text-base text-[#001f3f]/80 leading-relaxed">
                {monthPhases[monthSlide].description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-8 pt-6 border-t border-[#050167]/10">
              {monthPhases.map((phase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMonthSlide(idx)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    monthSlide === idx
                      ? 'bg-[#050167] text-[#40ffa7] shadow-md border-b-2 border-[#40ffa7]'
                      : 'bg-white text-[#001f3f]/80 hover:bg-[#050167]/10 border border-[#050167]/15'
                  }`}
                >
                  <span className="block font-bold truncate">{phase.phase}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 9: A LIVE ONLINE CLASSROOM BUILT FOR TEACHING     */}
      {/* ========================================================= */}
      <section id="virtual-classroom" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#001f3f] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#40ffa7] uppercase tracking-wider block mb-2.5">
              Engineered for Education
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              A Live Online Classroom Built for Teaching
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#f0faff]/80 leading-relaxed">
              A video call is not a classroom. Ours was designed for teaching from the start, so lessons feel like working at a board with a teacher beside you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Feature List */}
            <div className="lg:col-span-5 space-y-3">
              {classroomFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                const isCurrent = classroomSlide === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setClassroomSlide(idx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-3.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#050167] border-[#40ffa7] text-white shadow-xl shadow-[#050167]/50'
                        : 'bg-[#001f3f]/60 border-[#050167]/40 text-[#f0faff]/60 hover:bg-[#050167]/30 hover:text-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isCurrent ? 'bg-[#40ffa7] text-[#001f3f] font-bold' : 'bg-[#050167] text-[#40ffa7]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-[#f0faff]/90'}`}>
                        {feat.title}
                      </h3>
                      <p className="text-xs text-[#f0faff]/60 mt-1 line-clamp-2">
                        {feat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage Preview Box */}
            <div className="lg:col-span-7 bg-[#050167]/80 border border-[#40ffa7]/30 rounded-3xl p-6 sm:p-8 relative shadow-2xl">
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
                <div className="aspect-video bg-[#001f3f] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#40ffa7] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#40ffa7]" />
                      Active Feature: {classroomFeatures[classroomSlide].title}
                    </span>
                    <span className="text-[11px] text-slate-300">Dr. Sarah Jenkins & Alex Morgan</span>
                  </div>

                  <div className="text-center max-w-md mx-auto my-auto space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#40ffa7]/20 text-[#40ffa7] border border-[#40ffa7]/30 mx-auto flex items-center justify-center shadow-lg">
                      <PenTool className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      {classroomFeatures[classroomSlide].title}
                    </h4>
                    <p className="text-xs text-[#f0faff]/70 leading-relaxed">
                      {classroomFeatures[classroomSlide].description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-[#f0faff]/60">
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
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-xs shadow-md shadow-[#40ffa7]/30 transition-all active:scale-95 cursor-pointer"
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
      {/* SECTION 10: STAY IN THE LOOP WITH YOUR PARENT ACCOUNT     */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Continuous Family Visibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001f3f] tracking-tight">
              Stay in the Loop With Your Parent Account
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              You should never have to guess how your child is getting on. 
              Each family has a parent account linked to their child's, where you can see their progress, attendance, and announcements from their teacher.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#f0faff] border border-[#050167]/15 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 shadow-md border border-[#40ffa7]/30">
              <Mail className="w-8 h-8" />
            </div>
            <div className="flex-1 text-[#001f3f]/80 text-sm sm:text-base leading-relaxed space-y-2">
              <h3 className="text-xl font-bold text-[#050167]">Direct In-App & Email Notifications</h3>
              <p>
                When a teacher sets homework, you and your child receive an email with the deadline. 
                When it is handed in, you are told. If it is not completed in time, you will know that too, so you can step in early and kindly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 11: SAFEGUARDING COMES FIRST                      */}
      {/* ========================================================= */}
      <section id="safeguarding" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-[#40ffa7]" />
              <span>Rigorous Child Safety</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Safeguarding Comes First
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              We take the safety of children seriously, and we have built it into how Beacon Bridge Academics works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="p-7 rounded-3xl bg-white border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050167] mb-1">Joint Family Registration</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Parents and children register together, so accounts are accurate and properly linked from day one.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050167] mb-1">Consultation Before Lessons</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Every family has a consultation first, so no child begins lessons with a teacher you have not spoken to.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050167] mb-1">Comprehensive Teacher Checks</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Every teacher goes through document verification, reference checks and criminal-record (DBS) checks before working with children.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-xl transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050167] mb-1">Curriculum Training Standards</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Teachers are trained across international curricula before they meet a student.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-xs text-[#001f3f]/70">
            Read our <a href="#safeguarding" className="font-semibold text-[#050167] hover:underline">Safeguarding Policy</a> and <a href="#safeguarding" className="font-semibold text-[#050167] hover:underline">Parent Code of Conduct</a> for full details.
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 12: WHY PARENTS CHOOSE ONLINE TUTORING            */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
              Family-First Convenience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Parents Choose Online Tutoring
            </h2>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 text-slate-700 text-base leading-relaxed space-y-4">
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
      {/* SECTION 13: SUBJECTS AND LEVELS WE COVER                  */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
              Comprehensive Subject Directory
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Subjects and Levels We Cover
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "GCSE Maths tutors", desc: "Foundation & Higher tiers for AQA, Edexcel and OCR." },
              { title: "GCSE English tutors", desc: "English Language & English Literature analysis." },
              { title: "GCSE Science tutors", desc: "Biology, Chemistry, and Physics (Combined & Triple)." },
              { title: "KS3 Maths and English tutors", desc: "Foundational numeracy and literacy for Years 7-9." },
              { title: "A-Level tutors", desc: "Advanced specialist subject coaching & mock exam prep." },
              { title: "Homeschool tutoring", desc: "Complete syllabus coverage and structured assessments." },
              { title: "US, Canadian & Australian curricula", desc: "Cross-system bridge support for relocating families." }
            ].map((sub, i) => (
              <div key={i} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sub.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sub.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 14: WHAT MAKES BEACON BRIDGE ACADEMICS DIFFERENT  */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2.5">
              The Beacon Bridge Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              What Makes Beacon Bridge Academics Different
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "We teach to your child's curriculum.",
                desc: "Not just the subject, but the exam board and the way it is assessed."
              },
              {
                title: "We keep parents informed.",
                desc: "A parent account, attendance records, and homework emails mean you are never in the dark."
              },
              {
                title: "We were built for struggling students.",
                desc: "Our aim is to rebuild confidence as well as grades."
              },
              {
                title: "We put safeguarding first.",
                desc: "Joint registration and a consultation before lessons begin."
              },
              {
                title: "We use modern tools properly.",
                desc: "A purpose-built classroom, not a borrowed video call."
              }
            ].map((diff, idx) => (
              <div key={idx} className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-sky-300 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{diff.title}</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 15: ABOUT US & OUR PROMISE TO PARENTS             */}
      {/* ========================================================= */}
      <section id="about" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#050167]/15 shadow-sm space-y-12">
            
            {/* About Us */}
            <div>
              <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
                Our Heritage & Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#050167] mb-5">
                About Beacon Bridge Academics
              </h2>
              <p className="text-base text-[#001f3f]/80 leading-relaxed">
                Beacon Bridge Academics is led by experienced educators with classroom experience, international teaching licences and a background in educational leadership. 
                We built Beacon around one simple belief: a struggling student does best with a teacher who knows their syllabus, modern tools that make lessons clear, and parents who can see what is happening. 
                Our teachers are trained across the UK, US, Canadian and Australian curricula before they meet a student, and the whole team shares one aim: 
                <strong className="text-[#050167]"> helping children feel capable again</strong>.
              </p>
            </div>

            {/* Promise to Parents */}
            <div id="promise" className="pt-8 border-t border-[#050167]/10">
              <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
                Authentic Educational Integrity
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#001f3f] mb-4">
                Our Promise to Parents
              </h3>
              <p className="text-base text-[#001f3f]/80 leading-relaxed">
                We are a new company, and we would rather earn your trust than ask for it. 
                That is why we promise to be honest about your child's progress, to explain things in plain English, and to tell you early if something is not working. 
                We will never pressure you into a plan, and we will never promise a grade we cannot control. 
                We will always be clear about what lessons cost, what your child is working on, and what we think should happen next.
              </p>
            </div>

            {/* Authentic Reviews Commitment */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#f0faff] border border-[#050167]/15 text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
              <strong className="text-[#050167] font-bold block text-sm mb-1">Authentic Reviews Policy:</strong>
              We reserve this section exclusively for real parent and student reviews following completed lesson series. 
              In keeping with our promise of transparency and integrity, we do not publish invented testimonials.
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 16: CLEAR, SIMPLE PRICING                         */}
      {/* ========================================================= */}
      <section id="pricing" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
            Honest & Transparent
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#001f3f] tracking-tight">
            Clear, Simple Pricing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed max-w-2xl mx-auto">
            You should know what you are paying before you begin. We will explain our lesson prices at your consultation, with no hidden fees. 
            Payment is by bank transfer, and you receive an email confirmation once it has been checked.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/payment-proof"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#f0faff] hover:bg-[#40ffa7]/20 text-[#050167] font-bold text-xs sm:text-sm transition-colors border border-[#050167]/20 active:scale-95"
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
      <section id="faq" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2.5">
              Got Questions?
            </span>
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
                  className={`rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    isOpen ? 'border-[#40ffa7] bg-white ring-1 ring-[#40ffa7]/30' : 'border-[#050167]/15 bg-white hover:border-[#40ffa7]/50'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-4.5 px-6 text-left font-bold text-base text-[#050167] flex items-center justify-between hover:bg-[#f0faff]/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#050167] shrink-0 ml-3" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#001f3f]/80 leading-relaxed border-t border-[#050167]/10">
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
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#050167] via-[#001f3f] to-[#050167] text-white text-center relative overflow-hidden border-t border-[#40ffa7]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Ready to Help Your Child Feel Confident Again?
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-[#f0faff]/90 max-w-xl mx-auto leading-relaxed">
            Tell us what your child is finding hard. We will listen, explain how we can help, and help you decide the next step.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-2xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Book a Consultation
            </Link>
            <Link
              to="/payment-proof"
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-base border border-white/25 transition-all active:scale-95"
            >
              Tuition Coordinates
            </Link>
          </div>

          <div className="mt-8 text-xs text-[#40ffa7]">
            No pressure. No hidden fees. Honest academic guidance for your family.
          </div>

        </div>
      </section>

    </div>
  );
};
