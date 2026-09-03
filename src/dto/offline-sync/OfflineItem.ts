export interface OfflineItem {
  id: string;
  type: "CONSULTATION" | "REFERRAL" | "TRIAGE" | "PATIENT";
  patientName: string;
  synced: boolean;
  queuedAt: string;
}
