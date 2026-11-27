import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  CalendarCheck,
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const FAQS = [
  {
    category: 'Tutoring & Curriculum',
    q: 'What is Beacon Bridge Academics?',
    a: "Beacon Bridge Academics is an online academic support company for students in the UK, the US, Canada and Australia. We provide live online lessons with teachers trained in your child's curriculum, and a parent account so you can follow their progress."
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'How does online tutoring work?',
    a: 'Lessons take place live in our virtual classroom, with video, audio, a digital whiteboard and real-time annotation of slides and PDFs. Your child joins from a laptop or tablet at a time that suits your family.'
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'Which curricula and exam boards do you support?',
    a: "We support GCSE and A-Level for UK students, along with the US, Canadian and Australian curricula. Tell us your child's exam board at your consultation (AQA, Edexcel, OCR, WJEC/Eduqas), and we will match the teaching to it."
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'Can online tutoring help my child pass their GCSEs?',
    a: "Targeted tutoring helps students fill gaps, practise exam technique and build confidence. We cannot promise a particular grade, but we can promise teaching focused on exactly what your child's exam requires."
  },
  {
    category: 'Safety & Safeguarding',
    q: 'Is online tutoring with Beacon Bridge Academics safe?',
    a: 'Safeguarding is built into how we work. Parents register with their child, every family has a consultation first, and every teacher is checked (including DBS and document verification) before working with children. Lessons take place inside our own secure classroom.'
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'Do you help homeschooled students?',
    a: 'Yes. Teachers can provide subject expertise, structure and exam preparation for homeschooled students at GCSE and A-Level.'
  },
  {
    category: 'Safety & Safeguarding',
    q: "How do I follow my child's progress?",
    a: 'Your parent account shows progress, attendance and announcements. You also receive an email whenever a teacher sets homework, and again when it has been completed.'
  },
  {
    category: 'Tuition & Onboarding',
    q: 'How much does online tutoring cost?',
    a: 'Lesson prices depend on the subject, level and plan — from £100/month for IELTS Academic & UKVI, £149/month for KS2, £249/month for KS3, £299/month for GCSE 5-Subject Core, £320/month for A-Level / Canada Grade 11–12 / US AP, £340/month for Coding, and £200/month for Graphics Design. We explain every detail clearly at your consultation so there are no surprises.'
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'What does my child need to join lessons?',
    a: 'A laptop or tablet with a camera, a microphone and a reliable internet connection is enough. Your child joins our live classroom from a web browser, and a quiet space helps them concentrate.'
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'Can you help if my child has moved from another school system?',
    a: 'Yes. This is one of the things we do best. Our teachers are trained across UK, US, Canadian and Australian curricula, so they understand what your child has already learned and what they need to catch up on.'
  },
  {
    category: 'Tutoring & Curriculum',
    q: 'What age groups and year groups do you teach?',
    a: "We teach students starting from Key Stage 2 (KS2 / Primary, Year 3–6, ages 7+) through Key Stage 3 (Year 7–9), GCSE (Year 10–11), and A-Level (Year 12–13), as well as Canadian Grade 11–12, US AP, IELTS Academic & UKVI, Coding (Software Development), and Graphics Design. Tell us your child's year group, subjects and exam board when you book your consultation."
  },
  {
    category: 'Tuition & Onboarding',
    q: 'How do I get started?',
    a: 'Register as a family (or register directly for IELTS), book a free 20-minute consultation with our academic advisor, and our team will complete your onboarding. It takes just a few minutes to begin.'
  }
];

const CATEGORIES = ['All Questions', 'Tutoring & Curriculum', 'Safety & Safeguarding', 'Tuition & Onboarding'];

export const FaqPage = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQS.filter((item) => {
      const catMatch = selectedCategory === 'All Questions' || item.category === selectedCategory;
      const textMatch = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [selectedCategory, searchQuery]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://beaconbridgeacademics.co.uk/faq#faqpage',
    'url': 'https://beaconbridgeacademics.co.uk/faq',
    'name': 'Frequently Asked Questions | Beacon Bridge Academics',
    'mainEntity': FAQS.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0faff] to-white pb-24">
      <SEO
        title="Frequently Asked Questions (FAQ) | Beacon Bridge Academics"
        description="Answers to common parent and student questions about UK GCSE, A-Level, KS2, KS3, IELTS online tutoring, safeguarding, virtual classrooms, and tuition plans."
        canonicalPath="/faq"
        schemaJson={faqSchema}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#40ffa7]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/35 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-white via-[#f0faff] to-[#40ffa7] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="mt-4 text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything parents and students need to know about our live online classrooms, UK &amp; international curricula, DBS safeguarding, and onboarding.
          </p>

          {/* Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. GCSE, safeguarding, IELTS, cost)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#40ffa7] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Accordion Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveFaq(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#050167] text-[#40ffa7] shadow-md'
                  : 'bg-white text-[#001f3f] border border-[#050167]/15 hover:border-[#050167]/40 hover:bg-[#f0faff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#050167]/15 p-10 text-center shadow-sm">
            <HelpCircle className="w-10 h-10 text-[#050167]/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#001f3f]">No matching questions found</h3>
            <p className="text-sm text-slate-600 mt-1">
              Try a different keyword or reach out directly to our UK academic support team.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#050167] !text-white font-bold text-xs shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#40ffa7]" />
              <span className="!text-white">Ask Us Directly</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
                    isOpen
                      ? 'border-[#40ffa7] bg-white ring-2 ring-[#40ffa7]/30 shadow-xl'
                      : 'border-[#050167]/15 bg-white hover:border-[#40ffa7]/50 hover:shadow-md'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-5 px-6 sm:px-8 text-left font-bold text-base sm:text-lg text-[#050167] flex items-center justify-between hover:bg-[#f0faff]/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isOpen ? 'bg-[#050167] text-[#40ffa7]' : 'bg-[#f0faff] text-[#050167]'
                        }`}
                      >
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#050167] shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 pt-3 text-sm sm:text-base text-[#001f3f]/80 leading-relaxed border-t border-[#050167]/10 bg-slate-50/50">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#050167] bg-[#40ffa7]/20 px-2.5 py-0.5 rounded-full mb-2">
                        {faq.category}
                      </span>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#050167] via-[#001f3f] to-[#050167] text-white p-8 sm:p-12 text-center shadow-2xl border border-[#40ffa7]/30 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#40ffa7]/20 border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#40ffa7]" />
            <span>Personalised Academic Advice</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Still Have a Question About Your Child&apos;s Learning?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
            Speak directly with our senior UK academic advisor or send an enquiry to{' '}
            <a href="mailto:info@beaconbridgeacademics.co.uk" className="text-[#40ffa7] font-bold underline">
              info@beaconbridgeacademics.co.uk
            </a>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book-consultation"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] !text-[#001f3f] font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-[#001f3f]" />
              <span className="!text-[#001f3f] font-black">Book a Free Consultation</span>
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/15 hover:bg-white/25 !text-white font-bold text-sm border border-white/30 transition-all flex items-center justify-center gap-2"
            >
              <span className="!text-white font-bold">Contact Support Team</span>
              <ArrowRight className="w-4 h-4 text-[#40ffa7]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
