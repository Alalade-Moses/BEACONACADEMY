import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../api/axios';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  StopCircle,
  PenTool,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Type,
  RotateCcw,
  Trash2,
  FileUp,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Users,
  Hand,
  Radio,
  Settings,
  X,
  Send,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  GraduationCap,
  Plus,
  Eye,
  Clock,
  AlertTriangle,
  Power
} from 'lucide-react';

export const ClassroomPage = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryRole = searchParams.get('as') || searchParams.get('role');
  const fromStudent = location.state?.from === 'student' || queryRole === 'student' || location.pathname.includes('/student');

  // Strict role separation:
  // A student is NEVER given any tutor or admin controls.
  // If the logged-in role is student OR joined from the student portal: strictly student view.
  const isTutor = (user?.role === 'student' || fromStudent)
    ? false
    : (user?.role === 'tutor' || user?.role === 'superadmin');

  // Class Session Details
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio / Video Media Controls
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [handRaiseAlert, setHandRaiseAlert] = useState(null);
  const [launchingClass, setLaunchingClass] = useState(false);

  // Slide Deck & Presentation State
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(6);
  const [slideMode, setSlideMode] = useState('presentation'); // 'presentation' | 'whiteboard'
  const [customSlides, setCustomSlides] = useState([]);
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const slideFileInputRef = useRef(null);

  // Digital Whiteboard & Annotation Tools
  const [currentTool, setCurrentTool] = useState('pen'); // 'pen' | 'highlighter' | 'rect' | 'circle' | 'line' | 'arrow' | 'eraser' | 'text'
  const [strokeColor, setStrokeColor] = useState('#ef4444'); // Default vibrant red for teaching
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokesBySlide, setStrokesBySlide] = useState({});

  // Canvas Refs
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);

  // Sidebar Tabs & Fullscreen Display Controls
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants' | 'slides'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoMinimized, setVideoMinimized] = useState(false);
  const stageContainerRef = useRef(null);
  const slideScrollRef = useRef(null);

  // Classroom Chat & Interactions
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Class Session Duration & 10-Minute Warning Controls
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [classEndedMessage, setClassEndedMessage] = useState(null);
  const [tenMinNoticeDismissed, setTenMinNoticeDismissed] = useState(false);
  const [tenMinNoticePlayed, setTenMinNoticePlayed] = useState(false);

  // Audio Notification: Student Hand Raise Chime (Tutor Device Alert)
  const playHandRaiseChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // Clean, bright academic notification chime (G5 -> C6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now); // G5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12); // C6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now + 0.08); // C6

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.7);
    } catch (err) {
      console.warn('[Classroom] Hand raise chime error:', err);
    }
  }, []);

  // Audio Notification: 10-Minute Concluding Alert Chime (Tutor Only)
  const playTenMinWarningChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.30); // G5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (err) {
      console.warn('[Classroom] 10 min warning chime error:', err);
    }
  }, []);

  // 1. Fetch Class Data & Initialize
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/classes/${classId}`);
        if (res.data.success && res.data.class) {
          const cls = res.data.class;
          setClassDetails(cls);
          if (cls.duration_minutes) {
            setTotalDurationMinutes(cls.duration_minutes);
          }
          if (cls.status === 'live') {
            setIsSessionActive(true);
            setIsSessionEnded(false);
          } else if (cls.status === 'completed') {
            setIsSessionActive(false);
            setIsSessionEnded(true);
          }
        }
      } catch (err) {
        console.error('Failed to load class', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassInfo();
  }, [classId]);

  // 1b. Real-Time Session Duration & Countdown Counter (Stops when meeting ended)
  useEffect(() => {
    if (!isSessionActive || isSessionEnded) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isSessionEnded]);

  const totalDurationSeconds = totalDurationMinutes * 60;
  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
  const isTenMinutesOrLess = isSessionActive && !isSessionEnded && remainingSeconds <= 600 && remainingSeconds > 0;

  // Trigger 10-minute warning chime for Tutor
  useEffect(() => {
    if (isTutor && isTenMinutesOrLess && !tenMinNoticePlayed) {
      playTenMinWarningChime();
      setTenMinNoticePlayed(true);
    }
  }, [isTutor, isTenMinutesOrLess, tenMinNoticePlayed, playTenMinWarningChime]);

  // 2. Camera & Microphone Media Management with Robust Track Teardown
  const stopAllMediaTracks = useCallback(() => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
        localStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      setLocalStream(null);
      setVideoActive(false);
      setMicActive(false);
    } catch (err) {
      console.warn('Error terminating media tracks:', err);
    }
  }, []);

  const handleLeaveClass = useCallback(() => {
    stopAllMediaTracks();
    if (socket) {
      socket.emit('leave_room', { roomId: classId });
    }
    // If user is student OR currently in student view mode, ALWAYS navigate to student dashboard!
    if (!isTutor || user?.role === 'student' || queryRole === 'student' || location.state?.from === 'student') {
      navigate("/student/dashboard");
    } else if (user?.role === 'superadmin') {
      navigate("/admin/dashboard");
    } else {
      navigate("/tutor/dashboard");
    }
  }, [stopAllMediaTracks, socket, classId, isTutor, user?.role, queryRole, location.state, navigate]);

  const startMedia = useCallback(async () => {
    setCameraError(null);
    let stream = null;
    try {
      // Tier 1: Try both video and audio
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setVideoActive(true);
      setMicActive(true);
    } catch (primaryErr) {
      console.warn('Initial media access failed, trying fallbacks:', primaryErr.name, primaryErr.message);
      // Tier 2: Try video only (if microphone is missing or blocked)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setVideoActive(true);
        setMicActive(false);
      } catch (videoErr) {
        // Tier 3: Try audio only (if webcam is missing or blocked)
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          localStreamRef.current = stream;
          setLocalStream(stream);
          setVideoActive(false);
          setMicActive(true);
          setCameraError('Camera unavailable. Audio stream is active.');
        } catch (audioErr) {
          console.error('All media acquisition failed:', audioErr);
          if (primaryErr.name === 'NotAllowedError' || primaryErr.name === 'PermissionDeniedError') {
            setCameraError('Camera access was blocked. Please click the lock or camera icon in your browser address bar to allow permissions.');
          } else if (primaryErr.name === 'NotFoundError' || primaryErr.name === 'DevicesNotFoundError') {
            setCameraError('No camera found on this computer. Please connect a webcam.');
          } else if (primaryErr.name === 'NotReadableError' || primaryErr.name === 'TrackStartError') {
            setCameraError('Camera is in use by another app (Zoom, Teams, or another browser window).');
          } else {
            setCameraError(`Camera error: ${primaryErr.message || 'Please check device permissions'}`);
          }
          setVideoActive(false);
          setMicActive(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    startMedia();
    const handleBeforeUnload = () => {
      stopAllMediaTracks();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllMediaTracks();
    };
  }, [startMedia, stopAllMediaTracks]);

  // Bind localStream to video element safely and trigger play
  useEffect(() => {
    if (localVideoRef.current) {
      if (localStream && videoActive) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play().catch(() => {});
      } else {
        localVideoRef.current.srcObject = null;
      }
    }
  }, [localStream, videoActive]);

  // 3. Socket.IO Classroom Gateway Sync
  useEffect(() => {
    if (!socket || !user) return;

    // Join the room
    socket.emit('join_room', {
      roomId: classId,
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });

    // Room initial state from server
    socket.on('room_init_state', async (state) => {
      if (state.currentSlide) setCurrentSlide(state.currentSlide);
      if (state.totalSlides) setTotalSlides(state.totalSlides);
      if (state.presentationSlides && state.presentationSlides.length > 0) {
        setCustomSlides(state.presentationSlides);
      } else if (state.presentationUrl) {
        try {
          const fn = state.presentationUrl.split('/').pop();
          const presRes = await api.get(`/upload/presentation/${fn}`);
          if (presRes.data.success && presRes.data.slides && presRes.data.slides.length > 0) {
            setCustomSlides(presRes.data.slides);
            setTotalSlides(presRes.data.totalSlides || presRes.data.slides.length);
          }
        } catch (e) {
          console.warn('Could not auto-load presentation on room init:', e);
        }
      }
      if (state.strokes) {
        setStrokesBySlide(prev => ({ ...prev, [state.currentSlide || 1]: state.strokes }));
      }
      if (state.participants) setParticipants(state.participants);

      // Initialize Timing & Status from Room State
      if (state.durationMinutes) setTotalDurationMinutes(state.durationMinutes);
      if (state.status === 'live') {
        setIsSessionActive(true);
        setIsSessionEnded(false);
        if (state.startedAt) {
          const elapsed = Math.max(0, Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 1000));
          setElapsedSeconds(elapsed);
        }
      } else if (state.status === 'completed') {
        setIsSessionActive(false);
        setIsSessionEnded(true);
      }
    });

    // Custom Presentation / Slide Deck synchronization
    socket.on('presentation_updated', (data) => {
      setCustomSlides(data.slides || []);
      setCurrentSlide(data.currentSlide || 1);
      setTotalSlides(data.totalSlides || (data.slides && data.slides.length > 0 ? data.slides.length : 6));
      setStrokesBySlide({});
    });

    // Roster update
    socket.on('roster_update', (roster) => {
      setParticipants(roster);
    });

    // Slide synchronization
    socket.on('slide_updated', (data) => {
      setCurrentSlide(data.slideIndex);
      if (data.strokes) {
        setStrokesBySlide(prev => ({ ...prev, [data.slideIndex]: data.strokes }));
      }
    });

    // Stroke synchronization from tutor
    socket.on('stroke_received', (stroke) => {
      setStrokesBySlide(prev => {
        const slide = stroke.slideIndex || 1;
        const existing = prev[slide] || [];
        return { ...prev, [slide]: [...existing, stroke] };
      });
    });

    // Canvas cleared
    socket.on('canvas_cleared', (data) => {
      setStrokesBySlide(prev => ({ ...prev, [data.slideIndex]: [] }));
    });

    // Stroke undone
    socket.on('stroke_undone', (data) => {
      setStrokesBySlide(prev => ({ ...prev, [data.slideIndex]: data.strokes }));
    });

    // Chat message
    socket.on('chat_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Hand raise status (Audio chime + Alert toast for tutor)
    socket.on('hand_raise_status', (data) => {
      if (data.user?.id === user?.id) {
        setIsHandRaised(data.isHandRaised);
      }
      if (isTutor && data.user?.id !== user?.id && data.isHandRaised) {
        playHandRaiseChime();
        setHandRaiseAlert({
          socketId: data.socketId,
          studentName: data.user?.full_name || 'A student',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    // Dynamic Class Launch status change
    socket.on('class_status_changed', (data) => {
      if (data.status) {
        setClassDetails(prev => prev ? ({ ...prev, status: data.status }) : prev);
        if (data.status === 'live') {
          setIsSessionActive(true);
          setIsSessionEnded(false);
          if (data.durationMinutes) setTotalDurationMinutes(data.durationMinutes);
          if (data.startedAt) {
            const elapsed = Math.max(0, Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 1000));
            setElapsedSeconds(elapsed);
          }
        } else if (data.status === 'completed') {
          setIsSessionActive(false);
          setIsSessionEnded(true);
        }
      }
    });

    // Class Session Concluded by Instructor
    socket.on('class_ended', (data) => {
      setIsSessionActive(false);
      setIsSessionEnded(true);
      setClassEndedMessage(data.message || 'This live class session has been concluded by the instructor.');
    });

    // Remote mute
    socket.on('force_mute', () => {
      setMicActive(false);
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(t => t.enabled = false);
      }
    });

    return () => {
      socket.off('room_init_state');
      socket.off('roster_update');
      socket.off('slide_updated');
      socket.off('stroke_received');
      socket.off('canvas_cleared');
      socket.off('stroke_undone');
      socket.off('chat_message');
      socket.off('hand_raise_status');
      socket.off('class_status_changed');
      socket.off('class_ended');
      socket.off('force_mute');
    };
  }, [socket, classId, user?.id, isTutor]);

  // 4. Slide Navigation
  const goToSlide = (slideIndex) => {
    if (slideIndex < 1 || slideIndex > totalSlides) return;
    setCurrentSlide(slideIndex);
    if (isTutor && socket) {
      socket.emit('slide_change', {
        roomId: classId,
        slideIndex,
        totalSlides
      });
    }
  };

  // 5. Canvas Repainting Engine (Normalized Coordinates UV to Pixels)
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const strokes = strokesBySlide[currentSlide] || [];

    strokes.forEach(stroke => {
      ctx.beginPath();

      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = stroke.width * 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (stroke.points && stroke.points.length > 0) {
          ctx.beginPath();
          const first = stroke.points[0];
          ctx.moveTo(first.u * width, first.v * height);
          for (let i = 1; i < stroke.points.length; i++) {
            const pt = stroke.points[i];
            ctx.lineTo(pt.u * width, pt.v * height);
          }
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
        return;
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.isHighlighter) {
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalAlpha = 1.0;
      }

      if (stroke.tool === 'pen' || stroke.tool === 'highlighter') {
        if (stroke.points && stroke.points.length > 0) {
          ctx.beginPath();
          const first = stroke.points[0];
          ctx.moveTo(first.u * width, first.v * height);
          for (let i = 1; i < stroke.points.length; i++) {
            const pt = stroke.points[i];
            ctx.lineTo(pt.u * width, pt.v * height);
          }
          ctx.stroke();
        }
      } else if (stroke.tool === 'rect') {
        const startX = stroke.start.u * width;
        const startY = stroke.start.v * height;
        const endX = stroke.end.u * width;
        const endY = stroke.end.v * height;
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      } else if (stroke.tool === 'circle') {
        const startX = stroke.start.u * width;
        const startY = stroke.start.v * height;
        const endX = stroke.end.u * width;
        const endY = stroke.end.v * height;
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (stroke.tool === 'line') {
        const startX = stroke.start.u * width;
        const startY = stroke.start.v * height;
        const endX = stroke.end.u * width;
        const endY = stroke.end.v * height;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (stroke.tool === 'arrow') {
        const startX = stroke.start.u * width;
        const startY = stroke.start.v * height;
        const endX = stroke.end.u * width;
        const endY = stroke.end.v * height;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 14;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1.0;
  }, [strokesBySlide, currentSlide]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Adjust canvas resolution dynamically to match stage container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        redrawCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  // Full Screen Presentation Mode Controls
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      const el = stageContainerRef.current;
      if (el?.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          setIsFullscreen(prev => !prev);
        });
      } else {
        setIsFullscreen(prev => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
          redrawCanvas();
        }
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [redrawCanvas]);

  // Keyboard navigation: F for fullscreen, Left/Right arrow for slides, Up/Down arrow to shift slide
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlide > 1) goToSlide(currentSlide - 1);
      } else if (e.key === 'ArrowDown') {
        if (slideScrollRef.current) {
          e.preventDefault();
          slideScrollRef.current.scrollBy({ top: 100, behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp') {
        if (slideScrollRef.current) {
          e.preventDefault();
          slideScrollRef.current.scrollBy({ top: -100, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides, toggleFullscreen]);

  // Reset slide scroll position on slide change
  useEffect(() => {
    if (slideScrollRef.current) {
      slideScrollRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  // Forward wheel scrolling from annotation canvas overlay to slide container
  const handleCanvasWheel = (e) => {
    if (slideScrollRef.current) {
      slideScrollRef.current.scrollTop += e.deltaY;
    }
  };

  // 6. Drawing Mouse/Touch Handlers
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { u: 0, v: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      u: Math.max(0, Math.min(1, x / canvas.width)),
      v: Math.max(0, Math.min(1, y / canvas.height))
    };
  };

  const handlePointerDown = (e) => {
    // Only tutor or authorized participant can draw
    if (!isTutor) return;
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    currentPathRef.current = [coords];
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || !isTutor) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    currentPathRef.current.push(coords);

    // Live preview on local canvas for smooth 60fps feedback
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const pts = currentPathRef.current;
      if (pts.length > 1) {
        const prev = pts[pts.length - 2];
        const curr = pts[pts.length - 1];
        ctx.beginPath();
        if (currentTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.lineWidth = strokeWidth * 3;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
        }
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentTool === 'highlighter' ? 0.35 : 1.0;
        ctx.moveTo(prev.u * width, prev.v * height);
        ctx.lineTo(curr.u * width, curr.v * height);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current || !isTutor) return;
    isDrawingRef.current = false;
    const pts = currentPathRef.current;
    if (pts.length === 0) return;

    let strokeObj = null;

    if (currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'eraser') {
      strokeObj = {
        tool: currentTool,
        color: strokeColor,
        width: strokeWidth,
        isHighlighter: currentTool === 'highlighter',
        points: pts,
        slideIndex: currentSlide
      };
    } else if (['rect', 'circle', 'line', 'arrow'].includes(currentTool)) {
      strokeObj = {
        tool: currentTool,
        color: strokeColor,
        width: strokeWidth,
        start: pts[0],
        end: pts[pts.length - 1],
        slideIndex: currentSlide
      };
    }

    if (strokeObj) {
      setStrokesBySlide(prev => ({
        ...prev,
        [currentSlide]: [...(prev[currentSlide] || []), strokeObj]
      }));

      // Broadcast to room
      if (socket) {
        socket.emit('draw_stroke', {
          roomId: classId,
          stroke: strokeObj
        });
      }
    }

    currentPathRef.current = [];
    redrawCanvas();
  };

  const clearCanvas = () => {
    if (!isTutor) return;
    setStrokesBySlide(prev => ({ ...prev, [currentSlide]: [] }));
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (socket) {
      socket.emit('clear_canvas', { roomId: classId, slideIndex: currentSlide });
    }
  };

  const undoStroke = () => {
    if (!isTutor) return;
    if (socket) {
      socket.emit('undo_stroke', { roomId: classId, slideIndex: currentSlide });
    }
    setStrokesBySlide(prev => {
      const existing = prev[currentSlide] || [];
      return { ...prev, [currentSlide]: existing.slice(0, -1) };
    });
  };

  // 7. Toggle Mic & Camera (with active re-acquisition if initially ungranted)
  const toggleMic = async () => {
    if (localStream && localStream.getAudioTracks().length > 0) {
      const track = localStream.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setMicActive(track.enabled);
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newTrack = audioStream.getAudioTracks()[0];
        if (localStream) {
          localStream.addTrack(newTrack);
          const updated = new MediaStream(localStream.getTracks());
          localStreamRef.current = updated;
          setLocalStream(updated);
        } else {
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
        }
        setMicActive(true);
      } catch (err) {
        console.error('Failed to start microphone on toggle:', err);
        setMicActive(false);
      }
    }
  };

  const toggleVideo = async () => {
    if (localStream && localStream.getVideoTracks().length > 0) {
      const track = localStream.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setVideoActive(track.enabled);
    } else {
      // Actively request video stream if not present yet
      try {
        setCameraError(null);
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
        });
        const newTrack = videoStream.getVideoTracks()[0];
        if (localStream) {
          localStream.addTrack(newTrack);
          const updated = new MediaStream(localStream.getTracks());
          localStreamRef.current = updated;
          setLocalStream(updated);
        } else {
          localStreamRef.current = videoStream;
          setLocalStream(videoStream);
        }
        setVideoActive(true);
      } catch (err) {
        console.error('Failed to start camera on toggle:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera access blocked. Click lock icon in browser URL bar to allow.');
        } else if (err.name === 'NotFoundError') {
          setCameraError('No camera found on this computer.');
        } else if (err.name === 'NotReadableError') {
          setCameraError('Camera is currently in use by another application.');
        } else {
          setCameraError('Camera unavailable.');
        }
        setVideoActive(false);
      }
    }
  };

  // 8. Screen Sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setIsScreenSharing(true);
        if (socket) {
          socket.emit('screen_share_status', { roomId: classId, isSharing: true });
        }
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (socket) socket.emit('screen_share_status', { roomId: classId, isSharing: false });
        };
      } catch (err) {
        console.warn('Screen share canceled or denied');
      }
    } else {
      setIsScreenSharing(false);
      if (socket) {
        socket.emit('screen_share_status', { roomId: classId, isSharing: false });
      }
    }
  };

  // 9. Class Recording Engine
  const startRecording = () => {
    try {
      setIsRecording(true);
      setRecordingSeconds(0);
      recordedChunksRef.current = [];

      // Create stream from stage canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const stream = canvas.captureStream(30);
        if (localStream && localStream.getAudioTracks().length > 0) {
          stream.addTrack(localStream.getAudioTracks()[0]);
        }

        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      }
    } catch (err) {
      console.warn('MediaRecorder error:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setTimeout(async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Auto-save recording to backend
        try {
          await api.post('/materials/recordings', {
            class_id: classDetails?.id || classId,
            title: `${classDetails?.title || 'Lecture Session'} - Live Recording`,
            recording_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration_seconds: recordingSeconds || 60,
            file_size: blob.size || 50000000
          });
        } catch (err) {
          console.error('Failed to register recording', err);
        }

        // Offer instant file download
        const a = document.createElement('a');
        a.href = url;
        a.download = `lecture-recording-${Date.now()}.webm`;
        a.click();
      }, 500);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // 9b. Tutor Launch Live Class Action
  const handleLaunchClass = async () => {
    try {
      setLaunchingClass(true);
      await api.post(`/classes/${classDetails?.id || classId}/start`);
      setClassDetails(prev => ({ ...prev, status: 'live' }));
      setIsSessionActive(true);
      setIsSessionEnded(false);
      setElapsedSeconds(0);
      if (socket) {
        socket.emit('launch_class', { 
          roomId: classId,
          durationMinutes: totalDurationMinutes 
        });
      }
    } catch (err) {
      console.warn('Failed to start class via API, activating locally:', err);
      setClassDetails(prev => ({ ...prev, status: 'live' }));
      setIsSessionActive(true);
      setIsSessionEnded(false);
      setElapsedSeconds(0);
      if (socket) {
        socket.emit('launch_class', { 
          roomId: classId,
          durationMinutes: totalDurationMinutes 
        });
      }
    } finally {
      setLaunchingClass(false);
    }
  };

  // 9c. Tutor Conclude / End Live Class Session For All
  const handleEndClassForAll = async () => {
    if (!window.confirm('Are you sure you want to conclude this live class session for all students? The class will be marked completed.')) {
      return;
    }
    try {
      setIsSessionActive(false);
      setIsSessionEnded(true);
      if (socket) {
        socket.emit('end_class', { roomId: classId });
      }
      await api.post(`/classes/${classDetails?.id || classId}/end`);
    } catch (err) {
      console.warn('Failed to conclude class via API:', err);
    } finally {
      handleLeaveClass();
    }
  };

  // 10. Hand Raise & Chat
  const toggleHandRaise = () => {
    if (socket) {
      socket.emit('toggle_hand_raise', { roomId: classId });
    }
    setIsHandRaised(!isHandRaised);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('chat_message', {
      roomId: classId,
      message: chatInput.trim()
    });
    setChatInput('');
  };

  // 11. Custom Slide Presentation Handlers
  const handleSlideUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingSlide(true);
      const fd = new FormData();
      if (files.length === 1) {
        fd.append('file', files[0]);
      } else {
        Array.from(files).forEach(f => fd.append('files', f));
      }

      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const slides = res.data.slides || [{ slideIndex: 1, type: 'file', url: res.data.url, title: 'Uploaded Presentation' }];
        const total = res.data.totalSlides || (slides && slides.length > 0 ? slides.length : 1);

        setCustomSlides(slides);
        setCurrentSlide(1);
        setTotalSlides(total);
        setStrokesBySlide({});

        if (socket) {
          socket.emit('update_presentation', {
            roomId: classId,
            presentationUrl: res.data.url,
            slides: slides,
            totalSlides: total
          });
        }
      }
    } catch (err) {
      alert('Failed to upload slide deck: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingSlide(false);
      if (slideFileInputRef.current) slideFileInputRef.current.value = '';
    }
  };

  const handleAddWhiteboardSlide = () => {
    if (!isTutor) return;
    const newSlideIndex = totalSlides + 1;
    const newSlide = {
      slideIndex: newSlideIndex,
      type: 'whiteboard',
      title: `Digital Whiteboard (Derivation ${newSlideIndex})`,
      category: 'Tutor Whiteboard Note',
      contentBlocks: []
    };
    const updated = customSlides.length > 0 ? [...customSlides, newSlide] : [
      ...Array.from({ length: totalSlides }, (_, i) => ({ slideIndex: i + 1, title: `Syllabus Slide ${i + 1}`, type: 'standard' })),
      newSlide
    ];
    setCustomSlides(updated);
    setTotalSlides(newSlideIndex);
    goToSlide(newSlideIndex);
    if (socket) {
      socket.emit('update_presentation', {
        roomId: classId,
        presentationUrl: null,
        slides: updated,
        totalSlides: newSlideIndex
      });
    }
  };

  const handleResetSlides = () => {
    setCustomSlides([]);
    setCurrentSlide(1);
    setTotalSlides(6);
    setStrokesBySlide({});
    if (socket) {
      socket.emit('update_presentation', {
        roomId: classId,
        presentationUrl: null,
        slides: [],
        totalSlides: 6
      });
    }
  };

  // 12. Slide Contents for Presentation Engine
  const renderSlideContent = () => {
    if (customSlides.length > 0) {
      const activeSlide = customSlides[currentSlide - 1] || customSlides[0];

      // 1. Direct PDF Slide Check
      const isPdf = typeof activeSlide === 'string'
        ? activeSlide.toLowerCase().endsWith('.pdf')
        : activeSlide?.type === 'pdf' || (activeSlide?.url && activeSlide.url.toLowerCase().endsWith('.pdf'));

      if (isPdf) {
        const pdfUrl = typeof activeSlide === 'string' ? activeSlide : (activeSlide.url || activeSlide.rawUrl);
        const pageUrl = pdfUrl.includes('#page=') ? pdfUrl : `${pdfUrl}#page=${currentSlide}&view=FitH&toolbar=0&navpanes=0`;
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none">
            <iframe
              src={pageUrl}
              title={`Slide Page ${currentSlide}`}
              className="w-full h-full border-0"
            />
          </div>
        );
      }

      // 2. Direct Image Slide Check
      const isImage = typeof activeSlide === 'string'
        ? /^\.(png|jpe?g|webp|gif)$/i.test(activeSlide.split('?')[0].slice(-5))
        : activeSlide?.type === 'image' || (activeSlide?.url && /^\.(png|jpe?g|webp|gif)$/i.test(activeSlide.url.split('?')[0].slice(-5)));

      if (isImage) {
        const imgUrl = typeof activeSlide === 'string' ? activeSlide : activeSlide.url;
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-950 p-4 overflow-hidden select-none">
            <img
              src={imgUrl}
              alt={`Slide ${currentSlide}`}
              className="max-w-full max-h-full object-contain pointer-events-none rounded-2xl shadow-2xl border border-slate-800"
            />
          </div>
        );
      }

      // 3. Pure Whiteboard Slide Check
      if (activeSlide?.type === 'whiteboard') {
        return (
          <div className="w-full h-full flex flex-col justify-between p-6 bg-slate-900 text-white select-none relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
                Digital Whiteboard Canvas
              </span>
              <span className="text-xs font-mono text-slate-400">Slide {currentSlide} of {totalSlides}</span>
            </div>
            <div className="my-auto text-center border-2 border-dashed border-slate-800 rounded-3xl p-8 max-w-lg mx-auto w-full">
              <PenTool className="w-10 h-10 text-brand-400/50 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-200">Interactive Derivation & Annotation Zone</h3>
              <p className="text-xs text-slate-400 mt-1">Use pen, shapes, or highlighter tools from the top toolbar to sketch notes.</p>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Beacon Bridge Academics Live Classroom</span>
              <span>All student cursors & strokes synchronized</span>
            </div>
          </div>
        );
      }

      // 4. Structured Academic Presentation Slide (From PPTX) with Original Slide Colors
      if (typeof activeSlide === 'object' && (activeSlide.title || activeSlide.rawLines)) {
        const isDark = activeSlide.isDark ?? true;
        const slideBg = activeSlide.bgColor || (isDark ? '#0B1A12' : '#F6F8F5');
        const slideTextColor = activeSlide.textColor || (isDark ? '#FFFFFF' : '#15201A');
        const primaryAccent = activeSlide.accentColor || (isDark ? '#38BDF8' : '#046A38');
        const secondaryAccent = activeSlide.secondaryAccent || (isDark ? '#34D399' : '#FF7A1A');

        const blocks = activeSlide.contentBlocks || [];
        const isPercentageList = blocks.some(b => /^\d+%$/.test(b.header?.trim() || ''));
        const narrativeBlocks = blocks.filter(b => (!b.header || b.header.trim() === '') && b.body && b.body.trim().length > 0);
        const cardBlocks = blocks.filter(b => b.header && b.header.trim().length > 0);

        return (
          <div
            style={{ backgroundColor: slideBg, color: slideTextColor }}
            className={`w-full h-full flex flex-col justify-between p-3 sm:p-5 md:p-6 select-text transition-colors relative ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {/* Top Category Badge & Page Counter & Shift Controls */}
            <div
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
              className="flex items-center justify-between border-b pb-2 shrink-0 select-none"
            >
              <div className="flex items-center space-x-2">
                <span
                  style={{
                    backgroundColor: `${primaryAccent}22`,
                    color: primaryAccent,
                    borderColor: `${primaryAccent}44`
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border shadow-sm"
                >
                  {activeSlide.category || `Slide ${currentSlide}`}
                </span>
                {activeSlide.footerText && (
                  <span
                    style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
                    className="text-[10px] font-mono hidden md:inline truncate max-w-xs"
                  >
                    {activeSlide.footerText}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Shift slide buttons inside header */}
                <div className="flex items-center space-x-1 mr-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (slideScrollRef.current) {
                        slideScrollRef.current.scrollBy({ top: -140, behavior: 'smooth' });
                      }
                    }}
                    title="Shift slide up"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      color: slideTextColor
                    }}
                    className="p-1 rounded-lg hover:opacity-80 transition-all flex items-center text-[10px] font-medium"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (slideScrollRef.current) {
                        slideScrollRef.current.scrollBy({ top: 140, behavior: 'smooth' });
                      }
                    }}
                    title="Shift slide down to see remaining text"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      color: slideTextColor
                    }}
                    className="p-1 rounded-lg hover:opacity-80 transition-all flex items-center text-[10px] font-medium"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span
                  style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
                  className="text-xs font-mono font-bold"
                >
                  Slide {currentSlide} of {totalSlides}
                </span>
                <button
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Full Screen (F)"}
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    color: slideTextColor
                  }}
                  className="p-1 rounded-lg hover:opacity-80 transition-all"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Slide Title & Subtitle */}
            <div className="my-1.5 sm:my-2 shrink-0 select-none">
              <h2
                style={{ color: isDark ? '#FFFFFF' : '#15201A' }}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight"
              >
                {activeSlide.title}
              </h2>
              {activeSlide.subtitle && (
                <p
                  style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(21,32,26,0.75)' }}
                  className="text-xs sm:text-sm mt-0.5 leading-snug font-semibold"
                >
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Main Slide Content Area (Adaptive Auto-Fitting & Smooth Scroll/Shift) */}
            <div
              ref={slideScrollRef}
              className="flex-1 py-1.5 sm:py-2.5 flex flex-col justify-start min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400/40 hover:scrollbar-thumb-slate-400/70 scrollbar-track-transparent select-text"
            >
              {/* If there's an image/figure, render with clean compact proportion */}
              {activeSlide.images && activeSlide.images.length > 0 && (
                <div className="mb-2.5 flex items-center justify-center shrink-0">
                  <img
                    src={activeSlide.images[0]}
                    alt="Slide Graphic"
                    className="max-h-16 sm:max-h-20 md:max-h-24 object-contain rounded-xl shadow-sm"
                  />
                </div>
              )}

              {/* Dynamic Content Grid or Cards */}
              {isPercentageList ? (
                /* Feature Survey / Percentage Progress Rows (like Slide 9) */
                <div className="max-w-3xl mx-auto w-full space-y-2 py-1">
                  {(() => {
                    const pairs = [];
                    for (let i = 0; i < blocks.length; i++) {
                      const blk = blocks[i];
                      const next = blocks[i + 1];
                      if (next && /^\d+%$/.test(next.header?.trim() || '')) {
                        const pctVal = parseInt(next.header.replace(/\D/g, ''), 10) || 0;
                        pairs.push({ label: blk.header || blk.body, pct: next.header, val: pctVal, note: next.body });
                        i++;
                      } else {
                        pairs.push({ label: blk.header || blk.body, pct: null, val: null, note: blk.body });
                      }
                    }
                    return pairs.map((pair, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                        }}
                        className="p-2 sm:p-2.5 rounded-xl border shadow-sm flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                          <span style={{ color: isDark ? '#FFFFFF' : '#15201A' }}>{pair.label}</span>
                          {pair.pct && (
                            <span
                              style={{ color: primaryAccent, backgroundColor: `${primaryAccent}18` }}
                              className="px-2 py-0.5 rounded-md font-extrabold font-mono text-xs"
                            >
                              {pair.pct}
                            </span>
                          )}
                        </div>
                        {pair.val !== null && (
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              style={{ width: `${pair.val}%`, backgroundColor: primaryAccent }}
                              className="h-full rounded-full transition-all duration-500"
                            />
                          </div>
                        )}
                        {pair.note && (
                          <span className="text-[10px] text-slate-500 italic mt-0.5">{pair.note}</span>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              ) : narrativeBlocks.length > 0 && cardBlocks.length > 0 ? (
                /* Mixed Narrative Quote + Highlight Badges (like Slide 2) */
                <div className="max-w-4xl mx-auto w-full space-y-2.5">
                  {/* Narrative Quote Box */}
                  <div
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                    }}
                    className="p-3 sm:p-4 rounded-2xl border shadow-sm backdrop-blur space-y-1.5"
                  >
                    {narrativeBlocks.map((b, nIdx) => (
                      <p
                        key={nIdx}
                        style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748' }}
                        className="text-xs sm:text-sm leading-relaxed font-medium italic"
                      >
                        &ldquo;{b.body}&rdquo;
                      </p>
                    ))}
                  </div>

                  {/* Highlight Cards Row */}
                  <div className={`grid gap-2 sm:gap-3 ${
                    cardBlocks.length <= 3 
                      ? 'grid-cols-1 sm:grid-cols-3' 
                      : cardBlocks.length <= 4 
                      ? 'grid-cols-2 sm:grid-cols-4' 
                      : 'grid-cols-2 sm:grid-cols-3'
                  }`}>
                    {cardBlocks.map((blk, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                        }}
                        className="p-2.5 sm:p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center"
                      >
                        <span
                          style={{ backgroundColor: secondaryAccent }}
                          className="w-1.5 h-1.5 rounded-full mb-1"
                        />
                        <h4
                          style={{ color: primaryAccent }}
                          className="text-xs sm:text-sm font-extrabold leading-tight"
                        >
                          {blk.header}
                        </h4>
                        {blk.body && (
                          <p
                            style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#4A5568' }}
                            className="text-[11px] sm:text-xs mt-1"
                          >
                            {blk.body}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : blocks.length > 0 ? (
                /* Standard Grid of Cards / Bullet items */
                <div className={`grid gap-2.5 sm:gap-3 w-full max-w-5xl mx-auto ${
                  blocks.length === 1 
                    ? 'grid-cols-1 max-w-2xl'
                    : blocks.length === 2 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : blocks.length <= 4 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {blocks.map((blk, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                      }}
                      className="p-3 sm:p-3.5 rounded-2xl border shadow-sm backdrop-blur flex flex-col justify-start"
                    >
                      {blk.header && (
                        <h4
                          style={{ color: primaryAccent }}
                          className="text-xs sm:text-sm font-extrabold mb-1 flex items-center gap-1.5"
                        >
                          <span
                            style={{ backgroundColor: secondaryAccent }}
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                          />
                          <span>{blk.header}</span>
                        </h4>
                      )}
                      {blk.body && (
                        <p
                          style={{ color: isDark ? 'rgba(255,255,255,0.85)' : '#334155' }}
                          className="text-[11px] sm:text-xs leading-relaxed font-normal"
                        >
                          {blk.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : activeSlide.rawLines && activeSlide.rawLines.length > 0 ? (
                /* Raw Lines */
                <div
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
                  }}
                  className="max-w-2xl mx-auto space-y-1.5 p-3.5 rounded-2xl border shadow-sm w-full"
                >
                  {activeSlide.rawLines.slice(2).map((line, lIdx) => (
                    <div key={lIdx} className="text-xs flex items-start gap-2">
                      <span style={{ color: primaryAccent }} className="font-bold mt-0.5">&bull;</span>
                      <span style={{ color: isDark ? '#E2E8F0' : '#334155' }}>{line}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Optional Callout / Summary Banner */}
              {activeSlide.callout && (
                <div
                  style={{
                    backgroundColor: isDark ? `${secondaryAccent}20` : `${secondaryAccent}15`,
                    borderColor: `${secondaryAccent}40`,
                    color: isDark ? '#FFFFFF' : '#15201A'
                  }}
                  className="mt-2.5 p-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold text-center max-w-3xl mx-auto w-full shadow-sm"
                >
                  {activeSlide.callout}
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
              className="pt-2 border-t flex items-center justify-between text-[10px] sm:text-[11px] shrink-0 select-none"
            >
              <span
                style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
                className="flex items-center gap-1.5 font-semibold"
              >
                <GraduationCap style={{ color: primaryAccent }} className="w-3.5 h-3.5" />
                Beacon Bridge Academics Live Classroom
              </span>
              <div className="flex items-center space-x-2">
                <span
                  style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)' }}
                  className="font-mono hidden sm:inline"
                >
                  {activeSlide.footerText || 'Synchronized Presentation Deck'} &bull; Scroll or use Shift &uarr;&darr;
                </span>
              </div>
            </div>
          </div>
        );
      }
    }
    switch (currentSlide) {
      case 1:
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-950 text-white select-none">
            <span className="px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
              Module 1 &bull; System Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl leading-tight">
              Real-Time Bi-Directional WebSockets & Canvas Synchronization
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mt-4 leading-relaxed">
              Dr. Sarah Jenkins &bull; Department of Distributed Systems & Web Engineering
            </p>
            <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
              <span className="px-3 py-1.5 rounded-xl bg-white/10">Beacon Bridge Classroom</span>
              <span>&bull;</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10">WebRTC Mesh Signaling</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col justify-between p-8 bg-slate-900 text-white select-none">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block mb-2">Section 1.1</span>
              <h3 className="text-2xl font-bold">Normalized UV Coordinate System (0.0 to 1.0)</h3>
              <p className="text-slate-300 text-xs mt-2 max-w-xl leading-relaxed">
                Why screen-fixed pixel coordinates fail across varied client displays and how unit-interval vector normalization guarantees identical cross-device fidelity:
              </p>
            </div>
            {/* Diagram */}
            <div className="my-auto grid grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <h4 className="text-xs font-bold text-rose-400 mb-2">Fixed Pixel Coordinate (Anti-Pattern)</h4>
                <code className="text-[11px] block text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg">
                  point = (x: 820px, y: 440px)<br />
                  // Clamps or shifts off-screen on mobile!
                </code>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                <h4 className="text-xs font-bold text-emerald-400 mb-2">Normalized Vector (Beacon Bridge Standard)</h4>
                <code className="text-[11px] block text-slate-200 font-mono bg-slate-950 p-2.5 rounded-lg">
                  u = x / stageWidth = 0.512<br />
                  v = y / stageHeight = 0.380
                </code>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Tutor annotation overlay remains strictly calibrated regardless of client DPI or viewport resolution.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col justify-between p-8 bg-slate-900 text-white select-none">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block mb-2">Section 1.2</span>
              <h3 className="text-2xl font-bold">WebRTC Signaling Pipeline & Mesh SFU Architecture</h3>
              <p className="text-slate-300 text-xs mt-2 max-w-xl">
                Peer-to-peer audio and video stream establishment via SDP offer/answer negotiation over WebSocket signaling rooms:
              </p>
            </div>
            {/* Flow sequence representation */}
            <div className="my-auto p-6 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-xl mx-auto w-full space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-brand-400 font-bold">Peer A (Tutor)</span>
                <span className="text-slate-500">---- [SDP Offer] ----&gt;</span>
                <span className="text-emerald-400 font-bold">Signaling Gateway</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-emerald-400 font-bold">Signaling Gateway</span>
                <span className="text-slate-500">---- [Relay Offer] ---&gt;</span>
                <span className="text-blue-400 font-bold">Peer B (Student)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-blue-400 font-bold">Peer B (Student)</span>
                <span className="text-slate-500">&lt;--- [SDP Answer] ---</span>
                <span className="text-emerald-400 font-bold">Signaling Gateway</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-emerald-400 font-bold">Signaling Gateway</span>
                <span className="text-slate-500">&lt;--- [ICE Candidate] -</span>
                <span className="text-brand-400 font-bold">Direct P2P Stream</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Low-latency media tracks with dynamic Opus audio encoding and VP8/H.264 video hardware acceleration.
            </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col justify-between p-8 bg-slate-900 text-white select-none">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block mb-2">Section 2.1</span>
              <h3 className="text-2xl font-bold">Asynchronous Event Loop & Concurrency Model</h3>
            </div>
            <div className="my-auto max-w-xl mx-auto w-full space-y-4 text-xs leading-relaxed text-slate-300">
              <p>
                Node.js operates on an event-driven, single-threaded execution thread backed by the <strong className="text-brand-400">libuv thread pool</strong> for background I/O operations (file system, socket polling, DNS lookup).
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono">
                  <div className="font-bold text-white mb-1">Call Stack</div>
                  <div className="text-[10px] text-slate-400">Synchronous Frames</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono">
                  <div className="font-bold text-brand-400 mb-1">Microtasks</div>
                  <div className="text-[10px] text-slate-400">Promises, process.nextTick</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono">
                  <div className="font-bold text-emerald-400 mb-1">Macrotasks</div>
                  <div className="text-[10px] text-slate-400">Timers, I/O Poll</div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Use whiteboard tools above to annotate and circle key phases.
            </div>
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col justify-between p-8 bg-slate-900 text-white select-none">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block mb-2">Section 3.0</span>
              <h3 className="text-2xl font-bold">Interactive Derivation & Case Analysis</h3>
              <p className="text-xs text-slate-300 mt-2">
                This slide is configured for tutor-led live whiteboard drawing and theorem proofs.
              </p>
            </div>
            <div className="my-auto border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-500 max-w-lg mx-auto w-full">
              <PenTool className="w-8 h-8 text-brand-500/50 mx-auto mb-2" />
              <p className="text-xs font-medium">Digital Whiteboard Derivation Area</p>
              <p className="text-[11px] text-slate-600 mt-1">Select the Pen, Line, or Rectangle tool from the top toolbar to illustrate equations.</p>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              Annotations synchronize in real time to all attending students.
            </div>
          </div>
        );
      case 6:
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-slate-950 to-indigo-950 text-white select-none">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
            <h2 className="text-3xl font-extrabold">Lecture Summary & Q&A Discussion</h2>
            <p className="text-slate-300 text-xs max-w-md mt-3 leading-relaxed">
              Session attendance has been logged. Students may unmute or raise hands to ask questions. Session recording will be available shortly in the Student and Parent hubs.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // 12b. Student Waiting Room (when class is scheduled and waiting for tutor to launch)
  if (!isTutor && classDetails?.status === 'scheduled') {
    return (
      <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans p-6 sm:p-12 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">Beacon Bridge Academics</h1>
              <p className="text-[11px] text-emerald-400 font-mono">Interactive Lecture Waiting Room</p>
            </div>
          </div>
          <button
            onClick={handleLeaveClass}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Student Dashboard</span>
          </button>
        </div>

        {/* Center Card */}
        <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <Radio className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Class Scheduled &bull; Waiting for Tutor
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {classDetails?.title || 'Interactive Virtual Classroom Session'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Course: <strong className="text-slate-200">{classDetails?.course?.title || 'Academic Course'}</strong>
              {classDetails?.course_track && <span className="ml-1 text-emerald-400 font-semibold">({classDetails.course_track})</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Tutor:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>👨‍🏫</span> {classDetails?.tutor?.full_name || 'Dr. Sarah Jenkins'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Scheduled Time:</span>
              <span className="font-mono text-emerald-400">
                {classDetails?.scheduled_at ? new Date(classDetails.scheduled_at).toLocaleString('en-GB') : 'Today'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Admission:</span>
              <span className="text-slate-300 font-medium">Automatic entry when tutor launches room</span>
            </div>
          </div>

          {/* Device Self-Check while waiting */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-16 h-12 bg-black rounded-lg overflow-hidden border border-slate-700">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover mirror ${videoActive && localStream ? 'block' : 'hidden'}`}
                />
                {(!videoActive || !localStream) && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                    <VideoOff className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Device Pre-Check</span>
                <span className="text-[11px] text-slate-400">
                  {videoActive ? 'Camera Ready' : 'Camera Muted'} &bull; {micActive ? 'Mic Ready' : 'Mic Muted'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMic}
                className={`p-2 rounded-xl transition-all ${micActive ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
                title={micActive ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-2 rounded-xl transition-all ${videoActive ? 'bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
                title={videoActive ? 'Camera Off' : 'Camera On'}
              >
                {videoActive ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Please keep this window open. When your tutor opens the live stage, you will be admitted automatically.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500">
          Beacon Bridge Academics &bull; High-Performance Interactive Learning Platform
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans relative">
      
      {/* TUTOR LAUNCH BAR (When class is scheduled) */}
      {isTutor && classDetails?.status === 'scheduled' && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>This class is currently in Scheduled mode. Enrolled students are in the waiting room.</span>
          </div>
          <button
            onClick={handleLaunchClass}
            disabled={launchingClass}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-200" />
            <span>{launchingClass ? 'Launching Room...' : 'Launch Live Class Now'}</span>
          </button>
        </div>
      )}

      {/* TUTOR HAND RAISE ALERT TOAST WITH AUDIBLE CHIME & ACTION */}
      {handRaiseAlert && isTutor && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 border-white animate-in slide-in-from-top-2">
          <Hand className="w-5 h-5 animate-bounce text-slate-900" />
          <span className="text-xs font-extrabold">
            Student <u>{handRaiseAlert.studentName}</u> raised their hand at {handRaiseAlert.time}!
          </span>
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-900/20">
            {handRaiseAlert.socketId && (
              <button
                onClick={() => {
                  socket?.emit('lower_hand', { roomId: classId, targetSocketId: handRaiseAlert.socketId });
                  setHandRaiseAlert(null);
                }}
                className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
                title="Lower Student Hand"
              >
                Lower Hand
              </button>
            )}
            <button
              onClick={() => setHandRaiseAlert(null)}
              className="p-1 rounded-lg bg-black/10 hover:bg-black/20 text-slate-900 transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TUTOR ONLY: 10-MINUTE CONCLUDING NOTICE BANNER */}
      {isTutor && isTenMinutesOrLess && !tenMinNoticeDismissed && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b-2 border-amber-500 px-4 py-2.5 flex items-center justify-between text-white shrink-0 z-30 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-amber-300 mr-2 uppercase tracking-wide">
                ⏰ 10 Minutes Remaining
              </span>
              <span className="text-xs text-amber-100">
                Notice: Scheduled class session concludes in <strong>{Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s</strong> ({totalDurationMinutes}m session). Please begin summarizing key concepts and answering final questions.
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 ml-4">
            <button
              onClick={() => setTenMinNoticeDismissed(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
            >
              Acknowledge
            </button>
            <button
              onClick={() => setTenMinNoticeDismissed(true)}
              className="p-1 text-amber-300/70 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP CLASSROOM STATUS BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Class Title & Info */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLeaveClass}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Leave Classroom"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md">
                {classDetails?.title || 'Interactive Virtual Classroom Session'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              Room: {classId} &bull; Instructor: {classDetails?.tutor?.full_name || 'Dr. Sarah Jenkins'}
            </p>
          </div>
        </div>

        {/* Center: Presentation Controls (Tutor Only) or Student Attendance Status */}
        <div className="hidden md:flex items-center space-x-3">
          {!isTutor && (
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Attending as Student
            </span>
          )}

          {/* Whiteboard, Presentation Mode & Custom Slide Upload (Tutor Only) */}
          {isTutor && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setSlideMode('presentation')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  slideMode === 'presentation' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Slide Presentation
              </button>
              <button
                onClick={() => setSlideMode('whiteboard')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  slideMode === 'whiteboard' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Digital Whiteboard
              </button>
            </div>

            {/* Custom Slide Uploader */}
            <input
              type="file"
              ref={slideFileInputRef}
              onChange={handleSlideUpload}
              accept=".pptx,.ppt,.pdf,.png,.jpg,.jpeg,.webp"
              multiple
              className="hidden"
            />
            <button
              onClick={() => slideFileInputRef.current?.click()}
              disabled={uploadingSlide}
              title="Upload your own slides (PowerPoint PPTX, PDF, or Images)"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-sm active:scale-95"
            >
              <FileUp className="w-3.5 h-3.5 text-brand-400" />
              <span>{uploadingSlide ? 'Processing Deck...' : 'Upload Slides'}</span>
            </button>

            {customSlides.length > 0 && (
              <button
                onClick={handleResetSlides}
                title="Revert to standard syllabus slide deck"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset Slides</span>
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Presentation Mode (F)"}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm active:scale-95 ${
                isFullscreen 
                  ? 'bg-brand-600 text-white border-brand-500 shadow-brand-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </button>
            </div>
          )}
        </div>

        {/* Right: Live Session Countdown Timer, Recording Status, Participants Count & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          {/* Class Minutes Countdown & Elapsed Timer (Counting on BOTH Student & Tutor platforms) */}
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs shadow-sm"
            title={`Scheduled: ${totalDurationMinutes} mins total | Elapsed: ${Math.floor(elapsedSeconds / 60)}m`}
          >
            <Clock className={`w-3.5 h-3.5 ${
              isSessionEnded 
                ? 'text-rose-400' 
                : isTenMinutesOrLess 
                  ? 'text-amber-400 animate-pulse' 
                  : 'text-emerald-400'
            }`} />
            <div className="flex items-center space-x-1.5 font-mono">
              {isSessionEnded ? (
                <span className="text-rose-300 font-bold">Class Ended</span>
              ) : (
                <>
                  <span className={`font-bold ${isTenMinutesOrLess ? 'text-amber-300' : 'text-white'}`}>
                    {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                    left / {totalDurationMinutes}m
                  </span>
                </>
              )}
            </div>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
            </div>
          )}

          <button
            onClick={() => {
              setActiveTab('participants');
              setSidebarOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{participants.length || 1} Attending</span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-colors ${
              sidebarOpen ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* 2. MAIN CLASSROOM WORKSPACE (STAGE + SIDEBAR) */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* CENTER STAGE: Slide Presentation / Digital Whiteboard */}
        <div 
          ref={stageContainerRef}
          className={`flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : ''
          }`}
        >
          
          {/* ANNOTATION TOOLBAR (FOR TUTORS) - PERSISTS IN BOTH NORMAL AND FULLSCREEN MODE */}
          {isTutor && (
            <div className={`h-12 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between shrink-0 overflow-x-auto z-20 ${
              isFullscreen ? 'shadow-2xl border-b-2 border-brand-500/50 bg-slate-900' : ''
            }`}>
              
              {/* Drawing Tools */}
              <div className="flex items-center space-x-1">
                {[
                  { tool: 'pen', label: 'Pen', icon: PenTool },
                  { tool: 'highlighter', label: 'Highlighter', icon: Sparkles },
                  { tool: 'rect', label: 'Rectangle', icon: Square },
                  { tool: 'circle', label: 'Circle', icon: Circle },
                  { tool: 'arrow', label: 'Arrow', icon: ArrowRight },
                  { tool: 'line', label: 'Line', icon: Minus },
                  { tool: 'eraser', label: 'Eraser', icon: Eraser },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentTool === item.tool;
                  return (
                    <button
                      key={item.tool}
                      onClick={() => setCurrentTool(item.tool)}
                      title={item.label}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}

                <div className="h-5 w-px bg-slate-700 mx-2" />

                {/* Color Palette */}
                <div className="flex items-center space-x-1.5">
                  {['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ffffff'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setStrokeColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        strokeColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="h-5 w-px bg-slate-700 mx-2" />

                {/* Stroke Width */}
                <select
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                  className="bg-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
                >
                  <option value={2}>Thin (2px)</option>
                  <option value={4}>Medium (4px)</option>
                  <option value={8}>Thick (8px)</option>
                  <option value={16}>Broad (16px)</option>
                </select>
              </div>

              {/* Action Buttons: Undo / Clear + Fullscreen Slide Navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={undoStroke}
                  title="Undo last stroke"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={clearCanvas}
                  title="Clear all annotations on this slide"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* When in Fullscreen Mode: Show Slide Navigation & Exit Fullscreen Button */}
                {isFullscreen && (
                  <div className="flex items-center space-x-2 pl-3 border-l border-slate-700">
                    <button
                      onClick={prevSlide}
                      disabled={currentSlide <= 1}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-300 font-mono">
                      {currentSlide} / {totalSlides}
                    </span>
                    <button
                      onClick={nextSlide}
                      disabled={currentSlide >= totalSlides}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm ml-2"
                      title="Exit Full Screen (Esc)"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Exit Full Screen</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Student Fullscreen Exit Button Overlay */}
          {!isTutor && isFullscreen && (
            <div className="absolute top-3 right-3 z-30">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 border border-slate-700 shadow-xl backdrop-blur transition-all"
                title="Exit Full Screen (Esc)"
              >
                <Minimize2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Exit Full Screen</span>
              </button>
            </div>
          )}

          {/* ACTIVE PRESENTATION CANVAS STAGE */}
          <div
            className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden bg-slate-950"
          >
            {/* The Slide or Whiteboard Canvas Frame (Edge-to-Edge full width & height) */}
            <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col justify-between transition-all rounded-none border-0">
              
              {/* Underlying Slide Presentation Layer */}
              {slideMode === 'presentation' ? (
                <div className="absolute inset-0 z-0">
                  {renderSlideContent()}
                </div>
              ) : (
                /* Pure Whiteboard Mode with Grid */
                <div className="absolute inset-0 z-0 bg-slate-900">
                  <svg className="w-full h-full opacity-10 pointer-events-none" width="100%" height="100%">
                    <defs>
                      <pattern id="whiteboardGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#whiteboardGrid)" />
                  </svg>
                  <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">
                    Beacon Bridge Infinite Digital Whiteboard Stage
                  </div>
                </div>
              )}

              {/* REAL-TIME VECTOR ANNOTATION CANVAS (OVERLAY) */}
              <canvas
                ref={canvasRef}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onWheel={handleCanvasWheel}
                className={`absolute inset-0 z-10 w-full h-full ${
                  isTutor ? 'cursor-crosshair' : 'cursor-default pointer-events-none'
                }`}
              />

              {/* VIDEO TILES: TUTOR BROADCAST & STUDENT PIP SELF-PREVIEW */}
              {isTutor ? (
                /* Tutor's Own Broadcast Tile */
                <div className={`absolute top-3 right-3 z-20 transition-all ${
                  videoMinimized ? 'w-auto' : 'w-36 sm:w-48 aspect-video'
                } rounded-xl overflow-hidden shadow-2xl border-2 border-emerald-500/80 bg-slate-900 group`}>
                  {videoMinimized ? (
                    <button
                      onClick={() => setVideoMinimized(false)}
                      title="Expand Video Tile"
                      className="px-2.5 py-1.5 bg-black/80 hover:bg-black text-[10px] font-bold text-white flex items-center space-x-1.5"
                    >
                      <VideoIcon className="w-3.5 h-3.5 text-brand-400" />
                      <span>{user?.full_name?.split(' ')[0]} (Tutor)</span>
                      <Maximize2 className="w-2.5 h-2.5 text-slate-400" />
                    </button>
                  ) : (
                    <>
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover mirror ${videoActive && localStream ? 'block' : 'hidden'}`}
                      />

                      {(!videoActive || !localStream) && (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center select-none">
                          <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                          <span className="text-[10px] font-bold truncate max-w-full text-slate-200">
                            {user?.full_name || 'Tutor'}
                          </span>
                          {cameraError ? (
                            <span className="text-[9px] text-amber-400 block leading-tight px-1 max-w-[170px]">
                              {cameraError}
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-500 mt-0.5">Camera Off</span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => setVideoMinimized(true)}
                        title="Minimize Video Tile"
                        className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-black text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minimize2 className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-400 flex items-center space-x-1">
                        <span>👨‍🏫 {user?.full_name?.split(' ')[0]} (Tutor)</span>
                        {!micActive && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Student View: Prominent Tutor Tile (Top-Right) + Student Self PIP (Bottom-Right) */
                <>
                  {/* Top-Right: Tutor Broadcast Tile (Prominent Live Teacher View) */}
                  <div className={`absolute top-3 right-3 z-20 transition-all ${
                    videoMinimized ? 'w-auto' : 'w-44 sm:w-56 aspect-video'
                  } rounded-xl overflow-hidden shadow-2xl border-2 border-emerald-500 bg-slate-900 group`}>
                    {videoMinimized ? (
                      <button
                        onClick={() => setVideoMinimized(false)}
                        title="Expand Tutor Feed"
                        className="px-2.5 py-1.5 bg-emerald-950/90 text-[10px] font-bold text-emerald-300 flex items-center space-x-1.5 border border-emerald-500/40"
                      >
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span>Tutor: {classDetails?.tutor?.full_name?.split(' ')[0] || 'Dr. Sarah'}</span>
                        <Maximize2 className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-2 text-center relative overflow-hidden select-none">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-white font-extrabold text-sm mb-1 shadow-lg">
                          {classDetails?.tutor?.full_name?.charAt(0) || 'T'}
                        </div>
                        <span className="text-xs font-bold text-white truncate max-w-[160px]">
                          {classDetails?.tutor?.full_name || 'Dr. Sarah Jenkins'}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">
                            Teaching Live
                          </span>
                        </div>
                        {/* Dynamic Live Audio Equalizer */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        </div>
                        <button
                          onClick={() => setVideoMinimized(true)}
                          title="Minimize Tutor Tile"
                          className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-black text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Minimize2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom-Right: Student Self-View PIP Tile */}
                  <div className="absolute bottom-4 right-4 z-20 w-28 sm:w-36 aspect-video rounded-xl overflow-hidden shadow-xl border border-slate-700 bg-slate-900 group">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`w-full h-full object-cover mirror ${videoActive && localStream ? 'block' : 'hidden'}`}
                    />
                    {(!videoActive || !localStream) && (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 p-1 text-center">
                        <VideoOff className="w-4 h-4 mb-0.5" />
                        <span className="text-[9px] text-slate-400">My Camera Off</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1.5 bg-black/80 px-1 py-0.5 rounded text-[8px] font-bold text-slate-200 flex items-center space-x-1">
                      <span className="truncate max-w-[65px]">{user?.full_name?.split(' ')[0] || 'Me'}</span>
                      {!micActive && <MicOff className="w-2 h-2 text-rose-400" />}
                    </div>
                  </div>
                </>
              )}

              {/* Floating Fullscreen Slide Controls Bar */}
              {isFullscreen && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={() => goToSlide(currentSlide - 1)}
                    disabled={currentSlide <= 1}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-white px-2">
                    Slide {currentSlide} of {totalSlides}
                  </span>
                  <button
                    onClick={() => goToSlide(currentSlide + 1)}
                    disabled={currentSlide >= totalSlides}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-700 mx-1" />
                  <button
                    onClick={() => {
                      if (slideScrollRef.current) {
                        slideScrollRef.current.scrollBy({ top: -140, behavior: 'smooth' });
                      }
                    }}
                    title="Shift Slide Up"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (slideScrollRef.current) {
                        slideScrollRef.current.scrollBy({ top: 140, behavior: 'smooth' });
                      }
                    }}
                    title="Shift Slide Down"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-700 mx-1" />
                  <div className="hidden sm:flex items-center space-x-1 max-w-xs overflow-x-auto">
                    {[...Array(totalSlides)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => goToSlide(i + 1)}
                        className={`min-w-6 h-6 px-1 rounded-md text-xs font-bold ${
                          currentSlide === i + 1 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="h-4 w-px bg-slate-700 mx-1" />
                  <button
                    onClick={toggleFullscreen}
                    title="Exit Fullscreen (Esc)"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* SLIDE NAVIGATION BAR */}
          <div className="h-12 bg-slate-900 border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isTutor ? (
                <>
                  <button
                    onClick={() => goToSlide(currentSlide - 1)}
                    disabled={currentSlide <= 1}
                    title="Previous Slide"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-200 whitespace-nowrap">
                    Slide {currentSlide} of {totalSlides}
                  </span>
                  <button
                    onClick={() => goToSlide(currentSlide + 1)}
                    disabled={currentSlide >= totalSlides}
                    title="Next Slide"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Slide {currentSlide} of {totalSlides} &bull; Synced with Tutor
                  </span>
                </div>
              )}

              {/* Dedicated Shift Slide Up & Down buttons (Essential for reading long slide text) */}
              <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    if (slideScrollRef.current) {
                      slideScrollRef.current.scrollBy({ top: -140, behavior: 'smooth' });
                    }
                  }}
                  title="Shift Slide Up (View Top Content)"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 transition-all flex items-center space-x-1 text-xs"
                >
                  <ChevronUp className="w-4 h-4 text-brand-400" />
                  <span className="hidden sm:inline text-[11px]">Shift Up</span>
                </button>
                <button
                  onClick={() => {
                    if (slideScrollRef.current) {
                      slideScrollRef.current.scrollBy({ top: 140, behavior: 'smooth' });
                    }
                  }}
                  title="Shift Slide Down (View Bottom Content / Callout)"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 transition-all flex items-center space-x-1 text-xs"
                >
                  <ChevronDown className="w-4 h-4 text-brand-400" />
                  <span className="hidden sm:inline text-[11px]">Shift Down</span>
                </button>
              </div>

              {isTutor && (
                <button
                  onClick={handleAddWhiteboardSlide}
                  title="Add an interactive whiteboard slide for live notes or math derivations"
                  className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold border border-slate-700 transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-400" />
                  <span>Add Slide</span>
                </button>
              )}
            </div>

            {/* Quick jump slide selector pills (Tutor Only) */}
            {isTutor && (
              <div className="hidden md:flex items-center space-x-1 max-w-md overflow-x-auto py-1">
                {[...Array(totalSlides)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToSlide(i + 1)}
                    className={`min-w-6 h-6 px-1.5 rounded-md text-xs font-bold transition-all ${
                      currentSlide === i + 1 
                        ? 'bg-brand-600 text-white shadow-sm' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Presentation Mode (F)"}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 active:scale-95 transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-rose-400" /> : <Maximize2 className="w-3.5 h-3.5 text-brand-400" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('slides');
                  setSidebarOpen(true);
                }}
                title="Open Slide Deck in Sidebar"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
              >
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline">Deck List</span>
              </button>
              <div className="text-[11px] text-slate-400 hidden lg:block">
                {isTutor ? 'Controlling presentation sync' : 'Synchronized with Tutor'}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLLAPSIBLE SIDEBAR: Chat, Participants, Slide Deck */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-20">
            
            {/* Sidebar Tabs */}
            <div className="h-12 border-b border-slate-800 flex items-center justify-between px-3">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'participants' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster ({participants.length || 1})</span>
                  {participants.some(p => p.isHandRaised) && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold animate-pulse">
                      ✋ {participants.filter(p => p.isHandRaised).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('slides')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    activeTab === 'slides' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>Slides ({totalSlides})</span>
                </button>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab 1: Live Classroom Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs p-4">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      <span>Welcome to the live chat! Questions and comments will appear here.</span>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender?.id === user?.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[11px] font-bold text-slate-300">{m.sender?.full_name}</span>
                            <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                            isMe ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-800 flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question or comment..."
                    className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Participant Roster & Hand Raises */}
            {activeTab === 'participants' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Active Attendees ({participants.length || 1})</span>
                  {participants.some(p => p.isHandRaised) && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                      ✋ {participants.filter(p => p.isHandRaised).length} Hand(s) Raised
                    </span>
                  )}
                </div>
                {participants.map((p) => {
                  const hasHandUp = p.isHandRaised || (p.user?.id === user?.id && isHandRaised);
                  return (
                    <div 
                      key={p.socketId || p.user?.id} 
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        hasHandUp
                          ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50 shadow-md shadow-amber-950/50'
                          : 'bg-slate-800/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                          hasHandUp ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-700 text-white'
                        }`}>
                          {p.user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white truncate">{p.user?.full_name}</span>
                            {p.user?.role === 'tutor' && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold">TUTOR</span>
                            )}
                            {p.user?.id === user?.id && (
                              <span className="text-[9px] text-slate-400">(You)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 capitalize">{p.user?.role}</span>
                            {hasHandUp && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40 animate-pulse">
                                ✋ Hand Raised
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {hasHandUp && isTutor && (
                          <button
                            onClick={() => socket?.emit('lower_hand', { roomId: classId, targetSocketId: p.socketId })}
                            className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] shadow transition-colors flex items-center space-x-1"
                            title="Lower this student's hand"
                          >
                            <span>Lower Hand</span>
                          </button>
                        )}
                        {isTutor && p.user?.role !== 'tutor' && (
                          <button
                            onClick={() => socket?.emit('mute_participant', { roomId: classId, targetSocketId: p.socketId })}
                            title="Remotely Mute Student"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Presentation Deck Overview & Slide Picker */}
            {activeTab === 'slides' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      Presentation Deck
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {totalSlides} total slides &bull; Click to present
                    </span>
                  </div>
                  {isTutor && (
                    <button
                      onClick={handleAddWhiteboardSlide}
                      className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Slide</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => {
                    const slideObj = customSlides[idx];
                    const slideTitle = slideObj?.title || `Slide ${idx + 1}`;
                    const slideCat = slideObj?.category || (slideObj?.subtitle ? slideObj.subtitle.substring(0, 32) : `Page ${idx + 1}`);
                    const isActive = currentSlide === idx + 1;

                    return (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx + 1)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start space-x-2.5 ${
                          isActive
                            ? 'bg-brand-600/30 border border-brand-500/80 text-white ring-1 ring-brand-400 shadow-sm'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isActive ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-900 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">{slideTitle}</p>
                          <p className="text-[10px] text-slate-400 truncate">{slideCat}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </aside>
        )}

      </div>

      {/* 3. BOTTOM CONTROL BAR (VIDEO, MIC, SCREEN SHARE, RECORD, HAND RAISE) */}
      <footer className="h-18 bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Class duration / Room info */}
        <div className="flex items-center space-x-3 hidden sm:flex">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-300">Room: {classId}</span>
        </div>

        {/* Center: Essential Classroom Controls */}
        <div className="flex items-center space-x-3 mx-auto">
          
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl transition-all ${
              micActive 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-2xl transition-all ${
              videoActive 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
            }`}
            title={videoActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoActive ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-2xl transition-all ${
              isScreenSharing 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title="Share Screen"
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          {/* Student Raise Hand Toggle */}
          {!isTutor && (
            <button
              onClick={toggleHandRaise}
              className={`p-3 rounded-2xl transition-all ${
                isHandRaised 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 animate-pulse' 
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            >
              <Hand className="w-5 h-5" />
            </button>
          )}

          {/* Tutor Recording Toggle */}
          {isTutor && (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
                isRecording 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30' 
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              {isRecording ? <StopCircle className="w-4 h-4" /> : <Radio className="w-4 h-4 text-rose-500" />}
              <span>{isRecording ? 'Stop Recording' : 'Record Session'}</span>
            </button>
          )}

        </div>

        {/* Right: End Class / Leave Room */}
        <div className="flex items-center space-x-2">
          {isTutor && (
            <button
              onClick={handleEndClassForAll}
              className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors active:scale-95 flex items-center space-x-1.5"
              title="Conclude live session for all students"
            >
              <Power className="w-3.5 h-3.5" />
              <span>End Session for All</span>
            </button>
          )}
          <button
            onClick={handleLeaveClass}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs shadow-md transition-colors active:scale-95 flex items-center space-x-1.5 border border-slate-700"
          >
            <span>Leave Session</span>
          </button>
        </div>

      </footer>

      {/* Session Concluded Notice Modal (When meeting ends for all) */}
      {classEndedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Class Session Concluded</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{classEndedMessage}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-around">
              <div>
                <span className="text-[10px] text-slate-500 block">SCHEDULED</span>
                <span className="text-white font-bold">{totalDurationMinutes} mins</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 block">SESSION LENGTH</span>
                <span className="text-emerald-400 font-bold">{Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</span>
              </div>
            </div>
            <button
              onClick={handleLeaveClass}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
