import express from 'express';
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  startClass,
  endClass
} from '../controllers/classController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllClasses);
router.get('/:id', getClassById);
// Only Tutors create and start live classes (Superadmin monitors & can terminate runaway sessions)
router.post('/', requireRole(['tutor']), createClass);
router.put('/:id', requireRole(['tutor', 'superadmin']), updateClass);
router.post('/:id/start', requireRole(['tutor']), startClass);
router.post('/:id/end', requireRole(['tutor', 'superadmin']), endClass);

export default router;
