import { store } from '../database/store.js';

// In-memory room state tracking
const rooms = new Map();

const cleanRoomId = (id) => String(id || '').trim().toUpperCase();

export const initClassroomSocket = (io) => {
  io.on('connection', (socket) => {
    let currentRoomId = null;
    let currentUser = null;
    let joinTime = null;

    // Join virtual classroom room
    socket.on('join_room', async ({ roomId, user }) => {
      const normRoomId = cleanRoomId(roomId);
      currentRoomId = normRoomId;
      currentUser = user;
      joinTime = new Date();

      socket.join(normRoomId);

      if (!rooms.has(normRoomId)) {
        rooms.set(normRoomId, {
          participants: new Map(),
          currentSlide: 1,
          totalSlides: 6,
          slideMode: 'presentation', // 'presentation' | 'whiteboard'
          presentationUrl: null,
          presentationSlides: [],
          slideStrokes: {}, // keyed by slideIndex
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
        user,
        joinedAt: joinTime,
        isMuted: false,
        isVideoOff: false,
        isHandRaised: false
      });

      // Auto-log attendance in database
      const classRecord = await store.getClassById(normRoomId);
      if (classRecord) {
        if (classRecord.status) room.status = classRecord.status;
        if (classRecord.duration_minutes) room.durationMinutes = classRecord.duration_minutes;
        if (classRecord.status === 'live' && !room.startedAt) {
          room.startedAt = Date.now();
        }
      }
      if (classRecord && user && user.id) {
        await store.logAttendance({
          class_id: classRecord.id,
          user_id: user.id,
          role: user.role,
          status: 'present'
        });
      }

      // Notify others in room for WebRTC mesh connection
      socket.to(normRoomId).emit('user_joined', {
        socketId: socket.id,
        user
      });

      // Send initial room state to joining participant
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

      // Broadcast updated roster to entire room
      io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));

      console.log(`[Socket] User ${user?.full_name || 'Guest'} (${user?.role || 'student'}) joined room: ${normRoomId}`);
    });

    // Slide Navigation
    socket.on('slide_change', ({ roomId, slideIndex, totalSlides }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.currentSlide = slideIndex;
        if (totalSlides) room.totalSlides = totalSlides;
        
        io.to(normRoomId).emit('slide_updated', {
          slideIndex,
          totalSlides: room.totalSlides,
          strokes: room.slideStrokes[slideIndex] || []
        });
      }
    });

    // Slide Mode Switch (Presentation Deck vs Digital Whiteboard)
    socket.on('slide_mode_change', ({ roomId, mode }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.slideMode = mode;
        io.to(normRoomId).emit('slide_mode_updated', { mode });
      }
    });

    // Custom Presentation / Slide Deck Upload & Change
    socket.on('update_presentation', ({ roomId, presentationUrl, slides, totalSlides }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.presentationUrl = presentationUrl || null;
        room.presentationSlides = slides || [];
        room.currentSlide = 1;
        room.totalSlides = totalSlides || (slides && slides.length > 0 ? slides.length : 6);
        room.slideStrokes = {}; // Clear previous strokes on new presentation

        io.to(normRoomId).emit('presentation_updated', {
          presentationUrl: room.presentationUrl,
          slides: room.presentationSlides,
          currentSlide: 1,
          totalSlides: room.totalSlides
        });
      }
    });

    // Live Streaming Stroke Step (60fps continuous drawing sync)
    socket.on('draw_step', ({ roomId, step }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      socket.to(normRoomId).emit('stroke_step_received', step);
    });

    // Synchronized Slide Annotations & Digital Whiteboard (Finalized stroke)
    socket.on('draw_stroke', ({ roomId, stroke }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        const slide = stroke.slideIndex || room.currentSlide;
        if (!room.slideStrokes[slide]) {
          room.slideStrokes[slide] = [];
        }
        room.slideStrokes[slide].push(stroke);

        // Broadcast to other participants in room
        socket.to(normRoomId).emit('stroke_received', stroke);
      }
    });

    socket.on('clear_canvas', ({ roomId, slideIndex }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        const slide = slideIndex || room.currentSlide;
        room.slideStrokes[slide] = [];
        io.to(normRoomId).emit('canvas_cleared', { slideIndex: slide });
      }
    });

    socket.on('undo_stroke', ({ roomId, slideIndex }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
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

    socket.on('request_canvas_state', ({ roomId, slideIndex }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        socket.emit('canvas_state', {
          slideIndex,
          strokes: room.slideStrokes[slideIndex] || []
        });
      }
    });

    // WebRTC Peer Signaling (Offer, Answer, ICE Candidates, Media State)
    socket.on('webrtc_offer', ({ to, targetSocketId, user: senderUser, offer, isScreen }) => {
      const targetId = to || targetSocketId;
      if (targetId) {
        io.to(targetId).emit('webrtc_offer', {
          from: socket.id,
          senderSocketId: socket.id,
          user: senderUser || currentUser,
          offer,
          isScreen: Boolean(isScreen)
        });
      }
    });

    socket.on('webrtc_answer', ({ to, targetSocketId, user: senderUser, answer }) => {
      const targetId = to || targetSocketId;
      if (targetId) {
        io.to(targetId).emit('webrtc_answer', {
          from: socket.id,
          senderSocketId: socket.id,
          user: senderUser || currentUser,
          answer
        });
      }
    });

    socket.on('ice_candidate', ({ to, targetSocketId, candidate }) => {
      const targetId = to || targetSocketId;
      if (targetId) {
        io.to(targetId).emit('ice_candidate', {
          from: socket.id,
          senderSocketId: socket.id,
          candidate
        });
      }
    });

    socket.on('media_state_change', ({ roomId, isVideoActive, isMicActive }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room && room.participants && room.participants.has(socket.id)) {
        const participant = room.participants.get(socket.id);
        participant.isVideoOff = !isVideoActive;
        participant.isMuted = !isMicActive;
      }
      socket.to(normRoomId).emit('participant_media_state_changed', {
        socketId: socket.id,
        user: currentUser,
        isVideoActive,
        isMicActive
      });
    });

    // Live Class Session Launch
    socket.on('launch_class', ({ roomId, durationMinutes }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      const now = Date.now();
      if (room) {
        room.status = 'live';
        if (!room.startedAt) room.startedAt = now;
        if (durationMinutes) room.durationMinutes = durationMinutes;
      }
      io.to(normRoomId).emit('class_status_changed', { 
        status: 'live',
        startedAt: room?.startedAt || now,
        durationMinutes: room?.durationMinutes || durationMinutes || 60
      });
    });

    // Conclude / End Class Session
    socket.on('end_class', ({ roomId }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.status = 'completed';
      }
      io.to(normRoomId).emit('class_status_changed', { status: 'completed' });
      io.to(normRoomId).emit('class_ended', {
        message: 'This live class session has been concluded by the instructor.'
      });
    });

    socket.on('screen_share_status', ({ roomId, isSharing }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.screenSharerId = isSharing ? socket.id : null;
        io.to(normRoomId).emit('screen_share_status', {
          socketId: socket.id,
          userName: currentUser ? currentUser.full_name : 'Participant',
          isSharing
        });
      }
    });

    // Recording status sync
    socket.on('recording_status', ({ roomId, isRecording }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room) {
        room.isRecording = isRecording;
        io.to(normRoomId).emit('recording_status_changed', { isRecording });
      }
    });

    // In-Class Chat
    socket.on('chat_message', ({ roomId, message }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const payload = {
        id: Date.now().toString(),
        sender: currentUser,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      io.to(normRoomId).emit('chat_message', payload);
    });

    // Hand Raising
    socket.on('toggle_hand_raise', ({ roomId }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room && room.participants.has(socket.id)) {
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

    // Lower Hand (by Tutor or Participant)
    socket.on('lower_hand', ({ roomId, targetSocketId }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      const room = rooms.get(normRoomId);
      if (room && room.participants.has(targetSocketId)) {
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

    // Tutor remote mute
    socket.on('mute_participant', ({ roomId, targetSocketId }) => {
      const normRoomId = cleanRoomId(roomId || currentRoomId);
      io.to(targetSocketId).emit('force_mute');
      const room = rooms.get(normRoomId);
      if (room && room.participants.has(targetSocketId)) {
        room.participants.get(targetSocketId).isMuted = true;
        io.to(normRoomId).emit('roster_update', Array.from(room.participants.values()));
      }
    });

    // Disconnect cleanup
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
          // Cleanup empty room after 1 hour grace
          setTimeout(() => {
            if (rooms.has(currentRoomId) && rooms.get(currentRoomId).participants.size === 0) {
              rooms.delete(currentRoomId);
            }
          }, 3600000);
        }
      }
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
};
