import { delay } from "../utils/mock-delay";

export interface OfflineItem {
  id: string;
  type: "CONSULTATION" | "REFERRAL" | "TRIAGE" | "PATIENT";
  patientName: string;
  synced: boolean;
  queuedAt: string;
}

const seed: OfflineItem[] = [
  { id: "o-1", type: "CONSULTATION", patientName: "Kavita Joshi", synced: true, queuedAt: "2026-09-02 10:12" },
  { id: "o-2", type: "TRIAGE", patientName: "Mohammed Irfan", synced: false, queuedAt: "2026-09-02 11:45" },
  { id: "o-3", type: "REFERRAL", patientName: "Arjun Singh", synced: false, queuedAt: "2026-09-02 12:03" },
];

export async function getOfflineQueue(): Promise<OfflineItem[]> {
  await delay();
  return seed;
}

export async function syncAll(): Promise<OfflineItem[]> {
  await delay(900);
  seed.forEach((s) => (s.synced = true));
  return seed;
}
