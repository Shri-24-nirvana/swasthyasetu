export interface QueueEntry {
  id: string;
  patientName: string;
  swasthyaId: string;
  facilityId: string;
  department: string;
  acuity: "RED" | "YELLOW" | "GREEN";
  waitMinutes: number;
  status: "WAITING" | "IN_CONSULTATION" | "DONE";
}
