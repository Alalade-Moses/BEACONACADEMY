/**
 * Daily.co Live Virtual Classroom API Service
 * Handles room creation, token provisioning, and participant configuration
 * for Beacon Bridge Academics virtual classrooms.
 */

const DAILY_API_BASE = 'https://api.daily.co/v1';

class DailyService {
  constructor() {
    this.apiKey = process.env.DAILY_API_KEY || '';
    this.domain = process.env.DAILY_DOMAIN || '';
  }

  /**
   * Check if Daily.co credentials are configured in the environment
   */
  isConfigured() {
    return Boolean(process.env.DAILY_API_KEY && process.env.DAILY_API_KEY.trim() !== '');
  }

  /**
   * Helper: Get standard auth headers
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
    };
  }

  /**
   * Sanitize room code to fit Daily.co naming standards
   * (alphanumeric, hyphens, lowercase, up to 64 chars)
   */
  sanitizeRoomName(rawRoomId) {
    if (!rawRoomId) return `beacon-room-${Date.now()}`;
    const clean = String(rawRoomId)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
    return clean.startsWith('beacon-') ? clean : `beacon-${clean}`;
  }

  /**
   * Create a new Daily room or fetch it if already exists
   * @param {string} rawRoomId - The Beacon Bridge class / room ID
   * @param {object} customProps - Optional overrides
   */
  async createOrGetRoom(rawRoomId, customProps = {}) {
    if (!this.isConfigured()) {
      return {
        configured: false,
        message: 'Daily.co is not yet configured. Please supply DAILY_API_KEY in server/.env.'
      };
    }

    const roomName = this.sanitizeRoomName(rawRoomId);

    try {
      // 1. Try to fetch existing room
      const getRes = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (getRes.ok) {
        const existingRoom = await getRes.json();
        return {
          configured: true,
          room: existingRoom,
          url: existingRoom.url,
          name: existingRoom.name
        };
      }

      // 2. Room doesn't exist, create it
      // Default: expires in 4 hours from now to allow full class + margin
      const expTimestamp = Math.floor(Date.now() / 1000) + (4 * 3600);

      const payload = {
        name: roomName,
        privacy: 'public', // Access is gated via Beacon Bridge token & auth
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          enable_knocking: false,
          start_video_off: false,
          start_audio_off: false,
          exp: expTimestamp,
          eject_at_room_exp: false,
          ...customProps
        }
      };

      const createRes = await fetch(`${DAILY_API_BASE}/rooms`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await createRes.json();

      if (!createRes.ok) {
        // If it was created concurrently in another thread
        if (data.info?.includes('already exists') || data.error?.includes('already exists')) {
          const fallbackRes = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
            method: 'GET',
            headers: this.getHeaders()
          });
          if (fallbackRes.ok) {
            const fetched = await fallbackRes.json();
            return { configured: true, room: fetched, url: fetched.url, name: fetched.name };
          }
        }
        throw new Error(data.error || data.info || 'Failed to create Daily room');
      }

      return {
        configured: true,
        room: data,
        url: data.url,
        name: data.name
      };
    } catch (err) {
      console.error('[DailyService] Room retrieval/creation error:', err.message);
      return {
        configured: false,
        error: err.message
      };
    }
  }

  /**
   * Provision a secure meeting token with specific permissions (owner vs student)
   * @param {string} roomName - The sanitized Daily room name
   * @param {object} user - The authenticated user { id, name, role }
   * @param {boolean} isOwner - Whether the user has tutor/admin controls
   */
  async createMeetingToken(roomName, user = {}, isOwner = false) {
    if (!this.isConfigured()) {
      return { token: null, configured: false };
    }

    try {
      const expTimestamp = Math.floor(Date.now() / 1000) + (4 * 3600);
      const userName = user.full_name || user.name || (isOwner ? 'Lead Tutor' : 'Student');

      const payload = {
        properties: {
          room_name: roomName,
          user_name: userName,
          user_id: String(user.id || 'usr-anonymous'),
          is_owner: Boolean(isOwner),
          enable_screenshare: true,
          exp: expTimestamp
        }
      };

      const res = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create Daily meeting token');
      }

      return {
        configured: true,
        token: data.token,
        isOwner: Boolean(isOwner),
        userName
      };
    } catch (err) {
      console.error('[DailyService] Token provisioning error:', err.message);
      return {
        configured: false,
        token: null,
        error: err.message
      };
    }
  }
}

export const dailyService = new DailyService();
