import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  GraduationCap,
  Layers,
  DollarSign
} from 'lucide-react';

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [customLevelInput, setCustomLevelInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    tutor_id: '',
    level: 'GCSE (Years 10–11)',
    price: '299',
    thumbnail_url: '',
    status: 'published'
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, catRes, uRes] = await Promise.all([
        api.get('/courses'),
        api.get('/courses/categories'),
        api.get('/users?role=tutor')
      ]);

      if (cRes.data.success) setCourses(cRes.data.courses);
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (uRes.data.success) setTutors(uRes.data.users);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setCustomLevelInput('');
    setFormData({
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      tutor_id: tutors[0]?.id || '',
      level: 'GCSE (Years 10–11)',
      price: '299',
      thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      status: 'published'
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCourse(c);
    const standardLevels = [
      'GCSE (Years 10–11)',
      'A-Level (Years 12–13)',
      'Key Stage 3 (Years 7–9)',
      'Canada Grade 11–12',
      'US High School / AP',
      'Professional / Tech',
      'Creative / Digital Arts',
      'Beginner',
      'Intermediate',
      'Advanced',
      'All Levels'
    ];
    const isCustom = !standardLevels.includes(c.level);
    setCustomLevelInput(isCustom ? c.level : '');
    setFormData({
      title: c.title,
      description: c.description,
      category_id: c.category_id || '',
      tutor_id: c.tutor_id || '',
      level: isCustom ? 'Custom' : (c.level || 'GCSE (Years 10–11)'),
      price: String(c.price || 0),
      thumbnail_url: c.thumbnail_url || '',
      status: c.status || 'published'
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const finalLevel = formData.level === 'Custom' ? (customLevelInput.trim() || 'Academic Program') : formData.level;
      const submitPayload = {
        ...formData,
        level: finalLevel
      };
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, submitPayload);
      } else {
        await api.post('/courses', submitPayload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? It will be immediately removed from the platform and the client registration portal.')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete course: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      course.category_id === categoryFilter ||
      course.category?.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses & Curricula Oversight</h1>
          <p className="text-xs text-slate-500 mt-1">Create, manage, and price global academic programs and technology tracks displayed across the student portal</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, levels, syllabus..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              categoryFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({courses.length})
          </button>
          {categories.map((cat) => {
            const count = courses.filter(c => c.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400">
            {searchQuery ? 'No courses match your search criteria.' : 'No courses registered yet. Click "Create New Course" above.'}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-white/95 text-slate-900 shadow-sm border border-slate-200">
                    £{course.price} GBP / mo
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[11px] font-semibold text-white capitalize">
                    {course.level}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">
                    {course.category?.name || 'Curriculum'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{course.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
                    <img
                      src={course.tutor?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={course.tutor?.full_name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      {course.tutor?.full_name || 'Dr. Sarah Jenkins'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  course.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {course.status}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(course)}
                    title="Edit Course Details & Price"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    title="Delete Course (Removes from Client Registration)"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCourse ? 'Edit Course Details' : 'Create New Course'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Cloud Systems"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Syllabus</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed course description..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Tutor</label>
                  <select
                    value={formData.tutor_id}
                    onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="GCSE (Years 10–11)">GCSE (Years 10–11)</option>
                    <option value="A-Level (Years 12–13)">A-Level (Years 12–13)</option>
                    <option value="Key Stage 3 (Years 7–9)">Key Stage 3 (Years 7–9)</option>
                    <option value="Canada Grade 11–12">Canada Grade 11–12</option>
                    <option value="US High School / AP">US High School / AP</option>
                    <option value="Professional / Tech">Professional / Tech</option>
                    <option value="Creative / Digital Arts">Creative / Digital Arts</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                    <option value="Custom">Custom Level...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Tuition (£ GBP)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 299"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-slate-400">Charged monthly to student</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="published">Published (Visible on Client)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {formData.level === 'Custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter Custom Level Name</label>
                  <input
                    type="text"
                    required
                    value={customLevelInput}
                    onChange={(e) => setCustomLevelInput(e.target.value)}
                    placeholder="e.g. Primary Key Stage 2 or IB Diploma"
                    className="w-full px-3 py-2 rounded-xl border border-brand-300 bg-brand-50/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  {saving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
