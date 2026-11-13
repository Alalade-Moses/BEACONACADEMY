import bcrypt from 'bcryptjs';
import { store } from '../database/store.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { sendRegistrationWelcome, sendPaymentProofAdminAlert } from '../services/emailService.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await store.getProfileByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }

    if (user.status === 'pending_verification') {
      return res.status(403).json({
        success: false,
        pending_verification: true,
        message: 'Your registration is currently pending admin payment verification. Both parent and student accounts will be unlocked once an administrator confirms your payment proof.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    // Audit log
    await store.logAudit({
      user_id: user.id,
      action: 'USER_LOGIN',
      entity_type: 'AUTH',
      entity_id: user.id,
      ip_address: req.ip || '127.0.0.1',
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
    const { email, password, full_name, role = 'student', phone, bio } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    // Role check: superadmin cannot be registered directly
    if (role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Superadmin accounts cannot be registered via public signup.' });
    }

    const existingUser = await store.getProfileByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await store.createProfile({
      email,
      password_hash,
      full_name,
      role,
      phone: phone || '',
      bio: bio || '',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      status: 'active'
    });

    const token = generateToken(newUser);

    // Audit log
    await store.logAudit({
      user_id: newUser.id,
      action: 'USER_REGISTER',
      entity_type: 'AUTH',
      entity_id: newUser.id,
      ip_address: req.ip || '127.0.0.1',
      details: { email: newUser.email, role: newUser.role }
    });

    // Welcome notification
    await store.createNotification({
      user_id: newUser.id,
      title: 'Welcome to Beacon Bridge Academics!',
      message: `Welcome ${full_name}! Your ${role} account is now active. Explore your dashboard to get started.`,
      type: 'system',
      link: `/${role}/dashboard`
    });

    const { password_hash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

export const registerJoint = async (req, res, next) => {
  try {
    const { student, parent, course_id, course_track, selected_subjects, payment_proof_url, bank_reference, amount } = req.body;

    if (!student || !parent) {
      return res.status(400).json({ success: false, message: 'Both student and parent information are required.' });
    }

    if (!student.email || !student.password || !student.full_name) {
      return res.status(400).json({ success: false, message: 'Student full name, email, and password are required.' });
    }

    if (!parent.email || !parent.password || !parent.full_name) {
      return res.status(400).json({ success: false, message: 'Parent full name, email, and password are required.' });
    }

    const result = await store.registerJoint({
      student,
      parent,
      course_id,
      course_track,
      selected_subjects: selected_subjects || [],
      payment_proof_url,
      bank_reference,
      amount
    });

    // Send Welcome Email to Parent & Student asynchronously
    (async () => {
      try {
        const courses = await store.getCourses();
        const course = courses.find(c => c.id === course_id);
        await sendRegistrationWelcome({
          student: result.student,
          parent: result.parent,
          course,
          track: course_track,
          amount
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
        student_id: result.student.id,
        parent_id: result.parent.id,
        payment_id: result.payment.id,
        bank_reference: result.payment.bank_reference,
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
    const { full_name, phone, bio, avatar_url } = req.body;
    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url) updates.avatar_url = avatar_url;

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
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await store.updateProfile(req.user.id, { password_hash });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    next(err);
  }
};
