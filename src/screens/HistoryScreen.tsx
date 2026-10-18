import React, { useState } from 'react';
import { ActivityRecord, ActivityType } from '../types.ts';
import { ArrowLeft, Trash2, Clock, Calendar, Search, Sparkles } from 'lucide-react';

interface HistoryScreenProps {
  activities: ActivityRecord[];
  onBack: () => void;
  onSelectActivity: (activity: ActivityRecord) => void;
  onClearAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  activities,
  onBack,
  onSelectActivity,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter((act) => {
    if (filter !== 'all' && act.type !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName =
        act.titleEn.toLowerCase().includes(q) ||
        act.titleKm.includes(q) ||
        (act.locationName && act.locationName.toLowerCase().includes(q));
      return matchName;
    }
    return true;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'walking':
        return (
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-lg shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="2" />
              <path d="m9 20 3-6 3 2 2 4" />
              <path d="m6 16 3-3 2 1" />
            </svg>
          </div>
        );
      case 'cycling':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18.5" cy="17.5" r="3.5" />
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="15" cy="5" r="1" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </svg>
          </div>
        );
      case 'running':
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-lg shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5" />
              <circle cx="17" cy="4" r="2" />
              <path d="m15 13-3 3-4-2-4 4" />
            </svg>
          </div>
        );
    }
  };

  const formatSecondsToClock = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hrs = Math.floor(totalSecs / 3600);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDistance = filteredActivities.reduce((acc, curr) => acc + curr.distanceKm, 0).toFixed(1);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden bg-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-bold text-slate-800">History</h2>
          <span className="text-xs text-slate-500 font-medium font-khmer">ប្រវត្តិការហាត់</span>
        </div>

        <button
          onClick={() => {
            if (activities.length === 0) return;
            if (confirm('Clear all workout history? / តើអ្នកចង់លុបប្រវត្តិទាំងអស់ទេ?')) {
              onClearAll();
            }
          }}
          disabled={activities.length === 0}
          aria-label="Clear all history"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
            activities.length === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:text-red-500 hover:bg-rose-50 cursor-pointer'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs (Segmented Buttons) */}
      <div className="flex gap-1.5 py-2.5">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All / <span className="font-khmer">ទាំងអស់</span>
        </button>
        <button
          onClick={() => setFilter('walking')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            filter === 'walking'
              ? 'bg-[#f97316] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Walk / <span className="font-khmer">ដើរ</span>
        </button>
        <button
          onClick={() => setFilter('running')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            filter === 'running'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Run / <span className="font-khmer">រត់</span>
        </button>
        <button
          onClick={() => setFilter('cycling')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
            filter === 'cycling'
              ? 'bg-[#16a34a] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Cycle / <span className="font-khmer">កង់</span>
        </button>
      </div>

      {/* Aggregate Stats strip */}
      <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Logged Workouts: <strong className="text-slate-800 font-mono">{filteredActivities.length}</strong></span>
        <span>Filtered Total: <strong className="text-blue-600 font-mono">{totalDistance} km</strong></span>
      </div>

      {/* History List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar pr-0.5">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <Calendar className="w-10 h-10 stroke-[1.5] text-slate-300 mb-2" />
            <p className="text-xs font-medium">No activities recorded yet in this category.</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-khmer">មិនទាន់មានទិន្នន័យការហាត់ប្រាណនៅឡើយទេ។</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="p-3 bg-slate-50 hover:bg-slate-100/90 active:scale-[0.99] rounded-2xl flex items-center justify-between border border-slate-100 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                {getActivityIcon(act.type)}
                <div>
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {act.titleEn}{' '}
                    <span className="font-normal text-xs text-slate-500 font-khmer">
                      {act.titleKm}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{act.formattedDate}</span>
                    {act.locationName && (
                      <>
                        <span>·</span>
                        <span className="truncate max-w-[110px]">{act.locationName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-800 font-mono">
                  {act.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-end gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatSecondsToClock(act.durationSeconds)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
