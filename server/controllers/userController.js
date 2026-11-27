import bcrypt from 'bcryptjs';
import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isAllowedGmail, normalizeEmail, validatePassword, clampText, isUuid } from '../utils/validators.js';

const VALID_ROLES = new Set(['superadmin', 'admin', 'tutor', 'student', 'parent']);
const VALID_STATUSES = new Set(['active', 'suspended', 'pending', 'pending_verification']);

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, includeAssignments } = req.query;
    let users = await store.getProfiles();

    // Tutors may only see students explicitly assigned to them
    if (req.user.role === 'tutor') {
      const assignedIds = new Set(await store.getAssignedStudentIdsForTutor(req.user.id));
      users = users.filter((u) => u.role === 'student' && assignedIds.has(u.id));
    }

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

    let sanitized = users.map(({ password_hash, ...rest }) => rest);

    // Enrich with real enrollment & tutor-student assignment data for Superadmin
    if (req.user.role === 'superadmin' && includeAssignments === 'true') {
      const [allEnrollments, allLinks] = await Promise.all([
        store.getEnrollments(),
        store.getTutorStudentLinks()
      ]);

      sanitized = sanitized.map((u) => {
        if (u.role === 'student') {
          const studentEnrollments = allEnrollments.filter((e) => e.student_id === u.id);
          const tutorLinks = allLinks.filter((l) => l.student_id === u.id);
          return {
            ...u,
            enrollments: studentEnrollments,
            tutor_links: tutorLinks
          };
        }
        if (u.role === 'tutor') {
          const assignedLinks = allLinks.filter((l) => l.tutor_id === u.id);
          return {
            ...u,
            assigned_students: assignedLinks,
            assigned_students_count: new Set(assignedLinks.map((l) => l.student_id)).size
          };
        }
        return u;
      });
    }

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

    const isSuperadmin = req.user.role === 'superadmin';
    const isSelf = req.user.id === targetId;

    if (!isSuperadmin && !isSelf) {
      let authorized = false;
      if (req.user.role === 'parent') {
        const links = await store.getParentStudentLinks();
        authorized = links.some((l) => l.parent_id === req.user.id && l.student_id === targetId);
      } else if (req.user.role === 'tutor') {
        const assignedStudentIds = await store.getAssignedStudentIdsForTutor(req.user.id);
        authorized = assignedStudentIds.includes(targetId);
      } else if (req.user.role === 'student') {
        const assignedTutorIds = await store.getAssignedTutorIdsForStudent(req.user.id);
        authorized = assignedTutorIds.includes(targetId);
      }

      if (!authorized) {
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
    if (!isAllowedGmail(email, { allowOfficialStaff: true })) {
      return res.status(400).json({
        success: false,
        message: 'Only valid @gmail.com email addresses (or @beaconbridgeacademics.co.uk staff emails) are allowed.'
      });
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

// ----------------------------
// TUTOR-STUDENT ASSIGNMENTS
// ----------------------------
export const getTutorAssignments = async (req, res, next) => {
  try {
    let links = [];

    if (req.user.role === 'superadmin') {
      links = await store.getTutorStudentLinks({
        tutor_id: req.query.tutor_id,
        student_id: req.query.student_id,
        course_id: req.query.course_id
      });
    } else if (req.user.role === 'tutor') {
      links = await store.getTutorStudentLinks({ tutor_id: req.user.id });
    } else if (req.user.role === 'student') {
      links = await store.getTutorStudentLinks({ student_id: req.user.id });
    } else if (req.user.role === 'parent') {
      const parentLinks = await store.getParentStudentLinks();
      const childIds = new Set(
        parentLinks.filter((l) => l.parent_id === req.user.id && l.status === 'active').map((l) => l.student_id)
      );
      const all = await store.getTutorStudentLinks();
      links = all.filter((l) => childIds.has(l.student_id));
    }

    res.status(200).json({ success: true, count: links.length, assignments: links });
  } catch (err) {
    next(err);
  }
};

export const assignTutorToStudent = async (req, res, next) => {
  try {
    const { tutor_id, student_id, course_id } = req.body || {};
    if (!isUuid(tutor_id) || !isUuid(student_id)) {
      return res.status(400).json({ success: false, message: 'Please select a valid Tutor and Student.' });
    }
    if (course_id && !isUuid(course_id)) {
      return res.status(400).json({ success: false, message: 'Invalid course identifier.' });
    }

    const assignment = await store.assignTutorToStudent({
      tutor_id,
      student_id,
      course_id: course_id || null,
      assigned_by: req.user.id
    });

    // Notify student and tutor in real time via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${student_id}`).emit('tutor_assigned', {
        tutor: assignment.tutor,
        course: assignment.course
      });
      io.to(`user:${tutor_id}`).emit('student_assigned', {
        student: assignment.student,
        course: assignment.course
      });
    }

    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGN_TUTOR_TO_STUDENT',
      entity_type: 'TUTOR_STUDENT_LINK',
      entity_id: assignment.id,
      ip_address: getClientIp(req),
      details: {
        tutor_id,
        tutor_name: assignment.tutor?.full_name,
        student_id,
        student_name: assignment.student?.full_name,
        course_id: assignment.course_id || null
      }
    });

    res.status(201).json({
      success: true,
      message: `${assignment.tutor?.full_name} has been assigned to ${assignment.student?.full_name}.`,
      assignment
    });
  } catch (err) {
    next(err);
  }
};

export const unassignTutorFromStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid assignment ID.' });
    }

    const removed = await store.unassignTutorFromStudent(id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Tutor assignment not found.' });
    }

    await store.logAudit({
      user_id: req.user.id,
      action: 'UNASSIGN_TUTOR_FROM_STUDENT',
      entity_type: 'TUTOR_STUDENT_LINK',
      entity_id: id,
      ip_address: getClientIp(req),
      details: { tutor_id: removed.tutor_id, student_id: removed.student_id, course_id: removed.course_id }
    });

    res.status(200).json({ success: true, message: 'Tutor unassigned successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    const [profiles, courses, classes, enrollments, attendance, payments, tutorLinks] = await Promise.all([
      store.getProfiles(),
      store.getCourses(),
      store.getClasses(),
      store.getEnrollments(),
      store.getAttendance(),
      store.getPayments(),
      store.getTutorStudentLinks()
    ]);

    const students = profiles.filter((p) => p.role === 'student');
    const totalStudents = students.length;
    const totalTutors = profiles.filter((p) => p.role === 'tutor').length;
    const totalParents = profiles.filter((p) => p.role === 'parent').length;
    const totalCourses = courses.length;
    const activeClasses = classes.filter((c) => c.status === 'live').length;
    const scheduledClasses = classes.filter((c) => c.status === 'scheduled').length;

    const assignedStudentIds = new Set(tutorLinks.map((l) => l.student_id));
    const unassignedStudents = students.filter((s) => s.status === 'active' && !assignedStudentIds.has(s.id)).length;

    // Real verified revenue from confirmed tuition payments ONLY
    const revenue = payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
        unassignedStudents,
        revenue
      }
    });
  } catch (err) {
    next(err);
  }
};
