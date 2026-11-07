import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  getCategories, 
  enrollInCourse, 
  getMyEnrollments 
} from '../controllers/courseController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', authenticate, requireRole(['superadmin', 'tutor']), createCourse);
router.put('/:id', authenticate, requireRole(['superadmin', 'tutor']), updateCourse);
router.delete('/:id', authenticate, requireRole(['superadmin', 'tutor']), deleteCourse);

// Enrollment routes
router.post('/:id/enroll', authenticate, requireRole(['student']), enrollInCourse);
router.get('/user/my-enrollments', authenticate, getMyEnrollments);

export default router;
