import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticate, requireRole(['superadmin']), updateSettings);

export default router;
