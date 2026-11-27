import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPlatformStats,
  getTutorAssignments,
  assignTutorToStudent,
  unassignTutorFromStudent
} from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Tutor-student assignment endpoints (registered before /:id to avoid route collision)
router.get('/tutor-assignments', getTutorAssignments);
router.post('/tutor-assignments', requireRole(['superadmin']), assignTutorToStudent);
router.delete('/tutor-assignments/:id', requireRole(['superadmin']), unassignTutorFromStudent);

// Superadmin stats & user management
router.get('/stats', requireRole(['superadmin']), getPlatformStats);
router.get('/', requireRole(['superadmin', 'tutor']), getAllUsers);
router.get('/:id', getUserById);
router.post('/', requireRole(['superadmin']), createUser);
router.put('/:id', requireRole(['superadmin']), updateUser);
router.delete('/:id', requireRole(['superadmin']), deleteUser);

export default router;
