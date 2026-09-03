export interface CreateTriageRequest {
  patientId: string;
  facilityId: string;
  assessedBy: string;
  date: string;
  acuity: "RED" | "YELLOW" | "GREEN";
  chiefComplaint: string;
  vitalsScore: number;
  notes?: string;
}
