import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Film,
  Play,
  Calendar,
  Clock,
  X,
  ExternalLink,
  Trash2
} from 'lucide-react';

export const TutorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlayback, setActivePlayback] = useState(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/materials/recordings');
        if (res.data.success) {
          setRecordings(res.data.recordings);
        }
      } catch (err) {
        console.error('Failed to load recordings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  const handleDeleteRecording = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete the recording "${title}"? This will remove the video file from storage to free up disk space.`)) {
      return;
    }
    try {
      const res = await api.delete(`/materials/recordings/${id}`);
      if (res.data.success) {
        setRecordings(prev => prev.filter(r => r.id !== id));
        if (activePlayback?.id === id) setActivePlayback(null);
      }
    } catch (err) {
      alert('Failed to delete recording: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lesson Recordings Library</h1>
        <p className="text-xs text-slate-500 mt-1">Access past recorded virtual lectures, review student engagement, and verify playback streams</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400">Loading recording archives...</div>
        ) : recordings.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400">No session recordings archived yet. Record during any live class to save lessons here.</div>
        ) : (
          recordings.map((rec) => (
            <div key={rec.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-900 relative flex items-center justify-center group cursor-pointer" onClick={() => setActivePlayback(rec)}>
                  <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
                    {Math.round(rec.duration_seconds / 60)} mins
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{rec.title}</h3>
                  <p className="text-xs text-emerald-700 font-semibold mb-3">{rec.class?.title || 'Lecture Archive'}</p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700">Published to Students</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActivePlayback(rec)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRecording(rec.id, rec.title)}
                    title="Delete recording and video file"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Playback Modal */}
      {activePlayback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold truncate pr-4">{activePlayback.title}</h3>
              <button onClick={() => setActivePlayback(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={activePlayback.recording_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
