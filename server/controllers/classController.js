import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, clampText, pickFields, isUuid } from '../utils/validators.js';

const CLASS_EDITABLE_FIELDS = [
  'course_id', 'title', 'description', 'scheduled_at',
  'duration_minutes', 'status', 'presentation_url', 'presentation_pages'
];
const VALID_CLASS_STATUSES = new Set(['scheduled', 'live', 'completed', 'cancelled']);

export const getAllClasses = async (req, res, next) => {
  try {
    const { status, course_id } = req.query;
    let classes = await store.getClasses();

    if (req.user.role === 'tutor') {
      classes = classes.filter((c) => c.tutor_id === req.user.id);
    } else if (req.user.role === 'student') {
      const enrollments = await store.getEnrollments();
      const studentCourseIds = enrollments
        .filter((e) => e.student_id === req.user.id)
        .map((e) => e.course_id);
      classes = classes.filter((c) => studentCourseIds.includes(c.course_id));
    }

    if (status && status !== 'all') {
      classes = classes.filter((c) => c.status === status);
    }
    if (course_id) {
      classes = classes.filter((c) => c.course_id === course_id);
    }

    classes.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    res.status(200).json({ success: true, count: classes.length, classes });
  } catch (err) {
    next(err);
  }
};

export const getClassById = async (req, res, next) => {
  try {
    const classItem = await store.getClassById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class session not found.' });
    }

    const allMaterials = await store.getMaterials();
    const classMaterials = allMaterials.filter(
      (m) => m.class_id === classItem.id || (classItem.course_id && m.course_id === classItem.course_id)
    );

    res.status(200).json({
      success: true,
      class: {
        ...classItem,
        materials: classMaterials
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const {
      course_id,
      title,
      description,
      scheduled_at,
      duration_minutes = 60,
      presentation_url,
      presentation_pages = 6,
      status = 'scheduled',
      isInstant = false
    } = req.body || {};

    if (presentation_url && !isSafeUrl(presentation_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid presentation URL.' });
    }

    const classTitle = clampText(title || '', 200) || `Live Teaching Session - ${new Date().toLocaleDateString('en-GB')}`;
    const scheduledTime = scheduled_at || new Date().toISOString();
    const classStatus = isInstant || status === 'live' ? 'live' : 'scheduled';
    const dur = Math.min(360, Math.max(15, parseInt(duration_minutes, 10) || 60));

    let resolvedCourseId = isUuid(course_id) ? course_id : null;
    if (!resolvedCourseId) {
      const allCourses = await store.getCourses();
      resolvedCourseId = allCourses[0]?.id || null;
    }

    const tutor_id = req.user.role === 'tutor'
      ? req.user.id
      : (isUuid(req.body.tutor_id) ? req.body.tutor_id : req.user.id);
    const meeting_room_id = `ROOM-${Date.now().toString(36).toUpperCase()}`;

    const newClass = await store.createClass({
      course_id: resolvedCourseId,
      tutor_id,
      title: classTitle,
      description: clampText(description || 'Interactive live classroom with synchronized presentation deck and digital whiteboard.', 1500),
      scheduled_at: scheduledTime,
      duration_minutes: dur,
      meeting_room_id,
      presentation_url: presentation_url || '/slides/sample-presentation.pdf',
      presentation_pages: Math.min(200, Math.max(1, parseInt(presentation_pages, 10) || 6)),
      status: classStatus
    });

    if (resolvedCourseId) {
      const enrollments = await store.getEnrollments();
      const enrolledStudents = enrollments.filter((e) => e.course_id === resolvedCourseId);

      for (const enr of enrolledStudents) {
        await store.createNotification({
          user_id: enr.student_id,
          title: 'New Class Scheduled',
          message: `Your tutor scheduled "${classTitle}" on ${new Date(scheduledTime).toLocaleDateString()}.`,
          type: 'class',
          link: `/classroom/${newClass.meeting_room_id}`
        });
      }
    }

    await store.logAudit({
      user_id: req.user.id,
      action: 'SCHEDULE_CLASS',
      entity_type: 'CLASS',
      entity_id: newClass.id,
      ip_address: getClientIp(req),
      details: { title: newClass.title, room: newClass.meeting_room_id }
    });

    res.status(201).json({ success: true, message: 'Class scheduled successfully.', class: newClass });
  } catch (err) {
    next(err);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const classItem = await store.getClassById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found.' });
    }

    if (req.user.role === 'tutor' && classItem.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update your own classes.' });
    }

    const updates = pickFields(req.body, CLASS_EDITABLE_FIELDS);
    if (updates.status && !VALID_CLASS_STATUSES.has(updates.status)) {
      return res.status(400).json({ success: false, message: 'Invalid class status.' });
    }
    if (updates.presentation_url && !isSafeUrl(updates.presentation_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid presentation URL.' });
    }
    if (updates.title) updates.title = clampText(updates.title, 200);
    if (updates.description) updates.description = clampText(updates.description, 1500);

    const updated = await store.updateClass(classItem.id, updates);
    res.status(200).json({ success: true, message: 'Class updated successfully.', class: updated });
  } catch (err) {
    next(err);
  }
};

export const startClass = async (req, res, next) => {
  try {
    const classItem = await store.getClassById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found.' });
    }

    if (req.user.role === 'tutor' && classItem.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the assigned tutor can start this class.' });
    }

    const updated = await store.updateClass(classItem.id, { status: 'live' });

    const enrollments = await store.getEnrollments();
    const enrolledStudents = enrollments.filter((e) => e.course_id === classItem.course_id);
    for (const enr of enrolledStudents) {
      await store.createNotification({
        user_id: enr.student_id,
        title: 'Class is LIVE Now!',
        message: `"${classItem.title}" has started. Click to join the live classroom.`,
        type: 'class',
        link: `/classroom/${classItem.meeting_room_id}`
      });
    }

    res.status(200).json({ success: true, message: 'Class is now LIVE.', class: updated });
  } catch (err) {
    next(err);
  }
};

export const endClass = async (req, res, next) => {
  try {
    const classItem = await store.getClassById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'Class not found.' });
    }

    if (req.user.role === 'tutor' && classItem.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the assigned tutor can conclude this class.' });
    }

    const updated = await store.updateClass(classItem.id, { status: 'completed' });
    res.status(200).json({ success: true, message: 'Class concluded successfully.', class: updated });
  } catch (err) {
    next(err);
  }
};
