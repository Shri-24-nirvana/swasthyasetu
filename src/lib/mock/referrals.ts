import type { Referral } from "@/dto/Referral";
import { ReferralStatus } from "@/dto/constants/ReferralStatus";

export const referrals: Referral[] = [
  {
    id: "REF-2026-001",
    patientId: "SWA-9284-1829",
    fromFacilityId: "chc-1",
    toFacilityId: "dh-1",
    specialty: "Cardiology",
    priority: "URGENT",
    reason: "Uncontrolled hypertension with chest discomfort",
    clinicalNotes: "Patient on amlodipine 10mg; BP persistently >160/100. ECG showed minor ST changes.",
    status: ReferralStatus.COMPLETED,
    createdAt: "2026-04-28",
    updatedAt: "2026-06-10",
    timeline: [
      { status: ReferralStatus.CREATED, at: "2026-04-28", by: "Dr. Rajesh Kumar", note: "Referral created" },
      { status: ReferralStatus.SENT, at: "2026-04-28", by: "CHC Kosi", note: "Sent to District Hospital" },
      { status: ReferralStatus.ACCEPTED, at: "2026-04-29", by: "District Hospital" },
      { status: ReferralStatus.ARRIVED, at: "2026-05-02", by: "Patient" },
      { status: ReferralStatus.COMPLETED, at: "2026-06-10", by: "Dr. S. Iyer", note: "Consultation done" },
    ],
  },
  {
    id: "REF-2026-087",
    patientId: "SWA-9284-1829",
    fromFacilityId: "phc-1",
    toFacilityId: "chc-1",
    specialty: "General Medicine",
    priority: "ROUTINE",
    reason: "Diabetes control review",
    status: ReferralStatus.SENT,
    createdAt: "2026-08-14",
    updatedAt: "2026-08-15",
    timeline: [
      { status: ReferralStatus.CREATED, at: "2026-08-14", by: "Dr. Anita Rao" },
      { status: ReferralStatus.SENT, at: "2026-08-15", by: "Rampur PHC" },
    ],
  },
  {
    id: "REF-2026-129",
    patientId: "SWA-5510-3327",
    fromFacilityId: "phc-2",
    toFacilityId: "dh-1",
    specialty: "Orthopaedics",
    priority: "EMERGENCY",
    reason: "Suspected hip fracture after fall",
    status: ReferralStatus.ACCEPTED,
    createdAt: "2026-08-20",
    updatedAt: "2026-08-21",
    timeline: [
      { status: ReferralStatus.CREATED, at: "2026-08-20", by: "Dr. N. Khan" },
      { status: ReferralStatus.SENT, at: "2026-08-20", by: "Sitapur PHC" },
      { status: ReferralStatus.ACCEPTED, at: "2026-08-21", by: "District Hospital" },
    ],
  },
];

export const referralsByPatient = (patientId: string) =>
  referrals.filter((r) => r.patientId === patientId);

export const allReferrals = referrals;
