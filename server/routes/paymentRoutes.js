import express from 'express';
import {
  getBankDetails,
  getPayments,
  submitProof,
  verifyPayment,
  rejectPayment
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: view official institutional account details for payments
router.get('/bank-details', getBankDetails);

// Submit proof of payment (can be submitted during or after registration)
router.post('/proof', submitProof);

// List payments: Superadmins can view all; Parents can view their child's payments
router.get('/', authenticate, authorize('superadmin', 'parent'), getPayments);

// Superadmin verification endpoints
router.put('/:id/verify', authenticate, authorize('superadmin'), verifyPayment);
router.put('/:id/reject', authenticate, authorize('superadmin'), rejectPayment);

export default router;
