import type { Vitals } from "./Vitals";
import type { Medication } from "./Medication";

export interface CreateConsultationRequest {
  patientId: string;
  facilityId: string;
  doctorName: string;
  vitals: Vitals;
  symptoms: string[];
  chiefComplaint: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  isTeleconsult?: boolean;
}
