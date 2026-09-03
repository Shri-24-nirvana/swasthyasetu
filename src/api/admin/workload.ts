import { facilityWorkload } from "@/lib/mock/dashboard";
import type { FacilityWorkload } from "@/dto/admin/FacilityWorkload";
import { delay } from "../utils/mock-delay";

export async function getFacilityWorkload(): Promise<FacilityWorkload[]> {
  await delay();
  return facilityWorkload;
}
