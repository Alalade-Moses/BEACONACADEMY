import { store } from '../database/store.js';

export const getMyChildren = async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const allLinks = await store.getParentStudentLinks();
    const myLinks = allLinks.filter((l) => l.parent_id === parentId && l.status === 'active');

    const [allEnrollments, allClasses, allAttendance, allRecordings] = await Promise.all([
      store.getEnrollments(),
      store.getClasses(),
      store.getAttendance(),
      store.getRecordings()
    ]);

    const realTutorClasses = allClasses.filter((c) => c.tutor?.role === 'tutor');

    const childrenDetails = await Promise.all(
      myLinks.map(async (link) => {
        const student = link.student;
        if (!student) return null;

        const enrollments = allEnrollments.filter((e) => e.student_id === student.id);
        const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));
        const assignedTutorIds = new Set(await store.getAssignedTutorIdsForStudent(student.id));

        // Only classes taught by this child's assigned tutor(s) for their enrolled course(s)
        const studentClasses = realTutorClasses.filter(
          (c) =>
            assignedTutorIds.has(c.tutor_id) &&
            (!c.course_id || enrolledCourseIds.has(c.course_id))
        );

        const upcomingClasses = studentClasses.filter(
          (c) => c.status === 'scheduled' || c.status === 'live'
        );

        const attendance = allAttendance.filter((a) => a.user_id === student.id);

        // Strictly completed sessions — zero fabricated watch percentages
        const pastClasses = studentClasses.filter((c) => c.status === 'completed');

        const watchedClasses = pastClasses.map((cls) => {
          const userAttendance = attendance.find((a) => a.class_id === cls.id);
          const recording = allRecordings.find((r) => r.class_id === cls.id);

          const attendedLive = Boolean(userAttendance);

          return {
            id: cls.id,
            title: cls.title,
            course_title: cls.course?.title || 'Enrolled Course',
            course_level: cls.course?.level || '',
            tutor_name: cls.tutor?.full_name || 'Unassigned',
            scheduled_at: cls.scheduled_at,
            duration_minutes: cls.duration_minutes || 0,
            watch_status: attendedLive ? 'live_attended' : 'not_attended',
            watch_percentage: attendedLive ? 100 : 0,
            status_label: attendedLive
              ? 'Attended Live Class'
              : (recording ? 'Missed Live — Recording Available' : 'Did Not Attend'),
            recording_url: recording?.recording_url || null,
            attended_live: attendedLive,
            attendance_duration: userAttendance?.duration_minutes ?? null
          };
        });

        const totalClassesHeld = pastClasses.length;
        const totalClassesAttended = watchedClasses.filter((c) => c.attended_live).length;
        const overallAttendanceRate = totalClassesHeld > 0
          ? Math.round((totalClassesAttended / totalClassesHeld) * 100)
          : null;

        return {
          link_id: link.id,
          relationship: link.relationship,
          student,
          enrollments,
          upcomingClasses,
          attendance,
          watchedClasses,
          watch_stats: {
            total_held: totalClassesHeld,
            total_watched: totalClassesAttended,
            overall_rate: overallAttendanceRate
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      children: childrenDetails.filter(Boolean)
    });
  } catch (err) {
    next(err);
  }
};

export const linkChild = async (req, res, next) => {
  try {
    const { student_email, relationship = 'Parent' } = req.body;
    if (!student_email) {
      return res.status(400).json({ success: false, message: 'Student email is required to link an account.' });
    }

    const student = await store.getProfileByEmail(student_email);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'No student account found with this email address.' });
    }

    const allLinks = await store.getParentStudentLinks();
    const existing = allLinks.find((l) => l.parent_id === req.user.id && l.student_id === student.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'This student is already linked to your account.' });
    }

    const link = await store.createParentStudentLink({
      parent_id: req.user.id,
      student_id: student.id,
      relationship
    });

    await store.createNotification({
      user_id: student.id,
      title: 'Parent Linked Account',
      message: `${req.user.full_name} (${relationship}) has linked to your educational profile.`,
      type: 'system',
      link: '/student/dashboard'
    });

    res.status(201).json({ success: true, message: 'Student linked successfully.', link });
  } catch (err) {
    next(err);
  }
};
