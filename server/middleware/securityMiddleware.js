import { stripDangerousInput, normalizeEmail } from '../utils/validators.js';

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const PASSWORD_KEYS = new Set([
  'password',
  'currentPassword',
  'newPassword',
  'confirm_password',
  'student_password',
  'parent_password',
  'tempPassword'
]);

const MAX_OBJECT_DEPTH = 10;
const MAX_ARRAY_LENGTH = 200;

/**
 * Recursive input sanitizer:
 *  - Blocks prototype pollution (__proto__, constructor, prototype)
 *  - Caps JSON depth & array length against structural DoS
 *  - Strips <script>, <iframe>, inline event handlers, javascript: URIs, and null bytes
 *  - Preserves password fields verbatim (except null bytes) so legitimate complex passwords work
 */
const sanitizeValue = (value, depth = 0, parentKey = '') => {
  if (depth > MAX_OBJECT_DEPTH) {
    const err = new Error('Request payload exceeds maximum nesting depth.');
    err.statusCode = 400;
    throw err;
  }

  if (typeof value === 'string') {
    if (PASSWORD_KEYS.has(parentKey)) {
      return value.replace(/\0/g, '').slice(0, 128);
    }
    return stripDangerousInput(value);
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_LENGTH) {
      const err = new Error('Request payload contains too many array items.');
      err.statusCode = 400;
      throw err;
    }
    return value.map((item) => sanitizeValue(item, depth + 1, parentKey));
  }

  if (value !== null && typeof value === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(k)) continue;
      clean[k] = sanitizeValue(v, depth + 1, k);
    }
    return clean;
  }

  return value;
};

/**
 * HTTP Security Headers Middleware (Helmet-grade, zero external dependency).
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader(
    'Permissions-Policy',
    'camera=(self), microphone=(self), display-capture=(self), geolocation=(), payment=(), usb=()'
  );
  if (req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

/**
 * Strict CORS origin allowlist check (shared by Express & Socket.IO).
 */
export const isAllowedOrigin = (origin) => {
  // Allow same-origin requests, health probes, server-to-server requests (no Origin header)
  if (!origin) return true;

  const envOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const staticAllowlist = new Set([
    'https://beaconbridgeacademics.co.uk',
    'https://www.beaconbridgeacademics.co.uk',
    'https://beaconbridge-server-production.up.railway.app',
    ...envOrigins
  ]);

  const normalized = origin.replace(/\/$/, '');
  if (staticAllowlist.has(normalized)) return true;

  // Allow localhost / 127.0.0.1 dev origins
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) {
    return true;
  }

  // Allow official Beacon Bridge Vercel preview deployments only
  if (/^https:\/\/[a-z0-9-]*(beaconbridge|beaconacademy)[a-z0-9-]*\.vercel\.app$/i.test(normalized)) {
    return true;
  }

  return false;
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    const err = new Error('Origin not allowed by CORS security policy.');
    err.statusCode = 403;
    return callback(err);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 600
};

/**
 * Prevents HTTP Parameter Pollution (?role=student&role=superadmin)
 * by normalizing array query values to their final scalar string.
 */
export const preventParamPollution = (req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    for (const [key, val] of Object.entries(req.query)) {
      if (FORBIDDEN_KEYS.has(key)) {
        delete req.query[key];
        continue;
      }
      if (Array.isArray(val)) {
        req.query[key] = val[val.length - 1];
      }
    }
  }
  next();
};

/**
 * Sanitizes req.body, req.query, and req.params on every API request.
 */
export const sanitizeInputs = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body, 0);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query, 0);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params, 0);
    }
    next();
  } catch (err) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Invalid input payload.'
    });
  }
};

/**
 * Extract reliable client IP behind Railway / Vercel reverse proxies.
 */
export const getClientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * Bounded sliding-window rate limiter factory (no external dependencies, DoS-safe memory bound).
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = 'rl',
  message = 'Too many requests. Please wait a few minutes and try again.',
  keyGenerator = null
}) => {
  const buckets = new Map();
  const MAX_KEYS = 20000;

  // Periodic background cleanup so stale buckets never leak memory
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, entry] of buckets.entries()) {
      if (entry.resetAt <= now) buckets.delete(k);
    }
  }, Math.min(windowMs, 5 * 60 * 1000));
  if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();

  return (req, res, next) => {
    const now = Date.now();
    const rawKey = keyGenerator ? keyGenerator(req) : getClientIp(req);
    const key = `${keyPrefix}:${rawKey}`;

    let entry = buckets.get(key);
    if (!entry || entry.resetAt <= now) {
      if (buckets.size >= MAX_KEYS) {
        // Evict oldest entry when map reaches cap
        const firstKey = buckets.keys().next().value;
        if (firstKey) buckets.delete(firstKey);
      }
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(key, entry);
    }

    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(retryAfterSec));

    if (entry.count > max) {
      res.setHeader('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        success: false,
        rate_limited: true,
        retry_after_seconds: retryAfterSec,
        message
      });
    }

    next();
  };
};

// Pre-configured route rate limiters
export const globalApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  keyPrefix: 'global',
  message: 'Too many requests from this network. Please slow down and try again shortly.'
});

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyPrefix: 'login_ip',
  message: 'Too many sign-in attempts from this network. Please wait 15 minutes before trying again.'
});

export const authWriteRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: 'auth_write',
  message: 'Too many registration or password requests. Please wait 15 minutes before trying again.'
});

export const publicFormRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  keyPrefix: 'public_form',
  message: 'You have submitted several forms recently. Please wait a few minutes before submitting again.'
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: 'upload',
  message: 'Too many file uploads in a short period. Please wait a few minutes and try again.'
});

/**
 * Per-(IP + email) consecutive failed login tracker & temporary lockout
 * Locks after 5 wrong passwords for 3 minutes; resets immediately on valid login.
 */
const failedLoginStore = new Map();
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 3 * 60 * 1000;

const failedLoginKey = (ip, email) => `${ip || 'unknown'}:${normalizeEmail(email)}`;

export const checkLoginLockout = (ip, email) => {
  const key = failedLoginKey(ip, email);
  const record = failedLoginStore.get(key);
  if (!record) return { locked: false };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
    return { locked: true, retryAfterSeconds };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    failedLoginStore.delete(key);
  }
  return { locked: false };
};

export const recordFailedLogin = (ip, email) => {
  const key = failedLoginKey(ip, email);
  const now = Date.now();
  let record = failedLoginStore.get(key);

  if (!record || (record.windowResetAt && record.windowResetAt <= now)) {
    if (failedLoginStore.size >= 15000) {
      const oldest = failedLoginStore.keys().next().value;
      if (oldest) failedLoginStore.delete(oldest);
    }
    record = { attempts: 0, windowResetAt: now + LOGIN_LOCKOUT_MS, lockedUntil: null };
  }

  record.attempts += 1;
  if (record.attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOGIN_LOCKOUT_MS;
  }
  failedLoginStore.set(key, record);

  return {
    attempts: record.attempts,
    remaining: Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - record.attempts),
    locked: Boolean(record.lockedUntil && record.lockedUntil > now),
    retryAfterSeconds: record.lockedUntil ? Math.ceil((record.lockedUntil - now) / 1000) : 0
  };
};

export const clearFailedLogins = (ip, email) => {
  failedLoginStore.delete(failedLoginKey(ip, email));
};
