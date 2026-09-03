export interface RegisterPatientRequest {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  village: string;
  district: string;
  bloodGroup: string;
  phone?: string;
  allergies: string[];
  homeFacilityId?: string;
}
