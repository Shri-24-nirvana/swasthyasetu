import type { Patient } from "./Patient";
import type { Consultation, Medication } from "./Consultation";
import type { DiagnosticReport } from "./DiagnosticReport";
import type { Referral } from "./Referral";

export interface Condition {
  condition: string;
  since: string;
  status: "ACTIVE" | "RESOLVED";
  notes?: string;
}

export interface MedicationHistory extends Medication {
  status: "CURRENT" | "PAST";
}

export interface HealthRecord {
  patient: Patient;
  conditions: Condition[];
  medications: MedicationHistory[];
  consultations: Consultation[];
  diagnostics: DiagnosticReport[];
  referrals: Referral[];
  vitalsTrend: Array<{
    date: string;
    bpSys: number;
    bpDia: number;
    heartRate: number;
    glucose?: number;
    riskLevel: string;
  }>;
}
