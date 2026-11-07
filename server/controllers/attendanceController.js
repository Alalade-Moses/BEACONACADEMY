import { store } from '../database/store.js';

export const getAttendanceRecords = async (req, res, next) => {
  try {
    const { class_id, user_id } = req.query;
    let records = await store.getAttendance();

    if (class_id) {
      records = records.filter(r => r.class_id === class_id);
    }
    if (user_id) {
      records = records.filter(r => r.user_id === user_id);
    } else if (req.user.role === 'student') {
      records = records.filter(r => r.user_id === req.user.id);
    }

    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
};

export const recordAttendance = async (req, res, next) => {
  try {
    const { class_id, duration_minutes = 60, status = 'present' } = req.body;
    const user_id = req.body.user_id || req.user.id;
    const role = req.body.role || req.user.role;

    if (!class_id) {
      return res.status(400).json({ success: false, message: 'Class ID is required.' });
    }

    const log = await store.logAttendance({
      class_id,
      user_id,
      role,
      duration_minutes: parseInt(duration_minutes, 10),
      status
    });

    res.status(201).json({ success: true, message: 'Attendance logged successfully.', record: log });
  } catch (err) {
    next(err);
  }
};
