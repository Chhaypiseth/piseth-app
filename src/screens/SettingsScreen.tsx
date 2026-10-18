import React, { useState } from 'react';
import { UserSettings } from '../types.ts';
import { sound } from '../utils/audio.ts';
import { ArrowLeft, Volume2, Globe, Scale, Compass, RotateCcw, Info, Check, Download } from 'lucide-react';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onBack,
}) => {
  const [testVoicePlaying, setTestVoicePlaying] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const testVoiceCue = () => {
    setTestVoicePlaying(true);
    sound.playStartSound();
    const phrase =
      settings.voiceLanguage === 'km'
        ? 'សួស្តី! នេះជាសំឡេងសាកល្បងពីកម្មវិធីហាត់ប្រាណ HathBran'
        : 'Hello! This is an audio cue test from HathBran Exercise Tracker';
    sound.speakCue(phrase, settings.voiceLanguage === 'km' ? 'km-KH' : 'en-US');
    setTimeout(() => setTestVoicePlaying(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset workout history to initial sample records? / កំណត់ទិន្នន័យគំរូឡើងវិញ?')) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

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
          <h2 className="text-base font-bold text-slate-800">Settings</h2>
          <span className="text-xs text-slate-500 font-medium font-khmer">ការកំណត់កម្មវិធី</span>
        </div>
        <div className="w-9" />
      </div>

      <div className="space-y-4 my-3 flex-1">
        {/* Language Preference */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Display Language / ភាសាបង្ហាញ</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bilingual' as const, label: 'Bilingual / ទ្វេភាសា' },
              { id: 'km' as const, label: 'ភាសាខ្មែរ' },
              { id: 'en' as const, label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => onUpdateSettings({ ...settings, primaryLanguage: lang.id })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                  settings.primaryLanguage === lang.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Cues & Voice Coaching */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Voice Cues & Audio</span>
                <span className="text-[10px] text-slate-400 font-khmer">សំឡេងប្រាប់ចម្ងាយ និងល្បឿន</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.voiceCues}
                onChange={(e) => onUpdateSettings({ ...settings, voiceCues: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.voiceCues && (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateSettings({ ...settings, voiceLanguage: 'km' })}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                    settings.voiceLanguage === 'km'
                      ? 'bg-blue-600 text-white font-khmer'
                      : 'bg-white text-slate-600 border border-slate-200 font-khmer'
                  }`}
                >
                  ខ្មែរ (Khmer)
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, voiceLanguage: 'en' })}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                    settings.voiceLanguage === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  English
                </button>
              </div>

              <button
                onClick={testVoiceCue}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                {testVoicePlaying ? 'Testing...' : 'Test Sound 🔊'}
              </button>
            </div>
          )}
        </div>

        {/* GPS vs Simulation Mode */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
            <Compass className="w-4 h-4 text-emerald-600" />
            <div>
              <span>Tracking Engine Mode</span>
              <span className="text-[10px] text-slate-400 block font-normal">
                Use Simulation for instant preview or GPS for outdoor workout
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => onUpdateSettings({ ...settings, trackingMode: 'simulation' })}
              className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                settings.trackingMode === 'simulation'
                  ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">Smart Simulation</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Automated realistic runner route</div>
            </button>

            <button
              onClick={() => onUpdateSettings({ ...settings, trackingMode: 'gps' })}
              className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                settings.trackingMode === 'gps'
                  ? 'bg-blue-50/80 border-blue-500 text-blue-900 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <div className="text-xs font-bold">Device Live GPS</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Real-world browser geolocation</div>
            </button>
          </div>
        </div>

        {/* User Weight (For Accurate Calorie Calculations) */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>User Weight / ទម្ងន់</span>
            </div>
            <span className="text-sm font-black text-slate-800 font-mono">
              {settings.userWeightKg} kg
            </span>
          </div>

          <input
            type="range"
            min="40"
            max="120"
            value={settings.userWeightKg}
            onChange={(e) =>
              onUpdateSettings({ ...settings, userWeightKg: parseInt(e.target.value) || 65 })
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>40 kg</span>
            <span>65 kg (default)</span>
            <span>120 kg</span>
          </div>
        </div>

        {/* Reset Data */}
        <div className="pt-1">
          <button
            onClick={handleReset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {resetSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <RotateCcw className="w-4 h-4 text-slate-500" />}
            <span>{resetSuccess ? 'Data Reset Successfully!' : 'Reset Sample Workout Records'}</span>
          </button>
        </div>

        {/* About Applet Card */}
        <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/60 text-center">
          <div className="text-xs font-bold text-slate-800">ហាត់ប្រាណ · HathBran v1.0</div>
          <p className="text-[10px] text-slate-500 mt-1">
            Empowering Cambodian community health with bilingual GPS exercise tracking, real-time pace metrics, and interactive maps.
          </p>
        </div>
      </div>
    </div>
  );
};
