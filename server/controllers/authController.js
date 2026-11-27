import bcrypt from 'bcryptjs';
import { store } from '../database/store.js';
import { generateToken } from '../middleware/authMiddleware.js';
import {
  getClientIp,
  checkLoginLockout,
  recordFailedLogin,
  clearFailedLogins
} from '../middleware/securityMiddleware.js';
import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
  isSafeUrl,
  parsePositiveAmount,
  clampText
} from '../utils/validators.js';
import {
  sendRegistrationWelcome,
  sendIeltsRegistrationWelcome,
  sendPaymentProofAdminAlert
} from '../services/emailService.js';

const IELTS_COURSE_ID = '20000000-0000-0000-0000-000000000008';
const PUBLIC_REGISTER_ROLES = new Set(['student', 'parent']);

const detectIeltsCandidate = async (user) => {
  if (!user) return false;
  if ((user.bio || '').toLowerCase().includes('ielts')) return true;

  try {
    const [payments, enrollments] = await Promise.all([
      store.getPayments(),
      store.getEnrollments()
    ]);

    const hasIeltsPayment = (payments || []).some((p) => {
      if (p.student_id !== user.id) return false;
      const courseIdMatch = p.course_id === IELTS_COURSE_ID;
      const textMatch = `${p.course_name || ''} ${p.course_display_name || ''} ${p.course_track || ''} ${p.admin_notes || ''}`.toLowerCase().includes('ielts');
      const selfRegistered = p.parent_id && p.parent_id === p.student_id;
      return courseIdMatch || textMatch || selfRegistered;
    });
    if (hasIeltsPayment) return true;

    const hasIeltsEnrollment = (enrollments || []).some(
      (e) => e.student_id === user.id && e.course_id === IELTS_COURSE_ID
    );
    if (hasIeltsEnrollment) return true;
  } catch (err) {
    console.warn('[auth] detectIeltsCandidate lookup warning:', err.message);
  }

  return false;
};

export const login = async (req, res, next) => {
  try {
    const rawEmail = req.body?.email;
    const password = req.body?.password;
    const clientIp = getClientIp(req);

    if (!rawEmail || !password || typeof rawEmail !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const email = normalizeEmail(rawEmail);
    if (email.length > 254 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Invalid email or password format.' });
    }

    // 1. Check per-(IP + email) lockout BEFORE doing password work
    const lockout = checkLoginLockout(clientIp, email);
    if (lockout.locked) {
      const mins = Math.max(1, Math.ceil(lockout.retryAfterSeconds / 60));
      res.setHeader('Retry-After', String(lockout.retryAfterSeconds));
      return res.status(429).json({
        success: false,
        rate_limited: true,
        retry_after_seconds: lockout.retryAfterSeconds,
        message: `Too many failed sign-in attempts for this account. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.`
      });
    }

    const user = await store.getProfileByEmail(email);

    // 2. Always verify password BEFORE revealing account status (prevents account & IELTS status enumeration)
    const isMatch = user && user.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !isMatch) {
      const failState = recordFailedLogin(clientIp, email);
      await store.logAudit({
        user_id: user?.id || null,
        action: failState.locked ? 'USER_LOGIN_LOCKED' : 'USER_LOGIN_FAILED',
        entity_type: 'AUTH',
        entity_id: user?.id || email,
        ip_address: clientIp,
        details: { email, attempts: failState.attempts, locked: failState.locked }
      });

      if (failState.locked) {
        const mins = Math.max(1, Math.ceil(failState.retryAfterSeconds / 60));
        res.setHeader('Retry-After', String(failState.retryAfterSeconds));
        return res.status(429).json({
          success: false,
          rate_limited: true,
          retry_after_seconds: failState.retryAfterSeconds,
          message: `Account sign-in temporarily locked after repeated failed attempts. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.`
        });
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Password is verified — clear any failed attempts counter
    clearFailedLogins(clientIp, email);

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }

    if (user.status === 'pending_verification') {
      const isIeltsCandidate = await detectIeltsCandidate(user);
      if (isIeltsCandidate) {
        return res.status(403).json({
          success: false,
          pending_verification: true,
          account_type: 'ielts',
          message: 'Your IELTS Academic & UKVI registration (£100/month) is currently pending administrator payment verification. Your IELTS Student Dashboard and live tutor classroom will be unlocked as soon as an administrator confirms your payment proof.'
        });
      }

      return res.status(403).json({
        success: false,
        pending_verification: true,
        account_type: 'family',
        message: 'Your registration is currently pending admin payment verification. Both parent and student accounts will be unlocked once an administrator confirms your payment proof.'
      });
    }

    const token = generateToken(user);

    await store.logAudit({
      user_id: user.id,
      action: 'USER_LOGIN',
      entity_type: 'AUTH',
      entity_id: user.id,
      ip_address: clientIp,
      details: { email: user.email, role: user.role }
    });

    const { password_hash, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role = 'student', phone, bio } = req.body || {};

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ success: false, message: pwCheck.message });
    }

    const cleanName = clampText(full_name, 120);
    if (cleanName.length < 2) {
      return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters long.' });
    }

    // Strict role allowlist: never allow tutor/admin/superadmin via public signup
    if (!PUBLIC_REGISTER_ROLES.has(role)) {
      return res.status(403).json({
        success: false,
        message: 'Only student or parent accounts may register directly. Educators must apply via Teach With Us.'
      });
    }

    const existingUser = await store.getProfileByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await store.createProfile({
      email: normalizeEmail(email),
      password_hash,
      full_name: cleanName,
      role,
      phone: clampText(phone || '', 40),
      bio: clampText(bio || '', 600),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      status: 'pending_verification'
    });

    await store.logAudit({
      user_id: newUser.id,
      action: 'USER_REGISTER',
      entity_type: 'AUTH',
      entity_id: newUser.id,
      ip_address: getClientIp(req),
      details: { email: newUser.email, role: newUser.role }
    });

    await store.createNotification({
      user_id: newUser.id,
      title: 'Welcome to Beacon Bridge Academics!',
      message: `Welcome ${cleanName}! Your ${role} registration has been received and awaits verification.`,
      type: 'system',
      link: '/payment-proof'
    });

    const { password_hash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered and awaiting administrator payment verification.',
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

export const registerJoint = async (req, res, next) => {
  try {
    const { student, parent, course_id, course_track, selected_subjects, payment_proof_url, bank_reference, amount } = req.body || {};

    if (!student || !parent || typeof student !== 'object' || typeof parent !== 'object') {
      return res.status(400).json({ success: false, message: 'Both student and parent information are required.' });
    }

    if (!student.email || !student.password || !student.full_name) {
      return res.status(400).json({ success: false, message: 'Student full name, email, and password are required.' });
    }

    if (!parent.email || !parent.password || !parent.full_name) {
      return res.status(400).json({ success: false, message: 'Parent full name, email, and password are required.' });
    }

    if (!isValidEmail(student.email) || !isValidEmail(parent.email)) {
      return res.status(400).json({ success: false, message: 'Please provide valid email addresses for both student and parent.' });
    }

    if (normalizeEmail(student.email) === normalizeEmail(parent.email)) {
      return res.status(400).json({ success: false, message: 'Student and Parent must use different email addresses.' });
    }

    const stuPw = validatePassword(student.password);
    if (!stuPw.valid) return res.status(400).json({ success: false, message: `Student password: ${stuPw.message}` });

    const parPw = validatePassword(parent.password);
    if (!parPw.valid) return res.status(400).json({ success: false, message: `Parent password: ${parPw.message}` });

    if (payment_proof_url && !isSafeUrl(payment_proof_url, { allowRelative: true, allowEmpty: false })) {
      return res.status(400).json({ success: false, message: 'Invalid payment proof file link.' });
    }

    const parsedAmount = amount !== undefined && amount !== '' ? parsePositiveAmount(amount) : undefined;
    if (amount !== undefined && amount !== '' && parsedAmount === null) {
      return res.status(400).json({ success: false, message: 'Invalid tuition amount provided.' });
    }

    const cleanStudent = {
      full_name: clampText(student.full_name, 120),
      email: normalizeEmail(student.email),
      password: student.password,
      phone: clampText(student.phone || '', 40),
      grade: clampText(student.grade || '', 120)
    };
    const cleanParent = {
      full_name: clampText(parent.full_name, 120),
      email: normalizeEmail(parent.email),
      password: parent.password,
      phone: clampText(parent.phone || '', 40),
      relationship: clampText(parent.relationship || 'Parent', 60)
    };
    const cleanSubjects = Array.isArray(selected_subjects)
      ? selected_subjects.slice(0, 20).map((s) => clampText(String(s), 120)).filter(Boolean)
      : [];

    const result = await store.registerJoint({
      student: cleanStudent,
      parent: cleanParent,
      course_id,
      course_track: course_track ? clampText(String(course_track), 100) : null,
      selected_subjects: cleanSubjects,
      payment_proof_url: payment_proof_url ? String(payment_proof_url).trim() : '',
      bank_reference: clampText(bank_reference || '', 100),
      amount: parsedAmount
    });

    (async () => {
      try {
        const course = course_id ? await store.getCourseById(course_id) : null;
        await sendRegistrationWelcome({
          student: result.student,
          parent: result.parent,
          course,
          track: course_track,
          amount: parsedAmount || result.payment?.amount
        });

        if (payment_proof_url && result.payment) {
          await sendPaymentProofAdminAlert({
            payment: result.payment,
            student: result.student,
            parent: result.parent
          });
        }
      } catch (emailErr) {
        console.warn('[Registration Email Warning]', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Joint parent & student registration submitted successfully. Accounts are awaiting admin payment verification before login is permitted.',
      data: {
        student_id: result.student?.id || null,
        parent_id: result.parent?.id || null,
        payment_id: result.payment?.id || null,
        bank_reference: result.payment?.bank_reference || bank_reference || null,
        status: 'pending_verification'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const registerIelts = async (req, res, next) => {
  try {
    const { candidate, ielts_track, target_band, exam_date, focus_modules, payment_proof_url, bank_reference, amount } = req.body || {};

    if (!candidate || typeof candidate !== 'object' || !candidate.email || !candidate.password || !candidate.full_name) {
      return res.status(400).json({ success: false, message: 'Candidate full name, email, and password are required.' });
    }

    if (!isValidEmail(candidate.email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid candidate email address.' });
    }

    const pwCheck = validatePassword(candidate.password);
    if (!pwCheck.valid) {
      return res.status(400).json({ success: false, message: pwCheck.message });
    }

    if (payment_proof_url && !isSafeUrl(payment_proof_url, { allowRelative: true, allowEmpty: false })) {
      return res.status(400).json({ success: false, message: 'Invalid payment proof file link.' });
    }

    const parsedAmount = amount !== undefined && amount !== '' ? parsePositiveAmount(amount) : 100.00;
    if (parsedAmount === null) {
      return res.status(400).json({ success: false, message: 'Invalid tuition amount provided.' });
    }

    const cleanCandidate = {
      full_name: clampText(candidate.full_name, 120),
      email: normalizeEmail(candidate.email),
      password: candidate.password,
      phone: clampText(candidate.phone || '', 40)
    };
    const cleanModules = Array.isArray(focus_modules)
      ? focus_modules.slice(0, 10).map((m) => clampText(String(m), 150)).filter(Boolean)
      : [];

    const result = await store.registerIelts({
      candidate: cleanCandidate,
      ielts_track: clampText(ielts_track || 'IELTS Academic', 80),
      target_band: clampText(String(target_band || '7.5'), 20),
      exam_date: clampText(exam_date || '', 40),
      focus_modules: cleanModules,
      payment_proof_url: payment_proof_url ? String(payment_proof_url).trim() : '',
      bank_reference: clampText(bank_reference || '', 100),
      amount: parsedAmount
    });

    (async () => {
      try {
        await sendIeltsRegistrationWelcome({
          student: result.student,
          track: ielts_track,
          targetBand: target_band,
          examDate: exam_date,
          focusModules: cleanModules,
          amount: parsedAmount,
          bankReference: result.payment?.bank_reference || bank_reference
        });

        if (payment_proof_url && result.payment) {
          await sendPaymentProofAdminAlert({
            payment: result.payment,
            student: result.student,
            parent: result.student
          });
        }
      } catch (emailErr) {
        console.warn('[IELTS Registration Email Warning]', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'IELTS registration & payment proof submitted successfully! Once verified by our bursar team, log in to access your IELTS Virtual Classroom Dashboard.',
      data: {
        student_id: result.student?.id || null,
        payment_id: result.payment?.id || null,
        bank_reference: result.payment?.bank_reference || bank_reference || null,
        status: 'pending_verification'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  const { password_hash, ...safeUser } = req.user;
  res.status(200).json({
    success: true,
    user: safeUser
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, bio, avatar_url } = req.body || {};
    const updates = {};

    if (full_name !== undefined) {
      const cleanName = clampText(full_name, 120);
      if (cleanName.length < 2) {
        return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters.' });
      }
      updates.full_name = cleanName;
    }
    if (phone !== undefined) updates.phone = clampText(phone, 40);
    if (bio !== undefined) updates.bio = clampText(bio, 1000);
    if (avatar_url !== undefined) {
      if (!isSafeUrl(avatar_url, { allowRelative: true, allowEmpty: true })) {
        return res.status(400).json({ success: false, message: 'Invalid avatar URL.' });
      }
      updates.avatar_url = avatar_url;
    }

    const updatedUser = await store.updateProfile(req.user.id, updates);
    const { password_hash, ...safeUser } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      return res.status(400).json({ success: false, message: pwCheck.message });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from your current password.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await store.updateProfile(req.user.id, { password_hash });

    await store.logAudit({
      user_id: req.user.id,
      action: 'PASSWORD_CHANGED',
      entity_type: 'AUTH',
      entity_id: req.user.id,
      ip_address: getClientIp(req),
      details: { email: req.user.email }
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    next(err);
  }
};
