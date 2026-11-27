import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { parsePptx } from '../services/pptxParser.js';
import { safeDeleteUploadedFile } from '../services/fileCleanup.js';
import { authenticate, optionalAuthenticate, requireRole } from '../middleware/authMiddleware.js';
import { uploadRateLimiter } from '../middleware/securityMiddleware.js';
import { validateMagicBytes } from '../utils/validators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const decksDir = path.join(uploadDir, 'decks');
if (!fs.existsSync(decksDir)) {
  fs.mkdirSync(decksDir, { recursive: true });
}

// Strict anchored extension + MIME allowlist (blocks HTML, SVG, JS, PHP, EXE, shell scripts)
const ALLOWED_EXTENSIONS = new Set([
  'jpeg', 'jpg', 'png', 'gif', 'webp',
  'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv',
  'mp4', 'webm', 'mov', 'm4v', 'mkv', 'avi'
]);

const ALLOWED_MIME_PREFIXES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-excel',
  'text/plain', 'text/csv',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/x-msvideo', 'video/x-m4v',
  'application/octet-stream' // Some mobile browsers send octet-stream for valid PDFs/videos; magic-bytes check enforces true type!
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBaseName = path.basename(file.originalname || 'file', ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60) || 'file';
    const uniqueSuffix = `${Date.now()}-${uuidv4().substring(0, 8)}`;
    cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase().replace('.', '');
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error(`File type .${ext || 'unknown'} is not permitted for security reasons.`));
  }
  const mime = String(file.mimetype || '').toLowerCase();
  const mimeOk = ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));
  if (!mimeOk) {
    return cb(new Error('File MIME type is not permitted for security reasons.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150MB max for authenticated educators; enforced to 30MB for public uploads below
    files: 10
  },
  fileFilter
});

const router = express.Router();

function processUploadedFile(file) {
  const ext = path.extname(file.filename).toLowerCase();
  const publicUrl = `/uploads/${file.filename}`;
  const baseName = path.basename(file.filename, ext);

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

  if (/^\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(ext)) {
    return {
      success: true,
      message: 'Video uploaded successfully.',
      url: publicUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      isVideo: true,
      isPresentation: false
    };
  }

  if (/^\.(png|jpe?g|webp|gif)$/i.test(ext)) {
    return {
      success: true,
      message: 'Image uploaded successfully.',
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

// Upload endpoint (rate-limited, extension + MIME + magic-bytes verified)
router.post('/', uploadRateLimiter, optionalAuthenticate, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File is too large.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ success: false, message: 'Maximum of 10 files per upload allowed.' });
      }
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No file was provided in the upload request.' });
    }

    // Public unauthenticated uploads (payment proof slips, applicant CVs/videos) capped at 50MB; authenticated users up to 150MB
    const maxBytes = req.user ? 150 * 1024 * 1024 : 50 * 1024 * 1024;

    // Validate size limit AND real file magic bytes for EVERY uploaded file
    for (const f of files) {
      const ext = path.extname(f.filename).toLowerCase().replace('.', '');
      const validSignature = validateMagicBytes(f.path, ext);
      if (f.size > maxBytes || !validSignature) {
        // Delete all files from this rejected request immediately
        for (const toDelete of files) {
          try { fs.unlinkSync(toDelete.path); } catch { /* ignore */ }
        }
        return res.status(400).json({
          success: false,
          message: !validSignature
            ? 'Security check failed: the uploaded file contents do not match its file extension.'
            : 'Uploaded file exceeds the maximum allowed file size.'
        });
      }
    }

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

    const result = processUploadedFile(files[0]);
    return res.status(200).json(result);
  });
});

// Authenticated classroom users only: retrieve / re-parse an existing presentation file
router.get('/presentation/:filename', authenticate, (req, res) => {
  try {
    const filename = path.basename(req.params.filename || '');
    if (!filename || filename.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid filename.' });
    }
    const filePath = path.resolve(uploadDir, filename);
    if (!filePath.startsWith(path.resolve(uploadDir))) {
      return res.status(403).json({ success: false, message: 'Forbidden file path.' });
    }
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
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load presentation file.' });
  }
});

// Superadmin & Tutor ONLY: delete an uploaded file from storage
router.delete('/:filename', authenticate, requireRole(['superadmin', 'tutor']), (req, res) => {
  try {
    const filename = path.basename(req.params.filename || '');
    if (!filename || filename.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid filename.' });
    }
    const deleted = safeDeleteUploadedFile(`/uploads/${filename}`);
    if (deleted) {
      return res.status(200).json({ success: true, message: `File ${filename} deleted from storage.` });
    }
    return res.status(404).json({ success: false, message: 'File not found or already deleted.' });
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
});

export default router;
