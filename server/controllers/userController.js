import bcrypt from 'bcryptjs';
import { store } from '../database/store.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let users = await store.getProfiles();

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }
    if (status && status !== 'all') {
      users = users.filter(u => u.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => 
        u.full_name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    // Strip password hashes
    const sanitized = users.map(({ password_hash, ...rest }) => rest);
    res.status(200).json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await store.getProfileById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password_hash, ...safeUser } = user;
    res.status(200).json({ success: true, user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password = 'Password123!', full_name, role, phone, bio, status = 'active' } = req.body;

    if (!email || !full_name || !role) {
      return res.status(400).json({ success: false, message: 'Email, full name, and role are required.' });
    }

    const existing = await store.getProfileByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await store.createProfile({
      email,
      password_hash,
      full_name,
      role,
      phone: phone || '',
      bio: bio || '',
      status,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'ADMIN_CREATE_USER',
      entity_type: 'USER',
      entity_id: newUser.id,
      ip_address: req.ip || '127.0.0.1',
      details: { email: newUser.email, role: newUser.role }
    });

    const { password_hash: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, message: 'User created successfully.', user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { full_name, role, status, phone, bio } = req.body;
    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;

    const updated = await store.updateProfile(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await store.logAudit({
      user_id: req.user.id,
      action: 'ADMIN_UPDATE_USER',
      entity_type: 'USER',
      entity_id: req.params.id,
      ip_address: req.ip || '127.0.0.1',
      details: updates
    });

    const { password_hash, ...safeUser } = updated;
    res.status(200).json({ success: true, message: 'User updated successfully.', user: safeUser });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await store.getProfileById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own administrator account.' });
    }

    await store.deleteProfile(req.params.id);

    await store.logAudit({
      user_id: req.user.id,
      action: 'ADMIN_DELETE_USER',
      entity_type: 'USER',
      entity_id: req.params.id,
      ip_address: req.ip || '127.0.0.1',
      details: { email: user.email }
    });

    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    const profiles = await store.getProfiles();
    const courses = await store.getCourses();
    const classes = await store.getClasses();
    const enrollments = await store.getEnrollments();
    const attendance = await store.getAttendance();

    const totalStudents = profiles.filter(p => p.role === 'student').length;
    const totalTutors = profiles.filter(p => p.role === 'tutor').length;
    const totalParents = profiles.filter(p => p.role === 'parent').length;
    const totalCourses = courses.length;
    const activeClasses = classes.filter(c => c.status === 'live').length;
    const scheduledClasses = classes.filter(c => c.status === 'scheduled').length;

    // Calculate approximate platform revenue from course enrollments
    const revenue = enrollments.reduce((sum, enr) => {
      const course = courses.find(c => c.id === enr.course_id);
      return sum + (course ? Number(course.price || 0) : 0);
    }, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTutors,
        totalParents,
        totalCourses,
        activeClasses,
        scheduledClasses,
        totalEnrollments: enrollments.length,
        totalAttendanceRecords: attendance.length,
        revenue
      }
    });
  } catch (err) {
    next(err);
  }
};
