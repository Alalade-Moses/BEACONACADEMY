import express from 'express';
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultationStatus
} from '../controllers/consultationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission: Anyone can book a 1-on-1 consultation
router.post('/', createConsultation);

// Administrative access: view and manage scheduled consultations
router.get('/', authenticate, authorize('superadmin', 'admin', 'tutor'), getConsultations);
router.get('/:id', authenticate, authorize('superadmin', 'admin', 'tutor'), getConsultationById);
router.patch('/:id', authenticate, authorize('superadmin', 'admin'), updateConsultationStatus);

export default router;
