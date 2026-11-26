import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import {
  GraduationCap,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
  Award,
  Check,
  Building2,
  Star,
  Users,
  Compass,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Clock
} from 'lucide-react';

export const AboutPage = () => {
  const [classroomSlide, setClassroomSlide] = useState(0);
  const [classroomPaused, setClassroomPaused] = useState(false);

  const animatedClassrooms = [
    {
      src: '/classrooms/class-1.jpg',
      alt: 'UK KS3 children smiling and learning geometry with a teacher in a sunlit classroom',
      badge: 'KS3 Maths Classroom',
      title: 'Dedicated Academic Lead Assigned',
      caption: 'Guiding Year 7–9 pupils step-by-step through UK National Curriculum mathematics.',
      tag: 'Year 7–9'
    },
    {
      src: '/classrooms/class-2.jpg',
      alt: 'Primary KS2 school children raising hands enthusiastically in an interactive classroom',
      badge: 'KS2 Primary Classroom',
      title: 'Confidence-Building Primary Lessons',
      caption: 'Warm, engaging KS2 classrooms where younger learners feel excited to participate.',
      tag: 'Year 3–6'
    },
    {
      src: '/classrooms/class-3.jpg',
      alt: 'Young children collaborating on creative projects and reading sheets at a classroom table',
      badge: 'Hands-On Literacy & Art Room',
      title: 'Structured Foundations & Phonics',
      caption: 'Small-group and 1-to-1 primary support tailored to every child’s pace.',
      tag: 'KS2 · SATs'
    },
    {
      src: '/classrooms/class-4.jpg',
      alt: 'Secondary students seated in a classroom watching a teacher lead an interactive whiteboard lesson',
      badge: 'Interactive Whiteboard Room',
      title: 'Exam-Board Aligned Instruction',
      caption: 'Visual whiteboard teaching matched directly to AQA, Edexcel, OCR & WJEC rubrics.',
      tag: 'GCSE · KS3'
    },
    {
      src: '/classrooms/class-5.jpg',
      alt: 'GCSE students writing notes and collaborating in a bright secondary school classroom',
      badge: 'GCSE Exam Prep Classroom',
      title: 'Past-Paper & Grade 7–9 Mastery',
      caption: 'Focused Year 10–11 revision rooms turning exam anxiety into measurable marks.',
      tag: 'Year 10–11'
    },
    {
      src: '/classrooms/class-6.jpg',
      alt: 'British secondary students studying sciences with molecular models, maths notebooks and laptops',
      badge: 'STEM & A-Level Study Studio',
      title: 'Science, Maths & Digital Fluency',
      caption: 'Deep analytical training for GCSE Triple Science, A-Level & international tracks.',
      tag: 'Year 12–13'
    }
  ];

  useEffect(() => {
    if (classroomPaused) return;
    const timer = setInterval(() => {
      setClassroomSlide((prev) => (prev + 1) % animatedClassrooms.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [classroomPaused, animatedClassrooms.length]);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://beaconbridgeacademics.co.uk/about#aboutpage',
    'url': 'https://beaconbridgeacademics.co.uk/about',
    'name': 'About Beacon Bridge Academics',
    'description': 'Online academic support company for students in the UK, US, Canada, and Australia, delivered by curriculum-trained educators.',
    'mainEntity': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics',
      'url': 'https://beaconbridgeacademics.co.uk'
    }
  };

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">
      <SEO 
        title="About Us | Curriculum Specialists & Mission | Beacon Bridge Academics"
        description="Learn about Beacon Bridge Academics: our UK curriculum specialists, DBS-checked faculty, transparent parent oversight, and mission to help children thrive."
        canonicalPath="/about"
        schemaJson={aboutSchema}
      />
      
      {/* ========================================================= */}
      {/* HERO BANNER: HERITAGE & MISSION                           */}
      {/* ========================================================= */}
      <style>{`
        @keyframes aboutHeroZoom {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.09); }
          100% { transform: scale(1.02); }
        }
        @keyframes classroomCardZoom {
          from { transform: scale(1.0); }
          to { transform: scale(1.1); }
        }
      `}</style>
      <section className="relative py-20 sm:py-28 bg-[#001f3f] text-white overflow-hidden">
        <img
          src="/pages/about-hero.jpg"
          alt="Beacon Bridge Academics UK educators collaborating with teenage students in a bright classroom"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ animation: 'aboutHeroZoom 18s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/80 via-[#050167]/62 to-[#001f3f]/75 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/75 via-transparent to-[#001f3f]/35 z-0" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Our Heritage & Mission</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            About{' '}
            <span className="bg-gradient-to-r from-white via-[#f0faff] to-[#40ffa7] bg-clip-text text-transparent">
              Beacon Bridge Academics
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#f0faff]/85 max-w-3xl mx-auto leading-relaxed font-normal">
            Online academic support company for students in the UK, the US, Canada, and Australia. 
            Built around one simple belief: helping children feel capable again.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CORE PHILOSOPHY & LEADERSHIP                              */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Narrative & Values */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 text-[#050167] text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-[#050167]" />
                <span>Educational Leadership</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#050167] tracking-tight leading-tight">
                Built Around One Simple Belief:{' '}
                <span className="bg-gradient-to-r from-[#050167] via-[#001f3f] to-[#2563eb] bg-clip-text text-transparent">
                  Helping Children Feel Capable Again
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#001f3f]/85 leading-relaxed">
                Beacon Bridge Academics is led by experienced educators with classroom experience, international teaching licences, and a background in educational leadership. 
                We built Beacon around one simple truth: a struggling student does best with a teacher who knows their syllabus, modern tools that make lessons clear, and parents who can see what is happening.
              </p>

              <p className="text-base sm:text-lg text-[#001f3f]/85 leading-relaxed">
                Our teachers are trained across the UK, US, Canadian and Australian curricula before they meet a student. When a child learns in a safe, judgment-free environment with clear exam board guidance, anxiety fades and genuine mastery begins.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#f0faff] border border-[#050167]/10 hover:border-[#40ffa7] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center mb-2 font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#050167] uppercase tracking-wider block">Faculty</span>
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">Licensed UK Teachers</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f0faff] border border-[#050167]/10 hover:border-[#40ffa7] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center mb-2 font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#050167] uppercase tracking-wider block">Syllabus Match</span>
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">AQA • Edexcel • OCR</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f0faff] border border-[#050167]/10 hover:border-[#40ffa7] transition-all">
                  <div className="w-8 h-8 rounded-xl bg-[#050167] text-[#40ffa7] flex items-center justify-center mb-2 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#050167] uppercase tracking-wider block">Safety First</span>
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">100% DBS Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Large Animated 6-Classroom Showcase Card */}
            <div className="lg:col-span-6 relative">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#40ffa7]/30 bg-gradient-to-br from-[#050167] to-[#001f3f] p-3.5"
                onMouseEnter={() => setClassroomPaused(true)}
                onMouseLeave={() => setClassroomPaused(false)}
              >
                <div className="relative w-full h-[22rem] sm:h-[26rem] lg:h-[28rem] rounded-2xl overflow-hidden bg-[#001f3f]">
                  {animatedClassrooms.map((cls, idx) => (
                    <div
                      key={cls.src}
                      aria-hidden={classroomSlide !== idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        classroomSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={cls.src}
                        alt={cls.alt}
                        className="w-full h-full object-cover"
                        style={classroomSlide === idx ? { animation: 'classroomCardZoom 4.2s ease-out forwards' } : undefined}
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/20 to-transparent z-20 pointer-events-none" />
                  
                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2">
                    <div className="bg-[#050167]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#40ffa7]/40 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#40ffa7] animate-pulse" />
                      <span className="text-xs font-bold text-white">{animatedClassrooms[classroomSlide].badge}</span>
                    </div>
                    <span className="bg-[#001f3f]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-black text-[#40ffa7]">
                      {classroomSlide + 1} / {animatedClassrooms.length}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-30 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg text-xs">
                    <div className="flex items-center justify-between font-bold text-[#050167]">
                      <span className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {animatedClassrooms[classroomSlide].title}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full shrink-0 font-bold">Active</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {animatedClassrooms[classroomSlide].caption}
                    </p>
                  </div>
                </div>

                {/* 6 Interactive Classroom Thumbnails */}
                <div className="grid grid-cols-6 gap-2 px-1 pt-3">
                  {animatedClassrooms.map((cls, idx) => (
                    <button
                      key={cls.src}
                      type="button"
                      onClick={() => setClassroomSlide(idx)}
                      aria-label={`View classroom ${idx + 1}: ${cls.badge}`}
                      className={`relative rounded-lg overflow-hidden h-12 sm:h-14 w-full transition-all cursor-pointer border-2 ${
                        classroomSlide === idx
                          ? 'border-[#40ffa7] scale-105 shadow-md shadow-[#40ffa7]/30'
                          : 'border-white/15 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img src={cls.src} alt={cls.badge} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>

                {/* Bottom Trust Stat Bar */}
                <div className="grid grid-cols-3 gap-2 text-center p-3.5 text-white text-xs">
                  <div>
                    <div className="font-black text-[#40ffa7] text-lg">4.9/5.0</div>
                    <div className="text-[11px] text-white/75">Parent Rating</div>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="font-black text-sky-300 text-lg">100%</div>
                    <div className="text-[11px] text-white/75">DBS Checked</div>
                  </div>
                  <div>
                    <div className="font-black text-amber-300 text-lg">1-on-1</div>
                    <div className="text-[11px] text-white/75">Tailored Lessons</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CLASSROOM GALLERY — 6 IMAGES                              */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Inside Our Classrooms</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#001f3f] tracking-tight">
              Real Sessions. Real Students. Real Results.
            </h2>
            <p className="mt-3 text-[#001f3f]/75 text-sm sm:text-base">
              A glimpse into the interactive, structured learning environments we build for every student.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {animatedClassrooms.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-[#050167]/10 aspect-video"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/85 via-[#001f3f]/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#40ffa7]/90 text-[#001f3f] text-[10px] font-black uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-white font-extrabold text-sm block">{item.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHAT MAKES BEACON BRIDGE ACADEMICS DIFFERENT              */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>The Beacon Bridge Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              What Makes Beacon Bridge Academics Different
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              Designed from the ground up to solve the real obstacles students and parents face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                step: '01',
                title: "We teach to your child's curriculum.",
                desc: "Not just the subject in general, but the exact exam board (AQA, Edexcel, OCR) and how it is assessed.",
                highlight: "Targeted Spec Revision",
                color: "from-blue-600 to-indigo-700"
              },
              {
                icon: Users,
                step: '02',
                title: "We keep parents informed.",
                desc: "A dedicated parent account, attendance logs, and instant homework emails mean you are never left guessing.",
                highlight: "Full Parent Transparency",
                color: "from-emerald-600 to-teal-700"
              },
              {
                icon: Heart,
                step: '03',
                title: "We were built for struggling students.",
                desc: "Our primary aim is rebuilding foundational confidence, identifying missed concepts, and making learning enjoyable.",
                highlight: "Confidence First",
                color: "from-rose-600 to-pink-700"
              },
              {
                icon: ShieldCheck,
                step: '04',
                title: "We put safeguarding first.",
                desc: "Joint parent-student registration, enhanced DBS checks, and an introductory consultation before lessons begin.",
                highlight: "Safeguarding Tier 1",
                color: "from-amber-600 to-orange-700"
              },
              {
                icon: Sparkles,
                step: '05',
                title: "We use modern tools properly.",
                desc: "A purpose-built virtual classroom with real-time synchronized whiteboard, past-paper annotation, and recordings.",
                highlight: "Engineered for Learning",
                color: "from-purple-600 to-indigo-800"
              },
              {
                icon: Globe,
                step: '06',
                title: "Cross-System Curriculum Mapping.",
                desc: "Specialist bridge tutoring for families relocating between the UK, US, Canada, and Australia.",
                highlight: "Global Curriculum Support",
                color: "from-cyan-600 to-blue-800"
              }
            ].map((diff, idx) => {
              const Icon = diff.icon;
              return (
                <div 
                  key={idx} 
                  className="group p-7 rounded-3xl bg-white border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${diff.color} text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                        {diff.step}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#050167] transition-colors mb-2">
                      {diff.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs font-bold text-[#050167]">
                    <span>{diff.highlight}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#40ffa7] fill-[#050167]" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SAFEGUARDING COMES FIRST                                  */}
      {/* ========================================================= */}
      <section id="safeguarding" className="scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-md shadow-[#050167]/20">
              <ShieldCheck className="w-4 h-4 text-[#40ffa7]" />
              <span>Rigorous Child Safety</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Safeguarding Comes First
            </h2>
            <p className="mt-3 text-[#001f3f]/80 text-sm sm:text-base">
              We take the safety of children seriously, and we have built rigorous checks into every layer of our platform.
            </p>
          </div>

          {/* Visual 4-Stage Safeguarding Pipeline */}
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#050167]">
                Our Multi-Tier Safeguarding Verification Pipeline
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "1", title: "Identity & Degree Check", desc: "Government photo ID and university degree certification verification." },
                { step: "2", title: "Enhanced DBS Clearance", desc: "Clean background and criminal-record checks via the UK Disclosure & Barring Service." },
                { step: "3", title: "Syllabus Competency", desc: "Assessment on AQA, Edexcel, and OCR marking criteria and pedagogical methods." },
                { step: "4", title: "Continuous Auditing", desc: "Session logs, attendance audits, and parental progress oversight on every lesson." },
              ].map((pipe) => (
                <div key={pipe.step} className="bg-white p-5 rounded-2xl border border-slate-200 text-center relative shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#050167] text-[#40ffa7] font-black text-xs flex items-center justify-center mx-auto mb-2">
                    {pipe.step}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">{pipe.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">{pipe.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            
            <div className="group p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-5 relative overflow-hidden">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#050167] mb-1.5 group-hover:text-[#001f3f] transition-colors">Joint Family Registration</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Parents and children register together, so accounts are accurate and properly linked from day one.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-5 relative overflow-hidden">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#050167] mb-1.5 group-hover:text-[#001f3f] transition-colors">Consultation Before Lessons</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Every family has a consultation first, so no child begins lessons with a teacher you have not spoken to.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-5 relative overflow-hidden">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#050167] mb-1.5 group-hover:text-[#001f3f] transition-colors">Comprehensive Teacher Checks</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Every teacher goes through document verification, reference checks and criminal-record (DBS) checks before working with children.
                </p>
              </div>
            </div>

            <div className="group p-8 rounded-3xl bg-[#f0faff] border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-5 relative overflow-hidden">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#050167] to-[#001f3f] text-[#40ffa7] flex items-center justify-center shrink-0 font-bold text-lg shadow-md shadow-[#050167]/20 ring-4 ring-[#40ffa7]/20 group-hover:scale-105 transition-transform">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-[#050167] mb-1.5 group-hover:text-[#001f3f] transition-colors">Curriculum Training Standards</h3>
                <p className="text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed">
                  Teachers are trained across international curricula before they meet a student.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-10 text-center text-xs text-[#001f3f]/70 bg-[#f0faff] p-4 rounded-2xl border border-[#050167]/10 max-w-xl mx-auto">
            Read our <a href="#safeguarding" className="font-bold text-[#050167] hover:underline">Safeguarding Policy</a> and <a href="#cancellation" className="font-bold text-[#050167] hover:underline">Lesson Cancellation Policy</a> for full details.
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* TUTORIAL & LESSON CANCELLATION POLICY                     */}
      {/* ========================================================= */}
      <section id="cancellation" className="scroll-mt-24 sm:scroll-mt-28 py-16 sm:py-24 bg-slate-50 border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
              <span>Fair & Transparent Academic Policies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#001f3f] tracking-tight">
              Tutorial & Lesson Cancellation Policy
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clear, parent-first terms designed to protect student learning momentum while respecting tutor scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">⏳</span>
              <h3 className="font-bold text-slate-900 text-base">24-Hour Free Rescheduling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parents or students may reschedule any 1-on-1 tutorial or consultation free of charge by notifying the platform at least 24 hours in advance via the portal, email, or WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">🩺</span>
              <h3 className="font-bold text-slate-900 text-base">Emergency & Illness Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We understand children fall ill unexpectedly. In cases of certified medical illness or family emergencies within 24 hours, sessions are credited and rescheduled without penalty.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl">🛡️</span>
              <h3 className="font-bold text-slate-900 text-base">Tutor Absence Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a tutor ever needs to reschedule due to unforeseen circumstances, families receive prompt advance notification, a complimentary makeup session, and full lesson continuity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR PROMISE TO PARENTS & AUTHENTIC REVIEWS                */}
      {/* ========================================================= */}
      <section id="promise" className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#050167]/15 shadow-xl shadow-[#050167]/5 space-y-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#40ffa7]" />
                <span>Authentic Educational Integrity</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#001f3f] mb-4">
                Our Promise to Parents
              </h3>
              <p className="text-base sm:text-lg text-[#001f3f]/80 leading-relaxed">
                We are a new company, and we would rather earn your trust than ask for it. 
                That is why we promise to be honest about your child's progress, to explain things in plain English, and to tell you early if something is not working. 
                We will never pressure you into a plan, and we will never promise a grade we cannot control. 
                We will always be clear about what lessons cost, what your child is working on, and what we think should happen next.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#f0faff] via-white to-[#40ffa7]/10 border-2 border-[#40ffa7]/30 text-xs sm:text-sm text-[#001f3f]/80 leading-relaxed shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <strong className="text-[#050167] font-bold text-sm">Authentic Reviews Policy:</strong>
              </div>
              We reserve this section exclusively for real parent and student reviews following completed lesson series. 
              In keeping with our promise of transparency and integrity, we do not publish invented testimonials.
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
              to="/how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#f0faff] font-bold text-sm border border-white/25 transition-all active:scale-95"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
