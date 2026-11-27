import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, clampText, isUuid } from '../utils/validators.js';

export const getAssignments = async (req, res, next) => {
  try {
    const { course_id } = req.query;
    const assignments = await store.getAssignments(course_id);

    if (req.user && req.user.role === 'student') {
      const submissions = await store.getSubmissions({ student_id: req.user.id });
      const enriched = assignments.map((a) => {
        const mySub = submissions.find((s) => s.assignment_id === a.id);
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

    if (req.user && req.user.role === 'parent') {
      const links = await store.getParentStudentLinks();
      const myStudentLinks = links.filter((l) => l.parent_id === req.user.id);
      const studentIds = myStudentLinks.map((l) => l.student_id);

      const allSubs = [];
      for (const sId of studentIds) {
        const subs = await store.getSubmissions({ student_id: sId });
        allSubs.push(...subs);
      }

      const enriched = assignments.map((a) => ({
        ...a,
        childSubmissions: allSubs.filter((s) => s.assignment_id === a.id)
      }));
      return res.status(200).json({ success: true, assignments: enriched });
    }

    res.status(200).json({ success: true, assignments });
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

    // Zero-trust IDOR defense: students only see their own submissions; parents only see their linked children's submissions
    let filteredSubmissions = assignment.submissions || [];
    if (req.user.role === 'student') {
      filteredSubmissions = filteredSubmissions.filter((s) => s.student_id === req.user.id);
    } else if (req.user.role === 'parent') {
      const links = await store.getParentStudentLinks();
      const childIds = new Set(links.filter((l) => l.parent_id === req.user.id).map((l) => l.student_id));
      filteredSubmissions = filteredSubmissions.filter((s) => childIds.has(s.student_id));
    }

    res.status(200).json({
      success: true,
      assignment: {
        ...assignment,
        submissions: filteredSubmissions
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const { course_id, title, description, due_date, max_score, file_url } = req.body || {};

    if (!course_id || !isUuid(course_id) || !title || !due_date) {
      return res.status(400).json({ success: false, message: 'Valid course, title, and due date are required.' });
    }
    if (file_url && !isSafeUrl(file_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid assignment attachment URL.' });
    }
    const maxScoreNum = Math.min(1000, Math.max(1, parseInt(max_score, 10) || 100));

    const newAssignment = await store.createAssignment({
      course_id,
      tutor_id: req.user.id,
      title: clampText(title, 200),
      description: clampText(description || '', 4000),
      due_date,
      max_score: maxScoreNum,
      file_url: file_url ? String(file_url).trim() : ''
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_CREATED',
      entity_type: 'ASSIGNMENT',
      entity_id: newAssignment.id,
      ip_address: getClientIp(req),
      details: { title: newAssignment.title, course_id, due_date }
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully. Enrolled students and parents have been notified.',
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
    } else if (req.user.role === 'parent') {
      const links = await store.getParentStudentLinks();
      const childIds = new Set(links.filter((l) => l.parent_id === req.user.id).map((l) => l.student_id));
      if (student_id && !childIds.has(student_id)) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only view submissions for your linked children.' });
      }
      const allSubs = await store.getSubmissions({ assignment_id, student_id });
      return res.status(200).json({
        success: true,
        submissions: allSubs.filter((s) => childIds.has(s.student_id))
      });
    }

    const submissions = await store.getSubmissions({ assignment_id, student_id });
    res.status(200).json({ success: true, submissions });
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { submission_text, file_url } = req.body || {};

    if (!isUuid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid assignment ID.' });
    }
    if (!submission_text && !file_url) {
      return res.status(400).json({ success: false, message: 'Submission content or file attachment is required.' });
    }
    if (file_url && !isSafeUrl(file_url, { allowRelative: true, allowEmpty: true })) {
      return res.status(400).json({ success: false, message: 'Invalid submission attachment URL.' });
    }

    const submission = await store.submitAssignment({
      assignment_id: id,
      student_id: req.user.id,
      submission_text: clampText(submission_text || '', 10000),
      file_url: file_url ? String(file_url).trim() : ''
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_SUBMITTED',
      entity_type: 'ASSIGNMENT_SUBMISSION',
      entity_id: submission.id,
      ip_address: getClientIp(req),
      details: { assignment_id: id, student_id: req.user.id }
    });

    res.status(200).json({ success: true, message: 'Assignment submitted successfully!', submission });
  } catch (err) {
    next(err);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body || {};

    if (score === undefined || score === null) {
      return res.status(400).json({ success: false, message: 'Score is required.' });
    }
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 1000) {
      return res.status(400).json({ success: false, message: 'Score must be a valid number between 0 and 1000.' });
    }

    const updatedSubmission = await store.gradeSubmission(id, {
      score: Math.round(numericScore),
      feedback: clampText(feedback || '', 2000),
      tutorId: req.user.id
    });

    await store.logAudit({
      user_id: req.user.id,
      action: 'ASSIGNMENT_GRADED',
      entity_type: 'ASSIGNMENT_SUBMISSION',
      entity_id: id,
      ip_address: getClientIp(req),
      details: { score: Math.round(numericScore), submission_id: id }
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
