import React, { useEffect, useRef } from 'react';

/**
 * Single Remote Daily Participant Audio Element
 * Handles track transitions, unmute events, screen-share audio, periodic recovery, and autoplay unlock.
 */
const DailyParticipantAudio = ({ participant, unlockTrigger = 0, onAudioBlocked }) => {
  const audioRef = useRef(null);
  const screenAudioRef = useRef(null);

  const audioTrackObj = participant?.tracks?.audio;
  const audioTrack = audioTrackObj?.persistentTrack || audioTrackObj?.track || null;
  const audioState = audioTrackObj?.state || 'off';
  const isAudioEnabled = Boolean(participant?.audio);

  const screenAudioObj = participant?.tracks?.screenAudio;
  const screenAudioTrack = screenAudioObj?.persistentTrack || screenAudioObj?.track || null;
  const screenAudioState = screenAudioObj?.state || 'off';

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (!audioTrack || audioState === 'off' || audioState === 'blocked') {
      audioEl.srcObject = null;
      return;
    }

    const currentTracks = audioEl.srcObject ? audioEl.srcObject.getAudioTracks() : [];
    if (currentTracks.length === 0 || currentTracks[0]?.id !== audioTrack.id) {
      audioEl.srcObject = new MediaStream([audioTrack]);
    }

    audioEl.muted = false;
    audioEl.volume = 1.0;

    const tryPlay = () => {
      if (!audioEl.srcObject) return;
      const p = audioEl.play();
      if (p !== undefined) {
        p.catch((err) => {
          if (err?.name === 'AbortError') return;
          if (err?.name === 'NotAllowedError') {
            if (onAudioBlocked) onAudioBlocked();
          }
        });
      }
    };

    tryPlay();

    const handleUnmute = () => tryPlay();
    audioTrack.addEventListener?.('unmute', handleUnmute);

    // Gentle recovery check for mobile/Safari browsers that suspend remote WebRTC audio on initial join
    const recoveryInterval = setInterval(() => {
      if (audioEl.paused && audioEl.srcObject && audioTrack.readyState === 'live') {
        tryPlay();
      }
    }, 1800);

    return () => {
      clearInterval(recoveryInterval);
      audioTrack.removeEventListener?.('unmute', handleUnmute);
    };
  }, [audioTrack, audioTrack?.id, audioState, isAudioEnabled, unlockTrigger, onAudioBlocked]);

  // Also play remote screen-share audio (e.g. if tutor shares a video or presentation with sound)
  useEffect(() => {
    const el = screenAudioRef.current;
    if (!el) return;
    if (!screenAudioTrack || screenAudioState === 'off') {
      el.srcObject = null;
      return;
    }
    const existing = el.srcObject ? el.srcObject.getAudioTracks() : [];
    if (existing.length === 0 || existing[0]?.id !== screenAudioTrack.id) {
      el.srcObject = new MediaStream([screenAudioTrack]);
    }
    el.muted = false;
    el.volume = 1.0;
    el.play().catch((err) => {
      if (err?.name === 'NotAllowedError' && onAudioBlocked) onAudioBlocked();
    });
  }, [screenAudioTrack, screenAudioTrack?.id, screenAudioState, unlockTrigger, onAudioBlocked]);

  return (
    <>
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        data-daily-peer={participant?.session_id || ''}
        style={{ position: 'fixed', top: -100, left: -100, width: 1, height: 1, opacity: 0.001, pointerEvents: 'none' }}
      />
      {screenAudioTrack && (
        <audio
          ref={screenAudioRef}
          autoPlay
          playsInline
          style={{ position: 'fixed', top: -100, left: -100, width: 1, height: 1, opacity: 0.001, pointerEvents: 'none' }}
        />
      )}
    </>
  );
};

/**
 * DailyAudioRenderer
 * Always-mounted global Daily.co audio mixer.
 * Ensures BOTH Student hears Tutor AND Tutor hears Students in ALL classroom modes
 * (Presentation, Whiteboard, Gallery, Screen Share, Minimized Tile, Mobile & Desktop).
 */
export const DailyAudioRenderer = ({ participants = {}, unlockTrigger = 0, onAudioBlocked }) => {
  const remoteParticipants = Object.values(participants).filter((p) => p && !p.local);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: -100, left: -100, width: 1, height: 1, opacity: 0.001, pointerEvents: 'none', zIndex: -1 }}>
      {remoteParticipants.map((p) => (
        <DailyParticipantAudio
          key={p.session_id || p.user_id}
          participant={p}
          unlockTrigger={unlockTrigger}
          onAudioBlocked={onAudioBlocked}
        />
      ))}
    </div>
  );
};
