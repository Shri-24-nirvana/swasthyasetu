export interface DiagnosticReport {
  id: string;
  patientId: string;
  facilityId: string;
  facilityName: string;
  type: string;
  name: string;
  orderedBy: string;
  date: string;
  status: "PENDING" | "COMPLETED" | "REVIEWED";
  summary?: string;
  keyValues?: Array<{ label: string; value: string; flag?: "NORMAL" | "ABNORMAL" }>;
  fileName?: string;
}
