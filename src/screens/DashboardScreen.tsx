import React, { useState } from 'react';
import { ActivityRecord, ActivityType } from '../types.ts';
import {
  TrendingUp,
  Flame,
  Clock,
  Award,
  Calendar,
  Trophy,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface DashboardScreenProps {
  activities: ActivityRecord[];
  onStartActivity: (type: ActivityType) => void;
  onViewHistory: () => void;
  onSelectActivity: (activity: ActivityRecord) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  activities,
  onStartActivity,
  onViewHistory,
  onSelectActivity,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Calculations
  const totalKm = activities.reduce((acc, a) => acc + a.distanceKm, 0);
  const totalCalories = activities.reduce((acc, a) => acc + a.calories, 0);
  const totalSeconds = activities.reduce((acc, a) => acc + a.durationSeconds, 0);
  const workoutCount = activities.length;

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  // Weekly Goal target
  const weeklyGoalKm = 25.0;
  const goalProgressPercent = Math.min(Math.round((totalKm / weeklyGoalKm) * 100), 100);

  // Type Breakdown
  const walkKm = activities.filter((a) => a.type === 'walking').reduce((acc, a) => acc + a.distanceKm, 0);
  const runKm = activities.filter((a) => a.type === 'running').reduce((acc, a) => acc + a.distanceKm, 0);
  const cycleKm = activities.filter((a) => a.type === 'cycling').reduce((acc, a) => acc + a.distanceKm, 0);

  // Personal Bests
  const longestDistance = activities.length > 0 ? Math.max(...activities.map((a) => a.distanceKm)) : 0;
  const maxCalories = activities.length > 0 ? Math.max(...activities.map((a) => a.calories)) : 0;
  const bestPaceRecord = activities.find((a) => a.type === 'running') || activities[0];

  // Days of week mockup data
  const days = [
    { day: 'Mon', km: 0, label: 'ចន្ទ' },
    { day: 'Tue', km: 3.0, label: 'អង្គារ' },
    { day: 'Wed', km: 0, label: 'ពុធ' },
    { day: 'Thu', km: 12.5, label: 'ព្រហ' },
    { day: 'Fri', km: 0, label: 'សុក្រ' },
    { day: 'Sat', km: 5.2, label: 'សៅរ៍' },
    { day: 'Sun', km: 2.1, label: 'អាទិត្យ' },
  ];
  const maxDayKm = Math.max(...days.map((d) => d.km), 14);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar bg-slate-50/50 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 bg-white -mx-4 px-4 pt-1">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            Dashboard <span className="font-normal text-slate-400">/</span>{' '}
            <span className="font-khmer text-blue-600">ផ្ទាំងគ្រប់គ្រង</span>
          </h2>
          <p className="text-[11px] text-slate-400">Fitness Analytics & Personal Records</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-2.5 py-1 rounded-lg transition ${
              selectedPeriod === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-2.5 py-1 rounded-lg transition ${
              selectedPeriod === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="space-y-3.5 my-3">
        {/* Weekly Goal Progress Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-3xl p-4 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-blue-100 font-medium font-khmer block leading-none">
                  គោលដៅប្រចាំសប្តាហ៍
                </span>
                <span className="text-sm font-bold">Weekly Distance Goal</span>
              </div>
            </div>
            <span className="text-lg font-black font-mono">{goalProgressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-3 p-0.5 overflow-hidden my-2">
            <div
              className="bg-gradient-to-r from-amber-300 to-emerald-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalProgressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-blue-100 font-mono mt-1">
            <span>{totalKm.toFixed(1)} km logged</span>
            <span>Target: {weeklyGoalKm} km</span>
          </div>
        </div>

        {/* 4 Core Stat Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Distance */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Distance / ចម្ងាយ</span>
              <p className="text-lg font-black text-slate-800 font-mono leading-tight">
                {totalKm.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Active Time / ពេល</span>
              <p className="text-lg font-black text-slate-800 font-mono leading-tight">
                {totalHours}h {totalMins}m
              </p>
            </div>
          </div>

          {/* Calories */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Burned / កាឡូរី</span>
              <p className="text-lg font-black text-slate-800 font-mono leading-tight">
                {totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
              </p>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Sessions / លើក</span>
              <p className="text-lg font-black text-slate-800 font-mono leading-tight">
                {workoutCount} <span className="text-xs font-normal text-slate-400">times</span>
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Weekly Activity Volume</h3>
              <span className="text-[10px] text-slate-400 font-khmer">សកម្មភាពប្រចាំថ្ងៃក្នុងសប្តាហ៍</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600">
              Avg: {(totalKm / 7).toFixed(1)} km/day
            </span>
          </div>

          {/* Bar Columns */}
          <div className="flex items-end justify-between h-28 pt-2 px-1 gap-2 border-b border-slate-100 pb-2">
            {days.map((item) => {
              const heightPercent = item.km > 0 ? Math.max((item.km / maxDayKm) * 100, 15) : 8;
              const hasActivity = item.km > 0;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {hasActivity && (
                    <span className="text-[9px] font-mono font-bold text-slate-600 opacity-80 group-hover:opacity-100">
                      {item.km}
                    </span>
                  )}
                  <div className="w-full max-w-[24px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '70px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        hasActivity
                          ? 'bg-gradient-to-t from-blue-600 to-sky-400 group-hover:from-blue-500 group-hover:to-sky-300'
                          : 'bg-slate-200/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Distribution Breakdown */}
        <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 mb-2.5">
            Sport Split / <span className="font-khmer font-normal">ចំណាត់ថ្នាក់ប្រភេទកីឡា</span>
          </h3>

          <div className="space-y-2">
            {/* Run */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Run / រត់
                </span>
                <span className="font-mono text-slate-500">{runKm.toFixed(1)} km ({totalKm > 0 ? Math.round((runKm / totalKm) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalKm > 0 ? (runKm / totalKm) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Cycle */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cycle / ជិះកង់
                </span>
                <span className="font-mono text-slate-500">{cycleKm.toFixed(1)} km ({totalKm > 0 ? Math.round((cycleKm / totalKm) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalKm > 0 ? (cycleKm / totalKm) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Walk */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Walk / ដើរ
                </span>
                <span className="font-mono text-slate-500">{walkKm.toFixed(1)} km ({totalKm > 0 ? Math.round((walkKm / totalKm) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${totalKm > 0 ? (walkKm / totalKm) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Best Cabinet */}
        <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800">
              Personal Records / <span className="font-khmer font-normal">កំណត់ត្រាឆ្នើមផ្ទាល់ខ្លួន</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-[10px] text-amber-700 font-medium block">Longest Distance</span>
              <p className="text-sm font-black text-amber-950 font-mono mt-0.5">{longestDistance} km</p>
            </div>
            <div className="p-2.5 bg-blue-50/60 rounded-2xl border border-blue-100">
              <span className="text-[10px] text-blue-700 font-medium block">Best Run Pace</span>
              <p className="text-sm font-black text-blue-950 font-mono mt-0.5">{bestPaceRecord?.avgPace || '7:48'} /km</p>
            </div>
            <div className="p-2.5 bg-orange-50/60 rounded-2xl border border-orange-100">
              <span className="text-[10px] text-orange-700 font-medium block">Highest Burn</span>
              <p className="text-sm font-black text-orange-950 font-mono mt-0.5">{maxCalories} kcal</p>
            </div>
          </div>
        </div>

        {/* Quick Activity Launcher Strip */}
        <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold">Ready to break a sweat?</h4>
            <span className="text-[11px] text-slate-300 font-khmer">ត្រៀមខ្លួនហាត់ប្រាណថ្ងៃនេះហើយឬនៅ?</span>
          </div>
          <button
            onClick={() => onStartActivity('running')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <span>Start Run</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
