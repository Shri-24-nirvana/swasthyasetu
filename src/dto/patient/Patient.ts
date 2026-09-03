import type { RiskLevel } from "@/dto/constants/RiskLevel";

export interface Patient {
  swasthyaId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  village: string;
  district: string;
  bloodGroup: string;
  phone?: string;
  riskLevel: RiskLevel;
  allergies: string[];
  registeredAt: string;
  homeFacilityId?: string;
}
