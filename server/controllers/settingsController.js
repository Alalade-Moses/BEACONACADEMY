import { store } from '../database/store.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await store.getSettings();
    res.status(200).json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updated = await store.updateSettings(req.body);

    await store.logAudit({
      user_id: req.user.id,
      action: 'UPDATE_SETTINGS',
      entity_type: 'SETTINGS',
      entity_id: 'GLOBAL',
      ip_address: req.ip || '127.0.0.1',
      details: req.body
    });

    res.status(200).json({ success: true, message: 'Platform settings updated successfully.', settings: updated });
  } catch (err) {
    next(err);
  }
};
