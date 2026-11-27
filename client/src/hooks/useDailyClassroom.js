import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { loadDaily } from '../utils/dailyLoader';

/**
 * useDailyClassroom Hook
 * Connects the classroom to Daily.co's WebRTC SFU engine
 * providing crystal-clear bi-directional audio and video for BOTH Tutor and Students.
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

    const setupDaily = async () => {
      try {
        setDailyStatus('checking');
        setIsJoining(true);
        setDailyError(null);

        // 1. Fetch access token and room URL from backend
        const res = await api.post('/daily/room-access', {
          roomId,
          asRole
        });

        if (!isMountedRef.current) return;

        if (!res.data.success || !res.data.configured || !res.data.roomUrl) {
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

        // 2. Dynamically load Daily SDK
        const DailyIframe = await loadDaily();
        if (!isMountedRef.current) return;

        // 3. Create call object with two-way audio + camera enabled for both Tutor and Students
        callObj = DailyIframe.createCallObject({
          subscribeToTracksAutomatically: true,
          audioSource: true,
          videoSource: true
        });

        callObjectRef.current = callObj;

        // 4. Attach comprehensive event listeners so track changes ALWAYS propagate
        callObj
          .on('joined-meeting', () => {
            if (!isMountedRef.current) return;
            setIsDailyActive(true);
            setIsJoining(false);
            setDailyStatus('connected');

            // Ensure microphone is explicitly active on join for both Tutor and Student
            try {
              callObj.setLocalAudio(true);
            } catch (_) {}

            updateParticipants(callObj);
            // Delayed refreshes to capture tracks transitioning from 'loading' -> 'playable'
            setTimeout(() => updateParticipants(callObj), 600);
            setTimeout(() => updateParticipants(callObj), 1500);
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
          .on('camera-error', (err) => {
            console.warn('[Daily] Camera/Mic hardware notice:', err);
            // Even if camera is unavailable, keep microphone audio live!
            try {
              callObj.setLocalAudio(true);
            } catch (_) {}
            updateParticipants(callObj);
          })
          .on('error', (err) => {
            console.error('[Daily] Call Error:', err);
            if (isMountedRef.current) {
              setDailyError(err.errorMsg || 'Daily media connection error');
            }
          });

        // 5. Join room with explicit audio & camera on; gracefully fallback to audio-only if device has no camera
        try {
          await callObj.join({
            url: targetUrl,
            token: token || undefined,
            startAudioOff: false,
            startVideoOff: false
          });
        } catch (joinErr) {
          console.warn('[Daily] Retrying join in audio-only mode (no camera / cam busy):', joinErr?.message);
          await callObj.join({
            url: targetUrl,
            token: token || undefined,
            videoSource: false,
            audioSource: true,
            startAudioOff: false,
            startVideoOff: true
          });
        }
      } catch (err) {
        console.warn('[useDailyClassroom] Setup failed or Daily unavailable:', err?.message);
        if (isMountedRef.current) {
          setDailyError(err?.message || 'Daily connection unavailable');
          setIsJoining(false);
          setIsDailyActive(false);
          setDailyStatus('unavailable');
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
    if (!callObjectRef.current) return;
    try {
      callObjectRef.current.setLocalAudio(Boolean(enable));
      setTimeout(() => updateParticipants(callObjectRef.current), 150);
    } catch (e) {
      console.warn('[Daily] setLocalAudio failed:', e);
    }
  }, [updateParticipants]);

  // Video / Camera Control
  const setLocalVideo = useCallback((enable) => {
    if (!callObjectRef.current) return;
    try {
      callObjectRef.current.setLocalVideo(Boolean(enable));
      setTimeout(() => updateParticipants(callObjectRef.current), 150);
    } catch (e) {
      console.warn('[Daily] setLocalVideo failed:', e);
    }
  }, [updateParticipants]);

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
