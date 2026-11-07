import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole(['superadmin']));

router.get('/', getAuditLogs);

export default router;
