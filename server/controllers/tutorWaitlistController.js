import { store } from '../database/store.js';
import { getClientIp } from '../middleware/securityMiddleware.js';
import { isAllowedGmail, GMAIL_ONLY_MESSAGE, normalizeEmail, isSafeUrl, clampText } from '../utils/validators.js';
import {
  sendTutorWaitlistReceived,
  sendTutorWaitlistAdminAlert,
  sendTutorWaitlistInviteEmail
} from '../services/emailService.js';
import { safeDeleteUploadedFile } from '../services/fileCleanup.js';

const ALLOWED_VIDEO_HOSTS = [
  'drive.google.com',
  'docs.google.com',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'loom.com',
  'www.loom.com',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com'
];

const isAllowedVideoHost = (rawUrl) => {
  try {
    const parsed = new URL(String(rawUrl).trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_VIDEO_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
};

export const VALID_WAITLIST_STATUSES = ['waitlisted', 'shortlisted', 'invited', 'onboarded', 'declined'];

export const submitWaitlistEntry = async (req, res, next) => {
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
      teaching_approach,
      video_url,
      cv_url,
      degree_certificate_url,
      teaching_licence_url,
      safeguarding_acknowledged,
      dbs_consent,
      safeguarding_signature,
      dbs_status,
      dbs_certificate_number
    } = req.body || {};

    if (!full_name || !email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Full legal name, Gmail address, phone number, and location are required.'
      });
    }

    if (!isAllowedGmail(email)) {
      return res.status(400).json({ success: false, message: GMAIL_ONLY_MESSAGE });
    }

    if (!highest_qualification || !current_role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your highest academic qualification and current professional role.'
      });
    }

    if (!selected_subjects || !Array.isArray(selected_subjects) || selected_subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one A-Level subject you are certified and qualified to teach.'
      });
    }

    if (!teaching_approach || !String(teaching_approach).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your pedagogical statement / teaching approach.'
      });
    }

    if (!video_url || !isSafeUrl(video_url, { allowRelative: false, allowEmpty: false }) || !isAllowedVideoHost(video_url)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shareable 3-minute introductory video link from Google Drive, YouTube, Loom, or Vimeo.'
      });
    }

    for (const [label, urlVal] of [
      ['CV link', cv_url],
      ['Degree certificate link', degree_certificate_url],
      ['Teaching licence link', teaching_licence_url]
    ]) {
      if (urlVal && !isSafeUrl(urlVal, { allowRelative: true, allowEmpty: true })) {
        return res.status(400).json({ success: false, message: `Invalid ${label}.` });
      }
    }

    if (!safeguarding_acknowledged || !dbs_consent) {
      return res.status(400).json({
        success: false,
        message: 'You must acknowledge the Safeguarding & Child Protection Policy (v2.4) and pre-onboarding vetting/recording terms before joining the waiting list.'
      });
    }

    if (!safeguarding_signature || !String(safeguarding_signature).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please type your full legal name as your digital legal signature.'
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await store.getTutorWaitlistByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        alreadyWaitlisted: true,
        message: 'This Gmail address is already registered on the Beacon Bridge Academics Tutor Waiting List. We have your details and will contact you first when onboarding opens.'
      });
    }

    const cleanSubjects = selected_subjects
      .slice(0, 15)
      .map((s) => clampText(String(s), 100))
      .filter(Boolean);

    const entry = await store.createTutorWaitlistEntry({
      full_name: clampText(full_name, 120),
      email: normalizedEmail,
      phone: clampText(phone, 40),
      location: clampText(location, 120),
      highest_qualification: clampText(highest_qualification, 250),
      years_experience: clampText(years_experience || '3-5 years', 50),
      current_role: clampText(current_role, 150),
      selected_subjects: cleanSubjects,
      teaching_approach: clampText(teaching_approach, 3000),
      video_url: String(video_url).trim(),
      cv_url: cv_url ? String(cv_url).trim() : null,
      degree_certificate_url: degree_certificate_url ? String(degree_certificate_url).trim() : null,
      teaching_licence_url: teaching_licence_url ? String(teaching_licence_url).trim() : null,
      safeguarding_acknowledged: true,
      dbs_consent: true,
      safeguarding_signature: clampText(safeguarding_signature, 120),
      dbs_status: clampText(dbs_status || 'Enhanced DBS on Update Service', 180),
      dbs_certificate_number: clampText(dbs_certificate_number || '', 80),
      submitted_ip: getClientIp(req)
    });

    await store.logAudit({
      user_id: null,
      action: 'TUTOR_WAITLIST_JOINED',
      entity_type: 'TUTOR_WAITLIST',
      entity_id: entry.id,
      ip_address: getClientIp(req),
      details: {
        full_name: entry.full_name,
        email: entry.email,
        subjects: cleanSubjects
      }
    });

    // Dispatch both confirmation email (to tutor) and instant alert (to admin/info) without blocking response
    (async () => {
      try {
        await sendTutorWaitlistReceived({ entry });
      } catch (e) {
        console.warn('[Tutor Waitlist Applicant Email Warning]:', e.message);
      }
      try {
        await sendTutorWaitlistAdminAlert({ entry });
      } catch (e) {
        console.warn('[Tutor Waitlist Admin Email Warning]:', e.message);
      }
    })();

    return res.status(201).json({
      success: true,
      message: "You're on the waiting list! We've received your details and sent a confirmation email.",
      entry
    });
  } catch (err) {
    next(err);
  }
};

export const getAllWaitlistEntries = async (req, res, next) => {
  try {
    const { status, subject } = req.query;
    const entries = await store.getTutorWaitlist({ status, subject });

    return res.status(200).json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (err) {
    next(err);
  }
};

export const getWaitlistEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await store.getTutorWaitlistById(id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Tutor waitlist entry not found.' });
    }

    return res.status(200).json({ success: true, entry });
  } catch (err) {
    next(err);
  }
};

export const updateWaitlistEntryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, send_invite_email, custom_message } = req.body || {};

    if (!VALID_WAITLIST_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_WAITLIST_STATUSES.join(', ')}.`
      });
    }

    const reviewed_by = req.user?.full_name || 'Super Administrator';
    const shouldSendInvite = status === 'invited' && send_invite_email !== false;

    const updated = await store.updateTutorWaitlistStatus(id, {
      status,
      admin_notes: admin_notes !== undefined ? clampText(admin_notes, 2000) : undefined,
      reviewed_by,
      reviewed_by_id: req.user?.id,
      invited: shouldSendInvite
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Tutor waitlist entry not found.' });
    }

    let inviteSent = false;
    if (shouldSendInvite) {
      try {
        await sendTutorWaitlistInviteEmail({
          entry: updated,
          customMessage: custom_message ? clampText(custom_message, 1000) : ''
        });
        inviteSent = true;
      } catch (emailErr) {
        console.warn('[Tutor Waitlist Invite Email Warning]:', emailErr.message);
      }
    }

    await store.logAudit({
      user_id: req.user?.id,
      action: `TUTOR_WAITLIST_${status.toUpperCase()}`,
      entity_type: 'TUTOR_WAITLIST',
      entity_id: id,
      ip_address: getClientIp(req),
      details: {
        applicant: updated.full_name,
        email: updated.email,
        subjects: updated.selected_subjects,
        status,
        inviteSent
      }
    });

    return res.status(200).json({
      success: true,
      message: inviteSent
        ? `${updated.full_name} marked as invited and onboarding invitation email sent to ${updated.email}.`
        : `Waitlist entry updated to "${status}".`,
      entry: updated,
      inviteSent
    });
  } catch (err) {
    next(err);
  }
};

export const deleteWaitlistEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await store.getTutorWaitlistById(id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Tutor waitlist entry not found.' });
    }

    if (entry.cv_url) safeDeleteUploadedFile(entry.cv_url);
    if (entry.degree_certificate_url) safeDeleteUploadedFile(entry.degree_certificate_url);
    if (entry.teaching_licence_url) safeDeleteUploadedFile(entry.teaching_licence_url);

    await store.deleteTutorWaitlistEntry(id);

    await store.logAudit({
      user_id: req.user?.id,
      action: 'TUTOR_WAITLIST_DELETED',
      entity_type: 'TUTOR_WAITLIST',
      entity_id: id,
      ip_address: getClientIp(req),
      details: { applicant: entry.full_name, email: entry.email }
    });

    return res.status(200).json({
      success: true,
      message: 'Tutor waitlist entry and associated uploaded documents permanently deleted.'
    });
  } catch (err) {
    next(err);
  }
};
