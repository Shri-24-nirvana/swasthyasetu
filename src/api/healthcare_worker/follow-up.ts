import type { FollowUp } from "@/dto/follow-up/FollowUp";
import { delay } from "../utils/mock-delay";

const seed: FollowUp[] = [
  { id: "fu-1", patientId: "SWA-9284-1829", patientName: "Meera Sharma", dueDate: "2026-09-10", reason: "BP & glucose review", status: "SCHEDULED", specialty: "General Medicine" },
  { id: "fu-2", patientId: "SWA-5510-3327", patientName: "Arjun Singh", dueDate: "2026-08-30", reason: "Post-op review", status: "OVERDUE", specialty: "Orthopaedics" },
  { id: "fu-3", patientId: "SWA-2044-5589", patientName: "Mohammed Irfan", dueDate: "2026-09-05", reason: "TB treatment follow-up", status: "DUE", specialty: "Pulmonology" },
];

export async function getFollowUps(): Promise<FollowUp[]> {
  await delay();
  return seed;
}

export async function completeFollowUp(id: string): Promise<void> {
  await delay(200);
  const item = seed.find((f) => f.id === id);
  if (item) item.status = "COMPLETED";
}
