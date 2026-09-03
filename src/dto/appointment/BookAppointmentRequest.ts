export interface BookAppointmentRequest {
  patientId: string;
  facilityId: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  reason?: string;
}
