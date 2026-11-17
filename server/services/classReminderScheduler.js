import { store } from '../database/store.js';
import { sendClassUpcomingReminderEmail } from './emailService.js';

// Set to track class IDs that have already received the 1-hour notification to prevent duplicate emails
const remindedClassIds = new Set();

/**
 * Checks for upcoming scheduled classes starting within 45 to 75 minutes (~1 hour)
 * and dispatches reminder emails to enrolled students and parents.
 */
export const checkAndDispatchUpcomingClassReminders = async () => {
  try {
    const classes = await store.getClasses();
    const now = Date.now();
    const windowStart = now + (45 * 60 * 1000); // 45 minutes ahead
    const windowEnd = now + (75 * 60 * 1000);   // 75 minutes ahead

    const upcomingClasses = classes.filter(c => {
      if (c.status !== 'scheduled') return false;
      if (remindedClassIds.has(c.id)) return false;

      const scheduledTime = new Date(c.scheduled_at).getTime();
      return scheduledTime >= windowStart && scheduledTime <= windowEnd;
    });

    if (upcomingClasses.length === 0) return;

    const allEnrollments = await store.getEnrollments();
    const allLinks = await store.getParentStudentLinks();

    for (const classItem of upcomingClasses) {
      remindedClassIds.add(classItem.id);

      const enrollments = allEnrollments.filter(e => e.course_id === classItem.course_id);
      const clientUrl = process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk';
      const roomUrl = `${clientUrl}/classroom/${classItem.id}`;

      console.log(`⏰ [ClassReminderScheduler] Triggering 1-hour reminder for class "${classItem.title}" (${enrollments.length} enrolled students).`);

      for (const enr of enrollments) {
        const student = enr.student_id ? await store.getProfileById(enr.student_id) : null;
        if (!student) continue;

        // Find linked parent
        const link = allLinks.find(l => l.student_id === student.id && l.status === 'active');
        const parent = link ? await store.getProfileById(link.parent_id) : null;

        // 1. Dispatch reminder to Student
        sendClassUpcomingReminderEmail({
          recipient: student,
          student,
          parent,
          tutor: classItem.tutor,
          classInfo: classItem,
          roomUrl
        }).catch(err => console.warn(`[Reminder Student Email Error] ${student.email}:`, err.message));

        // 2. Dispatch reminder to Parent (if available)
        if (parent && parent.email && parent.email !== student.email) {
          sendClassUpcomingReminderEmail({
            recipient: parent,
            student,
            parent,
            tutor: classItem.tutor,
            classInfo: classItem,
            roomUrl
          }).catch(err => console.warn(`[Reminder Parent Email Error] ${parent.email}:`, err.message));
        }

        // 3. Create In-App Notification for Student
        store.createNotification({
          user_id: student.id,
          title: 'Class Starting in 1 Hour',
          message: `Your live class "${classItem.title}" starts in approx. 60 minutes. Click to join the room.`,
          type: 'class_reminder',
          link: `/classroom/${classItem.id}`
        }).catch(() => {});

        // 4. Create In-App Notification for Parent (if available)
        if (parent) {
          store.createNotification({
            user_id: parent.id,
            title: `Class Reminder for ${student.full_name}`,
            message: `"${classItem.title}" begins in 1 hour.`,
            type: 'class_reminder',
            link: `/classroom/${classItem.id}`
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.warn('[ClassReminderScheduler Error]:', err.message);
  }
};

/**
 * Initializes recurring interval timer for class reminders.
 * Runs check every 5 minutes.
 */
export const startClassReminderScheduler = () => {
  // Run once on startup after 15 seconds
  setTimeout(() => {
    checkAndDispatchUpcomingClassReminders();
  }, 15000);

  // Then run every 5 minutes
  const intervalId = setInterval(() => {
    checkAndDispatchUpcomingClassReminders();
  }, 5 * 60 * 1000);

  return intervalId;
};
