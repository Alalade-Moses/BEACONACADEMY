import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, VideoOff, Crown } from 'lucide-react';
import { getTwoInitials } from '../common/UserAvatar';

/**
 * DailyVideoTile
 * Renders an individual participant's video stream (or two-initial avatar when camera is off)
 * from Daily.co. Remote audio is handled globally by DailyAudioRenderer so audio is never
 * duplicated or dropped when switching classroom layouts or minimizing tiles.
 */
export const DailyVideoTile = ({
  participant,
  isLocal = false,
  isTutor = false,
  isActiveSpeaker = false,
  className = '',
  showAudio = false,
  objectFit = 'cover'
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const videoTrackObj = participant?.tracks?.video;
  const videoTrack = videoTrackObj?.persistentTrack || videoTrackObj?.track || null;
  const videoState = videoTrackObj?.state || 'off';

  const audioTrackObj = participant?.tracks?.audio;
  const audioTrack = audioTrackObj?.persistentTrack || audioTrackObj?.track || null;
  const audioState = audioTrackObj?.state || 'off';

  const isVideoOff = !participant?.video || !videoTrack || videoState === 'off' || videoState === 'blocked';
  const isAudioOff = !participant?.audio || audioState === 'off' || audioState === 'blocked';
  const userName = participant?.user_name || (isLocal ? 'You' : isTutor ? 'Course Tutor' : 'Student');
  const initials = getTwoInitials(userName, isTutor ? 'TU' : 'ST');

  // Attach video track (always muted on <video> element; audio plays via dedicated <audio> pipeline)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!isVideoOff && videoTrack) {
      const existing = el.srcObject ? el.srcObject.getVideoTracks() : [];
      if (existing.length === 0 || existing[0]?.id !== videoTrack.id) {
        el.srcObject = new MediaStream([videoTrack]);
      }
      el.play().catch(() => {});

      const handleUnmute = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = new MediaStream([videoTrack]);
          videoRef.current.play().catch(() => {});
        }
      };
      videoTrack.addEventListener?.('unmute', handleUnmute);
      return () => {
        videoTrack.removeEventListener?.('unmute', handleUnmute);
      };
    } else {
      el.srcObject = null;
    }
  }, [videoTrack, videoTrack?.id, isVideoOff]);

  // Optional local-tile audio fallback (disabled by default since DailyAudioRenderer owns remote audio)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!isLocal && showAudio && audioTrack && audioState !== 'off') {
      el.srcObject = new MediaStream([audioTrack]);
      el.muted = false;
      el.volume = 1.0;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [audioTrack, audioTrack?.id, audioState, isLocal, showAudio]);

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-slate-900 border transition-all ${
        isActiveSpeaker ? 'ring-2 ring-emerald-400 border-emerald-400' : 'border-slate-800'
      } ${className}`}
    >
      {!isLocal && showAudio && (
        <audio ref={audioRef} autoPlay playsInline />
      )}

      {!isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ objectFit }}
          className={`w-full h-full ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        /* Camera Off Two-Initials Placeholder (Mobile & Desktop) */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-2 text-center select-none">
          <div
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-extrabold tracking-tight text-sm sm:text-lg shadow-lg mb-1.5 border-2 ${
              isTutor
                ? 'bg-emerald-600/90 border-emerald-400 text-white'
                : 'bg-indigo-600/90 border-indigo-400 text-white'
            }`}
          >
            {initials}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-full px-2">
            {userName}
          </span>
          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
            <VideoOff className="w-2.5 h-2.5 text-slate-500" />
            <span>Camera off</span>
          </span>
        </div>
      )}

      {/* Name & Audio Status Badges Overlay */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none gap-1">
        <div className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white flex items-center space-x-1 truncate max-w-[80%]">
          {isTutor && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
          <span className="truncate">{userName} {isLocal ? '(You)' : ''}</span>
        </div>

        {isAudioOff ? (
          <div className="p-1 rounded-md bg-rose-500/90 text-white shadow-xs shrink-0" title="Microphone Muted">
            <MicOff className="w-3 h-3" />
          </div>
        ) : (
          <div className="p-1 rounded-md bg-emerald-500/90 text-white shadow-xs shrink-0" title="Microphone Live">
            <Mic className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};
