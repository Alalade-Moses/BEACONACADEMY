import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Mail,
  ShieldCheck,
  GraduationCap,
  BookOpen
} from 'lucide-react';

export const AdminUsers = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', {
        params: {
          search,
          role: roleFilter,
          status: statusFilter
        }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        await api.post('/users', formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/users/${user.id}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Account Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage platform administrators, tutors, students, and parent accounts</p>
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
        
        {/* Search */}
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

        {/* Role & Status Selectors */}
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
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Platform Role</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
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
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 flex items-center space-x-3">
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.full_name)}`}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.full_name}</span>
                        <span className="text-[11px] text-slate-400">{u.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        u.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'tutor' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.status === 'active' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                        <span className="capitalize">{u.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            u.status === 'active' 
                              ? 'text-amber-700 hover:bg-amber-50' 
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
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
                            onClick={() => handleDeleteUser(u.id)}
                            title="Delete User"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Create / Edit */}
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
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@beaconbridgeacademics.co.uk"
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
                      placeholder="Min 6 characters"
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
                  placeholder="+1-555-0199"
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
