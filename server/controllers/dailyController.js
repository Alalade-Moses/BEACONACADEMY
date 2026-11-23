import { dailyService } from '../services/dailyService.js';

/**
 * Daily.co Classroom Controller
 * Generates room URLs and attendee tokens for tutors and students
 */

/**
 * Get access credentials (room URL + meeting token) for a live classroom
 * POST /api/daily/room-access
 */
export const getRoomAccess = async (req, res) => {
  try {
    const { roomId, asRole } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID or Class ID is required'
      });
    }

    // Check if Daily is configured in .env
    if (!dailyService.isConfigured()) {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'Daily.co is not configured. Add DAILY_API_KEY in server/.env to enable Google Meet-grade audio.'
      });
    }

    const user = req.user || {
      id: 'guest',
      full_name: 'Guest Attendee',
      role: 'student'
    };

    // Determine owner permissions:
    // If asRole is explicitly student, never give owner rights even to admins testing as students
    const isExplicitStudent = asRole === 'student' || req.query.as === 'student';
    const isOwner = !isExplicitStudent && (user.role === 'tutor' || user.role === 'superadmin');

    // 1. Get or create Daily room
    const roomResult = await dailyService.createOrGetRoom(roomId);

    if (!roomResult.configured || !roomResult.url) {
      return res.status(500).json({
        success: false,
        configured: false,
        message: roomResult.error || 'Failed to initialize Daily video room'
      });
    }

    // 2. Generate secure meeting token
    const tokenResult = await dailyService.createMeetingToken(roomResult.name, user, isOwner);

    return res.status(200).json({
      success: true,
      configured: true,
      roomUrl: roomResult.url,
      roomName: roomResult.name,
      token: tokenResult.token,
      isOwner: Boolean(isOwner),
      userName: tokenResult.userName || user.full_name || 'Attendee',
      userRole: user.role
    });
  } catch (error) {
    console.error('[dailyController] getRoomAccess error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error acquiring classroom room access'
    });
  }
};

/**
 * Check Daily.co configuration status
 * GET /api/daily/status
 */
export const getDailyStatus = async (req, res) => {
  try {
    const configured = dailyService.isConfigured();
    return res.status(200).json({
      success: true,
      configured,
      domain: process.env.DAILY_DOMAIN ? `${process.env.DAILY_DOMAIN}.daily.co` : null,
      message: configured
        ? 'Daily.co Video & Audio API is active and ready.'
        : 'Daily.co is not configured. Please supply DAILY_API_KEY in server/.env.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
