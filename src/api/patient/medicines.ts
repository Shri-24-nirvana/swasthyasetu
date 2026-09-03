import { medicineAvailability } from "@/lib/mock/medicines";
import type { MedicineResponse } from "@/dto/medicine/MedicineResponse";
import { delay } from "../utils/mock-delay";

export async function searchMedicineAvailability(
  query?: string,
  facilityId?: string
): Promise<MedicineResponse[]> {
  await delay();
  let result = medicineAvailability;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (m) => m.name.toLowerCase().includes(q) || m.generic.toLowerCase().includes(q)
    );
  }
  if (facilityId) result = result.filter((m) => m.facilityId === facilityId);
  return result;
}
