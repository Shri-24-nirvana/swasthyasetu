import { facilities } from "@/lib/mock/facilities";
import type { Facility } from "@/dto/Facility";
import { delay } from "../utils/mock-delay";

export async function findNearbyFacilities(): Promise<Facility[]> {
  await delay();
  return [...facilities].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export async function getFacilityById(id: string): Promise<Facility | undefined> {
  await delay(200);
  return facilities.find((f) => f.id === id);
}
