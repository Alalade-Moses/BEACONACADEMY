import { store } from '../database/store.js';
import { 
  sendPaymentProofSubmitted, 
  sendPaymentProofAdminAlert, 
  sendPaymentVerifiedReceipt 
} from '../services/emailService.js';

export const getBankDetails = async (req, res, next) => {
  try {
    const settings = await store.getSettings();
    const bankDetails = {
      bank_name: settings.bank_name || 'Barclays Bank UK PLC',
      account_name: settings.bank_account_name || 'Beacon Bridge Academics Ltd.',
      account_number: settings.bank_account_number || '83920147',
      swift_code: settings.bank_swift_bic || 'BARCGB22',
      routing_code: settings.bank_routing_sort || '20-45-77',
      iban: settings.bank_iban || 'GB29BARC20457783920147',
      tuition_fee: settings.default_tuition_fee || '£299.00 GBP',
      currency: 'GBP',
      currency_symbol: '£',
      instructions: settings.bank_instructions || 'Please transfer the term tuition fee in British Pounds (£ GBP) using the Student Full Name and Reference Code in the payment description. Upload your transfer confirmation slip or receipt below.'
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

    // If caller is a parent, filter payments where parent_id === req.user.id
    if (req.user.role === 'parent') {
      const parentPayments = payments.filter(p => p.parent_id === req.user.id);
      return res.status(200).json({ success: true, payments: parentPayments });
    }

    // Admins get all payments
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
    const { parent_id, student_id, course_id, course_track, amount, bank_reference, proof_url, notes } = req.body;

    const callerId = req.user ? req.user.id : parent_id;

    const payment = await store.submitPaymentProof({
      parent_id: callerId || parent_id,
      student_id,
      course_id,
      course_track,
      amount,
      bank_reference,
      proof_url,
      notes
    });

    // Notify Parent & Admin asynchronously
    (async () => {
      try {
        const parent = callerId ? await store.getProfileById(callerId) : null;
        const student = student_id ? await store.getProfileById(student_id) : null;
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

    // Send official receipt email asynchronously
    (async () => {
      try {
        const student = verifiedPayment.student_id ? await store.getProfileById(verifiedPayment.student_id) : null;
        const parent = verifiedPayment.parent_id ? await store.getProfileById(verifiedPayment.parent_id) : null;
        if (parent) {
          await sendPaymentVerifiedReceipt({ payment: verifiedPayment, student, parent });
        }
      } catch (e) {
        console.warn('[Payment Verified Email Warning]', e.message);
      }
    })();

    // Audit log
    await store.logAudit({
      user_id: adminId,
      action: 'PAYMENT_VERIFIED',
      entity_type: 'PAYMENT',
      entity_id: id,
      ip_address: req.ip || '127.0.0.1',
      details: {
        paymentId: id,
        studentId: verifiedPayment.student_id,
        parentId: verifiedPayment.parent_id,
        amount: verifiedPayment.amount
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Both student and parent accounts are now fully active.',
      payment: verifiedPayment
    });
  } catch (err) {
    next(err);
  }
};

export const rejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const rejectedPayment = await store.rejectPayment(id, admin_notes);

    // Audit log
    await store.logAudit({
      user_id: req.user.id,
      action: 'PAYMENT_REJECTED',
      entity_type: 'PAYMENT',
      entity_id: id,
      ip_address: req.ip || '127.0.0.1',
      details: {
        paymentId: id,
        adminNotes: admin_notes
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment marked as rejected. Parent has been notified to re-upload proof.',
      payment: rejectedPayment
    });
  } catch (err) {
    next(err);
  }
};
