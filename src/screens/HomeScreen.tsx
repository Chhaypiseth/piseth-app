import React from 'react';
import { ActivityType, ActivityRecord } from '../types.ts';
import { ChevronRight, Award, Flame, TrendingUp, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  onStartActivity: (type: ActivityType) => void;
  recentActivities: ActivityRecord[];
  onOpenHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartActivity,
  recentActivities,
  onOpenHistory,
}) => {
  // Calculate this week's total distance
  const totalKm = recentActivities
    .reduce((sum, act) => sum + act.distanceKm, 0)
    .toFixed(1);

  const totalCalories = recentActivities.reduce((sum, act) => sum + act.calories, 0);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar bg-white">
      {/* Top Section: Mascot & Branding */}
      <div className="flex flex-col items-center text-center mt-2">
        {/* Mascot / Logo App Icon */}
        <div className="w-32 h-32 rounded-3xl p-1.5 shadow-xl shadow-blue-500/25 relative overflow-hidden group bg-gradient-to-tr from-sky-400 via-blue-500 to-blue-700 flex items-center justify-center">
          <img
            src="/src/assets/images/hathbran_app_icon_1792309373014.jpg"
            alt="HathBran App Icon - ហាត់ប្រាណ"
            className="w-full h-full object-cover rounded-[22px] transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Bilingual Title */}
        <h1 className="text-3xl font-extrabold text-slate-800 mt-4 leading-tight">
          <span className="font-khmer text-2xl font-bold tracking-tight text-slate-900 block mb-0.5">
            ហាត់ប្រាណ
          </span>
          <span className="text-blue-600 font-black tracking-tight text-3xl">HathBran</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mt-1">
          Khmer Exercise Tracker · កម្មវិធីតាមដានការហាត់ប្រាណ
        </p>

        {/* Weekly Stats Micro-Strip */}
        <div className="w-full mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block leading-tight">Total Distance</span>
              <span className="font-extrabold text-slate-800 text-sm font-mono">{totalKm} km</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2 pr-1">
            <div className="w-7 h-7 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block leading-tight">Burned Calories</span>
              <span className="font-extrabold text-slate-800 text-sm font-mono">{totalCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Walk, Run, Cycle) */}
      <div className="space-y-3.5 my-5">
        {/* Walk Button */}
        <button
          onClick={() => onStartActivity('walking')}
          className="w-full bg-[#f97316] hover:bg-orange-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md shadow-orange-500/25 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {/* Walking icon */}
              <svg
                className="w-6 h-6 stroke-[2.2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="2" />
                <path d="m9 20 3-6 3 2 2 4" />
                <path d="m6 16 3-3 2 1" />
                <path d="M14 9l-2 2-3-1-3 3" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold leading-tight">Walk</div>
              <div className="text-sm font-medium text-orange-100 font-khmer">ដើរ</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 mr-1" />
        </button>

        {/* Run Button */}
        <button
          onClick={() => onStartActivity('running')}
          className="w-full bg-[#0284c7] hover:bg-sky-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md shadow-sky-500/25 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {/* Running icon */}
              <svg
                className="w-6 h-6 stroke-[2.2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5" />
                <circle cx="17" cy="4" r="2" />
                <path d="m15 13-3 3-4-2-4 4" />
                <path d="M4 17l4.5-2.5 3.5 1.5 2-4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold leading-tight">Run</div>
              <div className="text-sm font-medium text-sky-100 font-khmer">រត់</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 mr-1" />
        </button>

        {/* Cycle Button */}
        <button
          onClick={() => onStartActivity('cycling')}
          className="w-full bg-[#16a34a] hover:bg-green-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md shadow-green-500/25 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {/* Biking icon */}
              <svg
                className="w-6 h-6 stroke-[2.2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold leading-tight">Cycle</div>
              <div className="text-sm font-medium text-emerald-100 font-khmer">ជិះកង់</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 mr-1" />
        </button>
      </div>

      {/* Motivational Khmer Proverb / Fitness Tip */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100/60 rounded-2xl p-3 text-center mb-2">
        <div className="flex items-center justify-center gap-1.5 text-blue-600 text-xs font-semibold mb-0.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-khmer">សុខភាពគឺជាទ្រព្យសម្បត្តិ</span>
        </div>
        <p className="text-[11px] text-slate-500">
          "Health is greatest wealth. Just 20 minutes a day boosts energy & longevity."
        </p>
      </div>
    </div>
  );
};
