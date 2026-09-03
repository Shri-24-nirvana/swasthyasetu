import { patientQueue } from "@/lib/mock/dashboard";
import type { QueueEntry } from "@/dto/admin/QueueEntry";
import { delay } from "../utils/mock-delay";

export async function getPatientQueue(facilityId?: string): Promise<QueueEntry[]> {
  await delay();
  if (facilityId) return patientQueue.filter((q) => q.facilityId === facilityId);
  return patientQueue;
}
