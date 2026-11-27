import express from 'express';
import {
  getBankDetails,
  getPayments,
  submitProof,
  verifyPayment,
  rejectPayment,
  sendPaymentInvoice,
  deletePayment
} from '../controllers/paymentController.js';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/authMiddleware.js';
import { publicFormRateLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Public non-sensitive fee metadata only (zero account numbers/SWIFT/sort code)
router.get('/bank-details', getBankDetails);

// Submit proof of payment (rate-limited, optional auth to bind authenticated parent identity)
router.post('/proof', publicFormRateLimiter, optionalAuthenticate, submitProof);

// List payments: Superadmins can view all; Parents can view only their own payments
router.get('/', authenticate, authorize('superadmin', 'parent'), getPayments);

// Superadmin verification endpoints
router.put('/:id/verify', authenticate, authorize('superadmin'), verifyPayment);
router.put('/:id/reject', authenticate, authorize('superadmin'), rejectPayment);
router.post('/:id/send-invoice', authenticate, authorize('superadmin'), sendPaymentInvoice);
router.delete('/:id', authenticate, authorize('superadmin'), deletePayment);

export default router;
