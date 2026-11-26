import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
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
  GraduationCap,
  Megaphone,
  FileText,
  Radio,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

const CATEGORIES = [
  'All Topics',
  'GCSE Mastery',
  'A-Level & University',
  'Exam Techniques',
  'Parent Guides',
  'Announcements & Events'
];

export const BlogPage = () => {
  const socket = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'article' | 'flyer'
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [activeItem, setActiveItem] = useState(null); // article reading modal
  const [activeFlyer, setActiveFlyer] = useState(null); // flyer lightbox modal
  
  // Real-Time Notification Badge
  const [realtimeNotice, setRealtimeNotice] = useState(null);

  const fetchLiveBlog = async () => {
    try {
      const res = await api.get('/blog');
      if (res.data?.success && Array.isArray(res.data?.posts)) {
        setPosts(res.data.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.warn('Backend blog fetch returned no posts or error:', err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveBlog();
  }, []);

  // Socket.IO Real-Time Listener
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeChange = (data) => {
      fetchLiveBlog();
      const actionText = data?.action === 'create' ? 'A new post was just published live!' : 'The blog was just updated!';
      setRealtimeNotice(actionText);
      setTimeout(() => setRealtimeNotice(null), 4000);
    };

    socket.on('blog:changed', handleRealtimeChange);
    socket.on('blog:created', handleRealtimeChange);
    socket.on('blog:updated', handleRealtimeChange);
    socket.on('blog:deleted', handleRealtimeChange);

    return () => {
      socket.off('blog:changed', handleRealtimeChange);
      socket.off('blog:created', handleRealtimeChange);
      socket.off('blog:updated', handleRealtimeChange);
      socket.off('blog:deleted', handleRealtimeChange);
    };
  }, [socket]);

  // Open modal if URL has a hash matching a slug
  useEffect(() => {
    if (window.location.hash && posts.length > 0) {
      const slug = window.location.hash.replace('#', '');
      const match = posts.find(p => p.slug === slug);
      if (match) {
        if (match.type === 'flyer') {
          setActiveFlyer(match);
        } else {
          setActiveItem(match);
        }
      }
    }
  }, [posts]);

  // Filtered Items
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesType = typeFilter === 'all' || post.type === typeFilter;
      const matchesCategory = selectedCategory === 'All Topics' || post.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [posts, typeFilter, selectedCategory, searchQuery]);

  const articleCount = posts.filter(p => p.type === 'article').length;
  const flyerCount = posts.filter(p => p.type === 'flyer').length;

  // Schema for Educational Blog & Articles
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://beaconbridgeacademics.co.uk/blog#blog',
    'url': 'https://beaconbridgeacademics.co.uk/blog',
    'name': 'Beacon Bridge Academics Educational Insights & Event Flyers',
    'description': 'Expert academic insights, GCSE & A-Level revision blueprints, and event flyers from UK curriculum specialists.',
    'publisher': {
      '@type': 'EducationalOrganization',
      '@id': 'https://beaconbridgeacademics.co.uk/#organization',
      'name': 'Beacon Bridge Academics',
      'url': 'https://beaconbridgeacademics.co.uk'
    },
    'blogPost': posts.map((art) => ({
      '@type': 'BlogPosting',
      'headline': art.title,
      'description': art.excerpt,
      'author': {
        '@type': 'Person',
        'name': art.author_name
      },
      'datePublished': art.created_at,
      'url': `https://beaconbridgeacademics.co.uk/blog#${art.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO 
        title="UK Tutoring & Exam Insights Blog | GCSE, A-Level Guides & Flyers"
        description="Expert revision blueprints, A-Level study techniques, event flyers, and parent tuition advice written by verified UK curriculum teachers at Beacon Bridge Academics."
        canonicalPath="/blog"
        schemaJson={blogSchema}
      />

      {/* Floating Real-Time Update Toast */}
      {realtimeNotice && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#050167] text-[#40ffa7] px-4 py-2.5 rounded-2xl shadow-2xl border border-[#40ffa7]/30 flex items-center gap-2 text-xs font-bold">
            <Radio className="w-4 h-4 animate-pulse text-[#40ffa7]" />
            <span>{realtimeNotice}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#001f3f] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <img
          src="/pages/blog-hero.jpg"
          alt="Beacon Bridge Academics study journal, library books and revision notes"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/80 via-[#050167]/65 to-[#001f3f]/75 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/75 via-transparent to-[#001f3f]/30 z-0" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#40ffa7]/30 text-[#40ffa7] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beacon Bridge Academic Journal & Live Notices</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40ffa7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#40ffa7]"></span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Academic Insights, Revision Blueprints & Event Flyers
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            Written and curated by former exam board markers, Oxford/Cambridge graduates, and senior UK educators to keep students excel and parents informed.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search topics or event flyers (e.g. GCSE Biology, A-Level Maths, Bootcamp)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 text-slate-900 placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#40ffa7] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Main Filter Toolbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        
        {/* Type Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                typeFilter === 'all'
                  ? 'bg-[#050167] text-[#40ffa7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>All Publications</span>
              <span className="text-[10px] opacity-75">({posts.length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('article')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                typeFilter === 'article'
                  ? 'bg-[#050167] text-[#40ffa7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Articles ({articleCount})</span>
            </button>

            <button
              onClick={() => setTypeFilter('flyer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                typeFilter === 'flyer'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Event Flyers ({flyerCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Sync Active</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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

      {/* Publications Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-[#050167] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading publications...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto overflow-hidden">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src="/pages/blog-hero.jpg"
                alt="Beacon Bridge Academic Journal and Study Library"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 via-[#001f3f]/25 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#40ffa7] text-[#001f3f] text-[11px] font-black uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Academic Journal
                </span>
                <span className="text-xs font-semibold text-white/90">GCSE · A-Level · IELTS · Parent Guides</span>
              </div>
            </div>
            <div className="text-center p-8 sm:p-10">
              <h3 className="text-xl font-bold text-[#001f3f]">No Publications Yet</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Our academic faculty will be publishing curriculum revision blueprints, GCSE &amp; A-Level exam techniques, and upcoming seminar flyers here soon.
              </p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching publications found</h3>
            <p className="text-slate-500 text-sm mt-1">Try refining your search query or choosing another topic category.</p>
            <button
              onClick={() => { setSelectedCategory('All Topics'); setTypeFilter('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#050167] text-white rounded-xl text-xs font-bold hover:bg-[#001f3f] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((item) => {
              const isFlyer = item.type === 'flyer';

              return (
                <article 
                  key={item.id}
                  className={`bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                    isFlyer ? 'border-purple-200 ring-2 ring-purple-500/10' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    {/* Media Header (Flyer or Cover Image) */}
                    <div 
                      onClick={() => isFlyer ? setActiveFlyer(item) : setActiveItem(item)}
                      className="relative h-52 overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <img 
                        src={item.flyer_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop'} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100" 
                        loading="lazy"
                      />

                      {/* Type Badge */}
                      <span className={`absolute top-3 left-3 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                        isFlyer 
                          ? 'bg-purple-600 text-white border border-purple-400/50' 
                          : 'bg-[#050167]/90 backdrop-blur-md text-[#40ffa7] border border-[#40ffa7]/30'
                      }`}>
                        {isFlyer ? '📢 Event Flyer' : item.category}
                      </span>

                      {/* Quick Inspect Hover Pill */}
                      <div className="absolute inset-0 bg-[#050167]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-white text-[#050167] font-extrabold text-xs shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>{isFlyer ? 'Inspect Flyer' : 'Read Article'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.read_time || (isFlyer ? 'Event Notice' : '5 min read')}
                        </span>
                      </div>

                      <h2 
                        onClick={() => isFlyer ? setActiveFlyer(item) : setActiveItem(item)}
                        className="text-lg font-bold text-slate-900 group-hover:text-[#050167] transition-colors leading-snug line-clamp-2 cursor-pointer"
                      >
                        {item.title}
                      </h2>

                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {item.excerpt || (item.content ? item.content.substring(0, 110) + '...' : '')}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.author_name}</p>
                        <p className="text-[10px] text-slate-500">{item.author_role}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => isFlyer ? setActiveFlyer(item) : setActiveItem(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors group/btn ${
                          isFlyer 
                            ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                            : 'bg-slate-50 hover:bg-[#40ffa7]/20 text-[#050167]'
                        }`}
                      >
                        <span>{isFlyer ? 'View Flyer' : 'Read'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Free Academic Consultation Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-[#050167] to-[#001f3f] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-5 max-w-xl">
            <img
              src="/advisor.jpg"
              alt="Mr. Gideon Babs"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-[#40ffa7] shadow-xl shrink-0 hidden sm:block"
            />
            <div>
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
          </div>
          <Link
            to="/book-consultation"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#40ffa7] hover:bg-[#2be08d] text-[#001f3f] font-black text-sm transition-all shadow-lg shadow-[#40ffa7]/25 hover:scale-105 active:scale-95"
          >
            Book a Free Consultation →
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 1. HIGH-RESOLUTION EVENT FLYER LIGHTBOX MODAL                   */}
      {/* ============================================================== */}
      {activeFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col md:flex-row overflow-hidden relative">
            
            <button
              onClick={() => setActiveFlyer(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
              aria-label="Close flyer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Flyer Image Left Column */}
            <div className="md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-full">
              <img
                src={activeFlyer.flyer_image_url}
                alt={activeFlyer.title}
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                Official Event Flyer
              </span>
            </div>

            {/* Flyer Information Right Column */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  {activeFlyer.category || 'Special Notice'}
                </span>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {activeFlyer.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pb-4 border-b border-slate-100">
                  <span>Posted by: <strong>{activeFlyer.author_name}</strong></span>
                  <span>•</span>
                  <span>{new Date(activeFlyer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="mt-4 prose prose-slate text-sm text-slate-700 leading-relaxed max-h-[40vh] overflow-y-auto pr-2">
                  {(activeFlyer.content || activeFlyer.excerpt).trim().split('\n\n').map((paragraph, idx) => {
                    const trimmed = paragraph.trim();
                    if (trimmed.startsWith('### ')) {
                      return <h3 key={idx} className="text-sm font-bold text-slate-900 mt-3 mb-1">{trimmed.replace('### ', '')}</h3>;
                    }
                    if (trimmed.startsWith('- ')) {
                      return (
                        <ul key={idx} className="list-disc pl-4 space-y-1 text-xs">
                          {trimmed.split('\n').map((li, lIdx) => (
                            <li key={lIdx}>{li.replace(/^- /, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx} className="text-xs sm:text-sm text-slate-600 mb-2">{trimmed}</p>;
                  })}
                </div>
              </div>

              {/* Flyer Booking Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <Link
                  to="/book-consultation"
                  onClick={() => setActiveFlyer(null)}
                  className="w-full py-3 rounded-2xl bg-[#050167] hover:bg-[#001f3f] text-[#40ffa7] font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Book Free Consultation Regarding This Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[11px] text-center text-slate-400">
                  Questions? Email us directly at info@beaconbridgeacademics.co.uk
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FULL ARTICLE READING MODAL                                   */}
      {/* ============================================================== */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-10 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block bg-[#050167]/10 text-[#050167] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {activeItem.category}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {activeItem.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#050167] text-[#40ffa7] font-bold flex items-center justify-center text-xs">
                  {activeItem.author_name?.charAt(0) || 'B'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{activeItem.author_name}</p>
                  <p className="text-[10px]">{activeItem.author_role}</p>
                </div>
              </div>
              <span>•</span>
              <span>{new Date(activeItem.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span>{activeItem.read_time || '5 min read'}</span>
            </div>

            <div className="mt-6 prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              {activeItem.content?.trim().split('\n\n').map((paragraph, idx) => {
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
                onClick={() => setActiveItem(null)}
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
