import express from 'express';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  getSubmissions,
  submitAssignment,
  gradeSubmission,
  checkDeadlines
} from '../controllers/assignmentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// List assignments
router.get('/', authenticate, getAssignments);

// Submissions listing
router.get('/submissions/all', authenticate, getSubmissions);

// Deadline check trigger
router.post('/check-deadlines', authenticate, checkDeadlines);

// Single assignment details
router.get('/:id', authenticate, getAssignmentById);

// Create assignment (Tutor / Admin)
router.post('/', authenticate, authorize('tutor', 'superadmin'), createAssignment);

// Submit assignment (Student)
router.post('/:id/submit', authenticate, authorize('student'), submitAssignment);

// Grade submission (Tutor / Admin)
router.put('/submissions/:id/grade', authenticate, authorize('tutor', 'superadmin'), gradeSubmission);

export default router;
