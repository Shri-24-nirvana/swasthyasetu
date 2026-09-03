import { medicines } from "@/lib/mock/medicines";
import type { Medicine } from "@/dto/medicine/Medicine";
import { delay } from "../utils/mock-delay";

export async function getMedicineStock(facilityId?: string): Promise<Medicine[]> {
  await delay();
  if (facilityId) return medicines.filter((m) => m.facilityId === facilityId);
  return medicines;
}

export async function restockMedicine(id: string): Promise<Medicine | undefined> {
  await delay();
  const item = medicines.find((m) => m.id === id);
  if (item) {
    item.stockQty = item.reorderLevel * 3;
    item.availability = "IN_STOCK";
  }
  return item;
}
