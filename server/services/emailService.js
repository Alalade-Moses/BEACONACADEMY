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
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 465;
  const user = process.env.SMTP_USER || DEFAULT_INFO_EMAIL;
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    // Development / safe preview mode when SMTP password is not yet configured
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
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Format dynamic sender identity based on sender role and tutor identity.
 * Rule:
 *  - If tutor: tutor.{name}@beaconbridgeacademics.co.uk (e.g. tutor.sarah@...)
 *  - If admin: admin@beaconbridgeacademics.co.uk
 *  - If info / billing: info@beaconbridgeacademics.co.uk
 */
export const resolveSenderIdentity = (senderType = 'admin', tutor = null) => {
  const domain = EMAIL_DOMAIN;
  const primaryAuthUser = process.env.SMTP_USER || `info@${domain}`;

  if (senderType === 'tutor' && tutor) {
    const rawName = tutor.full_name || tutor.name || 'tutor';
    // Clean name: remove Dr./Prof., keep letters/numbers, lowercase
    const cleanName = rawName
      .toLowerCase()
      .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '')
      .trim()
      .split(/\s+/)[0] // First name e.g. 'sarah'
      .replace(/[^a-z0-9]/g, '');

    const tutorSenderAddress = `tutor.${cleanName || 'academic'}@${domain}`;
    const displayName = `${tutor.full_name || 'Tutor'} | Beacon Bridge Academics`;

    return {
      address: tutorSenderAddress,
      displayName,
      // For SMTP relay integrity on Hostinger, the From header uses the formatted alias
      // while replyTo guarantees student/parent replies go straight to tutor
      fromHeader: `"${displayName}" <${tutorSenderAddress}>`,
      replyTo: tutor.email || tutorSenderAddress
    };
  }

  if (senderType === 'admin') {
    const adminAddress = `admin@${domain}`;
    const displayName = 'Beacon Bridge Administration';
    return {
      address: adminAddress,
      displayName,
      fromHeader: `"${displayName}" <${adminAddress}>`,
      replyTo: primaryAuthUser
    };
  }

  if (senderType === 'admissions') {
    const admissionsAddress = `admissions@${domain}`;
    const displayName = 'Beacon Bridge Admissions & Student Services';
    return {
      address: admissionsAddress,
      displayName,
      fromHeader: `"${displayName}" <${admissionsAddress}>`,
      replyTo: primaryAuthUser
    };
  }

  // Default: Info / Support
  const infoAddress = `info@${domain}`;
  const displayName = 'Beacon Bridge Academics';
  return {
    address: infoAddress,
    displayName,
    fromHeader: `"${displayName}" <${infoAddress}>`,
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

// 4. Payment Verified & Full Enrollment Receipt
export const sendPaymentVerifiedReceipt = async ({ payment, student, parent }) => {
  const html = buildEmailTemplate({
    headerTitle: 'Official Payment Receipt & Course Activation',
    contentHtml: `
      <p>Dear <strong>${parent?.full_name || 'Parent/Guardian'}</strong>,</p>
      <p>We are delighted to confirm that your monthly tuition payment of <strong>£${payment?.amount || '300.00'} GBP</strong> has been <span class="badge badge-green">Verified & Approved</span>.</p>
      
      <div class="card">
        <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">Receipt Details</h3>
        <p style="margin: 4px 0;"><strong>Receipt Number:</strong> RCP-${Date.now().toString().slice(-8)}</p>
        <p style="margin: 4px 0;"><strong>Program:</strong> ${payment?.course_display_name || 'Course'}</p>
        <p style="margin: 4px 0;"><strong>Tuition Period:</strong> Monthly Tuition (Active)</p>
        <p style="margin: 4px 0;"><strong>Amount Paid:</strong> £${payment?.amount || '300.00'} GBP</p>
        <p style="margin: 4px 0;"><strong>Student:</strong> ${student?.full_name || 'Student'}</p>
      </div>

      <p>The student's timetable and live virtual classroom access are now fully active.</p>
    `,
    callToAction: {
      label: 'Access Live Classroom & Timetable',
      url: `${process.env.CLIENT_URL || 'https://beaconbridgeacademics.co.uk'}/student/dashboard`
    }
  });

  return await sendEmail({
    to: parent?.email,
    subject: `Official Receipt & Enrollment Confirmation — Beacon Bridge Academics`,
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

export default {
  sendEmail,
  resolveSenderIdentity,
  sendRegistrationWelcome,
  sendPaymentProofSubmitted,
  sendPaymentProofAdminAlert,
  sendPaymentVerifiedReceipt,
  sendTutorApplicationReceived,
  sendTutorMessage
};
