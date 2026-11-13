import { store } from '../database/store.js';

export const getAssignments = async (req, res, next) => {
  try {
    const { course_id } = req.query;
    const assignments = await store.getAssignments(course_id);

    // If student is querying, optionally decorate with student's own submission status
    if (req.user && req.user.role === 'student') {
      const submissions = await store.getSubmissions({ student_id: req.user.id });
      const enriched = assignments.map(a => {
        const mySub = submissions.find(s => s.assignment_id === a.id);
        return {
          ...a,
          mySubmission: mySub || null,
          hasSubmitted: !!mySub,
          myScore: mySub ? mySub.score : null,
          myFeedback: mySub ? mySub.feedback : null
        };
      });
      return res.status(200).json({ success: true, assignments: enriched });
    }

    // If parent is querying, decorate with linked student's submissions
    if (req.user && req.user.role === 'parent') {
      const links = await store.getParentStudentLinks();
      const myStudentLinks = links.filter(l => l.parent_id === req.user.id);
      const studentIds = myStudentLinks.map(l => l.student_id);

      const allSubs = [];
      for (const sId of studentIds) {
        const subs = await store.getSubmissions({ student_id: sId });
        allSubs.push(...subs);
      }

      const enriched = assignments.map(a => {
        const childSubs = allSubs.filter(s => s.assignment_id === a.id);
        return {
          ...a,
          childSubmissions: childSubs
        };
      });
      return res.status(200).json({ success: true, assignments: enriched });
    }

    res.status(200).json({
      success: true,
      assignments
    });
  } catch (err) {
    next(err);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await store.getAssignmentById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    res.status(200).json({
      success: true,
      assignment
    });
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const { course_id, title, description, due_date, max_score, file_url } = req.body;

    if (!course_id || !title || !due_date) {
      return res.status(400).json({ success: false, message: 'Course, title, and due date are required.' });
    }

    const newAssignment = await store.createAssignment({
      course_id,
      tutor_id: req.user.id,
      title,
      description,
      due_date,
      max_score: max_score || 100,
      file_url
    });

    // Audit log
    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_CREATED',
      entity_type: 'ASSIGNMENT',
      entity_id: newAssignment.id,
      ip_address: req.ip || '127.0.0.1',
      details: { title, course_id, due_date }
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully. Both students and their parents have been notified via in-app alert and email.',
      assignment: newAssignment
    });
  } catch (err) {
    next(err);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const { assignment_id } = req.query;
    let student_id = req.query.student_id;

    if (req.user.role === 'student') {
      student_id = req.user.id;
    }

    const submissions = await store.getSubmissions({ assignment_id, student_id });

    res.status(200).json({
      success: true,
      submissions
    });
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params; // assignment_id
    const { submission_text, file_url } = req.body;

    if (!submission_text && !file_url) {
      return res.status(400).json({ success: false, message: 'Submission content or file attachment is required.' });
    }

    const submission = await store.submitAssignment({
      assignment_id: id,
      student_id: req.user.id,
      submission_text,
      file_url
    });

    // Audit log
    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_SUBMITTED',
      entity_type: 'ASSIGNMENT_SUBMISSION',
      entity_id: submission.id,
      ip_address: req.ip || '127.0.0.1',
      details: { assignment_id: id, student_id: req.user.id }
    });

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully!',
      submission
    });
  } catch (err) {
    next(err);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params; // submission_id
    const { score, feedback } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ success: false, message: 'Score is required.' });
    }

    const updatedSubmission = await store.gradeSubmission(id, {
      score,
      feedback,
      tutorId: req.user.id
    });

    // Audit log
    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_GRADED',
      entity_type: 'ASSIGNMENT_SUBMISSION',
      entity_id: id,
      ip_address: req.ip || '127.0.0.1',
      details: { score, submission_id: id }
    });

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully. Student and parents have been notified.',
      submission: updatedSubmission
    });
  } catch (err) {
    next(err);
  }
};

export const checkDeadlines = async (req, res, next) => {
  try {
    const remindersSent = await store.checkApproachingDeadlines();
    res.status(200).json({
      success: true,
      message: `Checked assignment deadlines. ${remindersSent.length} reminders dispatched.`,
      remindersSent
    });
  } catch (err) {
    next(err);
  }
};
