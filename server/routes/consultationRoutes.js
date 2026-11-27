import express from 'express';
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultationStatus
} from '../controllers/consultationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { publicFormRateLimiter } from '../middleware/securityMiddleware.js';
import { testSmtpConnection } from '../services/emailService.js';

const router = express.Router();

// Public submission (rate-limited): book a 1-on-1 consultation
router.post('/', publicFormRateLimiter, createConsultation);

// Superadmin ONLY diagnostic SMTP verification route
router.get('/test-smtp', authenticate, authorize('superadmin'), async (req, res) => {
  try {
    const result = await testSmtpConnection();
    res.status(result.connected ? 200 : 500).json(result);
  } catch (err) {
    res.status(500).json({ connected: false, error: 'SMTP verification check failed.' });
  }
});

// Administrative access: view and manage scheduled consultations
router.get('/', authenticate, authorize('superadmin', 'admin', 'tutor'), getConsultations);
router.get('/:id', authenticate, authorize('superadmin', 'admin', 'tutor'), getConsultationById);
router.patch('/:id', authenticate, authorize('superadmin', 'admin'), updateConsultationStatus);

export default router;
