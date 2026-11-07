import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const StudentCourses = () => {
  const [tab, setTab] = useState('enrolled'); // 'enrolled' | 'browse'
  const [enrollments, setEnrollments] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrRes, catRes] = await Promise.all([
        api.get('/courses/user/my-enrollments'),
        api.get('/courses')
      ]);

      if (enrRes.data.success) setEnrollments(enrRes.data.enrollments);
      if (catRes.data.success) setCatalog(catRes.data.courses);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      await fetchData();
      setTab('enrolled');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  const enrolledCourseIds = enrollments.map(e => e.course_id);

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Courses & Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Access your enrolled courses and explore additional academic curricula</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-200/60 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'enrolled' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'browse' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Catalog
          </button>
        </div>
      </div>

      {/* View Content */}
      {tab === 'enrolled' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-slate-400">Loading enrolled courses...</div>
          ) : enrollments.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-400">
              You have not enrolled in any courses yet. Click "Explore Catalog" to find a programme!
            </div>
          ) : (
            enrollments.map((enr) => (
              <div key={enr.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-44 relative bg-slate-100 overflow-hidden">
                    <img src={enr.course?.thumbnail_url} alt={enr.course?.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[11px] font-semibold text-white capitalize">
                      {enr.course?.level}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">
                      {enr.course?.category?.name || 'Academic Course'}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{enr.course?.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {enr.course?.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="font-bold text-brand-700">{enr.progress_pct || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${enr.progress_pct || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={enr.course?.tutor?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={enr.course?.tutor?.full_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-slate-700 font-medium">{enr.course?.tutor?.full_name || 'Dr. Sarah Jenkins'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-44 relative bg-slate-100 overflow-hidden">
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                      ${course.price}
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
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Tutor: {course.tutor?.full_name}</span>
                  {isEnrolled ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                    >
                      {enrollingId === course.id ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
