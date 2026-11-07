import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  FileText,
  Download,
  ExternalLink,
  Layers,
  Search,
  BookOpen
} from 'lucide-react';

export const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const res = await api.get('/materials');
        if (res.data.success) {
          setMaterials(res.data.materials);
        }
      } catch (err) {
        console.error('Failed to load materials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Materials & Slide Decks</h1>
        <p className="text-xs text-slate-500 mt-1">Download slide decks, reading assignments, and reference documents uploaded by your instructors</p>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading resources...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400">No learning materials uploaded yet for your enrolled courses.</div>
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
                  <p className="text-xs text-brand-700 font-semibold truncate mt-0.5">{mat.course?.title || 'General'}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                    <span className="uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100">{mat.file_type}</span>
                    <span>&bull;</span>
                    <span>{(mat.file_size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(mat.created_at).toLocaleDateString()}
                </span>
                <a
                  href={mat.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
