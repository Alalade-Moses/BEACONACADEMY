import express from 'express';
import { testSmtpSettings, sendTutorAcademicEmail, submitContactInquiry } from '../controllers/emailController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { publicFormRateLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Public Contact Us academic enquiry (rate-limited) -> direct to info@beaconbridgeacademics.co.uk
router.post('/contact-inquiry', publicFormRateLimiter, submitContactInquiry);

router.use(authenticate);

// Superadmin SMTP Diagnostic test
router.post('/test', requireRole(['superadmin']), testSmtpSettings);

// Tutor direct academic email to student/parent
router.post('/tutor-message', requireRole(['tutor', 'superadmin']), sendTutorAcademicEmail);

export default router;
