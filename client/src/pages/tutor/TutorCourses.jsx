import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users } from 'lucide-react';

export const TutorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesRes = await api.get(`/courses?tutor_id=${user.id}`);
        if (coursesRes.data.success) setCourses(coursesRes.data.courses || []);
      } catch (err) {
        console.error('Failed to load assigned courses', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Assigned Courses</h1>
        <p className="text-xs text-slate-500 mt-1">
          Courses linked to students assigned to your teaching roster by the academy administrator
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs">Loading assigned courses...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Courses Assigned Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Once the Superadmin assigns students to you, their enrolled courses will appear here automatically.
            </p>
          </div>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                    £{c.price} GBP
                  </span>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 text-[11px] font-semibold text-white">
                    {c.level}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    {c.category?.name || 'Curriculum'}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  {Array.isArray(c.assigned_students) && c.assigned_students.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Your Assigned Students
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.assigned_students.map((stu) => (
                          <span key={stu.id} className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                            {stu.full_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold capitalize">
                  {c.status}
                </span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{c.assigned_students_count || 0} Assigned Student{c.assigned_students_count === 1 ? '' : 's'}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
