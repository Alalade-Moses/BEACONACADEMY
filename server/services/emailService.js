import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { escapeHtml, stripHeaderBreaks } from '../utils/validators.js';
dotenv.config();

// Global domain & default addresses
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'beaconbridgeacademics.co.uk';
const DEFAULT_INFO_EMAIL = process.env.SUPPORT_EMAIL || `info@${EMAIL_DOMAIN}`;
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || `admin@${EMAIL_DOMAIN}`;
const DEFAULT_ADMISSIONS_EMAIL = process.env.ADMISSIONS_EMAIL || `admissions@${EMAIL_DOMAIN}`;

let cachedSmtpConfig = null;

// Configure Hostinger SMTP Transporter
// Hostinger supports:
// 1. Port 587 (STARTTLS) - Best for cloud environments like Railway
// 2. Port 465 (SSL)
// 3. smtp.titan.email (for Hostinger Business Email plans)
// 4. Port 2525 (Alternative submission port)
export const createTransporter = (forcedConfig = null) => {
  const cfg = forcedConfig || cachedSmtpConfig;
  const host = cfg ? cfg.host : (process.env.SMTP_HOST || 'smtp.hostinger.com').trim();
  const port = cfg ? cfg.port : (parseInt(process.env.SMTP_PORT, 10) || 587); // Default to 587 (STARTTLS) to prevent 465 timeouts on cloud servers
  const user = (process.env.SMTP_USER || DEFAULT_INFO_EMAIL).trim();
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : null;

  if (!pass) {
    // Development / safe preview mode when SMTP password is not yet configured
    console.warn('[EmailService] SMTP_PASS not set. Emails logged in console preview mode.');
    return null;
  }

  const isSecure = cfg ? cfg.secure : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass
    },
    connectionTimeout: 6000,
    greetingTimeout: 6000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Diagnostic helper to test Hostinger SMTP authentication directly across all standard ports & hosts,
 * or verify Resend / Brevo HTTPS API connections.
 */
export const testSmtpConnection = async () => {
  const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
  const brevoKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : null;

  // 1. Test Resend HTTPS API if configured
  if (resendKey) {
    try {
      const chk = await fetch('https://api.resend.com/api-keys', {
        headers: { 'Authorization': `Bearer ${resendKey}` }
      });
      if (chk.ok) {
        return {
          connected: true,
          provider: 'resend',
          protocol: 'HTTPS (Port 443 - Cloud Firewall Proof)',
          message: 'Resend API key verified successfully! Outbound emails are 100% active.'
        };
      } else {
        const errData = await chk.json();
        return {
          connected: false,
          provider: 'resend',
          message: 'Resend API key check failed.',
          error: errData.message || errData
        };
      }
    } catch (e) {
      return { connected: false, provider: 'resend', error: e.message };
    }
  }

  // 2. Test Brevo HTTPS API if configured
  if (brevoKey) {
    try {
      const chk = await fetch('https://api.brevo.com/v3/account', {
        headers: { 'api-key': brevoKey }
      });
      if (chk.ok) {
        return {
          connected: true,
          provider: 'brevo',
          protocol: 'HTTPS (Port 443 - Cloud Firewall Proof)',
          message: 'Brevo API key verified successfully! Outbound emails are 100% active.'
        };
      }
    } catch (e) {
      return { connected: false, provider: 'brevo', error: e.message };
    }
  }

  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : null;
  const user = (process.env.SMTP_USER || DEFAULT_INFO_EMAIL).trim();

  if (!pass) {
    return {
      connected: false,
      message: 'Neither RESEND_API_KEY nor SMTP_PASS is set in Railway environment variables.'
    };
  }

  const candidates = [
    { host: 'smtp.hostinger.com', port: 587, secure: false, label: 'Hostinger 587 (STARTTLS)' },
    { host: 'smtp.titan.email', port: 587, secure: false, label: 'Hostinger Titan 587 (STARTTLS)' },
    { host: 'smtp.hostinger.com', port: 465, secure: true, label: 'Hostinger 465 (SSL)' },
    { host: 'smtp.titan.email', port: 465, secure: true, label: 'Hostinger Titan 465 (SSL)' },
    { host: 'smtp.hostinger.com', port: 2525, secure: false, label: 'Hostinger 2525 (Alternative)' }
  ];

  const tested = [];
  let workingCandidate = null;

  for (const c of candidates) {
    try {
      const tp = nodemailer.createTransport({
        host: c.host,
        port: c.port,
        secure: c.secure,
        auth: { user, pass },
        connectionTimeout: 4500,
        greetingTimeout: 4500,
        socketTimeout: 6000,
        tls: { rejectUnauthorized: false }
      });
      await tp.verify();
      workingCandidate = c;
      cachedSmtpConfig = c;
      tested.push({ label: c.label, status: 'CONNECTED_SUCCESS' });
      break;
    } catch (err) {
      tested.push({ label: c.label, status: 'FAILED', error: err.message, code: err.code || null });
    }
  }

  if (workingCandidate) {
    return {
      connected: true,
      workingConfig: workingCandidate,
      message: `Successfully connected using ${workingCandidate.label} for ${user}!`,
      tested
    };
  }

  return {
    connected: false,
    message: 'All direct SMTP ports timed out. Railway blocks outbound SMTP (ports 25, 465, 587) on standard containers to prevent spam. Use RESEND_API_KEY via HTTPS (Port 443) or request SMTP unblock from Railway Support.',
    tested
  };
};

/**
 * Format dynamic sender identity based on sender role and tutor identity.
 * Rule:
 *  - For Hostinger SMTP compliance, the From address in <...> MUST match the authenticated mailbox (SMTP_USER).
 *  - The Display Name customizes the role (Admissions, Administration, Faculty Tutor).
 */
export const resolveSenderIdentity = (senderType = 'admin', tutor = null) => {
  const domain = EMAIL_DOMAIN;
  const primaryAuthUser = (process.env.SMTP_USER || `info@${domain}`).trim();

  if (senderType === 'tutor' && tutor) {
    const displayName = `${tutor.full_name || 'Tutor'} | Beacon Bridge Academics`;
    return {
      address: primaryAuthUser,
      displayName,
      fromHeader: `"${displayName}" <${primaryAuthUser}>`,
      replyTo: tutor.email || primaryAuthUser
    };
  }

  if (senderType === 'admin') {
    const displayName = 'Beacon Bridge Administration';
    return {
      address: primaryAuthUser,
      displayName,
      fromHeader: `"${displayName}" <${primaryAuthUser}>`,
      replyTo: primaryAuthUser
    };
  }

  if (senderType === 'admissions') {
    const displayName = 'Beacon Bridge Admissions & Student Services';
    return {
      address: primaryAuthUser,
      displayName,
      fromHeader: `"${displayName}" <${primaryAuthUser}>`,
      replyTo: primaryAuthUser
    };
  }

  // Default: Info / Support
  const displayName = 'Beacon Bridge Academics';
  return {
    address: primaryAuthUser,
    displayName,
    fromHeader: `"${displayName}" <${primaryAuthUser}>`,
    replyTo: primaryAuthUser
  };
};

/**
 * Send an email with dynamic sender identity and Hostinger SMTP support.
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  senderType = 'admin',
  tutor = null,
  customFrom = null,
  replyTo = null
}) => {
  try {
    const sender = resolveSenderIdentity(senderType, tutor);
    const from = stripHeaderBreaks(customFrom || sender.fromHeader);
    const resolvedReplyTo = stripHeaderBreaks(replyTo || sender.replyTo);
    const safeSubject = stripHeaderBreaks(subject || 'Beacon Bridge Academics Notification');
    const safeTo = Array.isArray(to) ? to.map((addr) => stripHeaderBreaks(addr)) : stripHeaderBreaks(to || '');

    // 1. Resend HTTPS REST API (Port 443 - Immune to cloud SMTP port blocking)
    const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
    if (resendKey) {
      try {
        const fromAddress = process.env.RESEND_FROM || `Beacon Bridge Academics <${process.env.SMTP_USER || 'info@beaconbridgeacademics.co.uk'}>`;
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: Array.isArray(safeTo) ? safeTo : [safeTo],
            reply_to: resolvedReplyTo,
            subject: safeSubject,
            html,
            text: text || ''
          })
        });
        const resData = await resendRes.json();
        if (resendRes.ok) {
          console.log(`[Resend HTTP API Email Sent] ID: ${resData.id} | To: ${to}`);
          return { success: true, messageId: resData.id, provider: 'resend' };
        } else {
          console.warn('[Resend API Warning]:', resData);
        }
      } catch (httpErr) {
        console.warn('[Resend HTTP Dispatch Error]:', httpErr.message);
      }
    }

    // 2. Brevo HTTPS REST API (Port 443)
    const brevoKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : null;
    if (brevoKey) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: {
              name: sender.displayName || 'Beacon Bridge Academics',
              email: process.env.SMTP_USER || 'info@beaconbridgeacademics.co.uk'
            },
            to: [{ email: Array.isArray(safeTo) ? safeTo[0] : safeTo }],
            replyTo: { email: resolvedReplyTo },
            subject: safeSubject,
            htmlContent: html,
            textContent: text || ''
          })
        });
        const brevoData = await brevoRes.json();
        if (brevoRes.ok) {
          console.log(`[Brevo HTTP API Email Sent] ID: ${brevoData.messageId} | To: ${to}`);
          return { success: true, messageId: brevoData.messageId, provider: 'brevo' };
        } else {
          console.warn('[Brevo API Warning]:', brevoData);
        }
      } catch (httpErr) {
        console.warn('[Brevo HTTP Dispatch Error]:', httpErr.message);
      }
    }

    // 3. Fallback to direct SMTP Transporter
    const transporter = createTransporter();

    if (!transporter) {
      console.log('\n=================== [EMAIL SERVICE: PREVIEW DISPATCH] ===================');
      console.log(`[FROM]:    ${from}`);
      console.log(`[REPLY-TO]: ${resolvedReplyTo}`);
      console.log(`[TO]:      ${to}`);
      console.log(`[SUBJECT]: ${subject}`);
      console.log(`[SENDER ROLE]: ${senderType} ${tutor ? `(${tutor.full_name})` : ''}`);
      console.log('--------------------------- HTML PREVIEW ---------------------------');
      console.log(text || html?.substring(0, 300) + '...');
      console.log('=========================================================================\n');
      return {
        success: true,
        mocked: true,
        message: 'Email previewed in console (SMTP_PASS not set in .env yet).'
      };
    }

    const info = await transporter.sendMail({
      from,
      to: safeTo,
      replyTo: resolvedReplyTo,
      subject: safeSubject,
      text: text || '',
      html
    });

    console.log(`[Email Sent] MessageId: ${info.messageId} | To: ${to} | From: ${from}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email Error] Failed to send email:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Shared HTML email layout wrapper with Beacon Bridge Academics branding.
 */
const buildEmailTemplate = ({ headerTitle, contentHtml, callToAction }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #a7f3d0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px 28px; font-size: 14px; line-height: 1.6; color: #334155; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .button { display: inline-block; background-color: #059669; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; text-align: center; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-gold { background: #fef3c7; color: #b45309; }
    .badge-green { background: #d1fae5; color: #065f46; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="margin-bottom: 16px;">
        <img src="https://beaconbridgeacademics.co.uk/logo.png" alt="Beacon Bridge Academics" style="height: 60px; width: auto; border-radius: 10px; display: block; margin: 0 auto;" />
      </div>
      <h1>${headerTitle}</h1>
    </div>
    <div class="content">
      ${contentHtml}
      ${callToAction ? `<div style="text-align: center; margin: 24px 0;"><a href="${callToAction.url}" class="button">${callToAction.label}</a></div>` : ''}
    </div>
    <div class="footer">
      <p><strong>Beacon Bridge Academics Ltd</strong> &bull; 41 Great Oaks Avenue, Warren Wood, Gainsborough, DN21 1AE, United Kingdom</p>
      <p>Official Platform Communications &bull; <a href="https://beaconbridgeacademics.co.uk" style="color: #059669; text-decoration: none;">beaconbridgeacademics.co.uk</a></p>
      <p style="margin-top: 8px; color: #94a3b8;">This communication is subject to UK GDPR and our Educational Safeguarding Policy. If you received this email in error, please contact info@beaconbridgeacademics.co.uk.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// 1. Student & Parent Registration Welcome Email
export const sendRegistrationWelcome = async ({ student, parent, course, track, amount }) => {
  const courseTitle = course?.title || 'Academic Program';
  const trackLabel = track ? `(${track})` : '';
  const monthlyFee = amount || '299.00';

  const html = buildEmailTemplate({
    headerTitle: 'Welcome to Beacon Bridge Academics',
    contentHtml: `
      <p>Dear <strong>${parent?.full_name || 'Parent/Guardian'}</strong> & <strong>${student?.full_name || 'Student'}</strong>,</p>
      <p>Thank you for enrolling in <strong>Beacon Bridge Academics</strong>. Your joint parent-student academic accounts have been registered successfully.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 12px 0; color: #065f46; font-size: 16px;">Program Enrollment Summary</h3>
        <p style="margin: 4px 0;"><strong>Course:</strong> ${courseTitle} ${trackLabel}</p>
        <p style="margin: 4px 0;"><strong>Monthly Tuition Due:</strong> <span class="badge badge-gold">£${monthlyFee} GBP / month</span></p>
        <p style="margin: 4px 0;"><strong>Student Login:</strong> ${student?.email}</p>
        <p style="margin: 4px 0;"><strong>Parent Oversight Portal:</strong> ${parent?.email}</p>
      </div>

      <p>Your registration and tuition proof are currently being reviewed by our admissions and finance team. Both your parent and student portals will be unlocked automatically as soon as your payment is confirmed.</p>
      
      <div class="card" style="background: #ecfdf5; border-color: #a7f3d0;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">Next Steps:</h4>
        <p style="margin: 2px 0;"><strong>Payment Reference:</strong> ${student?.full_name ? student.full_name.toUpperCase().replace(/\s+/g, '-') : 'TUITION'}</p>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #475569;">If you need payment guidance or have not yet uploaded your transfer receipt, please email <a href="mailto:info@beaconbridgeacademics.co.uk" style="color: #059669;">info@beaconbridgeacademics.co.uk</a> or use the button below.</p>
      </div>
    `,
    callToAction: {
      label: 'Submit or Update Payment Proof',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/payment-proof`
    }
  });

  // Send to parent from admin@beaconbridgeacademics.co.uk
  return await sendEmail({
    to: parent?.email,
    subject: `Welcome to Beacon Bridge Academics — ${courseTitle} Registration Confirmation`,
    html,
    senderType: 'admin'
  });
};

// 1b. IELTS Candidate Registration Confirmation Email
export const sendIeltsRegistrationWelcome = async ({ student, track, targetBand, examDate, focusModules, amount, bankReference }) => {
  if (!student?.email) return { success: false, error: 'Missing candidate email' };

  const trackLabel = track || 'IELTS Academic';
  const monthlyFee = Number(amount || 100).toFixed(2);
  const modulesDisplay = Array.isArray(focusModules) && focusModules.length > 0
    ? focusModules.join(', ')
    : 'Speaking, Writing Task 1 & 2, Reading, and Listening';
  const loginUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/login`;

  const html = buildEmailTemplate({
    headerTitle: 'IELTS Registration Received',
    contentHtml: `
      <p>Dear <strong>${student?.full_name || 'IELTS Candidate'}</strong>,</p>
      <p>Thank you for registering for <strong>IELTS Academic &amp; UKVI Exam Preparation</strong> at <strong>Beacon Bridge Academics</strong>. We have received your candidate registration and monthly tuition proof.</p>
      
      <div class="card" style="border-left: 4px solid #050167;">
        <h3 style="margin: 0 0 12px 0; color: #050167; font-size: 16px;">IELTS Enrollment Summary</h3>
        <p style="margin: 4px 0;"><strong>Candidate Name:</strong> ${student?.full_name || 'Candidate'}</p>
        <p style="margin: 4px 0;"><strong>IELTS Portal Login Email:</strong> <span style="font-family: monospace;">${student.email}</span></p>
        <p style="margin: 4px 0;"><strong>Selected Track:</strong> ${trackLabel}</p>
        <p style="margin: 4px 0;"><strong>Target Overall Band:</strong> Band ${targetBand || '7.5'}</p>
        ${examDate ? `<p style="margin: 4px 0;"><strong>Target Exam Date:</strong> ${examDate}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Focus Modules:</strong> ${modulesDisplay}</p>
        <p style="margin: 4px 0;"><strong>Monthly Tuition:</strong> <span class="badge badge-gold">£${monthlyFee} GBP / month</span></p>
        ${bankReference ? `<p style="margin: 4px 0;"><strong>Payment Reference:</strong> <code>${bankReference}</code></p>` : ''}
        <p style="margin: 4px 0;"><strong>Account Status:</strong> <span class="badge badge-gold">Pending Payment Verification</span></p>
      </div>

      <div class="card" style="background: #ecfdf5; border-color: #a7f3d0;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">What Happens Next:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155;">
          <li>Our admissions and bursar team is reviewing your payment receipt.</li>
          <li>As soon as your payment is confirmed, you will receive an activation email with your official invoice.</li>
          <li>Your dedicated <strong>IELTS Student Dashboard</strong>, live 1-on-1 tutor classroom, speaking mock sessions, and essay review tools will unlock automatically.</li>
        </ul>
      </div>

      <p>If you have any questions or need assistance, simply reply to this email or contact <a href="mailto:info@beaconbridgeacademics.co.uk" style="color: #059669;">info@beaconbridgeacademics.co.uk</a>.</p>
    `,
    callToAction: {
      label: 'Go to Student Portal Login',
      url: loginUrl
    }
  });

  return await sendEmail({
    to: student.email,
    subject: `IELTS Registration Confirmation (${trackLabel}) — Beacon Bridge Academics`,
    html,
    senderType: 'admissions',
    replyTo: DEFAULT_INFO_EMAIL
  });
};

// 2. Payment Proof Received Confirmation (Parent)
export const sendPaymentProofSubmitted = async ({ parent, student, payment }) => {
  const html = buildEmailTemplate({
    headerTitle: 'Payment Proof Received',
    contentHtml: `
      <p>Dear <strong>${parent?.full_name || 'Parent/Guardian'}</strong>,</p>
      <p>We have successfully received your proof of payment for <strong>${payment?.course_display_name || 'Tuition'}</strong>.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Submission Details</h3>
        <p style="margin: 4px 0;"><strong>Enrolled Program:</strong> ${payment?.course_display_name || 'Coding (Software Development)'}</p>
        <p style="margin: 4px 0;"><strong>Monthly Tuition:</strong> £${payment?.amount || '299.00'} GBP / month</p>
        <p style="margin: 4px 0;"><strong>Transaction Reference:</strong> ${payment?.bank_reference || 'Submitted'}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <span class="badge badge-gold">Under Review by Finance</span></p>
      </div>

      <p>Our admissions and finance team verifies all UK bank receipts within 2 to 4 business hours. You will receive an official digital receipt and confirmation as soon as it is approved.</p>
    `,
    callToAction: {
      label: 'View Payment Status',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/parent/payments`
    }
  });

  return await sendEmail({
    to: parent?.email,
    subject: `Payment Proof Received — Beacon Bridge Academics (${payment?.course_display_name || 'Monthly Tuition'})`,
    html,
    senderType: 'admin'
  });
};

// 3. Admin Notification: New Payment Proof Needs Review
export const sendPaymentProofAdminAlert = async ({ payment, student, parent }) => {
  const adminEmail = DEFAULT_ADMIN_EMAIL;
  const html = buildEmailTemplate({
    headerTitle: 'New Payment Proof Submitted',
    contentHtml: `
      <p>A new payment receipt has been submitted and is awaiting finance verification:</p>
      <div class="card">
        <p style="margin: 4px 0;"><strong>Student:</strong> ${student?.full_name || payment?.student_name} (${student?.email || 'N/A'})</p>
        <p style="margin: 4px 0;"><strong>Parent:</strong> ${parent?.full_name || payment?.parent_name} (${parent?.email || 'N/A'})</p>
        <p style="margin: 4px 0;"><strong>Course & Track:</strong> ${payment?.course_display_name || payment?.course_track || 'Academic Program'}</p>
        <p style="margin: 4px 0;"><strong>Monthly Tuition:</strong> £${payment?.amount || '299.00'} GBP / month</p>
        <p style="margin: 4px 0;"><strong>Bank Reference:</strong> ${payment?.bank_reference || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Submitted At:</strong> ${new Date().toLocaleString('en-GB')}</p>
      </div>
    `,
    callToAction: {
      label: 'Verify Receipt in Superadmin Portal',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/admin/payments`
    }
  });

  return await sendEmail({
    to: adminEmail,
    subject: `[ACTION REQUIRED] New Payment Proof: £${payment?.amount} for ${payment?.course_display_name || 'Tuition'}`,
    html,
    senderType: 'admin'
  });
};

// 4. Payment Verified & Full Enrollment Invoice with Parent & Student Login Credentials
export const sendPaymentVerifiedReceipt = async ({ payment, student, parent }) => {
  const loginUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/login`;
  const invoiceNum = `INV-BBA-${new Date().getFullYear()}-${payment?.id ? payment.id.slice(-6).toUpperCase() : Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const isSelfRegistered = Boolean(
    !parent ||
    (student?.id && parent?.id === student.id) ||
    (student?.email && parent?.email === student.email)
  );
  const recipientName = parent?.full_name || student?.full_name || 'Parent/Guardian';

  const html = buildEmailTemplate({
    headerTitle: 'Official Payment Invoice & Portal Credentials',
    contentHtml: `
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>Thank you for your payment. We are pleased to confirm that your tuition payment of <strong>£${payment?.amount || '299.00'} GBP</strong> has been <span class="badge badge-green">Verified & Confirmed</span> by Beacon Bridge Academics administration.</p>
      
      <!-- Official Invoice Card -->
      <div class="card" style="border-left: 4px solid #050167; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <h3 style="margin: 0; color: #050167; font-size: 16px;">Institutional Tuition Invoice</h3>
          <span style="font-weight: bold; color: #059669; font-size: 13px;">STATUS: PAID IN FULL</span>
        </div>
        
        <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0;"><strong>Invoice Reference:</strong></td>
            <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: bold;">${invoiceNum}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Date of Issue:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${issueDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Tuition Program:</strong></td>
            <td style="padding: 4px 0; text-align: right; font-weight: bold;">${payment?.course_display_name || payment?.course_name || 'Enrolled Academic Course'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>${isSelfRegistered ? 'Candidate Enrolled:' : 'Student Enrolled:'}</strong></td>
            <td style="padding: 4px 0; text-align: right;">${student?.full_name || 'Enrolled Student'}</td>
          </tr>
          ${!isSelfRegistered ? `<tr>
            <td style="padding: 4px 0;"><strong>Parent / Guardian:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${parent?.full_name || 'Parent'}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 4px 0;"><strong>Payment Method:</strong></td>
            <td style="padding: 4px 0; text-align: right;">Barclays Bank Wire Transfer (Verified)</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 8px 0; font-size: 15px;"><strong>Total Paid:</strong></td>
            <td style="padding: 8px 0; text-align: right; font-size: 16px; font-weight: bold; color: #050167;">£${payment?.amount || '299.00'} GBP</td>
          </tr>
        </table>
      </div>

      <!-- Credentials Box -->
      <div class="card" style="border-left: 4px solid #40ffa7; background: #f0faff; margin-top: 16px;">
        <h3 style="margin: 0 0 10px 0; color: #001f3f; font-size: 15px;">🔑 Official Portal Access & Login Details</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569;">
          ${isSelfRegistered
            ? 'Your student portal account is now fully active. Use the credentials below to sign in:'
            : 'Both parent and student accounts are fully active. Use the credentials below to sign in:'}
        </p>

        <!-- Student Login -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; ${isSelfRegistered ? '' : 'margin-bottom: 10px;'}">
          <span style="display: block; font-size: 11px; font-weight: bold; color: #050167; text-transform: uppercase; letter-spacing: 0.5px;">Student Portal Credentials</span>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Login Email:</strong> <span style="font-family: monospace; font-size: 13px; color: #001f3f;">${student?.email || parent?.email || 'N/A'}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Role:</strong> Student (Live Classroom, Whiteboard & Assignments)</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Portal Link:</strong> <a href="${loginUrl}" style="color: #0284c7; font-weight: bold;">${loginUrl}</a></p>
        </div>

        ${!isSelfRegistered ? `<!-- Parent Login -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
          <span style="display: block; font-size: 11px; font-weight: bold; color: #050167; text-transform: uppercase; letter-spacing: 0.5px;">Parent / Guardian Portal Credentials</span>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Login Email:</strong> <span style="font-family: monospace; font-size: 13px; color: #001f3f;">${parent?.email || 'N/A'}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Role:</strong> Parent / Guardian (Attendance, Timetable & Watched Classes)</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Portal Link:</strong> <a href="${loginUrl}" style="color: #0284c7; font-weight: bold;">${loginUrl}</a></p>
        </div>` : ''}

        <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          <strong>Security Note:</strong> Please use the password chosen during your initial registration. If you ever need to reset your password, simply click <em>"Forgot password?"</em> on the sign-in page to receive a secure 1-click password reset link.
        </p>
      </div>

      <p style="margin-top: 16px;">${isSelfRegistered
        ? 'Your dedicated IELTS Student Dashboard, class schedule, and live virtual classroom access are now fully active.'
        : "The student's full timetable, homework calendar, and live virtual classroom access are now fully active."}</p>
    `,
    callToAction: {
      label: 'Sign In to Portal Now',
      url: loginUrl
    }
  });

  return await sendEmail({
    to: parent?.email || student?.email,
    subject: `Official Invoice [${invoiceNum}] & Portal Login Credentials — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

export const sendPaymentInvoiceAndCredentials = sendPaymentVerifiedReceipt;

// 4b. Automated 1-Hour Class Reminder Email (Sent to BOTH Student and Linked Parent)
export const sendClassUpcomingReminderEmail = async ({ recipient, recipientRole, student, parent, tutor, classInfo, roomUrl }) => {
  const targetEmail = recipient?.email || student?.email || parent?.email;
  if (!targetEmail) return;

  const isParent = recipientRole === 'parent' || (parent?.email && targetEmail.toLowerCase() === parent.email.toLowerCase() && student?.email && targetEmail.toLowerCase() !== student.email.toLowerCase());
  const recipientName = recipient?.full_name || (isParent ? parent?.full_name : student?.full_name) || 'Student';
  const studentName = student?.full_name || 'your child';
  const tutorName = tutor?.full_name || classInfo?.tutor?.full_name || 'Your Assigned Tutor';
  const classTitle = classInfo?.title || 'Scheduled Live Lecture';
  const schedObj = new Date(classInfo?.scheduled_at || Date.now() + 3600000);
  const scheduledTime = schedObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  const scheduledDate = schedObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/London' });
  const roomCode = classInfo?.meeting_room_id || classInfo?.id || 'ROOM-LIVE';
  const clientUrl = process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk';
  const directRoomUrl = roomUrl || (isParent ? `${clientUrl}/parent/dashboard` : `${clientUrl}/classroom/${roomCode}?as=student`);

  const introText = isParent
    ? `This is an automated reminder that <strong>${studentName}</strong>'s scheduled live interactive class starts in <strong>approximately 1 hour</strong>:`
    : `This is an automated reminder that your scheduled live interactive class begins in <strong>approximately 1 hour</strong>:`;

  const html = buildEmailTemplate({
    headerTitle: 'Live Class Starting in 1 Hour',
    contentHtml: `
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>${introText}</p>
      
      <div class="card" style="border-left: 4px solid #40ffa7; background: #f8fafc;">
        <h3 style="margin: 0 0 8px 0; color: #001f3f; font-size: 16px;">${classTitle}</h3>
        ${isParent ? `<p style="margin: 4px 0;"><strong>Student:</strong> ${studentName}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Course:</strong> ${classInfo?.course?.title || 'Enrolled Course'}</p>
        <p style="margin: 4px 0;"><strong>Assigned Tutor:</strong> ${tutorName}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${scheduledDate}</p>
        <p style="margin: 4px 0;"><strong>Start Time:</strong> ${scheduledTime} UK Time (approx. 60 minutes from now)</p>
        <p style="margin: 4px 0;"><strong>Duration:</strong> ${classInfo?.duration_minutes || 60} Minutes</p>
      </div>

      <div style="margin: 16px 0; padding: 12px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0; font-size: 13px; color: #065f46;">
        <strong>Quick Checklist before joining:</strong>
        <ul style="margin: 6px 0 0 16px; padding: 0;">
          <li>Ensure camera and microphone permissions are allowed in the browser.</li>
          <li>Have a notebook ready for the live interactive whiteboard session.</li>
          <li>Log in 3–5 minutes early to confirm audio and video are ready.</li>
        </ul>
      </div>

      <p>${isParent ? 'You can monitor live class attendance directly from your Parent Portal:' : 'Click the button below to enter your private virtual classroom room:'}</p>
    `,
    callToAction: {
      label: isParent ? 'Open Parent Portal' : 'Enter Virtual Classroom Now',
      url: directRoomUrl
    }
  });

  return await sendEmail({
    to: targetEmail,
    subject: `⏰ 1-Hour Reminder: "${classTitle}" (${scheduledTime} UK) — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

// 4c. Automatic Email When a Tutor Schedules a Live Class (Sent to BOTH Student and Linked Parent)
export const sendClassScheduledEmail = async ({ recipient, recipientRole = 'student', student, tutor, classInfo }) => {
  const targetEmail = recipient?.email;
  if (!targetEmail) return;

  const isParent = recipientRole === 'parent';
  const recipientName = recipient?.full_name || (isParent ? 'Parent / Guardian' : 'Student');
  const studentName = student?.full_name || 'Student';
  const tutorName = tutor?.full_name || classInfo?.tutor?.full_name || 'Your Assigned Tutor';
  const classTitle = classInfo?.title || 'Scheduled Live Class';
  const courseTitle = classInfo?.course?.title || 'Enrolled Course';
  const schedObj = new Date(classInfo?.scheduled_at || Date.now());
  const scheduledDate = schedObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });
  const scheduledTime = schedObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
  const clientUrl = process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk';
  const ctaUrl = isParent ? `${clientUrl}/parent/dashboard` : `${clientUrl}/student/classes`;

  const introLine = isParent
    ? `Your child's assigned tutor, <strong>${tutorName}</strong>, has scheduled a new live class for <strong>${studentName}</strong>:`
    : `Your assigned tutor, <strong>${tutorName}</strong>, has scheduled a new live class for you:`;

  const html = buildEmailTemplate({
    headerTitle: 'New Live Class Scheduled',
    contentHtml: `
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>${introLine}</p>

      <div class="card" style="border-left: 4px solid #050167; background: #f8fafc;">
        <h3 style="margin: 0 0 8px 0; color: #050167; font-size: 16px;">${classTitle}</h3>
        ${isParent ? `<p style="margin: 4px 0;"><strong>Student:</strong> ${studentName}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Course:</strong> ${courseTitle}</p>
        <p style="margin: 4px 0;"><strong>Tutor:</strong> ${tutorName}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${scheduledDate}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${scheduledTime} (UK Time)</p>
        <p style="margin: 4px 0;"><strong>Duration:</strong> ${classInfo?.duration_minutes || 60} Minutes</p>
      </div>

      <p style="font-size: 13px; color: #475569;">
        An automatic reminder email will also be sent <strong>1 hour before the class starts</strong>. When ${tutorName} starts the classroom, the live join button will unlock automatically in the portal.
      </p>
    `,
    callToAction: {
      label: isParent ? 'View Schedule in Parent Portal' : 'View My Live Class Schedule',
      url: ctaUrl
    }
  });

  return await sendEmail({
    to: targetEmail,
    subject: `📅 Live Class Scheduled: "${classTitle}" on ${scheduledDate} at ${scheduledTime} UK — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

// 4d. Automatic Email When a Tutor Starts a Live Class Immediately (Sent to BOTH Student and Linked Parent)
export const sendClassLiveNowEmail = async ({ recipient, recipientRole = 'student', student, tutor, classInfo }) => {
  const targetEmail = recipient?.email;
  if (!targetEmail) return;

  const isParent = recipientRole === 'parent';
  const recipientName = recipient?.full_name || (isParent ? 'Parent / Guardian' : 'Student');
  const studentName = student?.full_name || 'Student';
  const tutorName = tutor?.full_name || classInfo?.tutor?.full_name || 'Your Assigned Tutor';
  const classTitle = classInfo?.title || 'Live Class Session';
  const courseTitle = classInfo?.course?.title || 'Enrolled Course';
  const clientUrl = process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk';
  const roomUrl = isParent
    ? `${clientUrl}/parent/dashboard`
    : `${clientUrl}/classroom/${classInfo?.meeting_room_id}?as=student`;

  const introLine = isParent
    ? `<strong>${tutorName}</strong> has just started a <strong>LIVE classroom session</strong> with <strong>${studentName}</strong>:`
    : `Your assigned tutor, <strong>${tutorName}</strong>, has just started your <strong>LIVE classroom session</strong>. Please join now:`;

  const html = buildEmailTemplate({
    headerTitle: '🔴 Live Class Started Now',
    contentHtml: `
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>${introLine}</p>

      <div class="card" style="border-left: 4px solid #e11d48; background: #fff1f2;">
        <h3 style="margin: 0 0 8px 0; color: #9f1239; font-size: 16px;">${classTitle}</h3>
        ${isParent ? `<p style="margin: 4px 0;"><strong>Student:</strong> ${studentName}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Course:</strong> ${courseTitle}</p>
        <p style="margin: 4px 0;"><strong>Tutor:</strong> ${tutorName}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <strong style="color: #e11d48;">LIVE NOW</strong></p>
      </div>
    `,
    callToAction: {
      label: isParent ? 'Open Parent Portal' : 'Join Live Classroom Now',
      url: roomUrl
    }
  });

  return await sendEmail({
    to: targetEmail,
    subject: `🔴 LIVE NOW: "${classTitle}" with ${tutorName} — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

// 5. Tutor Application Received Confirmation (Applicant)
export const sendTutorApplicationReceived = async ({ applicant }) => {
  const subjectsList = Array.isArray(applicant?.selected_subjects) && applicant.selected_subjects.length > 0
    ? applicant.selected_subjects.join(', ')
    : (Array.isArray(applicant?.subjects) ? applicant.subjects.join(', ') : applicant?.subjects || 'Academic Subjects');

  const html = buildEmailTemplate({
    headerTitle: 'Teacher Application Received',
    contentHtml: `
      <p>Dear <strong>${applicant?.full_name}</strong>,</p>
      <p>Thank you for submitting your application to join the instructional faculty at <strong>Beacon Bridge Academics</strong>.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Application Overview</h3>
        <p style="margin: 4px 0;"><strong>Subjects Applied:</strong> ${subjectsList}</p>
        <p style="margin: 4px 0;"><strong>Safeguarding Policy:</strong> <span class="badge badge-green">Read & Acknowledged</span></p>
        <p style="margin: 4px 0;"><strong>3-Minute Video Submission:</strong> Received & Queued for Evaluation</p>
      </div>

      <p>Our academic superadmin team will review your qualifications, references, and introductory video. We will contact you within 2 business days regarding the next steps.</p>
    `,
    callToAction: {
      label: 'Beacon Bridge Faculty Portal',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/apply-to-teach`
    }
  });

  return await sendEmail({
    to: applicant?.email,
    subject: `Teacher Application Acknowledgment — Beacon Bridge Academics`,
    html,
    senderType: 'admissions'
  });
};

// 5a. Admin Notification: New Tutor Application Submitted
export const sendTutorApplicationAdminAlert = async ({ applicant }) => {
  const subjectsList = Array.isArray(applicant?.selected_subjects) && applicant.selected_subjects.length > 0
    ? applicant.selected_subjects.join(', ')
    : (Array.isArray(applicant?.subjects) ? applicant.subjects.join(', ') : 'A-Level / Curriculum Subjects');
  const reviewUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/admin/tutor-applications`;

  const html = buildEmailTemplate({
    headerTitle: 'New Tutor Application Submitted',
    contentHtml: `
      <p>A new educator has submitted an application via <strong>Teach With Us</strong> and is awaiting Superadmin review:</p>
      
      <div class="card" style="border-left: 4px solid #050167;">
        <h3 style="margin: 0 0 10px 0; color: #050167; font-size: 16px;">Applicant Profile</h3>
        <p style="margin: 4px 0;"><strong>Full Name:</strong> ${applicant?.full_name || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${applicant?.email}">${applicant?.email || 'N/A'}</a></p>
        <p style="margin: 4px 0;"><strong>Phone / WhatsApp:</strong> ${applicant?.phone || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${applicant?.location || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Qualification:</strong> ${applicant?.highest_qualification || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Experience:</strong> ${applicant?.years_experience || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Subjects Applied:</strong> <span class="badge badge-green">${subjectsList}</span></p>
        <p style="margin: 4px 0;"><strong>DBS Status:</strong> ${applicant?.dbs_status || 'Declared'}</p>
        <p style="margin: 4px 0;"><strong>Safeguarding Signed:</strong> ${applicant?.safeguarding_signature || 'Yes'}</p>
        ${applicant?.video_url ? `<p style="margin: 6px 0 0 0;"><strong>3-Min Intro Video:</strong> <a href="${applicant.video_url}" style="color: #0284c7;">Watch Video Submission</a></p>` : ''}
        ${applicant?.cv_url ? `<p style="margin: 4px 0 0 0;"><strong>CV Document:</strong> <a href="${applicant.cv_url}" style="color: #0284c7;">Open Uploaded CV</a></p>` : ''}
      </div>

      ${applicant?.bio ? `<div class="card"><h4 style="margin: 0 0 6px 0; color: #001f3f;">Applicant Bio</h4><p style="margin: 0; font-size: 13px; color: #475569;">${applicant.bio}</p></div>` : ''}

      <p>Review the applicant's video, documents, and safeguarding compliance in the Admin Portal to approve or reject this application.</p>
    `,
    callToAction: {
      label: 'Review Application in Admin Portal',
      url: reviewUrl
    }
  });

  const recipients = [...new Set([DEFAULT_ADMIN_EMAIL, DEFAULT_INFO_EMAIL].filter(Boolean))];
  const results = [];
  for (const recipient of recipients) {
    const res = await sendEmail({
      to: recipient,
      subject: `[NEW TUTOR APPLICATION] ${applicant?.full_name || 'Applicant'} — ${subjectsList}`,
      html,
      senderType: 'admissions',
      replyTo: applicant?.email || undefined
    });
    results.push(res);
  }
  return results[0] || { success: true };
};

// 5b. Tutor Application Approved & Account Provisioned Notification
export const sendTutorApprovalEmail = async ({ applicant, tempPassword }) => {
  const loginUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/login`;
  const subjectsDisplay = Array.isArray(applicant?.selected_subjects) 
    ? applicant.selected_subjects.join(', ') 
    : (Array.isArray(applicant?.subjects) ? applicant.subjects.join(', ') : 'Assigned Academic Curricula');

  const html = buildEmailTemplate({
    headerTitle: 'Welcome to the Beacon Bridge Teaching Faculty',
    contentHtml: `
      <p>Dear <strong>${applicant?.full_name}</strong>,</p>
      <p>We are thrilled to inform you that your application to join the instructional faculty at <strong>Beacon Bridge Academics</strong> has been reviewed and <strong style="color: #059669;">officially approved</strong>!</p>
      
      <div class="card" style="border-left: 4px solid #10b981; background: #ecfdf5;">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px;">Your Faculty Portal Credentials</h3>
        <p style="margin: 4px 0;"><strong>Faculty Role:</strong> Curriculum-Trained Educator & A-Level Specialist</p>
        <p style="margin: 4px 0;"><strong>Assigned Subject(s):</strong> ${subjectsDisplay}</p>
        <p style="margin: 4px 0;"><strong>Portal Login Email:</strong> <span style="font-family: monospace; font-weight: bold;">${applicant?.email}</span></p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-weight: bold; background: #fef08a; padding: 2px 8px; border-radius: 4px; font-size: 15px;">${tempPassword}</span></p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;"><em>For security, please change your password upon your first login via Platform Settings.</em></p>
      </div>

      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 15px;">Next Faculty Steps</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #334155;">
          <li>Log into your <strong>Tutor Portal</strong> to review your course schedules and assigned student lecture halls.</li>
          <li>Familiarize yourself with the <strong>Live Virtual Classroom</strong> and interactive whiteboard tools.</li>
          <li>Review student cohort diagnostic profiles and curriculum roadmaps.</li>
        </ul>
      </div>

      <p>If you have any questions before conducting your first session, please reach out to our Faculty Administration at <a href="mailto:admin@beaconbridgeacademics.co.uk" style="color: #059669;">admin@beaconbridgeacademics.co.uk</a>.</p>
    `,
    callToAction: {
      label: 'Log In to Tutor Portal',
      url: loginUrl
    }
  });

  return await sendEmail({
    to: applicant?.email,
    subject: `Congratulations! Your Faculty Application Has Been Approved — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

// 5c. Tutor Waiting List Confirmation Email (Applicant)
export const sendTutorWaitlistReceived = async ({ entry }) => {
  const safeName = escapeHtml(entry?.full_name || 'Educator');
  const safeRef = escapeHtml(entry?.id || '');
  const subjectsList = Array.isArray(entry?.selected_subjects) && entry.selected_subjects.length > 0
    ? entry.selected_subjects.map((s) => escapeHtml(s)).join(', ')
    : 'A-Level Subjects';

  const html = buildEmailTemplate({
    headerTitle: "You're on the Tutor Waiting List",
    contentHtml: `
      <p>Dear <strong>${safeName}</strong>,</p>
      <p>Thank you for registering your interest in teaching with <strong>Beacon Bridge Academics</strong>. We've received your details and added you to our priority <strong>Tutor Waiting List</strong>.</p>

      <div class="card" style="border-left: 4px solid #10b981;">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Waitlist Registration Summary</h3>
        <p style="margin: 4px 0;"><strong>Reference ID:</strong> <span style="font-family: monospace;">${safeRef}</span></p>
        <p style="margin: 4px 0;"><strong>A-Level Subject Specialisms:</strong> ${subjectsList}</p>
        <p style="margin: 4px 0;"><strong>3-Minute Video Intro:</strong> <span class="badge badge-green">Received for Panel Review</span></p>
        <p style="margin: 4px 0;"><strong>Safeguarding Policy (v2.4):</strong> <span class="badge badge-green">Acknowledged & Signed</span></p>
      </div>

      <p><strong>What happens next?</strong></p>
      <p>We are launching soon and will review your profile and 3-minute introductory video as onboarding opens. You will be among the first educators we contact when positions open up.</p>
      <p style="font-size: 12px; color: #64748b;"><em>Please note: joining the tutor waiting list does not guarantee a position or constitute an offer of employment. Full Enhanced DBS vetting and verification are completed if you are invited to onboard.</em></p>
      <p>We're excited to have you with us!</p>
    `
  });

  return await sendEmail({
    to: entry?.email,
    subject: `You're on the Tutor Waiting List — Beacon Bridge Academics`,
    html,
    senderType: 'admissions'
  });
};

// 5d. Admin Notification: New Tutor Joined the Waiting List
export const sendTutorWaitlistAdminAlert = async ({ entry }) => {
  const safeName = escapeHtml(entry?.full_name || 'N/A');
  const safeEmail = escapeHtml(entry?.email || 'N/A');
  const safePhone = escapeHtml(entry?.phone || 'N/A');
  const safeLocation = escapeHtml(entry?.location || 'N/A');
  const safeQual = escapeHtml(entry?.highest_qualification || 'N/A');
  const safeRole = escapeHtml(entry?.current_role || entry?.current_position || 'N/A');
  const safeExp = escapeHtml(entry?.years_experience || 'N/A');
  const safeDbs = escapeHtml(entry?.dbs_status || 'Declared');
  const safeDbsCert = entry?.dbs_certificate_number ? escapeHtml(entry.dbs_certificate_number) : '';
  const safeSig = escapeHtml(entry?.safeguarding_signature || 'Signed');
  const safeApproach = entry?.teaching_approach ? escapeHtml(entry.teaching_approach) : '';
  const subjectsList = Array.isArray(entry?.selected_subjects) && entry.selected_subjects.length > 0
    ? entry.selected_subjects.map((s) => escapeHtml(s)).join(', ')
    : 'A-Level Subjects';

  const baseApiUrl = process.env.SERVER_PUBLIC_URL || 'https://beaconbridge-server-production.up.railway.app';
  const resolveDocUrl = (u) => (!u ? '' : u.startsWith('http') ? u : `${baseApiUrl}${u}`);
  const reviewUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/admin/tutor-waitlist`;

  const html = buildEmailTemplate({
    headerTitle: 'New Tutor Waitlist Registration',
    contentHtml: `
      <p>A new A-Level educator has joined the <strong>Tutor Waiting List</strong> via <strong>tutors.beaconbridgeacademics.co.uk</strong>:</p>

      <div class="card" style="border-left: 4px solid #050167;">
        <h3 style="margin: 0 0 10px 0; color: #050167; font-size: 16px;">Waitlisted Educator Profile</h3>
        <p style="margin: 4px 0;"><strong>Full Legal Name:</strong> ${safeName}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p style="margin: 4px 0;"><strong>Phone / WhatsApp:</strong> ${safePhone}</p>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${safeLocation}</p>
        <p style="margin: 4px 0;"><strong>Qualification:</strong> ${safeQual}</p>
        <p style="margin: 4px 0;"><strong>Current Role & Experience:</strong> ${safeRole} (${safeExp})</p>
        <p style="margin: 4px 0;"><strong>A-Level Subjects:</strong> <span class="badge badge-green">${subjectsList}</span></p>
        <p style="margin: 4px 0;"><strong>DBS Status:</strong> ${safeDbs}${safeDbsCert ? ` (Cert: ${safeDbsCert})` : ''}</p>
        <p style="margin: 4px 0;"><strong>Safeguarding v2.4 Signed:</strong> ${safeSig}</p>
        ${entry?.video_url ? `<p style="margin: 8px 0 0 0;"><strong>3-Min Intro Video:</strong> <a href="${escapeHtml(entry.video_url)}" style="color: #0284c7;">Watch Video Submission</a></p>` : ''}
        ${entry?.cv_url ? `<p style="margin: 4px 0 0 0;"><strong>CV / Resume:</strong> <a href="${escapeHtml(resolveDocUrl(entry.cv_url))}" style="color: #0284c7;">Open Uploaded CV</a></p>` : ''}
        ${entry?.degree_certificate_url ? `<p style="margin: 4px 0 0 0;"><strong>Degree Certificate:</strong> <a href="${escapeHtml(resolveDocUrl(entry.degree_certificate_url))}" style="color: #0284c7;">Open Degree Certificate</a></p>` : ''}
        ${entry?.teaching_licence_url ? `<p style="margin: 4px 0 0 0;"><strong>Teaching Licence / QTS:</strong> <a href="${escapeHtml(resolveDocUrl(entry.teaching_licence_url))}" style="color: #0284c7;">Open Licence</a></p>` : ''}
      </div>

      ${safeApproach ? `<div class="card"><h4 style="margin: 0 0 6px 0; color: #001f3f;">Pedagogical Statement</h4><p style="margin: 0; font-size: 13px; color: #475569;">${safeApproach}</p></div>` : ''}

      <p>Open the <strong>Tutor Waitlist</strong> section in the Superadmin Portal to review their 3-minute video, shortlist, or invite them when onboarding opens.</p>
    `,
    callToAction: {
      label: 'View in Tutor Waitlist Portal',
      url: reviewUrl
    }
  });

  const recipients = [...new Set([DEFAULT_ADMIN_EMAIL, DEFAULT_INFO_EMAIL].filter(Boolean))];
  const results = [];
  for (const recipient of recipients) {
    const res = await sendEmail({
      to: recipient,
      subject: `[TUTOR WAITLIST] ${entry?.full_name || 'New Tutor'} — ${Array.isArray(entry?.selected_subjects) ? entry.selected_subjects.slice(0, 3).join(', ') : 'A-Level'}`,
      html,
      senderType: 'admissions',
      replyTo: entry?.email || undefined
    });
    results.push(res);
  }
  return results[0] || { success: true };
};

// 5e. Tutor Waitlist Onboarding Invitation Email (Sent when Admin invites a waitlisted tutor)
export const sendTutorWaitlistInviteEmail = async ({ entry, customMessage = '' }) => {
  const safeName = escapeHtml(entry?.full_name || 'Educator');
  const safeCustom = customMessage ? escapeHtml(customMessage) : '';
  const subjectsList = Array.isArray(entry?.selected_subjects) && entry.selected_subjects.length > 0
    ? entry.selected_subjects.map((s) => escapeHtml(s)).join(', ')
    : 'A-Level Subjects';
  const applyUrl = `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/apply-to-teach`;

  const html = buildEmailTemplate({
    headerTitle: 'You Are Invited to Onboard — Beacon Bridge Academics',
    contentHtml: `
      <p>Dear <strong>${safeName}</strong>,</p>
      <p>Great news! Tutor onboarding is now open at <strong>Beacon Bridge Academics</strong>, and following our review of your waiting list profile and 3-minute video introduction, we would love to invite you to the next stage of onboarding for <strong>${subjectsList}</strong>.</p>

      ${safeCustom ? `<div class="card" style="border-left: 4px solid #050167;"><h4 style="margin: 0 0 6px 0; color: #050167;">Message from Our Admissions Team</h4><p style="margin: 0; font-size: 13px; color: #334155;">${safeCustom}</p></div>` : ''}

      <div class="card" style="border-left: 4px solid #10b981; background: #ecfdf5;">
        <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 15px;">Next Onboarding Steps</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #334155;">
          <li>Reply directly to this email with your availability for a short onboarding & vetting check.</li>
          <li>Have your Enhanced DBS details (or Update Service number) and proof of ID ready for statutory verification.</li>
          <li>Once vetting is complete, your official Beacon Bridge Tutor Portal credentials will be issued.</li>
        </ul>
      </div>

      <p>If you have any questions, reply to this email or contact us at <a href="mailto:${DEFAULT_INFO_EMAIL}" style="color: #059669;">${DEFAULT_INFO_EMAIL}</a>.</p>
    `,
    callToAction: {
      label: 'Visit Beacon Bridge Academics',
      url: applyUrl
    }
  });

  return await sendEmail({
    to: entry?.email,
    subject: `Onboarding Invitation — Beacon Bridge Academics Tutor Faculty`,
    html,
    senderType: 'admissions',
    replyTo: DEFAULT_INFO_EMAIL
  });
};

// 6. Direct Tutor Message to Student / Parent (Dynamic tutor.{name}@beaconbridgeacademics.co.uk)
export const sendTutorMessage = async ({ tutor, student, parent, subject, messageBody, classInfo }) => {
  const recipientEmail = student?.email || parent?.email;
  const tutorName = tutor?.full_name || 'Your Assigned Tutor';

  const html = buildEmailTemplate({
    headerTitle: `Message from ${tutorName}`,
    contentHtml: `
      <p>Dear <strong>${student?.full_name || 'Student'}</strong>,</p>
      <p>Your tutor, <strong>${tutorName}</strong>, has sent you an academic update regarding <em>${classInfo?.title || 'your coursework'}</em>:</p>
      
      <div class="card" style="border-left: 4px solid #059669; font-style: italic;">
        "${messageBody}"
      </div>

      <p>You can reply directly to this email to contact ${tutorName}, or log in to your live classroom workspace.</p>
    `,
    callToAction: {
      label: 'Open Virtual Classroom',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/student/dashboard`
    }
  });

  return await sendEmail({
    to: recipientEmail,
    subject: `[Tutor Note] ${subject || 'Academic Feedback'} — ${tutorName}`,
    html,
    text: messageBody,
    senderType: 'tutor',
    tutor
  });
};

// 7. Academic Consultation Booking Notification (Dispatched to info@beaconbridgeacademics.co.uk & Parent)
export const sendConsultationBookingNotifications = async (consultation) => {
  const infoEmail = process.env.SUPPORT_EMAIL || 'info@beaconbridgeacademics.co.uk';

  // 1. Email to Platform Operations & Info Inbox (info@beaconbridgeacademics.co.uk)
  const staffHtml = buildEmailTemplate({
    headerTitle: 'New 1-on-1 Academic Consultation Booked',
    contentHtml: `
      <p>A new UK 1-on-1 academic consultation has been scheduled through the Beacon Bridge Academics portal.</p>
      
      <div class="card" style="border-left: 4px solid #059669;">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px;">Consultation Appointment Details</h3>
        <p style="margin: 4px 0;"><strong>Advisor:</strong> ${consultation.consultant_name || 'Mr. Gideon Babs'}</p>
        <p style="margin: 4px 0;"><strong>Scheduled Slot:</strong> <span class="badge badge-gold">${consultation.consultation_day} &bull; ${consultation.consultation_time}</span></p>
        <p style="margin: 4px 0;"><strong>Specific Date:</strong> ${consultation.consultation_date || 'Upcoming'}</p>
        <p style="margin: 4px 0;"><strong>Format / Mode:</strong> ${consultation.mode || 'Live Interactive Video'}</p>
      </div>

      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 15px;">Parent & Student Information</h3>
        <p style="margin: 4px 0;"><strong>Parent / Guardian:</strong> ${consultation.parent_name}</p>
        <p style="margin: 4px 0;"><strong>Student Name:</strong> ${consultation.student_name}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${consultation.email}">${consultation.email}</a></p>
        <p style="margin: 4px 0;"><strong>UK Phone / WhatsApp:</strong> <a href="tel:${consultation.phone}">${consultation.phone}</a></p>
        <p style="margin: 4px 0;"><strong>Curriculum & Level:</strong> ${consultation.curriculum}</p>
        <p style="margin: 4px 0;"><strong>Subject(s):</strong> ${consultation.subjects || 'General Academic Assessment'}</p>
        <p style="margin: 4px 0;"><strong>Exam Board:</strong> ${consultation.exam_board || 'AQA / Edexcel'}</p>
        <p style="margin: 4px 0;"><strong>Current Grade:</strong> ${consultation.current_grade || 'N/A'} &rarr; <strong>Target Grade:</strong> ${consultation.target_grade || 'N/A'}</p>
        ${consultation.notes ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px dashed #cbd5e1;"><strong>Specific Learning Notes / Goals:</strong><br/><em>"${consultation.notes}"</em></p>` : ''}
      </div>
    `,
    callToAction: {
      label: 'Open Admin Portal',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/admin/dashboard`
    }
  });

  // 2. Email Confirmation to Parent / Student
  const parentHtml = buildEmailTemplate({
    headerTitle: 'Academic Consultation Confirmed',
    contentHtml: `
      <p>Dear <strong>${consultation.parent_name}</strong>,</p>
      <p>Thank you for scheduling a private academic consultation for <strong>${consultation.student_name}</strong> with <strong>Beacon Bridge Academics</strong>.</p>
      
      <div class="card" style="background: #ecfdf5; border-color: #a7f3d0;">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px;">Confirmed Appointment Details</h3>
        <p style="margin: 4px 0;"><strong>Academic Advisor:</strong> ${consultation.consultant_name || 'Mr. Gideon Babs (Head of Academic Advisory)'}</p>
        <p style="margin: 4px 0;"><strong>Day & Time:</strong> <span class="badge badge-green">${consultation.consultation_day} &bull; ${consultation.consultation_time}</span></p>
        <p style="margin: 4px 0;"><strong>Curriculum / Target:</strong> ${consultation.curriculum} &bull; ${consultation.subjects || 'All Core Subjects'}</p>
        <p style="margin: 4px 0;"><strong>Exam Board:</strong> ${consultation.exam_board || 'AQA / Edexcel'}</p>
        <p style="margin: 4px 0;"><strong>Format:</strong> ${consultation.mode || 'Live Interactive Video'}</p>
        <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <code style="font-weight: 800; color: #065f46;">BBA-CNS-${consultation.id?.substring(0, 8)?.toUpperCase()}</code></p>
      </div>

      <div class="card">
        <h4 style="margin: 0 0 8px 0; color: #1e3a8a;">What to expect during the consultation:</h4>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>A comprehensive review of ${consultation.student_name}'s current academic performance and exam board requirements.</li>
          <li>Identification of syllabus knowledge gaps, exam technique hurdles, and revision timelines.</li>
          <li>A tailored tuition plan and matching with an Oxford/Cambridge or Russell Group subject specialist tutor.</li>
        </ul>
      </div>

      <p>Our advisor will send a direct meeting link 24 hours prior to the session. If you have any questions or need to reschedule, please email <a href="mailto:info@beaconbridgeacademics.co.uk" style="color: #059669;">info@beaconbridgeacademics.co.uk</a>.</p>
    `,
    callToAction: {
      label: 'Visit Beacon Bridge Academics',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}`
    }
  });

  // Dispatch staff notification to info@beaconbridgeacademics.co.uk
  const staffNotice = await sendEmail({
    to: infoEmail,
    subject: `[New Consultation Booked] ${consultation.student_name} (${consultation.curriculum}) — ${consultation.consultation_day} ${consultation.consultation_time}`,
    html: staffHtml,
    senderType: 'admissions',
    replyTo: consultation.email
  });

  // Dispatch confirmation to parent
  let parentNotice = { success: true };
  if (consultation.email) {
    parentNotice = await sendEmail({
      to: consultation.email,
      subject: `Consultation Confirmed: ${consultation.student_name} with Beacon Bridge Academics`,
      html: parentHtml,
      senderType: 'admissions'
    });
  }

  return { staffNotice, parentNotice };
};

// 8. Public Contact Us Academic Enquiry -> Direct to info@beaconbridgeacademics.co.uk
export const sendContactInquiryEmail = async ({ name, email, phone, curriculum, subject, message }) => {
  const infoEmail = DEFAULT_INFO_EMAIL;
  const safeName = escapeHtml((name || 'Website Visitor').trim());
  const safeEmail = escapeHtml((email || '').trim());
  const rawEmail = stripHeaderBreaks(email || '');
  const safePhone = escapeHtml((phone || 'Not provided').trim());
  const safeCurriculum = escapeHtml((curriculum || 'General').trim());
  const safeSubject = escapeHtml((subject || 'General Academic Enquiry').trim());
  const safeMessage = escapeHtml((message || '').trim()).replace(/\n/g, '<br/>');

  const staffHtml = buildEmailTemplate({
    headerTitle: 'New Website Contact Enquiry',
    contentHtml: `
      <p>A new enquiry has been submitted through the <strong>Contact Us</strong> page on Beacon Bridge Academics:</p>
      <div class="card" style="border-left: 4px solid #050167;">
        <h3 style="margin: 0 0 10px 0; color: #050167; font-size: 16px;">Sender &amp; Academic Details</h3>
        <p style="margin: 4px 0;"><strong>Full Name:</strong> ${safeName}</p>
        <p style="margin: 4px 0;"><strong>Email Address:</strong> <a href="mailto:${safeEmail}" style="color: #0284c7;">${safeEmail}</a></p>
        <p style="margin: 4px 0;"><strong>Phone / WhatsApp:</strong> ${safePhone}</p>
        <p style="margin: 4px 0;"><strong>Target Level:</strong> <span class="badge badge-green">${safeCurriculum}</span></p>
        <p style="margin: 4px 0;"><strong>Subject(s) Needed:</strong> ${safeSubject}</p>
        <p style="margin: 4px 0;"><strong>Submitted At:</strong> ${new Date().toLocaleString('en-GB')}</p>
      </div>
      <div class="card" style="background: #ffffff; border-left: 4px solid #059669;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">Enquiry Message</h4>
        <p style="margin: 0; color: #1e293b; line-height: 1.65;">${safeMessage}</p>
      </div>
      <p style="font-size: 12px; color: #64748b;">Tip: Click <strong>Reply</strong> in your inbox to respond directly to <strong>${safeEmail}</strong>.</p>
    `
  });

  const staffNotice = await sendEmail({
    to: infoEmail,
    subject: `[Contact Enquiry] ${stripHeaderBreaks(name || 'Visitor')} — ${stripHeaderBreaks(curriculum || 'General')} (${stripHeaderBreaks(subject || 'Enquiry')})`,
    html: staffHtml,
    text: `New Contact Enquiry\nName: ${name || ''}\nEmail: ${rawEmail}\nPhone: ${phone || 'Not provided'}\nLevel: ${curriculum || 'General'}\nSubject(s): ${subject || 'General'}\n\nMessage:\n${message || ''}`,
    senderType: 'info',
    replyTo: rawEmail || infoEmail
  });

  // Send acknowledgement to sender so they know info@ received it
  let senderAck = { success: true };
  if (rawEmail) {
    const ackHtml = buildEmailTemplate({
      headerTitle: 'We Have Received Your Enquiry',
      contentHtml: `
        <p>Dear <strong>${safeName}</strong>,</p>
        <p>Thank you for contacting <strong>Beacon Bridge Academics</strong>. Your academic enquiry has been delivered directly to our team at <a href="mailto:${infoEmail}" style="color: #059669;">${infoEmail}</a>.</p>
        <div class="card">
          <p style="margin: 4px 0;"><strong>Target Level:</strong> ${safeCurriculum}</p>
          <p style="margin: 4px 0;"><strong>Subject(s):</strong> ${safeSubject}</p>
          <p style="margin: 8px 0 0 0; color: #475569;"><strong>Your Message:</strong><br/>${safeMessage}</p>
        </div>
        <p>An academic coordinator will review your enquiry and reply within one business day. For urgent enquiries, you can also reach us on WhatsApp at <strong>+44 7414 663735</strong>.</p>
      `,
      callToAction: {
        label: 'Book a Free 20-Min Consultation',
        url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/book-consultation`
      }
    });

    senderAck = await sendEmail({
      to: rawEmail,
      subject: 'Thank You for Contacting Beacon Bridge Academics',
      html: ackHtml,
      senderType: 'info',
      replyTo: infoEmail
    });
  }

  return { staffNotice, senderAck };
};

export default {
  sendEmail,
  resolveSenderIdentity,
  sendRegistrationWelcome,
  sendIeltsRegistrationWelcome,
  sendPaymentProofSubmitted,
  sendPaymentProofAdminAlert,
  sendPaymentVerifiedReceipt,
  sendTutorApplicationReceived,
  sendTutorApplicationAdminAlert,
  sendTutorApprovalEmail,
  sendTutorMessage,
  sendConsultationBookingNotifications,
  sendContactInquiryEmail
};
