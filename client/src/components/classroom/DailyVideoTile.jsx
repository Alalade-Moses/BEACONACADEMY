import React, { useEffect, useRef } from 'react';
import { MicOff, VideoOff, Crown } from 'lucide-react';

/**
 * DailyVideoTile
 * Renders an individual participant's audio and video stream from Daily.co
 */
export const DailyVideoTile = ({
  participant,
  isLocal = false,
  isTutor = false,
  isActiveSpeaker = false,
  className = '',
  showAudio = true,
  objectFit = 'cover'
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const videoTrack = participant?.tracks?.video?.persistentTrack;
  const audioTrack = participant?.tracks?.audio?.persistentTrack;

  const isVideoOff = !participant?.video || !videoTrack;
  const isAudioOff = !participant?.audio;
  const userName = participant?.user_name || (isLocal ? 'You' : 'Attendee');

  // Attach video track
  useEffect(() => {
    if (videoRef.current && videoTrack) {
      const stream = new MediaStream([videoTrack]);
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoTrack]);

  // Attach audio track (for remote participants only)
  useEffect(() => {
    if (!isLocal && showAudio && audioRef.current && audioTrack) {
      const stream = new MediaStream([audioTrack]);
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch((err) => {
        console.warn('[DailyVideoTile] Audio autoplay blocked or failed:', err);
      });
    } else if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
  }, [audioTrack, isLocal, showAudio]);

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-slate-900 border transition-all ${
        isActiveSpeaker ? 'ring-2 ring-emerald-400 border-emerald-400' : 'border-slate-800'
      } ${className}`}
    >
      {/* Remote Audio Element */}
      {!isLocal && showAudio && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
        />
      )}

      {/* Video Element */}
      {!isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal} // Always mute local video playback to avoid feedback
          playsInline
          style={{ objectFit }}
          className={`w-full h-full ${isLocal ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        /* Video Off Avatar Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-2 text-center select-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm sm:text-base shadow-inner mb-1.5">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] font-bold text-slate-300 truncate max-w-full px-2">
            {userName}
          </span>
          <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
            <VideoOff className="w-3 h-3 text-slate-500" />
            Camera off
          </span>
        </div>
      )}

      {/* Badges Overlay */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
        <div className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white flex items-center space-x-1 truncate max-w-[80%]">
          {isTutor && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
          <span className="truncate">{userName} {isLocal ? '(You)' : ''}</span>
        </div>

        {isAudioOff && (
          <div className="p-1 rounded-md bg-rose-500/80 text-white shadow-xs">
            <MicOff className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};
