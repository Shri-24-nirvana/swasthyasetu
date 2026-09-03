import type { Facility } from "@/dto/facility/Facility";

export interface EmergencyContact {
  name: string;
  number: string;
}

export interface EmergencyInfoResponse {
  nearestFacility: Facility;
  emergencyNumbers: EmergencyContact[];
  ambulanceETA: string;
}
