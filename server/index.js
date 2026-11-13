import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middleware/errorHandler.js';
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
import { store } from './database/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.IO configuration with cross-origin compatibility
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static files for materials/presentations
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/slides', express.static(path.join(__dirname, 'public/slides')));

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚀 Beacon Bridge Academics LMS Server running on port ${PORT}`);
  console.log(`📡 Socket.IO Real-time Classroom Gateway active`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================`);
});

export { app, server, io };
