import type { Triage } from "@/dto/triage/Triage";
import type { CreateTriageRequest } from "@/dto/triage/CreateTriageRequest";
import { delay } from "../utils/mock-delay";

const seedTriage: Triage[] = [
  {
    id: "tr-1",
    patientId: "SWA-9284-1829",
    facilityId: "phc-1",
    assessedBy: "Dr. Anita Rao",
    date: "2026-08-05",
    acuity: "YELLOW",
    chiefComplaint: "Headache and fatigue",
    vitalsScore: 4,
  },
  {
    id: "tr-2",
    patientId: "SWA-5510-3327",
    facilityId: "phc-2",
    assessedBy: "Dr. N. Khan",
    date: "2026-08-20",
    acuity: "RED",
    chiefComplaint: "Fell, suspected fracture",
    vitalsScore: 6,
  },
];

export async function getTriageQueue(facilityId?: string): Promise<Triage[]> {
  await delay();
  if (facilityId) return seedTriage.filter((t) => t.facilityId === facilityId);
  return seedTriage;
}

export async function createTriage(
  input: CreateTriageRequest
): Promise<Triage> {
  await delay();
  return { ...input, id: `tr-${Date.now()}` };
}
