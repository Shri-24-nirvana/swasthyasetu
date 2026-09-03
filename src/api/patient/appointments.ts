import { appointments as seedAppointments } from "@/lib/mock/appointments";
import type { Appointment } from "@/dto/appointment/Appointment";
import type { BookAppointmentRequest } from "@/dto/appointment/BookAppointmentRequest";
import { AppointmentStatus } from "@/dto/constants/AppointmentStatus";
import { delay } from "../utils/mock-delay";

let data = [...seedAppointments];

export async function getAppointments(patientId: string): Promise<Appointment[]> {
  await delay();
  return data.filter((a) => a.patientId === patientId);
}

export async function bookAppointment(
  input: BookAppointmentRequest
): Promise<Appointment> {
  await delay();
  const appointment: Appointment = {
    ...input,
    id: `appt-${Date.now()}`,
    status: AppointmentStatus.BOOKED,
  };
  data = [appointment, ...data];
  return appointment;
}

export async function cancelAppointment(id: string): Promise<void> {
  await delay(200);
  data = data.map((a) =>
    a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a
  );
}
