import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  X, 
  Award,
  GraduationCap
} from 'lucide-react';

const ARTICLES = [
  {
    id: 'gcse-grade-9-blueprint',
    slug: 'gcse-grade-9-revision-blueprint',
    title: 'The GCSE Grade 9 Blueprint: How to Move from Grade 6 to Grade 9 in 90 Days',
    excerpt: 'Exam boards reward synoptic application and precise mark scheme keywords. Discover the exact revision methodology proven by our UK curriculum specialists.',
    category: 'GCSE Mastery',
    readTime: '6 min read',
    date: '18 Nov 2026',
    author: 'Dr. Sarah Jenkins',
    role: 'AQA & Edexcel Specification Lead',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    content: `
      ### Why Working Harder Isn't Working
      Every year, thousands of capable GCSE students spend hundreds of hours highlighting textbooks and creating colour-coded revision cards, only to find their mock grades stuck at a 5 or 6. 
      
      The problem isn't intelligence or effort — it is the **recall trap**. GCSE exams set by AQA, Edexcel, and OCR are not memory tests; they are **mark-scheme decoding exercises**.
      
      ### Pillar 1: The Mark Scheme Reverse-Engineering
      Examiners grade up to 300 scripts an hour. They are searching for specific command verbs and trigger terminology:
      - **In Biology**: Stating "enzymes die" loses marks. You must write "the active site denatures and is no longer complementary to the substrate".
      - **In English Literature**: Avoid lengthy plot summaries. Every analytical paragraph must link the linguistic device directly to the writer's overarching social thesis.
      
      ### Pillar 2: Spaced Retrieval over Block Reading
      Instead of studying Chemistry for 4 straight hours on Sunday:
      1. Study a core topic for 30 minutes.
      2. Complete 3 timed past-paper questions without notes.
      3. Revisit the weak areas 48 hours later.
      
      ### Pillar 3: Examiner Commentary Analysis
      Beacon Bridge students regularly analyze official Examiner Reports. Seeing the top 5 most common errors made nationally prevents you from dropping the 4 to 8 boundary marks that separate a Grade 7 from a Grade 9.
    `
  },
  {
    id: 'a-level-maths-step-oxbridge',
    slug: 'a-level-maths-step-oxbridge-success',
    title: 'Cracking A-Level Pure Maths, Further Maths & STEP for Russell Group Entry',
    excerpt: 'Moving from GCSE to A-Level Mathematics is widely cited as the biggest academic jump in UK education. Here is how top students master synoptic calculus.',
    category: 'A-Level & University',
    readTime: '8 min read',
    date: '14 Nov 2026',
    author: 'Dr. Jonathan Hayes',
    role: 'Senior A-Level Pure Maths Lead (Oxford DPhil)',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop',
    content: `
      ### The Chasm Between GCSE and A-Level Maths
      At GCSE, questions are often procedural: you identify a formula, substitute variables, and calculate an answer. At A-Level, questions are **multi-stage puzzles** combining trigonometry, differentiation, and algebraic manipulation within a single 8-mark problem.
      
      ### 1. Fluency with Algebraic Mechanics
      If you spend cognitive energy on basic algebraic rearrangement or fraction manipulation, you have zero headspace left to plan the overarching proof. Dedicate 20 minutes daily to raw algebraic drills until it becomes second nature.
      
      ### 2. Synoptic Connections
      Exam boards (especially Edexcel Paper 1 & 2) deliberately blend calculus with vectors and binomial series. Practice questions categorized by difficulty rather than by chapter topic.
      
      ### 3. Early STEP & MAT Introduction
      Even if you are not applying for Cambridge or Oxford, attempting STEP I foundation questions trains your brain to tackle non-standard mathematical problems with resilience and creative logic.
    `
  },
  {
    id: 'parent-guide-online-tuition-safety',
    slug: 'parent-guide-safe-effective-online-tuition',
    title: 'The UK Parent’s Guide to Safe, DBS-Verified & Effective Online Tutoring',
    excerpt: 'How to verify tutor credentials, understand KCSIE safeguarding standards, and ensure your investment delivers measurable grade improvements.',
    category: 'Parent Guides',
    readTime: '5 min read',
    date: '10 Nov 2026',
    author: 'Platform Safeguarding Lead',
    role: 'Beacon Bridge Academic Oversight',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=450&fit=crop',
    content: `
      ### Safety in Online Education
      The online tutoring market has grown exponentially, but not all platforms adhere to statutory standards. For parents, safeguarding must always be the foundation of any academic engagement.
      
      ### The 4 Non-Negotiables for Parents:
      1. **Enhanced DBS on the Update Service**: Ensure your tutor has an active, officially verified Enhanced Disclosure and Barring Service check.
      2. **Strict In-Platform Video Classrooms**: Private sessions should never take place on unmonitored personal social apps. Dedicated classrooms ensure lesson logs and safety monitoring.
      3. **Direct Parent Progress Transparency**: You should receive detailed session notes, attendance timestamps, and homework completion logs after every lesson.
      4. **Curriculum-Trained Subject Leads**: A university student might know their subject, but a curriculum-trained educator knows the specific marking criteria of AQA, Edexcel, and OCR.
    `
  },
  {
    id: 'ks2-sats-secondary-transition',
    slug: 'ks2-sats-secondary-transition-academic-dip',
    title: 'Navigating the KS2 to KS3 Transition: Preventing the Year 7 Academic Dip',
    excerpt: 'Why students often lose confidence between Year 6 SATs and Year 7, and how targeted foundation mentoring keeps academic momentum high.',
    category: 'Exam Techniques',
    readTime: '6 min read',
    date: '05 Nov 2026',
    author: 'Gideon Babs',
    role: 'Academic Director & Admissions Advisor',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop',
    content: `
      ### The Hidden Year 7 Dip
      In Year 6, children are in a close-knit primary environment with one dedicated class teacher who knows their exact strengths and learning style. In Year 7, they transition to 12 different teachers, multiple classrooms, and heavy independent homework demands.
      
      Studies show up to 35% of children experience a temporary stall in reading and numeracy progress during this shift.
      
      ### Keeping Confidence Intact
      - **Focus on Core Foundations**: Strong mental arithmetic, fractions, and grammatical sentence mechanics provide the resilience needed for complex secondary topics.
      - **Establish Independent Study Routines**: Teach structured time-management tools early so homework is a calm, predictable part of the evening.
      - **Encourage Questions**: Cultivate an environment where asking for clarification is seen as strength, not failure.
    `
  },
  {
    id: 'igcse-vs-gcse-international-students',
    slug: 'igcse-vs-gcse-guide-international-families',
    title: 'IGCSE vs GCSE: The Complete Guide for UK & Overseas Families',
    excerpt: 'Comparing Cambridge Assessment (CIE), Edexcel International, and UK domestic exams. Which provides the smoothest route to top global universities?',
    category: 'A-Level & University',
    readTime: '7 min read',
    date: '01 Nov 2026',
    author: 'Dr. Tariq Al-Mansoor',
    role: 'Head of International Curricula',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=450&fit=crop',
    content: `
      ### Demystifying International GCSEs
      For families moving between the UK, Canada, the Middle East, or Asia, deciding between traditional GCSEs and Cambridge IGCSEs is a critical strategic decision.
      
      ### Key Differences:
      - **Coursework vs Final Exam**: Standard GCSEs have almost entirely phased out coursework in core subjects, relying on terminal linear exams. Some IGCSE specifications still offer practical portfolio options.
      - **Global Recognition**: Both GCSE and IGCSE qualifications are treated with complete parity by UK Russell Group universities, UCAS, and North American admissions officers.
      - **Syllabus Breadth**: IGCSE Science and Mathematics often introduce advanced concepts slightly earlier, which provides excellent preparation for the IB Diploma and UK A-Levels.
    `
  }
];

const CATEGORIES = ['All Topics', 'GCSE Mastery', 'A-Level & University', 'Exam Techniques', 'Parent Guides'];

export const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'All Topics' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Schema for Educational Blog & Articles
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://beaconbridgeacademics.co.uk/blog#blog',
    'url': 'https://beaconbridgeacademics.co.uk/blog',
    'name': 'Beacon Bridge Academics Educational Insights & Exam Guidance',
    'description': 'Expert academic insights, GCSE & A-Level revision strategies, and safeguarding guidance from UK curriculum specialists.',
    'publisher': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics',
      'url': 'https://beaconbridgeacademics.co.uk'
    },
    'blogPost': ARTICLES.map((art) => ({
      '@type': 'BlogPosting',
      'headline': art.title,
      'description': art.excerpt,
      'author': {
        '@type': 'Person',
        'name': art.author
      },
      'datePublished': '2026-11-15',
      'url': `https://beaconbridgeacademics.co.uk/blog#${art.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        title="UK Tutoring & Exam Insights Blog | GCSE & A-Level Guides"
        description="Expert revision blueprints, A-Level study techniques, and parent tuition advice written by verified UK curriculum teachers at Beacon Bridge Academics."
        canonicalPath="/blog"
        schemaJson={blogSchema}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#001f3f] via-[#050167] to-[#001633] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#40ffa7_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Beacon Bridge Academic Journal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Academic Insights, Revision Blueprints & Exam Strategies
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            Written by former exam board markers, Oxford/Cambridge graduates, and senior UK educators to help students excel and parents stay informed.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search topics (e.g. GCSE Biology, A-Level Maths, Safeguarding)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat 
                  ? 'bg-[#050167] text-[#40ffa7] shadow-md scale-105' 
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
            <p className="text-slate-500 text-sm mt-1">Try refining your search query or choosing another topic category.</p>
            <button
              onClick={() => { setSelectedCategory('All Topics'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#050167] text-white rounded-xl text-xs font-bold hover:bg-[#001f3f]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article 
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#050167]/90 backdrop-blur-md text-[#40ffa7] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#40ffa7]/30">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#050167] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{article.author}</p>
                      <p className="text-[10px] text-slate-500">{article.role}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#40ffa7]/20 text-[#050167] font-bold text-xs transition-colors group/btn"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Free Academic Consultation Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-[#050167] to-[#001f3f] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#40ffa7]/20 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              Tailored UK Mentoring
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unlock Your Child's True Academic Potential
            </h2>
            <p className="mt-2 text-slate-200 text-sm leading-relaxed">
              Book a complimentary 20-minute diagnostic consultation with Mr. Gideon Babs or our senior academic advisors to identify syllabus gaps and build an individualized tuition plan.
            </p>
          </div>
          <Link
            to="/book-consultation"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm transition-all shadow-lg shadow-[#40ffa7]/25 hover:scale-105 active:scale-95"
          >
            Book a Free Consultation →
          </Link>
        </div>
      </section>

      {/* Full Article Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-10 relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block bg-[#050167]/10 text-[#050167] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {activeArticle.category}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#050167] text-[#40ffa7] font-bold flex items-center justify-center text-xs">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{activeArticle.author}</p>
                  <p className="text-[10px]">{activeArticle.role}</p>
                </div>
              </div>
              <span>•</span>
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="mt-6 prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              {activeArticle.content.trim().split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* In-Modal CTA */}
            <div className="mt-10 p-6 rounded-2xl bg-[#f0faff] border border-[#050167]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#050167] text-sm">Have questions about your child's syllabus?</p>
                <p className="text-xs text-slate-600">Our subject leads are ready to guide your family.</p>
              </div>
              <Link
                to="/book-consultation"
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2.5 bg-[#050167] text-[#40ffa7] font-bold text-xs rounded-xl hover:bg-[#001f3f] transition-all whitespace-nowrap"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
