import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Layers
} from 'lucide-react';

export const CurriculumPage = () => {
  const [stagesSlide, setStagesSlide] = useState(0);

  // 1. Stages Data
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
    },
    {
      id: 'software',
      badge: 'Technology Track',
      title: 'Software Development & Web Engineering',
      subtitle: 'Frontend Engineering (£300/mo) & Backend Systems (£420/mo)',
      description: 'Industry-standard modern software engineering tracks. Students build real-world responsive web applications, relational databases, REST APIs, and full-stack software architecture with expert code reviews.',
      features: ['Frontend Track (£300/mo): HTML5, CSS3, Modern JavaScript, React.js & Tailwind CSS', 'Backend Track (£420/mo): Node.js, Express, PostgreSQL, WebSockets & Cloud DevOps', 'Direct portfolio building & live hands-on coding']
    },
    {
      id: 'graphics',
      badge: 'Digital Arts',
      title: 'Professional Graphic Design & UI/UX',
      subtitle: 'Visual identity, UI/UX prototyping & creative portfolio (£300/mo)',
      description: 'Master industry-standard visual design workflows. Students learn brand identity, typography, Figma UI/UX prototyping, vector illustration in Illustrator, and Photoshop digital artistry.',
      features: ['Figma interactive UI/UX prototyping & wireframing', 'Brand identity, typography, color theory & design systems', 'Adobe Illustrator & Photoshop production workflows']
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

  // 3. Subjects Directory Data
  const subjects = [
    { title: "GCSE Maths tutors", desc: "Foundation & Higher tiers for AQA, Edexcel and OCR." },
    { title: "GCSE English tutors", desc: "English Language & English Literature analysis." },
    { title: "GCSE Science tutors", desc: "Biology, Chemistry, and Physics (Combined & Triple)." },
    { title: "KS3 Maths and English tutors", desc: "Foundational numeracy and literacy for Years 7-9." },
    { title: "A-Level tutors", desc: "Advanced specialist subject coaching & mock exam prep." },
    { title: "Homeschool tutoring", desc: "Complete syllabus coverage and structured assessments." },
    { title: "US, Canadian & Australian curricula", desc: "Cross-system bridge support for relocating families." }
  ];

  return (
    <div className="bg-[#f0faff] text-[#001f3f]">

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
              KS3, GCSE & A-Level
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050167]/10 text-[#050167] text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#050167]" />
                  <span>{stages[stagesSlide].badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#050167]">
                  {stages[stagesSlide].title}
                </h3>
                <p className="text-sm font-bold text-[#001f3f]/70">
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
                    to="/register"
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
                    Why Our Approach Works
                  </span>
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full text-white/80 font-mono">
                    UK SPEC READY
                  </span>
                </div>

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
            {subjects.map((sub, i) => (
              <div 
                key={i} 
                className="group bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-[#40ffa7] hover:shadow-2xl hover:shadow-[#050167]/10 transition-all duration-300 hover:-translate-y-1.5 flex items-start gap-4 relative overflow-hidden"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Check className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#050167] transition-colors">{sub.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{sub.desc}</p>
                </div>
              </div>
            ))}
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
