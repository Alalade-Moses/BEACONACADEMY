import express from 'express';
import { login, register, registerJoint, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/register-joint', registerJoint);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
