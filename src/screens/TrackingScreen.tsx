import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, RoutePoint, UserSettings } from '../types.ts';
import { MapCanvas } from '../components/MapCanvas.tsx';
import { formatDuration, formatPace, calculateCalories, calculateDistanceKm } from '../utils/geo.ts';
import { sound } from '../utils/audio.ts';
import { samplePhnomPenhPath, sampleOlympicStadiumPath } from '../data/initialActivities.ts';
import { ArrowLeft, Pause, Play, Square, Lock, Unlock, Volume2, VolumeX, FastForward, Activity } from 'lucide-react';

interface TrackingScreenProps {
  activityType: ActivityType;
  settings: UserSettings;
  onStop: (summaryData: {
    type: ActivityType;
    durationSeconds: number;
    distanceKm: number;
    avgPace: string;
    calories: number;
    coordinates: RoutePoint[];
  }) => void;
  onCancel: () => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  activityType,
  settings,
  onStop,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0.0);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState(settings.voiceCues);
  const [coordinates, setCoordinates] = useState<RoutePoint[]>([]);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);

  const prevKmRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  // Activity labels and styling
  const getActivityMeta = () => {
    switch (activityType) {
      case 'walking':
        return {
          titleEn: 'Walking',
          titleKm: 'ដើរ',
          color: 'text-orange-500',
          baseSpeed: 5.2, // km/h
          simPath: samplePhnomPenhPath,
        };
      case 'cycling':
        return {
          titleEn: 'Cycling',
          titleKm: 'ជិះកង់',
          color: 'text-emerald-500',
          baseSpeed: 19.5, // km/h
          simPath: samplePhnomPenhPath,
        };
      case 'running':
      default:
        return {
          titleEn: 'Running',
          titleKm: 'រត់',
          color: 'text-blue-500',
          baseSpeed: 9.8, // km/h
          simPath: sampleOlympicStadiumPath,
        };
    }
  };

  const meta = getActivityMeta();

  // Play start sound on mount
  useEffect(() => {
    sound.playStartSound();
    if (audioEnabled) {
      const startPhrase =
        settings.voiceLanguage === 'km'
          ? `ចាប់ផ្តើម ${meta.titleKm}`
          : `Starting ${meta.titleEn}`;
      sound.speakCue(startPhrase, settings.voiceLanguage === 'km' ? 'km-KH' : 'en-US');
    }

    // Initialize initial coordinate
    const startCoord = meta.simPath[0] || { lat: 11.5621, lng: 104.9312 };
    setCoordinates([startCoord]);
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const nextSec = prev + 1;

        // In simulation mode: progress distance smoothly
        if (settings.trackingMode === 'simulation') {
          // Distance in km per second based on base speed * simSpeed
          const kmPerSec = (meta.baseSpeed / 3600) * simSpeed;
          setDistanceKm((currDist) => {
            const newDist = parseFloat((currDist + kmPerSec).toFixed(3));

            // Check for 1km voice cue milestone
            const wholeKm = Math.floor(newDist);
            if (wholeKm > prevKmRef.current && wholeKm > 0) {
              prevKmRef.current = wholeKm;
              if (audioEnabled) {
                sound.playBeep(880, 'sine', 0.25);
                const cue =
                  settings.voiceLanguage === 'km'
                    ? `បាន ${wholeKm} គីឡូម៉ែត្រហើយ!`
                    : `Kilometer ${wholeKm} completed!`;
                sound.speakCue(cue, settings.voiceLanguage === 'km' ? 'km-KH' : 'en-US');
              }
            }

            return newDist;
          });

          // Animate route coordinates progression
          const pathIndex = Math.min(
            Math.floor((nextSec / 10) * simSpeed) % meta.simPath.length,
            meta.simPath.length - 1
          );
          const currentPt = meta.simPath[pathIndex];
          if (currentPt) {
            setCoordinates((prevCoords) => {
              const last = prevCoords[prevCoords.length - 1];
              if (!last || last.lat !== currentPt.lat || last.lng !== currentPt.lng) {
                return [...prevCoords, currentPt];
              }
              return prevCoords;
            });
          }
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, simSpeed, settings.trackingMode, audioEnabled]);

  // Real GPS tracking listener when enabled
  useEffect(() => {
    if (settings.trackingMode === 'gps' && !isPaused && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPt = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            elevation: pos.coords.altitude || 10,
          };

          setCoordinates((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const addedKm = calculateDistanceKm(last.lat, last.lng, newPt.lat, newPt.lng);
              if (addedKm > 0.005) {
                setDistanceKm((d) => parseFloat((d + addedKm).toFixed(3)));
                return [...prev, newPt];
              }
              return prev;
            }
            return [newPt];
          });

          if (pos.coords.speed) {
            setCurrentSpeedKmh(Math.round(pos.coords.speed * 3.6));
          }
        },
        () => {
          // GPS error or permission denied fallback to simulation
        },
        { enableHighAccuracy: true, maximumAge: 2000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isPaused, settings.trackingMode]);

  const calories = calculateCalories(activityType, settings.userWeightKg, seconds, distanceKm);
  const avgPace = formatPace(seconds, distanceKm);

  const togglePause = () => {
    if (isPaused) {
      sound.playResumeSound();
      setIsPaused(false);
      if (audioEnabled) {
        const text = settings.voiceLanguage === 'km' ? 'បន្តការហាត់ប្រាណ' : 'Workout resumed';
        sound.speakCue(text, settings.voiceLanguage === 'km' ? 'km-KH' : 'en-US');
      }
    } else {
      sound.playPauseSound();
      setIsPaused(true);
      if (audioEnabled) {
        const text = settings.voiceLanguage === 'km' ? 'ផ្អាកការហាត់ប្រាណ' : 'Workout paused';
        sound.speakCue(text, settings.voiceLanguage === 'km' ? 'km-KH' : 'en-US');
      }
    }
  };

  const handleStop = () => {
    sound.playFinishSound();
    onStop({
      type: activityType,
      durationSeconds: Math.max(seconds, 1),
      distanceKm: distanceKm > 0 ? distanceKm : 2.36, // Fallback if stopped immediately
      avgPace: avgPace !== '0:00' ? avgPace : '7:48',
      calories: calories > 0 ? calories : 185,
      coordinates: coordinates.length >= 2 ? coordinates : meta.simPath,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white select-none relative">
      {/* Top Bar */}
      <div className="p-3.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white z-10">
        <button
          onClick={() => {
            if (seconds > 10) {
              if (confirm('Cancel and discard current workout? / តើអ្នកចង់បោះបង់ការហាត់ប្រាណនេះទេ?')) {
                onCancel();
              }
            } else {
              onCancel();
            }
          }}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Center Activity Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Activity className={`w-4 h-4 ${meta.color}`} />
          </div>
          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-800 leading-none">{meta.titleEn}</h2>
            <span className="text-[11px] text-slate-500 font-medium font-khmer">{meta.titleKm}</span>
          </div>
        </div>

        {/* Audio Toggle & Speed modifier */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-label="Toggle Audio Cues"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              audioEnabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative flex-1 mx-3 mt-2 rounded-3xl overflow-hidden border border-slate-200 shadow-xs">
        <MapCanvas
          coordinates={coordinates.length > 0 ? coordinates : meta.simPath}
          activityType={activityType}
          heightClass="h-full"
          isLive={!isPaused}
        />

        {/* Simulation Speed Pill overlay (for quick testing) */}
        {settings.trackingMode === 'simulation' && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-full text-[10px] font-semibold text-slate-700 shadow-xs flex items-center gap-1 border border-slate-200">
            <FastForward className="w-3 h-3 text-orange-500" />
            <button
              onClick={() => setSimSpeed((curr) => (curr === 1 ? 2 : curr === 2 ? 5 : 1))}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Speed: {simSpeed}x
            </button>
          </div>
        )}

        {/* Paused Banner */}
        {isPaused && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <div className="bg-slate-900/90 text-white px-5 py-2 rounded-full font-bold text-xs tracking-wider uppercase shadow-xl flex items-center gap-2 animate-bounce">
              <Pause className="w-3.5 h-3.5 text-orange-400" />
              <span>PAUSED / បានផ្អាក</span>
            </div>
          </div>
        )}
      </div>

      {/* Lock Screen Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold">Screen Locked</h3>
          <p className="text-xs text-slate-300 mt-1 mb-6 text-center">
            Tap button below to unlock controls<br />
            ចុចដើម្បីដោះសោរ
          </p>
          <button
            onClick={() => setIsLocked(false)}
            className="px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center gap-2 active:scale-95 transition"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Screen / ដោះសោរ</span>
          </button>
        </div>
      )}

      {/* Stats Grid (2x2) */}
      <div className="grid grid-cols-2 gap-2.5 px-4 py-3 text-center">
        {/* Distance */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 text-[11px] font-semibold">
            {/* Road icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19L9 5" />
              <path d="M20 19L15 5" />
              <path d="M12 7V9" strokeDasharray="2 2" />
              <path d="M12 13V15" strokeDasharray="2 2" />
            </svg>
            <span>Distance / ចម្ងាយ</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono tabular-nums">
            {distanceKm.toFixed(2)} <span className="text-xs font-medium text-slate-400">km</span>
          </div>
        </div>

        {/* Time */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Time / ពេល</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono tabular-nums">
            {formatDuration(seconds)}
          </div>
        </div>

        {/* Pace */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-sky-600 text-[11px] font-semibold">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 14 4-4" />
              <path d="M3.34 19a10 10 0 1 1 17.32 0" />
            </svg>
            <span>Pace / ល្បឿន</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono tabular-nums">
            {avgPace} <span className="text-xs font-medium text-slate-400">/km</span>
          </div>
        </div>

        {/* Calories */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-orange-500 text-[11px] font-semibold">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span>Calories / កាឡូរី</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono tabular-nums">
            {calories} <span className="text-xs font-medium text-slate-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="px-6 pb-6 pt-1 flex items-center justify-around">
        {/* Lock Button */}
        <button
          onClick={() => setIsLocked(true)}
          className="flex flex-col items-center text-slate-500 hover:text-slate-800 transition cursor-pointer min-w-[56px]"
        >
          <div className="w-12 h-12 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-600 bg-white shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 font-medium">Lock / សោរ</span>
        </button>

        {/* Big Center Pause / Resume Button */}
        <button
          onClick={togglePause}
          className={`w-16 h-16 text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-95 transition-all cursor-pointer ${
            isPaused
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 ring-4 ring-emerald-100'
              : 'bg-[#f97316] hover:bg-orange-600 shadow-orange-500/30 ring-4 ring-orange-100'
          }`}
        >
          {isPaused ? <Play className="w-7 h-7 fill-white ml-0.5" /> : <Pause className="w-7 h-7 fill-white" />}
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          className="flex flex-col items-center text-rose-500 hover:text-rose-600 transition cursor-pointer min-w-[56px]"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-500/30 active:scale-95 transition">
            <Square className="w-5 h-5 fill-white" />
          </div>
          <span className="text-[10px] mt-1 font-bold">Stop / បញ្ឈប់</span>
        </button>
      </div>
    </div>
  );
};
