export type ActivityType = 'walking' | 'running' | 'cycling';

export interface RoutePoint {
  lat: number;
  lng: number;
  time?: number;
  elevation?: number;
}

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  titleEn: string;
  titleKm: string;
  date: string; // e.g. "2025-04-24" or human formatted
  formattedDate: string;
  timeRange: string; // e.g. "06:30 - 06:48"
  durationSeconds: number;
  distanceKm: number;
  avgPace: string; // e.g. "7:48 /km"
  avgPaceSeconds: number;
  calories: number;
  routeCoordinates: RoutePoint[];
  locationName: string;
  locationNameKm: string;
  notes?: string;
  feeling?: 'great' | 'good' | 'tired' | 'hard';
  elevationGainMeters?: number;
  cadenceAvg?: number; // steps/min for running/walking or rpm for cycling
}

export interface WorkoutRoutePreset {
  id: string;
  titleEn: string;
  titleKm: string;
  city: string;
  cityKm: string;
  distanceKm: number;
  recommendedType: ActivityType;
  descriptionEn: string;
  descriptionKm: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  difficultyKm: 'ងាយស្រួល' | 'មធ្យម' | 'ពិបាក';
  elevationGain: number;
  coordinates: RoutePoint[];
}

export interface UserSettings {
  primaryLanguage: 'bilingual' | 'km' | 'en';
  voiceCues: boolean;
  voiceLanguage: 'km' | 'en';
  unitSystem: 'metric' | 'imperial';
  userWeightKg: number;
  trackingMode: 'simulation' | 'gps';
  autoPause: boolean;
}
