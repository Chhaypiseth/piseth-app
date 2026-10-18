import React, { useState } from 'react';
import { ActivityRecord } from '../types.ts';
import { MapCanvas } from './MapCanvas.tsx';
import { X, Calendar, Clock, Flame, Gauge, Mountain, Footprints, Share2, Trash2, Check } from 'lucide-react';

interface DetailModalProps {
  activity: ActivityRecord | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ activity, onClose, onDelete }) => {
  const [copied, setCopied] = useState(false);

  if (!activity) return null;

  const handleShare = () => {
    const text = `HathBran ហាត់ប្រាណ: Completed ${activity.titleEn} (${activity.titleKm})! Distance: ${activity.distanceKm} km in ${activity.avgPace} pace, burned ${activity.calories} kcal! 🏃‍♂️🇰🇭`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs p-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>{activity.titleEn}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-blue-600 font-khmer">{activity.titleKm}</span>
            </h3>
            <p className="text-xs text-slate-400">{activity.locationName}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4">
          {/* Map Preview */}
          <div className="h-44 rounded-2xl overflow-hidden border border-slate-200">
            <MapCanvas
              coordinates={activity.routeCoordinates}
              activityType={activity.type}
              heightClass="h-full"
              showControls={false}
            />
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{activity.formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activity.timeRange}</span>
            </div>
          </div>

          {/* Metric Grid 2x2 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Distance / ចម្ងាយ</div>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {activity.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Duration / រយៈពេល</div>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {Math.floor(activity.durationSeconds / 60)}:{Math.floor(activity.durationSeconds % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-500" /> Avg Pace / ល្បឿន
              </div>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {activity.avgPace} <span className="text-xs font-normal text-slate-400">/km</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> Calories / កាឡូរី
              </div>
              <div className="text-xl font-black text-slate-800 mt-0.5">
                {activity.calories} <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
            </div>
          </div>

          {/* Additional details: Elevation & Cadence */}
          {(activity.elevationGainMeters || activity.cadenceAvg) && (
            <div className="flex gap-2">
              {activity.elevationGainMeters && (
                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Elevation Gain</span>
                    <span className="text-xs font-bold text-slate-800">+{activity.elevationGainMeters} m</span>
                  </div>
                </div>
              )}
              {activity.cadenceAvg && (
                <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg Cadence</span>
                    <span className="text-xs font-bold text-slate-800">{activity.cadenceAvg} spm</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {activity.notes && (
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/60 text-xs text-slate-600">
              <span className="font-semibold text-blue-900 block mb-0.5">Workout Notes:</span>
              <p className="italic">{activity.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition active:scale-98 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share / ចែករំលែក'}</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this workout from history? / តើអ្នកចង់លុបការហាត់ប្រាណនេះទេ?')) {
                onDelete(activity.id);
                onClose();
              }
            }}
            aria-label="Delete activity"
            className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
