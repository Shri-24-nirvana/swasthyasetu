import { referralsByPatient } from "@/lib/mock/referrals";
import type { Referral } from "@/dto/Referral";
import { delay } from "../utils/mock-delay";

export async function getReferralStatus(patientId: string): Promise<Referral[]> {
  await delay();
  return referralsByPatient(patientId);
}

export async function getReferralById(id: string): Promise<Referral | undefined> {
  await delay(200);
  return referralsByPatient("SWA-9284-1829").find((r) => r.id === id);
}
