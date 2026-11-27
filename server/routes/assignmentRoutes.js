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

router.get('/', authenticate, getAssignments);
router.get('/submissions/all', authenticate, getSubmissions);
router.post('/check-deadlines', authenticate, authorize('superadmin', 'tutor'), checkDeadlines);
router.get('/:id', authenticate, getAssignmentById);
router.post('/', authenticate, authorize('tutor', 'superadmin'), createAssignment);
router.post('/:id/submit', authenticate, authorize('student'), submitAssignment);
router.put('/submissions/:id/grade', authenticate, authorize('tutor', 'superadmin'), gradeSubmission);

export default router;
