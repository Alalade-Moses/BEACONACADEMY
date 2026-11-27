import express from 'express';
import { login, register, registerJoint, registerIelts, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { loginRateLimiter, authWriteRateLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.post('/login', loginRateLimiter, login);
router.post('/register', authWriteRateLimiter, register);
router.post('/register-joint', authWriteRateLimiter, registerJoint);
router.post('/register-ielts', authWriteRateLimiter, registerIelts);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, authWriteRateLimiter, changePassword);

export default router;
