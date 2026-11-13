import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { parsePptx } from '../services/pptxParser.js';
import { safeDeleteUploadedFile } from '../services/fileCleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

// Ensure upload directory and subfolders exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const decksDir = path.join(uploadDir, 'decks');
if (!fs.existsSync(decksDir)) {
  fs.mkdirSync(decksDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${uuidv4().substring(0, 8)}`;
    cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  }
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|csv|mp4|webm|mov|m4v|mkv|avi/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not supported. Please upload a valid document, image, or video.`));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB limit for video & materials
  fileFilter
});

const router = express.Router();

// Helper to format file response with presentation parsing
function processUploadedFile(file) {
  const ext = path.extname(file.filename).toLowerCase();
  const publicUrl = `/uploads/${file.filename}`;
  const baseName = path.basename(file.filename, ext);

  // If PowerPoint file, parse slides
  if (ext === '.pptx' || ext === '.ppt') {
    const deckId = `deck-${baseName}`;
    const parsed = parsePptx(file.path, deckId);

    if (parsed && parsed.slides && parsed.slides.length > 0) {
      return {
        success: true,
        message: 'PowerPoint presentation parsed successfully.',
        url: publicUrl,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        isPresentation: true,
        deckType: 'pptx',
        deckId,
        totalSlides: parsed.totalSlides,
        slides: parsed.slides
      };
    }
  }

  // If PDF file, generate multi-page structure
  if (ext === '.pdf') {
    const defaultPages = 10;
    return {
      success: true,
      message: 'PDF document uploaded successfully.',
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      isPresentation: true,
      deckType: 'pdf',
      totalSlides: defaultPages,
      slides: Array.from({ length: defaultPages }, (_, i) => ({
        slideIndex: i + 1,
        type: 'pdf',
        url: `${publicUrl}#page=${i + 1}&view=FitH&toolbar=0&navpanes=0`,
        rawUrl: publicUrl,
        title: `Page ${i + 1}`
      }))
    };
  }

  // If Video file (.mp4, .webm, .mov, etc.)
  if (/^\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(ext)) {
    return {
      success: true,
      message: 'Introductory video uploaded successfully.',
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      isVideo: true,
      isPresentation: false
    };
  }

  // If Image file (.png, .jpg, .webp, etc.)
  if (/^\.(png|jpe?g|webp|gif)$/i.test(ext)) {
    return {
      success: true,
      message: 'Slide image uploaded successfully.',
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      isPresentation: true,
      deckType: 'image',
      totalSlides: 1,
      slides: [
        {
          slideIndex: 1,
          type: 'image',
          url: publicUrl,
          title: file.originalname
        }
      ]
    };
  }

  return {
    success: true,
    message: 'File uploaded successfully.',
    url: publicUrl,
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    isPresentation: false
  };
}

// Upload endpoint (accepts single 'file' or multiple 'files')
router.post('/', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 50MB.' });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const files = req.files || [];
    if (files.length === 0 && !req.file) {
      return res.status(400).json({ success: false, message: 'No file was provided in the upload request.' });
    }

    // Handle multiple uploaded files (e.g., tutor selects multiple slide image files)
    if (files.length > 1) {
      const slides = files.map((f, i) => {
        const ext = path.extname(f.filename).toLowerCase();
        const pUrl = `/uploads/${f.filename}`;
        return {
          slideIndex: i + 1,
          type: /^\.(png|jpe?g|webp|gif)$/i.test(ext) ? 'image' : 'file',
          url: pUrl,
          title: f.originalname
        };
      });

      return res.status(200).json({
        success: true,
        message: `${files.length} slides uploaded successfully.`,
        url: slides[0].url,
        isPresentation: true,
        deckType: 'multi-image',
        totalSlides: slides.length,
        slides
      });
    }

    const singleFile = files[0] || req.file;
    const result = processUploadedFile(singleFile);
    return res.status(200).json(result);
  });
});

// Endpoint to retrieve / re-parse an existing presentation file
router.get('/presentation/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Presentation file not found.' });
    }

    const ext = path.extname(filename).toLowerCase();
    const stat = fs.statSync(filePath);
    const fakeFile = {
      filename,
      originalname: filename,
      path: filePath,
      mimetype: ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: stat.size
    };

    const result = processUploadedFile(fakeFile);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint to delete an uploaded file directly from storage
router.delete('/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const deleted = safeDeleteUploadedFile(`/uploads/${filename}`);
    if (deleted) {
      return res.status(200).json({ success: true, message: `File ${filename} deleted from storage.` });
    }
    return res.status(404).json({ success: false, message: 'File not found or already deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
