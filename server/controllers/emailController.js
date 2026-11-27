import { store } from '../database/store.js';
import { sendEmail, sendTutorMessage, sendContactInquiryEmail, resolveSenderIdentity } from '../services/emailService.js';
import { isValidEmail, normalizeEmail, clampText, isUuid } from '../utils/validators.js';
import nodemailer from 'nodemailer';

/**
 * Public endpoint (rate-limited): Sends Contact Us page enquiries directly to info@beaconbridgeacademics.co.uk
 */
export const submitContactInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, curriculum, subject, message } = req.body || {};

    const cleanName = clampText(name || '', 120);
    const cleanEmail = normalizeEmail(email || '');
    const cleanMessage = clampText(message || '', 4000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, email address, and enquiry message.'
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const result = await sendContactInquiryEmail({
      name: cleanName,
      email: cleanEmail,
      phone: clampText(phone || '', 40),
      curriculum: clampText(curriculum || 'General', 100),
      subject: clampText(subject || 'General Academic Enquiry', 200),
      message: cleanMessage
    });

    if (result?.staffNotice && result.staffNotice.success === false) {
      return res.status(502).json({
        success: false,
        message: 'We could not deliver your enquiry at this moment. Please email info@beaconbridgeacademics.co.uk directly or message us on WhatsApp (+44 7414 663735).'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thank you! Your enquiry has been sent directly to info@beaconbridgeacademics.co.uk. An academic coordinator will respond within one business day.'
    });
  } catch (err) {
    next(err);
  }
};

export const testSmtpSettings = async (req, res) => {
  try {
    const rawTarget = req.body?.targetEmail;
    const recipient = rawTarget && isValidEmail(rawTarget)
      ? normalizeEmail(rawTarget)
      : (req.user.email || 'info@beaconbridgeacademics.co.uk');

    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT, 10) || 465;
    const user = process.env.SMTP_USER || process.env.SUPPORT_EMAIL || 'info@beaconbridgeacademics.co.uk';
    const pass = process.env.SMTP_PASS;

    if (!pass) {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'SMTP Password (SMTP_PASS) is not yet set. Emails operate via HTTPS provider or console preview.'
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();

    const testResult = await sendEmail({
      to: recipient,
      subject: 'SMTP Verification — Beacon Bridge Academics',
      html: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b;"><h2>SMTP Live Connection Verified</h2><p>Verified at ${new Date().toISOString()}.</p></div>`,
      senderType: 'admin'
    });

    res.status(200).json({
      success: true,
      configured: true,
      message: `SMTP connection verified and test email sent to ${recipient}.`,
      details: { messageId: testResult.messageId }
    });
  } catch (err) {
    console.error('SMTP test error:', err.message);
    res.status(500).json({
      success: false,
      configured: true,
      message: 'Failed to connect to SMTP server. Check your email configuration.'
    });
  }
};

export const sendTutorAcademicEmail = async (req, res, next) => {
  try {
    const { student_id, subject, message, class_id } = req.body || {};

    if (!student_id || !isUuid(student_id) || !message) {
      return res.status(400).json({ success: false, message: 'Valid student ID and message text are required.' });
    }

    const student = await store.getProfileById(student_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const links = await store.getParentStudentLinks();
    const link = links.find((l) => l.student_id === student_id);
    const parent = link ? await store.getProfileById(link.parent_id) : null;
    const classInfo = class_id ? await store.getClassById(class_id) : null;

    const tutor = req.user;
    const emailResult = await sendTutorMessage({
      tutor,
      student,
      parent,
      subject: clampText(subject || 'Academic Feedback', 200),
      messageBody: clampText(message, 4000),
      classInfo
    });

    const sender = resolveSenderIdentity('tutor', tutor);

    res.status(200).json({
      success: true,
      message: `Academic email dispatched to ${student.full_name} (${student.email})`,
      sender: sender.fromHeader,
      replyTo: sender.replyTo,
      emailResult
    });
  } catch (err) {
    next(err);
  }
};
