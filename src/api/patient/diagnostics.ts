import { healthRecord } from "@/lib/mock/healthRecord";
import type { DiagnosticReport } from "@/dto/DiagnosticReport";
import { delay } from "../utils/mock-delay";

export async function getDiagnosticReports(): Promise<DiagnosticReport[]> {
  await delay();
  return healthRecord.diagnostics;
}
