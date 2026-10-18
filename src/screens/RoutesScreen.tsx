import React, { useState } from 'react';
import { WorkoutRoutePreset, ActivityType } from '../types.ts';
import { workoutRoutePresets } from '../data/initialActivities.ts';
import { MapCanvas } from '../components/MapCanvas.tsx';
import { ArrowLeft, Play, Navigation, MapPin, Compass, Mountain, Check } from 'lucide-react';

interface RoutesScreenProps {
  onBack: () => void;
  onSelectRouteToStart: (preset: WorkoutRoutePreset) => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({
  onBack,
  onSelectRouteToStart,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<WorkoutRoutePreset>(workoutRoutePresets[0]);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar bg-white select-none">
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
          <h2 className="text-base font-bold text-slate-800">Popular Routes</h2>
          <span className="text-xs text-slate-500 font-medium font-khmer">ផែនទីគន្លងហាត់ប្រាណ</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Interactive Map Preview of Selected Route */}
      <div className="my-2 h-44 rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative">
        <MapCanvas
          coordinates={selectedRoute.coordinates}
          activityType={selectedRoute.recommendedType}
          heightClass="h-full"
          showControls={true}
        />
        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-sky-400" />
          <span>{selectedRoute.city} · <span className="font-khmer">{selectedRoute.cityKm}</span></span>
        </div>
      </div>

      {/* Selected Route Info Strip */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 my-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {selectedRoute.titleEn}
            </h3>
            <p className="text-xs text-blue-600 font-medium font-khmer mt-0.5">
              {selectedRoute.titleKm}
            </p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-800 font-mono">
              {selectedRoute.distanceKm} km
            </span>
            <span className="text-[10px] text-slate-400 block">
              +{selectedRoute.elevationGain}m gain
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
          {selectedRoute.descriptionEn}
        </p>

        {/* Start Button */}
        <button
          onClick={() => onSelectRouteToStart(selectedRoute)}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-98 transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Start Workout on this Route / ចាប់ផ្តើមរត់</span>
        </button>
      </div>

      {/* Route List Selection */}
      <div className="mt-2 space-y-2">
        <span className="text-xs font-semibold text-slate-600 block px-1">
          Explore Trails / គន្លងពេញនិយម
        </span>

        {workoutRoutePresets.map((route) => {
          const isCurrent = route.id === selectedRoute.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                isCurrent
                  ? 'bg-blue-50/70 border-blue-200 ring-1 ring-blue-400/40'
                  : 'bg-white border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    route.recommendedType === 'walking'
                      ? 'bg-orange-100 text-orange-600'
                      : route.recommendedType === 'cycling'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {route.recommendedType === 'walking' ? 'Walk' : route.recommendedType === 'cycling' ? 'Bike' : 'Run'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">
                    {route.titleEn}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-khmer">
                    {route.titleKm}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-800 font-mono">
                  {route.distanceKm} km
                </div>
                <span className="text-[10px] text-slate-400 font-khmer">
                  {route.difficultyKm}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
