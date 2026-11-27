import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { errorHandler } from './middleware/errorHandler.js';
import {
  securityHeaders,
  corsOptions,
  preventParamPollution,
  sanitizeInputs,
  globalApiRateLimiter
} from './middleware/securityMiddleware.js';
import { initClassroomSocket } from './socket/classroomSocket.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import classRoutes from './routes/classRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import tutorApplicationRoutes from './routes/tutorApplicationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import dailyRoutes from './routes/dailyRoutes.js';
import { store } from './database/store.js';
import { startClassReminderScheduler } from './services/classReminderScheduler.js';

dotenv.config();

// Version 1.0.1 - Beacon Bridge Production LMS Server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Hide framework fingerprint & trust Railway / Vercel reverse proxy for accurate client IP rate limiting
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Socket.IO configuration with strict origin allowlist
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB max socket message size against payload flooding
  allowUpgrades: true
});

// Attach Socket.IO instance to Express app for real-time controllers
app.set('io', io);

// Zero-Trust Security Middleware Stack
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(preventParamPollution);
app.use(sanitizeInputs);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', globalApiRateLimiter);

// Static files for materials, presentations, and uploaded media
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const decksDir = path.join(uploadDir, 'decks');
if (!fs.existsSync(decksDir)) {
  fs.mkdirSync(decksDir, { recursive: true });
}

app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; sandbox");
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir, { dotfiles: 'deny', index: false }));
app.use('/slides', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
}, express.static(path.join(__dirname, 'public/slides'), { dotfiles: 'deny', index: false }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Beacon Bridge Academics LMS & Live Virtual Classroom API',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tutor-applications', tutorApplicationRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/daily', dailyRoutes);

// Explicit handlers for SEO crawlers & Search Console
app.get('/sitemap.xml', (req, res) => {
  const distSitemap = path.join(__dirname, '../client/dist/sitemap.xml');
  const pubSitemap = path.join(__dirname, '../client/public/sitemap.xml');
  const target = fs.existsSync(distSitemap) ? distSitemap : pubSitemap;
  if (fs.existsSync(target)) {
    res.type('application/xml');
    return res.sendFile(target);
  }
  res.status(404).send('Sitemap not found');
});

app.get('/robots.txt', (req, res) => {
  const distRobots = path.join(__dirname, '../client/dist/robots.txt');
  const pubRobots = path.join(__dirname, '../client/public/robots.txt');
  const target = fs.existsSync(distRobots) ? distRobots : pubRobots;
  if (fs.existsSync(target)) {
    res.type('text/plain');
    return res.sendFile(target);
  }
  res.status(404).send('Robots.txt not found');
});

// Serve static frontend build if client/dist exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/slides') ||
      req.path.startsWith('/socket.io')
    ) {
      return next();
    }
    const cleanPath = req.path.replace(/^\//, '');
    const specificHtml = path.join(clientDist, cleanPath, 'index.html');
    if (cleanPath && fs.existsSync(specificHtml)) {
      return res.sendFile(specificHtml);
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Initialize Virtual Classroom Real-Time Socket
initClassroomSocket(io);

// Periodically check approaching deadlines every 15 minutes
setInterval(async () => {
  try {
    await store.checkApproachingDeadlines();
  } catch (err) {
    console.error('Deadline check error:', err);
  }
}, 15 * 60 * 1000);

// Initialize automated 1-hour class reminder scheduler
startClassReminderScheduler();

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`);
  console.log(`🚀 Beacon Bridge Academics LMS Server running on port ${PORT}`);
  console.log(`📡 Socket.IO Real-time Classroom Gateway active`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================`);
});

export { app, server, io };
