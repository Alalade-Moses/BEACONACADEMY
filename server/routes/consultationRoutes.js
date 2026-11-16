import express from 'express';
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultationStatus
} from '../controllers/consultationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public submission: Anyone can book a 1-on-1 consultation
router.post('/', createConsultation);

// Administrative access: view and manage scheduled consultations
router.get('/', authenticateToken, authorizeRoles('superadmin', 'admin', 'tutor'), getConsultations);
router.get('/:id', authenticateToken, authorizeRoles('superadmin', 'admin', 'tutor'), getConsultationById);
router.patch('/:id', authenticateToken, authorizeRoles('superadmin', 'admin'), updateConsultationStatus);

export default router;
