import express from 'express';
import { getAttendanceRecords, recordAttendance } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAttendanceRecords);
router.post('/', recordAttendance);

export default router;
