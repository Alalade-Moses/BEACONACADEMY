import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
} from '../controllers/tutorApplicationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Submit a new teacher application with 3-minute video and safeguarding agreement
router.post('/', submitApplication);

// Superadmin only: List, inspect, and evaluate teacher applications
router.get('/', authenticate, authorize('superadmin', 'admin'), getAllApplications);
router.get('/:id', authenticate, authorize('superadmin', 'admin'), getApplicationById);
router.put('/:id/status', authenticate, authorize('superadmin', 'admin'), updateApplicationStatus);

export default router;
