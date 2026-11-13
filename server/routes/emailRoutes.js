import express from 'express';
import { testSmtpSettings, sendTutorAcademicEmail } from '../controllers/emailController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Superadmin SMTP Diagnostic test
router.post('/test', requireRole(['superadmin']), testSmtpSettings);

// Tutor direct academic email to student/parent
router.post('/tutor-message', requireRole(['tutor', 'superadmin']), sendTutorAcademicEmail);

export default router;
