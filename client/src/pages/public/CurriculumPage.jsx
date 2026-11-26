import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  CheckCheck,
  Check,
  Sparkles,
  ArrowRight,
  Award,
  Globe,
  Compass,
  Building2,
  Layers,
  Calculator,
  FlaskConical,
  PenLine,
  Code2,
  Globe2,
  Palette,
  FileText,
  Zap,
  Star
} from 'lucide-react';

export const CurriculumPage = () => {
  const [stagesSlide, setStagesSlide] = useState(0);

  // 1. Stages Data
  const stages = [
    {
      id: 'ks2',
      badge: 'Year 3 to 6',
      title: 'KS2 Primary Tutoring Online',
      subtitle: '£149/month • Foundational numeracy, reading comprehension & SATs readiness',
      monthlyPrice: '£149/month',
      discountFrom: '£199/month',
      savingsTag: 'Save £50/mo',
      hourlyNote: null,
      description: 'Warm, structured primary learning for Year 3 to Year 6 pupils. We rebuild core arithmetic confidence, reading fluency, spelling, punctuation & grammar (SPaG), and Year 6 SATs / 11+ exam readiness.',
      features: ['KS2 Mathematics & core times tables mastery', 'Reading comprehension, SPaG & structured writing', 'Year 6 SATs & 11+ grammar entrance preparation']
    },
    {
      id: 'gcse',
      badge: 'Year 10 & 11',
      title: 'GCSE Tutoring Online',
      subtitle: '£299/month (5-Subject Bundle) | £40/hour per subject (Year 7–11)',
      monthlyPrice: '£299/month',
      discountFrom: '£380/month',
      savingsTag: 'Save £81/mo',
      hourlyNote: '£40/hour per subject (Year 7–11)',
      description: 'Whether your child is aiming to secure a grade 4, push for a 7–9, or retake an exam, our teachers work through the specification with them, topic by topic, using past-paper practice and clear feedback.',
      features: ['AQA, Edexcel, OCR, and WJEC focus', 'Command-word dissection & timing strategies', 'Flexible 5-subject bundle (£299/month) or £40/hour per subject']
    },
    {
      id: 'alevel',
      badge: 'Year 12 & 13',
      title: 'A-Level Tutoring Online',
      subtitle: '£320/month (Same as Canada Grade 11–12) | £45/hour per A-Level subject',
      monthlyPrice: '£320/month',
      discountFrom: '£399/month',
      savingsTag: 'Save £79/mo',
      hourlyNote: '£45/hour per A-Level subject',
      description: 'A-Level means deeper content, longer papers and far more independent study. We help students build the habits and the understanding to cope with the step up at £320/month or £45/hour.',
      features: ['Advanced essay structuring & analytical frameworks', 'Complex synoptic paper navigation', 'University & UCAS grade requirement prep']
    },
    {
      id: 'ks3',
      badge: 'Year 7 to 9',
      title: 'KS3 Academic Support',
      subtitle: '£249/month | £40/hour per subject (Year 7–11)',
      monthlyPrice: '£249/month',
      discountFrom: '£299/month',
      savingsTag: 'Save £50/mo',
      hourlyNote: '£40/hour per subject (Year 7–11)',
      description: 'Strong foundations in Year 7 to 9 make GCSEs far easier. We help children close gaps early, before they grow into serious secondary school roadblocks.',
      features: ['Core numeracy & algebraic fluency', 'Reading comprehension & structured writing', 'Rebuilding confidence before GCSE & mock exams']
    },
    {
      id: 'canada',
      badge: 'Canada Grade 11–12',
      title: 'Canada Grade 11–12 & US AP Mastery',
      subtitle: '£320/month (Same rate as UK A-Level) | £45/hour per subject',
      monthlyPrice: '£320/month',
      discountFrom: '£399/month',
      savingsTag: 'Save £79/mo',
      hourlyNote: '£45/hour per subject',
      description: 'Moving across school systems or preparing for Ontario (OSSD Grade 11–12) and US AP university admissions? Our specialist educators align pacing to your exact syllabus and calendar.',
      features: ['Ontario (MHF4U, MCV4U, SCH4U, ENG4U) & US AP', 'Cross-curriculum alignment & exam format coaching', 'Full weekly progress logs for international families']
    },
    {
      id: 'software',
      badge: 'Coding Track',
      title: 'Coding (Software Development)',
      subtitle: '£340/month | £35/hour — Frontend & Backend Web Engineering',
      monthlyPrice: '£340/month',
      discountFrom: '£420/month',
      savingsTag: 'Save £80/mo',
      hourlyNote: '£35/hour coding coaching',
      description: 'Industry-standard Coding (Software Development) tracks at £340/month (£35/hour). Students build real-world responsive web applications, relational databases, REST APIs, and full-stack software architecture.',
      features: ['Frontend Coding (£340/month · £35/hr): HTML5, CSS3, Modern JavaScript, React.js & Tailwind CSS', 'Backend Coding (£340/month · £35/hr): Node.js, Express, PostgreSQL, REST APIs & Cloud DevOps', 'Direct portfolio building & live hands-on coding']
    },
    {
      id: 'graphics',
      badge: 'Digital Arts',
      title: 'Graphics Design & UI/UX Studio',
      subtitle: '£200/month | £20/hour — Visual identity, UI/UX prototyping & portfolio',
      monthlyPrice: '£200/month',
      discountFrom: '£260/month',
      savingsTag: 'Save £60/mo',
      hourlyNote: '£20/hour studio coaching',
      description: 'Master industry-standard visual design workflows at £200/month (£20/hour). Students learn brand identity, typography, Figma UI/UX prototyping, vector illustration in Illustrator, and Photoshop digital artistry.',
      features: ['Figma interactive UI/UX prototyping & wireframing', 'Brand identity, typography, color theory & design systems', 'Adobe Illustrator & Photoshop production workflows']
    },
    {
      id: 'ielts',
      badge: 'Language Proficiency',
      title: 'IELTS Academic & UKVI Exam Preparation',
      subtitle: '£1,000/month • Target Band 7.5+ for UK University & Visa (UKVI) Entry',
      monthlyPrice: '£1,000/month',
      discountFrom: '£1,250/month',
      savingsTag: 'Save £250/mo',
      hourlyNote: 'Dedicated Candidate Portal & Classroom',
      ctaPath: '/ielts-registration',
      description: 'Comprehensive £1,000/month intensive preparation for the International English Language Testing System, with a dedicated IELTS registration portal and Student Virtual Classroom Dashboard where tutors conduct live sessions.',
      features: [
        'Academic Writing Task 1 (graphs/processes) & Task 2 essays graded against official rubrics',
        '1-on-1 Speaking mock interviews with live pronunciation & lexical resource coaching',
        'Speed-reading techniques and listening distractor elimination under exam timing'
      ]
    }
  ];

  // Program Pricing Directory for Curriculum Cards
  const programPricingCards = [
    {
      title: 'Key Stage 2 (KS2)',
      level: 'Primary · Year 3–6',
      discountFrom: '£199/month',
      savings: 'Save £50',
      price: '£149',
      hourly: 'Full Primary Package',
      to: '/register'
    },
    {
      title: 'Key Stage 3 (KS3)',
      level: 'Secondary · Year 7–9',
      discountFrom: '£299/month',
      savings: 'Save £50',
      price: '£249',
      hourly: '£40/hour per subject (Year 7–11)',
      to: '/register'
    },
    {
      title: 'GCSE 5-Subject Core',
      level: 'GCSE · Year 10–11',
      discountFrom: '£380/month',
      savings: 'Save £81',
      price: '£299',
      hourly: '£40/hour per subject (Year 7–11)',
      to: '/register'
    },
    {
      title: 'UK A-Level 3-Subject',
      level: 'Sixth Form · Year 12–13',
      discountFrom: '£399/month',
      savings: 'Save £79',
      price: '£320',
      hourly: '£45/hour per A-Level subject',
      to: '/register'
    },
    {
      title: 'Canada Grade 11–12 & US AP',
      level: 'International · Grade 11–12',
      discountFrom: '£399/month',
      savings: 'Save £79',
      price: '£320',
      hourly: '£45/hour per subject',
      to: '/register'
    },
    {
      title: 'Coding (Software Development)',
      level: 'Frontend & Backend Tracks',
      discountFrom: '£420/month',
      savings: 'Save £80',
      price: '£340',
      hourly: '£35/hour coaching',
      to: '/register'
    },
    {
      title: 'Graphics Design',
      level: 'Figma · Illustrator · Photoshop',
      discountFrom: '£260/month',
      savings: 'Save £60',
      price: '£200',
      hourly: '£20/hour studio coaching',
      to: '/register'
    },
    {
      title: 'IELTS Academic & UKVI',
      level: 'Dedicated Candidate Dashboard',
      discountFrom: '£1,250/month',
      savings: 'Save £250',
      price: '£1,000',
      hourly: '1-on-1 Exam Preparation',
      to: '/ielts-registration',
      isIelts: true
    }
  ];

  // 2. Exam Boards Data
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

  // 3. Subjects Directory Data with rich visuals & icons
  const subjects = [
    {
      title: "GCSE Mathematics",
      category: "Core STEM",
      desc: "Foundation & Higher tiers for AQA, Edexcel, and OCR with live algebra & geometry walkthroughs.",
      icon: Calculator,
      color: "from-blue-600 to-indigo-700",
      boards: "AQA · Edexcel · OCR",
      tag: "Grade 4-9 Focus"
    },
    {
      title: "GCSE English Language & Lit",
      category: "Literacy & Analysis",
      desc: "Comparative essays, poetry clusters, Shakespeare analysis, and precise AO mark scheme phrasing.",
      icon: PenLine,
      color: "from-rose-600 to-pink-700",
      boards: "AQA · Edexcel · WJEC",
      tag: "Essay Masterclasses"
    },
    {
      title: "GCSE Sciences (Triple & Combined)",
      category: "Natural Sciences",
      desc: "Biology, Chemistry, and Physics. Practical paper breakdown, math calculations, and required practicals.",
      icon: FlaskConical,
      color: "from-emerald-600 to-teal-700",
      boards: "Trilogy & Separate",
      tag: "Practical Ready"
    },
    {
      title: "KS3 Maths & English",
      category: "Year 7 to 9",
      desc: "Closing learning gaps early, developing algebra fluency, and building reading stamina before GCSEs. (£249/month · £40/hour Year 7–11).",
      icon: BookOpen,
      color: "from-amber-600 to-orange-700",
      boards: "UK National Curriculum",
      tag: "£249/mo · £40/hr"
    },
    {
      title: "Key Stage 2 (KS2) Primary",
      category: "Year 3 to 6",
      desc: "Warm, confidence-building numeracy, phonics, reading comprehension, and Year 6 SATs preparation (£149/month).",
      icon: Sparkles,
      color: "from-yellow-500 to-amber-600",
      boards: "Primary SATs",
      tag: "£149/month"
    },
    {
      title: "A-Level Specialist Tutoring",
      category: "Year 12 & 13",
      desc: "Advanced calculus, synoptic chemistry, mechanics, and extended essay critique for UCAS offers (£320/month · £45/hour).",
      icon: GraduationCap,
      color: "from-purple-600 to-indigo-800",
      boards: "OCR · AQA · Edexcel",
      tag: "£320/mo · £45/hr"
    },
    {
      title: "IELTS Academic & UKVI",
      category: "University & Visa",
      desc: "Meticulous Task 1 & 2 essay evaluation, fluency coaching, and mock interview sittings targeting Band 7.5+ (£1,000/month).",
      icon: Globe2,
      color: "from-teal-600 to-cyan-700",
      boards: "Dedicated IELTS Portal",
      tag: "£1,000/month"
    },
    {
      title: "Coding (Software Development)",
      category: "Applied Engineering",
      desc: "Modern industry coding in HTML5, CSS3, React, Node.js, and PostgreSQL with live hands-on projects (£340/month · £35/hour).",
      icon: Code2,
      color: "from-sky-600 to-blue-700",
      boards: "Frontend & Backend",
      tag: "£340/mo · £35/hr"
    },
    {
      title: "Graphics Design & UI/UX",
      category: "Creative Technology",
      desc: "Figma wireframing, interactive prototyping, brand systems, and Adobe production design workflows (£200/month · £20/hour).",
      icon: Palette,
      color: "from-fuchsia-600 to-pink-700",
      boards: "Figma & Adobe",
      tag: "£200/mo · £20/hr"
    },
    {
      title: "Homeschool Syllabus Support",
      category: "Home Education",
      desc: "Complete syllabus coverage, structured assessments, mock examination grading, and regular parent reports.",
      icon: Compass,
      color: "from-indigo-600 to-purple-700",
      boards: "Full Curriculum",
      tag: "Independent Study"
    },
    {
      title: "International Curriculum Bridge",
      category: "Global Relocation",
      desc: "Cross-system terminology and calendar alignment for families moving between UK, US, Canada, and Australia.",
      icon: Globe,
      color: "from-[#050167] to-[#001f3f]",
      boards: "Cross-System Mapping",
      tag: "Seamless Transition"
    }
  ];

  const curriculumSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://beaconbridgeacademics.co.uk/curriculum#service',
    'url': 'https://beaconbridgeacademics.co.uk/curriculum',
    'name': 'UK GCSE & A-Level Online Tutoring Services',
    'provider': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics'
    },
    'serviceType': 'Online Academic Tuition',
    'areaServed': 'GB'
  };

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">
      <SEO 
        title="Curriculum & Exam Boards | GCSE & A-Level Tuition | Beacon Bridge"
        description="Explore our curriculum offerings across AQA, Edexcel, OCR, Cambridge CIE, IB, and North American AP programs. Tailored 1-to-1 and small group tuition."
        canonicalPath="/curriculum"
        schemaJson={curriculumSchema}
      />

      {/* ========================================================= */}
      {/* HERO BANNER                                               */}
      {/* ========================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#001f3f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#050167]/80 to-[#001f3f] z-0" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Targeted Curriculum Pathways</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Online Tutoring for Every Stage:{' '}
            <span className="bg-gradient-to-r from-white via-[#f0faff] to-[#40ffa7] bg-clip-text text-transparent">
              KS2, KS3, GCSE &amp; A-Level
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#f0faff]/85 max-w-3xl mx-auto leading-relaxed font-normal">
            Explore how we tailor lessons to each academic milestone across UK exam boards and international curricula.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE STAGES TABS                                   */}
      {/* ========================================================= */}
      <section id="stages" className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
              Academic Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
              Curriculum Tailored to Your Child's Year Group
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-[#050167]/15 p-6 sm:p-12 shadow-2xl shadow-[#050167]/8">
            
            {/* Interactive Tabs */}
            <div className="flex flex-wrap gap-2.5 mb-10 pb-6 border-b border-[#050167]/10 justify-center">
              {stages.map((stg, idx) => (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setStagesSlide(idx)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    stagesSlide === idx
                      ? 'bg-[#050167] text-[#40ffa7] shadow-xl shadow-[#050167]/25 ring-2 ring-[#40ffa7]/40 scale-102'
                      : 'bg-[#f0faff] text-[#001f3f]/80 hover:bg-[#050167]/10 hover:text-[#050167]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${stagesSlide === idx ? 'bg-[#40ffa7] animate-pulse' : 'bg-[#050167]/30'}`} />
                  <span>{stg.badge}: {stg.title}</span>
                </button>
              ))}
            </div>

            {/* Stage Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#050167]" />
                    <span>{stages[stagesSlide].badge}</span>
                  </div>
                  {stages[stagesSlide].discountFrom && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black">
                      <span className="line-through text-slate-500 mr-1.5 font-semibold">{stages[stagesSlide].discountFrom}</span>
                      {stages[stagesSlide].savingsTag}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#050167]">
                  {stages[stagesSlide].title}
                </h3>
                <p className="text-sm font-bold text-[#001f3f]/75">
                  {stages[stagesSlide].subtitle}
                </p>
                <p className="text-[#001f3f]/80 text-sm sm:text-base leading-relaxed">
                  {stages[stagesSlide].description}
                </p>

                <div className="pt-2 space-y-3">
                  {stages[stagesSlide].features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-xs sm:text-sm text-[#001f3f] font-medium p-2.5 rounded-xl bg-[#f0faff] border border-[#050167]/10">
                      <CheckCircle2 className="w-4 h-4 text-[#40ffa7] shrink-0 fill-[#050167]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link
                    to={stages[stagesSlide].ctaPath || '/register'}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm shadow-xl shadow-[#40ffa7]/30 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <span>Enrol for {stages[stagesSlide].title}</span>
                    <ArrowRight className="w-4 h-4 text-[#001f3f]" />
                  </Link>
                </div>
              </div>

              {/* Right Spec Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#050167] via-[#001f3f] to-[#050167] p-7 sm:p-9 rounded-3xl text-white shadow-2xl space-y-5 border border-[#40ffa7]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#40ffa7]/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-[#40ffa7] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
                    Tuition &amp; Fee Summary
                  </span>
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full text-white/80 font-mono">
                    {stages[stagesSlide].badge}
                  </span>
                </div>

                {/* Highlighted Monthly & Per-Hour Tuition Card */}
                {stages[stagesSlide].monthlyPrice && (
                  <div className="p-4 rounded-2xl bg-white/10 border border-[#40ffa7]/30">
                    {stages[stagesSlide].discountFrom && (
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="line-through text-slate-300">Standard {stages[stagesSlide].discountFrom}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#40ffa7] text-[#001f3f] font-black text-[10px]">
                          {stages[stagesSlide].savingsTag}
                        </span>
                      </div>
                    )}
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {stages[stagesSlide].monthlyPrice}
                    </div>
                    {stages[stagesSlide].hourlyNote && (
                      <div className="text-xs font-bold text-[#40ffa7] mt-1">
                        Or {stages[stagesSlide].hourlyNote}
                      </div>
                    )}
                  </div>
                )}

                <h4 className="text-xl font-bold text-white leading-snug">
                  Exam Technique + Subject Fluency
                </h4>
                <p className="text-xs sm:text-sm text-[#f0faff]/80 leading-relaxed italic border-l-2 border-[#40ffa7] pl-3 py-1">
                  "Our teachers work through the specification with students, topic by topic, using past-paper practice, examiner mark schemes and clear, supportive feedback."
                </p>

                <div className="p-4 bg-white/10 rounded-2xl text-xs text-[#f0faff] space-y-2.5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-[#40ffa7]" />
                    <span className="font-semibold">Exact Exam-Board Specification Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-[#40ffa7]" />
                    <span className="font-semibold">Real-Time Homework & Attendance Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-[#40ffa7]" />
                    <span className="font-semibold">Recorded Sessions for Easy Revision</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Transparent Program Fees & Discount Cards */}
          <div className="mt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block mb-2">
                Transparent Pricing &amp; Scholarships
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#001f3f] tracking-tight">
                Monthly Tuition &amp; Hourly Coaching Rates
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {programPricingCards.map((prog, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl p-6 border flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl ${
                    prog.isIelts
                      ? 'bg-gradient-to-br from-[#050167] to-[#001f3f] text-white border-[#40ffa7]/40'
                      : 'bg-white text-[#001f3f] border-[#050167]/15 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Discount Price on Top */}
                    <div className={`flex items-center justify-between pb-3 mb-3 border-b ${prog.isIelts ? 'border-white/15' : 'border-slate-100'}`}>
                      <span className={`text-xs font-bold line-through ${prog.isIelts ? 'text-slate-300' : 'text-slate-400'}`}>
                        Was {prog.discountFrom}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#40ffa7] text-[#001f3f] text-[10px] font-black uppercase">
                        {prog.savings}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${prog.isIelts ? 'text-[#40ffa7]' : 'text-[#050167]'}`}>
                      {prog.level}
                    </span>
                    <h4 className={`text-lg font-extrabold leading-snug mb-3 ${prog.isIelts ? 'text-white' : 'text-[#001f3f]'}`}>
                      {prog.title}
                    </h4>

                    <div className="mb-3">
                      <span className={`text-3xl font-black ${prog.isIelts ? 'text-[#40ffa7]' : 'text-[#050167]'}`}>
                        {prog.price}
                      </span>
                      <span className={`text-xs font-bold ml-1 ${prog.isIelts ? 'text-slate-200' : 'text-slate-500'}`}>
                        / month
                      </span>
                    </div>

                    <div className={`text-xs font-bold px-3 py-1.5 rounded-xl inline-block mb-4 ${
                      prog.isIelts
                        ? 'bg-white/10 text-white border border-white/15'
                        : 'bg-[#f0faff] text-[#050167] border border-[#050167]/15'
                    }`}>
                      {prog.hourly}
                    </div>
                  </div>

                  <Link
                    to={prog.to}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-center flex items-center justify-center gap-1.5 transition-all ${
                      prog.isIelts
                        ? 'bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f]'
                        : 'bg-[#050167] hover:bg-[#001f3f] text-white'
                    }`}
                  >
                    <span>{prog.isIelts ? 'IELTS Registration' : 'Enrol Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SUPPORT FOR EVERY MAJOR UK EXAM BOARD                     */}
      {/* ========================================================= */}
      <section id="exam-boards" className="py-20 sm:py-28 bg-white border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 border border-[#050167]/15 text-[#050167] text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#050167]" />
              <span>Specification Alignment</span>
            </div>
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
                className="bg-gradient-to-b from-[#f0faff] to-white rounded-3xl p-7 border border-[#050167]/15 hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between h-full group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
                <div>
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-white border border-[#050167]/20 text-[#050167] font-black text-xs uppercase tracking-wider mb-4 shadow-sm group-hover:border-[#40ffa7] group-hover:bg-[#050167] group-hover:text-[#40ffa7] transition-all">
                    {board.badge}
                  </div>
                  <h3 className="text-xl font-bold text-[#050167] mb-1">{board.name}</h3>
                  <p className="text-xs text-[#001f3f]/80 font-bold mb-3">{board.fullName}</p>
                  <p className="text-xs text-[#001f3f]/75 leading-relaxed mb-4">
                    {board.focus}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#050167]/10 text-[11px] text-[#001f3f]/70 font-semibold flex items-center justify-between">
                  <span>{board.subjects}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SUBJECTS AND LEVELS WE COVER                              */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>Comprehensive Subject Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Subjects and Levels We Cover
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub, i) => {
              const Icon = sub.icon;
              return (
                <div 
                  key={i} 
                  className="group bg-white p-7 rounded-3xl border border-[#050167]/15 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#40ffa7]/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sub.color} text-white flex items-center justify-center font-bold shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f0faff] text-[#050167] border border-[#050167]/15">
                        {sub.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#050167] transition-colors mb-2">
                      {sub.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#050167]/10 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#001f3f]/70 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md">
                      {sub.boards}
                    </span>
                    <span className="font-bold text-[#050167] flex items-center gap-1 group-hover:text-[#001f3f]">
                      <span>{sub.tag}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#40ffa7] group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
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
