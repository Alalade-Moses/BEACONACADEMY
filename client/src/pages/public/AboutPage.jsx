import React from 'react';
import { Link } from 'react-router-dom';
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
  Compass
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-[#f0faff] text-[#001f3f]">
      
      {/* ========================================================= */}
      {/* HERO BANNER: HERITAGE & MISSION                           */}
      {/* ========================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#001f3f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] via-[#050167]/80 to-[#001f3f] z-0" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[140px] pointer-events-none" />

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-[#f0faff] to-white rounded-3xl p-8 sm:p-14 border border-[#050167]/15 shadow-xl shadow-[#050167]/5 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167]/5 text-[#050167] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#050167]" />
              <span>Educational Leadership</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-[#050167] tracking-tight">
              About Beacon Bridge Academics
            </h2>

            <p className="text-base sm:text-lg text-[#001f3f]/85 leading-relaxed">
              Beacon Bridge Academics is led by experienced educators with classroom experience, international teaching licences and a background in educational leadership. 
              We built Beacon around one simple belief: a struggling student does best with a teacher who knows their syllabus, modern tools that make lessons clear, and parents who can see what is happening. 
              Our teachers are trained across the UK, US, Canadian and Australian curricula before they meet a student, and the whole team shares one aim: 
              <strong className="text-[#050167]"> helping children feel capable again</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#050167]/10">
              <div className="p-4 rounded-2xl bg-white border border-[#050167]/10">
                <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block">Classroom Experience</span>
                <span className="font-bold text-slate-800 text-sm">International Licenced Educators</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#050167]/10">
                <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block">Syllabus Alignment</span>
                <span className="font-bold text-slate-800 text-sm">AQA • Edexcel • OCR • WJEC</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#050167]/10">
                <span className="text-xs font-bold text-[#050167] uppercase tracking-wider block">Family Transparency</span>
                <span className="font-bold text-slate-800 text-sm">Real-Time Parent Progress Portal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHAT MAKES BEACON BRIDGE ACADEMICS DIFFERENT              */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f0faff] border-b border-[#050167]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#050167] text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#40ffa7]" />
              <span>The Beacon Bridge Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001f3f] tracking-tight">
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
              <div 
                key={idx} 
                className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 flex items-start gap-5 hover:border-[#40ffa7] hover:shadow-xl hover:shadow-[#050167]/5 transition-all duration-300 hover:-translate-x-1"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#050167] text-[#40ffa7] flex items-center justify-center font-black text-sm shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  0{idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#050167] transition-colors">{diff.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
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
              We take the safety of children seriously, and we have built it into how Beacon Bridge Academics works.
            </p>
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
            Read our <a href="#safeguarding" className="font-bold text-[#050167] hover:underline">Safeguarding Policy</a> and <a href="#safeguarding" className="font-bold text-[#050167] hover:underline">Parent Code of Conduct</a> for full details.
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
