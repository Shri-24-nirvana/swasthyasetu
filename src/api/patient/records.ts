import { healthRecord } from "@/lib/mock/healthRecord";
import type { HealthRecordResponse } from "@/dto/health-record/HealthRecordResponse";
import { delay } from "../utils/mock-delay";

export async function getHealthRecord(): Promise<HealthRecordResponse> {
  await delay();
  return healthRecord;
}
