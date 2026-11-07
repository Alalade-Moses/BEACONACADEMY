import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', authenticate, requireRole(['superadmin', 'tutor']), createAnnouncement);

export default router;
