export interface DashboardStats {
  patientsScannedToday: number;
  activeReferrals: number;
  highRiskPatients: number;
  pendingFollowUps: number;
  appointmentsToday: number;
  teleconsultsToday: number;
  queueSize: number;
  bedOccupancyPct: number;
  referralCompletionRate: number;
  avgJourneyDays: number;
}
