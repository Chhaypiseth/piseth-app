import React from 'react';
import { Home, LayoutDashboard, BarChart2, MapPin, User, Settings } from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'history' | 'routes' | 'author' | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      labelEn: 'Home',
      labelKm: 'ផ្ទះ',
      icon: Home,
    },
    {
      id: 'dashboard' as NavTab,
      labelEn: 'Dashboard',
      labelKm: 'គ្រប់គ្រង',
      icon: LayoutDashboard,
    },
    {
      id: 'history' as NavTab,
      labelEn: 'History',
      labelKm: 'ប្រវត្តិ',
      icon: BarChart2,
    },
    {
      id: 'routes' as NavTab,
      labelEn: 'Map',
      labelKm: 'ផែនទី',
      icon: MapPin,
    },
    {
      id: 'author' as NavTab,
      labelEn: 'Author',
      labelKm: 'អ្នកបង្កើត',
      icon: User,
    },
  ];

  return (
    <nav className="pt-2 pb-1 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex justify-around items-center select-none shrink-0 z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center py-1 px-2 transition-colors duration-150 min-w-[54px] cursor-pointer ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-4.5 h-4.5 transition-transform duration-150 ${isActive ? 'scale-110 stroke-[2.2]' : ''}`} />
            <span className="text-[9px] mt-1 tracking-tight leading-tight whitespace-nowrap">
              {tab.labelEn} / <span className="font-khmer">{tab.labelKm}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
};
