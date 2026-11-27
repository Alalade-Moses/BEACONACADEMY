import React, { useState } from 'react';

const HONORIFICS = new Set(['dr', 'mr', 'mrs', 'ms', 'miss', 'prof', 'professor', 'sir', 'rev', 'eng']);

/**
 * Computes two uppercase initials from any full name.
 * Examples:
 *  - "John Doe" -> "JD"
 *  - "Dr. Sarah Jenkins" -> "SJ"
 *  - "Alalade Moses" -> "AM"
 *  - "Moses" -> "MO"
 */
export const getTwoInitials = (fullName, fallback = 'BB') => {
  const cleaned = String(fullName || '')
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .trim();

  if (!cleaned) return fallback;

  const rawWords = cleaned.split(/\s+/).filter(Boolean);
  const meaningfulWords = rawWords.filter((w) => !HONORIFICS.has(w.toLowerCase()));
  const words = meaningfulWords.length > 0 ? meaningfulWords : rawWords;

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  const single = words[0];
  if (single.length >= 2) {
    return single.slice(0, 2).toUpperCase();
  }
  return `${single[0]}${single[0]}`.toUpperCase();
};

/**
 * Returns true only when avatarUrl points to a real uploaded/custom image
 * rather than empty string or an auto-generated placeholder avatar service.
 */
export const hasCustomAvatar = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') return false;
  const trimmed = avatarUrl.trim();
  if (!trimmed) return false;
  if (/api\.dicebear\.com/i.test(trimmed)) return false;
  if (/ui-avatars\.com/i.test(trimmed)) return false;
  return true;
};

const ROLE_COLOR_MAP = {
  tutor: 'bg-emerald-600 text-white border-emerald-400/60',
  student: 'bg-indigo-600 text-white border-indigo-400/60',
  parent: 'bg-amber-600 text-white border-amber-400/60',
  superadmin: 'bg-purple-700 text-white border-purple-400/60',
  default: 'bg-[#050167] text-white border-[#40ffa7]/40'
};

/**
 * Reusable Avatar Component (Mobile & Desktop)
 * Displays the user's real photo when available; otherwise displays crisp two-letter initials.
 */
export const UserAvatar = ({
  name = '',
  avatarUrl = '',
  role = 'default',
  className = 'w-9 h-9 rounded-full text-xs',
  imgClassName = '',
  fallbackClassName = ''
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = hasCustomAvatar(avatarUrl) && !imgFailed;
  const initials = getTwoInitials(name);
  const roleTone = ROLE_COLOR_MAP[role] || ROLE_COLOR_MAP.default;

  if (showImage) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'User'}
        onError={() => setImgFailed(true)}
        className={`object-cover shrink-0 ${className} ${imgClassName}`}
      />
    );
  }

  return (
    <div
      aria-label={name || 'User'}
      title={name || ''}
      className={`inline-flex items-center justify-center font-extrabold tracking-tight uppercase select-none shrink-0 border ${roleTone} ${className} ${fallbackClassName}`}
    >
      {initials}
    </div>
  );
};
