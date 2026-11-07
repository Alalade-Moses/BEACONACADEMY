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
router.post('/', requireRole(['superadmin', 'tutor']), createClass);
router.put('/:id', requireRole(['superadmin', 'tutor']), updateClass);
router.post('/:id/start', requireRole(['superadmin', 'tutor']), startClass);
router.post('/:id/end', requireRole(['superadmin', 'tutor']), endClass);

export default router;
