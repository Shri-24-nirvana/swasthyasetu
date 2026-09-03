import type { Medication } from "@/dto/consultation/Medication";

export interface MedicationHistory extends Medication {
  status: "CURRENT" | "PAST";
}
