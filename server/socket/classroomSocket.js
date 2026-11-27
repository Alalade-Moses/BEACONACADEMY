import { store } from '../database/store.js';
import { verifyJwtToken } from '../middleware/authMiddleware.js';
import { stripDangerousInput, isSafeUrl } from '../utils/validators.js';

// Active classroom room state (ephemeral real-time signaling state only; attendance persists in PostgreSQL)
const rooms = new Map();

const cleanRoomId = (id) => String(id || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 64);
const isInstructor = (user) => Boolean(user && (user.role === 'tutor' || user.role === 'superadmin'));

export const initClassroomSocket = (io) => {
  // Attach verified user on handshake if a valid JWT token is supplied;
  // Unauthenticated sockets remain read-only for public real-time blog updates only.
  io.use(async (socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token ||
        (typeof socket.handshake.headers?.authorization === 'string' &&
        socket.handshake.headers.authorization.startsWith('Bearer ')
          ? socket.handshake.headers.authorization.slice(7).trim()
          : null);

      if (rawToken && typeof rawToken === 'string' && rawToken.length <= 2048) {
        const decoded = verifyJwtToken(rawToken);
        const dbUser = await store.getProfileById(decoded.id);
        if (dbUser && dbUser.status === 'active') {
          const { password_hash, ...safeUser } = dbUser;
          socket.authenticatedUser = safeUser;
        }
      }
    } catch {
      // Invalid token simply results in unauthenticated (read-only blog) socket
      socket.authenticatedUser = null;
    }
    next();
  });

  io.on('connection', (socket) => {
    let currentRoomId = null;
    let currentUser = socket.authenticatedUser || null;
    let joinTime = null;

    // Join personal user channel so live-class & tutor-assignment alerts arrive immediately
    if (currentUser?.id) {
      socket.join(`user:${currentUser.id}`);
    }

    const requireClassroomAuth = () => {
      if (!currentUser || !currentUser.id) {
        socket.emit('classroom_error', { message: 'Authentication required to participate in live classrooms.' });
        return false;
      }
      return true;
    };

    // Join virtual classroom room (strictly authenticated — never trusts spoofed client user payload)
    socket.on('join_room', async ({ roomId } = {}) => {
      if (!requireClassroomAuth()) return;
      const normRoomId = cleanRoomId(roomId);
      if (!normRoomId) return;

      try {
        const classRecord = await store.getClassById(normRoomId);
        if (classRecord) {
          // Strict classroom isolation: students may only join sessions hosted by their assigned tutor
          if (currentUser.role === 'student') {
            const assignedTutorIds = await store.getAssignedTutorIdsForStudent(currentUser.id, classRecord.course_id);
            if (!assignedTutorIds.includes(classRecord.tutor_id)) {
              socket.emit('classroom_error', {
                message: 'Access denied: You can only join live classes hosted by your assigned tutor.'
              });
              return;
            }
          }
          if (currentUser.role === 'tutor' && classRecord.tutor_id !== currentUser.id) {
            socket.emit('classroom_error', {
              message: 'Access denied: This classroom belongs to another tutor.'
            });
            return;
          }
        }
      } catch (authErr) {
        console.warn('[Socket Room Auth Notice]:', authErr.message);
      }

      currentRoomId = normRoomId;
      joinTime = new Date();
      socket.join(normRoomId);

      if (!rooms.has(normRoomId)) {
        rooms.set(normRoomId, {
          participants: new Map(),
          currentSlide: 1,
          totalSlides: 6,
          slideMode: 'presentation',
          presentationUrl: null,
          presentationSlides: [],
          slideStrokes: {},
          handRaises: new Set(),
          isRecording: false,
          screenSharerId: null,
          status: 'scheduled',
          startedAt: null,
          durationMinutes: 60
        });
      }

      const room = rooms.get(normRoomId);
      room.participants.set(socket.id, {
        socketId: socket.id,
        user: currentUser,
        joinedAt: joinTime,
        isMuted: false,
        isVideoOff: false,
        isHandRaised: false
      });

      try {
        const classRecord = await store.getClassById(normRoomId);
        if (classRecord) {
          if (classRecord.status) room.status = classRecord.status;
          if (classRecord.duration_minutes) room.durationMinutes = classRecord.duration_minutes;
          if (classRecord.status === 'live' && !room.startedAt) {
            room.startedAt = Date.now();
          }
          await store.logAttendance({
            class_id: classRecord.id,
            user_id: currentUser.id,
            role: currentUser.role,
            status: 'present'
          });
        }
      } catch (err) {
        console.warn('[Socket Attendance Notice]:', err.message);
      }

      socket.to(normRoomId).emit('user_joined', {
        socketId: socket.id,
        user: currentUser
      });

      socket.emit('room_init_state', {
        participants: Array.from(room.participants.values()),
        currentSlide: room.currentSlide,
        totalSlides: room.totalSlides,
        slideMode: room.slideMode || 'presentation',
        presentationUrl: room.presentationUrl,
        presentationSlides: room.presentationSlides || [],
        strokes: room.slideStrokes[room.currentSlide] || [],
        isRecording: room.isRecording,
        screenSharerId: room.screenSharerId,
        status: room.status,
        startedAt: room.startedAt,
        durationMinutes: room.durationMinutes
      });

      io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));
    });

    socket.on('slide_change', ({ roomId, slideIndex, totalSlides } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      const idx = parseInt(slideIndex, 10);
      if (room && Number.isFinite(idx) && idx >= 1 && idx <= 500) {
        room.currentSlide = idx;
        if (totalSlides && Number.isFinite(Number(totalSlides))) {
          room.totalSlides = Math.min(500, Math.max(1, parseInt(totalSlides, 10)));
        }
        io.to(normRoomId).emit('slide_updated', {
          slideIndex: room.currentSlide,
          totalSlides: room.totalSlides,
          strokes: room.slideStrokes[room.currentSlide] || []
        });
      }
    });

    socket.on('slide_mode_change', ({ roomId, mode } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      if (!['presentation', 'whiteboard'].includes(mode)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.slideMode = mode;
        io.to(normRoomId).emit('slide_mode_updated', { mode });
      }
    });

    socket.on('update_presentation', ({ roomId, presentationUrl, slides, totalSlides } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      if (presentationUrl && !isSafeUrl(presentationUrl, { allowRelative: true, allowEmpty: true })) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.presentationUrl = presentationUrl || null;
        room.presentationSlides = Array.isArray(slides) ? slides.slice(0, 200) : [];
        room.currentSlide = 1;
        room.totalSlides = Math.min(200, parseInt(totalSlides, 10) || (room.presentationSlides.length || 6));
        room.slideStrokes = {};

        io.to(normRoomId).emit('presentation_updated', {
          presentationUrl: room.presentationUrl,
          slides: room.presentationSlides,
          currentSlide: 1,
          totalSlides: room.totalSlides
        });
      }
    });

    socket.on('draw_step', ({ roomId, step } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      socket.to(normRoomId).emit('stroke_step_received', step);
    });

    socket.on('draw_stroke', ({ roomId, stroke } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId || !stroke) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      const room = rooms.get(normRoomId);
      if (room) {
        const slide = stroke.slideIndex || room.currentSlide;
        if (!room.slideStrokes[slide]) room.slideStrokes[slide] = [];
        if (room.slideStrokes[slide].length < 500) {
          room.slideStrokes[slide].push(stroke);
        }
        socket.to(normRoomId).emit('stroke_received', stroke);
      }
    });

    socket.on('clear_canvas', ({ roomId, slideIndex } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        const slide = slideIndex || room.currentSlide;
        room.slideStrokes[slide] = [];
        io.to(normRoomId).emit('canvas_cleared', { slideIndex: slide });
      }
    });

    socket.on('undo_stroke', ({ roomId, slideIndex } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      const room = rooms.get(normRoomId);
      if (room) {
        const slide = slideIndex || room.currentSlide;
        if (room.slideStrokes[slide] && room.slideStrokes[slide].length > 0) {
          room.slideStrokes[slide].pop();
          io.to(normRoomId).emit('stroke_undone', {
            slideIndex: slide,
            strokes: room.slideStrokes[slide]
          });
        }
      }
    });

    socket.on('request_canvas_state', ({ roomId, slideIndex } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        socket.emit('canvas_state', {
          slideIndex,
          strokes: room.slideStrokes[slideIndex] || []
        });
      }
    });

    // WebRTC Peer Signaling (restricted to authenticated participants in same room)
    socket.on('webrtc_offer', ({ to, targetSocketId, offer, isScreen } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const targetId = to || targetSocketId;
      const room = rooms.get(currentRoomId);
      if (targetId && room?.participants.has(targetId)) {
        io.to(targetId).emit('webrtc_offer', {
          from: socket.id,
          senderSocketId: socket.id,
          user: currentUser,
          offer,
          isScreen: Boolean(isScreen)
        });
      }
    });

    socket.on('webrtc_answer', ({ to, targetSocketId, answer } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const targetId = to || targetSocketId;
      const room = rooms.get(currentRoomId);
      if (targetId && room?.participants.has(targetId)) {
        io.to(targetId).emit('webrtc_answer', {
          from: socket.id,
          senderSocketId: socket.id,
          user: currentUser,
          answer
        });
      }
    });

    socket.on('ice_candidate', ({ to, targetSocketId, candidate } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const targetId = to || targetSocketId;
      const room = rooms.get(currentRoomId);
      if (targetId && room?.participants.has(targetId)) {
        io.to(targetId).emit('ice_candidate', {
          from: socket.id,
          senderSocketId: socket.id,
          candidate
        });
      }
    });

    socket.on('media_state_change', ({ roomId, isVideoActive, isMicActive } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      const room = rooms.get(normRoomId);
      if (room?.participants.has(socket.id)) {
        const participant = room.participants.get(socket.id);
        participant.isVideoOff = !isVideoActive;
        participant.isMuted = !isMicActive;
      }
      socket.to(normRoomId).emit('participant_media_state_changed', {
        socketId: socket.id,
        user: currentUser,
        isVideoActive: Boolean(isVideoActive),
        isMicActive: Boolean(isMicActive)
      });
    });

    // Tutor-only class launch control (Superadmin monitors, never launches as instructor)
    socket.on('launch_class', ({ roomId, durationMinutes } = {}) => {
      if (!requireClassroomAuth() || currentUser.role !== 'tutor') return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      const now = Date.now();
      if (room) {
        room.status = 'live';
        if (!room.startedAt) room.startedAt = now;
        if (durationMinutes) room.durationMinutes = Math.min(360, Math.max(15, parseInt(durationMinutes, 10) || 60));
      }
      io.to(normRoomId).emit('class_status_changed', {
        status: 'live',
        startedAt: room?.startedAt || now,
        durationMinutes: room?.durationMinutes || 60
      });
    });

    socket.on('end_class', ({ roomId } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) room.status = 'completed';
      io.to(normRoomId).emit('class_status_changed', { status: 'completed' });
      io.to(normRoomId).emit('class_ended', {
        message: 'This live class session has been concluded by the instructor.'
      });
    });

    socket.on('screen_share_status', ({ roomId, isSharing } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      const room = rooms.get(normRoomId);
      if (room) {
        room.screenSharerId = isSharing ? socket.id : null;
        io.to(normRoomId).emit('screen_share_status', {
          socketId: socket.id,
          userName: currentUser.full_name || 'Participant',
          isSharing: Boolean(isSharing)
        });
      }
    });

    socket.on('recording_status', ({ roomId, isRecording } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.isRecording = Boolean(isRecording);
        io.to(normRoomId).emit('recording_status_changed', { isRecording: room.isRecording });
      }
    });

    // Sanitized In-Class Chat
    socket.on('chat_message', ({ roomId, message } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      if (normRoomId !== currentRoomId) return;
      const cleanMsg = stripDangerousInput(String(message || '')).trim().slice(0, 1000);
      if (!cleanMsg) return;

      io.to(normRoomId).emit('chat_message', {
        id: Date.now().toString(),
        sender: currentUser,
        text: cleanMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    socket.on('toggle_hand_raise', ({ roomId } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room?.participants.has(socket.id)) {
        const participant = room.participants.get(socket.id);
        participant.isHandRaised = !participant.isHandRaised;
        io.to(normRoomId).emit('hand_raise_status', {
          socketId: socket.id,
          user: currentUser,
          isHandRaised: participant.isHandRaised
        });
        io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));
      }
    });

    socket.on('lower_hand', ({ roomId, targetSocketId } = {}) => {
      if (!requireClassroomAuth() || !currentRoomId) return;
      if (targetSocketId !== socket.id && !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room?.participants.has(targetSocketId)) {
        const participant = room.participants.get(targetSocketId);
        participant.isHandRaised = false;
        io.to(normRoomId).emit('hand_raise_status', {
          socketId: targetSocketId,
          user: participant.user,
          isHandRaised: false
        });
        io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));
      }
    });

    // Instructor-only remote mute
    socket.on('mute_participant', ({ roomId, targetSocketId } = {}) => {
      if (!requireClassroomAuth() || !isInstructor(currentUser)) return;
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room?.participants.has(targetSocketId)) {
        io.to(targetSocketId).emit('force_mute');
        room.participants.get(targetSocketId).isMuted = true;
        io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));
      }
    });

    socket.on('disconnect', () => {
      if (currentRoomId && rooms.has(currentRoomId)) {
        const room = rooms.get(currentRoomId);
        room.participants.delete(socket.id);

        if (room.screenSharerId === socket.id) {
          room.screenSharerId = null;
          io.to(currentRoomId).emit('screen_share_status', { isSharing: false });
        }

        socket.to(currentRoomId).emit('user_left', {
          socketId: socket.id,
          user: currentUser
        });

        io.to(currentRoomId).emit('roster_update', Array.from(room.participants.values()));

        if (room.participants.size === 0) {
          setTimeout(() => {
            if (rooms.has(currentRoomId) && rooms.get(currentRoomId).participants.size === 0) {
              rooms.delete(currentRoomId);
            }
          }, 3600000);
        }
      }
    });
  });
};
