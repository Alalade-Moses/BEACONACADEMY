import jwt from 'jsonwebtoken';
import { store } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'beaconbridge_super_secret_jwt_key_2026';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('⚠️ [SECURITY WARNING] JWT_SECRET environment variable is not set in production! Set a strong random 64-char JWT_SECRET immediately.');
}

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d'
    }
  );
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token || token.length > 2048) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token.' });
    }

    const decoded = verifyJwtToken(token);
    const user = await store.getProfileById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'This account has been suspended by an administrator.' });
    }

    if (user.status === 'pending_verification') {
      return res.status(403).json({
        success: false,
        pending_verification: true,
        message: 'Your registration is currently pending admin payment verification. Please wait for verification or contact administration.'
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

/**
 * Optional authentication for public routes that enhance responses when a valid JWT is present
 * (e.g. GET /api/blog, GET /api/courses, POST /api/payments/proof). Never grants elevated rights on invalid tokens.
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1]?.trim();
    if (!token || token.length > 2048) return next();

    const decoded = verifyJwtToken(token);
    const user = await store.getProfileById(decoded.id);
    if (user && user.status === 'active') {
      req.user = user;
    }
  } catch {
    // Ignore invalid/expired token on optional-auth routes
  }
  next();
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action.'
      });
    }

    next();
  };
};

export const authorize = (...roles) => {
  const flatRoles = roles.flat();
  return requireRole(flatRoles);
};
