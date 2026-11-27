import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { showConfirm, showSuccess, showError } from '../../utils/swal';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  Search,
  UserPlus,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  GraduationCap,
  Link2,
  Unlink,
  Clock
} from 'lucide-react';

export const AdminUsers = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create / Edit User Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    bio: '',
    status: 'active'
  });
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Assign Tutor Modal states
  const [assignModalStudent, setAssignModalStudent] = useState(null);
  const [assignTutorId, setAssignTutorId] = useState('');
  const [assignCourseId, setAssignCourseId] = useState('');
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, tutorsRes, coursesRes] = await Promise.all([
        api.get('/users', {
          params: {
            search,
            role: roleFilter,
            status: statusFilter,
            includeAssignments: 'true'
          }
        }),
        api.get('/users', { params: { role: 'tutor', status: 'active' } }),
        api.get('/courses')
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (tutorsRes.data.success) setTutors(tutorsRes.data.users || []);
      if (coursesRes.data.success) setCourses(coursesRes.data.courses || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      full_name: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      bio: '',
      status: 'active'
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      full_name: u.full_name,
      email: u.email,
      password: '',
      role: u.role,
      phone: u.phone || '',
      bio: u.bio || '',
      status: u.status
    });
    setFormError('');
    setModalOpen(true);
  };

  const openAssignTutorModal = (studentUser) => {
    setAssignModalStudent(studentUser);
    const firstEnrolledCourseId = studentUser.enrollments?.[0]?.course_id || courses[0]?.id || '';
    const existingTutorId = studentUser.enrollments?.[0]?.assigned_tutor?.id || studentUser.tutor_links?.[0]?.tutor_id || tutors[0]?.id || '';
    setAssignCourseId(firstEnrolledCourseId);
    setAssignTutorId(existingTutorId);
  };

  const handleAssignTutorSubmit = async (e) => {
    e.preventDefault();
    if (!assignModalStudent || !assignTutorId) {
      showError('Tutor Required', 'Please select an active Tutor account to assign.');
      return;
    }

    try {
      setAssignSubmitting(true);
      const res = await api.post('/users/tutor-assignments', {
        student_id: assignModalStudent.id,
        tutor_id: assignTutorId,
        course_id: assignCourseId || null
      });

      if (res.data.success) {
        await showSuccess(
          'Tutor Assigned',
          res.data.message || 'Tutor has been assigned and both student & tutor have been notified.'
        );
        setAssignModalStudent(null);
        await fetchUsers();
      }
    } catch (err) {
      showError('Assignment Failed', err.response?.data?.message || 'Failed to assign tutor.');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleUnassignTutor = async (linkId) => {
    const confirmed = await showConfirm({
      title: 'Remove Tutor Assignment?',
      text: 'The student will see "Your tutor will be assigned soon." until another tutor is assigned.',
      confirmText: 'Yes, Unassign',
      cancelText: 'Cancel',
      icon: 'warning'
    });
    if (!confirmed) return;

    try {
      await api.delete(`/users/tutor-assignments/${linkId}`);
      await showSuccess('Tutor Unassigned', 'Tutor link removed successfully.');
      setAssignModalStudent(null);
      await fetchUsers();
    } catch (err) {
      showError('Unassign Failed', err.response?.data?.message || 'Failed to remove tutor assignment.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setActionLoading(true);

    try {
      if (editingUser) {
        const res = await api.put(`/users/${editingUser.id}`, {
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone,
          bio: formData.bio,
          status: formData.status
        });
        if (currentUser?.id === editingUser.id && res.data.user && updateUser) {
          updateUser(res.data.user);
        }
        await showSuccess('User Updated', 'User profile details successfully saved.');
      } else {
        await api.post('/users', formData);
        await showSuccess('User Account Created', `Account for ${formData.full_name} (${formData.role}) created successfully.`);
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Action failed.';
      setFormError(msg);
      showError('Action Failed', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/users/${user.id}`, { status: newStatus });
      const msg = user.status === 'pending_verification'
        ? `${user.full_name}'s account (and any linked pending parent/student account) has been confirmed & unlocked for login.`
        : `User status changed to ${newStatus}.`;
      await showSuccess('Status Updated', msg);
      await fetchUsers();
    } catch (err) {
      showError('Status Update Failed', err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = await showConfirm({
      title: 'Delete User Account?',
      text: `Are you sure you want to permanently delete the account for ${userName || 'this user'}? This action cannot be undone.`,
      confirmText: 'Yes, Delete User',
      cancelText: 'Cancel',
      icon: 'warning'
    });
    if (!confirmed) return;

    try {
      await api.delete(`/users/${userId}`);
      await showSuccess('User Deleted', 'User account permanently removed.');
      await fetchUsers();
    } catch (err) {
      showError('Delete Failed', err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management & Tutor Assignment</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage real accounts and link each enrolled student to their assigned tutor
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
          />
        </form>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admins</option>
            <option value="tutor">Tutors</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">User Profile</th>
                <th className="py-3.5 px-5">Email Address</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Course & Tutor Link</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading accounts...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No users match your search criteria.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const studentEnrollments = u.enrollments || [];
                  const studentTutorLinks = u.tutor_links || [];

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <UserAvatar
                            name={u.full_name}
                            avatarUrl={u.avatar_url}
                            role={u.role}
                            className="w-8 h-8 rounded-full text-xs"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.full_name}</span>
                            <span className="text-[11px] text-slate-400">{u.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          u.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'tutor' ? 'bg-emerald-100 text-emerald-800' :
                          u.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Real Course & Tutor Link Status */}
                      <td className="py-3.5 px-5">
                        {u.role === 'student' ? (
                          <div className="space-y-1 max-w-[240px]">
                            {studentEnrollments.length > 0 ? (
                              studentEnrollments.map((enr) => (
                                <div key={enr.id} className="text-[11px]">
                                  <span className="font-semibold text-slate-800 block truncate" title={enr.course?.title}>
                                    {enr.course?.title}
                                  </span>
                                  {enr.assigned_tutor ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                      <GraduationCap className="w-3 h-3" />
                                      Tutor: {enr.assigned_tutor.full_name}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                      <Clock className="w-3 h-3" />
                                      Tutor Unassigned
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : studentTutorLinks.length > 0 ? (
                              studentTutorLinks.map((lnk) => (
                                <span key={lnk.id} className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                  <GraduationCap className="w-3 h-3" />
                                  Tutor: {lnk.tutor?.full_name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400">No course enrolled</span>
                            )}
                          </div>
                        ) : u.role === 'tutor' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                            {u.assigned_students_count || 0} Assigned Student{u.assigned_students_count === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">&mdash;</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : u.status === 'pending_verification'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-700'
                        }`}>
                          {u.status === 'active' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <XCircle className={`w-3 h-3 ${u.status === 'pending_verification' ? 'text-amber-500' : 'text-rose-500'}`} />
                          )}
                          <span className="capitalize">
                            {u.status === 'pending_verification' ? 'Pending Verification' : u.status}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {u.role === 'student' && (
                            <button
                              onClick={() => openAssignTutorModal(u)}
                              title="Assign Tutor to Student"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition-colors"
                            >
                              <Link2 className="w-3 h-3" />
                              <span>Assign Tutor</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === 'active' ? 'Suspend Account' : 'Confirm & Activate Account'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              u.status === 'active'
                                ? 'text-amber-700 hover:bg-amber-50'
                                : u.status === 'pending_verification'
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : u.status === 'pending_verification' ? 'Activate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => openEditModal(u)}
                            title="Edit User"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {u.role !== 'superadmin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.full_name)}
                              title="Delete User"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Tutor Modal */}
      {assignModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>Assign Tutor to {assignModalStudent.full_name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{assignModalStudent.email}</p>
              </div>
              <button onClick={() => setAssignModalStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Assignments */}
            {assignModalStudent.tutor_links?.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Tutor Assignment(s)
                </span>
                {assignModalStudent.tutor_links.map((lnk) => (
                  <div key={lnk.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-emerald-900">{lnk.tutor?.full_name}</p>
                      <p className="text-[11px] text-emerald-700">{lnk.course?.title || 'Enrolled Course'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnassignTutor(lnk.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px]"
                    >
                      <Unlink className="w-3 h-3" />
                      <span>Unassign</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tutors.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                <strong>No Active Tutor Accounts Found:</strong> Create a Tutor account using &ldquo;Add New Account&rdquo; (role: Tutor) or approve a Teacher Application first before assigning a tutor to this student.
              </div>
            ) : (
              <form onSubmit={handleAssignTutorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student&apos;s Course *</label>
                  <select
                    value={assignCourseId}
                    onChange={(e) => setAssignCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {assignModalStudent.enrollments?.length > 0 && (
                      <optgroup label="Student's Enrolled Courses">
                        {assignModalStudent.enrollments.map((enr) => (
                          <option key={enr.course_id} value={enr.course_id}>
                            {enr.course?.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="All Official Courses (Will Also Enroll Student)">
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Active Tutor *</label>
                  <select
                    required
                    value={assignTutorId}
                    onChange={(e) => setAssignTutorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">-- Choose a Tutor --</option>
                    {tutors.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px]">
                  Once assigned, <strong>{assignModalStudent.full_name}</strong> will see their tutor&apos;s name on their dashboard and receive instant notifications whenever this tutor starts a live class.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAssignModalStudent(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assignSubmitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                  >
                    {assignSubmitting ? 'Assigning...' : 'Confirm Tutor Assignment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialog for Create / Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit User Profile' : 'Create New User Account'}
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

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (@gmail.com)</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="parent">Parent</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7..."
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
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  {actionLoading ? 'Saving...' : editingUser ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
