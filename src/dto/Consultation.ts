import type { RiskLevel } from "./constants/RiskLevel";

export interface Vitals {
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  temperature: number;
  weight?: number;
  glucose?: number;
  spo2?: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  facilityId: string;
  doctorName: string;
  date: string;
  vitals: Vitals;
  symptoms: string[];
  chiefComplaint: string;
  diagnosis: string;
  medications: Medication[];
  riskLevel: RiskLevel;
  notes?: string;
  isTeleconsult?: boolean;
}
