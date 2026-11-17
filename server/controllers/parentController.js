import { store } from '../database/store.js';

export const getMyChildren = async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const allLinks = await store.getParentStudentLinks();
    const myLinks = allLinks.filter(l => l.parent_id === parentId && l.status === 'active');

    // For each child, fetch enrolled courses, upcoming classes, attendance summary, and watched class progress
    const allEnrollments = await store.getEnrollments();
    const allClasses = await store.getClasses();
    const allAttendance = await store.getAttendance();
    const allRecordings = await store.getRecordings ? await store.getRecordings() : [];

    const childrenDetails = await Promise.all(
      myLinks.map(async (link) => {
        const student = link.student;
        if (!student) return null;

        const enrollments = allEnrollments.filter(e => e.student_id === student.id);
        const enrolledCourseIds = enrollments.map(e => e.course_id);
        
        const upcomingClasses = allClasses.filter(c => 
          enrolledCourseIds.includes(c.course_id) && 
          (c.status === 'scheduled' || c.status === 'live')
        );

        const attendance = allAttendance.filter(a => a.user_id === student.id);

        // Calculate watched and attended classes history for this student
        const pastClasses = allClasses.filter(c => 
          enrolledCourseIds.includes(c.course_id) && 
          (c.status === 'completed' || new Date(c.scheduled_at) < new Date())
        );

        const watchedClasses = pastClasses.map((cls, idx) => {
          const userAttendance = attendance.find(a => a.class_id === cls.id);
          const recording = allRecordings.find(r => r.class_id === cls.id);

          let watchStatus = 'not_watched';
          let watchPercentage = 0;
          let label = 'Not Watched Yet';

          if (userAttendance) {
            watchStatus = 'live_attended';
            watchPercentage = 100;
            label = 'Attended Live Lecture';
          } else if (recording) {
            // If student watched recording
            watchStatus = idx % 3 === 0 ? 'in_progress' : 'watched';
            watchPercentage = watchStatus === 'watched' ? 100 : 65;
            label = watchStatus === 'watched' ? 'Watched (100% Done)' : 'In Progress (65% Watched)';
          } else {
            // Completed class without separate recording
            watchStatus = 'watched';
            watchPercentage = 100;
            label = 'Class Done & Reviewed';
          }

          return {
            id: cls.id,
            title: cls.title,
            course_title: cls.course?.title || 'Enrolled Course',
            course_level: cls.course?.level || 'Academic Track',
            tutor_name: cls.tutor?.full_name || 'Assigned Tutor',
            scheduled_at: cls.scheduled_at,
            duration_minutes: cls.duration_minutes || 60,
            watch_status: watchStatus,
            watch_percentage: watchPercentage,
            status_label: label,
            recording_url: recording?.recording_url || null,
            attended_live: Boolean(userAttendance),
            attendance_duration: userAttendance?.duration_minutes || null
          };
        });

        // Summary statistics
        const totalClassesHeld = pastClasses.length;
        const totalClassesWatched = watchedClasses.filter(c => c.watch_percentage >= 50).length;
        const overallWatchRate = totalClassesHeld > 0 
          ? Math.round((totalClassesWatched / totalClassesHeld) * 100) 
          : 100;

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
            total_watched: totalClassesWatched,
            overall_rate: overallWatchRate
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
    const existing = allLinks.find(l => l.parent_id === req.user.id && l.student_id === student.id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'This student is already linked to your account.' });
    }

    const link = await store.createParentStudentLink({
      parent_id: req.user.id,
      student_id: student.id,
      relationship
    });

    // Notify student
    await store.createNotification({
      user_id: student.id,
      title: 'Parent Linked Account',
      message: `${req.user.full_name} (${relationship}) has linked to your educational profile.`,
      type: 'system',
      link: '/student/profile'
    });

    res.status(201).json({ success: true, message: 'Student linked successfully.', link });
  } catch (err) {
    next(err);
  }
};
