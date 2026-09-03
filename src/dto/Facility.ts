import type { FacilityType } from "./constants/FacilityType";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  village: string;
  lat?: number;
  lon?: number;
  distanceKm?: number;
  availableBeds: number;
  totalBeds: number;
  doctorsAvailable: number;
  specialties: string[];
  hasEmergency: boolean;
  queueSize: number;
  openHours?: string;
}
