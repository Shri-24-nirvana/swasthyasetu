import { patients } from "@/lib/mock/patients";
import type { Patient } from "@/dto/Patient";
import { RiskLevel } from "@/dto/constants/RiskLevel";
import { delay } from "../utils/mock-delay";

let data = [...patients];

export async function searchPatients(query?: string): Promise<Patient[]> {
  await delay();
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter(
    (p) =>
      p.swasthyaId.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q)
  );
}

export async function registerPatient(
  input: Omit<Patient, "swasthyaId" | "registeredAt" | "riskLevel">
): Promise<Patient> {
  await delay();
  const patient: Patient = {
    ...input,
    swasthyaId: `SWA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    registeredAt: new Date().toISOString().slice(0, 10),
    riskLevel: RiskLevel.LOW,
  };
  data = [patient, ...data];
  return patient;
}
