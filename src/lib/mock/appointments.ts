import type { Appointment } from "@/dto/Appointment";
import { AppointmentStatus } from "@/dto/constants/AppointmentStatus";

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    patientId: "SWA-9284-1829",
    facilityId: "phc-1",
    doctorName: "Dr. Anita Rao",
    date: "2026-09-03",
    time: "10:30",
    department: "General Medicine",
    status: AppointmentStatus.BOOKED,
    reason: "Routine BP check",
  },
  {
    id: "appt-2",
    patientId: "SWA-9284-1829",
    facilityId: "chc-1",
    doctorName: "Dr. Rajesh Kumar",
    date: "2026-08-05",
    time: "09:00",
    department: "General Medicine",
    status: AppointmentStatus.COMPLETED,
    reason: "Follow-up hypertension",
  },
  {
    id: "appt-3",
    patientId: "SWA-9284-1829",
    facilityId: "dh-1",
    doctorName: "Dr. S. Iyer",
    date: "2026-06-10",
    time: "11:00",
    department: "Cardiology",
    status: AppointmentStatus.COMPLETED,
    reason: "Cardiology review",
  },
];
