import type { RiskLevel } from "@/dto/constants/RiskLevel";
import type { Vitals } from "./Vitals";
import type { Medication } from "./Medication";

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
