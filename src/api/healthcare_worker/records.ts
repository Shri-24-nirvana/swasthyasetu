import { healthRecord } from "@/lib/mock/healthRecord";
import type { HealthRecordResponse } from "@/dto/health-record/HealthRecordResponse";
import { delay } from "../utils/mock-delay";

export async function getLongitudinalRecord(): Promise<HealthRecordResponse> {
  await delay();
  return healthRecord;
}
