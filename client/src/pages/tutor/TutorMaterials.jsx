import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  X,
  FileCheck,
  CheckCircle2,
  FileUp
} from 'lucide-react';

export const TutorMaterials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & File Upload State
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formData, setFormData] = useState({
    course_id: '',
    class_id: '',
    title: '',
    file_url: '',
    file_type: 'pdf',
    is_presentation: true
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matRes, crsRes, clsRes] = await Promise.all([
        api.get('/materials'),
        api.get(`/courses?tutor_id=${user.id}`),
        api.get('/classes')
      ]);

      if (matRes.data.success) setMaterials(matRes.data.materials);
      if (crsRes.data.success) {
        setCourses(crsRes.data.courses);
        if (crsRes.data.courses.length > 0) {
          setFormData(prev => ({ ...prev, course_id: crsRes.data.courses[0].id }));
        }
      }
      if (clsRes.data.success) setClasses(clsRes.data.classes);
    } catch (err) {
      console.error('Failed to load materials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    try {
      setUploadingFile(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const ext = file.name.split('.').pop().toLowerCase();
        setFormData(prev => ({
          ...prev,
          file_url: res.data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
          file_type: ext === 'pdf' ? 'pdf' : (['ppt', 'pptx'].includes(ext) ? 'pptx' : ext),
          is_presentation: ['pdf', 'ppt', 'pptx'].includes(ext)
        }));
      }
    } catch (err) {
      alert('Failed to upload file from your computer: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file_url) {
      alert('Please select a file to upload from your computer.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/materials', formData);
      setModalOpen(false);
      setSelectedFileName('');
      setFormData({
        course_id: courses[0]?.id || '',
        class_id: '',
        title: '',
        file_url: '',
        file_type: 'pdf',
        is_presentation: true
      });
      fetchData();
    } catch (err) {
      alert('Failed to save learning material: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/materials/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete material');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Learning Materials & Slide Decks</h1>
          <p className="text-xs text-slate-500 mt-1">Upload PowerPoint presentations, PDF documents, and lecture assets for your students</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Material / Slide Deck</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading resources...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400">No learning materials uploaded yet.</div>
        ) : (
          materials.map((mat) => (
            <div key={mat.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  mat.is_presentation ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {mat.is_presentation ? <Layers className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={mat.title}>{mat.title}</h4>
                  <p className="text-xs text-emerald-700 font-medium truncate mt-0.5">{mat.course?.title || 'General'}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                    <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100">{mat.file_type}</span>
                    <span>&bull;</span>
                    <span>{mat.is_presentation ? 'Slide Deck Presentation' : 'Reference Document'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(mat.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Upload */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Learning Material</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Course</label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.id}>{crs.title}</option>
                  ))}
                </select>
              </div>

              {/* File Dropzone & Native Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select File from Your Computer / System *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    formData.file_url 
                      ? 'border-emerald-500 bg-emerald-50/70' 
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    {uploadingFile ? (
                      <Upload className="w-5 h-5 animate-spin" />
                    ) : formData.file_url ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <FileUp className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {uploadingFile 
                        ? 'Uploading file to server...' 
                        : (selectedFileName ? `Selected: ${selectedFileName}` : 'Click to select file from your system')}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      PDF, PowerPoint (.ppt, .pptx), Word (.docx), or Images up to 30MB
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material / Presentation Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Week 4: GCSE Mathematics Exam Questions.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_pres"
                  checked={formData.is_presentation}
                  onChange={(e) => setFormData({ ...formData, is_presentation: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="is_pres" className="text-xs font-semibold text-slate-700">
                  Enable as Live Classroom Interactive Slide Deck
                </label>
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {saving ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
