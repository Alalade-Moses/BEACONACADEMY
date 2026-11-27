import { store } from '../database/store.js';
import { sendConsultationBookingNotifications } from '../services/emailService.js';
import { isAllowedGmail, GMAIL_ONLY_MESSAGE, normalizeEmail, clampText, isUuid } from '../utils/validators.js';

const VALID_CONSULTATION_STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled']);

export const getConsultations = async (req, res, next) => {
  try {
    const consultations = await store.getConsultations();
    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (err) {
    next(err);
  }
};

export const getConsultationById = async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid consultation ID.' });
    }
    const consultation = await store.getConsultationById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation booking not found.' });
    }
    res.status(200).json({ success: true, data: consultation });
  } catch (err) {
    next(err);
  }
};

export const createConsultation = async (req, res, next) => {
  try {
    const {
      parent_name,
      student_name,
      email,
      phone,
      curriculum,
      subjects,
      exam_board,
      current_grade,
      target_grade,
      consultation_day,
      consultation_time,
      consultation_date,
      consultant_name,
      mode,
      notes
    } = req.body || {};

    if (!parent_name || !student_name || !email || !phone || !curriculum || !consultation_day || !consultation_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide parent name, student name, email, phone, curriculum, day, and time slot.'
      });
    }

    if (!isAllowedGmail(email)) {
      return res.status(400).json({ success: false, message: GMAIL_ONLY_MESSAGE });
    }

    const newConsultation = await store.createConsultation({
      parent_name: clampText(parent_name, 120),
      student_name: clampText(student_name, 120),
      email: normalizeEmail(email),
      phone: clampText(phone, 40),
      curriculum: clampText(curriculum, 100),
      subjects: clampText(subjects || '', 250),
      exam_board: clampText(exam_board || 'AQA', 100),
      current_grade: clampText(current_grade || '', 50),
      target_grade: clampText(target_grade || '', 50),
      consultation_day: clampText(consultation_day, 50),
      consultation_time: clampText(consultation_time, 60),
      consultation_date: clampText(consultation_date || '', 50),
      consultant_name: clampText(consultant_name || 'Mr. Gideon Babs', 120),
      mode: clampText(mode || 'Live Interactive Video', 100),
      notes: clampText(notes || '', 1500)
    });

    try {
      const admins = (await store.getProfiles()).filter((p) => p.role === 'superadmin' || p.role === 'admin');
      for (const admin of admins) {
        await store.createNotification({
          user_id: admin.id,
          title: 'New Consultation Booked',
          message: `${newConsultation.parent_name} booked a session for ${newConsultation.student_name} (${newConsultation.curriculum}) on ${newConsultation.consultation_day} at ${newConsultation.consultation_time}.`,
          type: 'system',
          link: '/admin/dashboard'
        });
      }
    } catch (notifErr) {
      console.warn('Notification creation notice:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Academic consultation booked successfully. Confirmation dispatched to your email and our academic advisory team.',
      data: newConsultation
    });

    sendConsultationBookingNotifications(newConsultation).catch((mailErr) => {
      console.warn('Consultation email dispatch notice:', mailErr.message);
    });
  } catch (err) {
    next(err);
  }
};

export const updateConsultationStatus = async (req, res, next) => {
  try {
    if (!isUuid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid consultation ID.' });
    }
    const { status, notes } = req.body || {};
    if (!VALID_CONSULTATION_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, completed, or cancelled.'
      });
    }
    const updated = await store.updateConsultationStatus(
      req.params.id,
      status,
      notes !== undefined ? clampText(notes, 1500) : undefined
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Consultation booking not found.' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
