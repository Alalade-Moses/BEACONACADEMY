import bcrypt from 'bcryptjs';
import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isValidEmail, normalizeEmail, validatePassword, clampText, isUuid } from '../utils/validators.js';

const VALID_ROLES = new Set(['superadmin', 'admin', 'tutor', 'student', 'parent']);
const VALID_STATUSES = new Set(['active', 'suspended', 'pending', 'pending_verification']);

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let users = await store.getProfiles();

    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }
    if (status && status !== 'all') {
      users = users.filter((u) => u.status === status);
    }
    if (search) {
      const q = String(search).toLowerCase();
      users = users.filter(
        (u) =>
          (u.full_name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
      );
    }

    const sanitized = users.map(({ password_hash, ...rest }) => rest);
    res.status(200).json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (!isUuid(targetId)) {
      return res.status(400).json({ success: false, message: 'Invalid user identifier.' });
    }

    // Zero-trust IDOR protection: users may only access themselves, their linked children, or via superadmin/tutor role
    const isElevated = req.user.role === 'superadmin' || req.user.role === 'tutor';
    const isSelf = req.user.id === targetId;

    if (!isElevated && !isSelf) {
      let isLinkedChild = false;
      if (req.user.role === 'parent') {
        const links = await store.getParentStudentLinks();
        isLinkedChild = links.some((l) => l.parent_id === req.user.id && l.student_id === targetId);
      }
      if (!isLinkedChild) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot view this user profile.' });
      }
    }

    const user = await store.getProfileById(targetId);
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
    const { email, password, full_name, role, phone, bio, status = 'active' } = req.body || {};

    if (!email || !full_name || !role) {
      return res.status(400).json({ success: false, message: 'Email, full name, and role are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!VALID_ROLES.has(role)) {
      return res.status(400).json({ success: false, message: 'Invalid user role specified.' });
    }
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ success: false, message: 'Invalid user status specified.' });
    }
    if (password) {
      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) return res.status(400).json({ success: false, message: pwCheck.message });
    }

    const existing = await store.getProfileByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const initialPassword = password || `${Math.random().toString(36).slice(-8)}A1!#`;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(initialPassword, salt);

    const cleanName = clampText(full_name, 120);
    const newUser = await store.createProfile({
      email: normalizeEmail(email),
      password_hash,
      full_name: cleanName,
      role,
      phone: clampText(phone || '', 40),
      bio: clampText(bio || '', 1000),
      status,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'ADMIN_CREATE_USER',
      entity_type: 'USER',
      entity_id: newUser.id,
      ip_address: getClientIp(req),
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
    const { full_name, role, status, phone, bio } = req.body || {};
    const updates = {};

    if (full_name !== undefined) updates.full_name = clampText(full_name, 120);
    if (role !== undefined) {
      if (!VALID_ROLES.has(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role specified.' });
      }
      updates.role = role;
    }
    if (status !== undefined) {
      if (!VALID_STATUSES.has(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status specified.' });
      }
      updates.status = status;
    }
    if (phone !== undefined) updates.phone = clampText(phone, 40);
    if (bio !== undefined) updates.bio = clampText(bio, 1000);

    const existingBefore = await store.getProfileById(req.params.id);
    const updated = await store.updateProfile(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (status === 'active' && existingBefore?.status === 'pending_verification') {
      try {
        const links = await store.getParentStudentLinks();
        for (const lnk of links) {
          if (lnk.parent_id === req.params.id && lnk.student_id) {
            const stu = await store.getProfileById(lnk.student_id);
            if (stu && stu.status === 'pending_verification') {
              await store.updateProfile(lnk.student_id, { status: 'active' });
            }
          }
          if (lnk.student_id === req.params.id && lnk.parent_id) {
            const par = await store.getProfileById(lnk.parent_id);
            if (par && par.status === 'pending_verification') {
              await store.updateProfile(lnk.parent_id, { status: 'active' });
            }
          }
        }
      } catch (linkErr) {
        console.warn('[User activation linked-family notice]:', linkErr.message);
      }
    }

    await store.logAudit({
      user_id: req.user.id,
      action: 'ADMIN_UPDATE_USER',
      entity_type: 'USER',
      entity_id: req.params.id,
      ip_address: getClientIp(req),
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
      ip_address: getClientIp(req),
      details: { email: user.email }
    });

    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    const [profiles, courses, classes, enrollments, attendance] = await Promise.all([
      store.getProfiles(),
      store.getCourses(),
      store.getClasses(),
      store.getEnrollments(),
      store.getAttendance()
    ]);

    const totalStudents = profiles.filter((p) => p.role === 'student').length;
    const totalTutors = profiles.filter((p) => p.role === 'tutor').length;
    const totalParents = profiles.filter((p) => p.role === 'parent').length;
    const totalCourses = courses.length;
    const activeClasses = classes.filter((c) => c.status === 'live').length;
    const scheduledClasses = classes.filter((c) => c.status === 'scheduled').length;

    const revenue = enrollments.reduce((sum, enr) => {
      const course = courses.find((c) => c.id === enr.course_id);
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
