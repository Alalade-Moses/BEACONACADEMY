import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Global domain & default addresses
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'beaconbridgeacademics.co.uk';
const DEFAULT_INFO_EMAIL = process.env.SUPPORT_EMAIL || `info@${EMAIL_DOMAIN}`;
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || `admin@${EMAIL_DOMAIN}`;
const DEFAULT_ADMISSIONS_EMAIL = process.env.ADMISSIONS_EMAIL || `admissions@${EMAIL_DOMAIN}`;

// Configure Hostinger SMTP Transporter
// Hostinger standard SMTP settings:
// Host: smtp.hostinger.com (or smtp.titan.email)
// Port: 465 (SSL) or 587 (TLS)
// Auth: User & Password created in Hostinger hPanel
export const createTransporter = () => {
  const host = (process.env.SMTP_HOST || 'smtp.hostinger.com').trim();
  const port = parseInt(process.env.SMTP_PORT, 10) || 465;
  const user = (process.env.SMTP_USER || DEFAULT_INFO_EMAIL).trim();
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : null;

  if (!pass) {
    // Development / safe preview mode when SMTP password is not yet configured
    console.warn('[EmailService] SMTP_PASS not set. Emails logged in console preview mode.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for 587
    auth: {
      user,
      pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Diagnostic helper to test Hostinger SMTP authentication directly
 */
export const testSmtpConnection = async () => {
  const transporter = createTransporter();
  if (!transporter) {
    return {
      connected: false,
      message: 'SMTP_PASS environment variable is missing in server environment.'
    };
  }

  try {
    await transporter.verify();
    return {
      connected: true,
      message: `Hostinger SMTP connection verified successfully for ${process.env.SMTP_USER || DEFAULT_INFO_EMAIL}`
    };
  } catch (err) {
    console.error('[SMTP Verification Error]:', err.message);
    return {
      connected: false,
      error: err.message,
      code: err.code || null,
      response: err.response || null
    };
  }
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
    const from = customFrom || sender.fromHeader;
    const resolvedReplyTo = replyTo || sender.replyTo;

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
      to,
      replyTo: resolvedReplyTo,
      subject,
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
      <p>Beacon Bridge Academics</p>
      <h1>${headerTitle}</h1>
    </div>
    <div class="content">
      ${contentHtml}
      ${callToAction ? `<div style="text-align: center; margin: 24px 0;"><a href="${callToAction.url}" class="button">${callToAction.label}</a></div>` : ''}
    </div>
    <div class="footer">
      <p><strong>Beacon Bridge Academics Ltd</strong> &bull; United Kingdom</p>
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
  const monthlyFee = amount || '300.00';

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

      <p>To finalize your enrollment and activate live classroom access, please transfer the monthly tuition to our UK bank account and submit your proof of payment on the portal:</p>
      
      <div class="card" style="background: #ecfdf5; border-color: #a7f3d0;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">UK Bank Transfer Details:</h4>
        <p style="margin: 2px 0;"><strong>Bank:</strong> Barclays Bank UK</p>
        <p style="margin: 2px 0;"><strong>Account Name:</strong> Beacon Bridge Academics Ltd</p>
        <p style="margin: 2px 0;"><strong>Sort Code:</strong> 20-00-00</p>
        <p style="margin: 2px 0;"><strong>Account Number:</strong> 55443322</p>
        <p style="margin: 2px 0;"><strong>Payment Reference:</strong> ${student?.full_name ? student.full_name.toUpperCase().replace(/\s+/g, '-') : 'TUITION'}</p>
      </div>
    `,
    callToAction: {
      label: 'Submit Proof of Payment',
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

// 2. Payment Proof Received Confirmation (Parent)
export const sendPaymentProofSubmitted = async ({ parent, student, payment }) => {
  const html = buildEmailTemplate({
    headerTitle: 'Payment Proof Received',
    contentHtml: `
      <p>Dear <strong>${parent?.full_name || 'Parent/Guardian'}</strong>,</p>
      <p>We have successfully received your proof of payment for <strong>${payment?.course_display_name || 'Tuition'}</strong>.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Submission Details</h3>
        <p style="margin: 4px 0;"><strong>Enrolled Program:</strong> ${payment?.course_display_name || 'Software Development'}</p>
        <p style="margin: 4px 0;"><strong>Monthly Tuition:</strong> £${payment?.amount || '300.00'} GBP / month</p>
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
        <p style="margin: 4px 0;"><strong>Monthly Tuition:</strong> £${payment?.amount || '300.00'} GBP / month</p>
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

  const html = buildEmailTemplate({
    headerTitle: 'Official Payment Invoice & Portal Credentials',
    contentHtml: `
      <p>Dear <strong>${parent?.full_name || 'Parent/Guardian'}</strong>,</p>
      <p>Thank you for your payment. We are pleased to confirm that your tuition payment of <strong>£${payment?.amount || '300.00'} GBP</strong> has been <span class="badge badge-green">Verified & Confirmed</span> by Beacon Bridge Academics administration.</p>
      
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
            <td style="padding: 4px 0;"><strong>Student Enrolled:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${student?.full_name || 'Enrolled Student'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Parent / Guardian:</strong></td>
            <td style="padding: 4px 0; text-align: right;">${parent?.full_name || 'Parent'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Payment Method:</strong></td>
            <td style="padding: 4px 0; text-align: right;">Barclays Bank Wire Transfer (Verified)</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td style="padding: 8px 0; font-size: 15px;"><strong>Total Paid:</strong></td>
            <td style="padding: 8px 0; text-align: right; font-size: 16px; font-weight: bold; color: #050167;">£${payment?.amount || '300.00'} GBP</td>
          </tr>
        </table>
      </div>

      <!-- Credentials Box for Parent & Student -->
      <div class="card" style="border-left: 4px solid #40ffa7; background: #f0faff; margin-top: 16px;">
        <h3 style="margin: 0 0 10px 0; color: #001f3f; font-size: 15px;">🔑 Official Portal Access & Login Details</h3>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569;">
          Both parent and student accounts are fully active. Use the credentials below to sign in:
        </p>

        <!-- Student Login -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
          <span style="display: block; font-size: 11px; font-weight: bold; color: #050167; text-transform: uppercase; letter-spacing: 0.5px;">Student Portal Credentials</span>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Login Email:</strong> <span style="font-family: monospace; font-size: 13px; color: #001f3f;">${student?.email || 'N/A'}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Role:</strong> Student (Live Classroom, Whiteboard & Assignments)</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Portal Link:</strong> <a href="${loginUrl}" style="color: #0284c7; font-weight: bold;">${loginUrl}</a></p>
        </div>

        <!-- Parent Login -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px;">
          <span style="display: block; font-size: 11px; font-weight: bold; color: #050167; text-transform: uppercase; letter-spacing: 0.5px;">Parent / Guardian Portal Credentials</span>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Login Email:</strong> <span style="font-family: monospace; font-size: 13px; color: #001f3f;">${parent?.email || 'N/A'}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Role:</strong> Parent / Guardian (Attendance, Timetable & Watched Classes)</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Portal Link:</strong> <a href="${loginUrl}" style="color: #0284c7; font-weight: bold;">${loginUrl}</a></p>
        </div>

        <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          <strong>Security Note:</strong> Please use the password chosen during your initial registration. If you ever need to reset your password, simply click <em>"Forgot password?"</em> on the sign-in page to receive a secure 1-click password reset link.
        </p>
      </div>

      <p style="margin-top: 16px;">The student's full timetable, homework calendar, and live virtual classroom access are now fully active.</p>
    `,
    callToAction: {
      label: 'Sign In to Portal Now',
      url: loginUrl
    }
  });

  return await sendEmail({
    to: parent?.email,
    subject: `Official Invoice [${invoiceNum}] & Portal Login Credentials — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

export const sendPaymentInvoiceAndCredentials = sendPaymentVerifiedReceipt;

// 4b. Automated 1-Hour Class Reminder Email
export const sendClassUpcomingReminderEmail = async ({ recipient, student, parent, tutor, classInfo, roomUrl }) => {
  const targetEmail = recipient?.email || student?.email || parent?.email;
  if (!targetEmail) return;

  const recipientName = recipient?.full_name || student?.full_name || 'Student';
  const tutorName = tutor?.full_name || classInfo?.tutor?.full_name || 'Your Assigned Tutor';
  const classTitle = classInfo?.title || 'Scheduled Live Lecture';
  const scheduledTime = new Date(classInfo?.scheduled_at || Date.now() + 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const scheduledDate = new Date(classInfo?.scheduled_at || Date.now() + 3600000).toLocaleDateString();
  const directRoomUrl = roomUrl || `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/classroom/${classInfo?.id || 'ROOM-LIVE'}`;

  const html = buildEmailTemplate({
    headerTitle: 'Live Class Starting in 1 Hour',
    contentHtml: `
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>This is an automated reminder that your scheduled live interactive class begins in <strong>approximately 1 hour</strong>:</p>
      
      <div class="card" style="border-left: 4px solid #40ffa7; background: #f8fafc;">
        <h3 style="margin: 0 0 8px 0; color: #001f3f; font-size: 16px;">${classTitle}</h3>
        <p style="margin: 4px 0;"><strong>Course:</strong> ${classInfo?.course?.title || 'Enrolled Course'}</p>
        <p style="margin: 4px 0;"><strong>Tutor:</strong> ${tutorName}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${scheduledDate}</p>
        <p style="margin: 4px 0;"><strong>Start Time:</strong> ${scheduledTime} UK GMT (approx. 60 minutes from now)</p>
        <p style="margin: 4px 0;"><strong>Duration:</strong> ${classInfo?.duration_minutes || 60} Minutes</p>
      </div>

      <div style="margin: 16px 0; padding: 12px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0; font-size: 13px; color: #065f46;">
        <strong>Quick Checklist before joining:</strong>
        <ul style="margin: 6px 0 0 16px; padding: 0;">
          <li>A working microphone and camera are recommended.</li>
          <li>Have your notebook or stylus ready for the interactive whiteboard.</li>
          <li>Join 3–5 minutes early to test your audio connection.</li>
        </ul>
      </div>

      <p>Click the button below to enter your private virtual classroom room directly:</p>
    `,
    callToAction: {
      label: 'Enter Virtual Classroom Now',
      url: directRoomUrl
    }
  });

  return await sendEmail({
    to: targetEmail,
    subject: `⏰ Reminder: "${classTitle}" starts in 1 hour (${scheduledTime} UK GMT) — Beacon Bridge Academics`,
    html,
    senderType: 'admin'
  });
};

// 5. Tutor Application Received Confirmation
export const sendTutorApplicationReceived = async ({ applicant }) => {
  const html = buildEmailTemplate({
    headerTitle: 'Teacher Application Received',
    contentHtml: `
      <p>Dear <strong>${applicant?.full_name}</strong>,</p>
      <p>Thank you for submitting your application to join the instructional faculty at <strong>Beacon Bridge Academics</strong>.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Application Overview</h3>
        <p style="margin: 4px 0;"><strong>Subjects Applied:</strong> ${Array.isArray(applicant?.subjects) ? applicant.subjects.join(', ') : applicant?.subjects || 'Academic Subjects'}</p>
        <p style="margin: 4px 0;"><strong>Safeguarding Policy:</strong> <span class="badge badge-green">Read & Acknowledged</span></p>
        <p style="margin: 4px 0;"><strong>3-Minute Video Submission:</strong> Received & Queued for Evaluation</p>
      </div>

      <p>Our academic superadmin team will review your qualifications, references, and introductory video. We will contact you within 2 business days regarding the next steps.</p>
    `,
    callToAction: {
      label: 'Beacon Bridge Faculty Portal',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/apply-tutor`
    }
  });

  return await sendEmail({
    to: applicant?.email,
    subject: `Teacher Application Acknowledgment — Beacon Bridge Academics`,
    html,
    senderType: 'admissions'
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
        <p style="margin: 4px 0;"><strong>Advisor:</strong> ${consultation.consultant_name || 'Dr. Sarah Jenkins'}</p>
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
        <p style="margin: 4px 0;"><strong>Academic Advisor:</strong> ${consultation.consultant_name || 'Dr. Sarah Jenkins (Head of Academic Advisory)'}</p>
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

export default {
  sendEmail,
  resolveSenderIdentity,
  sendRegistrationWelcome,
  sendPaymentProofSubmitted,
  sendPaymentProofAdminAlert,
  sendPaymentVerifiedReceipt,
  sendTutorApplicationReceived,
  sendTutorMessage,
  sendConsultationBookingNotifications
};
