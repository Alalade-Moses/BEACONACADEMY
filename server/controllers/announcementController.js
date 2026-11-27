import { store } from '../database/store.js';
import { clampText } from '../utils/validators.js';

const VALID_TARGET_ROLES = new Set(['all', 'tutor', 'student', 'parent']);

export const getAnnouncements = async (req, res, next) => {
  try {
    let announcements = await store.getAnnouncements();

    if (req.user) {
      announcements = announcements.filter(
        (a) =>
          a.target_role === 'all' ||
          a.target_role === req.user.role ||
          req.user.role === 'superadmin'
      );
    } else {
      announcements = announcements.filter((a) => a.target_role === 'all');
    }

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, target_role = 'all' } = req.body || {};
    const cleanTitle = clampText(title || '', 200);
    const cleanContent = clampText(content || '', 4000);

    if (!cleanTitle || !cleanContent) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }
    if (!VALID_TARGET_ROLES.has(target_role)) {
      return res.status(400).json({ success: false, message: 'Invalid target role.' });
    }

    const newAnnouncement = await store.createAnnouncement({
      sender_id: req.user.id,
      title: cleanTitle,
      content: cleanContent,
      target_role
    });

    const profiles = await store.getProfiles();
    const targetProfiles = profiles.filter((p) => target_role === 'all' || p.role === target_role);

    for (const p of targetProfiles) {
      await store.createNotification({
        user_id: p.id,
        title: `Announcement: ${cleanTitle}`,
        message: cleanContent.substring(0, 120) + (cleanContent.length > 120 ? '...' : ''),
        type: 'announcement',
        link: `/${p.role}/dashboard`
      });
    }

    res.status(201).json({ success: true, message: 'Announcement published successfully.', announcement: newAnnouncement });
  } catch (err) {
    next(err);
  }
};
