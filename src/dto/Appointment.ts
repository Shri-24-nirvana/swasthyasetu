import type { AppointmentStatus } from "./constants/AppointmentStatus";

export interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  status: AppointmentStatus;
  reason?: string;
}
