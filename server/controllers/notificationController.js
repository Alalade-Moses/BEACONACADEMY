import { store } from '../database/store.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await store.getNotifications(req.user.id);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await store.markNotificationAsRead(req.params.id);
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const notifications = await store.getNotifications(req.user.id);
    for (const notif of notifications) {
      if (!notif.is_read) {
        await store.markNotificationAsRead(notif.id);
      }
    }
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};
