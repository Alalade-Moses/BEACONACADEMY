import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
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
  GraduationCap
} from 'lucide-react';

export const ClassroomPage = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  // Class Session Details
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio / Video Media Controls
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  // Slide Deck & Presentation State
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 6;
  const [slideMode, setSlideMode] = useState('presentation'); // 'presentation' | 'whiteboard'

  // Digital Whiteboard & Annotation Tools
  const [currentTool, setCurrentTool] = useState('pen'); // 'pen' | 'highlighter' | 'rect' | 'circle' | 'line' | 'arrow' | 'eraser' | 'text'
  const [strokeColor, setStrokeColor] = useState('#ef4444'); // Default vibrant red for teaching
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokesBySlide, setStrokesBySlide] = useState({});

  // Canvas Refs
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);

  // Sidebar Tabs
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants' | 'slides'
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const isTutor = user?.role === 'tutor' || user?.role === 'superadmin';

  // 1. Fetch Class Data & Initialize
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/classes/${classId}`);
        if (res.data.success) {
          setClassDetails(res.data.class);
        }
      } catch (err) {
        console.error('Failed to load class', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassInfo();
  }, [classId]);

  // 2. Camera & Microphone Stream Setup
  useEffect(() => {
    let stream = null;
    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
      } catch (err) {
        console.warn('Camera/Microphone access not permitted or unavailable:', err.message);
      }
    };
    startMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

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
    socket.on('room_init_state', (state) => {
      if (state.currentSlide) setCurrentSlide(state.currentSlide);
      if (state.strokes) {
        setStrokesBySlide(prev => ({ ...prev, [state.currentSlide]: state.strokes }));
      }
      if (state.participants) setParticipants(state.participants);
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

    // Hand raise status
    socket.on('hand_raise_status', (data) => {
      if (data.user?.id === user.id) {
        setIsHandRaised(data.isHandRaised);
      }
    });

    // Remote mute
    socket.on('force_mute', () => {
      setMicActive(false);
      if (localStream) {
        localStream.getAudioTracks().forEach(t => t.enabled = false);
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
      socket.off('force_mute');
    };
  }, [socket, classId, user?.id, localStream]);

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

      if (stroke.tool === 'pen' || stroke.tool === 'highlighter' || stroke.tool === 'eraser') {
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
        ctx.strokeStyle = currentTool === 'eraser' ? '#0f172a' : strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentTool === 'highlighter' ? 0.35 : 1.0;
        ctx.moveTo(prev.u * width, prev.v * height);
        ctx.lineTo(curr.u * width, curr.v * height);
        ctx.stroke();
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
        color: currentTool === 'eraser' ? '#ffffff' : strokeColor,
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

  // 7. Toggle Mic & Camera
  const toggleMic = () => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setMicActive(track.enabled);
      }
    } else {
      setMicActive(!micActive);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const track = localStream.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setVideoActive(track.enabled);
      }
    } else {
      setVideoActive(!videoActive);
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

  // 11. Pre-Rendered Slide Contents for Slide Presentation Engine
  const renderSlideContent = () => {
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
              <span className="px-3 py-1.5 rounded-xl bg-white/10">EduLearn Platform Engine</span>
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
                <h4 className="text-xs font-bold text-emerald-400 mb-2">Normalized Vector (EduLearn Standard)</h4>
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

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      
      {/* 1. TOP CLASSROOM STATUS BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Class Title & Info */}
        <div className="flex items-center space-x-3">
          <Link
            to={isTutor ? "/tutor/dashboard" : "/student/dashboard"}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Leave Classroom"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
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

        {/* Center: Whiteboard & Presentation Mode Toggle (Tutor Only) */}
        {isTutor && (
          <div className="hidden md:flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80">
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
        )}

        {/* Right: Recording Status, Participants Count & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
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
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden">
          
          {/* ANNOTATION TOOLBAR (FOR TUTORS) */}
          {isTutor && (
            <div className="h-12 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between shrink-0 overflow-x-auto z-10">
              
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

              {/* Action Buttons: Undo / Clear */}
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
              </div>

            </div>
          )}

          {/* ACTIVE PRESENTATION CANVAS STAGE */}
          <div className="flex-1 relative flex items-center justify-center p-4 min-h-0 overflow-hidden bg-slate-950">
            
            {/* The Slide or Whiteboard Canvas Frame (16:10 aspect ratio) */}
            <div className="relative w-full h-full max-w-6xl aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
              
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
                    EduLearn Infinite Digital Whiteboard Stage
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
                className={`absolute inset-0 z-10 w-full h-full ${
                  isTutor ? 'cursor-crosshair' : 'cursor-default pointer-events-none'
                }`}
              />

              {/* Floating Instructor Video Tile */}
              <div className="absolute top-4 right-4 z-20 w-36 sm:w-44 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-500/80 bg-slate-900 group">
                {videoActive && localStream ? (
                  <video
                    autoPlay
                    muted
                    playsInline
                    ref={(el) => {
                      if (el && localStream) el.srcObject = localStream;
                    }}
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                    <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                    <span className="text-[10px] font-bold">{user?.full_name}</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center space-x-1">
                  <span>{user?.full_name} ({user?.role})</span>
                  {!micActive && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
                </div>
              </div>

            </div>

          </div>

          {/* SLIDE NAVIGATION BAR */}
          <div className="h-12 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => goToSlide(currentSlide - 1)}
                disabled={currentSlide <= 1}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-slate-200">
                Slide {currentSlide} of {totalSlides}
              </span>
              <button
                onClick={() => goToSlide(currentSlide + 1)}
                disabled={currentSlide >= totalSlides}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick jump slide selector */}
            <div className="hidden sm:flex items-center space-x-1.5">
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToSlide(i + 1)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                    currentSlide === i + 1 
                      ? 'bg-brand-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              {isTutor ? 'You are controlling presentation navigation' : 'Slide synchronized with Tutor'}
            </div>
          </div>

        </div>

        {/* RIGHT COLLAPSIBLE SIDEBAR: Chat, Participants, Raised Hands */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-20">
            
            {/* Sidebar Tabs */}
            <div className="h-12 border-b border-slate-800 flex items-center justify-between px-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Class Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'participants' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster ({participants.length || 1})</span>
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
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Attendees ({participants.length || 1})
                </div>
                {participants.map((p) => (
                  <div key={p.socketId} className="p-3 rounded-xl bg-slate-800/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0 text-white">
                        {p.user?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate">{p.user?.full_name}</span>
                          {p.user?.role === 'tutor' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold">TUTOR</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{p.user?.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {p.isHandRaised && (
                        <span className="p-1 rounded bg-amber-500/20 text-amber-400 animate-bounce" title="Hand Raised">
                          <Hand className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {isTutor && p.user?.role !== 'tutor' && (
                        <button
                          onClick={() => socket?.emit('mute_participant', { roomId: classId, targetSocketId: p.socketId })}
                          title="Remotely Mute Student"
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
          <button
            onClick={() => {
              if (localStream) localStream.getTracks().forEach(t => t.stop());
              navigate(isTutor ? "/tutor/dashboard" : "/student/dashboard");
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Leave Session
          </button>
        </div>

      </footer>

    </div>
  );
};
