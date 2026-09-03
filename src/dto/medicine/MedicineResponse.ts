import type { Medicine } from "./Medicine";

export interface MedicineResponse extends Medicine {
  facilityName?: string;
  cost?: number;
}
