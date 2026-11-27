import { store } from '../database/store.js';
import { isUuid } from '../utils/validators.js';

const VALID_ATTENDANCE_STATUSES = new Set(['present', 'late', 'absent']);

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const { class_id, user_id } = req.query;
    let records = await store.getAttendance();

    if (class_id) {
      records = records.filter((r) => r.class_id === class_id);
    }

    // Zero-trust IDOR defense: enforce role scoping BEFORE applying user_id query filter
    if (req.user.role === 'student') {
      records = records.filter((r) => r.user_id === req.user.id);
    } else if (req.user.role === 'parent') {
      const links = await store.getParentStudentLinks();
      const childIds = new Set(links.filter((l) => l.parent_id === req.user.id).map((l) => l.student_id));
      records = records.filter((r) => childIds.has(r.user_id));
      if (user_id) records = records.filter((r) => r.user_id === user_id);
    } else if (user_id) {
      records = records.filter((r) => r.user_id === user_id);
    }

    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
};

export const recordAttendance = async (req, res, next) => {
  try {
    const { class_id, duration_minutes = 60, status = 'present' } = req.body || {};

    if (!class_id || !isUuid(class_id)) {
      return res.status(400).json({ success: false, message: 'Valid Class ID is required.' });
    }
    if (!VALID_ATTENDANCE_STATUSES.has(status)) {
      return res.status(400).json({ success: false, message: 'Invalid attendance status.' });
    }

    // Only tutors and superadmins may record attendance for another user
    const isElevated = req.user.role === 'superadmin' || req.user.role === 'tutor';
    const user_id = isElevated && isUuid(req.body.user_id) ? req.body.user_id : req.user.id;
    const role = isElevated && req.body.role ? req.body.role : req.user.role;
    const dur = Math.min(480, Math.max(0, parseInt(duration_minutes, 10) || 0));

    const log = await store.logAttendance({
      class_id,
      user_id,
      role,
      duration_minutes: dur,
      status
    });

    res.status(201).json({ success: true, message: 'Attendance logged successfully.', record: log });
  } catch (err) {
    next(err);
  }
};
