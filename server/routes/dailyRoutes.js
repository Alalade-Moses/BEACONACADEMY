import express from 'express';
import { getRoomAccess, getDailyStatus } from '../controllers/dailyController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strictly authenticated users only can request live virtual classroom access tokens
router.post('/room-access', authenticate, getRoomAccess);

// Check integration status
router.get('/status', authenticate, getDailyStatus);

export default router;
