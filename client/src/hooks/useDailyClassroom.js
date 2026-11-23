import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { loadDaily } from '../utils/dailyLoader';

/**
 * useDailyClassroom Hook
 * Connects the classroom to Daily.co's enterprise WebRTC SFU engine
 * providing crystal-clear bi-directional audio and video.
 */
export const useDailyClassroom = ({ roomId, asRole, enabled = true }) => {
  const [dailyConfigured, setDailyConfigured] = useState(false);
  const [isDailyActive, setIsDailyActive] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [dailyError, setDailyError] = useState(null);
  const [roomUrl, setRoomUrl] = useState(null);
  const [dailyToken, setDailyToken] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Participant list & track states
  const [participants, setParticipants] = useState({});
  const [localParticipant, setLocalParticipant] = useState(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);

  const callObjectRef = useRef(null);
  const isMountedRef = useRef(true);

  // Synchronize participants state from Daily call object
  const updateParticipants = useCallback((callObj) => {
    if (!callObj || !isMountedRef.current) return;
    try {
      const all = callObj.participants();
      setParticipants({ ...all });
      setLocalParticipant(all.local || null);
    } catch (e) {
      console.warn('[Daily] updateParticipants warn:', e);
    }
  }, []);

  // Initialize and join Daily room
  useEffect(() => {
    isMountedRef.current = true;
    if (!enabled || !roomId) return;

    let callObj = null;

    const setupDaily = async () => {
      try {
        setIsJoining(true);
        setDailyError(null);

        // 1. Fetch access token and room URL from backend
        const res = await api.post('/daily/room-access', {
          roomId,
          asRole
        });

        if (!isMountedRef.current) return;

        if (!res.data.success || !res.data.configured) {
          // Daily not configured in server/.env, fallback gracefully
          setDailyConfigured(false);
          setIsDailyActive(false);
          setIsJoining(false);
          return;
        }

        const { roomUrl: targetUrl, token, isOwner: ownerFlag } = res.data;
        setDailyConfigured(true);
        setRoomUrl(targetUrl);
        setDailyToken(token);
        setIsOwner(Boolean(ownerFlag));

        // 2. Dynamically load Daily SDK
        const DailyIframe = await loadDaily();
        if (!isMountedRef.current) return;

        // 3. Create invisible call object with high-fidelity WebRTC settings
        callObj = DailyIframe.createCallObject({
          subscribeToTracksAutomatically: true,
          dailyConfig: {
            useDevicePreferenceCookies: true,
            micAudioMode: 'music-and-speech' // Enables high quality echo cancellation and noise suppression
          }
        });

        callObjectRef.current = callObj;

        // 4. Attach event listeners
        callObj
          .on('joined-meeting', (e) => {
            if (!isMountedRef.current) return;
            setIsDailyActive(true);
            setIsJoining(false);
            updateParticipants(callObj);
          })
          .on('left-meeting', () => {
            if (!isMountedRef.current) return;
            setIsDailyActive(false);
            setParticipants({});
            setLocalParticipant(null);
          })
          .on('participant-joined', () => updateParticipants(callObj))
          .on('participant-updated', () => updateParticipants(callObj))
          .on('participant-left', () => updateParticipants(callObj))
          .on('track-started', () => updateParticipants(callObj))
          .on('track-stopped', () => updateParticipants(callObj))
          .on('active-speaker-change', (e) => {
            if (isMountedRef.current && e?.activeSpeaker) {
              setActiveSpeakerId(e.activeSpeaker.peerId);
            }
          })
          .on('error', (err) => {
            console.error('[Daily] Call Error:', err);
            if (isMountedRef.current) {
              setDailyError(err.errorMsg || 'Daily media connection error');
            }
          });

        // 5. Join room with secure token
        await callObj.join({
          url: targetUrl,
          token: token || undefined
        });

      } catch (err) {
        console.warn('[useDailyClassroom] Setup failed or Daily not available:', err.message);
        if (isMountedRef.current) {
          setDailyError(err.message);
          setIsJoining(false);
          setIsDailyActive(false);
        }
      }
    };

    setupDaily();

    return () => {
      isMountedRef.current = false;
      if (callObj) {
        try {
          callObj.leave().catch(() => {});
          callObj.destroy().catch(() => {});
        } catch (_) {}
      }
      callObjectRef.current = null;
    };
  }, [roomId, asRole, enabled, updateParticipants]);

  // Audio / Mic Control
  const setLocalAudio = useCallback((enable) => {
    if (!callObjectRef.current || !isDailyActive) return;
    try {
      callObjectRef.current.setLocalAudio(Boolean(enable));
    } catch (e) {
      console.warn('[Daily] setLocalAudio failed:', e);
    }
  }, [isDailyActive]);

  // Video / Camera Control
  const setLocalVideo = useCallback((enable) => {
    if (!callObjectRef.current || !isDailyActive) return;
    try {
      callObjectRef.current.setLocalVideo(Boolean(enable));
    } catch (e) {
      console.warn('[Daily] setLocalVideo failed:', e);
    }
  }, [isDailyActive]);

  // Screen Share Control
  const startScreenShare = useCallback(() => {
    if (!callObjectRef.current || !isDailyActive) return;
    try {
      callObjectRef.current.startScreenShare();
    } catch (e) {
      console.warn('[Daily] startScreenShare failed:', e);
    }
  }, [isDailyActive]);

  const stopScreenShare = useCallback(() => {
    if (!callObjectRef.current || !isDailyActive) return;
    try {
      callObjectRef.current.stopScreenShare();
    } catch (e) {
      console.warn('[Daily] stopScreenShare failed:', e);
    }
  }, [isDailyActive]);

  return {
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
