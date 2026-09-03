import { patients } from "@/lib/mock/patients";
import { RiskLevel } from "@/dto/constants/RiskLevel";
import type { Patient } from "@/dto/patient/Patient";
import { delay } from "../utils/mock-delay";

export async function getHighRiskCases(): Promise<Patient[]> {
  await delay();
  return patients.filter((p) => p.riskLevel === RiskLevel.HIGH);
}
