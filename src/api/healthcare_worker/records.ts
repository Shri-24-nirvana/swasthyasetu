import { healthRecord } from "@/lib/mock/healthRecord";
import type { HealthRecord } from "@/dto/HealthRecord";
import { delay } from "../utils/mock-delay";

export async function getLongitudinalRecord(): Promise<HealthRecord> {
  await delay();
  return healthRecord;
}
