import type { ReferralStatus } from "@/dto/constants/ReferralStatus";

export interface ReferralTimelineEntry {
  status: ReferralStatus;
  at: string;
  by: string;
  note?: string;
}

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
  timeline: ReferralTimelineEntry[];
}
