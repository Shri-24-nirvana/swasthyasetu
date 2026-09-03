export interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: string;
  facilityId: string;
  stockQty: number;
  reorderLevel: number;
  unit: string;
  expiry?: string;
  availability: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}
