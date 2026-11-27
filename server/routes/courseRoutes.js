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
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public catalog routes (optionalAuthenticate lets tutors/superadmins see drafts without exposing drafts publicly)
router.get('/categories', getCategories);
router.get('/', optionalAuthenticate, getAllCourses);
router.get('/user/my-enrollments', authenticate, getMyEnrollments);
router.get('/:id', optionalAuthenticate, getCourseById);

// Protected routes
router.post('/', authenticate, requireRole(['superadmin', 'tutor']), createCourse);
router.put('/:id', authenticate, requireRole(['superadmin', 'tutor']), updateCourse);
router.delete('/:id', authenticate, requireRole(['superadmin', 'tutor']), deleteCourse);

// Enrollment routes
router.post('/:id/enroll', authenticate, requireRole(['student']), enrollInCourse);

export default router;
