import { facilityWorkload } from "@/lib/mock/dashboard";
import type { FacilityWorkload } from "@/lib/mock/dashboard";
import { delay } from "../utils/mock-delay";

export type { FacilityWorkload };

export async function getFacilityWorkload(): Promise<FacilityWorkload[]> {
  await delay();
  return facilityWorkload;
}