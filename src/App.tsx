/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivityType, ActivityRecord, UserSettings, WorkoutRoutePreset } from './types.ts';
import { initialActivities } from './data/initialActivities.ts';
import { StatusBar } from './components/StatusBar.tsx';
import { Navigation, NavTab } from './components/Navigation.tsx';
import { DetailModal } from './components/DetailModal.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { TrackingScreen } from './screens/TrackingScreen.tsx';
import { SummaryScreen } from './screens/SummaryScreen.tsx';
import { HistoryScreen } from './screens/HistoryScreen.tsx';
import { RoutesScreen } from './screens/RoutesScreen.tsx';
import { AuthorScreen } from './screens/AuthorScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_ACTIVITIES = 'hathbran_activities_v1';
const STORAGE_KEY_SETTINGS = 'hathbran_settings_v1';

const defaultSettings: UserSettings = {
  primaryLanguage: 'bilingual',
  voiceCues: true,
  voiceLanguage: 'km',
  unitSystem: 'metric',
  userWeightKg: 65,
  trackingMode: 'simulation',
  autoPause: false,
};

export type ScreenType =
  | 'home'
  | 'dashboard'
  | 'tracking'
  | 'summary'
  | 'history'
  | 'routes'
  | 'author'
  | 'settings';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [activeTrackingType, setActiveTrackingType] = useState<ActivityType>('running');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true); // true = phone mockup, false = responsive full width
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent activities state
  const [activities, setActivities] = useState<ActivityRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialActivities;
  });

  // Persistent settings state
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return defaultSettings;
  });

  // Summary payload after stopping tracking
  const [summaryData, setSummaryData] = useState<{
    type: ActivityType;
    durationSeconds: number;
    distanceKm: number;
    avgPace: string;
    calories: number;
    coordinates: Array<{ lat: number; lng: number }>;
  }>({
    type: 'running',
    durationSeconds: 1105, // 18:25
    distanceKm: 2.36,
    avgPace: '7:48',
    calories: 185,
    coordinates: [],
  });

  // Selected activity for detail popup
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch {
      // storage quota or error
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartActivity = (type: ActivityType) => {
    setActiveTrackingType(type);
    setActiveScreen('tracking');
  };

  const handleStopTracking = (data: {
    type: ActivityType;
    durationSeconds: number;
    distanceKm: number;
    avgPace: string;
    calories: number;
    coordinates: Array<{ lat: number; lng: number }>;
  }) => {
    setSummaryData(data);
    setActiveScreen('summary');
  };

  const handleSaveActivity = (newRecord: ActivityRecord) => {
    setActivities((prev) => [newRecord, ...prev]);
    showToast('Activity Saved! / បានរក្សាទុកការហាត់ប្រាណ!');
    setActiveScreen('history');
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Activity deleted / បានលុបការហាត់ប្រាណ');
  };

  const handleClearAllHistory = () => {
    setActivities([]);
    showToast('All history cleared / បានលុបប្រវត្តិទាំងអស់');
  };

  const handleResetData = () => {
    setActivities(initialActivities);
    setSettings(defaultSettings);
    showToast('Demo data restored / បានកំណត់ទិន្នន័យឡើងវិញ');
  };

  const handleSelectRouteToStart = (preset: WorkoutRoutePreset) => {
    setActiveTrackingType(preset.recommendedType);
    setSummaryData((prev) => ({
      ...prev,
      type: preset.recommendedType,
      coordinates: preset.coordinates,
    }));
    setActiveScreen('tracking');
  };

  // Map active screen to bottom nav tab
  const getNavTab = (): NavTab => {
    if (activeScreen === 'dashboard') return 'dashboard';
    if (activeScreen === 'history') return 'history';
    if (activeScreen === 'routes') return 'routes';
    if (activeScreen === 'author') return 'author';
    if (activeScreen === 'settings') return 'settings';
    return 'home';
  };

  const handleNavSelect = (tab: NavTab) => {
    setActiveScreen(tab);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Prototype Switcher & Viewport Toolbar */}
      <header className="mb-3 max-w-2xl w-full flex flex-wrap items-center justify-between gap-2 bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-lg text-xs z-30">
        {/* Screen switcher buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveScreen('home')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            1. Home
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            2. Dashboard
          </button>
          <button
            onClick={() => setActiveScreen('tracking')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'tracking'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            3. Tracking
          </button>
          <button
            onClick={() => setActiveScreen('summary')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'summary'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            4. Summary
          </button>
          <button
            onClick={() => setActiveScreen('history')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            5. History
          </button>
          <button
            onClick={() => setActiveScreen('routes')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'routes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            6. Map
          </button>
          <button
            onClick={() => setActiveScreen('author')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'author'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            7. Author
          </button>
          <button
            onClick={() => setActiveScreen('settings')}
            className={`px-2.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeScreen === 'settings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            8. Settings
          </button>
        </div>

        {/* Viewport Frame Mode Toggle */}
        <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            title="Toggle between Phone Frame & Full Responsive View"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Expand View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Mobile Frame or Full Responsive Container */}
      <main
        className={`relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
          deviceFrameMode
            ? 'w-[390px] h-[844px] rounded-[46px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
            : 'w-full max-w-md h-[844px] sm:rounded-3xl border border-slate-700/40 shadow-2xl'
        }`}
      >
        {/* Status Bar (Always present for authentic mobile app feel) */}
        <StatusBar />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeScreen === 'home' && (
            <HomeScreen
              onStartActivity={handleStartActivity}
              recentActivities={activities}
              onOpenHistory={() => setActiveScreen('history')}
            />
          )}

          {activeScreen === 'dashboard' && (
            <DashboardScreen
              activities={activities}
              onStartActivity={handleStartActivity}
              onViewHistory={() => setActiveScreen('history')}
              onSelectActivity={(act) => setSelectedActivity(act)}
            />
          )}

          {activeScreen === 'tracking' && (
            <TrackingScreen
              activityType={activeTrackingType}
              settings={settings}
              onStop={handleStopTracking}
              onCancel={() => setActiveScreen('home')}
            />
          )}

          {activeScreen === 'summary' && (
            <SummaryScreen
              data={summaryData}
              onSave={handleSaveActivity}
              onDiscard={() => setActiveScreen('home')}
            />
          )}

          {activeScreen === 'history' && (
            <HistoryScreen
              activities={activities}
              onBack={() => setActiveScreen('home')}
              onSelectActivity={(act) => setSelectedActivity(act)}
              onClearAll={handleClearAllHistory}
            />
          )}

          {activeScreen === 'routes' && (
            <RoutesScreen
              onBack={() => setActiveScreen('home')}
              onSelectRouteToStart={handleSelectRouteToStart}
            />
          )}

          {activeScreen === 'author' && (
            <AuthorScreen onBack={() => setActiveScreen('home')} />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={setSettings}
              onResetData={handleResetData}
              onBack={() => setActiveScreen('home')}
            />
          )}
        </div>

        {/* Bottom Navigation (Visible on Home, Dashboard, History, Routes, Author, Settings) */}
        {activeScreen !== 'tracking' && activeScreen !== 'summary' && (
          <Navigation currentTab={getNavTab()} onSelectTab={handleNavSelect} />
        )}

        {/* iOS / Mobile Home Indicator Line */}
        <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto my-1.5 opacity-30 shrink-0" />
      </main>

      {/* Activity Detail Modal */}
      <DetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onDelete={handleDeleteActivity}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 bg-slate-900/95 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
