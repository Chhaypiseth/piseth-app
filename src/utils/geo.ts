import { ActivityType, RoutePoint } from '../types.ts';

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateTotalRouteDistance(coordinates: RoutePoint[]): number {
  if (coordinates.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    total += calculateDistanceKm(
      coordinates[i - 1].lat,
      coordinates[i - 1].lng,
      coordinates[i].lat,
      coordinates[i].lng
    );
  }
  return total;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `00:${pad(mins)}:${pad(secs)}`;
}

export function formatPace(durationSeconds: number, distanceKm: number): string {
  if (distanceKm <= 0.05 || durationSeconds <= 0) return "0:00";
  const paceSecondsPerKm = durationSeconds / distanceKm;
  const mins = Math.floor(paceSecondsPerKm / 60);
  const secs = Math.floor(paceSecondsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateCalories(
  type: ActivityType,
  weightKg: number,
  durationSeconds: number,
  distanceKm: number
): number {
  if (durationSeconds <= 0) return 0;
  const durationHours = durationSeconds / 3600;
  const speedKmh = distanceKm > 0 && durationHours > 0 ? distanceKm / durationHours : 0;

  // Metabolic Equivalent of Task (MET)
  let met = 3.5;
  if (type === 'walking') {
    met = speedKmh > 5 ? 4.3 : 3.5;
  } else if (type === 'running') {
    met = speedKmh > 10 ? 10.5 : 8.3;
  } else if (type === 'cycling') {
    met = speedKmh > 20 ? 8.5 : 6.0;
  }

  // Calories = MET * weight in kg * duration in hours
  const calories = Math.round(met * weightKg * durationHours);
  return Math.max(calories, Math.round(distanceKm * 55));
}
