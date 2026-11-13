import { store } from '../database/store.js';
import { safeDeleteUploadedFile } from '../services/fileCleanup.js';

export const getMaterials = async (req, res, next) => {
  try {
    const { course_id, class_id } = req.query;
    let materials = await store.getMaterials();

    if (course_id) {
      materials = materials.filter(m => m.course_id === course_id);
    }
    if (class_id) {
      materials = materials.filter(m => m.class_id === class_id);
    }

    res.status(200).json({ success: true, count: materials.length, materials });
  } catch (err) {
    next(err);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const { course_id, class_id, title, file_url, file_type = 'pdf', file_size = 1048576, is_presentation = false } = req.body;

    if (!course_id || !title || !file_url) {
      return res.status(400).json({ success: false, message: 'Course, title, and file URL are required.' });
    }

    const newMaterial = await store.createMaterial({
      course_id,
      class_id: class_id || null,
      uploader_id: req.user.id,
      title,
      file_url,
      file_type,
      file_size: parseInt(file_size, 10) || 1048576,
      is_presentation: Boolean(is_presentation)
    });

    // If marked as presentation and attached to a class, update the class's presentation_url
    if (is_presentation && class_id) {
      await store.updateClass(class_id, { presentation_url: file_url });
    }

    res.status(201).json({ success: true, message: 'Learning material added successfully.', material: newMaterial });
  } catch (err) {
    next(err);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const materials = await store.getMaterials();
    const material = materials.find(m => m.id === req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }

    if (req.user.role === 'tutor' && material.uploader_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete materials uploaded by you.' });
    }

    // Clean up physical file from storage disk if applicable
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
    const { class_id, title, recording_url, duration_seconds = 3600, file_size = 50000000 } = req.body;
    if (!class_id || !title || !recording_url) {
      return res.status(400).json({ success: false, message: 'Class ID, title, and recording URL are required.' });
    }

    const recording = await store.createRecording({
      class_id,
      title,
      recording_url,
      duration_seconds: parseInt(duration_seconds, 10),
      file_size: parseInt(file_size, 10)
    });

    res.status(201).json({ success: true, message: 'Class recording saved successfully.', recording });
  } catch (err) {
    next(err);
  }
};

export const deleteRecording = async (req, res, next) => {
  try {
    const recordings = await store.getRecordings();
    const rec = recordings.find(r => r.id === req.params.id);
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recording not found.' });
    }

    // Clean up physical recording video file from storage disk if applicable
    if (rec.recording_url) {
      safeDeleteUploadedFile(rec.recording_url);
    }

    await store.deleteRecording(rec.id);
    res.status(200).json({ success: true, message: 'Recording and video file deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
