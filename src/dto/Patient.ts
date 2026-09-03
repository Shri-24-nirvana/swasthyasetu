import type { RiskLevel } from "./constants/RiskLevel";
import type { Facility } from "./Facility";

export interface Patient {
  swasthyaId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  village: string;
  district: string;
  bloodGroup: string;
  phone?: string;
  riskLevel: RiskLevel;
  allergies: string[];
  registeredAt: string;
  homeFacilityId?: string;
}

export interface PatientSummary extends Patient {
  facility?: Facility;
  lastVisit?: string;
  activeReferral?: boolean;
}
