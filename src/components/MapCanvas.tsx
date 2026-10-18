import React, { useState } from 'react';
import { RoutePoint, ActivityType } from '../types.ts';
import { ZoomIn, ZoomOut, Locate, Layers, Navigation } from 'lucide-react';

interface MapCanvasProps {
  coordinates?: RoutePoint[];
  activityType?: ActivityType;
  heightClass?: string;
  isLive?: boolean;
  onRecenter?: () => void;
  showControls?: boolean;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  coordinates = [],
  activityType = 'running',
  heightClass = 'h-64',
  isLive = false,
  onRecenter,
  showControls = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'night'>('streets');
  const [showTraffic, setShowTraffic] = useState(false);

  // Dynamic route stroke color based on activity
  const getStrokeColor = () => {
    switch (activityType) {
      case 'walking':
        return '#f97316'; // Orange
      case 'cycling':
        return '#16a34a'; // Green
      case 'running':
      default:
        return '#2563eb'; // Blue
    }
  };

  const getPulsingColor = () => {
    switch (activityType) {
      case 'walking':
        return '#ea580c';
      case 'cycling':
        return '#15803d';
      case 'running':
      default:
        return '#f97316';
    }
  };

  // Convert GPS coordinates into normalized SVG viewport coordinates (0-350, 0-260)
  const getPathData = () => {
    if (!coordinates || coordinates.length < 2) {
      // Default fallback mockup curve
      return "M 60 210 Q 110 180 120 140 T 170 90 T 230 45";
    }

    const minLat = Math.min(...coordinates.map((c) => c.lat));
    const maxLat = Math.max(...coordinates.map((c) => c.lat));
    const minLng = Math.min(...coordinates.map((c) => c.lng));
    const maxLng = Math.max(...coordinates.map((c) => c.lng));

    const latSpan = maxLat - minLat || 0.005;
    const lngSpan = maxLng - minLng || 0.005;

    const pad = 35;
    const width = 350 - pad * 2;
    const height = 260 - pad * 2;

    const points = coordinates.map((pt) => {
      const x = pad + ((pt.lng - minLng) / lngSpan) * width;
      const y = 260 - (pad + ((pt.lat - minLat) / latSpan) * height);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const lastPoint = coordinates && coordinates.length > 0 ? coordinates[coordinates.length - 1] : null;

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 shadow-inner select-none transition-all duration-300 ${
        mapStyle === 'night' ? 'bg-slate-900' : mapStyle === 'satellite' ? 'bg-[#293d31]' : 'bg-[#e9ecef]'
      }`}
    >
      <svg
        className="w-full h-full object-cover transition-transform duration-300"
        viewBox="0 0 350 260"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          {/* Pattern for city park greenery */}
          <pattern id="parkPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={mapStyle === 'night' ? '#14251b' : '#DCFCE7'} />
            <circle cx="5" cy="5" r="2" fill={mapStyle === 'night' ? '#1d3627' : '#BBF7D0'} />
            <circle cx="15" cy="15" r="2.5" fill={mapStyle === 'night' ? '#1d3627' : '#BBF7D0'} />
          </pattern>
        </defs>

        {/* Base Map Canvas Fill */}
        <rect
          width="100%"
          height="100%"
          fill={mapStyle === 'night' ? '#0f172a' : mapStyle === 'satellite' ? '#1e2922' : '#e9ecef'}
        />

        {/* Cambodian River (Tonle Sap / Mekong inspired meandering water body) */}
        <path
          d="M 230 -20 C 250 50 265 110 320 160 C 355 190 365 240 370 280 L 400 280 L 400 -20 Z"
          fill={mapStyle === 'night' ? '#0c4a6e' : mapStyle === 'satellite' ? '#164e63' : '#BAE6FD'}
        />

        {/* Urban Parks */}
        <rect
          x="10"
          y="150"
          width="85"
          height="80"
          rx="12"
          fill="url(#parkPattern)"
          stroke={mapStyle === 'night' ? '#1e293b' : '#bbf7d0'}
          strokeWidth="1"
        />
        <text
          x="30"
          y="195"
          fill={mapStyle === 'night' ? '#86efac' : '#166534'}
          fontSize="9"
          fontWeight="bold"
          opacity="0.8"
        >
          សួនច្បារ
        </text>

        {/* Road Grid Lines */}
        <g stroke={mapStyle === 'night' ? '#334155' : '#ffffff'} strokeLinecap="round">
          <line x1="0" y1="50" x2="350" y2="50" strokeWidth="8" />
          <line x1="0" y1="135" x2="350" y2="135" strokeWidth="6" />
          <line x1="0" y1="220" x2="350" y2="220" strokeWidth="7" />
          <line x1="85" y1="0" x2="85" y2="300" strokeWidth="7" />
          <line x1="195" y1="0" x2="195" y2="300" strokeWidth="8" />
          <line x1="285" y1="0" x2="285" y2="300" strokeWidth="5" />
          <line x1="25" y1="0" x2="310" y2="270" strokeWidth="5" />
        </g>

        {/* Road Centerline Dash for main boulevard */}
        <line
          x1="0"
          y1="50"
          x2="350"
          y2="50"
          stroke={mapStyle === 'night' ? '#64748b' : '#cbd5e1'}
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <line
          x1="195"
          y1="0"
          x2="195"
          y2="300"
          stroke={mapStyle === 'night' ? '#64748b' : '#cbd5e1'}
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />

        {/* Traffic overlay simulation if enabled */}
        {showTraffic && (
          <g opacity="0.6">
            <line x1="0" y1="50" x2="160" y2="50" stroke="#22c55e" strokeWidth="3" />
            <line x1="160" y1="50" x2="280" y2="50" stroke="#eab308" strokeWidth="3" />
            <line x1="195" y1="40" x2="195" y2="180" stroke="#ef4444" strokeWidth="3" />
          </g>
        )}

        {/* GPS Tracked Polyline Route */}
        <path
          d={getPathData()}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Inner glow line */}
        <path
          d={getPathData()}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Start Point Marker (Blue with Halo) */}
        <circle cx="60" cy="210" r="10" fill="#2563EB" opacity="0.25" />
        <circle cx="60" cy="210" r="5" fill="#2563EB" stroke="#ffffff" strokeWidth="1.5" />
        <text x="50" y="228" fill="#1e3a8a" fontSize="8" fontWeight="bold">
          Start / ចាប់ផ្ដើម
        </text>

        {/* Kilometre split tags */}
        <g fontSize="7" fontWeight="bold">
          <circle cx="125" cy="138" r="7" fill="#ffffff" stroke="#2563EB" strokeWidth="1.2" />
          <text x="123" y="141" fill="#1e3a8a">1</text>

          <circle cx="172" cy="88" r="7" fill="#ffffff" stroke="#2563EB" strokeWidth="1.2" />
          <text x="170" y="91" fill="#1e3a8a">2</text>
        </g>

        {/* Current Active GPS Position (Pulsing halo & runner indicator) */}
        <g>
          {/* Animated radar rings */}
          <circle cx="230" cy="45" r="18" fill={getPulsingColor()} opacity="0.15">
            <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="45" r="10" fill={getPulsingColor()} opacity="0.3" />
          <circle cx="230" cy="45" r="6" fill={getPulsingColor()} stroke="#ffffff" strokeWidth="2" />

          {/* Tooltip / Pin marker */}
          <rect x="202" y="16" width="56" height="18" rx="6" fill="#0f172a" opacity="0.9" />
          <text x="230" y="28" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
            {isLive ? 'Live GPS' : '2.36 km'}
          </text>
        </g>
      </svg>

      {/* Floating Map Controls */}
      {showControls && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.25, 2))}
            aria-label="Zoom in"
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.8))}
            aria-label="Zoom out"
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMapStyle((curr) => (curr === 'streets' ? 'satellite' : curr === 'satellite' ? 'night' : 'streets'));
            }}
            title="Toggle Map Style"
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              if (onRecenter) onRecenter();
            }}
            title="Recenter"
            className="w-8 h-8 rounded-full bg-white/95 text-blue-600 shadow-md flex items-center justify-center hover:bg-slate-100 active:scale-95 transition"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Map Legend badge */}
      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 border border-slate-200">
        <Navigation className="w-3 h-3 text-blue-600" />
        <span>ភ្នំពេញ · Phnom Penh Riverside</span>
      </div>
    </div>
  );
};
