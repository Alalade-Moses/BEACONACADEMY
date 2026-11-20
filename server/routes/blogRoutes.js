import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for visitors & students
router.get('/', getBlogPosts);
router.get('/:idOrSlug', getBlogPost);

// Protected routes (SuperAdmin & Admin only)
router.post('/', authenticate, requireRole(['superadmin', 'admin']), createBlogPost);
router.put('/:id', authenticate, requireRole(['superadmin', 'admin']), updateBlogPost);
router.delete('/:id', authenticate, requireRole(['superadmin', 'admin']), deleteBlogPost);

export default router;
