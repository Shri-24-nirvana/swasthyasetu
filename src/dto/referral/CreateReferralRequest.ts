export interface CreateReferralRequest {
  patientId: string;
  fromFacilityId: string;
  toFacilityId: string;
  specialty: string;
  priority: "EMERGENCY" | "URGENT" | "ROUTINE";
  reason: string;
  clinicalNotes?: string;
}
