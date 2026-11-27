import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { loadDaily } from '../utils/dailyLoader';

const DAILY_CONNECT_TIMEOUT_MS = 14000;

const withTimeout = (promise, ms, label) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });

/**
 * useDailyClassroom Hook
 * Connects the classroom to Daily.co's WebRTC SFU engine using strict CSP-safe mode (avoidEval: true)
 * providing reliable two-way audio and video for BOTH Tutor and Students.
 */
export const useDailyClassroom = ({ roomId, asRole, enabled = true }) => {
  const [dailyStatus, setDailyStatus] = useState('checking'); // 'checking' | 'connecting' | 'connected' | 'unavailable'
  const [dailyConfigured, setDailyConfigured] = useState(false);
  const [isDailyActive, setIsDailyActive] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [dailyError, setDailyError] = useState(null);
  const [roomUrl, setRoomUrl] = useState(null);
  const [dailyToken, setDailyToken] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Participant list & track states (cloned snapshots so React always re-renders on track state changes)
  const [participants, setParticipants] = useState({});
  const [localParticipant, setLocalParticipant] = useState(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);

  const callObjectRef = useRef(null);
  const isMountedRef = useRef(true);

  const updateParticipants = useCallback((callObj) => {
    if (!callObj || !isMountedRef.current) return;
    try {
      const all = callObj.participants() || {};
      const snapshot = {};
      for (const [key, p] of Object.entries(all)) {
        if (!p) continue;
        snapshot[key] = {
          ...p,
          tracks: {
            audio: p.tracks?.audio ? { ...p.tracks.audio } : undefined,
            video: p.tracks?.video ? { ...p.tracks.video } : undefined,
            screenVideo: p.tracks?.screenVideo ? { ...p.tracks.screenVideo } : undefined,
            screenAudio: p.tracks?.screenAudio ? { ...p.tracks.screenAudio } : undefined
          }
        };
      }
      setParticipants(snapshot);
      setLocalParticipant(snapshot.local || null);
    } catch (e) {
      console.warn('[Daily] updateParticipants warn:', e);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (!enabled || !roomId) {
      setDailyStatus('unavailable');
      return;
    }

    let callObj = null;
    let cancelled = false;

    const cleanupCallObj = (instance) => {
      if (!instance) return;
      try {
        instance.leave().catch(() => {});
      } catch (_) {}
      try {
        instance.destroy().catch(() => {});
      } catch (_) {}
    };

    const setupDaily = async () => {
      try {
        setDailyStatus('checking');
        setIsJoining(true);
        setDailyError(null);

        // 1. Fetch room URL & signed meeting token from backend
        const res = await withTimeout(
          api.post('/daily/room-access', { roomId, asRole }),
          8000,
          'Daily room access'
        );

        if (cancelled || !isMountedRef.current) return;

        if (!res.data?.success || !res.data?.configured || !res.data?.roomUrl) {
          setDailyConfigured(false);
          setIsDailyActive(false);
          setIsJoining(false);
          setDailyStatus('unavailable');
          return;
        }

        const { roomUrl: targetUrl, token, isOwner: ownerFlag } = res.data;
        setDailyConfigured(true);
        setRoomUrl(targetUrl);
        setDailyToken(token);
        setIsOwner(Boolean(ownerFlag));
        setDailyStatus('connecting');

        // 2. Load locally bundled Daily.co SDK (lazy Vite chunk, zero external CDN dependency)
        const DailyIframe = await withTimeout(loadDaily(), 8000, 'Daily SDK load');
        if (cancelled || !isMountedRef.current) return;

        // 3. Create CSP-safe Call Object (avoidEval: true avoids Function() CSP violation!)
        callObj = DailyIframe.createCallObject({
          subscribeToTracksAutomatically: true,
          dailyConfig: {
            avoidEval: true
          }
        });

        callObjectRef.current = callObj;

        // 4. Attach comprehensive event listeners so every audio/video track update reaches React
        callObj
          .on('started-camera', () => updateParticipants(callObj))
          .on('joined-meeting', () => {
            if (cancelled || !isMountedRef.current) return;
            setIsDailyActive(true);
            setIsJoining(false);
            setDailyStatus('connected');

            // Explicitly ensure microphone and camera are enabled when available
            try {
              callObj.setLocalAudio(true);
            } catch (_) {}

            updateParticipants(callObj);
            setTimeout(() => updateParticipants(callObj), 400);
            setTimeout(() => updateParticipants(callObj), 1200);
            setTimeout(() => updateParticipants(callObj), 2500);
          })
          .on('left-meeting', () => {
            if (cancelled || !isMountedRef.current) return;
            setIsDailyActive(false);
            setParticipants({});
            setLocalParticipant(null);
          })
          .on('participant-joined', () => updateParticipants(callObj))
          .on('participant-updated', () => updateParticipants(callObj))
          .on('participant-left', () => updateParticipants(callObj))
          .on('track-started', () => updateParticipants(callObj))
          .on('track-stopped', () => updateParticipants(callObj))
          .on('local-screen-share-started', () => updateParticipants(callObj))
          .on('local-screen-share-stopped', () => updateParticipants(callObj))
          .on('active-speaker-change', (e) => {
            if (!cancelled && isMountedRef.current && e?.activeSpeaker) {
              setActiveSpeakerId(e.activeSpeaker.peerId);
            }
          })
          .on('camera-error', (err) => {
            console.warn('[Daily] Camera/Mic hardware notice:', err);
            // If camera failed (e.g. no webcam or busy), keep microphone active so audio continues
            try {
              callObj.setLocalAudio(true);
            } catch (_) {}
            updateParticipants(callObj);
          })
          .on('error', (err) => {
            console.error('[Daily] Fatal call error:', err);
            if (!cancelled && isMountedRef.current) {
              setDailyError(err?.errorMsg || 'Daily media connection error');
              // If fatal error occurred before joining, cleanly fall back to WebRTC
              if (!callObj || callObj.meetingState?.() !== 'joined-meeting') {
                setIsJoining(false);
                setIsDailyActive(false);
                setDailyStatus('unavailable');
              }
            }
          });

        // 5. Join room with BOTH microphone and camera enabled (for both Tutor & Student)
        const joinPayload = {
          url: targetUrl,
          token: token || undefined,
          startAudioOff: false,
          startVideoOff: false
        };

        await withTimeout(callObj.join(joinPayload), DAILY_CONNECT_TIMEOUT_MS, 'Daily join');

        if (!cancelled && isMountedRef.current) {
          setIsDailyActive(true);
          setIsJoining(false);
          setDailyStatus('connected');
          updateParticipants(callObj);
        }
      } catch (err) {
        console.warn('[useDailyClassroom] Falling back to WebRTC because Daily setup failed:', err?.message || err);
        cleanupCallObj(callObj);
        callObj = null;
        if (callObjectRef.current) {
          callObjectRef.current = null;
        }
        if (!cancelled && isMountedRef.current) {
          setDailyError(err?.message || 'Daily connection unavailable');
          setIsJoining(false);
          setIsDailyActive(false);
          setDailyStatus('unavailable');
        }
      }
    };

    setupDaily();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      cleanupCallObj(callObj);
      callObjectRef.current = null;
    };
  }, [roomId, asRole, enabled, updateParticipants]);

  // Audio / Mic Control
  const setLocalAudio = useCallback((enable) => {
    const co = callObjectRef.current;
    if (!co) return;
    try {
      co.setLocalAudio(Boolean(enable));
      setTimeout(() => updateParticipants(co), 150);
    } catch (e) {
      console.warn('[Daily] setLocalAudio failed:', e);
    }
  }, [updateParticipants]);

  // Video / Camera Control
  const setLocalVideo = useCallback((enable) => {
    const co = callObjectRef.current;
    if (!co) return;
    try {
      co.setLocalVideo(Boolean(enable));
      setTimeout(() => updateParticipants(co), 150);
    } catch (e) {
      console.warn('[Daily] setLocalVideo failed:', e);
    }
  }, [updateParticipants]);

  // Screen Share Control
  const startScreenShare = useCallback(() => {
    const co = callObjectRef.current;
    if (!co || !isDailyActive) return;
    try {
      co.startScreenShare();
      setTimeout(() => updateParticipants(co), 300);
    } catch (e) {
      console.warn('[Daily] startScreenShare failed:', e);
    }
  }, [isDailyActive, updateParticipants]);

  const stopScreenShare = useCallback(() => {
    const co = callObjectRef.current;
    if (!co || !isDailyActive) return;
    try {
      co.stopScreenShare();
      setTimeout(() => updateParticipants(co), 200);
    } catch (e) {
      console.warn('[Daily] stopScreenShare failed:', e);
    }
  }, [isDailyActive, updateParticipants]);

  return {
    dailyStatus,
    dailyConfigured,
    isDailyActive,
    isJoining,
    dailyError,
    roomUrl,
    dailyToken,
    isOwner,
    participants,
    localParticipant,
    activeSpeakerId,
    setLocalAudio,
    setLocalVideo,
    startScreenShare,
    stopScreenShare,
    callObject: callObjectRef.current
  };
};
