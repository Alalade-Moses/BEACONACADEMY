import { store } from '../database/store.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await store.getAuditLogs();
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};
