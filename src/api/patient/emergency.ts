import { facilities } from "@/lib/mock/facilities";
import type { Facility } from "@/dto/Facility";
import { delay } from "../utils/mock-delay";

export interface EmergencyInfo {
  nearestFacility: Facility;
  emergencyNumbers: Array<{ name: string; number: string }>;
  ambulanceETA: string;
}

export async function getEmergencyAssistance(): Promise<EmergencyInfo> {
  await delay(300);
  const sorted = [...facilities].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return {
    nearestFacility: sorted[0],
    emergencyNumbers: [
      { name: "National Ambulance", number: "108" },
      { name: "Emergency / Police", number: "112" },
      { name: "District Hospital Helpline", number: "1800-345-6789" },
    ],
    ambulanceETA: "9 minutes",
  };
}
