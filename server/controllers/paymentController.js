import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isSafeUrl, parsePositiveAmount, clampText, isUuid } from '../utils/validators.js';
import {
  sendPaymentProofSubmitted,
  sendPaymentProofAdminAlert,
  sendPaymentVerifiedReceipt
} from '../services/emailService.js';

export const getBankDetails = async (req, res, next) => {
  try {
    const settings = await store.getSettings();
    // Security: Never expose bank institution or receiving account coordinates publicly
    const bankDetails = {
      tuition_fee: settings.default_tuition_fee || '£299.00 GBP / month',
      currency: 'GBP',
      currency_symbol: '£',
      instructions: 'Please include the Student Full Name and Reference Code in your transfer description, then upload your confirmation receipt below.'
    };

    res.status(200).json({
      success: true,
      bankDetails
    });
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const payments = await store.getPayments();

    if (req.user.role === 'parent') {
      const parentPayments = payments.filter((p) => p.parent_id === req.user.id);
      return res.status(200).json({ success: true, payments: parentPayments });
    }

    res.status(200).json({
      success: true,
      payments
    });
  } catch (err) {
    next(err);
  }
};

export const submitProof = async (req, res, next) => {
  try {
    const { parent_id, student_id, course_id, course_track, amount, bank_reference, proof_url, notes } = req.body || {};

    const cleanRef = clampText(bank_reference || '', 100);
    if (!cleanRef) {
      return res.status(400).json({ success: false, message: 'Bank reference number or transaction ID is required.' });
    }

    if (!proof_url || !isSafeUrl(proof_url, { allowRelative: true, allowEmpty: false })) {
      return res.status(400).json({ success: false, message: 'A valid uploaded payment receipt slip is required.' });
    }

    const parsedAmount = amount !== undefined && amount !== '' ? parsePositiveAmount(amount) : 299.00;
    if (parsedAmount === null) {
      return res.status(400).json({ success: false, message: 'Amount must be a valid positive number.' });
    }

    // Never allow an authenticated parent to spoof another parent's ID
    const resolvedParentId = req.user?.role === 'parent'
      ? req.user.id
      : (req.user?.id || (isUuid(parent_id) ? parent_id : null));
    const resolvedStudentId = isUuid(student_id) ? student_id : null;

    const payment = await store.submitPaymentProof({
      parent_id: resolvedParentId,
      student_id: resolvedStudentId,
      course_id: isUuid(course_id) ? course_id : null,
      course_track: course_track ? clampText(String(course_track), 100) : null,
      amount: parsedAmount,
      bank_reference: cleanRef,
      proof_url: String(proof_url).trim(),
      notes: clampText(notes || '', 500)
    });

    (async () => {
      try {
        const parent = resolvedParentId ? await store.getProfileById(resolvedParentId) : null;
        const student = resolvedStudentId ? await store.getProfileById(resolvedStudentId) : null;
        if (parent) {
          await sendPaymentProofSubmitted({ parent, student, payment });
        }
        await sendPaymentProofAdminAlert({ payment, student, parent });
      } catch (e) {
        console.warn('[Payment Proof Email Warning]', e.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Payment proof submitted successfully. Awaiting administrator verification.',
      payment
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const verifiedPayment = await store.verifyPayment(id, adminId);

    (async () => {
      try {
        const student = verifiedPayment.student_id ? await store.getProfileById(verifiedPayment.student_id) : null;
        const parent = verifiedPayment.parent_id ? await store.getProfileById(verifiedPayment.parent_id) : null;
        if (parent || student) {
          await sendPaymentVerifiedReceipt({ payment: verifiedPayment, student, parent: parent || student });
        }
      } catch (e) {
        console.warn('[Payment Verified Email Warning]', e.message);
      }
    })();

    await store.logAudit({
      user_id: adminId,
      action: 'PAYMENT_VERIFIED',
      entity_type: 'PAYMENT',
      entity_id: id,
      ip_address: getClientIp(req),
      details: {
        paymentId: id,
        studentId: verifiedPayment.student_id,
        parentId: verifiedPayment.parent_id,
        amount: verifiedPayment.amount
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Official invoice and portal activation email dispatched.',
      payment: verifiedPayment
    });
  } catch (err) {
    next(err);
  }
};

export const sendPaymentInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payments = await store.getPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const student = payment.student_id ? await store.getProfileById(payment.student_id) : null;
    const parent = payment.parent_id ? await store.getProfileById(payment.parent_id) : null;

    if (!parent && !student) {
      return res.status(400).json({ success: false, message: 'No linked parent or student email found for this payment.' });
    }

    const recipientParent = parent || student;
    await sendPaymentVerifiedReceipt({ payment, student, parent: recipientParent });

    res.status(200).json({
      success: true,
      message: `Official invoice and login details dispatched to ${recipientParent.email}.`
    });
  } catch (err) {
    next(err);
  }
};

export const rejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_notes = clampText(req.body?.admin_notes || '', 500);

    const rejectedPayment = await store.rejectPayment(id, admin_notes);

    await store.logAudit({
      user_id: req.user.id,
      action: 'PAYMENT_REJECTED',
      entity_type: 'PAYMENT',
      entity_id: id,
      ip_address: getClientIp(req),
      details: { paymentId: id, adminNotes: admin_notes }
    });

    res.status(200).json({
      success: true,
      message: 'Payment marked as rejected. User has been notified to re-upload proof.',
      payment: rejectedPayment
    });
  } catch (err) {
    next(err);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await store.deletePayment(id);

    await store.logAudit({
      user_id: req.user?.id,
      action: 'PAYMENT_RECORD_DELETED',
      entity_type: 'PAYMENT',
      entity_id: id,
      ip_address: getClientIp(req),
      details: { paymentId: id }
    });

    res.status(200).json({
      success: true,
      message: 'Tuition verification record permanently deleted.'
    });
  } catch (err) {
    next(err);
  }
};
