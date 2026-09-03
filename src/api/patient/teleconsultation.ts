import type { TeleconsultSlot } from "@/dto/teleconsultation/TeleconsultSlot";
import { delay } from "../utils/mock-delay";

const slots: TeleconsultSlot[] = [
  { id: "tc-1", doctorName: "Dr. Anita Rao", specialty: "General Medicine", facilityId: "phc-1", date: "2026-09-03", time: "11:00", available: true },
  { id: "tc-2", doctorName: "Dr. Rajesh Kumar", specialty: "General Medicine", facilityId: "chc-1", date: "2026-09-03", time: "14:30", available: true },
  { id: "tc-3", doctorName: "Dr. S. Iyer", specialty: "Cardiology", facilityId: "dh-1", date: "2026-09-04", time: "10:00", available: false },
  { id: "tc-4", doctorName: "Dr. N. Khan", specialty: "Orthopaedics", facilityId: "dh-1", date: "2026-09-04", time: "15:00", available: true },
];

export async function getTeleconsultSlots(specialty?: string): Promise<TeleconsultSlot[]> {
  await delay();
  if (specialty) return slots.filter((s) => s.specialty === specialty);
  return slots;
}

export async function bookTeleconsult(slotId: string): Promise<TeleconsultSlot> {
  await delay();
  const slot = slots.find((s) => s.id === slotId)!;
  slot.available = false;
  return slot;
}
