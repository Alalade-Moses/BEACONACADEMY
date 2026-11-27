import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAnnouncements);
router.post('/', requireRole(['superadmin', 'tutor']), createAnnouncement);

export default router;
