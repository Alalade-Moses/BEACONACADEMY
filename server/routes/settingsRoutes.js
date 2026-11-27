import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Platform settings are strictly administrative
router.get('/', authenticate, requireRole(['superadmin']), getSettings);
router.put('/', authenticate, requireRole(['superadmin']), updateSettings);

export default router;
