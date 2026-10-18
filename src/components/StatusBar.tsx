import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('10:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-2 px-6 pb-1 flex justify-between items-center text-xs font-semibold text-slate-800 z-30 select-none bg-white">
      <span className="font-mono tabular-nums tracking-tight">{time}</span>
      {/* Dynamic Island / Notch */}
      <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-1 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
        <div className="w-2 h-2 rounded-full bg-blue-900/60" />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-700">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4" />
      </div>
    </div>
  );
};
