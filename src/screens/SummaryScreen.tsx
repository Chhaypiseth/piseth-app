import React, { useState, useEffect } from 'react';
import { ActivityType, RoutePoint, ActivityRecord } from '../types.ts';
import { MapCanvas } from '../components/MapCanvas.tsx';
import confetti from 'canvas-confetti';
import { ArrowLeft, Check, Flame, Gauge, Clock, Award, Smile, ThumbsUp, Zap } from 'lucide-react';

interface SummaryData {
  type: ActivityType;
  durationSeconds: number;
  distanceKm: number;
  avgPace: string;
  calories: number;
  coordinates: RoutePoint[];
}

interface SummaryScreenProps {
  data: SummaryData;
  onSave: (record: ActivityRecord) => void;
  onDiscard: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  data,
  onSave,
  onDiscard,
}) => {
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<'great' | 'good' | 'tired' | 'hard'>('great');
  const [locationName, setLocationName] = useState('Phnom Penh Riverside Promenade');
  const [locationNameKm, setLocationNameKm] = useState('ផ្លូវមាត់ទន្លេស៊ីសុវត្ថិ');

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f97316', '#16a34a', '#38bdf8'],
      });
    } catch {
      // Ignore if confetti fails
    }
  }, []);

  const getActivityDetails = () => {
    switch (data.type) {
      case 'walking':
        return {
          titleEn: 'Walking',
          titleKm: 'ដើរ',
          iconBg: 'bg-orange-50 text-orange-500',
        };
      case 'cycling':
        return {
          titleEn: 'Cycling',
          titleKm: 'ជិះកង់',
          iconBg: 'bg-emerald-50 text-emerald-500',
        };
      case 'running':
      default:
        return {
          titleEn: 'Running',
          titleKm: 'រត់',
          iconBg: 'bg-rose-50 text-rose-500',
        };
    }
  };

  const details = getActivityDetails();

  // Format today's date
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const startTimeStr = new Date(Date.now() - data.durationSeconds * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const endTimeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const timeRange = `${startTimeStr} - ${endTimeStr}`;

  const formatSecondsToClock = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(totalSecs / 3600);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const newRecord: ActivityRecord = {
      id: `act-${Date.now()}`,
      type: data.type,
      titleEn: details.titleEn,
      titleKm: details.titleKm,
      date: now.toISOString().split('T')[0],
      formattedDate,
      timeRange,
      durationSeconds: data.durationSeconds,
      distanceKm: parseFloat(data.distanceKm.toFixed(2)),
      avgPace: data.avgPace,
      avgPaceSeconds: 480,
      calories: data.calories,
      locationName,
      locationNameKm,
      notes: notes.trim() || undefined,
      feeling,
      elevationGainMeters: Math.round(data.distanceKm * 4),
      cadenceAvg: data.type === 'cycling' ? 82 : 160,
      routeCoordinates: data.coordinates,
    };

    onSave(newRecord);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar bg-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={onDiscard}
          aria-label="Discard activity"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-bold text-slate-800">Activity Summary</h2>
          <span className="text-xs text-slate-500 font-medium font-khmer">សង្ខេបការហាត់ប្រាណ</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Map Snapshot */}
      <div className="h-44 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative my-2 shadow-xs">
        <MapCanvas
          coordinates={data.coordinates}
          activityType={data.type}
          heightClass="h-full"
          showControls={false}
        />
      </div>

      {/* Activity Info Row */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${details.iconBg} flex items-center justify-center text-xl shadow-xs`}>
            {data.type === 'walking' && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="2" />
                <path d="m9 20 3-6 3 2 2 4" />
                <path d="m6 16 3-3 2 1" />
              </svg>
            )}
            {data.type === 'running' && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5" />
                <circle cx="17" cy="4" r="2" />
                <path d="m15 13-3 3-4-2-4 4" />
              </svg>
            )}
            {data.type === 'cycling' && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">{details.titleEn}</h3>
            <p className="text-xs text-slate-500 font-medium font-khmer">{details.titleKm}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-700">{formattedDate}</div>
          <div className="text-[11px] text-slate-400 font-mono">{timeRange}</div>
        </div>
      </div>

      {/* Stats Summary 2x2 */}
      <div className="grid grid-cols-2 gap-2.5 my-2">
        {/* Distance */}
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19L9 5" />
              <path d="M20 19L15 5" />
              <path d="M12 7V9" strokeDasharray="2 2" />
              <path d="M12 13V15" strokeDasharray="2 2" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Distance</span>
            <p className="text-base font-extrabold text-slate-800 font-mono leading-tight">
              {data.distanceKm.toFixed(2)} <span className="text-xs font-normal text-slate-400">km</span>
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Time</span>
            <p className="text-base font-extrabold text-slate-800 font-mono leading-tight">
              {formatSecondsToClock(data.durationSeconds)}
            </p>
          </div>
        </div>

        {/* Pace */}
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-100/70 text-sky-600 flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Avg. Pace</span>
            <p className="text-base font-extrabold text-slate-800 font-mono leading-tight">
              {data.avgPace} <span className="text-xs font-normal text-slate-400">/km</span>
            </p>
          </div>
        </div>

        {/* Calories */}
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Calories</span>
            <p className="text-base font-extrabold text-slate-800 font-mono leading-tight">
              {data.calories} <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Feeling / Effort selector */}
      <div className="my-1 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
        <span className="text-[11px] text-slate-500 font-medium block mb-1.5 font-khmer">
          តើអ្នកមានអារម្មណ៍យ៉ាងណា? How did it feel?
        </span>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFeeling('great')}
            className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition cursor-pointer ${
              feeling === 'great'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🤩</span>
            <span className="text-[10px] font-khmer">ល្អណាស់</span>
          </button>
          <button
            type="button"
            onClick={() => setFeeling('good')}
            className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition cursor-pointer ${
              feeling === 'good'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>😊</span>
            <span className="text-[10px] font-khmer">ធម្មតា</span>
          </button>
          <button
            type="button"
            onClick={() => setFeeling('tired')}
            className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition cursor-pointer ${
              feeling === 'tired'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🥵</span>
            <span className="text-[10px] font-khmer">ហត់</span>
          </button>
          <button
            type="button"
            onClick={() => setFeeling('hard')}
            className={`py-1.5 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition cursor-pointer ${
              feeling === 'hard'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>💪</span>
            <span className="text-[10px] font-khmer">ខ្លាំង</span>
          </button>
        </div>
      </div>

      {/* Notes Input */}
      <div className="my-1">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes / កំណត់ចំណាំ (e.g. Great morning tempo)"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Save Button */}
      <div className="pt-2 pb-1">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm">Save Activity / <span className="font-khmer font-bold">រក្សាទុក</span></span>
        </button>
      </div>
    </div>
  );
};
