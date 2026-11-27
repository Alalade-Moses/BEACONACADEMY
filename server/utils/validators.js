import fs from 'fs';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const isUuid = (value) => typeof value === 'string' && UUID_REGEX.test(value.trim());

export const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 254) return false;
  // Block SMTP/email header injection (CR/LF/NUL)
  if (/[\r\n\0]/.test(trimmed)) return false;
  return EMAIL_REGEX.test(trimmed);
};

export const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

export const GMAIL_ONLY_MESSAGE = 'Only valid @gmail.com email addresses are allowed (e.g. yourname@gmail.com).';

/**
 * Strict @gmail.com domain validator.
 * Optionally allows official institutional domain (@beaconbridgeacademics.co.uk / SUPERADMIN_EMAIL)
 * for staff & superadmin login / provisioning so platform admins are never locked out.
 */
export const isAllowedGmail = (value, { allowOfficialStaff = false } = {}) => {
  if (!isValidEmail(value)) return false;
  const normalized = normalizeEmail(value);
  if (normalized.endsWith('@gmail.com')) return true;

  if (allowOfficialStaff) {
    const officialDomain = (process.env.EMAIL_DOMAIN || 'beaconbridgeacademics.co.uk').trim().toLowerCase();
    const superadminEmail = (process.env.SUPERADMIN_EMAIL || process.env.ADMIN_EMAIL || `admin@${officialDomain}`).trim().toLowerCase();
    if (normalized === superadminEmail || normalized.endsWith(`@${officialDomain}`)) {
      return true;
    }
  }
  return false;
};

export const validatePassword = (password) => {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password must be a valid text string.' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters.' };
  }
  if (/\0/.test(password)) {
    return { valid: false, message: 'Password contains invalid characters.' };
  }
  return { valid: true };
};

export const isSafeUrl = (value, { allowRelative = true, allowEmpty = true } = {}) => {
  if (value === null || value === undefined || value === '') return allowEmpty;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length > 2048) return false;
  if (/[\r\n\0]/.test(trimmed)) return false;

  // Allow safe internal relative paths (/uploads/..., /slides/..., /materials/...)
  if (allowRelative && trimmed.startsWith('/')) {
    if (trimmed.startsWith('//')) return false; // Block protocol-relative URLs
    if (trimmed.includes('..') || trimmed.includes('\\')) return false;
    return /^\/[a-zA-Z0-9/_\-.~%?=#&+@]+$/.test(trimmed);
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const parsePositiveAmount = (value, max = 50000) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0 || num > max) return null;
  return Math.round(num * 100) / 100;
};

export const clampText = (value, maxLength = 2000) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

export const pickFields = (source, allowedKeys) => {
  const out = {};
  if (!source || typeof source !== 'object') return out;
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out;
};

export const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
};

export const stripDangerousInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\0/g, '')
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed|applet|meta|link|base|form)\b[^>]*>/gi, '')
    .replace(/\b(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
};

export const stripHeaderBreaks = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\0]+/g, ' ').trim();
};

/**
 * Inspect file magic bytes to confirm uploaded files match their claimed extension.
 * Prevents attackers from renaming HTML/JS/PHP/EXE payloads to .jpg or .pdf.
 */
export const validateMagicBytes = (filePath, extWithNoDot) => {
  const ext = String(extWithNoDot || '').toLowerCase();
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(16);
    const bytesRead = fs.readSync(fd, buf, 0, 16, 0);
    if (bytesRead === 0) return false;

    const hex = buf.subarray(0, bytesRead).toString('hex');
    const ascii = buf.subarray(0, bytesRead).toString('ascii');

    // Reject executable or HTML/script payloads masquerading as media/documents
    if (/^\s*<(?:!doctype|html|script|svg|xml|iframe)/i.test(ascii)) return false;
    if (hex.startsWith('4d5a') || hex.startsWith('7f454c46') || ascii.startsWith('#!')) return false;

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return hex.startsWith('ffd8ff');
      case 'png':
        return hex.startsWith('89504e470d0a1a0a');
      case 'gif':
        return ascii.startsWith('GIF87a') || ascii.startsWith('GIF89a');
      case 'webp':
        return ascii.startsWith('RIFF') && buf.subarray(8, 12).toString('ascii') === 'WEBP';
      case 'pdf':
        return ascii.startsWith('%PDF-');
      case 'docx':
      case 'pptx':
      case 'xlsx':
        // OOXML files are ZIP archives (PK\x03\x04)
        return hex.startsWith('504b0304') || hex.startsWith('504b0506');
      case 'doc':
      case 'ppt':
      case 'xls':
        // Legacy OLE2 Compound Document or ZIP
        return hex.startsWith('d0cf11e0a1b11ae1') || hex.startsWith('504b0304');
      case 'mp4':
      case 'mov':
      case 'm4v':
        // ISO Base Media File Format: 'ftyp' at byte 4 (or 'moov'/'mdat'/'wide')
        return ['ftyp', 'moov', 'mdat', 'wide', 'free'].includes(buf.subarray(4, 8).toString('ascii'));
      case 'webm':
      case 'mkv':
        return hex.startsWith('1a45dfa3');
      case 'avi':
        return ascii.startsWith('RIFF') && buf.subarray(8, 12).toString('ascii') === 'AVI ';
      case 'txt':
      case 'csv':
        // Plain text must not contain NUL bytes or leading HTML/script tags
        return !buf.subarray(0, bytesRead).includes(0);
      default:
        return false;
    }
  } catch {
    return false;
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // ignore close error
      }
    }
  }
};
