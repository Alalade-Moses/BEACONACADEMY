import express from 'express';
import {
  submitWaitlistEntry,
  getAllWaitlistEntries,
  getWaitlistEntryById,
  updateWaitlistEntryStatus,
  deleteWaitlistEntry
} from '../controllers/tutorWaitlistController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { publicFormRateLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Public (rate-limited): Join the Beacon Bridge Academics Tutor Waiting List
router.post('/', publicFormRateLimiter, submitWaitlistEntry);

// Superadmin & Admin: List, inspect, update status / invite, and delete waitlist entries
router.get('/', authenticate, authorize('superadmin', 'admin'), getAllWaitlistEntries);
router.get('/:id', authenticate, authorize('superadmin', 'admin'), getWaitlistEntryById);
router.put('/:id/status', authenticate, authorize('superadmin', 'admin'), updateWaitlistEntryStatus);
router.delete('/:id', authenticate, authorize('superadmin', 'admin'), deleteWaitlistEntry);

export default router;
