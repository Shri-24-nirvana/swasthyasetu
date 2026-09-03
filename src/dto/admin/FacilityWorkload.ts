export interface FacilityWorkload {
  facilityId: string;
  facilityName: string;
  type: string;
  patientsToday: number;
  consultsDone: number;
  avgWaitMin: number;
  queueSize: number;
}
