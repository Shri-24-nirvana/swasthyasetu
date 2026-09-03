import { healthRecord } from "@/lib/mock/healthRecord";
import type { DiagnosticReportResponse } from "@/dto/diagnostics/DiagnosticReportResponse";
import { delay } from "../utils/mock-delay";

export async function getDiagnosticsTracking(): Promise<DiagnosticReportResponse[]> {
  await delay();
  return healthRecord.diagnostics;
}
