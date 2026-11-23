import express from 'express';
import { getRoomAccess, getDailyStatus } from '../controllers/dailyController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to request classroom credentials
// Also supports optional auth (fallback for trial/guest attendees if permitted)
router.post('/room-access', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  // Allow proceeding as guest if no token provided
  req.user = { id: 'guest', full_name: 'Guest Student', role: 'student' };
  next();
}, getRoomAccess);

// Check integration status
router.get('/status', authenticate, getDailyStatus);

export default router;
