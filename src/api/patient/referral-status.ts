import { referralsByPatient } from "@/lib/mock/referrals";
import type { ReferralResponse } from "@/dto/referral/ReferralResponse";
import { delay } from "../utils/mock-delay";

export async function getReferralStatus(patientId: string): Promise<ReferralResponse[]> {
  await delay();
  return referralsByPatient(patientId);
}

export async function getReferralById(id: string): Promise<ReferralResponse | undefined> {
  await delay(200);
  const all = referralsByPatient("SWA-9284-1829");
  return all.find((r) => r.id === id);
}
