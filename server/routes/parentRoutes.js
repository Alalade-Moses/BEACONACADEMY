import express from 'express';
import { getMyChildren, linkChild } from '../controllers/parentController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole(['parent', 'superadmin']));

router.get('/children', getMyChildren);
router.post('/link-child', linkChild);

export default router;
