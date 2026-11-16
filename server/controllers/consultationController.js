import { store } from '../database/store.js';
import { sendConsultationBookingNotifications } from '../services/emailService.js';

export const getConsultations = async (req, res) => {
  try {
    const consultations = await store.getConsultations();
    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (err) {
    console.error('Error fetching consultations:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving consultations' });
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const consultation = await store.getConsultationById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation booking not found' });
    }
    res.status(200).json({ success: true, data: consultation });
  } catch (err) {
    console.error('Error fetching consultation:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving consultation' });
  }
};

export const createConsultation = async (req, res) => {
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
    } = req.body;

    if (!parent_name || !student_name || !email || !phone || !curriculum || !consultation_day || !consultation_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide parent name, student name, email, UK phone, curriculum, day, and time slot.'
      });
    }

    const newConsultation = await store.createConsultation({
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
      consultant_name: consultant_name || 'Dr. Sarah Jenkins',
      mode: mode || 'Live Interactive Video (Classroom / Meet)',
      notes
    });

    // Notify Platform Admins in Dashboard
    try {
      const admins = (await store.getProfiles()).filter(p => p.role === 'superadmin' || p.role === 'admin');
      for (const admin of admins) {
        await store.createNotification({
          user_id: admin.id,
          title: 'New Consultation Booked',
          message: `${parent_name} booked a session for ${student_name} (${curriculum}) on ${consultation_day} at ${consultation_time}.`,
          type: 'system',
          link: '/admin/dashboard'
        });
      }
    } catch (notifErr) {
      console.warn('Notification creation notice:', notifErr.message);
    }

    // Dispatch emails to info@beaconbridgeacademics.co.uk and confirmation to parent
    try {
      await sendConsultationBookingNotifications(newConsultation);
    } catch (mailErr) {
      console.warn('Consultation email dispatch notice:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Academic consultation booked successfully. Confirmation dispatched to your email and our academic advisory team.',
      data: newConsultation
    });
  } catch (err) {
    console.error('Error creating consultation:', err);
    res.status(500).json({ success: false, message: 'Server error booking consultation: ' + err.message });
  }
};

export const updateConsultationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = await store.updateConsultationStatus(req.params.id, status, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Consultation booking not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating consultation:', err);
    res.status(500).json({ success: false, message: 'Server error updating consultation' });
  }
};
