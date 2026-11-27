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

    const allLinks = await store.getParentStudentLinks();

    for (const classItem of upcomingClasses) {
      remindedClassIds.add(classItem.id);

      const assignedStudentIds = await store.getAssignedStudentIdsForTutor(classItem.tutor_id, classItem.course_id);
      const clientUrl = process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk';
      const roomUrl = `${clientUrl}/classroom/${classItem.meeting_room_id}?as=student`;

      console.log(`⏰ [ClassReminderScheduler] Triggering 1-hour reminder for class "${classItem.title}" (${assignedStudentIds.length} assigned students).`);

      for (const studentId of assignedStudentIds) {
        const student = await store.getProfileById(studentId);
        if (!student || student.status !== 'active') continue;

        // Find all active linked parents for this student
        const studentParentLinks = allLinks.filter(l => l.student_id === student.id && l.status === 'active');
        const firstParent = studentParentLinks[0] ? await store.getProfileById(studentParentLinks[0].parent_id) : null;

        // 1. Dispatch 1-hour reminder email to Student
        sendClassUpcomingReminderEmail({
          recipient: student,
          recipientRole: 'student',
          student,
          parent: firstParent,
          tutor: classItem.tutor,
          classInfo: classItem,
          roomUrl
        }).catch(err => console.warn(`[Reminder Student Email Error] ${student.email}:`, err.message));

        // 2. Dispatch 1-hour reminder email & notification to ALL Linked Parents
        for (const pLink of studentParentLinks) {
          const parent = pLink.parent || (await store.getProfileById(pLink.parent_id));
          if (!parent) continue;

          if (parent.email && parent.email.toLowerCase() !== (student.email || '').toLowerCase()) {
            sendClassUpcomingReminderEmail({
              recipient: parent,
              recipientRole: 'parent',
              student,
              parent,
              tutor: classItem.tutor,
              classInfo: classItem,
              roomUrl: `${clientUrl}/parent/dashboard`
            }).catch(err => console.warn(`[Reminder Parent Email Error] ${parent.email}:`, err.message));
          }

          store.createNotification({
            user_id: parent.id,
            title: `Class Reminder for ${student.full_name}`,
            message: `"${classItem.title}" begins in 1 hour.`,
            type: 'class_reminder',
            link: '/parent/dashboard'
          }).catch(() => {});
        }

        // 3. Create In-App Notification for Student
        store.createNotification({
          user_id: student.id,
          title: 'Class Starting in 1 Hour',
          message: `Your live class "${classItem.title}" starts in approx. 60 minutes. Click to join the room.`,
          type: 'class_reminder',
          link: `/classroom/${classItem.meeting_room_id}?as=student`
        }).catch(() => {});
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
