import { store } from '../database/store.js';
import { sendEmail, sendTutorMessage, resolveSenderIdentity } from '../services/emailService.js';
import nodemailer from 'nodemailer';

/**
 * Diagnostic test endpoint to test Hostinger SMTP configuration from Superadmin portal.
 */
export const testSmtpSettings = async (req, res, next) => {
  try {
    const { targetEmail } = req.body;
    const recipient = targetEmail || req.user.email || 'info@beaconbridgeacademics.co.uk';

    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT, 10) || 465;
    const user = process.env.SMTP_USER || process.env.SUPPORT_EMAIL || 'info@beaconbridgeacademics.co.uk';
    const pass = process.env.SMTP_PASS;

    if (!pass) {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'SMTP Password (SMTP_PASS) is not yet set in server/.env. Emails are operating in Console Preview mode.',
        details: {
          host,
          port,
          user,
          mode: 'Preview / Safe Fallback'
        }
      });
    }

    // Attempt live socket connection test with Hostinger mail server
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();

    // Send a live test email
    const testResult = await sendEmail({
      to: recipient,
      subject: 'Hostinger SMTP Verification — Beacon Bridge Academics',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #065f46;">Hostinger SMTP Live Connection Verified!</h2>
          <p>This test confirmation verifies that <strong>Beacon Bridge Academics</strong> can successfully send outbound emails through Hostinger's mail servers.</p>
          <ul>
            <li><strong>SMTP Server:</strong> ${host}:${port}</li>
            <li><strong>Authenticated Account:</strong> ${user}</li>
            <li><strong>Sender Identity Mode:</strong> Dynamic (admin@, tutor.{name}@, info@)</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
        </div>
      `,
      senderType: 'admin'
    });

    res.status(200).json({
      success: true,
      configured: true,
      message: `Hostinger SMTP connection verified and test email sent to ${recipient}!`,
      details: { host, port, user, messageId: testResult.messageId }
    });
  } catch (err) {
    console.error('SMTP test error:', err);
    res.status(500).json({
      success: false,
      configured: true,
      message: `Failed to connect to Hostinger SMTP: ${err.message}`,
      hint: 'Please check your Hostinger email password and ensure Port 465 (SSL) is open.'
    });
  }
};

/**
 * Tutor sends direct academic communication to a student or parent.
 * Automatically dispatched as: tutor.{firstname}@beaconbridgeacademics.co.uk
 */
export const sendTutorAcademicEmail = async (req, res, next) => {
  try {
    const { student_id, subject, message, class_id } = req.body;

    if (!student_id || !message) {
      return res.status(400).json({ success: false, message: 'Student and message text are required.' });
    }

    const student = await store.getProfileById(student_id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Find parent if linked
    const links = await store.getParentStudentLinks();
    const link = links.find(l => l.student_id === student_id);
    let parent = null;
    if (link) {
      parent = await store.getProfileById(link.parent_id);
    }

    let classInfo = null;
    if (class_id) {
      classInfo = await store.getClassById(class_id);
    }

    const tutor = req.user;

    const emailResult = await sendTutorMessage({
      tutor,
      student,
      parent,
      subject,
      messageBody: message,
      classInfo
    });

    const sender = resolveSenderIdentity('tutor', tutor);

    res.status(200).json({
      success: true,
      message: `Academic email dispatched to ${student.full_name} (${student.email}) from ${sender.fromHeader}`,
      sender: sender.fromHeader,
      replyTo: sender.replyTo,
      emailResult
    });
  } catch (err) {
    next(err);
  }
};
