import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
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
  AlertTriangle,
  Lightbulb,
  Lock,
  Compass,
  Check,
  Calendar,
  CalendarCheck,
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
  Quote,
  Calculator,
  FlaskConical,
  PenLine,
  Code2,
  Globe2,
  Music,
  Palette,
  Languages
} from 'lucide-react';

// Animated counter hook
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export const LandingPage = () => {
  // Stats counter visibility
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const studentsCount = useCountUp(850, 1800, statsVisible);
  const tutorsCount = useCountUp(40, 1800, statsVisible);
  const sessionsCount = useCountUp(12000, 1800, statsVisible);
  const ratingCount = useCountUp(49, 1800, statsVisible);

  // Hero Background Carousel State
  const [heroSlide, setHeroSlide] = useState(0);

  // Other Interactive Carousels
  const [signsSlide, setSignsSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  // Authentic 10-Student & Parent Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Liam Henderson",
      role: "Student (Year 11)",
      location: "Guildford, Surrey",
      subject: "GCSE Higher Mathematics (Edexcel)",
      outcome: "Grade 4 in Mocks → Grade 9 in GCSEs",
      quote: "I used to panic during the 5-mark algebra and trigonometry questions. My tutor broke down the method step-by-step on the interactive whiteboard. I went from scraping a pass to getting a Grade 9!",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "GCSE Excellence"
    },
    {
      id: 2,
      name: "Amara Okonjo",
      role: "Student (Year 13)",
      location: "North London",
      subject: "A-Level Chemistry & Biology (AQA)",
      outcome: "Predicted B/C → Achieved A*A* (Accepted UCL Medicine)",
      quote: "Organic reaction mechanisms used to confuse me completely. Having the past-paper mark schemes annotated live during every session made the exam expectations crystal clear. Now heading to UCL Medicine!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Medical Admission"
    },
    {
      id: 3,
      name: "Mrs. Charlotte & Oliver Davies",
      role: "Parent & Student (Year 6)",
      location: "Clifton, Bristol",
      subject: "Key Stage 2 (KS2) SATs & Primary Numeracy",
      outcome: "Below Expected Standard → Exceeded Standard (Scaled Score 114)",
      quote: "Oliver had lost all enthusiasm for maths and dreaded tests. The kind, calm 1-to-1 lessons rebuilt his confidence from the ground up. As a working parent, the weekly attendance and progress email updates gave me total peace of mind.",
      image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Primary / KS2 SATs"
    },
    {
      id: 4,
      name: "Devon Reynolds",
      role: "Student (Year 11)",
      location: "Didsbury, Manchester",
      subject: "GCSE Combined Science (Trilogy - Edexcel)",
      outcome: "Grade 5-4 → Grade 8-8",
      quote: "Physics equations and chemistry moles were my biggest struggle. The lessons were engaging, zero-stress, and focused directly on exam practice questions rather than just reading textbooks.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Science Transformation"
    },
    {
      id: 5,
      name: "Dr. Tariq & Zainab Khan",
      role: "Parent & Student (Year 13)",
      location: "Solihull, Birmingham",
      subject: "A-Level Pure Mathematics & Further Maths (OCR)",
      outcome: "Predicted B → Achieved A* (Cambridge Engineering Offer)",
      quote: "The depth of mathematical rigor taught at Beacon Bridge is unmatched. Zainab was able to tackle STEP papers and synoptic differential calculus with complete fluency and secured her Cambridge offer.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Oxbridge Success"
    },
    {
      id: 6,
      name: "Sophie MacLeod",
      role: "Student (Year 10)",
      location: "Edinburgh, Scotland",
      subject: "GCSE English Literature & Language (AQA)",
      outcome: "Grade 5 in Year 9 → Consistent Grade 8 in Year 10 Mocks",
      quote: "I struggled with essay structure and analytical depth on Shakespeare and poetry. My teacher showed me how to embed context and terminology seamlessly without memorising huge blocks of text.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "English Analysis"
    },
    {
      id: 7,
      name: "Kelechi Nnamdi",
      role: "Postgraduate Applicant",
      location: "Headingley, Leeds",
      subject: "IELTS Academic (UKVI University Entry)",
      outcome: "Band 6.0 → Band 8.5 Overall (Writing 8.0, Speaking 8.5)",
      quote: "The writing feedback was meticulous. My instructor dissected my Task 1 charts and Task 2 argument coherence line-by-line. Reached my target score on the first sitting with no resits needed!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "IELTS Band 8.5"
    },
    {
      id: 8,
      name: "Marcus Thornton",
      role: "Student (Year 12)",
      location: "Headington, Oxford",
      subject: "A-Level Physics & Computer Science",
      outcome: "Grade C in initial assessments → Solid Grade A",
      quote: "The virtual classroom whiteboard is fantastic. Drawing circuits, vectors, and state diagrams together in real-time made concepts click way faster than my school lessons.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "STEM Confidence"
    },
    {
      id: 9,
      name: "Mrs. Eleanor Vance",
      role: "Parent (Home Education, Year 8)",
      location: "Sevenoaks, Kent",
      subject: "Key Stage 3 (KS3) Maths & English Bridge",
      outcome: "Structured Syllabus Coverage & Academic Assurance",
      quote: "Educating our daughter at home meant we wanted qualified UK subject specialists who follow the national syllabus. Beacon Bridge has provided that exact structure and high-level teaching.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Home Education"
    },
    {
      id: 10,
      name: "Aiden Powell",
      role: "Student (Professional Track)",
      location: "Pontcanna, Cardiff",
      subject: "Full-Stack Coding (Software Development)",
      outcome: "Built Production Web App → Secured Junior Developer Role",
      quote: "The software engineering curriculum gave me practical coding skills in React, Node.js, and PostgreSQL that were directly applicable in technical interviews. Truly transformative.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      rating: 5,
      tag: "Career Launch"
    }
  ];

  // Auto-advance testimonials carousel every 5 seconds unless hovered
  useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      setTestimonialSlide(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, testimonials.length]);

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

  // 1. Signs Carousel Data with authentic study photography
  const signs = [
    {
      id: 1,
      badge: "Pattern 1",
      title: "Grades drop in one subject while the others stay steady.",
      description: "When a student does well in English and History but suddenly slips in Maths, it is almost never about work ethic. It is usually a foundational concept that was missed months ago and never re-taught.",
      advice: "Target the specific curriculum bottleneck before it cascades into future exam topics.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      badge: "Pattern 2",
      title: "Homework takes much longer than it used to, or ends in tears.",
      description: "Hours spent staring at a workbook is not 'practising hard' — it is a symptom of cognitive overload and anxiety. Homework should reinforce what was understood, not become an evening battle.",
      advice: "A calm 1-to-1 session breaks problems into bite-sized steps so homework becomes manageable again.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      badge: "Pattern 3",
      title: "They say things like 'I'm just bad at maths' or 'I'll never get English'.",
      description: "This is fixed mindset in action. Children internalise difficulty as identity. Once a child believes they lack ability, they stop trying to protect their self-esteem.",
      advice: "We replace 'I cannot do this' with 'I haven't been shown the method that makes sense to me yet'.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      badge: "Pattern 4",
      title: "They avoid a subject, or feel unwell before it.",
      description: "Sunday evening stomach aches and subject avoidance are physical responses to academic stress and the fear of feeling exposed in class.",
      advice: "Learning in a safe, judgment-free virtual room allows students to make mistakes comfortably.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      badge: "Pattern 5",
      title: "They understand things in class but struggle in tests and mocks.",
      description: "This is a classic exam technique disconnect. The student understands the topic, but loses marks to timing, command words, mark-scheme phrasing, or exam pressure.",
      advice: "Direct coaching on past-paper mark schemes bridges the gap between knowledge and exam marks.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
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
      a: "We teach students starting from Key Stage 2 (KS2 / Primary, Year 3–6, ages 7+) through Key Stage 3 (Year 7–9), GCSE (Year 10–11), and A-Level (Year 12–13), as well as Canadian Grade 11–12, US AP, IELTS Academic & UKVI, Coding (Software Development), and Graphics Design. Tell us your child's year group, subjects and exam board when you book your consultation."
    },
    {
      q: "How do I get started?",
      a: "Register as a family, book a consultation with a teacher, and our team will complete your onboarding. It takes a few minutes to begin."
    }
  ];

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://beaconbridgeacademics.co.uk/#organization',
        'name': 'Beacon Bridge Academics',
        'url': 'https://beaconbridgeacademics.co.uk',
        'logo': 'https://beaconbridgeacademics.co.uk/logo.png',
        'email': 'info@beaconbridgeacademics.co.uk',
        'description': 'Premier online tutoring institution for UK GCSE, A-Level and international curricula with live virtual classrooms.',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'London',
          'addressCountry': 'GB'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://beaconbridgeacademics.co.uk/#website',
        'url': 'https://beaconbridgeacademics.co.uk',
        'name': 'Beacon Bridge Academics',
        'publisher': {
          '@id': 'https://beaconbridgeacademics.co.uk/#organization'
        }
      }
    ]
  };

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">
      <SEO 
        title="Online Tutoring UK | GCSE & A-Level Tutors | Beacon Bridge"
        description="Online tutoring for GCSE, A-Level and international curricula. Learn with expert tutors through interactive virtual classrooms at Beacon Bridge Academics."
        canonicalPath="/"
        schemaJson={homeSchema}
      />

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
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Register with Us</span>
                  <ArrowRight className="w-5 h-5 text-[#001f3f]" />
                </Link>

                <Link
                  to="/book-consultation"
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-base border border-white/25 backdrop-blur-md transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-5 h-5 text-[#40ffa7]" />
                  <span>Book a Free Consultation</span>
                </Link>

                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="px-5 py-4 rounded-2xl text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  How It Works &darr;
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
      {/* STATS STRIP — Animated social proof numbers               */}
      {/* ========================================================= */}
      <section ref={statsRef} className="py-14 bg-gradient-to-r from-[#050167] via-[#001f3f] to-[#050167] border-b border-[#40ffa7]/20 relative overflow-hidden">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 39px,#40ffa7 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#40ffa7 40px)'}} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Users, label: 'Students Supported', value: studentsCount, suffix: '+', color: 'text-[#40ffa7]' },
              { icon: GraduationCap, label: 'Specialist Tutors', value: tutorsCount, suffix: '+', color: 'text-sky-300' },
              { icon: Video, label: 'Live Sessions Delivered', value: sessionsCount, suffix: '+', color: 'text-amber-300' },
              { icon: Star, label: 'Family Satisfaction', value: ratingCount, suffix: '/5.0', display: (v) => (v / 10).toFixed(1), color: 'text-rose-300' },
            ].map(({ icon: Icon, label, value, suffix, display, color }) => (
              <div key={label} className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#40ffa7]/20 transition-colors">
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                </div>
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-black ${color} tabular-nums`}>
                  {display ? display(value) : value.toLocaleString()}{suffix}
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-semibold mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
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

            {/* Visual & Contextual 2-Column Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Authentic Student Study Image */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#40ffa7]/40 aspect-4/3 relative group">
                  <img
                    src={signs[signsSlide].image}
                    alt={signs[signsSlide].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#40ffa7] bg-[#050167]/80 px-2.5 py-1 rounded-full self-start mb-2 backdrop-blur-xs border border-[#40ffa7]/30">
                      National Curriculum Diagnostic
                    </span>
                    <h4 className="text-sm font-bold leading-snug line-clamp-2">
                      {signs[signsSlide].title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Right Column: Observed Pattern & Strategic Solution */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Observed Pattern</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#050167] leading-snug">
                  "{signs[signsSlide].title}"
                </h3>
                <p className="text-sm sm:text-base text-[#001f3f]/80 leading-relaxed">
                  {signs[signsSlide].description}
                </p>
                
                {/* How We Help Focus Card */}
                <div className="mt-2 p-5 rounded-2xl bg-gradient-to-r from-[#f0faff] via-white to-[#40ffa7]/15 border-2 border-[#40ffa7]/40 flex items-start gap-3.5 text-sm text-[#001f3f] shadow-md">
                  <div className="p-2.5 rounded-xl bg-[#050167] text-[#40ffa7] shrink-0 mt-0.5 shadow-sm">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#050167] block text-xs uppercase tracking-wider mb-1">
                      How Beacon Bridge Academics Helps:
                    </span>
                    <span className="font-semibold text-slate-800 leading-relaxed text-xs sm:text-sm">
                      {signs[signsSlide].advice}
                    </span>
                  </div>
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
            <div className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#050167] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl z-10">
                Pillar 01
              </div>
              <div>
                {/* Photographic Visual Header */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80"
                    alt="Qualified UK Teacher"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2.5 py-1 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      Degree & QTS Certified
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-xl shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right teacher</h3>
                <p className="text-[#001f3f]/80 text-sm leading-relaxed mb-6">
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
              <div className="mt-6 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
                <span>Syllabus & Mark Scheme Mastery</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#001f3f] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl z-10">
                Pillar 02
              </div>
              <div>
                {/* Photographic Visual Header */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
                    alt="Interactive Virtual Classroom"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2.5 py-1 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      Live WebRTC Interactive Stage
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001f3f] to-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-xl shadow-[#001f3f]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right tools</h3>
                <p className="text-[#001f3f]/80 text-sm leading-relaxed mb-6">
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
              <div className="mt-6 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#001f3f] flex items-center justify-between">
                <span>Synchronized Educational Technology</span>
                <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#f0faff] to-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#050167] text-[#40ffa7] font-bold text-[10px] uppercase tracking-wider rounded-bl-2xl z-10">
                Pillar 03
              </div>
              <div>
                {/* Photographic Visual Header */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                    alt="Parent Progress Visibility"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2.5 py-1 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      Live Family Notification
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-xl shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#050167] mb-3">The right visibility</h3>
                <p className="text-[#001f3f]/80 text-sm leading-relaxed mb-6">
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
              <div className="mt-6 pt-4 border-t border-[#050167]/10 text-xs font-bold text-[#050167] flex items-center justify-between">
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
            <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                {/* Photographic Header */}
                <div className="w-full h-38 rounded-2xl overflow-hidden mb-5 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                    alt="Curriculum & Exam Boards"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2 py-0.5 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      AQA • Edexcel • OCR • WJEC
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-lg shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-2.5">
                  KS2 • KS3 • GCSE • A-Level
                </span>
                <h3 className="text-xl font-bold text-[#050167] mb-2">Curriculum & Exam Boards</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed mb-6">
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
            <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                {/* Photographic Header */}
                <div className="w-full h-38 rounded-2xl overflow-hidden mb-5 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                    alt="Virtual Classroom"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2 py-0.5 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      Interactive Whiteboard & Audio
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#001f3f] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-lg shadow-[#001f3f]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-2.5">
                  4 Steps • 30-Day Plan • Live Room
                </span>
                <h3 className="text-xl font-bold text-[#050167] mb-2">How It Works & Classroom</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed mb-6">
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
            <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none" />
              <div>
                {/* Photographic Header */}
                <div className="w-full h-38 rounded-2xl overflow-hidden mb-5 relative shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                    alt="Teaching Faculty"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-black text-[#40ffa7] bg-[#050167]/90 px-2 py-0.5 rounded-full border border-[#40ffa7]/30 backdrop-blur-xs">
                      Licensed UK Educators
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold mb-4 shadow-lg shadow-[#050167]/20 border border-[#40ffa7]/30 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#050167] bg-[#f0faff] px-2.5 py-1 rounded-md inline-block mb-2.5">
                  Licensed Educators • 100% DBS
                </span>
                <h3 className="text-xl font-bold text-[#050167] mb-2">About Us & Safeguarding</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed mb-6">
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
      {/* SUBJECTS WE TEACH — Visual icon grid                      */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-[#f0faff] to-white border-b border-[#050167]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40ffa7]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>What We Teach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Every Subject Your Child Needs
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Curriculum-aligned specialists for every stage, from KS2 SATs to A-Level and professional tracks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { icon: Calculator, label: 'Mathematics', sub: 'KS2 · KS3 · GCSE · A-Level', color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
              { icon: FlaskConical, label: 'Sciences', sub: 'Biology · Chemistry · Physics', color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { icon: PenLine, label: 'English', sub: 'Language · Literature', color: 'from-rose-500 to-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
              { icon: Code2, label: 'Coding (Software Dev)', sub: '£340/month · £35/hour', color: 'from-sky-500 to-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
              { icon: Globe2, label: 'IELTS / UKVI', sub: 'Academic · £1,000/month', color: 'from-teal-500 to-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
              { icon: Palette, label: 'Graphics Design', sub: '£200/month · £20/hour', color: 'from-fuchsia-500 to-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
              { icon: Compass, label: 'Homeschool', sub: 'Structured · Exam-Board Led', color: 'from-amber-500 to-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
              { icon: Globe, label: 'International', sub: 'UK · US · Canada · Australia', color: 'from-[#050167] to-[#001f3f]', bg: 'bg-[#f0faff]', border: 'border-[#050167]/20' },
            ].map(({ icon: Icon, label, sub, color, bg, border }) => (
              <div key={label} className={`group ${bg} ${border} border rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-[#050167] text-sm sm:text-base leading-tight">{label}</h3>
                <p className="text-xs text-[#001f3f]/60 mt-1 font-medium">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#050167] hover:bg-[#001f3f] text-white font-extrabold text-sm sm:text-base border-2 border-[#40ffa7]/40 shadow-xl shadow-[#050167]/30 transition-all hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
            >
              <span className="text-white group-hover:text-[#40ffa7] font-bold transition-colors">
                View Full Curriculum & Exam Boards
              </span>
              <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION: 10 AUTHENTIC STUDENT & PARENT TESTIMONIALS       */}
      {/* ========================================================= */}
      <section 
        id="testimonials"
        onMouseEnter={() => setIsTestimonialHovered(true)}
        onMouseLeave={() => setIsTestimonialHovered(false)}
        className="py-24 sm:py-32 bg-gradient-to-b from-white via-[#f0faff]/60 to-white border-b border-[#050167]/10 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-[#40ffa7] text-[#40ffa7]" />
              <span>Verified UK Student & Parent Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Real Students. Real Progress. Real Results.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
              From rebuilding foundational confidence to securing Grade 9s, A*s, and Russell Group offers—hear directly from 10 students and parents across the UK.
            </p>
          </div>

          {/* Carousel Viewport with Center Mode & Scale Contrast */}
          <div className="relative w-full overflow-hidden py-4 sm:py-6">
            
            {/* Height Spacer matching active card footprint to guarantee responsive flow height */}
            <div className="invisible pointer-events-none select-none max-w-2xl mx-auto p-5 sm:p-8 md:p-10 border-2 opacity-0">
              <div className="h-6 mb-4" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full mx-auto my-3" />
              <div className="h-6 w-48 mx-auto my-2" />
              <div className="h-4 w-36 mx-auto my-1" />
              <div className="my-5 max-w-xl mx-auto">
                <p className="text-base sm:text-lg leading-relaxed italic">
                  "Oliver had lost all enthusiasm for maths and dreaded tests. The kind, calm 1-to-1 lessons rebuilt his confidence from the ground up. As a working parent, the weekly attendance and progress email updates gave me total peace of mind."
                </p>
              </div>
              <div className="h-14 max-w-lg mx-auto mb-3" />
              <div className="h-8 pt-2" />
            </div>

            {/* Floating Navigation Controls (Left & Right) */}
            <button
              type="button"
              onClick={() => setTestimonialSlide(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 hover:bg-[#050167] text-[#050167] hover:text-[#40ffa7] border border-[#050167]/15 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setTestimonialSlide(prev => (prev + 1) % testimonials.length)}
              className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 hover:bg-[#050167] text-[#050167] hover:text-[#40ffa7] border border-[#050167]/15 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Render Center-Mode Scaled Cards (Active 100% scale/opacity; Prev & Next 75% scale/50% opacity slightly blurred) */}
            {testimonials.map((item, index) => {
              const total = testimonials.length;
              let offset = index - testimonialSlide;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;

              // Distinct Dynamic Visual Styles per Category
              const isOxbridgeOrMedical = item.tag.includes('Oxbridge') || item.tag.includes('Medical');
              const isPrimaryOrHome = item.tag.includes('Primary') || item.tag.includes('Home');
              const isIELTSOrTech = item.tag.includes('IELTS') || item.tag.includes('Professional');

              const cardTheme = isOxbridgeOrMedical
                ? 'border-indigo-400/60 bg-gradient-to-b from-indigo-50/90 via-white to-white shadow-indigo-900/10'
                : isPrimaryOrHome
                  ? 'border-amber-400/60 bg-gradient-to-b from-amber-50/80 via-white to-white shadow-amber-900/10'
                  : isIELTSOrTech
                    ? 'border-cyan-400/60 bg-gradient-to-b from-cyan-50/80 via-white to-white shadow-cyan-900/10'
                    : 'border-[#40ffa7]/60 bg-gradient-to-b from-emerald-50/80 via-white to-white shadow-emerald-900/10';

              const photoRing = isOxbridgeOrMedical
                ? 'ring-indigo-400 border-indigo-600'
                : isPrimaryOrHome
                  ? 'ring-amber-400 border-amber-600'
                  : isIELTSOrTech
                    ? 'ring-cyan-400 border-cyan-600'
                    : 'ring-[#40ffa7] border-[#050167]';

              const badgeBg = isOxbridgeOrMedical
                ? 'bg-indigo-950 text-indigo-200 border-indigo-400/40'
                : isPrimaryOrHome
                  ? 'bg-amber-950 text-amber-200 border-amber-400/40'
                  : isIELTSOrTech
                    ? 'bg-slate-900 text-cyan-300 border-cyan-400/40'
                    : 'bg-[#050167] text-[#40ffa7] border-[#40ffa7]/40';

              // Positioning and Scale calculation
              let transformStyle = '';
              let opacityStyle = 0;
              let filterStyle = 'blur(4px)';
              let zIndex = 0;
              let pointerEvents = 'none';

              if (isActive) {
                transformStyle = 'translateX(-50%) translateY(-50%) scale(1)';
                opacityStyle = 1;
                filterStyle = 'blur(0px)';
                zIndex = 20;
                pointerEvents = 'auto';
              } else if (isPrev) {
                transformStyle = 'translateX(calc(-50% - 66%)) translateY(-50%) scale(0.75)';
                opacityStyle = 0.5;
                filterStyle = 'blur(1.5px)';
                zIndex = 10;
                pointerEvents = 'auto';
              } else if (isNext) {
                transformStyle = 'translateX(calc(-50% + 66%)) translateY(-50%) scale(0.75)';
                opacityStyle = 0.5;
                filterStyle = 'blur(1.5px)';
                zIndex = 10;
                pointerEvents = 'auto';
              } else {
                transformStyle = `translateX(${offset > 0 ? 'calc(-50% + 140%)' : 'calc(-50% - 140%)'}) translateY(-50%) scale(0.6)`;
                opacityStyle = 0;
                filterStyle = 'blur(4px)';
                zIndex = 0;
                pointerEvents = 'none';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isPrev) setTestimonialSlide(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
                    if (isNext) setTestimonialSlide(prev => (prev + 1) % testimonials.length);
                  }}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    filter: filterStyle,
                    zIndex,
                    pointerEvents,
                    transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), filter 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className={`absolute top-1/2 left-1/2 w-[88%] sm:w-[78%] md:w-[68%] lg:w-[62%] max-w-2xl rounded-3xl border-2 p-5 sm:p-8 md:p-10 shadow-2xl text-center origin-center select-none ${
                    isPrev || isNext ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''
                  } ${cardTheme}`}
                >
                  {/* Top Tag & Rating Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/60">
                    <div className="flex items-center gap-2 mx-auto sm:mx-0">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xs ${badgeBg}`}>
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                        Verified Milestone
                      </span>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center space-x-1 text-amber-400 mx-auto sm:mx-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-black text-slate-700 ml-1.5">5.0 / 5.0</span>
                    </div>
                  </div>

                  {/* Centered Large Student Photo */}
                  <div className="mt-6 mb-4 flex flex-col items-center">
                    <div className="relative inline-block">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover shadow-xl ring-4 ring-offset-4 ring-offset-white border-4 mx-auto transition-transform ${photoRing}`}
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-3" />
                      </div>
                    </div>

                    {/* Student Name & Meta */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#001f3f] mt-3 tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                      {item.role} &bull; <span className="text-[#050167] font-bold">{item.location}</span>
                    </p>
                    <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-white text-[#050167] text-[11px] font-extrabold border border-[#050167]/15 shadow-xs">
                      {item.subject}
                    </span>
                  </div>

                  {/* Main Quote with 300ms Delay Fade-in & 8px Upward Translate */}
                  <div
                    className="my-4 sm:my-5 relative max-w-xl mx-auto px-4"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                      transition: isActive
                        ? 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 300ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1) 300ms'
                        : 'opacity 200ms ease-out, transform 200ms ease-out'
                    }}
                  >
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#40ffa7]/40 absolute -top-3 left-0 -z-0 opacity-40" />
                    <p className="text-sm sm:text-base md:text-lg text-[#001f3f] font-semibold leading-relaxed relative z-10 italic">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Outcome Achievement Banner */}
                  <div className="max-w-lg mx-auto p-3 sm:p-4 rounded-2xl bg-white/95 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center shrink-0 shadow-sm">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                          Verified Grade & Goal Transformation
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-[#050167]">
                          {item.outcome}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      Official Milestone
                    </span>
                  </div>

                  {/* Card Micro Navigation Counter */}
                  <div className="flex items-center justify-center space-x-2 pt-2 border-t border-slate-200/50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTestimonialSlide(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
                      }}
                      className="p-1.5 rounded-lg bg-[#f0faff] hover:bg-[#050167] text-[#001f3f] hover:text-[#40ffa7] border border-[#050167]/15 transition-all cursor-pointer active:scale-95"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-extrabold text-slate-500 px-2 font-mono">
                      {index + 1} / {testimonials.length}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTestimonialSlide(prev => (prev + 1) % testimonials.length);
                      }}
                      className="p-1.5 rounded-lg bg-[#f0faff] hover:bg-[#050167] text-[#001f3f] hover:text-[#40ffa7] border border-[#050167]/15 transition-all cursor-pointer active:scale-95"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* 10 Dots Indicator & Quick Switcher */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTestimonialSlide(i)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    testimonialSlide === i ? 'w-8 bg-[#050167]' : 'w-2.5 bg-[#050167]/20 hover:bg-[#050167]/40'
                  }`}
                  aria-label={`Go to student testimonial ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing student {testimonialSlide + 1} of {testimonials.length} &bull; Click dots or arrows to browse
            </span>
          </div>

          {/* Bottom Consultation CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/book-consultation"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#050167] hover:bg-[#001f3f] text-white font-extrabold text-sm sm:text-base border-2 border-[#40ffa7]/40 shadow-xl shadow-[#050167]/30 hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 text-[#40ffa7]" />
              <span className="text-white group-hover:text-[#40ffa7] font-bold transition-colors">
                Book Your Child's Free 20-Min Consultation
              </span>
              <ArrowRight className="w-4 h-4 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
            </Link>
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
                Zero Commute Time
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                Familiar Home Comfort
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                Postcode Freedom
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs">
                Rewatchable Recordings
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
        
        {/* Decorative floating shapes */}
        <div className="absolute top-8 left-8 w-24 h-24 rounded-full border-2 border-[#40ffa7]/20 animate-pulse pointer-events-none" />
        <div className="absolute top-16 left-20 w-12 h-12 rounded-full border border-[#40ffa7]/15 animate-pulse pointer-events-none" style={{animationDelay:'0.5s'}} />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-[#40ffa7]/15 animate-pulse pointer-events-none" style={{animationDelay:'1s'}} />
        <div className="absolute bottom-20 right-24 w-16 h-16 rounded-full border border-[#40ffa7]/20 pointer-events-none" />
        {/* Graduation cap SVG decoration */}
        <svg className="absolute top-6 right-1/4 opacity-10 pointer-events-none" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#40ffa7" strokeWidth="1.5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
        <svg className="absolute bottom-8 left-1/4 opacity-10 pointer-events-none" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#40ffa7" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        
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
              className="w-full sm:w-auto px-9 py-5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-base shadow-2xl shadow-[#40ffa7]/40 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Register with Us</span>
              <ArrowRight className="w-5 h-5 text-[#001f3f]" />
            </Link>
            <Link
              to="/book-consultation"
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-base border border-white/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5 text-[#40ffa7]" />
              <span>Book a 1-on-1 Consultation</span>
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
