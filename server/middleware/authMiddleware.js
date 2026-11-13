import jwt from 'jsonwebtoken';
import { store } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'beaconbridge_super_secret_jwt_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

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
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
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
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]. Your role is ${req.user.role}.` 
      });
    }

    next();
  };
};

export const authorize = (...roles) => {
  const flatRoles = roles.flat();
  return requireRole(flatRoles);
};
