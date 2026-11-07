import { store } from '../database/store.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    let announcements = await store.getAnnouncements();

    if (req.user) {
      announcements = announcements.filter(a => 
        a.target_role === 'all' || 
        a.target_role === req.user.role || 
        req.user.role === 'superadmin'
      );
    } else {
      announcements = announcements.filter(a => a.target_role === 'all');
    }

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, target_role = 'all' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newAnnouncement = await store.createAnnouncement({
      sender_id: req.user.id,
      title,
      content,
      target_role
    });

    // Broadcast in-app notification to all matching profiles
    const profiles = await store.getProfiles();
    const targetProfiles = profiles.filter(p => 
      target_role === 'all' || p.role === target_role
    );

    for (const p of targetProfiles) {
      await store.createNotification({
        user_id: p.id,
        title: `Announcement: ${title}`,
        message: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
        type: 'announcement',
        link: `/${p.role}/dashboard`
      });
    }

    res.status(201).json({ success: true, message: 'Announcement published successfully.', announcement: newAnnouncement });
  } catch (err) {
    next(err);
  }
};
