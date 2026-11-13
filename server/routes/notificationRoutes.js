import express from 'express';
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', clearAllNotifications);

export default router;
