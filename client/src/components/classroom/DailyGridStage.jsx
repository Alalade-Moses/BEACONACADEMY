import React from 'react';
import { DailyVideoTile } from './DailyVideoTile';
import { Users, Radio } from 'lucide-react';

/**
 * DailyGridStage
 * Displays all classroom participants (up to 20+ students and tutor) in a responsive grid
 * similar to Google Meet / Zoom gallery view.
 */
export const DailyGridStage = ({
  participants = {},
  localParticipant = null,
  activeSpeakerId = null,
  isTutor = false
}) => {
  const remoteList = Object.values(participants).filter(p => !p.local);
  const totalCount = (localParticipant ? 1 : 0) + remoteList.length;

  // Determine dynamic grid columns based on participant count
  const getGridClass = (count) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-2 sm:grid-cols-3';
    if (count <= 16) return 'grid-cols-3 sm:grid-cols-4';
    return 'grid-cols-4 sm:grid-cols-5';
  };

  return (
    <div className="w-full h-full bg-slate-950 p-2 sm:p-4 flex flex-col justify-between overflow-hidden">
      {/* Grid Top Status */}
      <div className="flex items-center justify-between pb-2 text-xs text-slate-400 border-b border-slate-800/80 mb-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[11px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Live Video Gallery
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="text-[11px] text-slate-300">
            Powered by Daily.co High-Fidelity Audio & Video Engine
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-300">
          <Users className="w-3.5 h-3.5 text-brand-400" />
          <span>{totalCount} Active {totalCount === 1 ? 'Attendee' : 'Attendees'}</span>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className={`flex-1 grid gap-2 sm:gap-3 min-h-0 overflow-y-auto ${getGridClass(totalCount)} auto-rows-fr`}>
        {/* Local Participant Tile */}
        {localParticipant && (
          <DailyVideoTile
            participant={localParticipant}
            isLocal={true}
            isTutor={isTutor}
            isActiveSpeaker={activeSpeakerId === localParticipant.session_id}
            className="w-full h-full min-h-[140px]"
          />
        )}

        {/* Remote Participants */}
        {remoteList.map((participant) => (
          <DailyVideoTile
            key={participant.session_id || participant.user_id}
            participant={participant}
            isLocal={false}
            isTutor={participant.owner || false}
            isActiveSpeaker={activeSpeakerId === participant.session_id}
            className="w-full h-full min-h-[140px]"
          />
        ))}

        {totalCount === 1 && (
          <div className="rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Users className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
            <span className="text-xs font-bold text-slate-400">Classroom Open & Ready</span>
            <span className="text-[10px] text-slate-500 mt-1">Students will appear here automatically when they enter.</span>
          </div>
        )}
      </div>
    </div>
  );
};
