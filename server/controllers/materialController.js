import { store } from '../database/store.js';
import { safeDeleteUploadedFile } from '../services/fileCleanup.js';
import { isSafeUrl, clampText, isUuid } from '../utils/validators.js';

export const getMaterials = async (req, res, next) => {
  try {
    const { course_id, class_id } = req.query;
    let materials = await store.getMaterials();

    if (course_id) {
      materials = materials.filter((m) => m.course_id === course_id);
    }
    if (class_id) {
      materials = materials.filter((m) => m.class_id === class_id);
    }

    res.status(200).json({ success: true, count: materials.length, materials });
  } catch (err) {
    next(err);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const { course_id, class_id, title, file_url, file_type = 'pdf', file_size = 1048576, is_presentation = false } = req.body || {};

    if (!course_id || !isUuid(course_id) || !title || !file_url) {
      return res.status(400).json({ success: false, message: 'Valid course, title, and file URL are required.' });
    }
    if (!isSafeUrl(file_url, { allowRelative: true, allowEmpty: false })) {
      return res.status(400).json({ success: false, message: 'Invalid material file URL.' });
    }

    const newMaterial = await store.createMaterial({
      course_id,
      class_id: isUuid(class_id) ? class_id : null,
      uploader_id: req.user.id,
      title: clampText(title, 200),
      file_url: String(file_url).trim(),
      file_type: clampText(file_type, 80),
      file_size: Math.max(0, parseInt(file_size, 10) || 0),
      is_presentation: Boolean(is_presentation)
    });

    if (is_presentation && class_id) {
      await store.updateClass(class_id, { presentation_url: String(file_url).trim() });
    }

    res.status(201).json({ success: true, message: 'Learning material added successfully.', material: newMaterial });
  } catch (err) {
    next(err);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const materials = await store.getMaterials();
    const material = materials.find((m) => m.id === req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }

    if (req.user.role === 'tutor' && material.uploader_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete materials uploaded by you.' });
    }

    if (material.file_url) {
      safeDeleteUploadedFile(material.file_url);
    }

    await store.deleteMaterial(material.id);
    res.status(200).json({ success: true, message: 'Material and file deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const getRecordings = async (req, res, next) => {
  try {
    const recordings = await store.getRecordings();
    res.status(200).json({ success: true, count: recordings.length, recordings });
  } catch (err) {
    next(err);
  }
};

export const createRecording = async (req, res, next) => {
  try {
    const { class_id, title, recording_url, duration_seconds = 3600, file_size = 50000000 } = req.body || {};
    if (!class_id || !isUuid(class_id) || !title || !recording_url) {
      return res.status(400).json({ success: false, message: 'Valid Class ID, title, and recording URL are required.' });
    }
    if (!isSafeUrl(recording_url, { allowRelative: true, allowEmpty: false })) {
      return res.status(400).json({ success: false, message: 'Invalid recording URL.' });
    }

    const recording = await store.createRecording({
      class_id,
      title: clampText(title, 200),
      recording_url: String(recording_url).trim(),
      duration_seconds: Math.max(0, parseInt(duration_seconds, 10) || 0),
      file_size: Math.max(0, parseInt(file_size, 10) || 0)
    });

    res.status(201).json({ success: true, message: 'Class recording saved successfully.', recording });
  } catch (err) {
    next(err);
  }
};

export const deleteRecording = async (req, res, next) => {
  try {
    const recordings = await store.getRecordings();
    const rec = recordings.find((r) => r.id === req.params.id);
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recording not found.' });
    }

    if (rec.recording_url) {
      safeDeleteUploadedFile(rec.recording_url);
    }

    await store.deleteRecording(rec.id);
    res.status(200).json({ success: true, message: 'Recording and video file deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
