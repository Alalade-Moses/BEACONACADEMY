import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, clampText, pickFields, isUuid } from '../utils/validators.js';
import { sendClassScheduledEmail, sendClassLiveNowEmail } from '../services/emailService.js';

const CLASS_EDITABLE_FIELDS = [
  'course_id', 'title', 'description', 'scheduled_at',
  'duration_minutes', 'status', 'presentation_url', 'presentation_pages'
];
const VALID_CLASS_STATUSES = new Set(['scheduled', 'live', 'completed', 'cancelled']);

// Helper: notify ONLY students explicitly linked/assigned to this tutor (and their linked parents)
const notifyAssignedStudentsForClass = async ({ io, classItem, tutor, eventType }) => {
  const assignedStudentIds = await store.getAssignedStudentIdsForTutor(classItem.tutor_id, classItem.course_id);
  if (assignedStudentIds.length === 0) return [];

  const allParentLinks = await store.getParentStudentLinks();
  const tutorName = tutor?.full_name || classItem.tutor?.full_name || 'Your Tutor';
  const isLive = eventType === 'live';

  for (const studentId of assignedStudentIds) {
    const student = await store.getProfileById(studentId);
    if (!student || student.status !== 'active') continue;

    await store.createNotification({
      user_id: studentId,
      title: isLive ? `Live Class Started by ${tutorName}` : `New Class Scheduled by ${tutorName}`,
      message: isLive
        ? `${tutorName} has started "${classItem.title}". Click to join the live classroom now.`
        : `${tutorName} scheduled "${classItem.title}" for ${new Date(classItem.scheduled_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.`,
      type: 'class',
      link: isLive ? `/classroom/${classItem.meeting_room_id}?as=student` : '/student/classes'
    });

    if (io) {
      io.to(`user:${studentId}`).emit(isLive ? 'live_class_started' : 'class_scheduled', {
        class: {
          ...classItem,
          tutor: tutor || classItem.tutor || null
        }
      });
    }

    // Send automatic email to the assigned Student
    if (student.email) {
      const studentEmailFn = isLive ? sendClassLiveNowEmail : sendClassScheduledEmail;
      studentEmailFn({
        recipient: student,
        recipientRole: 'student',
        student,
        tutor: tutor || classItem.tutor,
        classInfo: classItem
      }).catch((err) => console.warn(`[Class Email -> Student Error] ${student.email}:`, err.message));
    }

    // Also notify & email ALL linked parents of this student
    const linkedParents = allParentLinks.filter((l) => l.student_id === studentId && l.status === 'active');
    for (const pLink of linkedParents) {
      await store.createNotification({
        user_id: pLink.parent_id,
        title: isLive
          ? `${student.full_name}'s Class is Live Now`
          : `New Class Scheduled for ${student.full_name}`,
        message: isLive
          ? `${tutorName} has started "${classItem.title}" with ${student.full_name}.`
          : `${tutorName} scheduled "${classItem.title}" for ${student.full_name} on ${new Date(classItem.scheduled_at).toLocaleDateString('en-GB')}.`,
        type: 'class',
        link: '/parent/dashboard'
      });

      if (io) {
        io.to(`user:${pLink.parent_id}`).emit(isLive ? 'live_class_started' : 'class_scheduled', {
          student_id: studentId,
          class: {
            ...classItem,
            tutor: tutor || classItem.tutor || null
          }
        });
      }

      const parentProfile = pLink.parent || (await store.getProfileById(pLink.parent_id));
      if (
        parentProfile?.email &&
        parentProfile.email.toLowerCase() !== (student.email || '').toLowerCase()
      ) {
        const parentEmailFn = isLive ? sendClassLiveNowEmail : sendClassScheduledEmail;
        parentEmailFn({
          recipient: parentProfile,
          recipientRole: 'parent',
          student,
          tutor: tutor || classItem.tutor,
          classInfo: classItem
        }).catch((err) => console.warn(`[Class Email -> Parent Error] ${parentProfile.email}:`, err.message));
      }
    }
  }

  return assignedStudentIds;
};

export const getAllClasses = async (req, res, next) => {
  try {
    const { status, course_id } = req.query;
    let classes = await store.getClasses();

    // Never expose classes hosted by non-tutors (e.g. legacy admin records)
    classes = classes.filter((c) => c.tutor?.role === 'tutor');

    if (req.user.role === 'tutor') {
      classes = classes.filter((c) => c.tutor_id === req.user.id);
    } else if (req.user.role === 'student') {
      const [enrollments, assignedTutorIds] = await Promise.all([
        store.getEnrollments(),
        store.getAssignedTutorIdsForStudent(req.user.id)
      ]);
      const studentCourseIds = new Set(
        enrollments.filter((e) => e.student_id === req.user.id).map((e) => e.course_id)
      );
      const assignedTutors = new Set(assignedTutorIds);

      // Student ONLY sees classes hosted by a tutor assigned to them AND for their enrolled course(s)
      classes = classes.filter(
        (c) =>
          assignedTutors.has(c.tutor_id) &&
          (!c.course_id || studentCourseIds.has(c.course_id))
      );
    } else if (req.user.role === 'parent') {
      const [parentLinks, allEnrollments] = await Promise.all([
        store.getParentStudentLinks(),
        store.getEnrollments()
      ]);
      const childIds = parentLinks
        .filter((l) => l.parent_id === req.user.id && l.status === 'active')
        .map((l) => l.student_id);

      const allowedPairs = [];
      for (const childId of childIds) {
        const childCourseIds = new Set(
          allEnrollments.filter((e) => e.student_id === childId).map((e) => e.course_id)
        );
        const childTutorIds = new Set(await store.getAssignedTutorIdsForStudent(childId));
        allowedPairs.push({ childCourseIds, childTutorIds });
      }

      classes = classes.filter((c) =>
        allowedPairs.some(
          ({ childCourseIds, childTutorIds }) =>
            childTutorIds.has(c.tutor_id) && (!c.course_id || childCourseIds.has(c.course_id))
        )
      );
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

    // Strict RBAC / Relationship check: students can only access classes from their assigned tutor
    if (req.user.role === 'tutor' && classItem.tutor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: This class belongs to another tutor.' });
    }
    if (req.user.role === 'student') {
      const assignedTutorIds = await store.getAssignedTutorIdsForStudent(req.user.id, classItem.course_id);
      if (!assignedTutorIds.includes(classItem.tutor_id)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only join live classes started by your assigned tutor.'
        });
      }
    }

    const allMaterials = await store.getMaterials();
    const classMaterials = allMaterials.filter(
      (m) =>
        m.class_id === classItem.id ||
        (classItem.course_id && m.course_id === classItem.course_id && m.uploader_id === classItem.tutor_id)
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
    // Only Tutor accounts host live classes (prevents "Admin wants to start live class")
    if (req.user.role !== 'tutor') {
      return res.status(403).json({
        success: false,
        message: 'Only assigned Tutors can create or start live classes. Assign a Tutor to students from User Management first.'
      });
    }

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

    const tutor_id = req.user.id;
    const resolvedCourseId = isUuid(course_id) ? course_id : null;

    // Verify this tutor actually has assigned students (optionally for this course)
    const assignedStudents = await store.getAssignedStudentIdsForTutor(tutor_id, resolvedCourseId);
    if (assignedStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: resolvedCourseId
          ? 'No students are assigned to you for this course yet. Ask the Superadmin to assign your students before starting a class.'
          : 'No students have been assigned to you yet. Once the Superadmin assigns students to you, you can schedule and launch live classes.'
      });
    }

    const classTitle = clampText(title || '', 200) || `Live Lesson with ${req.user.full_name}`;
    const scheduledTime = scheduled_at || new Date().toISOString();
    const classStatus = isInstant || status === 'live' ? 'live' : 'scheduled';
    const dur = Math.min(360, Math.max(15, parseInt(duration_minutes, 10) || 60));
    const meeting_room_id = `ROOM-${Date.now().toString(36).toUpperCase()}`;

    const created = await store.createClass({
      course_id: resolvedCourseId,
      tutor_id,
      title: classTitle,
      description: clampText(description || 'Interactive live classroom session.', 1500),
      scheduled_at: scheduledTime,
      duration_minutes: dur,
      meeting_room_id,
      presentation_url: presentation_url || '',
      presentation_pages: Math.min(200, Math.max(1, parseInt(presentation_pages, 10) || 1)),
      status: classStatus
    });

    const enrichedClass = (await store.getClassById(created.id)) || created;
    const notifiedIds = await notifyAssignedStudentsForClass({
      io: req.app.get('io'),
      classItem: enrichedClass,
      tutor: req.user,
      eventType: classStatus === 'live' ? 'live' : 'scheduled'
    });

    await store.logAudit({
      user_id: req.user.id,
      action: classStatus === 'live' ? 'LAUNCH_LIVE_CLASS' : 'SCHEDULE_CLASS',
      entity_type: 'CLASS',
      entity_id: created.id,
      ip_address: getClientIp(req),
      details: {
        title: created.title,
        room: created.meeting_room_id,
        notified_students: notifiedIds.length
      }
    });

    res.status(201).json({
      success: true,
      message: classStatus === 'live'
        ? `Live class launched! ${notifiedIds.length} assigned student(s) notified.`
        : `Class scheduled! ${notifiedIds.length} assigned student(s) notified.`,
      class: enrichedClass,
      notifiedCount: notifiedIds.length
    });
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

    if (req.user.role !== 'tutor' || classItem.tutor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned Tutor who created this class can start the live session.'
      });
    }

    await store.updateClass(classItem.id, { status: 'live' });
    const updated = (await store.getClassById(classItem.id)) || { ...classItem, status: 'live' };

    const notifiedIds = await notifyAssignedStudentsForClass({
      io: req.app.get('io'),
      classItem: updated,
      tutor: req.user,
      eventType: 'live'
    });

    res.status(200).json({
      success: true,
      message: `Class is now LIVE. ${notifiedIds.length} assigned student(s) notified.`,
      class: updated,
      notifiedCount: notifiedIds.length
    });
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

    // Notify connected linked students so their dashboard live banner clears immediately
    const io = req.app.get('io');
    if (io) {
      const assignedStudentIds = await store.getAssignedStudentIdsForTutor(classItem.tutor_id, classItem.course_id);
      for (const studentId of assignedStudentIds) {
        io.to(`user:${studentId}`).emit('live_class_ended', {
          classId: classItem.id,
          meeting_room_id: classItem.meeting_room_id
        });
      }
    }

    res.status(200).json({ success: true, message: 'Class concluded successfully.', class: updated });
  } catch (err) {
    next(err);
  }
};
