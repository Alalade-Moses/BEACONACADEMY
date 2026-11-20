import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import { showSuccess, showError, showConfirm } from '../../utils/swal';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  X,
  ExternalLink,
  Tag,
  AlertCircle,
  Megaphone
} from 'lucide-react';

const CATEGORIES = [
  'GCSE Mastery',
  'A-Level & University',
  'Exam Techniques',
  'Parent Guides',
  'Announcements & Events'
];

export const AdminBlog = () => {
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'article' | 'flyer'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'GCSE Mastery',
    type: 'article', // 'article' | 'flyer'
    excerpt: '',
    content: '',
    flyer_image_url: '',
    author_name: 'Platform Administrator',
    author_role: 'Head of Academic Advisory',
    read_time: '5 min read',
    status: 'published',
    featured: false
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blog', {
        params: { status: 'all' }
      });
      if (res.data.success && res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleBlogEvent = () => {
      fetchPosts();
    };

    socket.on('blog:changed', handleBlogEvent);
    socket.on('blog:created', handleBlogEvent);
    socket.on('blog:updated', handleBlogEvent);
    socket.on('blog:deleted', handleBlogEvent);

    return () => {
      socket.off('blog:changed', handleBlogEvent);
      socket.off('blog:created', handleBlogEvent);
      socket.off('blog:updated', handleBlogEvent);
      socket.off('blog:deleted', handleBlogEvent);
    };
  }, [socket]);

  const handleOpenCreateModal = (type = 'article') => {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      category: type === 'flyer' ? 'Announcements & Events' : 'GCSE Mastery',
      type,
      excerpt: '',
      content: '',
      flyer_image_url: '',
      author_name: 'Platform Administrator',
      author_role: 'Head of Academic Advisory',
      read_time: type === 'flyer' ? 'Event Notice' : '5 min read',
      status: 'published',
      featured: false
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'GCSE Mastery',
      type: post.type || 'article',
      excerpt: post.excerpt || '',
      content: post.content || '',
      flyer_image_url: post.flyer_image_url || '',
      author_name: post.author_name || 'Platform Administrator',
      author_role: post.author_role || 'Curriculum Lead',
      read_time: post.read_time || '5 min read',
      status: post.status || 'published',
      featured: !!post.featured
    });
    setModalOpen(true);
  };

  // Image / Flyer File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Invalid File', 'Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        setForm(prev => ({ ...prev, flyer_image_url: res.data.url }));
        showSuccess('Image Uploaded', 'Flyer/cover image uploaded successfully.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showError('Upload Failed', err.response?.data?.message || 'Could not upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showError('Required Field', 'Please provide a title for the blog post or flyer.');
      return;
    }

    setSaving(true);
    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, form);
        showSuccess('Post Updated', 'The blog post has been updated and synchronized in real time.');
      } else {
        await api.post('/blog', form);
        showSuccess('Published!', `Your ${form.type === 'flyer' ? 'flyer' : 'article'} is now live on the blog!`);
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Save failed:', err);
      showError('Failed to Save', err.response?.data?.message || 'Could not save post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    const confirmed = await showConfirm(
      'Delete Post?',
      `Are you sure you want to permanently delete "${post.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/blog/${post.id}`);
      showSuccess('Deleted', 'The post has been removed from the platform.');
      fetchPosts();
    } catch (err) {
      showError('Delete Failed', err.response?.data?.message || 'Could not delete post.');
    }
  };

  // Filter & Search
  const filteredPosts = posts.filter(post => {
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const totalArticles = posts.filter(p => p.type === 'article').length;
  const totalFlyers = posts.filter(p => p.type === 'flyer').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#050167]/10 text-[#050167]">
              <Newspaper className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Blog & Event Flyers Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish educational articles, revision blueprints, and event flyers that broadcast to the public blog in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Live Blog</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={() => handleOpenCreateModal('flyer')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20 active:scale-95"
          >
            <Megaphone className="w-4 h-4" />
            <span>+ Post Event Flyer</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal('article')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-[#40ffa7] font-black text-xs transition-all shadow-md shadow-[#050167]/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Publications</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{posts.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#050167]/10 flex items-center justify-center text-[#050167]">
            <Newspaper className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Articles & Guides</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{totalArticles}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flyers & Notices</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{totalFlyers}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({posts.length})
          </button>
          <button
            onClick={() => setFilterType('article')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'article'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Articles ({totalArticles})
          </button>
          <button
            onClick={() => setFilterType('flyer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'flyer'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flyers ({totalFlyers})
          </button>
        </div>

        {/* Category & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#050167]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#050167]"
            />
          </div>
        </div>
      </div>

      {/* Publications Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-[#050167] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading publications...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No publications found</h3>
          <p className="text-xs text-slate-500 mt-1">Get started by creating your first educational article or event flyer.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => handleOpenCreateModal('article')}
              className="px-3.5 py-2 bg-[#050167] text-white rounded-xl text-xs font-bold"
            >
              + Create Article
            </button>
            <button
              onClick={() => handleOpenCreateModal('flyer')}
              className="px-3.5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              + Post Flyer
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Image / Flyer Banner */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {post.flyer_image_url ? (
                    <img
                      src={post.flyer_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-10 h-10 mb-1" />
                      <span className="text-[11px] font-medium">No cover image</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                      post.type === 'flyer'
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#050167] text-[#40ffa7]'
                    }`}>
                      {post.type === 'flyer' ? 'Event Flyer' : 'Article'}
                    </span>

                    <span className="bg-white/90 backdrop-blur-md text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {post.category}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    post.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {post.status === 'published' ? '● Published' : '○ Draft'}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{post.read_time || '5 min read'}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#050167] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No excerpt provided.')}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                      By {post.author_name}
                    </span>
                    <span className="text-[11px] text-slate-400">{post.slug}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/blog#${post.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#050167] hover:underline"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                    title="Edit Post"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(post)}
                    className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Post / Flyer Create & Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`p-1.5 rounded-lg ${form.type === 'flyer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-[#050167]'}`}>
                {form.type === 'flyer' ? <Megaphone className="w-4 h-4" /> : <Newspaper className="w-4 h-4" />}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {editingPost ? 'Edit Publication' : (form.type === 'flyer' ? 'Post New Event Flyer' : 'Publish New Academic Article')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Publications appear immediately on the public blog and refresh automatically in real time.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: 'article', read_time: '5 min read' }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    form.type === 'article'
                      ? 'bg-white text-[#050167] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Educational Article</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: 'flyer', read_time: 'Event Notice', category: 'Announcements & Events' }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    form.type === 'flyer'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Flyer / Event Notice</span>
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {form.type === 'flyer' ? 'Flyer / Event Headline *' : 'Article Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={form.type === 'flyer' ? 'e.g. Easter GCSE & A-Level 2027 Intensive Revision Bootcamp' : 'e.g. The GCSE Grade 9 Blueprint: How to Move from Grade 6 to Grade 9'}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publish Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                  >
                    <option value="published">Published (Visible on Live Blog)</option>
                    <option value="draft">Draft (Admin Only)</option>
                  </select>
                </div>
              </div>

              {/* Flyer / Cover Image Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {form.type === 'flyer' ? 'Flyer Image File (Upload or Paste URL) *' : 'Cover Header Image'}
                </label>

                {form.flyer_image_url && (
                  <div className="relative mb-3 h-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    <img
                      src={form.flyer_image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, flyer_image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={form.flyer_image_url}
                    onChange={(e) => setForm({ ...form, flyer_image_url: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#050167]"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Excerpt / Teaser
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise 1-2 sentence hook displayed on card previews..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {form.type === 'flyer' ? 'Flyer Event Details / Instructions' : 'Full Article Body (Markdown supported)'}
                </label>
                <textarea
                  rows={7}
                  required
                  placeholder={form.type === 'flyer' 
                    ? 'Detail event dates, curriculum topics covered, pricing, schedule, and registration instructions...' 
                    : '### Subheading\nWrite your informative article content here using markdown headers, bullet points, and advice...'}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                />
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author Title / Role
                  </label>
                  <input
                    type="text"
                    value={form.author_role}
                    onChange={(e) => setForm({ ...form, author_role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#050167]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-[#40ffa7] font-black text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : (editingPost ? 'Update Publication' : 'Publish to Live Blog')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
