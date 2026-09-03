import type { Patient } from "@/dto/patient/Patient";
import type { Consultation } from "@/dto/consultation/Consultation";
import type { DiagnosticReport } from "@/dto/diagnostics/DiagnosticReport";
import type { Referral } from "@/dto/referral/Referral";
import type { Condition } from "./Condition";
import type { MedicationHistory } from "./MedicationHistory";
import type { VitalsTrendEntry } from "./VitalsTrendEntry";

export interface HealthRecordResponse {
  patient: Patient;
  conditions: Condition[];
  medications: MedicationHistory[];
  consultations: Consultation[];
  diagnostics: DiagnosticReport[];
  referrals: Referral[];
  vitalsTrend: VitalsTrendEntry[];
}
