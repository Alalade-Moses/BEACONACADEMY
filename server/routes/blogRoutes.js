import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController.js';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (optionalAuthenticate lets admins view drafts while visitors only see published posts)
router.get('/', optionalAuthenticate, getBlogPosts);
router.get('/:idOrSlug', optionalAuthenticate, getBlogPost);

// Protected routes (SuperAdmin & Admin only)
router.post('/', authenticate, requireRole(['superadmin', 'admin']), createBlogPost);
router.put('/:id', authenticate, requireRole(['superadmin', 'admin']), updateBlogPost);
router.delete('/:id', authenticate, requireRole(['superadmin', 'admin']), deleteBlogPost);

export default router;
