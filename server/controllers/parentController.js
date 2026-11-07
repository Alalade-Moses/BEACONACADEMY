import { store } from '../database/store.js';

export const getMyChildren = async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const allLinks = await store.getParentStudentLinks();
    const myLinks = allLinks.filter(l => l.parent_id === parentId && l.status === 'active');

    // For each child, fetch enrolled courses, upcoming classes, and attendance summary
    const allEnrollments = await store.getEnrollments();
    const allClasses = await store.getClasses();
    const allAttendance = await store.getAttendance();

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

        return {
          link_id: link.id,
          relationship: link.relationship,
          student,
          enrollments,
          upcomingClasses,
          attendance
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
