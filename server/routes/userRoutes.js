import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getPlatformStats } from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Superadmin only
router.get('/stats', requireRole(['superadmin']), getPlatformStats);
router.get('/', requireRole(['superadmin', 'tutor']), getAllUsers);
router.get('/:id', getUserById);
router.post('/', requireRole(['superadmin']), createUser);
router.put('/:id', requireRole(['superadmin']), updateUser);
router.delete('/:id', requireRole(['superadmin']), deleteUser);

export default router;
