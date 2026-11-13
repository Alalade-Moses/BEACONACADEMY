import { store } from '../database/store.js';
import { sendTutorApplicationReceived } from '../services/emailService.js';

export const VALID_ALEVEL_SUBJECTS = [
  'A-Level Mathematics',
  'A-Level English',
  'A-Level English Literature',
  'A-Level Physics',
  'A-Level Chemistry',
  'A-Level Biology',
  'A-Level Environmental Science',
  'A-Level Psychology',
  'A-Level Sociology',
  'A-Level Economics',
  'A-Level Business study',
  'A-Level Philosophy'
];

/**
 * Public endpoint: Submit a new teacher application
 * POST /api/tutor-applications
 */
export const submitApplication = async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      phone,
      location,
      highest_qualification,
      years_experience,
      current_role,
      selected_subjects,
      bio,
      teaching_approach,
      video_url,
      video_duration,
      video_filename,
      cv_url,
      safeguarding_acknowledged,
      safeguarding_signature,
      dbs_status,
      dbs_certificate_number
    } = req.body;

    // Validation
    if (!full_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email address, and phone number are required.'
      });
    }

    if (!selected_subjects || !Array.isArray(selected_subjects) || selected_subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one A-Level subject you are qualified to teach.'
      });
    }

    // Ensure introductory video is provided
    if (!video_url) {
      return res.status(400).json({
        success: false,
        message: 'A 3-minute introductory video is mandatory for all teacher applicants.'
      });
    }

    // Ensure safeguarding policy is read and acknowledged
    if (!safeguarding_acknowledged) {
      return res.status(400).json({
        success: false,
        message: 'You must read and formally acknowledge the Beacon Bridge Academics Safeguarding & Child Protection Policy before submitting your application.'
      });
    }

    if (!safeguarding_signature) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full legal name as a digital signature for safeguarding compliance.'
      });
    }

    const application = await store.createTutorApplication({
      full_name,
      email,
      phone,
      location,
      highest_qualification,
      years_experience,
      current_role,
      selected_subjects,
      bio,
      teaching_approach,
      video_url,
      video_duration,
      video_filename,
      cv_url,
      safeguarding_acknowledged,
      safeguarding_signature,
      dbs_status,
      dbs_certificate_number
    });

    // Send confirmation email to applicant asynchronously
    (async () => {
      try {
        await sendTutorApplicationReceived({ applicant: application });
      } catch (e) {
        console.warn('[Tutor Application Email Warning]', e.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Your teacher application has been submitted successfully! Our Superadmin team will review your qualifications, 3-minute video, and safeguarding compliance within 48 hours.',
      application
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Superadmin endpoint: Get all teacher applications with filtering
 * GET /api/tutor-applications
 */
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, subject } = req.query;
    const applications = await store.getTutorApplications({ status, subject });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Superadmin endpoint: Get single application by ID
 * GET /api/tutor-applications/:id
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await store.getTutorApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Teacher application not found.'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Superadmin endpoint: Update application status (approve / reject / under_review)
 * PUT /api/tutor-applications/:id/status
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, under_review, approved, or rejected.'
      });
    }

    const reviewed_by = req.user?.full_name || 'Super Administrator';
    const updated = await store.updateTutorApplicationStatus(id, {
      status,
      admin_notes,
      reviewed_by
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Teacher application not found.'
      });
    }

    // Log in audit log
    if (typeof store.logAudit === 'function') {
      await store.logAudit({
        user_id: req.user?.id || '00000000-0000-0000-0000-000000000001',
        action: `TUTOR_APPLICATION_${status.toUpperCase()}`,
        resource: 'tutor_applications',
        resource_id: id,
        details: {
          applicant: updated.full_name,
          subjects: updated.selected_subjects,
          status,
          admin_notes
        }
      });
    }

    res.status(200).json({
      success: true,
      message: `Teacher application marked as ${status}. ${status === 'approved' ? 'Tutor faculty profile provisioned.' : ''}`,
      application: updated
    });
  } catch (err) {
    next(err);
  }
};
