import express from 'express';
import { 
  getMaterials, 
  createMaterial, 
  deleteMaterial, 
  getRecordings, 
  createRecording,
  deleteRecording
} from '../controllers/materialController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMaterials);
router.post('/', requireRole(['superadmin', 'tutor']), createMaterial);
router.delete('/:id', requireRole(['superadmin', 'tutor']), deleteMaterial);

router.get('/recordings', getRecordings);
router.post('/recordings', requireRole(['superadmin', 'tutor']), createRecording);
router.delete('/recordings/:id', requireRole(['superadmin', 'admin', 'tutor']), deleteRecording);

export default router;
