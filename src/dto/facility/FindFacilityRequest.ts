import type { FacilityType } from "@/dto/constants/FacilityType";

export interface FindFacilityRequest {
  query?: string;
  type?: FacilityType;
  lat?: number;
  lon?: number;
  maxDistanceKm?: number;
}
