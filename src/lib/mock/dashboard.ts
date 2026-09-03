import type { DashboardStats } from "@/dto/admin/DashboardStats";
import type { QueueEntry } from "@/dto/admin/QueueEntry";
import type { FacilityWorkload } from "@/dto/admin/FacilityWorkload";

export const dashboardStats: DashboardStats = {
  patientsScannedToday: 42,
  activeReferrals: 7,
  highRiskPatients: 18,
  pendingFollowUps: 11,
  appointmentsToday: 24,
  teleconsultsToday: 6,
  queueSize: 62,
  bedOccupancyPct: 58,
  referralCompletionRate: 71,
  avgJourneyDays: 4.5,
};

export const patientQueue: QueueEntry[] = [
  { id: "q1", patientName: "Meera Sharma", swasthyaId: "SWA-9284-1829", facilityId: "dh-1", department: "Cardiology", acuity: "YELLOW", waitMinutes: 12, status: "WAITING" },
  { id: "q2", patientName: "Arjun Singh", swasthyaId: "SWA-5510-3327", facilityId: "dh-1", department: "Orthopaedics", acuity: "RED", waitMinutes: 4, status: "WAITING" },
  { id: "q3", patientName: "Kavita Joshi", swasthyaId: "SWA-7735-4418", facilityId: "dh-1", department: "General", acuity: "GREEN", waitMinutes: 28, status: "WAITING" },
  { id: "q4", patientName: "Mohammed Irfan", swasthyaId: "SWA-2044-5589", facilityId: "dh-1", department: "General", acuity: "YELLOW", waitMinutes: 9, status: "IN_CONSULTATION" },
];

export const facilityWorkload: FacilityWorkload[] = [
  { facilityId: "sub-1", facilityName: "Dhanwantri Sub-Centre", type: "Sub-Centre", patientsToday: 31, consultsDone: 28, avgWaitMin: 8, queueSize: 3 },
  { facilityId: "phc-1", facilityName: "Rampur PHC", type: "PHC", patientsToday: 94, consultsDone: 80, avgWaitMin: 21, queueSize: 14 },
  { facilityId: "chc-1", facilityName: "Kosi CHC", type: "CHC", patientsToday: 158, consultsDone: 131, avgWaitMin: 27, queueSize: 27 },
  { facilityId: "dh-1", facilityName: "District Hospital, Kosi", type: "District Hospital", patientsToday: 342, consultsDone: 280, avgWaitMin: 44, queueSize: 62 },
];
