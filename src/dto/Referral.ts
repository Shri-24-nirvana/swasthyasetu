import type { ReferralStatus } from "./constants/ReferralStatus";

export interface Referral {
  id: string;
  patientId: string;
  fromFacilityId: string;
  toFacilityId: string;
  specialty: string;
  priority: "EMERGENCY" | "URGENT" | "ROUTINE";
  reason: string;
  clinicalNotes?: string;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    status: ReferralStatus;
    at: string;
    by: string;
    note?: string;
  }>;
}
